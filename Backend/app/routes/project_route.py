from fastapi import APIRouter, Depends, HTTPException, Response, status, Header
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.db import SessionLocal, get_db
from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.schemas.project_schema import ProjectCreate, ProjectOut, ProjectUpdate
from app.schemas.task_schema import TaskOut
import logging
import traceback
from datetime import datetime

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()


# Función para obtener el usuario actual
def get_current_user(device_id: Optional[str] = Header(None, alias="X-Device-ID"), db: Session = Depends(get_db)) -> User:
    """Obtener o crear el usuario actual basado en device_id"""
    if not device_id:
        # Si no hay device_id, crear un usuario temporal
        device_id = "temp_user"
    
    user = db.query(User).filter(User.device_id == device_id).first()
    
    if not user:
        # Crear un nuevo usuario automáticamente
        # Generar username único basado en timestamp para evitar conflictos
        import time
        timestamp = int(time.time())
        username = f"Usuario_{device_id[:8]}_{timestamp}"
        
        user = User(
            username=username,
            device_id=device_id
        )
        try:
            db.add(user)
            db.commit()
            db.refresh(user)
        except Exception as e:
            db.rollback()
            logger.error(f"Error al crear usuario: {str(e)}")
            # Si falla por username duplicado, intentar con otro timestamp
            timestamp = int(time.time() * 1000)  # Usar milisegundos
            username = f"Usuario_{device_id[:8]}_{timestamp}"
            user = User(
                username=username,
                device_id=device_id
            )
            db.add(user)
            db.commit()
            db.refresh(user)
    
    return user


@router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(project: ProjectCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        logger.info(f"Creando proyecto: {project.title} para usuario {current_user.id}")
        
        # Procesar deadline de forma más robusta
        deadline_value = None
        if project.deadline:
            if isinstance(project.deadline, str):
                try:
                    # Intentar parsear la fecha
                    deadline_value = datetime.fromisoformat(project.deadline.replace('Z', '+00:00'))
                except ValueError:
                    logger.warning(f"Formato de fecha inválido: {project.deadline}")
                    deadline_value = None
            else:
                deadline_value = project.deadline

        db_project = Project(
            title=project.title,
            description=project.description,
            status=project.status,
            priority=project.priority,
            category=project.category,
            deadline=deadline_value,
            user_id=current_user.id
        )

        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        
        logger.info(f"Proyecto creado exitosamente con ID: {db_project.id}")
        return db_project.to_dict()
    except Exception as e:
        logger.error(f"Error al crear proyecto: {str(e)}")
        logger.error(traceback.format_exc())
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor al crear el proyecto: {str(e)}"
        )


@router.get("/", response_model=List[ProjectOut])
async def get_projects(
    status: str = None,
    priority: str = None,
    due_date_order: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Filtrar por usuario actual
        query = db.query(Project).options(joinedload(Project.tasks)).filter(Project.user_id == current_user.id)

        if status:
            query = query.filter(Project.status == status)
        if priority:
            query = query.filter(Project.priority == priority)
        if due_date_order:
            if due_date_order.lower() == 'asc':
                query = query.order_by(Project.deadline.asc())
            elif due_date_order.lower() == 'desc':
                query = query.order_by(Project.deadline.desc())

        projects = query.all()
        return [project.to_dict() for project in projects]
    except Exception as e:
        logger.error(f"Error al obtener proyectos: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener proyectos: {str(e)}"
        )

@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(project_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyecto no encontrado")
        return project.to_dict()
    except HTTPException:
        # Re-raise HTTP exceptions (like 404) without wrapping them
        raise
    except Exception as e:
        logger.error(f"Error al obtener el proyecto {project_id}: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el proyecto {project_id}: {str(e)}"
        )

@router.get("/{project_id}/tasks", response_model=List[TaskOut])
async def get_tasks_by_project(project_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Verificar que el proyecto pertenece al usuario
        project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyecto no encontrado")
        
        tasks = db.query(Task).filter(Task.project_id == project_id).all()
        return [task.to_dict() for task in tasks]
    except Exception as e:
        logger.error(f"Error al obtener tareas del proyecto {project_id}: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener tareas del proyecto {project_id}: {str(e)}"
        )


@router.put("/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: int,
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()

        if not db_project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )

        update_data = project_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == 'deadline' and isinstance(value, str):
                value = datetime.fromisoformat(value)
            setattr(db_project, field, value)

        db.commit()
        db.refresh(db_project)
        return db_project.to_dict()
    except Exception as e:
        db.rollback()
        logger.error(f"Error al actualizar proyecto: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar proyecto: {str(e)}"
        )


@router.patch("/{project_id}", response_model=ProjectOut)
async def patch_project(
    project_id: int,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
        if not db_project:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")

        update_data = project_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if key == 'deadline' and isinstance(value, str):
                value = datetime.fromisoformat(value)
            setattr(db_project, key, value)

        db.commit()
        db.refresh(db_project)
        return db_project.to_dict()
    except Exception as e:
        db.rollback()
        logger.error(f"Error al hacer patch del proyecto: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al hacer patch del proyecto: {str(e)}"
        )


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    db.delete(project)
    db.commit()
    return Response(status_code=204)

