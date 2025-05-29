# app/schemas/common_schemas.py

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class TaskSummary(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProjectSummary(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    deadline: Optional[datetime] = None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
