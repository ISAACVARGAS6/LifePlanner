import pytest
from fastapi import status
from datetime import datetime, timedelta

# Pruebas de creación de proyectos
def test_create_project_success(client, test_db):
    project_data = {
        "title": "Nuevo Proyecto",
        "description": "Descripción del proyecto",
        "status": "activo",
        "priority": "alta",
        "category": "trabajo",
        "deadline": (datetime.now() + timedelta(days=30)).isoformat()
    }
    
    response = client.post("/lifeplanner/projects/", json=project_data)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    
    assert data["title"] == project_data["title"]
    assert data["description"] == project_data["description"]
    assert data["status"] == project_data["status"]
    assert data["priority"] == project_data["priority"]
    assert data["category"] == project_data["category"]

def test_create_project_minimal_data(client, test_db):
    # Crear proyecto solo con campos requeridos
    project_data = {
        "title": "Proyecto Mínimo",
        "status": "activo"
    }
    
    response = client.post("/lifeplanner/projects/", json=project_data)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    
    assert data["title"] == project_data["title"]
    assert data["status"] == project_data["status"]
    assert "description" not in data or data["description"] is None
    assert "priority" not in data or data["priority"] is None
    assert "category" not in data or data["category"] is None
    assert "deadline" not in data or data["deadline"] is None

def test_create_project_invalid_data(client, test_db):
    # Intentar crear proyecto sin título
    invalid_project = {
        "description": "Sin título",
        "status": "activo"
    }
    response = client.post("/lifeplanner/projects/", json=invalid_project)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Intentar crear proyecto con estado inválido
    invalid_project = {
        "title": "Proyecto Test",
        "status": "estado_invalido"
    }
    response = client.post("/lifeplanner/projects/", json=invalid_project)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

# Pruebas de actualización de proyectos
def test_update_project_success(client, test_db):
    # Crear proyecto
    project_data = {
        "title": "Proyecto Original",
        "status": "activo"
    }
    create_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = create_response.json()["id"]
    
    # Actualizar proyecto
    update_data = {
        "title": "Proyecto Actualizado",
        "description": "Nueva descripción",
        "status": "en_pausa"
    }
    response = client.put(f"/lifeplanner/projects/{project_id}", json=update_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert data["title"] == update_data["title"]
    assert data["description"] == update_data["description"]
    assert data["status"] == update_data["status"]

def test_update_project_status_transitions(client, test_db):
    # Crear proyecto
    project_data = {
        "title": "Proyecto Test",
        "status": "activo"
    }
    create_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = create_response.json()["id"]
    
    # Probar todas las transiciones de estado válidas
    status_transitions = ["en_pausa", "terminado", "activo"]
    for new_status in status_transitions:
        update_data = {"status": new_status}
        response = client.patch(f"/lifeplanner/projects/{project_id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == new_status

# Pruebas de eliminación de proyectos
def test_delete_project_success(client, test_db):
    # Crear proyecto
    project_data = {
        "title": "Proyecto para eliminar",
        "status": "activo"
    }
    create_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = create_response.json()["id"]
    
    # Eliminar proyecto
    response = client.delete(f"/lifeplanner/projects/{project_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verificar que el proyecto fue eliminado
    get_response = client.get(f"/lifeplanner/projects/{project_id}")
    assert get_response.status_code == status.HTTP_404_NOT_FOUND

def test_delete_project_with_tasks(client, test_db):
    # Crear proyecto
    project_data = {
        "title": "Proyecto con tareas",
        "status": "activo"
    }
    project_response = client.post("/lifeplanner/projects/", json=project_data)
    project_id = project_response.json()["id"]
    
    # Crear algunas tareas
    task_data = {
        "title": "Tarea Test",
        "status": "pendiente",
        "priority": "media"
    }
    client.post(f"/lifeplanner/tasks/project/{project_id}", json=task_data)
    
    # Intentar eliminar proyecto con tareas
    response = client.delete(f"/lifeplanner/projects/{project_id}")
    assert response.status_code == status.HTTP_409_CONFLICT

# Pruebas de casos límite
def test_project_title_length_limits(client, test_db):
    # Intentar crear proyecto con título muy largo (más de 100 caracteres)
    project_data = {
        "title": "a" * 101,
        "status": "activo"
    }
    response = client.post("/lifeplanner/projects/", json=project_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_project_description_length_limits(client, test_db):
    # Intentar crear proyecto con descripción muy larga (más de 500 caracteres)
    project_data = {
        "title": "Proyecto Test",
        "description": "a" * 501,
        "status": "activo"
    }
    response = client.post("/lifeplanner/projects/", json=project_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_project_deadline_validation(client, test_db):
    # Intentar crear proyecto con fecha límite inválida
    project_data = {
        "title": "Proyecto Test",
        "status": "activo",
        "deadline": "fecha_invalida"
    }
    response = client.post("/lifeplanner/projects/", json=project_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Intentar crear proyecto con fecha límite en el pasado
    past_date = (datetime.now() - timedelta(days=1)).isoformat()
    project_data["deadline"] = past_date
    response = client.post("/lifeplanner/projects/", json=project_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY 