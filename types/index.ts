// types/index.ts

// ---------- Reusable Types ----------

export type Priority = 'baja' | 'media' | 'alta';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';
export type ProjectStatus = 'activo' | 'en_pausa' | 'terminado';

// ---------- Interfaces ----------

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  due_date?: string | null;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  due_date?: string | null;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  priority?: Priority;
  category?: string;
  deadline?: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  tasks: Task[];
}

export interface ProjectWithProgress extends Project {
  progress: number;
  totalTasks: number;
  completedTasks: number;
}
