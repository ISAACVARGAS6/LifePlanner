from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any
from ..chibi_manager import ChibiManager, ChibiType
from ..chibi_config import ChibiConfig, MotivationSystem, StudySession, SchoolSubject

router = APIRouter(prefix="/chibis", tags=["chibis"])

@router.get("/types")
async def get_chibi_types() -> Dict[str, str]:
    """
    Obtiene todos los tipos de chibis de colegiala disponibles con sus descripciones
    
    Returns:
        Dict[str, str]: Diccionario con tipo de chibi y descripción
    """
    return ChibiManager.get_all_chibi_types()

@router.get("/emotional-states")
async def get_emotional_states() -> Dict[str, str]:
    """
    Obtiene descripciones detalladas de todos los estados emocionales de la colegiala
    
    Returns:
        Dict[str, str]: Diccionario con tipo de chibi y descripción emocional detallada
    """
    emotional_states = {}
    for chibi_type in ChibiType:
        emotional_states[chibi_type.value] = ChibiManager.get_emotional_state_description(chibi_type)
    return emotional_states

@router.get("/personality")
async def get_chibi_personality() -> Dict:
    """
    Obtiene información completa sobre la personalidad de la colegiala
    
    Returns:
        Dict: Información de personalidad, hobbies, metas y características
    """
    personality = ChibiConfig.PERSONALITY
    return {
        "name": personality.name,
        "age": personality.age,
        "grade": personality.grade,
        "favorite_subject": personality.favorite_subject.value,
        "least_favorite_subject": personality.least_favorite_subject.value,
        "study_style": personality.study_style,
        "personality_traits": personality.personality_traits,
        "hobbies": personality.hobbies,
        "goals": personality.goals
    }

@router.get("/appearance")
async def get_chibi_appearance() -> Dict:
    """
    Obtiene información sobre la apariencia y características visuales de la colegiala
    
    Returns:
        Dict: Colores del uniforme, accesorios y expresiones faciales
    """
    appearance = ChibiConfig.APPEARANCE
    return {
        "uniform_colors": appearance.UNIFORM_COLORS,
        "school_accessories": appearance.SCHOOL_ACCESSORIES,
        "facial_expressions": appearance.FACIAL_EXPRESSIONS
    }

