from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from app.db import get_db
from app.models.task import Task
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskOut
from typing import List, Optional

router = APIRouter()

@router.get("/", response_model=List[TaskOut])
def get_tasks(
    db: Session = Depends(get_db),
    project_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None, enum=["pendiente", "en_progreso", "completada"]),
    priority: Optional[str] = Query(None, enum=["baja", "media", "alta"]),
    tag: Optional[str] = Query(None),
    due_date_order: Optional[str] = Query("asc", enum=["asc", "desc"])
):
    query = db.query(Task)

    if project_id:
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
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/project/{project_id}", response_model=TaskOut)
def create_task_for_project(project_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.model_dump(), project_id=project_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, updated_task: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in updated_task.dict(exclude_unset=True).items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task

@router.put("/{task_id}/status", response_model=TaskOut)
def update_task_status(task_id: int, status_update: dict, db: Session = Depends(get_db)):
    """Actualiza solo el estado de una tarea"""
    task = db.query(Task).filter(Task.id == task_id).first()
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
def update_task_priority(task_id: int, priority_update: dict, db: Session = Depends(get_db)):
    """Actualiza solo la prioridad de una tarea"""
    task = db.query(Task).filter(Task.id == task_id).first()
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
def delete_task_by_id(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Tarea borrada exitosamente"}

@router.delete("/project/{project_id}/task/{task_id}")
def delete_task_with_project(project_id: int, task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found in this project")
    db.delete(task)
    db.commit()
    return {"message": "Tarea borrada exitosamente (verificado por proyecto)"}
