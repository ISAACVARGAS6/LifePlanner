import { useState, useEffect, useCallback } from 'react';
import storageService from '../services/storageService';
import { api } from '../services/api';
import { Project, Task } from '../types';

// Hook para proyectos
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar proyectos
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Usar la API del backend en lugar del almacenamiento local
      const data = await api.projects.list();
      setProjects(data);
      console.log('Proyectos cargados desde API:', data);
    } catch (err) {
      setError('Error cargando proyectos');
      console.error('Error cargando proyectos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar proyecto
  const saveProject = useCallback(async (project: Project) => {
    try {
      if (project.id) {
        // Actualizar proyecto existente
        await api.projects.update(project.id, project);
      } else {
        // Crear nuevo proyecto
        const { id, created_at, updated_at, tasks, ...projectData } = project;
        await api.projects.create(projectData);
      }
      await loadProjects(); // Recargar la lista
      return true;
    } catch (err) {
      setError('Error guardando proyecto');
      console.error('Error guardando proyecto:', err);
      return false;
    }
  }, [loadProjects]);

  // Eliminar proyecto
  const deleteProject = useCallback(async (projectId: number) => {
    try {
      await api.projects.delete(projectId);
      await loadProjects(); // Recargar la lista
      return true;
    } catch (err) {
      setError('Error eliminando proyecto');
      console.error('Error eliminando proyecto:', err);
      return false;
    }
  }, [loadProjects]);

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    loadProjects,
    saveProject,
    deleteProject,
  };
};

// Hook para tareas
export const useTasks = (projectId: number) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar tareas
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Usar la API del backend en lugar del almacenamiento local
      const data = await api.tasks.list(projectId);
      setTasks(data);
      console.log('Tareas cargadas desde API:', data);
    } catch (err) {
      setError('Error cargando tareas');
      console.error('Error cargando tareas:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Guardar tarea
  const saveTask = useCallback(async (task: Task) => {
    try {
      console.log('🔄 Hook: Guardando tarea:', task);
      
      if (task.id) {
        // Actualizar tarea existente
        console.log('📝 Hook: Actualizando tarea existente con ID:', task.id);
        const result = await api.tasks.update(projectId, task.id, task);
        console.log('✅ Hook: Tarea actualizada exitosamente:', result);
      } else {
        // Crear nueva tarea
        console.log('🆕 Hook: Creando nueva tarea');
        const { id, created_at, updated_at, ...taskData } = task;
        const result = await api.tasks.create(projectId, taskData);
        console.log('✅ Hook: Nueva tarea creada exitosamente:', result);
      }
      
      console.log('🔄 Hook: Recargando tareas...');
      await loadTasks(); // Recargar la lista
      console.log('✅ Hook: Tareas recargadas exitosamente');
      return true;
    } catch (err) {
      console.error('❌ Hook: Error guardando tarea:', err);
      setError('Error guardando tarea');
      return false;
    }
  }, [projectId, loadTasks]);

  // Eliminar tarea
  const deleteTask = useCallback(async (taskId: number) => {
    try {
      await api.tasks.delete(taskId);
      await loadTasks(); // Recargar la lista
      return true;
    } catch (err) {
      setError('Error eliminando tarea');
      console.error('Error eliminando tarea:', err);
      return false;
    }
  }, [loadTasks]);

  // Cargar tareas al montar el componente o cambiar projectId
  useEffect(() => {
    if (projectId) {
      loadTasks();
    }
  }, [projectId, loadTasks]);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    saveTask,
    deleteTask,
  };
};

