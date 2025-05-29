# app/schemas/project_schema.py

from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field, field_validator
from .common import ProjectStatus, PriorityLevel
from .common_schemas import TaskSummary
import pytz
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class ProjectBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = Field(None, pattern="^(activo|en_pausa|terminado)$")
    priority: Optional[str] = Field(None, pattern="^(alta|media|baja)$")
    category: Optional[str] = None
    deadline: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator('deadline')
    def validate_deadline(cls, v):
        logger.debug(f"Validando deadline. Valor recibido: {v}, Tipo: {type(v)}")
        if v is not None:
            try:
                if isinstance(v, str):
                    logger.debug(f"Convirtiendo string a datetime: {v}")
                    v = datetime.fromisoformat(v.replace('Z', '+00:00'))
                    logger.debug(f"Resultado después de fromisoformat: {v}")
                if v.tzinfo is None:
                    logger.debug("Fecha sin zona horaria, añadiendo UTC")
                    v = pytz.UTC.localize(v)
                v = v.astimezone(pytz.UTC)
                today = date.today()
                logger.debug(f"Comparando con hoy ({today})")
                if v.date() < today:
                    logger.debug("Fecha en el pasado")
                    raise ValueError("La fecha límite no puede estar en el pasado")
                logger.debug(f"Validación exitosa, retornando: {v}")
                return v
            except Exception as e:
                logger.error(f"Error validando fecha: {str(e)}")
                raise ValueError(f"Error procesando la fecha: {str(e)}")
        return None

    @field_validator('status')
    def validate_status(cls, v):
        if v is not None:
            v = v.lower()
            if v not in ['activo', 'en_pausa', 'terminado']:
                raise ValueError("El estado debe ser 'activo', 'en_pausa' o 'terminado'")
        return v

    @field_validator('priority')
    def validate_priority(cls, v):
        if v is not None:
            v = v.lower()
            if v not in ['alta', 'media', 'baja']:
                raise ValueError("La prioridad debe ser 'alta', 'media' o 'baja'")
        return v

class ProjectCreate(ProjectUpdate):
    title: str = Field(..., min_length=1, max_length=100)
    status: str = Field(..., pattern="^(activo|en_pausa|terminado)$")

class ProjectOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    priority: Optional[PriorityLevel] = None
    category: Optional[str] = None
    deadline: Optional[datetime] = None
    status: ProjectStatus = "activo"
    created_at: datetime
    updated_at: datetime
    tasks: List[TaskSummary] = []

    model_config = ConfigDict(from_attributes=True)

class Project(ProjectCreate):
    id: int
    created_at: datetime
    updated_at: datetime
    tasks: List[TaskSummary] = []

    model_config = ConfigDict(from_attributes=True)
