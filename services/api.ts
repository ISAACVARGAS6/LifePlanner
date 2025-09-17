import Constants from 'expo-constants';
import type { Project, Task, CreateTaskData } from '../types';
import { Platform } from 'react-native';

const getAvailableUrls = (): Record<string, string> => {
  const manifest = Constants.expoConfig;
  const debuggerHost = manifest?.hostUri?.split(':')[0];

  const urls: Record<string, string> = {
    emulator: Platform.select({
      android: 'http://10.0.2.2:8000',
      ios: 'http://localhost:8000',
      default: 'http://localhost:8000',
    }),
    localhost: 'http://localhost:8000',
    network: 'http://0.0.0.0:8000',
    fallback: 'http://10.0.2.2:8000',
    localIp: 'http://192.168.3.188:8000',
    // URL fija para pruebas - usar localhost por defecto
    fixed: 'http://localhost:8000',
  };

  if (debuggerHost) {
    urls.localNetwork = `http://${debuggerHost}:8000`;
  }

  console.log('URLs disponibles:', urls);
  return urls;
};

let API_URL = '';
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

const testConnection = async (url: string): Promise<boolean> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    console.log(`Probando conexión a: ${url}/lifeplanner/health`);
    const response = await fetch(`${url}/lifeplanner/health`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    clearTimeout(timeout);
    console.log(`Respuesta de health check: ${response.status}`);
    return response.ok;
  } catch (error) {
    clearTimeout(timeout);
    console.log(`Error probando conexión a ${url}:`, error);
    return false;
  }
};

const initializeApi = async (): Promise<void> => {
  if (isInitializing) {
    return initializationPromise ?? Promise.resolve();
  }

  isInitializing = true;
  initializationPromise = (async () => {
    const urls = getAvailableUrls();
    
    // Usar URL fija para pruebas
    API_URL = urls.fixed;
    console.log('API: Usando URL fija:', API_URL);
    
    // Probar la conexión
    if (await testConnection(API_URL)) {
      console.log('✅ API: Conexión exitosa con URL fija');
      isInitializing = false;
      return;
    }
    
    // Si falla, intentar otras URLs
    const urlEntries = Object.entries(urls);
    console.log('API: Iniciando inicialización con URLs:', urls);

    for (const [name, url] of urlEntries) {
      if (name === 'fixed') continue; // Ya probamos esta
      console.log(`API: Probando conexión con ${name}: ${url}`);
      if (await testConnection(url)) {
        console.log(`✅ API: Conexión exitosa usando ${name}: ${url}`);
        API_URL = url;
        isInitializing = false;
        return;
      }
      console.log(`❌ API: Falló conexión con ${name}: ${url}`);
    }

    isInitializing = false;
    throw new Error('No se pudo establecer conexión con el servidor.');
  })();

  return initializationPromise;
};

const ensureConnection = async (): Promise<void> => {
  if (!API_URL) {
    await initializeApi();
    console.log('API: URL final configurada:', API_URL);
    return;
  }

  if (!(await testConnection(API_URL))) {
    console.log('API: Conexión perdida, intentando reconectar...');
    await initializeApi();
    console.log('API: URL final configurada después de reconexión:', API_URL);
  }
};

