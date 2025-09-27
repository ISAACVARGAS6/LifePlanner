from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from app.db import get_db
from app.models.task import Task
from app.models.project import Project
from app.models.user import User
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskOut
from typing import List, Optional

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
        user = User(
            username=f"Usuario_{device_id[:8]}",
            device_id=device_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user

@router.get("/", response_model=List[TaskOut])
def get_tasks(
    db: Session = Depends(get_db),
    project_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None, enum=["pendiente", "en_progreso", "completada"]),
    priority: Optional[str] = Query(None, enum=["baja", "media", "alta"]),
    tag: Optional[str] = Query(None),
    due_date_order: Optional[str] = Query("asc", enum=["asc", "desc"]),
    current_user: User = Depends(get_current_user)
):
    # Filtrar tareas por proyectos del usuario actual
    query = db.query(Task).join(Project).filter(Project.user_id == current_user.id)

    if project_id:
        # Verificar que el proyecto pertenece al usuario
        project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        query = query.filter(Task.project_id == project_id)
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if due_date_order == "asc":
        query = query.order_by(asc(Task.due_date))
    else:
        query = query.order_by(desc(Task.due_date))

    tasks = query.all()
    return tasks

@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).join(Project).filter(Task.id == task_id, Project.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/project/{project_id}", response_model=TaskOut)
def create_task_for_project(project_id: int, task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar que el proyecto pertenece al usuario
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    db_task = Task(**task.model_dump(), project_id=project_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, updated_task: TaskUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).join(Project).filter(Task.id == task_id, Project.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in updated_task.dict(exclude_unset=True).items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task

@router.put("/{task_id}/status", response_model=TaskOut)
def update_task_status(task_id: int, status_update: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Actualiza solo el estado de una tarea"""
    task = db.query(Task).join(Project).filter(Task.id == task_id, Project.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    new_status = status_update.get("status")
    if new_status not in ["pendiente", "en_progreso", "completada"]:
        raise HTTPException(status_code=400, detail="Estado inválido")
    
    task.status = new_status
    db.commit()
    db.refresh(task)
    return task

@router.patch("/{task_id}/priority", response_model=TaskOut)
def update_task_priority(task_id: int, priority_update: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Actualiza solo la prioridad de una tarea"""
    task = db.query(Task).join(Project).filter(Task.id == task_id, Project.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    new_priority = priority_update.get("priority")
    if new_priority not in ["baja", "media", "alta"]:
        raise HTTPException(status_code=400, detail="Prioridad inválida")
    
    task.priority = new_priority
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task_by_id(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).join(Project).filter(Task.id == task_id, Project.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Tarea borrada exitosamente"}

@router.delete("/project/{project_id}/task/{task_id}")
def delete_task_with_project(project_id: int, task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar que el proyecto pertenece al usuario
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found in this project")
    db.delete(task)
    db.commit()
    return {"message": "Tarea borrada exitosamente (verificado por proyecto)"}
