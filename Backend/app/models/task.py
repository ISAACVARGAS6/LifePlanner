from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship, validates
from datetime import datetime, timezone
from ..db import Base

class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(500))
    status = Column(String(20), nullable=False, default="pendiente")
    priority = Column(String(20), nullable=False, default="media")
    due_date = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    project_id = Column(Integer, ForeignKey("projects.id"))

    project = relationship("Project", back_populates="tasks")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "project_id": self.project_id
        }

    @validates('status')
    def validate_status(self, key, status):
        if status not in ["pendiente", "en_progreso", "completada"]:
            raise ValueError("Estado inválido. Debe ser pendiente, en_progreso o completada")
        return status

    @validates('priority')
    def validate_priority(self, key, priority):
        if priority not in ["baja", "media", "alta"]:
            raise ValueError("Prioridad inválida. Debe ser baja, media o alta")
        return priority

    @validates('title')
    def validate_title(self, key, title):
        if not title or len(title) > 100:
            raise ValueError("El título debe tener entre 1 y 100 caracteres")
        return title

    @validates('description')
    def validate_description(self, key, description):
        if description and len(description) > 500:
            raise ValueError("La descripción no puede tener más de 500 caracteres")
        return description

    @validates('due_date')
    def validate_due_date(self, key, due_date):
        if due_date:
           if isinstance(due_date, str):
            try:
                due_date = datetime.fromisoformat(due_date)
            except Exception as e:
                raise ValueError(f"Formato de fecha inválido en modelo: {e}")
        elif not isinstance(due_date, datetime):
            raise ValueError("due_date debe ser string o datetime")

        if due_date.tzinfo is None:
            due_date = due_date.replace(tzinfo=timezone.utc)

        current_date = datetime.now(timezone.utc).date()
        target_date = due_date.date()

        if target_date < current_date:
            raise ValueError("La fecha límite no puede estar en el pasado (día anterior)")
        return due_date
