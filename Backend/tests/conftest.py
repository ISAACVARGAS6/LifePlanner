"""
Configuración global para pytest
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
import tempfile
import os

from app.main import app
from app.db import Base, get_db
from app.models import user, project, task

# Base de datos temporal para pruebas
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def test_db():
    """Crear base de datos de prueba"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(test_db):
    """Crear sesión de base de datos para pruebas"""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    """Crear cliente de prueba para FastAPI"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db_session):
    """Crear usuario de prueba"""
    from app.models.user import User
    user = User(
        username="test_user",
        email="test@example.com",
        device_id="test_device_123"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def test_project(db_session, test_user):
    """Crear proyecto de prueba"""
    from app.models.project import Project
    project = Project(
        title="Proyecto de Prueba",
        description="Descripción de prueba",
        status="activo",
        priority="media",
        category="test",
        user_id=test_user.id
    )
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    return project

@pytest.fixture
def test_task(db_session, test_project):
    """Crear tarea de prueba"""
    from app.models.task import Task
    task = Task(
        title="Tarea de Prueba",
        description="Descripción de tarea de prueba",
        status="pendiente",
        priority="alta",
        project_id=test_project.id
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task

