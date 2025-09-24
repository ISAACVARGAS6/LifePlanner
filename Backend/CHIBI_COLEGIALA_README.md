# Sistema de Colegiala Chibi - Backend

## 🎓 Descripción General

El sistema de colegiala chibi es una característica especial del AppLifePlanner que proporciona una experiencia más personal y motivacional. La colegiala, llamada **Sakura**, es una estudiante de 16 años que acompaña al usuario en su jornada de planificación y estudio.

## 👧 Características de Sakura

### Personalidad
- **Nombre**: Sakura
- **Edad**: 16 años
- **Grado**: 3er año de secundaria
- **Materia favorita**: Literatura
- **Materia menos favorita**: Matemáticas
- **Estilo de estudio**: Organizada y metódica

### Rasgos de Personalidad
- Responsable
- Organizada
- Empática
- Perseverante
- Creativa
- Curiosa

### Hobbies
- Leer manga y novelas
- Escribir en su diario
- Dibujar
- Escuchar música
- Pasar tiempo con amigos
- Cocinar

### Metas
- Sacar buenas notas
- Mejorar en matemáticas
- Participar en el festival cultural
- Hacer nuevos amigos
- Aprender a tocar piano

## 🎨 Estados Emocionales

Sakura tiene 15 estados emocionales diferentes que reflejan su estado de ánimo según las tareas y proyectos:

### Estados Positivos
- **happy_excited**: Feliz y emocionada
- **happy_calm**: Feliz y tranquila
- **happy_studying**: Feliz estudiando
- **excited_achievement**: Emocionada por logro
- **proud_accomplished**: Orgullosa de logro
- **confident_ready**: Confiada y lista
- **energized_motivated**: Energizada y motivada

### Estados de Concentración
- **focused_determined**: Concentrada y determinada
- **focused_stressed**: Concentrada pero estresada
- **determined_challenge**: Determinada ante desafío
- **thoughtful_planning**: Pensativa planificando

### Estados de Esfuerzo
- **tired_but_determined**: Cansada pero determinada
- **tired_overwhelmed**: Cansada y abrumada

### Estados de Reflexión
- **nervous_uncertain**: Nerviosa e incierta
- **relaxed_break**: Relajada en descanso

## 🛠️ Endpoints de la API

### Información General

#### `GET /chibis/types`
Obtiene todos los tipos de chibis disponibles con sus descripciones.

#### `GET /chibis/emotional-states`
Obtiene descripciones detalladas de todos los estados emocionales.

#### `GET /chibis/personality`
Obtiene información completa sobre la personalidad de Sakura.

#### `GET /chibis/appearance`
Obtiene información sobre la apariencia y características visuales.

### Estados Emocionales

#### `GET /chibis/project/{status}/{priority}`
Obtiene el chibi para un proyecto basado en su estado y prioridad.

**Parámetros:**
- `status`: "activo", "en_pausa", "terminado"
- `priority`: "alta", "media", "baja", null

#### `GET /chibis/task/{status}/{priority}`
Obtiene el chibi para una tarea basado en su estado y prioridad.

**Parámetros:**
- `status`: "pendiente", "en_progreso", "completada"
- `priority`: "alta", "media", "baja", null

#### `GET /chibis/random-emotional-state`
Obtiene un estado emocional aleatorio de Sakura.

### Motivación y Estudio

#### `GET /chibis/motivational-messages/{emotional_state}`
Obtiene mensajes motivacionales específicos para el estado emocional.

#### `GET /chibis/study-tips/{subject}`
Obtiene consejos de estudio específicos por materia.

**Materias disponibles:**
- matemáticas
- ciencias
- historia
- literatura
- arte
- educación física
- música
- informática
- idiomas
- filosofía

#### `GET /chibis/daily-quote`
Obtiene la frase motivacional del día.

#### `GET /chibis/study-break-activities`
Obtiene actividades recomendadas para descansos de estudio.

### Horario Escolar

#### `GET /chibis/school-schedule/{day}`
Obtiene el horario escolar para un día específico.

**Días disponibles:** monday, tuesday

### Vista Previa

#### `GET /chibis/preview`
Obtiene una vista previa de todos los chibis disponibles organizados por tipo.

## 📊 Ejemplos de Uso

### Obtener chibi para proyecto activo con prioridad alta
```bash
GET /chibis/project/activo/alta
```

**Respuesta:**
```json
{
  "chibi_filename": "focused_determined.png",
  "chibi_url": "/static/chibis/focused_determined.png",
  "status": "activo",
  "priority": "alta",
  "emotional_state": "focused_determined",
  "emotional_description": "Concentrada en su objetivo, muestra determinación y enfoque."
}
```

### Obtener mensajes motivacionales
```bash
GET /chibis/motivational-messages/focused_determined
```

**Respuesta:**
```json
{
  "emotional_state": "focused_determined",
  "messages": [
    "Tu concentración es admirable",
    "Cada paso cuenta, sigue adelante",
    "Tu determinación te hará alcanzar tus metas"
  ]
}
```

### Obtener consejos de estudio para matemáticas
```bash
GET /chibis/study-tips/matemáticas
```

**Respuesta:**
```json
{
  "subject": "matemáticas",
  "tips": [
    "Hacer muchos ejercicios prácticos",
    "Usar colores para fórmulas importantes",
    "Crear tarjetas de memoria",
    "Practicar con problemas del mundo real"
  ]
}
```

## 🎨 Características Visuales

### Colores del Uniforme
- **Primario**: #2E4A8C (Azul marino)
- **Secundario**: #FFFFFF (Blanco)
- **Acento**: #FF6B9D (Rosa)
- **Zapatos**: #8B4513 (Marrón)
- **Cabello**: #8B4513 (Castaño)
- **Ojos**: #4A90E2 (Azul)

### Accesorios Escolares
- Mochila escolar
- Lápices y cuadernos
- Calculadora
- Regla
- Compás
- Diccionario
- Agenda escolar

## 🔧 Configuración

El sistema está configurado en `chibi_config.py` y puede ser personalizado modificando:

- Personalidad de Sakura
- Estados emocionales
- Mensajes motivacionales
- Consejos de estudio
- Horario escolar
- Colores y apariencia

## 🚀 Instalación y Uso

1. Asegúrate de que el backend esté corriendo
2. Las rutas están disponibles en `/chibis/`
3. Los archivos de imagen deben estar en `/static/chibis/`
4. Cada estado emocional debe tener su correspondiente archivo PNG

## 📝 Notas de Desarrollo

- El sistema es extensible y puede agregar nuevos estados emocionales
- Los mensajes motivacionales se pueden personalizar por usuario
- El sistema de consejos de estudio se puede expandir con más materias
- La personalidad de Sakura se puede adaptar según las preferencias del usuario

## 🎯 Próximas Características

- [ ] Sistema de progreso personal
- [ ] Interacciones más complejas
- [ ] Personalización de apariencia
- [ ] Sistema de logros
- [ ] Integración con calendario escolar
- [ ] Notificaciones motivacionales 