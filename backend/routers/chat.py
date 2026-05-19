from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.claude import chat_stream
from services.context import build_rep_context, SYSTEM_PROMPT_CHAT
from services.rag import query_rag
from services.graphrag_queries import get_graph_context_for_chat

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    rep_id: str = "REP_0001"


def _build_system(req: ChatRequest) -> str:
    """
    Build system prompt = base + territory context + vector RAG + graph RAG.
    Graph RAG (Neo4j) runs in parallel with vector RAG — both contribute
    retrieved context. Graph RAG is silently skipped if Neo4j is unavailable.
    """
    territory_context = build_rep_context(req.rep_id)
    last_user_msg = next(
        (m.content for m in reversed(req.messages) if m.role == 'user'), ''
    )
    rag_chunks = query_rag(last_user_msg, n=6) if last_user_msg else ''
    graph_context = get_graph_context_for_chat(req.rep_id)

    parts = [SYSTEM_PROMPT_CHAT, territory_context]
    if rag_chunks:
        parts.append(
            '=== RETRIEVED KNOWLEDGE (vector RAG — semantic similarity) ===\n'
            + rag_chunks
        )
    if graph_context:
        parts.append(graph_context)
    return '\n\n'.join(parts)


@router.post("/stream")
def chat_stream_endpoint(req: ChatRequest):
    system = _build_system(req)
    msgs = [{"role": m.role, "content": m.content} for m in req.messages]

    def generate():
        for chunk in chat_stream(system, msgs):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
    })


@router.post("")
def chat_endpoint(req: ChatRequest):
    system = _build_system(req)
    msgs = [{"role": m.role, "content": m.content} for m in req.messages]
    chunks = list(chat_stream(system, msgs))
    return {"response": "".join(chunks)}
