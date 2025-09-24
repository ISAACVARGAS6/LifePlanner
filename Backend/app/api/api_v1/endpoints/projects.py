from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class Task(BaseModel):
    id: int
    title: str
    description: Optional[str] = None

class Project(BaseModel):
    title: str
    description: Optional[str] = None
    tasks: List[Task] = []

projects: List[Project] = []

@router.post("/")
def create_project(project: Project):
    projects.append(project)
    return project

@router.get("/")
def get_projects():
    return projects