@router.get("/motivational-messages/{emotional_state}")
async def get_motivational_messages(emotional_state: str) -> Dict[str, Any]:
    """
    Obtiene mensajes motivacionales para un estado emocional específico de la colegiala
    
    Args:
        emotional_state: Estado emocional ("happy_excited", "focused_determined", etc.)
        
    Returns:
        Dict[str, Any]: Estado emocional y lista de mensajes motivacionales
    """
    try:
        messages = MotivationSystem.get_motivational_messages(emotional_state)
        return {
            "emotional_state": emotional_state,
            "messages": messages
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener mensajes motivacionales: {str(e)}")

@router.get("/study-tips/{subject}")
async def get_study_tips(subject: str) -> Dict[str, Any]:
    """
    Obtiene consejos de estudio para una materia específica
    
    Args:
        subject: Materia escolar ("matemáticas", "literatura", "ciencias", etc.)
        
    Returns:
        Dict[str, Any]: Materia y lista de consejos de estudio
    """
    try:
        tips = StudySession.get_study_tips_by_subject(subject)
        
        return {
            "subject": subject,
            "tips": tips
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener consejos de estudio: {str(e)}")

@router.get("/daily-quote")
async def get_daily_quote() -> Dict[str, str]:
    """
    Obtiene una frase motivacional del día para la colegiala
    
    Returns:
        Dict[str, str]: Frase motivacional y su fuente
    """
    try:
        quote = ChibiConfig.get_daily_quote()
        return {
            "quote": quote,
            "source": "Sistema de motivación de Sakura"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener frase del día: {str(e)}")

@router.get("/study-break-activities")
async def get_study_break_activities() -> Dict[str, Any]:
    """
    Obtiene actividades recomendadas para descansos de estudio
    
    Returns:
        Dict[str, Any]: Lista de actividades y recomendación
    """
    try:
        activities = ChibiConfig.get_study_break_activities()
        return {
            "activities": activities,
            "recommendation": "Sakura recomienda tomar descansos regulares para mantener la concentración"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener actividades de descanso: {str(e)}")

@router.get("/school-schedule/{day}")
async def get_school_schedule(day: str) -> Dict:
    """
    Obtiene el horario escolar para un día específico
    
    Args:
        day: Día de la semana (monday, tuesday, etc.)
        
    Returns:
        Dict: Horario escolar del día
    """
    schedule = ChibiConfig.SCHOOL_SCHEDULE.get(day.lower())
    if not schedule:
        raise HTTPException(status_code=404, detail=f"Horario no disponible para {day}")
    
    return {
        "day": day,
        "schedule": [{"time": time, "subject": subject} for time, subject in schedule]
    }

@router.get("/project/{status}/{priority}")
async def get_project_chibi(status: str, priority: str = None) -> Dict[str, str]:
    """
    Obtiene el chibi de colegiala para un proyecto basado en su estado y prioridad
    
    Args:
        status: Estado del proyecto ("activo", "en_pausa", "terminado")
        priority: Prioridad del proyecto ("alta", "media", "baja", None)
        
    Returns:
        Dict[str, str]: Información del chibi incluyendo nombre de archivo, URL y descripción emocional
    """
    try:
        chibi_filename = ChibiManager.get_project_chibi(status, priority)
        chibi_url = ChibiManager.get_chibi_url(chibi_filename)
        
        # Obtener el tipo de chibi para la descripción emocional
        chibi_type = ChibiManager.PROJECT_CHIBIS.get((status, priority))
        if not chibi_type:
            chibi_type = ChibiType.HAPPY_STUDYING
        
        emotional_description = ChibiManager.get_emotional_state_description(chibi_type)
        
        return {
            "chibi_filename": chibi_filename,
            "chibi_url": chibi_url,
            "status": status,
            "priority": priority,
            "emotional_state": chibi_type.value,
            "emotional_description": emotional_description
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener chibi: {str(e)}")

@router.get("/task/{status}/{priority}")
async def get_task_chibi(status: str, priority: str = None) -> Dict[str, str]:
    """
    Obtiene el chibi de colegiala para una tarea basado en su estado y prioridad
    
    Args:
        status: Estado de la tarea ("pendiente", "en_progreso", "completada")
        priority: Prioridad de la tarea ("alta", "media", "baja", None)
        
    Returns:
        Dict[str, str]: Información del chibi incluyendo nombre de archivo, URL y descripción emocional
    """
    try:
        chibi_filename = ChibiManager.get_task_chibi(status, priority)
        chibi_url = ChibiManager.get_chibi_url(chibi_filename)
        
        # Obtener el tipo de chibi para la descripción emocional
        chibi_type = ChibiManager.TASK_CHIBIS.get((status, priority))
        if not chibi_type:
            chibi_type = ChibiType.CONFIDENT_READY
        
        emotional_description = ChibiManager.get_emotional_state_description(chibi_type)
        
        return {
            "chibi_filename": chibi_filename,
            "chibi_url": chibi_url,
            "status": status,
            "priority": priority,
            "emotional_state": chibi_type.value,
            "emotional_description": emotional_description
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener chibi: {str(e)}")

@router.get("/preview")
async def get_chibi_preview() -> Dict[str, List[Dict[str, str]]]:
    """
    Obtiene una vista previa de todos los chibis de colegiala disponibles organizados por tipo
    
    Returns:
        Dict[str, List[Dict[str, str]]]: Lista de chibis organizados por proyectos y tareas
    """
    try:
        # Chibis de proyectos
        project_chibis = []
        project_statuses = ["activo", "en_pausa", "terminado"]
        project_priorities = ["alta", "media", "baja", None]
        
        for status in project_statuses:
            for priority in project_priorities:
                chibi_filename = ChibiManager.get_project_chibi(status, priority)
                chibi_url = ChibiManager.get_chibi_url(chibi_filename)
                
                # Obtener descripción emocional
                chibi_type = ChibiManager.PROJECT_CHIBIS.get((status, priority))
                if not chibi_type:
                    chibi_type = ChibiType.HAPPY_STUDYING
                
                emotional_description = ChibiManager.get_emotional_state_description(chibi_type)
                
                project_chibis.append({
                    "chibi_filename": chibi_filename,
                    "chibi_url": chibi_url,
                    "status": status,
                    "priority": priority or "sin_prioridad",
                    "emotional_state": chibi_type.value,
                    "emotional_description": emotional_description
                })
        
        # Chibis de tareas
        task_chibis = []
        task_statuses = ["pendiente", "en_progreso", "completada"]
        task_priorities = ["alta", "media", "baja", None]
        
        for status in task_statuses:
            for priority in task_priorities:
                chibi_filename = ChibiManager.get_task_chibi(status, priority)
                chibi_url = ChibiManager.get_chibi_url(chibi_filename)
                
                # Obtener descripción emocional
                chibi_type = ChibiManager.TASK_CHIBIS.get((status, priority))
                if not chibi_type:
                    chibi_type = ChibiType.CONFIDENT_READY
                
                emotional_description = ChibiManager.get_emotional_state_description(chibi_type)
                
                task_chibis.append({
                    "chibi_filename": chibi_filename,
                    "chibi_url": chibi_url,
                    "status": status,
                    "priority": priority or "sin_prioridad",
                    "emotional_state": chibi_type.value,
                    "emotional_description": emotional_description
                })
        
        return {
            "projects": project_chibis,
            "tasks": task_chibis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar vista previa: {str(e)}")

@router.get("/random-emotional-state")
async def get_random_emotional_state() -> Dict[str, str]:
    """
    Obtiene un estado emocional aleatorio de la colegiala
    
    Returns:
        Dict[str, str]: Estado emocional aleatorio con descripción
    """
    try:
        import random
        chibi_types = list(ChibiType)
        random_chibi = random.choice(chibi_types)
        
        return {
            "emotional_state": random_chibi.value,
            "emotional_description": ChibiManager.get_emotional_state_description(random_chibi),
            "chibi_filename": f"{random_chibi.value}.png",
            "chibi_url": ChibiManager.get_chibi_url(f"{random_chibi.value}.png")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estado emocional aleatorio: {str(e)}") 