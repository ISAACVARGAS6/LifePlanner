# app/api/api_v1/endpoints/tasks.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class TaskSchema(BaseModel):
    id: int
    title: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

# Lista en memoria solo para pruebas
tasks: List[TaskSchema] = []

@router.get("/", response_model=List[TaskSchema])
def get_tasks():
    return tasks

@router.post("/", response_model=TaskSchema)
def create_task(task: TaskSchema):
    tasks.append(task)
    return task
