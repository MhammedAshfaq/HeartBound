import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationTrigger } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return false;
    }
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return true;
  }
  
  async scheduleNotification(
    trigger: NotificationTrigger,
    message: string,
    delay?: number
  ): Promise<string> {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Relationship Care',
        body: message,
        data: { trigger },
      },
      trigger: delay && delay > 0
        ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: delay / 1000,
            repeats: false,
          }
        : null,
    });
    
    return identifier || `notif_${Date.now()}`;
  }
  
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
  
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
  
  async scheduleDailyReminder(hour: number, minute: number): Promise<string> {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Relationship Care',
        body: 'Time to check in with your partner!',
        data: { trigger: NotificationTrigger.TimeBased },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    
    return identifier || `notif_${Date.now()}`;
  }
  
  async scheduleInactivityPrompt(hoursOfInactivity: number): Promise<string> {
    return this.scheduleNotification(
      NotificationTrigger.Inactivity,
      'You haven\'t checked in today. How are you feeling?',
      hoursOfInactivity * 3600000
    );
  }
  
  async scheduleSpecialEventReminder(
    eventDate: Date,
    message: string
  ): Promise<string> {
    const delay = eventDate.getTime() - Date.now();
    return this.scheduleNotification(
      NotificationTrigger.SpecialEvent,
      message,
      delay
    );
  }
}

export const notificationService = new NotificationService();
export default notificationService;
