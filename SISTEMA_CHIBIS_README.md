# 🎭 Sistema de Chibis - AppLifePlanner

## Descripción General

El sistema de chibis es una característica interactiva que muestra diferentes emociones según el estado de tus proyectos y tareas. Utiliza 4 imágenes diferentes para representar diferentes situaciones:

- **🎉 Success (chibi_success.png)**: Para proyectos y tareas completadas
- **😠 Angry (chibi_angry.png)**: Para prioridades altas o estados cambiados a pendiente
- **😢 Sad (chibi_sad.png)**: Para fechas límite vencidas sin completar
- **😊 Happy (chibi_happy.png)**: Para estados normales y saludables

## 🏗️ Arquitectura del Sistema

### 1. Hook Personalizado: `useChibiEmotion`

El sistema está centralizado en el hook `useChibiEmotion` que contiene la lógica para determinar la emoción apropiada:

```typescript
export const useChibiEmotion = {
  // Para un proyecto individual
  project: (project: Project | ProjectWithProgress): ChibiEmotion
  
  // Para una tarea individual
  task: (task: Task): ChibiEmotion
  
  // Para una lista de tareas
  taskList: (tasks: Task[]): ChibiEmotion
  
  // Para un proyecto con sus tareas
  projectWithTasks: (project: Project | ProjectWithProgress): ChibiEmotion
}
```

### 2. Lógica de Decisiones

#### Para Tareas:
- **Success**: `status === 'completada'`
- **Sad**: `due_date < now` (fecha límite vencida)
- **Angry**: `priority === 'alta'`
- **Happy**: Estado normal

#### Para Proyectos:
- **Success**: `status === 'terminado'` o `progress === 100`
- **Sad**: `deadline < now` (fecha límite vencida)
- **Angry**: `priority === 'alta'`
- **Happy**: Estado normal

## 📱 Implementación en Pantallas

### Pantalla de Tareas (`/projects/[id]/tasks/index.tsx`)
- **Chibi flotante**: Cambia según el estado general de todas las tareas del proyecto
- **Lógica**: Usa `useChibiEmotion.taskList(tasks)`

### Pantalla de Proyectos (`/projects/index.tsx`)
- **Chibi flotante**: Cambia según el estado del primer proyecto (representativo)
- **Lógica**: Usa `useChibiEmotion.projectWithTasks(project)`

### Pantalla de Detalle del Proyecto (`/projects/[id]/index.tsx`)
- **Chibi flotante**: Cambia según el estado del proyecto específico
- **Lógica**: Usa `useChibiEmotion.projectWithTasks(project)`

### Pantalla de Creación de Tareas (`/projects/[id]/tasks/create.tsx`)
- **Chibi interactivo**: Cambia según la prioridad seleccionada
- **Lógica**: Emoción hardcodeada según la prioridad seleccionada

## 🎯 Casos de Uso

### 1. Tarea Completada
```
Estado: completada
→ Chibi: Success (🎉)
→ Mensaje: "¡Logro Completado! 🏆"
```

### 2. Tarea Vencida
```
Estado: pendiente + fecha límite pasada
→ Chibi: Sad (😢)
→ Mensaje: "¡No te desanimes! 💪"
```

### 3. Tarea de Alta Prioridad
```
Estado: pendiente + prioridad alta
→ Chibi: Angry (😠)
→ Mensaje: "¡Determinación! 🔥"
```

### 4. Proyecto Terminado
```
Estado: terminado o 100% progreso
→ Chibi: Success (🎉)
→ Mensaje: "¡Logro Completado! 🏆"
```

## 🧪 Componente de Prueba

Se incluye `ChibiTestComponent.tsx` para probar todas las emociones:

- Muestra casos de prueba con datos de ejemplo
- Permite ver la emoción actual vs. esperada
- Botón para probar cada emoción en tiempo real
- Validación automática de la lógica

## 🔧 Personalización

### Agregar Nuevas Emociones

1. Agregar la imagen en `Frontend/images/`
2. Actualizar `ChibiEmotion` type en `useChibiEmotion.ts`
3. Agregar la imagen en `DynamicChibi.tsx`
4. Agregar mensaje en `emotionMessages`

### Modificar Lógica de Decisiones

Editar las funciones en `useChibiEmotion.ts`:

```typescript
// Ejemplo: Agregar nueva condición para emoción
if (task.complexity === 'alta') {
  return 'angry';
}
```

## 🎨 Estilos y Colores

El sistema usa los colores definidos en `SakuraColors`:

- **Success**: Verde para logros
- **Error**: Rojo para problemas
- **Warning**: Amarillo para advertencias
- **Primary**: Azul para estados normales

## 🚀 Uso en Nuevas Pantallas

Para agregar el sistema de chibis a una nueva pantalla:

```typescript
import { useChibiEmotion } from '../hooks/useChibiEmotion';
import DynamicChibi from '../components/DynamicChibi';

// En el componente:
const emotion = useChibiEmotion.projectWithTasks(project);

// En el JSX:
<DynamicChibi 
  emotion={emotion} 
  size="small"
  showMessage={false}
/>
```

## 📊 Rendimiento

- **useMemo**: Todas las funciones del hook usan `useMemo` para evitar recálculos innecesarios
- **Dependencias**: Solo se recalcula cuando cambian los datos relevantes
- **Lazy Loading**: Las imágenes se cargan solo cuando son necesarias

## 🔍 Debugging

Para debuggear el sistema:

1. Usar `ChibiTestComponent` para verificar la lógica
2. Revisar console.log en las funciones del hook
3. Verificar que los datos tengan el formato correcto
4. Comprobar que las fechas estén en formato ISO

## 🎯 Próximas Mejoras

- [ ] Animaciones de transición entre emociones
- [ ] Sonidos para cada emoción
- [ ] Personalización de mensajes por usuario
- [ ] Historial de cambios de emoción
- [ ] Notificaciones push con emociones del chibi
