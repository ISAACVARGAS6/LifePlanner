from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models.user import User
from ..schemas.user_schema import UserCreate, UserUpdate, UserOut

router = APIRouter()

@router.get("/", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    """Obtener todos los usuarios (solo para desarrollo)"""
    users = db.query(User).all()
    return users

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Obtener un usuario por ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.get("/device/{device_id}", response_model=UserOut)
def get_user_by_device_id(device_id: str, db: Session = Depends(get_db)):
    """Obtener o crear un usuario por device_id"""
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

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Crear un nuevo usuario"""
    # Verificar si ya existe un usuario con el mismo username
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")
    
    # Verificar si ya existe un usuario con el mismo device_id
    if user.device_id:
        existing_device = db.query(User).filter(User.device_id == user.device_id).first()
        if existing_device:
            raise HTTPException(status_code=400, detail="El device_id ya está en uso")
    
    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    """Actualizar un usuario"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar si el nuevo username ya existe
    if user_update.username and user_update.username != user.username:
        existing_user = db.query(User).filter(User.username == user_update.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")
    
    # Verificar si el nuevo device_id ya existe
    if user_update.device_id and user_update.device_id != user.device_id:
        existing_device = db.query(User).filter(User.device_id == user_update.device_id).first()
        if existing_device:
            raise HTTPException(status_code=400, detail="El device_id ya está en uso")
    
    # Actualizar campos
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Eliminar un usuario y todos sus datos asociados"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.delete(user)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}

