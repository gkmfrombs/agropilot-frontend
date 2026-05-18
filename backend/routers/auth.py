from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
from config import get_settings

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

# Demo credentials — hackathon only
DEMO_USERS = {
    "arjun": {"password": "agropilot2026", "role": "rep", "rep_id": "REP_0001", "name": "Arjun Mehta"},
    "manager": {"password": "agropilot2026", "role": "manager", "rep_id": None, "name": "Priya Sharma"},
}


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    role: str
    rep_id: str | None
    name: str


def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    user = DEMO_USERS.get(req.username.lower())
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": req.username, "role": user["role"], "rep_id": user["rep_id"]})
    return LoginResponse(token=token, role=user["role"], rep_id=user["rep_id"], name=user["name"])
