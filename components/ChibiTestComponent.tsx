import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DynamicChibi from './DynamicChibi';
import { useChibiEmotion } from '../hooks/useChibiEmotionSimple';
import { Task, Project } from '../types';
import { SakuraColors } from '../constants/Colors';

export default function ChibiTestComponent() {
  const [selectedEmotion, setSelectedEmotion] = useState<'happy' | 'sad' | 'angry' | 'success' | 'neutral'>('happy');

  // Datos de ejemplo para probar las diferentes emociones
  const sampleTask: Task = {
    id: 1,
    title: 'Tarea de ejemplo',
    description: 'Esta es una tarea de ejemplo para probar las emociones del chibi',
    status: 'pendiente',
    priority: 'media',
    due_date: new Date(Date.now() + 86400000).toISOString(), // Mañana
    project_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const sampleProject: Project = {
    id: 1,
    title: 'Proyecto de ejemplo',
    description: 'Este es un proyecto de ejemplo para probar las emociones del chibi',
    priority: 'media',
    status: 'activo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tasks: [sampleTask],
  };

  const testCases = [
    {
      title: 'Tarea Completada (Success)',
      description: 'Chibi muestra emoción de éxito cuando la tarea está completada',
      task: { ...sampleTask, status: 'completada' as const },
      expectedEmotion: 'success'
    },
    {
      title: 'Tarea Vencida (Sad)',
      description: 'Chibi muestra emoción triste cuando la fecha límite ya pasó',
      task: { ...sampleTask, due_date: new Date(Date.now() - 86400000).toISOString() }, // Ayer
      expectedEmotion: 'sad'
    },
    {
      title: 'Tarea Alta Prioridad (Angry)',
      description: 'Chibi muestra emoción de determinación cuando la prioridad es alta',
      task: { ...sampleTask, priority: 'alta' as const },
      expectedEmotion: 'angry'
    },
    {
      title: 'Tarea Normal (Happy)',
      description: 'Chibi muestra emoción feliz para tareas normales',
      task: sampleTask,
      expectedEmotion: 'happy'
    },
    {
      title: 'Proyecto Completado (Success)',
      description: 'Chibi muestra emoción de éxito cuando el proyecto está terminado',
      project: { ...sampleProject, status: 'terminado' as const },
      expectedEmotion: 'success'
    },
    {
      title: 'Proyecto Vencido (Sad)',
      description: 'Chibi muestra emoción triste cuando la fecha límite del proyecto ya pasó',
      project: { ...sampleProject, deadline: new Date(Date.now() - 86400000).toISOString() }, // Ayer
      expectedEmotion: 'sad'
    },
    {
      title: 'Proyecto Alta Prioridad (Angry)',
      description: 'Chibi muestra emoción de determinación cuando la prioridad del proyecto es alta',
      project: { ...sampleProject, priority: 'alta' as const },
      expectedEmotion: 'angry'
    }
  ];

  const getEmotionForTestCase = (testCase: any) => {
    if (testCase.task) {
      return useChibiEmotion.task(testCase.task);
    } else if (testCase.project) {
      return useChibiEmotion.projectWithTasks(testCase.project);
    }
    return 'neutral';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 Prueba del Sistema de Chibis</Text>
      <Text style={styles.subtitle}>
        Este componente demuestra cómo el chibi cambia de emoción según el estado de tareas y proyectos
      </Text>

      <View style={styles.chibiDisplay}>
        <DynamicChibi 
          emotion={selectedEmotion} 
          size="large"
          showMessage={true}
        />
      </View>

      <Text style={styles.sectionTitle}>Casos de Prueba:</Text>

      {testCases.map((testCase, index) => {
        const actualEmotion = getEmotionForTestCase(testCase);
        const isCorrect = actualEmotion === testCase.expectedEmotion;
        
        return (
          <View key={index} style={[styles.testCase, { borderColor: isCorrect ? SakuraColors.success : SakuraColors.error }]}>
            <Text style={styles.testCaseTitle}>{testCase.title}</Text>
            <Text style={styles.testCaseDescription}>{testCase.description}</Text>
            
            <View style={styles.emotionInfo}>
              <Text style={styles.emotionLabel}>Emoción Esperada:</Text>
              <Text style={[styles.emotionValue, { color: SakuraColors.primary }]}>
                {testCase.expectedEmotion}
              </Text>
            </View>
            
            <View style={styles.emotionInfo}>
              <Text style={styles.emotionLabel}>Emoción Actual:</Text>
              <Text style={[styles.emotionValue, { color: isCorrect ? SakuraColors.success : SakuraColors.error }]}>
                {actualEmotion}
              </Text>
            </View>

            <View style={styles.statusIndicator}>
              <Text style={[styles.statusText, { color: isCorrect ? SakuraColors.success : SakuraColors.error }]}>
                {isCorrect ? '✅ Correcto' : '❌ Incorrecto'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.testButton}
              onPress={() => setSelectedEmotion(actualEmotion)}
            >
              <Text style={styles.testButtonText}>Probar Esta Emoción</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📋 Resumen de Emociones:</Text>
        <Text style={styles.infoText}>• <Text style={{ fontWeight: 'bold' }}>Success</Text>: Proyectos/tareas completadas</Text>
        <Text style={styles.infoText}>• <Text style={{ fontWeight: 'bold' }}>Angry</Text>: Prioridad alta o estado cambiado a pendiente</Text>
        <Text style={styles.infoText}>• <Text style={{ fontWeight: 'bold' }}>Sad</Text>: Fecha límite vencida sin completar</Text>
        <Text style={styles.infoText}>• <Text style={{ fontWeight: 'bold' }}>Happy</Text>: Estado normal y saludable</Text>
        <Text style={styles.infoText}>• <Text style={{ fontWeight: 'bold' }}>Neutral</Text>: Sin datos o estado inicial</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: SakuraColors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: SakuraColors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: SakuraColors.textSecondary,
    lineHeight: 22,
  },
  chibiDisplay: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: SakuraColors.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: SakuraColors.textPrimary,
  },
  testCase: {
    backgroundColor: SakuraColors.surface,
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testCaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: SakuraColors.textPrimary,
  },
  testCaseDescription: {
    fontSize: 14,
    marginBottom: 12,
    color: SakuraColors.textSecondary,
    lineHeight: 20,
  },
  emotionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emotionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: SakuraColors.textSecondary,
  },
  emotionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  statusIndicator: {
    alignItems: 'center',
    marginVertical: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: SakuraColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: SakuraColors.surface,
    padding: 16,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: SakuraColors.textPrimary,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    color: SakuraColors.textSecondary,
    lineHeight: 20,
  },
});
