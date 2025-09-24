from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class User(BaseModel):
    id: int
    username: str

fake_users_db = []

@router.get("/", response_model=List[User])
def get_users():
    return fake_users_db

@router.post("/", response_model=User)
def create_user(user: User):
    fake_users_db.append(user)
    return user

