from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.task import Task
from app.schemas.task_schema import TaskCreate, TaskUpdate 
from typing import List

router = APIRouter()

@router.get("/", response_model=List[TaskCreate])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return tasks

@router.get("/{task_id}", response_model=TaskCreate)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/project/{project_id}", response_model=TaskCreate)
def create_task_for_project(project_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.model_dump(), project_id=project_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=TaskCreate)
def update_task(task_id: int, updated_task: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in updated_task.dict(exclude_unset=True).items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task

# ✅ Opción simple: solo por task_id
@router.delete("/{task_id}")
def delete_task_by_id(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Tarea borrada exitosamente"}

# ✅ Opción estricta: por project_id y task_id
@router.delete("/project/{project_id}/task/{task_id}")
def delete_task_with_project(project_id: int, task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found in this project")
    db.delete(task)
    db.commit()
    return {"message": "Tarea borrada exitosamente (verificado por proyecto)"}

