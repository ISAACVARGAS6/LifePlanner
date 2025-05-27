# Implementación de Prioridades para Tareas en AppLifePlanner

## Resumen de Cambios

Se ha implementado un sistema completo de prioridades para las tareas, permitiendo clasificarlas como: **alta**, **media**, o **baja**. Esto facilita la organización y priorización del trabajo.

## Cambios en el Backend

### 1. Modelo de datos
- Añadido campo `priority` a la tabla `Task` con valores posibles: 'alta', 'media', 'baja'
- Valor predeterminado: 'media'
- Implementada validación para asegurar valores correctos

### 2. Esquemas
- Actualizado `TaskBase` y `TaskUpdate` para incluir el campo de prioridad
- Añadida validación mediante Literal para asegurar valores válidos

### 3. Migración
- Creado script de migración `add_priority_to_tasks.py` para añadir el campo a la BD existente
- Integración automática de la migración al iniciar la aplicación

## Cambios en el Frontend

### 1. Interfaz de datos
- Actualizada interfaz `Task` para incluir el campo de prioridad
- Definidos tipos para valores de prioridad

### 2. Visualización
- Añadidos chips con colores según prioridad:
  - Alta: 🔴 Rojo
  - Media: 🟠 Naranja
  - Baja: 🟢 Verde
- Implementados iconos específicos para cada nivel de prioridad

### 3. Funcionalidades
- Creación de tareas con selección de prioridad
- Edición de prioridad desde el menú contextual de cada tarea
- Filtrado de tareas por prioridad mediante botón dedicado
- Ordenamiento de tareas según nivel de prioridad

## Cómo usar la función de prioridades

1. **Al crear una tarea**:
   - Utilice el selector segmentado para elegir la prioridad
   - El valor predeterminado es 'media'

2. **Para cambiar la prioridad**:
   - Pulse el menú contextual (tres puntos) de una tarea
   - Seleccione la opción de prioridad deseada

3. **Para filtrar tareas**:
   - Pulse el botón "Filtrar" en la parte superior
   - Seleccione el nivel de prioridad deseado
   - Para ver todas las tareas, seleccione "Todas las prioridades"

4. **Para ordenar por prioridad**:
   - Pulse el botón "Ordenar" en la parte superior
   - Las tareas se ordenarán de mayor a menor prioridad

## Beneficios

- Mejor organización visual de las tareas
- Facilita la identificación de tareas críticas
- Permite concentrarse en lo más importante primero
- Mejora la gestión del tiempo y la productividad