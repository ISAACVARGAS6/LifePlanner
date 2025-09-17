import { useMemo } from 'react';
import { Project, Task, ProjectWithProgress } from '../types';

export type ChibiEmotion = 'happy' | 'sad' | 'angry' | 'success' | 'neutral';

// Hook optimizado para un proyecto individual
export const useProjectEmotion = (project: Project | ProjectWithProgress): ChibiEmotion => {
  return useMemo(() => {
    // Si el proyecto está terminado o tiene 100% de progreso
    if (project.status === 'terminado' || 
        ('progress' in project && project.progress === 100)) {
      return 'success';
    }

    // Si hay fecha límite y ya pasó
    if (project.deadline) {
      const deadline = new Date(project.deadline);
      const now = new Date();
      if (deadline < now) {
        return 'sad';
      }
    }

    // Si la prioridad es alta
    if (project.priority === 'alta') {
      return 'angry';
    }

    return 'happy';
  }, [project.status, project.priority, project.deadline, 
      'progress' in project ? project.progress : null]);
};

// Hook optimizado para una tarea individual
export const useTaskEmotion = (task: Task): ChibiEmotion => {
  return useMemo(() => {
    // Si la tarea está completada
    if (task.status === 'completada') {
      return 'success';
    }

    // Si hay fecha límite y ya pasó
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const now = new Date();
      if (dueDate < now) {
        return 'sad';
      }
    }

    // Si la prioridad es alta
    if (task.priority === 'alta') {
      return 'angry';
    }

    return 'happy';
  }, [task.status, task.priority, task.due_date]);
};

// Hook optimizado para una lista de tareas
export const useTaskListEmotion = (tasks: Task[]): ChibiEmotion => {
  return useMemo(() => {
    if (tasks.length === 0) {
      return 'neutral';
    }

    // Si todas las tareas están completadas
    if (tasks.every(task => task.status === 'completada')) {
      return 'success';
    }

    // Si hay tareas vencidas
    const hasOverdueTasks = tasks.some(task => {
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        const now = new Date();
        return dueDate < now && task.status !== 'completada';
      }
      return false;
    });

    if (hasOverdueTasks) {
      return 'sad';
    }

    // Si hay tareas de alta prioridad
    const hasHighPriorityTasks = tasks.some(task => 
      task.priority === 'alta' && task.status !== 'completada'
    );

    if (hasHighPriorityTasks) {
      return 'angry';
    }

    return 'happy';
  }, [tasks]);
};

// Hook optimizado para un proyecto con sus tareas
export const useProjectWithTasksEmotion = (project: Project | ProjectWithProgress): ChibiEmotion => {
  return useMemo(() => {
    // Si el proyecto está terminado o tiene 100% de progreso
    if (project.status === 'terminado' || 
        ('progress' in project && project.progress === 100)) {
      return 'success';
    }

    // Si hay fecha límite del proyecto y ya pasó
    if (project.deadline) {
      const deadline = new Date(project.deadline);
      const now = new Date();
      if (deadline < now) {
        return 'sad';
      }
    }

    // Si la prioridad del proyecto es alta
    if (project.priority === 'alta') {
      return 'angry';
    }

    // Si no hay tareas, usar la emoción del proyecto
    if (project.tasks.length === 0) {
      return 'happy';
    }

    // Calcular la emoción de la lista de tareas directamente aquí
    const tasks = project.tasks;
    
    // Si todas las tareas están completadas
    if (tasks.every(task => task.status === 'completada')) {
      return 'success';
    }

    // Si hay tareas vencidas
    const hasOverdueTasks = tasks.some(task => {
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        const now = new Date();
        return dueDate < now && task.status !== 'completada';
      }
      return false;
    });

    if (hasOverdueTasks) {
      return 'sad';
    }

    // Si hay tareas de alta prioridad
    const hasHighPriorityTasks = tasks.some(task => 
      task.priority === 'alta' && task.status !== 'completada'
    );

    if (hasHighPriorityTasks) {
      return 'angry';
    }

    return 'happy';
  }, [project.status, project.priority, project.deadline, 
      'progress' in project ? project.progress : null, project.tasks]);
};

// Exportar también las funciones estáticas para compatibilidad
export const useChibiEmotion = {
  project: useProjectEmotion,
  task: useTaskEmotion,
  taskList: useTaskListEmotion,
  projectWithTasks: useProjectWithTasksEmotion,
};
