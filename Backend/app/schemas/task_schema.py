from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from .common import TaskStatus, PriorityLevel
from .common_schemas import ProjectSummary

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: str = Field(..., pattern="^(pendiente|en_progreso|completada)$")
    priority: str = Field(..., pattern="^(alta|media|baja)$")
    due_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class TaskCreate(TaskBase):
    @field_validator('due_date', mode='before')
    def validate_due_date(cls, v):
        if v is not None:
            if isinstance(v, str):
                try:
                    v = datetime.fromisoformat(v)
                except Exception as e:
                    raise ValueError(f"Formato de fecha inválido: {e}")
            elif not isinstance(v, datetime):
                raise ValueError(f"due_date debe ser string o datetime, no {type(v)}")
            if v.tzinfo is None:
                v = v.replace(tzinfo=timezone.utc)
            current_date = datetime.now(timezone.utc).date()
            target_date = v.date()
            if target_date < current_date:
                raise ValueError("La fecha límite no puede estar en el pasado (día anterior)")
        return v

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = Field(None, pattern="^(pendiente|en_progreso|completada)$")
    priority: Optional[str] = Field(None, pattern="^(alta|media|baja)$")
    due_date: Optional[datetime] = None

    @field_validator('due_date', mode='before')
    def validate_due_date(cls, v):
        if v is not None:
            if isinstance(v, str):
                try:
                    v = datetime.fromisoformat(v)
                except Exception as e:
                    raise ValueError(f"Formato de fecha inválido: {e}")
            elif not isinstance(v, datetime):
                raise ValueError(f"due_date debe ser string o datetime, no {type(v)}")
            if v.tzinfo is None:
                v = v.replace(tzinfo=timezone.utc)
            current_date = datetime.now(timezone.utc).date()
            target_date = v.date()
            if target_date < current_date:
                raise ValueError("La fecha límite no puede estar en el pasado (día anterior)")
        return v

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: TaskStatus
    priority: PriorityLevel
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    project: Optional[ProjectSummary] = None

    model_config = ConfigDict(from_attributes=True)
