import os
from pydantic_settings import BaseSettings
from functools import lru_cache

_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Settings(BaseSettings):
    groq_api_key: str = ""
    chat_model: str = "llama-3.3-70b-versatile"
    vision_model: str = "meta-llama/llama-4-scout-17b-16e-instruct"
    jwt_secret: str = "dev-secret-change-in-prod"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    frontend_url: str = "http://localhost:5173"
    csv_dir: str = os.path.join(_REPO_ROOT, "data") + os.sep
    port: int = 8000

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
