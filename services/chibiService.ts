/**
 * Servicio para comunicarse con la API de chibis
 * Maneja todas las interacciones con el backend de Sakura
 */

export interface ChibiInfo {
  chibi_filename: string;
  chibi_url: string;
  status?: string;
  priority?: string;
  emotional_state: string;
  emotional_description: string;
}

export interface PersonalityInfo {
  name: string;
  age: number;
  grade: string;
  favorite_subject: string;
  least_favorite_subject: string;
  study_style: string;
  personality_traits: string[];
  hobbies: string[];
  goals: string[];
}

export interface MotivationalMessage {
  emotional_state: string;
  messages: string[];
}

export interface StudyTips {
  subject: string;
  tips: string[];
}

export interface DailyQuote {
  quote: string;
  source: string;
}

export interface StudyBreakActivities {
  activities: string[];
  recommendation: string;
}

export interface SchoolSchedule {
  day: string;
  schedule: Array<{
    time: string;
    subject: string;
  }>;
}

// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/lifeplanner/chibis';

class ChibiService {
  /**
   * Verifica si el backend está disponible
   */
  async checkBackendConnection(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:8000/lifeplanner/chibis/types', {
        method: 'GET'
      });
      return response.ok;
    } catch (error) {
      console.warn('Backend no disponible:', error);
      return false;
    }
  }

  /**
   * Obtiene información de un chibi para un proyecto
   */
  async getProjectChibi(status: string, priority?: string): Promise<ChibiInfo> {
    try {
      const url = `${API_BASE_URL}/project/${status}/${priority || ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo chibi de proyecto:', error);
      // Retornar datos de fallback
      return {
        chibi_filename: "happy_calm.png",
        chibi_url: "/static/chibis/happy_calm.png",
        status: status,
        priority: priority,
        emotional_state: "happy_calm",
        emotional_description: "Se ve tranquila y contenta, disfrutando del momento con una sonrisa suave."
      };
    }
  }

  /**
   * Obtiene información de un chibi para una tarea
   */
  async getTaskChibi(status: string, priority?: string): Promise<ChibiInfo> {
    try {
      const url = `${API_BASE_URL}/task/${status}/${priority || ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo chibi de tarea:', error);
      // Retornar datos de fallback
      return {
        chibi_filename: "confident_ready.png",
        chibi_url: "/static/chibis/confident_ready.png",
        status: status,
        priority: priority,
        emotional_state: "confident_ready",
        emotional_description: "Se ve segura de sí misma y lista para enfrentar cualquier desafío."
      };
    }
  }

  /**
   * Obtiene información de la personalidad de Sakura
   */
  async getPersonality(): Promise<PersonalityInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/personality`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo personalidad:', error);
      // Retornar datos de fallback
      return {
        name: "Sakura",
        age: 16,
        grade: "3er año de secundaria",
        favorite_subject: "literatura",
        least_favorite_subject: "matemáticas",
        study_style: "organizada y metódica",
        personality_traits: ["Responsable", "Organizada", "Empática", "Perseverante", "Creativa", "Curiosa"],
        hobbies: ["Leer manga y novelas", "Escribir en su diario", "Dibujar", "Escuchar música", "Pasar tiempo con amigos", "Cocinar"],
        goals: ["Sacar buenas notas", "Mejorar en matemáticas", "Participar en el festival cultural", "Hacer nuevos amigos", "Aprender a tocar piano"]
      };
    }
  }

  /**
   * Obtiene mensajes motivacionales para un estado emocional
   */
  async getMotivationalMessages(emotionalState: string): Promise<MotivationalMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}/motivational-messages/${emotionalState}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo mensajes motivacionales:', error);
      // Retornar datos de fallback
      return {
        emotional_state: emotionalState,
        messages: ["Sigue adelante", "Tú puedes", "Eres capaz"]
      };
    }
  }

  /**
   * Obtiene consejos de estudio para una materia
   */
  async getStudyTips(subject: string): Promise<StudyTips> {
    try {
      const response = await fetch(`${API_BASE_URL}/study-tips/${subject}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo consejos de estudio:', error);
      // Retornar datos de fallback
      return {
        subject: subject,
        tips: ["Estudiar con constancia", "Hacer resúmenes", "Practicar regularmente"]
      };
    }
  }

  /**
   * Obtiene la frase motivacional del día
   */
  async getDailyQuote(): Promise<DailyQuote> {
    try {
      const response = await fetch(`${API_BASE_URL}/daily-quote`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo frase del día:', error);
      // Retornar datos de fallback
      return {
        quote: "La educación es el arma más poderosa que puedes usar para cambiar el mundo. - Nelson Mandela",
        source: "Sistema de motivación de Sakura"
      };
    }
  }

  /**
   * Obtiene actividades de descanso de estudio
   */
  async getStudyBreakActivities(): Promise<StudyBreakActivities> {
    try {
      const response = await fetch(`${API_BASE_URL}/study-break-activities`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo actividades de descanso:', error);
      // Retornar datos de fallback
      return {
        activities: [
          "Estirar y hacer ejercicios ligeros",
          "Beber agua y comer algo saludable",
          "Escuchar música relajante",
          "Hacer respiraciones profundas"
        ],
        recommendation: "Sakura recomienda tomar descansos regulares para mantener la concentración"
      };
    }
  }

  /**
   * Obtiene el horario escolar para un día
   */
  async getSchoolSchedule(day: string): Promise<SchoolSchedule> {
    try {
      const response = await fetch(`${API_BASE_URL}/school-schedule/${day}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo horario escolar:', error);
      throw error;
    }
  }

  /**
   * Obtiene un estado emocional aleatorio
   */
  async getRandomEmotionalState(): Promise<ChibiInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/random-emotional-state`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo estado emocional aleatorio:', error);
      // Retornar datos de fallback
      return {
        chibi_filename: "happy_calm.png",
        chibi_url: "/static/chibis/happy_calm.png",
        emotional_state: "happy_calm",
        emotional_description: "Se ve tranquila y contenta, disfrutando del momento con una sonrisa suave."
      };
    }
  }

  /**
   * Obtiene todos los tipos de chibis disponibles
   */
  async getChibiTypes(): Promise<Record<string, string>> {
    try {
      const response = await fetch(`${API_BASE_URL}/types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo tipos de chibis:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los estados emocionales con descripciones
   */
  async getEmotionalStates(): Promise<Record<string, string>> {
    try {
      const response = await fetch(`${API_BASE_URL}/emotional-states`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo estados emocionales:', error);
      throw error;
    }
  }

  /**
   * Construye la URL completa de la imagen del chibi
   */
  getChibiImageUrl(chibiUrl: string): string {
    // Si la URL ya es completa, la devolvemos tal como está
    if (chibiUrl.startsWith('http')) {
      return chibiUrl;
    }
    
    // Si es una URL relativa, la convertimos a completa
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${chibiUrl}`;
  }
}

// Exportar una instancia única del servicio
export const chibiService = new ChibiService();
export default chibiService; 