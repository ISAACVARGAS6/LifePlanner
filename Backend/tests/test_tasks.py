import pytest
from fastapi import status
from datetime import datetime, timedelta

# Pruebas de creación de tareas
def test_create_task_success(client, test_db):
    # Primero creamos un proyecto
    project_data = {
        "title": "Proyecto Test",
        "description": "Descripción del proyecto test",
        "status": "activo"
    }
    project_response = client.post("/lifeplanner/projects/", json=project_data)
    assert project_response.status_code == status.HTTP_201_CREATED
    project_id = project_response.json()["id"]

    # Ahora creamos una tarea
    task_data = {
        "title": "Tarea Test",
        "description": "Descripción de la tarea test",
        "status": "pendiente",
        "priority": "media",
        "due_date": (datetime.now() + timedelta(days=1)).isoformat()
    }
    
    response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=task_data)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert data["status"] == task_data["status"]
    assert data["priority"] == task_data["priority"]

def test_create_task_invalid_data(client, test_db):
    # Crear proyecto primero
    project_data = {"title": "Proyecto Test", "status": "activo"}
    project_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = project_response.json()["id"]

    # Intentar crear tarea sin título
    invalid_task = {
        "description": "Sin título",
        "status": "pendiente",
        "priority": "media"
    }
    response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=invalid_task)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Intentar crear tarea con estado inválido
    invalid_task = {
        "title": "Tarea Test",
        "status": "estado_invalido",
        "priority": "media"
    }
    response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=invalid_task)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Intentar crear tarea con prioridad inválida
    invalid_task = {
        "title": "Tarea Test",
        "status": "pendiente",
        "priority": "prioridad_invalida"
    }
    response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=invalid_task)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

# Pruebas de actualización de tareas
def test_update_task_status_success(client, test_db):
    # Crear proyecto y tarea primero
    project_data = {
        "title": "Proyecto Test",
        "status": "activo"
    }
    project_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = project_response.json()["id"]
    
    task_data = {
        "title": "Tarea Test",
        "status": "pendiente",
        "priority": "media"
    }
    task_response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=task_data)
    task_id = task_response.json()["id"]
    
    # Probar todas las transiciones de estado válidas
    status_transitions = ["en_progreso", "completada", "pendiente"]
    for new_status in status_transitions:
        update_data = {"status": new_status}
        response = client.patch(f"/lifeplanner/tasks/{task_id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == new_status

def test_update_task_invalid_status(client, test_db):
    # Crear proyecto y tarea
    project_data = {"title": "Proyecto Test", "status": "activo"}
    project_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = project_response.json()["id"]
    
    task_data = {
        "title": "Tarea Test",
        "status": "pendiente",
        "priority": "media"
    }
    task_response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=task_data)
    task_id = task_response.json()["id"]
    
    # Intentar actualizar con estado inválido
    update_data = {"status": "estado_invalido"}
    response = client.patch(f"/lifeplanner/tasks/{task_id}", json=update_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

# Pruebas de eliminación de tareas
def test_delete_task_success(client, test_db):
    # Crear proyecto y tarea
    project_data = {
        "title": "Proyecto Test",
        "status": "activo"
    }
    project_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = project_response.json()["id"]
    
    task_data = {
        "title": "Tarea para eliminar",
        "status": "pendiente",
        "priority": "media"
    }
    task_response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=task_data)
    task_id = task_response.json()["id"]
    
    # Eliminar tarea
    response = client.delete(f"/lifeplanner/tasks/{task_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verificar que la tarea fue eliminada
    get_response = client.get(f"/lifeplanner/tasks/{task_id}")
    assert get_response.status_code == status.HTTP_404_NOT_FOUND

def test_delete_nonexistent_task(client, test_db):
    # Intentar eliminar una tarea que no existe
    response = client.delete("/lifeplanner/tasks/99999")
    assert response.status_code == status.HTTP_404_NOT_FOUND

# Pruebas de casos límite
def test_task_title_length_limits(client, test_db):
    # Crear proyecto
    project_data = {"title": "Proyecto Test", "status": "activo"}
    project_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = project_response.json()["id"]
    
    # Intentar crear tarea con título muy largo (más de 100 caracteres)
    task_data = {
        "title": "a" * 101,
        "status": "pendiente",
        "priority": "media"
    }
    response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=task_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_task_description_length_limits(client, test_db):
    # Crear proyecto
    project_data = {"title": "Proyecto Test", "status": "activo"}
    project_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = project_response.json()["id"]
    
    # Intentar crear tarea con descripción muy larga (más de 500 caracteres)
    task_data = {
        "title": "Tarea Test",
        "description": "a" * 501,
        "status": "pendiente",
        "priority": "media"
    }
    response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=task_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_task_due_date_validation(client, test_db):
    # Crear proyecto
    project_data = {"title": "Proyecto Test", "status": "activo"}
    project_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = project_response.json()["id"]
    
    # Intentar crear tarea con fecha inválida
    task_data = {
        "title": "Tarea Test",
        "status": "pendiente",
        "priority": "media",
        "due_date": "fecha_invalida"
    }
    response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=task_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Intentar crear tarea con fecha en el pasado
    past_date = (datetime.now() - timedelta(days=1)).isoformat()
    task_data["due_date"] = past_date
    response = client.post(f"/lifeplanner/tasks/project/{project_id}", json=task_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY 