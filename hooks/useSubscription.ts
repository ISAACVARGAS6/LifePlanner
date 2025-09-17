import { useState, useEffect, useCallback } from 'react';
import subscriptionService, { SubscriptionType } from '../services/subscriptionService';

interface SubscriptionInfo {
  type: SubscriptionType;
  isActive: boolean;
  projectLimit: number;
  taskLimit: number;
  adsEnabled: boolean;
  exportEnabled: boolean;
  advancedStats: boolean;
}

interface SubscriptionFeatures {
  UNLIMITED_PROJECTS: boolean;
  UNLIMITED_TASKS: boolean;
  NO_ADS: boolean;
  EXPORT_ENABLED: boolean;
  ADVANCED_STATS: boolean;
  CUSTOM_THEMES: boolean;
  BACKUP_CLOUD: boolean;
  PRIORITY_SUPPORT: boolean;
}

export const useSubscription = () => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    type: 'free',
    isActive: true,
    projectLimit: 3,
    taskLimit: 10,
    adsEnabled: true,
    exportEnabled: false,
    advancedStats: false,
  });
  const [features, setFeatures] = useState<SubscriptionFeatures>({
    UNLIMITED_PROJECTS: false,
    UNLIMITED_TASKS: false,
    NO_ADS: false,
    EXPORT_ENABLED: false,
    ADVANCED_STATS: false,
    CUSTOM_THEMES: false,
    BACKUP_CLOUD: false,
    PRIORITY_SUPPORT: false,
  });
  const [loading, setLoading] = useState(true);

  // Cargar información de suscripción
  const loadSubscriptionInfo = useCallback(async () => {
    try {
      setLoading(true);
      const info = await subscriptionService.getSubscriptionInfo();
      const availableFeatures = await subscriptionService.getAvailableFeatures();
      
      setSubscriptionInfo(info);
      setFeatures(availableFeatures);
    } catch (error) {
      console.error('Error cargando información de suscripción:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar a premium
  const upgradeToPremium = useCallback(async () => {
    try {
      await subscriptionService.upgradeToPremium();
      await loadSubscriptionInfo(); // Recargar información
      return true;
    } catch (error) {
      console.error('Error actualizando a premium:', error);
      return false;
    }
  }, [loadSubscriptionInfo]);

  // Degradar a gratuito
  const downgradeToFree = useCallback(async () => {
    try {
      await subscriptionService.downgradeToFree();
      await loadSubscriptionInfo(); // Recargar información
      return true;
    } catch (error) {
      console.error('Error degradando a gratuito:', error);
      return false;
    }
  }, [loadSubscriptionInfo]);

  // Verificar si puede crear proyecto
  const canCreateProject = useCallback(async (currentProjectCount: number): Promise<boolean> => {
    try {
      return await subscriptionService.canCreateProject(currentProjectCount);
    } catch (error) {
      console.error('Error verificando límite de proyectos:', error);
      return currentProjectCount < 3; // Límite gratuito por defecto
    }
  }, []);

  // Verificar si puede crear tarea
  const canCreateTask = useCallback(async (currentTaskCount: number): Promise<boolean> => {
    try {
      return await subscriptionService.canCreateTask(currentTaskCount);
    } catch (error) {
      console.error('Error verificando límite de tareas:', error);
      return currentTaskCount < 10; // Límite gratuito por defecto
    }
  }, []);

  // Verificar si los anuncios están habilitados
  const areAdsEnabled = useCallback(async (): Promise<boolean> => {
    try {
      return await subscriptionService.areAdsEnabled();
    } catch (error) {
      console.error('Error verificando anuncios:', error);
      return true; // Por defecto habilitados en gratuito
    }
  }, []);

  // Verificar si la exportación está habilitada
  const isExportEnabled = useCallback(async (): Promise<boolean> => {
    try {
      return await subscriptionService.isExportEnabled();
    } catch (error) {
      console.error('Error verificando exportación:', error);
      return false; // Por defecto deshabilitada en gratuito
    }
  }, []);

  // Verificar si las estadísticas avanzadas están habilitadas
  const areAdvancedStatsEnabled = useCallback(async (): Promise<boolean> => {
    try {
      return await subscriptionService.areAdvancedStatsEnabled();
    } catch (error) {
      console.error('Error verificando estadísticas avanzadas:', error);
      return false; // Por defecto deshabilitadas en gratuito
    }
  }, []);

  // Obtener límite de proyectos
  const getProjectLimit = useCallback(async (): Promise<number> => {
    try {
      return await subscriptionService.getProjectLimit();
    } catch (error) {
      console.error('Error obteniendo límite de proyectos:', error);
      return 3; // Límite gratuito por defecto
    }
  }, []);

  // Obtener límite de tareas
  const getTaskLimit = useCallback(async (): Promise<number> => {
    try {
      return await subscriptionService.getTaskLimit();
    } catch (error) {
      console.error('Error obteniendo límite de tareas:', error);
      return 10; // Límite gratuito por defecto
    }
  }, []);

  // Cargar información al montar el componente
  useEffect(() => {
    loadSubscriptionInfo();
  }, [loadSubscriptionInfo]);

  return {
    subscriptionInfo,
    features,
    loading,
    upgradeToPremium,
    downgradeToFree,
    canCreateProject,
    canCreateTask,
    areAdsEnabled,
    isExportEnabled,
    areAdvancedStatsEnabled,
    getProjectLimit,
    getTaskLimit,
    loadSubscriptionInfo,
  };
}; 