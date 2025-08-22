from typing import Dict, Literal, Optional
from enum import Enum

class ChibiType(Enum):
    # Estados emocionales de la colegiala
    HAPPY_EXCITED = "happy_excited"           # Feliz y emocionada
    HAPPY_CALM = "happy_calm"                 # Feliz y tranquila
    HAPPY_STUDYING = "happy_studying"         # Feliz estudiando
    FOCUSED_DETERMINED = "focused_determined" # Concentrada y determinada
    FOCUSED_STRESSED = "focused_stressed"     # Concentrada pero estresada
    TIRED_BUT_DETERMINED = "tired_but_determined" # Cansada pero determinada
    TIRED_OVERWHELMED = "tired_overwhelmed"   # Cansada y abrumada
    EXCITED_ACHIEVEMENT = "excited_achievement" # Emocionada por logro
    PROUD_ACCOMPLISHED = "proud_accomplished" # Orgullosa de logro
    THOUGHTFUL_PLANNING = "thoughtful_planning" # Pensativa planificando
    CONFIDENT_READY = "confident_ready"       # Confiada y lista
    NERVOUS_UNCERTAIN = "nervous_uncertain"   # Nerviosa e incierta
    RELAXED_BREAK = "relaxed_break"           # Relajada en descanso
    ENERGIZED_MOTIVATED = "energized_motivated" # Energizada y motivada
    DETERMINED_CHALLENGE = "determined_challenge" # Determinada ante desafío

