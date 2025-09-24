from fastapi import APIRouter
from .endpoints import tasks, users

router = APIRouter()
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

