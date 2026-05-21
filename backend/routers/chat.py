from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.claude import chat_stream
from services.context import build_rep_context, SYSTEM_PROMPT_CHAT
from services.graphrag_queries import get_graph_context_for_chat
from services.structured_responses import detect_intent, build_structured_response
from config import get_settings

router = APIRouter(prefix="/api/chat", tags=["chat"])

_SSE_HEADERS = {
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no",
}


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    rep_id: str = "REP_0001"


def _build_system(req: ChatRequest) -> str:
    territory_context = build_rep_context(req.rep_id)
    last_user_msg = next(
        (m.content for m in reversed(req.messages) if m.role == 'user'), ''
    )
    rag_chunks = ''
    if get_settings().enable_rag and last_user_msg:
        from services.rag import query_rag
        try:
            rag_chunks = query_rag(last_user_msg, n=6)
        except Exception:
            rag_chunks = ''
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
    last_msg = next(
        (m.content for m in reversed(req.messages) if m.role == 'user'), ''
    )
    intent = detect_intent(last_msg)

    # Structured intents: build from real data, no LLM needed.
    # Newlines encoded as \\n so SSE event boundary (\n\n) is never broken.
    if intent != 'llm':
        text = build_structured_response(intent, req.rep_id)
        encoded = text.replace('\n', '\\n')

        def generate_structured():
            yield f"data: {encoded}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            generate_structured(),
            media_type="text/event-stream",
            headers=_SSE_HEADERS,
        )

    # Freeform queries (disease diagnosis, general advice, chitchat) → LLM
    system = _build_system(req)
    msgs = [{"role": m.role, "content": m.content} for m in req.messages]

    def generate():
        for chunk in chat_stream(system, msgs):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers=_SSE_HEADERS,
    )


@router.post("")
def chat_endpoint(req: ChatRequest):
    system = _build_system(req)
    msgs = [{"role": m.role, "content": m.content} for m in req.messages]
    chunks = list(chat_stream(system, msgs))
    return {"response": "".join(chunks)}
