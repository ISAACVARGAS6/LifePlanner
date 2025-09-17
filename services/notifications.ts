import { Platform } from 'react-native';


let Notifications: any;
let Device: any;

// Función para cargar las dependencias de manera segura
async function loadNotificationDependencies() {
  try {
    if (Platform.OS !== 'web') {
      Notifications = (await import('expo-notifications')).default;
      Device = (await import('expo-device')).default;
      
      // Configurar el comportamiento de las notificaciones
      Notifications?.setNotificationHandler?.({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }
  } catch (error) {
    console.warn('No se pudieron cargar las dependencias de notificaciones:', error);
  }
}

// Cargar las dependencias al iniciar
loadNotificationDependencies();

export async function registerForPushNotificationsAsync() {
  try {
    if (!Notifications || !Device) {
      console.warn('Las notificaciones no están disponibles');
      return null;
    }

    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.warn('No se obtuvieron permisos para las notificaciones');
        return null;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      console.warn('Las notificaciones requieren un dispositivo físico');
    }

    return token;
  } catch (error) {
    console.warn('Error al registrar las notificaciones:', error);
    return null;
  }
}

export async function scheduleNotification(title: string, body: string, trigger: Date) {
  try {
    if (!Notifications) {
      console.warn('Las notificaciones no están disponibles');
      return null;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: 'high',
      },
      trigger: {
        date: trigger,
      },
    });
    return id;
  } catch (error) {
    console.warn('Error al programar la notificación:', error);
    return null;
  }
}

export async function scheduleProjectReminder(projectId: number, projectTitle: string, deadline: string) {
  try {
    if (!deadline) return;

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) return;

    const reminderDate = new Date(deadlineDate);
    reminderDate.setDate(deadlineDate.getDate() - 1);

    if (reminderDate > new Date()) {
      await scheduleNotification(
        '¡Proyecto por vencer!',
        `El proyecto "${projectTitle}" vence mañana`,
        reminderDate
      );
    }

    const earlyReminderDate = new Date(deadlineDate);
    earlyReminderDate.setDate(deadlineDate.getDate() - 3);
    
    if (earlyReminderDate > new Date()) {
      await scheduleNotification(
        'Recordatorio de proyecto',
        `El proyecto "${projectTitle}" vence en 3 días`,
        earlyReminderDate
      );
    }
  } catch (error) {
    console.warn('Error al programar el recordatorio del proyecto:', error);
  }
}

export async function scheduleTaskReminder(taskId: number, taskTitle: string, dueDate: string) {
  try {
    if (!dueDate) return;

    const dueDateObj = new Date(dueDate);
    if (isNaN(dueDateObj.getTime())) return;

    const reminderDate = new Date(dueDateObj);
    reminderDate.setDate(dueDateObj.getDate() - 1);

    if (reminderDate > new Date()) {
      await scheduleNotification(
        '¡Tarea por vencer!',
        `La tarea "${taskTitle}" vence mañana`,
        reminderDate
      );
    }
  } catch (error) {
    console.warn('Error al programar el recordatorio de la tarea:', error);
  }
} 