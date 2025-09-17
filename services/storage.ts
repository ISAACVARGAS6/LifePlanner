import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, Task } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'projects',
  TASKS: 'tasks',
  USER_PREFERENCES: 'userPreferences',
  LAST_SYNC: 'lastSync',
  ONBOARDING_SEEN: 'hasSeenOnboarding'
};

export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error guardando valor:', error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error obteniendo valor:', error);
      return null;
    }
  },

  async saveProjects(projects: Project[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (error) {
      console.error('Error guardando proyectos:', error);
      throw error;
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const projects = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
      return projects ? JSON.parse(projects) : [];
    } catch (error) {
      console.error('Error obteniendo proyectos:', error);
      return [];
    }
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error guardando tareas:', error);
      throw error;
    }
  },

  async getTasks(): Promise<Task[]> {
    try {
      const tasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      return [];
    }
  },

  async saveLastSync(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Error guardando última sincronización:', error);
    }
  },

  async getLastSync(): Promise<Date | null> {
    try {
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return lastSync ? new Date(lastSync) : null;
    } catch (error) {
      console.error('Error obteniendo última sincronización:', error);
      return null;
    }
  },

  async hasSeenOnboarding(): Promise<boolean> {
    try {
      const seen = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN);
      return seen === 'true';
    } catch (error) {
      console.error('Error verificando estado de onboarding:', error);
      return false;
    }
  },

  async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.PROJECTS,
        STORAGE_KEYS.TASKS,
        STORAGE_KEYS.USER_PREFERENCES,
        STORAGE_KEYS.LAST_SYNC,
        STORAGE_KEYS.ONBOARDING_SEEN
      ]);
    } catch (error) {
      console.error('Error limpiando almacenamiento:', error);
      throw error;
    }
  }
}; 