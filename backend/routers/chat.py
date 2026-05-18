from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.claude import chat_stream
from services.context import build_rep_context, SYSTEM_PROMPT_CHAT

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    rep_id: str = "REP_0001"


@router.post("/stream")
def chat_stream_endpoint(req: ChatRequest):
    context = build_rep_context(req.rep_id)
    system = SYSTEM_PROMPT_CHAT + f"\n\n{context}"

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
    context = build_rep_context(req.rep_id)
    system = SYSTEM_PROMPT_CHAT + f"\n\n{context}"
    msgs = [{"role": m.role, "content": m.content} for m in req.messages]
    # Collect full stream
    chunks = list(chat_stream(system, msgs))
    return {"response": "".join(chunks)}
