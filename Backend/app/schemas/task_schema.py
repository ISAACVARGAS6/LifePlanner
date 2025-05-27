from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from .common import TaskStatus, PriorityLevel

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: str = Field(..., pattern="^(pendiente|en_progreso|completada)$")
    priority: str = Field(..., pattern="^(alta|media|baja)$")
    due_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator('due_date')
    def validate_due_date(cls, v):
        if v is not None:
            if isinstance(v, str):
                try:
                    v = datetime.fromisoformat(v)
                except Exception as e:
                    raise ValueError(f"Formato de fecha inválido: {e}")
        elif not isinstance(v, datetime):
            raise ValueError(f"due_date debe ser string o datetime, no {type(v)}")
        
        current = datetime.now(timezone.utc)
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        if v < current:
            raise ValueError("La fecha límite no puede estar en el pasado")
        return v


class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[str] = Field(None, pattern="^(pendiente|en_progreso|completada)$")
    priority: Optional[str] = Field(None, pattern="^(alta|media|baja)$")

class Task(TaskBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TaskOut(BaseModel):
    id: int
    project_id: int
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: Optional[TaskStatus] = "pendiente"
    priority: Optional[PriorityLevel] = None
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "project_id": 1,
                "title": "Tarea Ejemplo",
                "status": "pendiente",
                "priority": "media",
                "created_at": "2023-01-01T00:00:00Z",
                "updated_at": "2023-01-01T00:00:00Z"
            }
        }