class ChibiManager:
    """Maneja la lógica para determinar qué chibi de colegiala mostrar según el estado y prioridad"""
    
    # Mapeo de chibis para proyectos (estados de la colegiala en proyectos)
    PROJECT_CHIBIS = {
        # Activo - diferentes niveles de energía y enfoque
        ("activo", "alta"): ChibiType.FOCUSED_DETERMINED,
        ("activo", "media"): ChibiType.HAPPY_STUDYING,
        ("activo", "baja"): ChibiType.RELAXED_BREAK,
        ("activo", None): ChibiType.HAPPY_CALM,
        
        # En pausa - estados de reflexión y planificación
        ("en_pausa", "alta"): ChibiType.THOUGHTFUL_PLANNING,
        ("en_pausa", "media"): ChibiType.CONFIDENT_READY,
        ("en_pausa", "baja"): ChibiType.RELAXED_BREAK,
        ("en_pausa", None): ChibiType.THOUGHTFUL_PLANNING,
        
        # Terminado - estados de logro y satisfacción
        ("terminado", "alta"): ChibiType.EXCITED_ACHIEVEMENT,
        ("terminado", "media"): ChibiType.PROUD_ACCOMPLISHED,
        ("terminado", "baja"): ChibiType.HAPPY_CALM,
        ("terminado", None): ChibiType.PROUD_ACCOMPLISHED,
    }
    
    # Mapeo de chibis para tareas (estados de la colegiala en tareas)
    TASK_CHIBIS = {
        # Pendiente - estados de preparación y anticipación
        ("pendiente", "alta"): ChibiType.DETERMINED_CHALLENGE,
        ("pendiente", "media"): ChibiType.CONFIDENT_READY,
        ("pendiente", "baja"): ChibiType.HAPPY_CALM,
        ("pendiente", None): ChibiType.CONFIDENT_READY,
        
        # En progreso - estados de trabajo y esfuerzo
        ("en_progreso", "alta"): ChibiType.FOCUSED_STRESSED,
        ("en_progreso", "media"): ChibiType.FOCUSED_DETERMINED,
        ("en_progreso", "baja"): ChibiType.HAPPY_STUDYING,
        ("en_progreso", None): ChibiType.FOCUSED_DETERMINED,
        
        # Completada - estados de logro y satisfacción
        ("completada", "alta"): ChibiType.EXCITED_ACHIEVEMENT,
        ("completada", "media"): ChibiType.PROUD_ACCOMPLISHED,
        ("completada", "baja"): ChibiType.HAPPY_CALM,
        ("completada", None): ChibiType.PROUD_ACCOMPLISHED,
    }
    
    @staticmethod
    def get_project_chibi(status: str, priority: Optional[str]) -> str:
        """
        Determina el chibi de colegiala para un proyecto basado en su estado y prioridad
        
        Args:
            status: Estado del proyecto ("activo", "en_pausa", "terminado")
            priority: Prioridad del proyecto ("alta", "media", "baja", None)
            
        Returns:
            str: Nombre del archivo de imagen del chibi
        """
        chibi_type = ChibiManager.PROJECT_CHIBIS.get((status, priority))
        if not chibi_type:
            # Fallback al estado activo con prioridad media
            chibi_type = ChibiType.HAPPY_STUDYING
            
        return f"{chibi_type.value}.png"
    
    @staticmethod
    def get_task_chibi(status: str, priority: Optional[str]) -> str:
        """
        Determina el chibi de colegiala para una tarea basado en su estado y prioridad
        
        Args:
            status: Estado de la tarea ("pendiente", "en_progreso", "completada")
            priority: Prioridad de la tarea ("alta", "media", "baja", None)
            
        Returns:
            str: Nombre del archivo de imagen del chibi
        """
        chibi_type = ChibiManager.TASK_CHIBIS.get((status, priority))
        if not chibi_type:
            # Fallback al estado pendiente con prioridad media
            chibi_type = ChibiType.CONFIDENT_READY
            
        return f"{chibi_type.value}.png"
    
    @staticmethod
    def get_chibi_url(chibi_filename: str, base_url: str = "/static/chibis/") -> str:
        """
        Genera la URL completa para el chibi
        
        Args:
            chibi_filename: Nombre del archivo del chibi
            base_url: URL base donde se almacenan los chibis
            
        Returns:
            str: URL completa del chibi
        """
        return f"{base_url.rstrip('/')}/{chibi_filename}"
    
    @staticmethod
    def get_all_chibi_types() -> Dict[str, str]:
        """
        Retorna todos los tipos de chibis de colegiala disponibles con sus descripciones
        
        Returns:
            Dict[str, str]: Diccionario con tipo de chibi y descripción
        """
        return {
            # Estados emocionales generales
            "happy_excited": "Colegiala feliz y emocionada",
            "happy_calm": "Colegiala feliz y tranquila",
            "happy_studying": "Colegiala feliz estudiando",
            "focused_determined": "Colegiala concentrada y determinada",
            "focused_stressed": "Colegiala concentrada pero estresada",
            "tired_but_determined": "Colegiala cansada pero determinada",
            "tired_overwhelmed": "Colegiala cansada y abrumada",
            "excited_achievement": "Colegiala emocionada por logro",
            "proud_accomplished": "Colegiala orgullosa de logro",
            "thoughtful_planning": "Colegiala pensativa planificando",
            "confident_ready": "Colegiala confiada y lista",
            "nervous_uncertain": "Colegiala nerviosa e incierta",
            "relaxed_break": "Colegiala relajada en descanso",
            "energized_motivated": "Colegiala energizada y motivada",
            "determined_challenge": "Colegiala determinada ante desafío",
        }
    
    @staticmethod
    def get_emotional_state_description(chibi_type: ChibiType) -> str:
        """
        Obtiene una descripción detallada del estado emocional de la colegiala
        
        Args:
            chibi_type: Tipo de chibi
            
        Returns:
            str: Descripción del estado emocional
        """
        descriptions = {
            ChibiType.HAPPY_EXCITED: "¡Está muy emocionada! Sus ojos brillan con entusiasmo y tiene una sonrisa radiante.",
            ChibiType.HAPPY_CALM: "Se ve tranquila y contenta, disfrutando del momento con una sonrisa suave.",
            ChibiType.HAPPY_STUDYING: "Está estudiando con alegría, disfrutando del proceso de aprendizaje.",
            ChibiType.FOCUSED_DETERMINED: "Concentrada en su objetivo, muestra determinación y enfoque.",
            ChibiType.FOCUSED_STRESSED: "Está trabajando duro pero se nota algo de tensión en su expresión.",
            ChibiType.TIRED_BUT_DETERMINED: "Aunque está cansada, mantiene su determinación y sigue adelante.",
            ChibiType.TIRED_OVERWHELMED: "Se ve agotada y un poco abrumada, necesita un descanso.",
            ChibiType.EXCITED_ACHIEVEMENT: "¡Está súper emocionada por su logro! Sus ojos brillan de felicidad.",
            ChibiType.PROUD_ACCOMPLISHED: "Se ve orgullosa y satisfecha con lo que ha logrado.",
            ChibiType.THOUGHTFUL_PLANNING: "Está pensando y planificando su siguiente paso con cuidado.",
            ChibiType.CONFIDENT_READY: "Se ve segura de sí misma y lista para enfrentar cualquier desafío.",
            ChibiType.NERVOUS_UNCERTAIN: "Se nota un poco nerviosa e insegura sobre lo que viene.",
            ChibiType.RELAXED_BREAK: "Está relajada, tomándose un merecido descanso.",
            ChibiType.ENERGIZED_MOTIVATED: "¡Está llena de energía y motivación! Lista para cualquier cosa.",
            ChibiType.DETERMINED_CHALLENGE: "Se ve decidida a enfrentar el desafío que tiene por delante.",
        }
        return descriptions.get(chibi_type, "Estado emocional no definido") 