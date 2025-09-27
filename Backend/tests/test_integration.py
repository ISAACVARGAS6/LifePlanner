"""
Pruebas de integración para la comunicación frontend-backend
"""
import pytest
from fastapi.testclient import TestClient
from app.models.user import User
from app.models.project import Project
from app.models.task import Task

class TestUserSystemIntegration:
    """Pruebas de integración del sistema de usuarios"""
    
    def test_user_creation_and_project_isolation(self, client, db_session):
        """Probar creación de usuario y aislamiento de proyectos"""
        # Crear primer usuario
        user1_data = {
            "username": "usuario1",
            "email": "usuario1@example.com",
            "device_id": "device_123"
        }
        
        response1 = client.post("/lifeplanner/users/", json=user1_data)
        assert response1.status_code == 200
        user1 = response1.json()
        
        # Crear proyecto para usuario1
        project_data = {
            "title": "Proyecto Usuario 1",
            "description": "Proyecto del primer usuario",
            "status": "activo",
            "priority": "alta"
        }
        
        headers1 = {"X-Device-ID": "device_123"}
        response1 = client.post("/lifeplanner/projects/", json=project_data, headers=headers1)
        assert response1.status_code == 201
        project1 = response1.json()
        
        # Crear segundo usuario
        user2_data = {
            "username": "usuario2",
            "email": "usuario2@example.com",
            "device_id": "device_456"
        }
        
        response2 = client.post("/lifeplanner/users/", json=user2_data)
        assert response2.status_code == 200
        user2 = response2.json()
        
        # Crear proyecto para usuario2
        project_data2 = {
            "title": "Proyecto Usuario 2",
            "description": "Proyecto del segundo usuario",
            "status": "activo",
            "priority": "media"
        }
        
        headers2 = {"X-Device-ID": "device_456"}
        response2 = client.post("/lifeplanner/projects/", json=project_data2, headers=headers2)
        assert response2.status_code == 201
        project2 = response2.json()
        
        # Verificar que usuario1 solo ve sus proyectos
        response = client.get("/lifeplanner/projects/", headers=headers1)
        assert response.status_code == 200
        projects_user1 = response.json()
        assert len(projects_user1) == 1
        assert projects_user1[0]["id"] == project1["id"]
        
        # Verificar que usuario2 solo ve sus proyectos
        response = client.get("/lifeplanner/projects/", headers=headers2)
        assert response.status_code == 200
        projects_user2 = response.json()
        assert len(projects_user2) == 1
        assert projects_user2[0]["id"] == project2["id"]
        
        # Verificar que usuario1 no puede acceder al proyecto de usuario2
        response = client.get(f"/lifeplanner/projects/{project2['id']}", headers=headers1)
        assert response.status_code == 404
        
        # Verificar que usuario2 no puede acceder al proyecto de usuario1
        response = client.get(f"/lifeplanner/projects/{project1['id']}", headers=headers2)
        assert response.status_code == 404

    def test_task_creation_and_isolation(self, client, db_session):
        """Probar creación de tareas y aislamiento"""
        # Crear usuario
        user_data = {
            "username": "usuario_tareas",
            "email": "tareas@example.com",
            "device_id": "device_tareas"
        }
        
        response = client.post("/lifeplanner/users/", json=user_data)
        assert response.status_code == 200
        user = response.json()
        
        # Crear proyecto
        project_data = {
            "title": "Proyecto con Tareas",
            "description": "Proyecto para probar tareas",
            "status": "activo",
            "priority": "alta"
        }
        
        headers = {"X-Device-ID": "device_tareas"}
        response = client.post("/lifeplanner/projects/", json=project_data, headers=headers)
        assert response.status_code == 201
        project = response.json()
        
        # Crear tarea
        task_data = {
            "title": "Tarea de Prueba",
            "description": "Descripción de la tarea",
            "status": "pendiente",
            "priority": "media"
        }
        
        response = client.post(f"/lifeplanner/tasks/project/{project['id']}", json=task_data, headers=headers)
        assert response.status_code == 200
        task = response.json()
        
        # Verificar que la tarea se creó correctamente
        assert task["title"] == task_data["title"]
        assert task["project_id"] == project["id"]
        
        # Verificar que se puede obtener la tarea
        response = client.get(f"/lifeplanner/tasks/{task['id']}", headers=headers)
        assert response.status_code == 200
        retrieved_task = response.json()
        assert retrieved_task["id"] == task["id"]
        
        # Verificar que se puede obtener las tareas del proyecto
        response = client.get(f"/lifeplanner/projects/{project['id']}/tasks", headers=headers)
        assert response.status_code == 200
        project_tasks = response.json()
        assert len(project_tasks) == 1
        assert project_tasks[0]["id"] == task["id"]

    def test_chibi_system_integration(self, client):
        """Probar integración del sistema de chibis"""
        # Probar endpoints de chibis
        endpoints = [
            "/lifeplanner/chibis/types",
            "/lifeplanner/chibis/emotional-states",
            "/lifeplanner/chibis/personality",
            "/lifeplanner/chibis/appearance",
            "/lifeplanner/chibis/daily-quote",
            "/lifeplanner/chibis/study-break-activities",
            "/lifeplanner/chibis/random-emotional-state",
            "/lifeplanner/chibis/project/activo/alta",
            "/lifeplanner/chibis/task/pendiente/alta",
            "/lifeplanner/chibis/motivational-messages/happy_excited",
            "/lifeplanner/chibis/study-tips/matemáticas",
            "/lifeplanner/chibis/school-schedule/monday",
            "/lifeplanner/chibis/preview"
        ]
        
        for endpoint in endpoints:
            response = client.get(endpoint)
            assert response.status_code == 200
            data = response.json()
            assert data is not None

    def test_complete_workflow(self, client, db_session):
        """Probar flujo completo de la aplicación"""
        # 1. Crear usuario automáticamente
        headers = {"X-Device-ID": "device_workflow"}
        
        # 2. Crear proyecto
        project_data = {
            "title": "Proyecto Completo",
            "description": "Proyecto para probar flujo completo",
            "status": "activo",
            "priority": "alta",
            "category": "test"
        }
        
        response = client.post("/lifeplanner/projects/", json=project_data, headers=headers)
        assert response.status_code == 201
        project = response.json()
        
        # 3. Crear tareas
        tasks_data = [
            {
                "title": "Tarea 1",
                "description": "Primera tarea",
                "status": "pendiente",
                "priority": "alta"
            },
            {
                "title": "Tarea 2",
                "description": "Segunda tarea",
                "status": "pendiente",
                "priority": "media"
            }
        ]
        
        created_tasks = []
        for task_data in tasks_data:
            response = client.post(f"/lifeplanner/tasks/project/{project['id']}", json=task_data, headers=headers)
            assert response.status_code == 200
            created_tasks.append(response.json())
        
        # 4. Obtener proyecto con tareas
        response = client.get(f"/lifeplanner/projects/{project['id']}", headers=headers)
        assert response.status_code == 200
        project_with_tasks = response.json()
        assert len(project_with_tasks["tasks"]) == 2
        
        # 5. Actualizar tarea
        task_update = {
            "status": "en_progreso"
        }
        
        response = client.put(f"/lifeplanner/tasks/{created_tasks[0]['id']}/status", json=task_update, headers=headers)
        assert response.status_code == 200
        updated_task = response.json()
        assert updated_task["status"] == "en_progreso"
        
        # 6. Obtener todas las tareas del usuario
        response = client.get("/lifeplanner/tasks/", headers=headers)
        assert response.status_code == 200
        all_tasks = response.json()
        assert len(all_tasks) == 2
        
        # 7. Actualizar proyecto
        project_update = {
            "status": "en_pausa"
        }
        
        response = client.patch(f"/lifeplanner/projects/{project['id']}", json=project_update, headers=headers)
        assert response.status_code == 200
        updated_project = response.json()
        assert updated_project["status"] == "en_pausa"
        
        # 8. Eliminar tarea
        response = client.delete(f"/lifeplanner/tasks/{created_tasks[1]['id']}", headers=headers)
        assert response.status_code == 200
        
        # 9. Verificar que la tarea se eliminó
        response = client.get("/lifeplanner/tasks/", headers=headers)
        assert response.status_code == 200
        remaining_tasks = response.json()
        assert len(remaining_tasks) == 1
        
        # 10. Eliminar proyecto
        response = client.delete(f"/lifeplanner/projects/{project['id']}", headers=headers)
        assert response.status_code == 204
        
        # 11. Verificar que el proyecto se eliminó
        response = client.get("/lifeplanner/projects/", headers=headers)
        assert response.status_code == 200
        remaining_projects = response.json()
        assert len(remaining_projects) == 0

    def test_error_handling(self, client):
        """Probar manejo de errores"""
        headers = {"X-Device-ID": "device_errors"}
        
        # Probar crear proyecto con datos inválidos
        invalid_project = {
            "title": "",  # Título vacío
            "status": "estado_invalido",
            "priority": "prioridad_invalida"
        }
        
        response = client.post("/lifeplanner/projects/", json=invalid_project, headers=headers)
        assert response.status_code == 422  # Error de validación
        
        # Probar acceder a proyecto inexistente
        response = client.get("/lifeplanner/projects/999", headers=headers)
        assert response.status_code == 404
        
        # Probar crear tarea en proyecto inexistente
        task_data = {
            "title": "Tarea",
            "status": "pendiente",
            "priority": "alta"
        }
        
        response = client.post("/lifeplanner/tasks/project/999", json=task_data, headers=headers)
        assert response.status_code == 404
        
        # Probar actualizar tarea inexistente
        response = client.put("/lifeplanner/tasks/999", json=task_data, headers=headers)
        assert response.status_code == 404

    def test_concurrent_users(self, client, db_session):
        """Probar múltiples usuarios concurrentes"""
        # Crear múltiples usuarios
        users = []
        for i in range(3):
            user_data = {
                "username": f"usuario_{i}",
                "email": f"usuario{i}@example.com",
                "device_id": f"device_{i}"
            }
            
            response = client.post("/lifeplanner/users/", json=user_data)
            assert response.status_code == 200
            users.append(response.json())
        
        # Cada usuario crea un proyecto
        projects = []
        for i, user in enumerate(users):
            project_data = {
                "title": f"Proyecto Usuario {i}",
                "description": f"Proyecto del usuario {i}",
                "status": "activo",
                "priority": "alta"
            }
            
            headers = {"X-Device-ID": f"device_{i}"}
            response = client.post("/lifeplanner/projects/", json=project_data, headers=headers)
            assert response.status_code == 201
            projects.append(response.json())
        
        # Verificar que cada usuario solo ve su proyecto
        for i, user in enumerate(users):
            headers = {"X-Device-ID": f"device_{i}"}
            response = client.get("/lifeplanner/projects/", headers=headers)
            assert response.status_code == 200
            user_projects = response.json()
            assert len(user_projects) == 1
            assert user_projects[0]["title"] == f"Proyecto Usuario {i}"
        
        # Verificar aislamiento total
        for i, user in enumerate(users):
            headers = {"X-Device-ID": f"device_{i}"}
            for j, project in enumerate(projects):
                if i != j:
                    response = client.get(f"/lifeplanner/projects/{project['id']}", headers=headers)
                    assert response.status_code == 404