const handleError = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  let errorData;

  try {
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
    } else {
      errorData = await response.text();
    }
  } catch (e) {
    errorData = { detail: 'Error desconocido' };
  }

  console.error('Error de API:', response.status, errorData);
  throw new Error(`Error ${response.status}: ${JSON.stringify(errorData)}`);
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = MAX_RETRIES
): Promise<T> => {
  await ensureConnection();

  const fullUrl = `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  console.log(`🔗 API: Llamando a: ${fullUrl}`);
  console.log(`🔗 API: Método: ${options.method || 'GET'}`);
  console.log(`🔗 API: Body:`, options.body);
  console.log(`🔗 API: Headers:`, options.headers);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...options.headers,
      },
    });

    clearTimeout(timeout);
    console.log(`🔗 API: Respuesta recibida: ${response.status} ${response.statusText}`);
    console.log(`🔗 API: Headers de respuesta:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error(`🔗 API: Error HTTP ${response.status}: ${response.statusText}`);
      if (response.status === 503 || response.status === 502) {
        throw new Error('Servicio no disponible temporalmente');
      }
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        await new Promise(resolve => setTimeout(resolve, (parseInt(retryAfter || '5') * 1000)));
        return apiFetch(endpoint, options, retryCount - 1);
      }
      await handleError(response);
    }

    if (response.status === 204) {
      console.log(`🔗 API: Respuesta 204 - No content`);
      return undefined as T;
    }

    const data = await response.json() as T;
    console.log(`🔗 API: Datos recibidos:`, data);
    return data;
  } catch (error) {
    clearTimeout(timeout);
    console.error(`🔗 API: Error en la llamada:`, error);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('La solicitud ha excedido el tiempo de espera.');
      }
      if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
        if (retryCount > 0) {
          console.log(`🔄 API: Reintentando solicitud... (${retryCount} intentos restantes)`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return apiFetch(endpoint, options, retryCount - 1);
        }
      }
    }

    throw error;
  }
};

export const api = {
  testConnection: async (): Promise<boolean> => {
    try {
      await ensureConnection();
      return true;
    } catch (error) {
      console.error('Error en prueba de conexión:', error);
      return false;
    }
  },

  projects: {
    list: async (): Promise<Project[]> => {
      console.log('API: Intentando listar proyectos...');
      const result = await apiFetch<Project[]>('/lifeplanner/projects/');
      console.log('API: Proyectos obtenidos:', result.length);
      return result;
    },
    get: (id: number): Promise<Project> => apiFetch<Project>(`/lifeplanner/projects/${id}`),
    create: (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'tasks'>): Promise<Project> => {
      console.log('API: Creando proyecto:', project);
      return apiFetch<Project>('/lifeplanner/projects/', {
        method: 'POST',
        body: JSON.stringify(project),
      });
    },
    update: (id: number, project: Partial<Project>): Promise<Project> => {
      const cleanedProject = Object.fromEntries(
        Object.entries(project).filter(([_, value]) => value !== undefined)
      );
      return apiFetch<Project>(`/lifeplanner/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(cleanedProject),
      });
    },
    delete: (id: number): Promise<void> =>
      apiFetch<void>(`/lifeplanner/projects/${id}`, {
        method: 'DELETE',
      }),
  },

  tasks: {
    list: (projectId: number): Promise<Task[]> =>
      apiFetch<Task[]>(`/lifeplanner/tasks/?project_id=${projectId}`),
    create: (projectId: number, task: CreateTaskData): Promise<Task> => {
      console.log('API: Creando tarea para proyecto', projectId, 'con datos:', task);
      return apiFetch<Task>(`/lifeplanner/tasks/project/${projectId}`, {
        method: 'POST',
        body: JSON.stringify({
          ...task,
          priority: task.priority || 'media',
          status: task.status || 'pendiente',
        }),
      });
    },
    update: (projectId: number, taskId: number, task: Partial<Task>): Promise<Task> => {
      console.log('🔧 API: Actualizando tarea:', { projectId, taskId, task });
      return apiFetch<Task>(`/lifeplanner/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(task),
      });
    },
    updatePriority: (taskId: number, priority: Task['priority']): Promise<Task> =>
      apiFetch<Task>(`/lifeplanner/tasks/${taskId}/priority`, {
        method: 'PATCH',
        body: JSON.stringify({ priority }),
      }),
    delete: (taskId: number): Promise<void> =>
      apiFetch<void>(`/lifeplanner/tasks/${taskId}`, {
        method: 'DELETE',
      }),

    toggleStatus: async (projectId: number, task: Task): Promise<Task> => {
      const statusOrder: Task['status'][] = ['pendiente', 'en_progreso', 'completada'];
      const currentIndex = statusOrder.indexOf(task.status);
      const nextIndex = (currentIndex + 1) % statusOrder.length;
      const nextStatus = statusOrder[nextIndex];

      console.log('🔄 API: Cambiando estado de tarea:', task.id, 'de', task.status, 'a', nextStatus);
      
      return apiFetch<Task>(`/lifeplanner/tasks/${task.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
    },
  },
};