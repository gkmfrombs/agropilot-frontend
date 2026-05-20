"""
AI wrapper — uses Groq (OpenAI-compatible) with Llama models.
Chat: llama-3.3-70b-versatile
Vision: meta-llama/llama-4-scout-17b-16e-instruct
"""
from groq import Groq
from config import get_settings

settings = get_settings()
_client: Groq | None = None


def get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.groq_api_key)
    return _client


def chat(system: str, messages: list[dict], max_tokens: int = 1024) -> str:
    client = get_client()
    all_messages = [{"role": "system", "content": system}] + messages
    response = client.chat.completions.create(
        model=settings.chat_model,
        messages=all_messages,
        max_tokens=max_tokens,
        temperature=0.4,
    )
    return response.choices[0].message.content or ""


def chat_stream(system: str, messages: list[dict], max_tokens: int = 1024):
    """Yields text chunks for SSE streaming."""
    client = get_client()
    # Keep only last 6 messages to avoid token overflow on free-tier Groq
    trimmed = messages[-6:] if len(messages) > 6 else messages
    all_messages = [{"role": "system", "content": system}] + trimmed
    try:
        stream = client.chat.completions.create(
            model=settings.chat_model,
            messages=all_messages,
            max_tokens=max_tokens,
            temperature=0.4,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta
            if delta and delta.content:
                yield delta.content
    except Exception as e:
        yield f"Sorry, I hit a limit. Please try again in a moment. ({type(e).__name__})"


def vision_chat(system: str, image_b64: str, prompt: str, media_type: str = "image/jpeg") -> str:
    """Uses Llama 4 Scout vision via Groq for crop image diagnosis."""
    client = get_client()
    response = client.chat.completions.create(
        model=settings.vision_model,
        messages=[
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{media_type};base64,{image_b64}",
                        },
                    },
                    {"type": "text", "text": prompt},
                ],
            },
        ],
        max_tokens=1024,
        temperature=0.2,
    )
    return response.choices[0].message.content or ""
