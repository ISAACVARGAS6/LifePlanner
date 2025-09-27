"""
Pruebas unitarias para el sistema de chibis
"""
import pytest
from fastapi.testclient import TestClient
from app.chibi_manager import ChibiManager

class TestChibiManager:
    """Pruebas para el ChibiManager"""
    
    def test_get_project_chibi(self):
        """Probar obtención de chibi para proyecto"""
        chibi = ChibiManager.get_project_chibi("activo", "alta")
        assert isinstance(chibi, str)
        assert chibi.endswith('.png')
        
        # Probar diferentes combinaciones
        chibi2 = ChibiManager.get_project_chibi("en_pausa", "media")
        assert isinstance(chibi2, str)
        assert chibi2.endswith('.png')
        
        chibi3 = ChibiManager.get_project_chibi("terminado", "baja")
        assert isinstance(chibi3, str)
        assert chibi3.endswith('.png')
    
    def test_get_task_chibi(self):
        """Probar obtención de chibi para tarea"""
        chibi = ChibiManager.get_task_chibi("pendiente", "alta")
        assert isinstance(chibi, str)
        assert chibi.endswith('.png')
        
        # Probar diferentes combinaciones
        chibi2 = ChibiManager.get_task_chibi("en_progreso", "media")
        assert isinstance(chibi2, str)
        assert chibi2.endswith('.png')
        
        chibi3 = ChibiManager.get_task_chibi("completada", "baja")
        assert isinstance(chibi3, str)
        assert chibi3.endswith('.png')
    
    def test_get_chibi_url(self):
        """Probar generación de URL de chibi"""
        chibi_filename = "happy_excited.png"
        url = ChibiManager.get_chibi_url(chibi_filename)
        assert url == "/static/chibis/happy_excited.png"
        
        # Probar con URL base personalizada
        custom_url = ChibiManager.get_chibi_url(chibi_filename, "/custom/path/")
        assert custom_url == "/custom/path/happy_excited.png"
    
    def test_get_emotional_states(self):
        """Probar obtención de estados emocionales"""
        # El ChibiManager no tiene este método, se prueba a través de las rutas
        pass
    
    def test_get_chibi_types(self):
        """Probar obtención de tipos de chibis"""
        types = ChibiManager.get_all_chibi_types()
        assert isinstance(types, dict)
        assert len(types) > 0
        
        # Verificar que cada tipo tiene las propiedades requeridas
        for chibi_type, description in types.items():
            assert isinstance(chibi_type, str)
            assert isinstance(description, str)
            # Verificar que es un tipo de chibi válido
            assert chibi_type in ['happy_excited', 'happy_calm', 'happy_studying', 'focused_determined', 'focused_stressed', 'tired_but_determined', 'tired_overwhelmed', 'excited_achievement', 'proud_accomplished', 'thoughtful_planning', 'confident_ready', 'nervous_uncertain', 'relaxed_break', 'energized_motivated', 'determined_challenge']
    
    def test_get_sakura_personality(self):
        """Probar obtención de personalidad de Sakura"""
        # El ChibiManager no tiene este método, se prueba a través de las rutas
        pass
    
    def test_get_sakura_appearance(self):
        """Probar obtención de apariencia de Sakura"""
        # El ChibiManager no tiene este método, se prueba a través de las rutas
        pass
    
    def test_get_daily_quote(self):
        """Probar obtención de frase del día"""
        # El ChibiManager no tiene este método, se prueba a través de las rutas
        pass
    
    def test_get_study_break_activities(self):
        """Probar obtención de actividades de descanso"""
        # El ChibiManager no tiene este método, se prueba a través de las rutas
        pass
    
    def test_get_motivational_messages(self):
        """Probar obtención de mensajes motivacionales"""
        # El ChibiManager no tiene este método, se prueba a través de las rutas
        pass
    
    def test_get_study_tips(self):
        """Probar obtención de consejos de estudio"""
        # El ChibiManager no tiene este método, se prueba a través de las rutas
        pass
    
    def test_get_school_schedule(self):
        """Probar obtención de horario escolar"""
        # El ChibiManager no tiene este método, se prueba a través de las rutas
        pass
    
    def test_get_random_emotional_state(self):
        """Probar obtención de estado emocional aleatorio"""
        # El ChibiManager no tiene este método, se prueba a través de las rutas
        pass
    
    def test_get_preview(self):
        """Probar obtención de vista previa completa"""
        # El ChibiManager no tiene este método, se prueba a través de las rutas
        pass