// Hook para preferencias de usuario
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light' as 'light' | 'dark' | 'auto',
    language: 'es' as 'es' | 'en',
    notifications: true,
    chibiEnabled: true,
    autoSave: true,
  });
  const [loading, setLoading] = useState(true);

  // Cargar preferencias
  const loadPreferences = useCallback(async () => {
    try {
      setLoading(true);
      const data = await storageService.getUserPreferences();
      setPreferences(data);
    } catch (err) {
      console.error('Error cargando preferencias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar preferencias
  const savePreferences = useCallback(async (newPreferences: Partial<typeof preferences>) => {
    try {
      await storageService.saveUserPreferences(newPreferences);
      setPreferences(prev => ({ ...prev, ...newPreferences }));
      return true;
    } catch (err) {
      console.error('Error guardando preferencias:', err);
      return false;
    }
  }, []);

  // Cargar preferencias al montar el componente
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    loading,
    savePreferences,
  };
};

// Hook para configuración de la app
export const useAppSettings = () => {
  const [settings, setSettings] = useState({
    lastSync: new Date().toISOString(),
    version: '1.0.0',
    firstLaunch: true,
    tutorialCompleted: false,
  });
  const [loading, setLoading] = useState(true);

  // Cargar configuración
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await storageService.getAppSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error cargando configuración:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar configuración
  const saveSettings = useCallback(async (newSettings: Partial<typeof settings>) => {
    try {
      await storageService.saveAppSettings(newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
      return true;
    } catch (err) {
      console.error('Error guardando configuración:', err);
      return false;
    }
  }, []);

  // Cargar configuración al montar el componente
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    saveSettings,
  };
};

// Hook para estadísticas del chibi
export const useChibiStats = () => {
  const [stats, setStats] = useState({
    totalInteractions: 0,
    favoriteEmotion: 'happy',
    lastInteraction: new Date().toISOString(),
    dailyStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await storageService.getChibiStats();
      setStats(data);
    } catch (err) {
      console.error('Error cargando estadísticas del chibi:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar estadísticas
  const saveStats = useCallback(async (newStats: Partial<typeof stats>) => {
    try {
      await storageService.saveChibiStats(newStats);
      setStats(prev => ({ ...prev, ...newStats }));
      return true;
    } catch (err) {
      console.error('Error guardando estadísticas del chibi:', err);
      return false;
    }
  }, []);

  // Incrementar interacciones
  const incrementInteractions = useCallback(async () => {
    const newTotal = stats.totalInteractions + 1;
    await saveStats({ totalInteractions: newTotal });
  }, [stats.totalInteractions, saveStats]);

  // Actualizar emoción favorita
  const updateFavoriteEmotion = useCallback(async (emotion: string) => {
    await saveStats({ favoriteEmotion: emotion });
  }, [saveStats]);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    saveStats,
    incrementInteractions,
    updateFavoriteEmotion,
  };
};

// Hook para datos de sesión
export const useSessionData = () => {
  const [sessionData, setSessionData] = useState({
    currentSession: new Date().toISOString(),
    totalSessions: 0,
    lastActive: new Date().toISOString(),
    appUsageTime: 0,
  });
  const [loading, setLoading] = useState(true);

  // Cargar datos de sesión
  const loadSessionData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await storageService.getSessionData();
      setSessionData(data);
    } catch (err) {
      console.error('Error cargando datos de sesión:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar datos de sesión
  const saveSessionData = useCallback(async (newData: Partial<typeof sessionData>) => {
    try {
      await storageService.saveSessionData(newData);
      setSessionData(prev => ({ ...prev, ...newData }));
      return true;
    } catch (err) {
      console.error('Error guardando datos de sesión:', err);
      return false;
    }
  }, []);

  // Actualizar tiempo de uso
  const updateUsageTime = useCallback(async (additionalTime: number) => {
    const newUsageTime = sessionData.appUsageTime + additionalTime;
    await saveSessionData({ appUsageTime: newUsageTime });
  }, [sessionData.appUsageTime, saveSessionData]);

  // Incrementar sesiones
  const incrementSessions = useCallback(async () => {
    const newTotal = sessionData.totalSessions + 1;
    await saveSessionData({ totalSessions: newTotal });
  }, [sessionData.totalSessions, saveSessionData]);

  // Cargar datos de sesión al montar el componente
  useEffect(() => {
    loadSessionData();
  }, [loadSessionData]);

  return {
    sessionData,
    loading,
    saveSessionData,
    updateUsageTime,
    incrementSessions,
  };
}; 