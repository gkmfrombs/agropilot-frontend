import logging
import asyncio
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

# Import the compiled LangGraph agent
from agent import agri_agent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api")

# ==========================================
# FASTAPI ENDPOINTS & MODELS
# ==========================================

# Data Validation Models
class ChatRequest(BaseModel):
    question: str = Field(..., min_length=2, example="Which retailers in Patna have low stock?")

class ChatResponse(BaseModel):
    question: str
    ai_response: str
    status: str

class ChatMessageItem(BaseModel):
    role: str
    content: str

class ChatStreamRequest(BaseModel):
    messages: list[ChatMessageItem]
    rep_id: str | None = None

@router.get("/health")
async def health_check():
    """Endpoint for Vercel/Servers to check if the API is alive."""
    return {"status": "healthy", "database": "connected"}

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Primary entry point for the React Frontend."""
    logger.info(f"Incoming Request: {request.question}")
    
    try:
        # Pass the input to LangGraph
        final_state = agri_agent.invoke({
            "question": request.question, 
            "response": "", 
            "error": False
        })
        
        # Check if the LangGraph agent encountered an internal error
        if final_state.get("error"):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
                detail="The AI Agent encountered an error processing your request."
            )
            
        return ChatResponse(
            question=request.question,
            ai_response=final_state["response"],
            status="success"
        )
        
    except HTTPException as http_exc:
        # Re-raise explicit HTTP exceptions
        raise http_exc
    except Exception as e:
        # Catch unexpected fatal errors
        logger.critical(f"Fatal server error during chat request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected system error occurred."
        )

@router.post("/chat/stream")
async def chat_stream_endpoint(request: ChatStreamRequest):
    """Streaming entry point for the React Frontend AIConsultant chat."""
    # Extract the last user message
    user_messages = [m.content for m in request.messages if m.role == 'user']
    if not user_messages:
        raise HTTPException(status_code=400, detail="No user message provided")
    
    question = user_messages[-1]
    logger.info(f"Incoming Stream Request: {question}")

    # Process the request using LangGraph synchronously
    # We will simulate a stream of the response so the frontend typewriter works
    try:
        final_state = agri_agent.invoke({
            "question": question, 
            "response": "", 
            "error": False
        })
        
        response_text = final_state.get("response", "Sorry, I couldn't process that.")
        error = final_state.get("error", False)
        
        async def event_stream():
            if error:
                yield f"data: {response_text}\n\n"
            else:
                # Stream the response chunk by chunk
                chunk_size = 5
                for i in range(0, len(response_text), chunk_size):
                    chunk = response_text[i:i+chunk_size]
                    yield f"data: {chunk}\n\n"
                    await asyncio.sleep(0.01) # Simulate generation delay
                    
            yield "data: [DONE]\n\n"
            
        return StreamingResponse(event_stream(), media_type="text/event-stream")
        
    except Exception as e:
        logger.error(f"Stream error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

