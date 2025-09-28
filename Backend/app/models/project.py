from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship, validates
from datetime import datetime, timezone
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from ..db import Base
from ..chibi_manager import ChibiManager
import pytz

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=900)
    priority: Optional[Literal["baja", "media", "alta"]] = None
    category: Optional[str] = Field(None, max_length=100)
    deadline: Optional[datetime] = None
    status: Optional[Literal["activo", "en_pausa", "terminado"]] = "activo"

    @field_validator('deadline')
    def validate_deadline(cls, v):
        if v is not None:
            try:
                if isinstance(v, str):
                    # Asegurar que la fecha tenga zona horaria
                    if not any(x in v for x in ['+', '-', 'Z']):
                        v = v + 'Z'
                    elif v.endswith('Z'):
                        v = v[:-1] + '+00:00'
                    
                    deadline_date = datetime.fromisoformat(v.replace('Z', '+00:00'))
                    
                    # Asegurar que ambas fechas estén en UTC para comparación
                    current = datetime.now(pytz.UTC)
                    if deadline_date.tzinfo is None:
                        deadline_date = pytz.UTC.localize(deadline_date)
                    
                    # Comparar solo las fechas, ignorando la hora
                    deadline_date_only = deadline_date.date()
                    current_date_only = current.date()
                    
                    if deadline_date_only < current_date_only:
                        raise ValueError("La fecha límite no puede estar en el pasado")
                    
                    return deadline_date
                return v
            except ValueError as e:
                if "fromisoformat" in str(e):
                    raise ValueError("Formato de fecha inválido")
                raise e
        return v

    @field_validator('title')
    def validate_title_length(cls, v):
        if len(v) > 100:
            raise ValueError("El título no puede tener más de 100 caracteres")
        if len(v) < 1:
            raise ValueError("El título no puede estar vacío")
        return v

    @field_validator('description')
    def validate_description_length(cls, v):
        if v is not None and len(v) > 500:
            raise ValueError("La descripción no puede tener más de 500 caracteres")
        return v

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(500))
    status = Column(String(20), nullable=False, default="activo")
    priority = Column(String(20))
    category = Column(String(100))
    deadline = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones
    user = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")

    @validates('status')
    def validate_status(self, key, status):
        valid_statuses = ["activo", "en_pausa", "terminado"]
        if status not in valid_statuses:
            raise ValueError(f"Estado inválido. Debe ser uno de: {valid_statuses}")
        return status

    @validates('priority')
    def validate_priority(self, key, priority):
        if priority is not None:
            valid_priorities = ["baja", "media", "alta"]
            if priority not in valid_priorities:
                raise ValueError(f"Prioridad inválida. Debe ser uno de: {valid_priorities}")
        return priority

    @validates('title')
    def validate_title(self, key, title):
        if not title or len(title) > 100:
            raise ValueError("El título debe tener entre 1 y 100 caracteres")
        return title

    @validates('description')
    def validate_description(self, key, description):
        if description is not None and len(description) > 500:
            raise ValueError("La descripción no puede tener más de 500 caracteres")
        return description

    @validates('deadline')
    def validate_deadline(self, key, deadline):
        if deadline is not None:
            try:
                if isinstance(deadline, str):
                    # Asegurar que la fecha tenga zona horaria
                    if not any(x in deadline for x in ['+', '-', 'Z']):
                        deadline = deadline + 'Z'
                    elif deadline.endswith('Z'):
                        deadline = deadline[:-1] + '+00:00'
                    
                    deadline_date = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
                    
                    # Asegurar que ambas fechas estén en UTC para comparación
                    current = datetime.now(pytz.UTC)
                    if deadline_date.tzinfo is None:
                        deadline_date = pytz.UTC.localize(deadline_date)
                    
                    # Comparar solo las fechas, ignorando la hora
                    deadline_date_only = deadline_date.date()
                    current_date_only = current.date()
                    
                    # Permitir fechas en el pasado para proyectos existentes
                    # if deadline_date_only < current_date_only:
                    #     raise ValueError("La fecha límite no puede estar en el pasado")
                    
                    return deadline_date
                return deadline
            except ValueError as e:
                if "fromisoformat" in str(e):
                    # En lugar de fallar, retornar None para fechas inválidas
                    return None
                raise e
        return deadline

    def get_chibi(self) -> str:
        """
        Obtiene el chibi correspondiente al estado y prioridad del proyecto
        
        Returns:
            str: Nombre del archivo de imagen del chibi
        """
        return ChibiManager.get_project_chibi(self.status, self.priority)
    
    def get_chibi_url(self, base_url: str = "/static/chibis/") -> str:
        """
        Obtiene la URL completa del chibi del proyecto
        
        Args:
            base_url: URL base donde se almacenan los chibis
            
        Returns:
            str: URL completa del chibi
        """
        chibi_filename = self.get_chibi()
        return ChibiManager.get_chibi_url(chibi_filename, base_url)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "category": self.category,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "chibi": self.get_chibi(),
            "chibi_url": self.get_chibi_url(),
            "tasks": [task.to_dict() for task in self.tasks]
        }