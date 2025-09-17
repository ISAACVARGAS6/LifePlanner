import { Project, Task, ProjectWithProgress } from '../types';

export type ChibiEmotion = 'happy' | 'sad' | 'angry' | 'success' | 'neutral';

export const useChibiEmotion = {
  // Para un proyecto individual
  project: (project: Project | ProjectWithProgress): ChibiEmotion => {
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
  },

  // Para una tarea individual
  task: (task: Task): ChibiEmotion => {
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
  },

  // Para una lista de tareas (determina la emoción general)
  taskList: (tasks: Task[]): ChibiEmotion => {
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
  },

  // Para un proyecto con sus tareas
  projectWithTasks: (project: Project | ProjectWithProgress): ChibiEmotion => {
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

    // Usar la emoción de la lista de tareas
    return useChibiEmotion.taskList(project.tasks);
  }
};
