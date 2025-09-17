import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Project, ProjectWithProgress } from '../../types';
import { SakuraColors } from '../../constants/Colors';
import { SakuraStyles } from '../../constants/Styles';
import DynamicChibi from '../../components/DynamicChibi';
import ProgressBar from '../../components/ProgressBar';
import adMobService from '../../services/adMobService';
import { api } from '../../services/api';
import { useSubscription } from '../../hooks/useSubscription';
import { getProjectWithTasksEmotion } from '../../hooks/useChibiEmotionSimple';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<ProjectWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { subscriptionInfo, canCreateProject, upgradeToPremium } = useSubscription();
  const [refreshing, setRefreshing] = useState(false);
  const [celebratingProject, setCelebratingProject] = useState<number | null>(null);
  const router = useRouter();

  const navigateToHome = () => {
    router.push('/home');
  };

  // Función para calcular el progreso de un proyecto
  const calculateProjectProgress = (project: Project): ProjectWithProgress => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === 'completada').length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return {
      ...project,
      progress,
      totalTasks,
      completedTasks,
    };
  };

  // Función para calcular el progreso total de todos los proyectos
  const calculateTotalProgress = () => {
    if (projects.length === 0) return { totalProgress: 0, totalTasks: 0, completedTasks: 0 };
    
    const totalTasks = projects.reduce((sum, project) => sum + project.totalTasks, 0);
    const completedTasks = projects.reduce((sum, project) => sum + project.completedTasks, 0);
    const totalProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return { totalProgress, totalTasks, completedTasks };
  };

  const renderTotalProgress = () => {
    const { totalProgress, totalTasks, completedTasks } = calculateTotalProgress();
    
    if (totalTasks === 0) return null;
    
    return (
      <View style={styles.totalProgressContainer}>
        <Text style={styles.totalProgressTitle}>Progreso General</Text>
        <ProgressBar
          progress={totalProgress}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          showText={true}
          height={12}
          borderRadius={6}
        />
      </View>
    );
  };

  // Cargar proyectos desde el backend
  const loadProjects = async () => {
    try {
      console.log('ProjectsScreen: Iniciando carga de proyectos...');
      setLoading(true);
      setError(null);
      
      // Probar la conexión primero
      const isConnected = await api.testConnection();
      console.log('ProjectsScreen: Conexión al API:', isConnected);
      
      if (!isConnected) {
        throw new Error('No se pudo conectar al servidor');
      }
      
      const data = await api.projects.list();
      console.log('ProjectsScreen: Proyectos cargados exitosamente:', data.length);
      
      // Calcular el progreso para cada proyecto
      const projectsWithProgress = data.map(calculateProjectProgress);
      
      // Verificar si algún proyecto se completó para mostrar celebración
      projectsWithProgress.forEach(project => {
        if (project.progress === 100 && project.status !== 'terminado') {
          console.log('🎉 Proyecto completado! Mostrando chibi de éxito');
          setCelebratingProject(project.id);
          
          // Ocultar la celebración después de 4 segundos
          setTimeout(() => {
            setCelebratingProject(null);
          }, 4000);
        }
      });
      
      setProjects(projectsWithProgress);
    } catch (err) {
      console.error('ProjectsScreen: Error cargando proyectos:', err);
      setError('Error cargando proyectos: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // Función de prueba directa
  const testApiDirectly = async () => {
    try {
      console.log('ProjectsScreen: Prueba directa del API...');
      
      // Probar health check
      const response = await fetch('http://localhost:8000/lifeplanner/health');
      console.log('ProjectsScreen: Health check response:', response.status);
      
      // Probar listar proyectos
      const projectsResponse = await fetch('http://localhost:8000/lifeplanner/projects/');
      console.log('ProjectsScreen: Projects response:', projectsResponse.status);
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        console.log('ProjectsScreen: Proyectos obtenidos directamente:', projectsData.length);
        
        // Calcular el progreso para cada proyecto
        const projectsWithProgress = projectsData.map(calculateProjectProgress);
        setProjects(projectsWithProgress);
        setError(null);
      } else {
        console.error('ProjectsScreen: Error en respuesta directa:', projectsResponse.status);
        setError('Error en respuesta del servidor: ' + projectsResponse.status);
      }
    } catch (err) {
      console.error('ProjectsScreen: Error en prueba directa:', err);
      setError('Error en prueba directa: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  // Log de depuración
  useEffect(() => {
    console.log('ProjectsScreen: Estado actual:', { projects: projects.length, loading, error });
  }, [projects, loading, error]);

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();
  }, []);

  const onRefresh = async () => {
    console.log('ProjectsScreen: Iniciando refresh...');
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
    console.log('ProjectsScreen: Refresh completado');
  };

  const handleProjectPress = async (project: ProjectWithProgress) => {
    // Mostrar anuncio de agradecimiento al interactuar con proyectos
    await adMobService.showThankYouAd();
    router.push(`/projects/${project.id}/tasks`);
  };

  const handleCreateProject = async () => {
    // Verificar límite de proyectos
    const canCreate = await canCreateProject(projects.length);
    
    if (!canCreate) {
      Alert.alert(
        'Límite de Proyectos Alcanzado',
        `Has alcanzado el límite de ${subscriptionInfo.projectLimit} proyectos en la versión gratuita.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Actualizar a Premium', 
            onPress: async () => {
              const success = await upgradeToPremium();
              if (success) {
                Alert.alert('¡Éxito!', 'Has sido actualizado a Premium. Ahora puedes crear proyectos ilimitados.');
                router.push('/projects/create');
              } else {
                Alert.alert('Error', 'No se pudo actualizar a Premium. Inténtalo de nuevo.');
              }
            }
          }
        ]
      );
      return;
    }

    router.push('/projects/create');
  };

  const handleDeleteProject = async (projectId: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.projects.delete(projectId);
              Alert.alert('Éxito', 'Proyecto eliminado correctamente.');
              loadProjects(); // Recargar la lista después de la eliminación
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar el proyecto.');
              console.error('Error al eliminar proyecto:', err);
            }
          }
        }
      ]
    );
  };

  const getChibiType = (project: ProjectWithProgress): string => {
    return getProjectWithTasksEmotion(project);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return SakuraColors.warning;
      case 'en_progreso':
      case 'en progreso':
        return SakuraColors.primary;
      case 'completada':
      case 'terminado':
        return SakuraColors.success;
      default:
        return SakuraColors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return SakuraColors.error;
      case 'Media':
        return SakuraColors.warning;
      case 'Baja':
        return SakuraColors.success;
      default:
        return SakuraColors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    console.log('🔍 getStatusIcon llamado con status:', status);
    let iconName = 'ellipse-outline'; // default
    
    switch (status.toLowerCase()) {
      case 'pendiente':
        iconName = 'ellipse-outline';
        break;
      case 'en_progreso':
      case 'en progreso':
        iconName = 'refresh-outline';
        break;
      case 'completada':
      case 'terminado':
        iconName = 'checkmark-circle-outline';
        break;
      default:
        iconName = 'ellipse-outline';
    }
    
    console.log('🎯 Ícono seleccionado:', iconName);
    return iconName;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) {
      return SakuraColors.success;
    }
    return SakuraColors.primary;
  };

  const renderProject = ({ item }: { item: ProjectWithProgress }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => handleProjectPress(item)}
    >
      {/* Indicador de progreso en la parte superior */}
      <View style={styles.progressIndicator}>
        <View style={[styles.progressCircle, { borderColor: getProgressColor(item.progress) }]}>
          <Text style={[styles.progressCircleText, { color: getProgressColor(item.progress) }]}>
            {Math.round(item.progress)}%
          </Text>
        </View>
      </View>
      
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <View style={styles.projectActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteProject(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={SakuraColors.error} />
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color={SakuraColors.textSecondary} />
        </View>
      </View>
      
      {item.description && (
        <Text style={styles.projectDescription}>{item.description}</Text>
      )}
      
      {/* Barra de progreso */}
      <View style={styles.progressSection}>
        <ProgressBar
          progress={item.progress}
          totalTasks={item.totalTasks}
          completedTasks={item.completedTasks}
          showText={true}
          height={10}
          borderRadius={5}
        />
      </View>
      
      <View style={styles.projectMeta}>
        <View style={styles.projectStatusContainer}>
          <View style={styles.statusTextContainer}>
            <Text style={styles.projectStatus}>Estado: {item.status}</Text>
            <Ionicons 
              name={getStatusIcon(item.status) as any} 
              size={16} 
              color={getStatusColor(item.status)} 
              style={styles.statusIcon}
            />
          </View>
        </View>
        <View style={styles.projectInfoContainer}>
          {item.priority && (
            <View style={styles.priorityContainer}>
              <Text style={styles.projectPriority} numberOfLines={1}>Prioridad</Text>
              <View style={[styles.priorityCircle, { backgroundColor: getPriorityColor(item.priority) }]} />
            </View>
          )}
          {item.deadline && (
            <View style={styles.deadlineContainer}>
              <Text style={styles.projectDeadline} numberOfLines={1}>Fecha límite</Text>
              <Text style={styles.deadlineDate} numberOfLines={1}>
                {new Date(item.deadline).toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: '2-digit' 
                })}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSubscriptionInfo = () => {
    if (subscriptionInfo.type === 'free') {
      return (
        <View style={styles.subscriptionInfo}>
          <Ionicons name="information-circle" size={16} color={SakuraColors.warning} />
          <Text style={styles.subscriptionText}>
            {projects.length}/{subscriptionInfo.projectLimit} proyectos (Gratuito)
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={navigateToHome}
        >
          <Ionicons name="arrow-back" size={24} color={SakuraColors.textLight} />
          <Text style={styles.backButtonText}>Inicio</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Proyectos</Text>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {renderTotalProgress()}
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando proyectos...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadProjects}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : projects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <DynamicChibi emotion="neutral" />
            <Text style={styles.emptyTitle}>No hay proyectos aún</Text>
            <Text style={styles.emptySubtitle}>
              ¡Crea tu primer proyecto para comenzar a organizarte!
            </Text>
            <TouchableOpacity
              style={styles.createFirstProjectButton}
              onPress={handleCreateProject}
            >
              <Text style={styles.createFirstProjectButtonText}>
                Crear Primer Proyecto
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProject}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.projectsList}
          />
        )}
      </View>
      
      <TouchableOpacity style={styles.fab} onPress={handleCreateProject}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Chibi flotante */}
      <View style={styles.chibiContainer}>
        <DynamicChibi 
          emotion={projects.length > 0 ? getProjectWithTasksEmotion(projects[0]) : 'neutral'} 
          size="small"
          showMessage={false}
        />
      </View>

      {/* Chibi de celebración cuando se completa un proyecto */}
      {celebratingProject && (
        <View style={styles.celebrationChibiContainer}>
          <DynamicChibi 
            emotion="success" 
            size="large"
            showMessage={true}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SakuraColors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: SakuraColors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: SakuraColors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: SakuraColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectCard: {
    backgroundColor: SakuraColors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    paddingTop: 50, // Espacio extra para el indicador de progreso
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 8,
    zIndex: 1,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: SakuraColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    flex: 1,
    flexWrap: 'wrap',
  },
  projectDescription: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  projectStatus: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
  },
  statusIcon: {
    marginLeft: 6,
  },
  projectActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SakuraColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chibiContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 10,
  },
  celebrationChibiContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    zIndex: 1000,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SakuraColors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subscriptionText: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    marginLeft: 5,
  },
  debugInfo: {
    backgroundColor: SakuraColors.surface,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  debugText: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
  },
  addButton: {
    padding: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    padding: 8,
    marginRight: 10,
  },
  totalProgressContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: SakuraColors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalProgressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  projectInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    minWidth: 80,
  },
  priorityCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
  },
  projectPriority: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    fontWeight: '500',
    flexShrink: 0,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectDeadline: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    fontWeight: '500',
  },
  deadlineDate: {
    fontSize: 12,
    color: SakuraColors.textPrimary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: SakuraColors.textLight,
    marginLeft: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: SakuraColors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  createFirstProjectButton: {
    backgroundColor: SakuraColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  createFirstProjectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectsList: {
    paddingBottom: 80, // Espacio para el FAB
  },
}); 