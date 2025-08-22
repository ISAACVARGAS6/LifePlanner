from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, date


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: str = Field(..., pattern="^(pendiente|en_progreso|completada)$")
    priority: str = Field(..., pattern="^(baja|media|alta)$")


class TaskCreate(TaskBase):
    @field_validator("due_date")
    def validate_due_date(cls, value):
        if value is not None:
            # Permitimos tareas para hoy o fechas futuras
            if value.date() < date.today():
                raise ValueError("La fecha límite no puede estar en el pasado")
        return value


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    due_date: Optional[datetime] = None  # Permitimos fechas pasadas al editar
    status: Optional[str] = Field(None, pattern="^(pendiente|en_progreso|completada)$")
    priority: Optional[str] = Field(None, pattern="^(baja|media|alta)$")
    tag: Optional[str] = None

    @field_validator("due_date")
    def validate_due_date_update(cls, value):
        # Al actualizar, permitimos fechas pasadas
        return value


class TaskOut(TaskBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True 

