"""
Configuración específica para la colegiala chibi
Define características, personalidad y preferencias de la colegiala
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

class SchoolSubject(Enum):
    """Materias escolares que puede estar estudiando la colegiala"""
    MATH = "matemáticas"
    SCIENCE = "ciencias"
    HISTORY = "historia"
    LITERATURE = "literatura"
    ART = "arte"
    PHYSICAL_EDUCATION = "educación física"
    MUSIC = "música"
    COMPUTER_SCIENCE = "informática"
    LANGUAGE = "idiomas"
    PHILOSOPHY = "filosofía"

class StudyMood(Enum):
    """Estados de ánimo para estudiar"""
    ENTHUSIASTIC = "entusiasta"
    FOCUSED = "concentrada"
    TIRED = "cansada"
    STRESSED = "estresada"
    CONFIDENT = "confiada"
    NERVOUS = "nerviosa"

@dataclass
class ChibiPersonality:
    """Personalidad de la colegiala chibi"""
    name: str = "Sakura"
    age: int = 16
    grade: str = "3er año de secundaria"
    favorite_subject: SchoolSubject = SchoolSubject.LITERATURE
    least_favorite_subject: SchoolSubject = SchoolSubject.MATH
    study_style: str = "organizada y metódica"
    personality_traits: List[str] = None
    hobbies: List[str] = None
    goals: List[str] = None
    
    def __post_init__(self):
        if self.personality_traits is None:
            self.personality_traits = [
                "Responsable",
                "Organizada",
                "Empática",
                "Perseverante",
                "Creativa",
                "Curiosa"
            ]
        
        if self.hobbies is None:
            self.hobbies = [
                "Leer manga y novelas",
                "Escribir en su diario",
                "Dibujar",
                "Escuchar música",
                "Pasar tiempo con amigos",
                "Cocinar"
            ]
        
        if self.goals is None:
            self.goals = [
                "Sacar buenas notas",
                "Mejorar en matemáticas",
                "Participar en el festival cultural",
                "Hacer nuevos amigos",
                "Aprender a tocar piano"
            ]

class ChibiAppearance:
    """Características visuales de la colegiala chibi"""
    
    # Colores del uniforme escolar
    UNIFORM_COLORS = {
        "primary": "#2E4A8C",      # Azul marino del uniforme
        "secondary": "#FFFFFF",     # Blanco de la camisa
        "accent": "#FF6B9D",       # Rosa para detalles
        "shoes": "#8B4513",        # Marrón de los zapatos
        "hair": "#8B4513",         # Castaño del cabello
        "eyes": "#4A90E2"          # Azul de los ojos
    }
    
    # Accesorios escolares
    SCHOOL_ACCESSORIES = [
        "mochila escolar",
        "lápices y cuadernos",
        "calculadora",
        "regla",
        "compás",
        "diccionario",
        "agenda escolar"
    ]
    
    # Expresiones faciales características
    FACIAL_EXPRESSIONS = {
        "happy": "Sonrisa brillante y ojos brillantes",
        "focused": "Cejas ligeramente fruncidas, boca concentrada",
        "tired": "Ojos ligeramente cerrados, expresión cansada",
        "excited": "Ojos muy abiertos, sonrisa amplia",
        "nervous": "Mordiendo el labio, ojos inquietos",
        "proud": "Cabeza alta, sonrisa satisfecha",
        "thoughtful": "Cejas arqueadas, expresión pensativa"
    }

class StudySession:
    """Configuración para sesiones de estudio"""
    
    @staticmethod
    def get_study_tips_by_subject(subject) -> List[str]:
        """Obtiene consejos de estudio específicos por materia"""
        tips = {
            SchoolSubject.MATH: [
                "Hacer muchos ejercicios prácticos",
                "Usar colores para fórmulas importantes",
                "Crear tarjetas de memoria",
                "Practicar con problemas del mundo real"
            ],
            SchoolSubject.SCIENCE: [
                "Hacer experimentos en casa",
                "Crear diagramas y mapas conceptuales",
                "Ver videos educativos",
                "Relacionar conceptos con la vida diaria"
            ],
            SchoolSubject.LITERATURE: [
                "Leer en voz alta",
                "Subrayar pasajes importantes",
                "Escribir resúmenes",
                "Discutir con compañeros"
            ],
            SchoolSubject.HISTORY: [
                "Crear líneas de tiempo",
                "Hacer mapas mentales",
                "Relacionar eventos históricos",
                "Ver documentales"
            ],
            SchoolSubject.ART: [
                "Practicar técnicas básicas",
                "Observar obras de arte",
                "Experimentar con diferentes materiales",
                "Mantener un sketchbook"
            ]
        }
        
        # Si es un string, buscar por valor
        if isinstance(subject, str):
            for enum_value in SchoolSubject:
                if enum_value.value == subject:
                    return tips.get(enum_value, ["Estudiar con constancia", "Hacer resúmenes", "Practicar regularmente"])
            # Si no se encuentra, devolver consejos genéricos
            return ["Estudiar con constancia", "Hacer resúmenes", "Practicar regularmente"]
        
        # Si es un enum, usar directamente
        return tips.get(subject, ["Estudiar con constancia", "Hacer resúmenes", "Practicar regularmente"])

class MotivationSystem:
    """Sistema de motivación para la colegiala"""
    
    @staticmethod
    def get_motivational_messages(emotional_state: str) -> List[str]:
        """Obtiene mensajes motivacionales según el estado emocional"""
        messages = {
            "happy_excited": [
                "¡Sigue así! Tu entusiasmo es contagioso",
                "Tu energía positiva te llevará lejos",
                "¡Eres increíble! Mantén esa actitud"
            ],
            "focused_determined": [
                "Tu concentración es admirable",
                "Cada paso cuenta, sigue adelante",
                "Tu determinación te hará alcanzar tus metas"
            ],
            "tired_but_determined": [
                "Aunque estés cansada, no te rindes",
                "Tu perseverancia es inspiradora",
                "Descansa un poco, pero no te detengas"
            ],
            "nervous_uncertain": [
                "Respira profundo, tú puedes con esto",
                "La incertidumbre es parte del crecimiento",
                "Confía en ti misma, eres más fuerte de lo que crees"
            ],
            "proud_accomplished": [
                "¡Felicidades! Te lo mereces",
                "Tu esfuerzo ha dado frutos",
                "Eres un ejemplo de dedicación"
            ],
            "happy_calm": [
                "Tu tranquilidad es admirable",
                "Disfruta del momento presente",
                "Tu paz interior te ayuda a avanzar"
            ],
            "happy_studying": [
                "¡Qué bien se ve estudiando!",
                "El aprendizaje es un regalo",
                "Disfruta cada momento de estudio"
            ],
            "focused_stressed": [
                "Respira profundo, tú puedes",
                "La presión te hace más fuerte",
                "Mantén la calma, todo saldrá bien"
            ],
            "tired_overwhelmed": [
                "Es normal sentirse así a veces",
                "Tómate un descanso, te lo mereces",
                "Mañana será un nuevo día"
            ],
            "excited_achievement": [
                "¡Felicidades por tu logro!",
                "Tu esfuerzo ha valido la pena",
                "¡Eres increíble!"
            ],
            "thoughtful_planning": [
                "La planificación es clave",
                "Cada paso cuenta",
                "Tu organización te llevará lejos"
            ],
            "confident_ready": [
                "¡Tú puedes con todo!",
                "Tu confianza te hace invencible",
                "Estás lista para cualquier desafío"
            ],
            "relaxed_break": [
                "Disfruta tu descanso",
                "Recarga energías",
                "Volverás con más fuerza"
            ],
            "energized_motivated": [
                "¡Tu energía es contagiosa!",
                "¡Nada puede detenerte!",
                "¡Eres una fuerza de la naturaleza!"
            ],
            "determined_challenge": [
                "¡Enfrenta el desafío!",
                "Tu determinación es admirable",
                "¡Tú puedes con esto!"
            ]
        }
        return messages.get(emotional_state, ["Sigue adelante", "Tú puedes", "Eres capaz"])

class ChibiConfig:
    """Configuración principal de la colegiala chibi"""
    
    # Instancia de personalidad
    PERSONALITY = ChibiPersonality()
    
    # Instancia de apariencia
    APPEARANCE = ChibiAppearance()
    
    # Horario escolar típico
    SCHOOL_SCHEDULE = {
        "monday": [
            ("08:00", "Matemáticas"),
            ("09:00", "Historia"),
            ("10:00", "Recreo"),
            ("10:30", "Literatura"),
            ("11:30", "Ciencias"),
            ("12:30", "Almuerzo"),
            ("13:30", "Educación Física"),
            ("14:30", "Arte")
        ],
        "tuesday": [
            ("08:00", "Ciencias"),
            ("09:00", "Matemáticas"),
            ("10:00", "Recreo"),
            ("10:30", "Idiomas"),
            ("11:30", "Historia"),
            ("12:30", "Almuerzo"),
            ("13:30", "Informática"),
            ("14:30", "Música")
        ]
    }
    
    @staticmethod
    def get_daily_quote() -> str:
        """Obtiene una frase motivacional del día"""
        quotes = [
            "La educación es el arma más poderosa que puedes usar para cambiar el mundo. - Nelson Mandela",
            "El éxito no es final, el fracaso no es fatal: lo que cuenta es el coraje para continuar. - Winston Churchill",
            "La mente es como un paracaídas, solo funciona si se abre. - Albert Einstein",
            "El aprendizaje es un tesoro que seguirá a su dueño a todas partes. - Proverbio chino",
            "La educación no es preparación para la vida; la educación es la vida misma. - John Dewey"
        ]
        import random
        return random.choice(quotes)
    
    @staticmethod
    def get_study_break_activities() -> List[str]:
        """Obtiene actividades para descansos de estudio"""
        return [
            "Estirar y hacer ejercicios ligeros",
            "Beber agua y comer algo saludable",
            "Escuchar música relajante",
            "Hacer respiraciones profundas",
            "Caminar un poco por la habitación",
            "Hablar con un amigo por teléfono",
            "Dibujar o colorear",
            "Leer algo divertido"
        ] 