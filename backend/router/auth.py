from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/auth")

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    role: str
    rep_id: str | None = None
    name: str

DEMO_CREDS = {
    'arjun': {'password': 'agropilot2026', 'role': 'rep', 'name': 'Arjun', 'rep_id': 'REP_0001'},
    'manager': {'password': 'agropilot2026', 'role': 'manager', 'name': 'Priya (Manager)', 'rep_id': None},
}

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    user_info = DEMO_CREDS.get(request.username)
    if not user_info or user_info['password'] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    return LoginResponse(
        token=f"dummy-token-{request.username}",
        role=user_info['role'],
        rep_id=user_info['rep_id'],
        name=user_info['name']
    )
