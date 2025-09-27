"""
Pruebas unitarias para los modelos
"""
import pytest
from datetime import datetime
from app.models.user import User
from app.models.project import Project
from app.models.task import Task

class TestUserModel:
    """Pruebas para el modelo User"""
    
    def test_create_user(self, db_session):
        """Probar creación de usuario"""
        user = User(
            username="test_user",
            email="test@example.com",
            device_id="test_device_123"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        
        assert user.id is not None
        assert user.username == "test_user"
        assert user.email == "test@example.com"
        assert user.device_id == "test_device_123"
        assert user.created_at is not None
        assert user.updated_at is not None
    
    def test_user_to_dict(self, test_user):
        """Probar método to_dict del usuario"""
        user_dict = test_user.to_dict()
        
        assert isinstance(user_dict, dict)
        assert user_dict["id"] == test_user.id
        assert user_dict["username"] == test_user.username
        assert user_dict["email"] == test_user.email
        assert user_dict["device_id"] == test_user.device_id
        assert "created_at" in user_dict
        assert "updated_at" in user_dict
    
    def test_user_relationships(self, test_user, test_project):
        """Probar relaciones del usuario"""
        assert len(test_user.projects) == 1
        assert test_user.projects[0].id == test_project.id

class TestProjectModel:
    """Pruebas para el modelo Project"""
    
    def test_create_project(self, db_session, test_user):
        """Probar creación de proyecto"""
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
        
        assert project.id is not None
        assert project.title == "Proyecto de Prueba"
        assert project.description == "Descripción de prueba"
        assert project.status == "activo"
        assert project.priority == "media"
        assert project.category == "test"
        assert project.user_id == test_user.id
        assert project.created_at is not None
        assert project.updated_at is not None
    
    def test_project_validation_status(self, db_session, test_user):
        """Probar validación de estado del proyecto"""
        with pytest.raises(ValueError):
            project = Project(
                title="Proyecto de Prueba",
                status="estado_invalido",
                user_id=test_user.id
            )
            db_session.add(project)
            db_session.commit()
    
    def test_project_validation_priority(self, db_session, test_user):
        """Probar validación de prioridad del proyecto"""
        with pytest.raises(ValueError):
            project = Project(
                title="Proyecto de Prueba",
                priority="prioridad_invalida",
                user_id=test_user.id
            )
            db_session.add(project)
            db_session.commit()
    
    def test_project_validation_title(self, db_session, test_user):
        """Probar validación de título del proyecto"""
        with pytest.raises(ValueError):
            project = Project(
                title="",  # Título vacío
                user_id=test_user.id
            )
            db_session.add(project)
            db_session.commit()
    
    def test_project_get_chibi(self, test_project):
        """Probar obtención de chibi del proyecto"""
        chibi = test_project.get_chibi()
        assert isinstance(chibi, str)
        assert chibi.endswith('.png')
    
    def test_project_get_chibi_url(self, test_project):
        """Probar obtención de URL del chibi"""
        chibi_url = test_project.get_chibi_url()
        assert isinstance(chibi_url, str)
        assert chibi_url.startswith('/static/chibis/')
        assert chibi_url.endswith('.png')
    
    def test_project_to_dict(self, test_project):
        """Probar método to_dict del proyecto"""
        project_dict = test_project.to_dict()
        
        assert isinstance(project_dict, dict)
        assert project_dict["id"] == test_project.id
        assert project_dict["title"] == test_project.title
        assert project_dict["status"] == test_project.status
        assert project_dict["priority"] == test_project.priority
        assert "chibi" in project_dict
        assert "chibi_url" in project_dict
        assert "tasks" in project_dict
        assert isinstance(project_dict["tasks"], list)
    
    def test_project_relationships(self, test_project, test_task):
        """Probar relaciones del proyecto"""
        assert test_project.user is not None
        assert len(test_project.tasks) == 1
        assert test_project.tasks[0].id == test_task.id

class TestTaskModel:
    """Pruebas para el modelo Task"""
    
    def test_create_task(self, db_session, test_project):
        """Probar creación de tarea"""
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
        
        assert task.id is not None
        assert task.title == "Tarea de Prueba"
        assert task.description == "Descripción de tarea de prueba"
        assert task.status == "pendiente"
        assert task.priority == "alta"
        assert task.project_id == test_project.id
        assert task.created_at is not None
        assert task.updated_at is not None
    
    def test_task_validation_status(self, db_session, test_project):
        """Probar validación de estado de la tarea"""
        with pytest.raises(ValueError):
            task = Task(
                title="Tarea de Prueba",
                status="estado_invalido",
                project_id=test_project.id
            )
            db_session.add(task)
            db_session.commit()
    
    def test_task_validation_priority(self, db_session, test_project):
        """Probar validación de prioridad de la tarea"""
        with pytest.raises(ValueError):
            task = Task(
                title="Tarea de Prueba",
                priority="prioridad_invalida",
                project_id=test_project.id
            )
            db_session.add(task)
            db_session.commit()
    
    def test_task_validation_title(self, db_session, test_project):
        """Probar validación de título de la tarea"""
        with pytest.raises(ValueError):
            task = Task(
                title="",  # Título vacío
                project_id=test_project.id
            )
            db_session.add(task)
            db_session.commit()
    
    def test_task_to_dict(self, test_task):
        """Probar método to_dict de la tarea"""
        task_dict = test_task.to_dict()
        
        assert isinstance(task_dict, dict)
        assert task_dict["id"] == test_task.id
        assert task_dict["title"] == test_task.title
        assert task_dict["status"] == test_task.status
        assert task_dict["priority"] == test_task.priority
        assert task_dict["project_id"] == test_task.project_id
    
    def test_task_relationships(self, test_task, test_project):
        """Probar relaciones de la tarea"""
        assert test_task.project is not None
        assert test_task.project.id == test_project.id

