"""
Pruebas unitarias para las rutas de la API
"""
import pytest
from fastapi.testclient import TestClient
from app.models.user import User
from app.models.project import Project
from app.models.task import Task

class TestUserRoutes:
    """Pruebas para las rutas de usuario"""
    
    def test_get_users(self, client, test_user):
        """Probar obtener lista de usuarios"""
        response = client.get("/lifeplanner/users/")
        assert response.status_code == 200
        users = response.json()
        assert isinstance(users, list)
        assert len(users) == 1
        assert users[0]["username"] == test_user.username
    
    def test_get_user_by_id(self, client, test_user):
        """Probar obtener usuario por ID"""
        response = client.get(f"/lifeplanner/users/{test_user.id}")
        assert response.status_code == 200
        user_data = response.json()
        assert user_data["id"] == test_user.id
        assert user_data["username"] == test_user.username
    
    def test_get_user_by_device_id(self, client, test_user):
        """Probar obtener usuario por device_id"""
        response = client.get(f"/lifeplanner/users/device/{test_user.device_id}")
        assert response.status_code == 200
        user_data = response.json()
        assert user_data["device_id"] == test_user.device_id
    
    def test_create_user(self, client):
        """Probar crear nuevo usuario"""
        user_data = {
            "username": "nuevo_usuario",
            "email": "nuevo@example.com",
            "device_id": "nuevo_device_456"
        }
        response = client.post("/lifeplanner/users/", json=user_data)
        assert response.status_code == 200
        created_user = response.json()
        assert created_user["username"] == user_data["username"]
        assert created_user["email"] == user_data["email"]
        assert created_user["device_id"] == user_data["device_id"]
    
    def test_create_user_duplicate_username(self, client, test_user):
        """Probar crear usuario con username duplicado"""
        user_data = {
            "username": test_user.username,
            "email": "otro@example.com",
            "device_id": "otro_device_789"
        }
        response = client.post("/lifeplanner/users/", json=user_data)
        assert response.status_code == 400
    
    def test_update_user(self, client, test_user):
        """Probar actualizar usuario"""
        update_data = {
            "username": "usuario_actualizado",
            "email": "actualizado@example.com"
        }
        response = client.put(f"/lifeplanner/users/{test_user.id}", json=update_data)
        assert response.status_code == 200
        updated_user = response.json()
        assert updated_user["username"] == update_data["username"]
        assert updated_user["email"] == update_data["email"]
    
    def test_delete_user(self, client, test_user):
        """Probar eliminar usuario"""
        response = client.delete(f"/lifeplanner/users/{test_user.id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Usuario eliminado correctamente"

class TestProjectRoutes:
    """Pruebas para las rutas de proyecto"""
    
    def test_create_project(self, client, test_user):
        """Probar crear proyecto"""
        project_data = {
            "title": "Nuevo Proyecto",
            "description": "Descripción del nuevo proyecto",
            "status": "activo",
            "priority": "alta",
            "category": "test"
        }
        headers = {"X-Device-ID": test_user.device_id}
        response = client.post("/lifeplanner/projects/", json=project_data, headers=headers)
        assert response.status_code == 201
        created_project = response.json()
        assert created_project["title"] == project_data["title"]
        assert created_project["status"] == project_data["status"]
        assert created_project["priority"] == project_data["priority"]
    
    def test_get_projects(self, client, test_user, test_project):
        """Probar obtener proyectos del usuario"""
        headers = {"X-Device-ID": test_user.device_id}
        response = client.get("/lifeplanner/projects/", headers=headers)
        assert response.status_code == 200
        projects = response.json()
        assert isinstance(projects, list)
        assert len(projects) == 1
        assert projects[0]["id"] == test_project.id
    
    def test_get_project_by_id(self, client, test_user, test_project):
        """Probar obtener proyecto por ID"""
        headers = {"X-Device-ID": test_user.device_id}
        response = client.get(f"/lifeplanner/projects/{test_project.id}", headers=headers)
        assert response.status_code == 200
        project_data = response.json()
        assert project_data["id"] == test_project.id
        assert project_data["title"] == test_project.title
    
    def test_update_project(self, client, test_user, test_project):
        """Probar actualizar proyecto"""
        update_data = {
            "title": "Proyecto Actualizado",
            "status": "en_pausa"
        }
        headers = {"X-Device-ID": test_user.device_id}
        response = client.put(f"/lifeplanner/projects/{test_project.id}", json=update_data, headers=headers)
        assert response.status_code == 200
        updated_project = response.json()
        assert updated_project["title"] == update_data["title"]
        assert updated_project["status"] == update_data["status"]
    
    def test_patch_project(self, client, test_user, test_project):
        """Probar actualización parcial de proyecto"""
        patch_data = {
            "priority": "alta"
        }
        headers = {"X-Device-ID": test_user.device_id}
        response = client.patch(f"/lifeplanner/projects/{test_project.id}", json=patch_data, headers=headers)
        assert response.status_code == 200
        patched_project = response.json()
        assert patched_project["priority"] == patch_data["priority"]
    
    def test_delete_project(self, client, test_user, test_project):
        """Probar eliminar proyecto"""
        headers = {"X-Device-ID": test_user.device_id}
        response = client.delete(f"/lifeplanner/projects/{test_project.id}", headers=headers)
        assert response.status_code == 204
    
    def test_get_project_tasks(self, client, test_user, test_project, test_task):
        """Probar obtener tareas de un proyecto"""
        headers = {"X-Device-ID": test_user.device_id}
        response = client.get(f"/lifeplanner/projects/{test_project.id}/tasks", headers=headers)
        assert response.status_code == 200
        tasks = response.json()
        assert isinstance(tasks, list)
        assert len(tasks) == 1
        assert tasks[0]["id"] == test_task.id

class TestTaskRoutes:
    """Pruebas para las rutas de tarea"""
    
    def test_create_task(self, client, test_user, test_project):
        """Probar crear tarea"""
        task_data = {
            "title": "Nueva Tarea",
            "description": "Descripción de la nueva tarea",
            "status": "pendiente",
            "priority": "media"
        }
        headers = {"X-Device-ID": test_user.device_id}
        response = client.post(f"/lifeplanner/tasks/project/{test_project.id}", json=task_data, headers=headers)
        assert response.status_code == 200
        created_task = response.json()
        assert created_task["title"] == task_data["title"]
        assert created_task["status"] == task_data["status"]
        assert created_task["priority"] == task_data["priority"]
        assert created_task["project_id"] == test_project.id
    
    def test_get_tasks(self, client, test_user, test_task):
        """Probar obtener tareas del usuario"""
        headers = {"X-Device-ID": test_user.device_id}
        response = client.get("/lifeplanner/tasks/", headers=headers)
        assert response.status_code == 200
        tasks = response.json()
        assert isinstance(tasks, list)
        assert len(tasks) == 1
        assert tasks[0]["id"] == test_task.id
    
    def test_get_task_by_id(self, client, test_user, test_task):
        """Probar obtener tarea por ID"""
        headers = {"X-Device-ID": test_user.device_id}
        response = client.get(f"/lifeplanner/tasks/{test_task.id}", headers=headers)
        assert response.status_code == 200
        task_data = response.json()
        assert task_data["id"] == test_task.id
        assert task_data["title"] == test_task.title
    
    def test_update_task(self, client, test_user, test_task):
        """Probar actualizar tarea"""
        update_data = {
            "title": "Tarea Actualizada",
            "status": "en_progreso"
        }
        headers = {"X-Device-ID": test_user.device_id}
        response = client.put(f"/lifeplanner/tasks/{test_task.id}", json=update_data, headers=headers)
        assert response.status_code == 200
        updated_task = response.json()
        assert updated_task["title"] == update_data["title"]
        assert updated_task["status"] == update_data["status"]
    
    def test_update_task_status(self, client, test_user, test_task):
        """Probar actualizar solo el estado de la tarea"""
        status_data = {"status": "completada"}
        headers = {"X-Device-ID": test_user.device_id}
        response = client.put(f"/lifeplanner/tasks/{test_task.id}/status", json=status_data, headers=headers)
        assert response.status_code == 200
        updated_task = response.json()
        assert updated_task["status"] == status_data["status"]
    
    def test_update_task_priority(self, client, test_user, test_task):
        """Probar actualizar solo la prioridad de la tarea"""
        priority_data = {"priority": "baja"}
        headers = {"X-Device-ID": test_user.device_id}
        response = client.patch(f"/lifeplanner/tasks/{test_task.id}/priority", json=priority_data, headers=headers)
        assert response.status_code == 200
        updated_task = response.json()
        assert updated_task["priority"] == priority_data["priority"]
    
    def test_delete_task(self, client, test_user, test_task):
        """Probar eliminar tarea"""
        headers = {"X-Device-ID": test_user.device_id}
        response = client.delete(f"/lifeplanner/tasks/{test_task.id}", headers=headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Tarea borrada exitosamente"

class TestUserIsolation:
    """Pruebas para verificar el aislamiento de usuarios"""
    
    def test_user_cannot_access_other_user_projects(self, client, test_user, test_project):
        """Probar que un usuario no puede acceder a proyectos de otro usuario"""
        # Crear otro usuario
        other_user = User(
            username="otro_usuario",
            email="otro@example.com",
            device_id="otro_device_999"
        )
        client.app.dependency_overrides[client.app.dependency_overrides.get.__name__] = lambda: other_user
        
        headers = {"X-Device-ID": other_user.device_id}
        response = client.get(f"/lifeplanner/projects/{test_project.id}", headers=headers)
        assert response.status_code == 404  # No debería encontrar el proyecto
    
    def test_user_cannot_access_other_user_tasks(self, client, test_user, test_task):
        """Probar que un usuario no puede acceder a tareas de otro usuario"""
        # Crear otro usuario
        other_user = User(
            username="otro_usuario",
            email="otro@example.com",
            device_id="otro_device_999"
        )
        
        headers = {"X-Device-ID": other_user.device_id}
        response = client.get(f"/lifeplanner/tasks/{test_task.id}", headers=headers)
        assert response.status_code == 404  # No debería encontrar la tarea

