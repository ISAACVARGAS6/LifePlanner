import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../../../../types';
import { SakuraColors } from '../../../../constants/Colors';
import { SakuraStyles } from '../../../../constants/Styles';
import DynamicChibi from '../../../../components/DynamicChibi';
import adMobService from '../../../../services/adMobService';
import { useTasks } from '../../../../hooks/useStorage';
import { useSubscription } from '../../../../hooks/useSubscription';
import { api } from '../../../../services/api';
import { getTaskListEmotion } from '../../../../hooks/useChibiEmotionSimple';

export default function TasksScreen() {
  const { id } = useLocalSearchParams();
  const projectId = Number(id);
  const { tasks, loading, error, loadTasks, saveTask, deleteTask } = useTasks(projectId);
  const { subscriptionInfo, canCreateTask, upgradeToPremium } = useSubscription();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleTaskPress = async (task: Task) => {
    // Mostrar anuncio de agradecimiento al interactuar con tareas
    await adMobService.showThankYouAd();
    // Aquí podrías navegar a la edición de la tarea
  };

  const handleCreateTask = async () => {
    // Verificar límite de tareas
    const canCreate = await canCreateTask(tasks.length);
    
    if (!canCreate) {
      Alert.alert(
        'Límite de Tareas Alcanzado',
        `Has alcanzado el límite de ${subscriptionInfo.taskLimit} tareas por proyecto en la versión gratuita.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Actualizar a Premium', 
            onPress: async () => {
              const success = await upgradeToPremium();
              if (success) {
                Alert.alert('¡Éxito!', 'Has sido actualizado a Premium. Ahora puedes crear tareas ilimitadas.');
                router.push(`/projects/${id}/tasks/create`);
              } else {
                Alert.alert('Error', 'No se pudo actualizar a Premium. Inténtalo de nuevo.');
              }
            }
          }
        ]
      );
      return;
    }

    router.push(`/projects/${id}/tasks/create`);
  };

  const handleDeleteTask = async (taskId: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteTask(taskId);
            if (!success) {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            }
          }
        }
      ]
    );
  };

  const [celebratingTask, setCelebratingTask] = useState<number | null>(null);

  const handleStatusChange = async (task: Task) => {
    console.log('🔄 Cambiando estado de tarea:', task.id, 'de', task.status);
    
    try {
      // Usar la función toggleStatus específica para estados
      const updatedTask = await api.tasks.toggleStatus(projectId, task);
      console.log('✅ Tarea actualizada exitosamente:', updatedTask);
      
      // Recargar las tareas para mostrar el cambio
      await loadTasks();
      
      // Mostrar chibi de celebración si se completó la tarea
      if (updatedTask.status === 'completada') {
        console.log('🎉 Tarea completada! Mostrando chibi de éxito');
        setCelebratingTask(task.id);
        
        // Ocultar la celebración después de 3 segundos
        setTimeout(() => {
          setCelebratingTask(null);
        }, 3000);
      }
    } catch (error) {
      console.error('💥 Excepción al cambiar estado:', error);
      Alert.alert('Error', 'No se pudo cambiar el estado de la tarea');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return SakuraColors.warning;
      case 'en_progreso':
      case 'en progreso':
        return SakuraColors.primary;
      case 'completada':
        return SakuraColors.success;
      default:
        return SakuraColors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return SakuraColors.error;
      case 'media':
        return SakuraColors.warning;
      case 'baja':
        return SakuraColors.success;
      default:
        return SakuraColors.textSecondary;
    }
  };

  const getChibiType = (task: Task): string => {
    // Lógica simple para determinar la emoción de una tarea individual
    if (task.status === 'completada') {
      return 'success';
    }
    
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const now = new Date();
      if (dueDate < now) {
        return 'sad';
      }
    }
    
    if (task.priority === 'alta') {
      return 'angry';
    }
    
    return 'happy';
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => handleTaskPress(item)}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={styles.taskActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleStatusChange(item)}
          >
            <Ionicons 
              name={item.status === 'completada' ? 'checkmark-circle' : 'ellipse-outline'} 
              size={20} 
              color={item.status === 'completada' ? SakuraColors.success : SakuraColors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteTask(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={SakuraColors.error} />
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color={SakuraColors.textSecondary} />
        </View>
      </View>
      {item.description && (
        <Text style={styles.taskDescription}>{item.description}</Text>
      )}
      <View style={styles.taskMeta}>
        <View style={styles.taskStatusContainer}>
          <View style={styles.taskStatusRow}>
            <Text style={styles.taskStatus}>Estado: {item.status}</Text>
            <View style={[styles.taskStatusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
          </View>
        </View>
        <View style={styles.taskPriorityContainer}>
          <Text style={styles.taskPriority} numberOfLines={1}>Prioridad</Text>
          <View style={[styles.taskPriorityCircle, { backgroundColor: getPriorityColor(item.priority) }]} />
        </View>
        {item.due_date && (
          <View style={styles.taskDueDateContainer}>
            <Text style={styles.taskDueDateLabel}>Fecha límite</Text>
            <Text style={styles.taskDueDateValue}>
              {new Date(item.due_date).toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                year: '2-digit' 
              })}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSubscriptionInfo = () => {
    if (subscriptionInfo.type === 'free') {
      return (
        <View style={styles.subscriptionInfo}>
          <Ionicons name="information-circle" size={16} color={SakuraColors.warning} />
          <Text style={styles.subscriptionText}>
            {tasks.length}/{subscriptionInfo.taskLimit} tareas (Gratuito)
          </Text>
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Cargando tareas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTasks}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Información de suscripción */}
      {renderSubscriptionInfo()}

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay tareas</Text>
            <Text style={styles.emptySubtext}>
              Crea tu primera tarea para comenzar
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity style={styles.fab} onPress={handleCreateTask}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Chibi flotante */}
      <View style={styles.chibiContainer}>
        <DynamicChibi 
          emotion={getTaskListEmotion(tasks)} 
          size="small"
          showMessage={false}
        />
      </View>

      {/* Chibi de celebración cuando se completa una tarea */}
      {celebratingTask && (
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
  taskCard: {
    backgroundColor: SakuraColors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    flex: 1,
    flexWrap: 'wrap',
  },
  taskDescription: {
    fontSize: 14,
    color: SakuraColors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  taskStatusContainer: {
    flex: 1,
    minWidth: 0,
  },
  taskStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskStatus: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    fontWeight: '500',
  },
  taskStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  taskPriorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flexShrink: 0,
    minWidth: 80,
  },
  taskPriority: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    fontWeight: '500',
    flexShrink: 0,
  },
  taskPriorityCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 6,
  },
  taskDueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  taskDueDateLabel: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    fontWeight: '500',
  },
  taskDueDateValue: {
    fontSize: 12,
    color: SakuraColors.textPrimary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  taskActions: {
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
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  subscriptionText: {
    fontSize: 12,
    color: SakuraColors.textSecondary,
    marginLeft: 5,
  },
});