class TestChibiRoutes:
    """Pruebas para las rutas de chibis"""
    
    def test_get_chibi_types(self, client):
        """Probar endpoint de tipos de chibis"""
        response = client.get("/lifeplanner/chibis/types")
        assert response.status_code == 200
        types = response.json()
        assert isinstance(types, dict)
        assert len(types) > 0
    
    def test_get_emotional_states(self, client):
        """Probar endpoint de estados emocionales"""
        response = client.get("/lifeplanner/chibis/emotional-states")
        assert response.status_code == 200
        states = response.json()
        assert isinstance(states, dict)
        assert len(states) > 0
    
    def test_get_sakura_personality(self, client):
        """Probar endpoint de personalidad de Sakura"""
        response = client.get("/lifeplanner/chibis/personality")
        assert response.status_code == 200
        personality = response.json()
        assert isinstance(personality, dict)
        assert "personality_traits" in personality
        assert "name" in personality
    
    def test_get_sakura_appearance(self, client):
        """Probar endpoint de apariencia de Sakura"""
        response = client.get("/lifeplanner/chibis/appearance")
        assert response.status_code == 200
        appearance = response.json()
        assert isinstance(appearance, dict)
        assert "uniform_colors" in appearance
        assert "facial_expressions" in appearance
    
    def test_get_daily_quote(self, client):
        """Probar endpoint de frase del día"""
        response = client.get("/lifeplanner/chibis/daily-quote")
        assert response.status_code == 200
        quote = response.json()
        assert isinstance(quote, dict)
        assert "quote" in quote
        assert "source" in quote
    
    def test_get_study_break_activities(self, client):
        """Probar endpoint de actividades de descanso"""
        response = client.get("/lifeplanner/chibis/study-break-activities")
        assert response.status_code == 200
        activities = response.json()
        assert isinstance(activities, dict)
        assert "activities" in activities
    
    def test_get_random_emotional_state(self, client):
        """Probar endpoint de estado emocional aleatorio"""
        response = client.get("/lifeplanner/chibis/random-emotional-state")
        assert response.status_code == 200
        state = response.json()
        assert isinstance(state, dict)
        assert "emotional_state" in state
        assert "emotional_description" in state
        assert "chibi_filename" in state
    
    def test_get_project_chibi(self, client):
        """Probar endpoint de chibi para proyecto"""
        response = client.get("/lifeplanner/chibis/project/activo/alta")
        assert response.status_code == 200
        chibi = response.json()
        assert isinstance(chibi, dict)
        assert "chibi_filename" in chibi
        assert "chibi_url" in chibi
    
    def test_get_task_chibi(self, client):
        """Probar endpoint de chibi para tarea"""
        response = client.get("/lifeplanner/chibis/task/pendiente/alta")
        assert response.status_code == 200
        chibi = response.json()
        assert isinstance(chibi, dict)
        assert "chibi_filename" in chibi
        assert "chibi_url" in chibi
    
    def test_get_motivational_messages(self, client):
        """Probar endpoint de mensajes motivacionales"""
        response = client.get("/lifeplanner/chibis/motivational-messages/happy_excited")
        assert response.status_code == 200
        messages = response.json()
        assert isinstance(messages, dict)
        assert "messages" in messages
    
    def test_get_study_tips(self, client):
        """Probar endpoint de consejos de estudio"""
        response = client.get("/lifeplanner/chibis/study-tips/matemáticas")
        assert response.status_code == 200
        tips = response.json()
        assert isinstance(tips, dict)
        assert "tips" in tips
    
    def test_get_school_schedule(self, client):
        """Probar endpoint de horario escolar"""
        response = client.get("/lifeplanner/chibis/school-schedule/monday")
        assert response.status_code == 200
        schedule = response.json()
        assert isinstance(schedule, dict)
        assert "day" in schedule
        assert "schedule" in schedule
    
    def test_get_preview(self, client):
        """Probar endpoint de vista previa completa"""
        response = client.get("/lifeplanner/chibis/preview")
        assert response.status_code == 200
        preview = response.json()
        assert isinstance(preview, dict)
        assert "projects" in preview
        assert "tasks" in preview
