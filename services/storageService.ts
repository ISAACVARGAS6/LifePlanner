import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, Task } from '../types';

// Claves de almacenamiento
const STORAGE_KEYS = {
  PROJECTS: 'lifeplanner_projects',
  TASKS: 'lifeplanner_tasks',
  USER_PREFERENCES: 'lifeplanner_user_preferences',
  APP_SETTINGS: 'lifeplanner_app_settings',
  CHIBI_STATS: 'lifeplanner_chibi_stats',
  AD_STATS: 'lifeplanner_ad_stats',
  SESSION_DATA: 'lifeplanner_session_data',
} as const;

// Tipos de datos
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  notifications: boolean;
  chibiEnabled: boolean;
  autoSave: boolean;
}

interface AppSettings {
  lastSync: string;
  version: string;
  firstLaunch: boolean;
  tutorialCompleted: boolean;
}

interface ChibiStats {
  totalInteractions: number;
  favoriteEmotion: string;
  lastInteraction: string;
  dailyStreak: number;
}

interface SessionData {
  currentSession: string;
  totalSessions: number;
  lastActive: string;
  appUsageTime: number;
}

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // ===== PROYECTOS =====

  /**
   * Guarda todos los proyectos
   */
  async saveProjects(projects: Project[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      console.log('Storage: Proyectos guardados exitosamente');
    } catch (error) {
      console.error('Storage: Error guardando proyectos:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los proyectos
   */
  async getProjects(): Promise<Project[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (data) {
        const projects = JSON.parse(data);
        console.log('Storage: Proyectos cargados exitosamente');
        return projects;
      }
      return [];
    } catch (error) {
      console.error('Storage: Error cargando proyectos:', error);
      return [];
    }
  }

  /**
   * Guarda un proyecto individual
   */
  async saveProject(project: Project): Promise<void> {
    try {
      const projects = await this.getProjects();
      const existingIndex = projects.findIndex(p => p.id === project.id);
      
      if (existingIndex >= 0) {
        projects[existingIndex] = project;
      } else {
        projects.push(project);
      }
      
      await this.saveProjects(projects);
      console.log('Storage: Proyecto guardado exitosamente');
    } catch (error) {
      console.error('Storage: Error guardando proyecto:', error);
      throw error;
    }
  }

  /**
   * Elimina un proyecto
   */
  async deleteProject(projectId: number): Promise<void> {
    try {
      const projects = await this.getProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);
      await this.saveProjects(filteredProjects);
      console.log('Storage: Proyecto eliminado exitosamente');
    } catch (error) {
      console.error('Storage: Error eliminando proyecto:', error);
      throw error;
    }
  }

  // ===== TAREAS =====

  /**
   * Guarda todas las tareas de un proyecto
   */
  async saveTasks(projectId: number, tasks: Task[]): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.TASKS}_${projectId}`;
      await AsyncStorage.setItem(key, JSON.stringify(tasks));
      console.log('Storage: Tareas guardadas exitosamente');
    } catch (error) {
      console.error('Storage: Error guardando tareas:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las tareas de un proyecto
   */
  async getTasks(projectId: number): Promise<Task[]> {
    try {
      const key = `${STORAGE_KEYS.TASKS}_${projectId}`;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const tasks = JSON.parse(data);
        console.log('Storage: Tareas cargadas exitosamente');
        return tasks;
      }
      return [];
    } catch (error) {
      console.error('Storage: Error cargando tareas:', error);
      return [];
    }
  }

  /**
   * Guarda una tarea individual
   */
  async saveTask(projectId: number, task: Task): Promise<void> {
    try {
      const tasks = await this.getTasks(projectId);
      const existingIndex = tasks.findIndex(t => t.id === task.id);
      
      if (existingIndex >= 0) {
        tasks[existingIndex] = task;
      } else {
        tasks.push(task);
      }
      
      await this.saveTasks(projectId, tasks);
      console.log('Storage: Tarea guardada exitosamente');
    } catch (error) {
      console.error('Storage: Error guardando tarea:', error);
      throw error;
    }
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(projectId: number, taskId: number): Promise<void> {
    try {
      const tasks = await this.getTasks(projectId);
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      await this.saveTasks(projectId, filteredTasks);
      console.log('Storage: Tarea eliminada exitosamente');
    } catch (error) {
      console.error('Storage: Error eliminando tarea:', error);
      throw error;
    }
  }

  // ===== PREFERENCIAS DE USUARIO =====

  /**
   * Guarda las preferencias del usuario
   */
  async saveUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const current = await this.getUserPreferences();
      const updated = { ...current, ...preferences };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
      console.log('Storage: Preferencias guardadas exitosamente');
    } catch (error) {
      console.error('Storage: Error guardando preferencias:', error);
      throw error;
    }
  }

  /**
   * Obtiene las preferencias del usuario
   */
  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (data) {
        return JSON.parse(data);
      }
      // Preferencias por defecto
      return {
        theme: 'light',
        language: 'es',
        notifications: true,
        chibiEnabled: true,
        autoSave: true,
      };
    } catch (error) {
      console.error('Storage: Error cargando preferencias:', error);
      return {
        theme: 'light',
        language: 'es',
        notifications: true,
        chibiEnabled: true,
        autoSave: true,
      };
    }
  }

  // ===== CONFIGURACIÓN DE LA APP =====

  /**
   * Guarda la configuración de la app
   */
  async saveAppSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      const current = await this.getAppSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(updated));
      console.log('Storage: Configuración guardada exitosamente');
    } catch (error) {
      console.error('Storage: Error guardando configuración:', error);
      throw error;
    }
  }

  /**
   * Obtiene la configuración de la app
   */
  async getAppSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
      // Configuración por defecto
      return {
        lastSync: new Date().toISOString(),
        version: '1.0.0',
        firstLaunch: true,
        tutorialCompleted: false,
      };
    } catch (error) {
      console.error('Storage: Error cargando configuración:', error);
      return {
        lastSync: new Date().toISOString(),
        version: '1.0.0',
        firstLaunch: true,
        tutorialCompleted: false,
      };
    }
  }

  // ===== ESTADÍSTICAS DEL CHIBI =====

  /**
   * Guarda las estadísticas del chibi
   */
  async saveChibiStats(stats: Partial<ChibiStats>): Promise<void> {
    try {
      const current = await this.getChibiStats();
      const updated = { ...current, ...stats };
      await AsyncStorage.setItem(STORAGE_KEYS.CHIBI_STATS, JSON.stringify(updated));
      console.log('Storage: Estadísticas del chibi guardadas exitosamente');
    } catch (error) {
      console.error('Storage: Error guardando estadísticas del chibi:', error);
      throw error;
    }
  }

  /**
   * Obtiene las estadísticas del chibi
   */
  async getChibiStats(): Promise<ChibiStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHIBI_STATS);
      if (data) {
        return JSON.parse(data);
      }
      // Estadísticas por defecto
      return {
        totalInteractions: 0,
        favoriteEmotion: 'happy',
        lastInteraction: new Date().toISOString(),
        dailyStreak: 0,
      };
    } catch (error) {
      console.error('Storage: Error cargando estadísticas del chibi:', error);
      return {
        totalInteractions: 0,
        favoriteEmotion: 'happy',
        lastInteraction: new Date().toISOString(),
        dailyStreak: 0,
      };
    }
  }

  // ===== DATOS DE SESIÓN =====

  /**
   * Guarda los datos de sesión
   */
  async saveSessionData(data: Partial<SessionData>): Promise<void> {
    try {
      const current = await this.getSessionData();
      const updated = { ...current, ...data };
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(updated));
      console.log('Storage: Datos de sesión guardados exitosamente');
    } catch (error) {
      console.error('Storage: Error guardando datos de sesión:', error);
      throw error;
    }
  }

  /**
   * Obtiene los datos de sesión
   */
  async getSessionData(): Promise<SessionData> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_DATA);
      if (data) {
        return JSON.parse(data);
      }
      // Datos por defecto
      return {
        currentSession: new Date().toISOString(),
        totalSessions: 0,
        lastActive: new Date().toISOString(),
        appUsageTime: 0,
      };
    } catch (error) {
      console.error('Storage: Error cargando datos de sesión:', error);
      return {
        currentSession: new Date().toISOString(),
        totalSessions: 0,
        lastActive: new Date().toISOString(),
        appUsageTime: 0,
      };
    }
  }

  // ===== UTILIDADES =====

  /**
   * Limpia todos los datos
   */
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('Storage: Todos los datos eliminados exitosamente');
    } catch (error) {
      console.error('Storage: Error eliminando todos los datos:', error);
      throw error;
    }
  }

  /**
   * Obtiene el tamaño total de almacenamiento
   */
  async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Storage: Error calculando tamaño:', error);
      return 0;
    }
  }

  /**
   * Exporta todos los datos
   */
  async exportAllData(): Promise<object> {
    try {
      const projects = await this.getProjects();
      const userPreferences = await this.getUserPreferences();
      const appSettings = await this.getAppSettings();
      const chibiStats = await this.getChibiStats();
      const sessionData = await this.getSessionData();
      
      return {
        projects,
        userPreferences,
        appSettings,
        chibiStats,
        sessionData,
        exportDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Storage: Error exportando datos:', error);
      throw error;
    }
  }

  /**
   * Importa datos
   */
  async importData(data: any): Promise<void> {
    try {
      if (data.projects) {
        await this.saveProjects(data.projects);
      }
      if (data.userPreferences) {
        await this.saveUserPreferences(data.userPreferences);
      }
      if (data.appSettings) {
        await this.saveAppSettings(data.appSettings);
      }
      if (data.chibiStats) {
        await this.saveChibiStats(data.chibiStats);
      }
      if (data.sessionData) {
        await this.saveSessionData(data.sessionData);
      }
      
      console.log('Storage: Datos importados exitosamente');
    } catch (error) {
      console.error('Storage: Error importando datos:', error);
      throw error;
    }
  }
}

export default StorageService.getInstance(); 