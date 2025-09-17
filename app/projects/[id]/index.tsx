import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '../../../services/api';
import type { Project } from '../../../types';
import DynamicChibi from '../../../components/DynamicChibi';
import { getProjectWithTasksEmotion } from '../../../hooks/useChibiEmotionSimple';
import { SakuraColors } from '../../../constants/Colors';

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id: projectId } = useLocalSearchParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [celebratingProject, setCelebratingProject] = useState(false);

  const fetchProject = async () => {
    try {
      const data = await api.projects.get(Number(projectId));
      setProject(data);
      
      // Verificar si el proyecto se completó para mostrar celebración
      if (data.tasks.length > 0 && data.tasks.every(task => task.status === 'completada')) {
        console.log('🎉 Proyecto completado! Mostrando chibi de éxito');
        setCelebratingProject(true);
        
        // Ocultar la celebración después de 4 segundos
        setTimeout(() => {
          setCelebratingProject(false);
        }, 4000);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.tasks.delete(taskId);
      setProject((prev) =>
        prev ? { ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) } : prev
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo eliminar la tarea');
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

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 16 }} />;
  }

  if (!project) {
    return <Text style={{ padding: 16 }}>Proyecto no encontrado.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{project.title}</Text>
      {project.description ? (
        <Text style={{ marginBottom: 12 }}>{project.description}</Text>
      ) : (
        <Text style={{ marginBottom: 12, fontStyle: 'italic', color: 'gray' }}>
          Sin descripción
        </Text>
      )}

      <Button
        title="Agregar Nueva Tarea"
        onPress={() => router.push(`/projects/${projectId}/tasks/create`)}
      />

      <Text style={{ marginTop: 16, fontSize: 18 }}>Tareas:</Text>
      {project.tasks.length === 0 ? (
        <Text style={{ marginTop: 8, color: 'gray' }}>No hay tareas todavía.</Text>
      ) : (
        <FlatList
          data={project.tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <View style={styles.taskItemHeader}>
                <Text style={styles.taskItemTitle}>{item.title}</Text>
                <View style={styles.taskItemActions}>
                  <View style={[styles.taskItemPriorityCircle, { backgroundColor: getPriorityColor(item.priority) }]} />
                  <Button
                    title="Eliminar"
                    color="red"
                    onPress={() => handleDeleteTask(item.id)}
                  />
                </View>
              </View>
              {item.description ? (
                <Text style={styles.taskItemDescription}>{item.description}</Text>
              ) : (
                <Text style={styles.taskItemDescriptionEmpty}>Sin descripción</Text>
              )}
              <View style={styles.taskItemMeta}>
                <Text style={styles.taskItemPriority}>Prioridad: {item.priority}</Text>
                <Text style={styles.taskItemStatus}>Estado: {item.status}</Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Chibi flotante */}
      <View style={styles.chibiContainer}>
        <DynamicChibi 
          emotion={project ? getProjectWithTasksEmotion(project) : 'neutral'} 
          size="small"
          showMessage={false}
        />
      </View>

      {/* Chibi de celebración cuando se completa el proyecto */}
      {celebratingProject && (
        <View style={styles.celebrationChibiContainer}>
          <DynamicChibi 
            emotion="success" 
            size="large"
            showMessage={true}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  taskItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: SakuraColors.surface,
    marginVertical: 4,
    borderRadius: 8,
  },
  taskItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    flex: 1,
  },
  taskItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskItemPriorityCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  taskItemDescription: {
    color: SakuraColors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  taskItemDescriptionEmpty: {
    color: SakuraColors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  taskItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskItemPriority: {
    color: SakuraColors.textSecondary,
    fontSize: 12,
  },
  taskItemStatus: {
    color: SakuraColors.textSecondary,
    fontSize: 12,
  },
});
