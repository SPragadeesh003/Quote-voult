import { COLORS } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface NotificationSettings {
    enabled: boolean;
    time: Date;
}

export const NotificationService = {
    async registerForPushNotificationsAsync(): Promise<boolean> {
        let token;
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('daily-quote', {
                name: 'Daily Inspiration',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: COLORS.NOTIFICATION_LIGHT,
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
                return false;
            }
            return true;
        } else {
            console.log('Must use physical device for Push Notifications');
            return false;
        }
    },

    async getSettings(): Promise<NotificationSettings> {
        try {
            const json = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
            if (json) {
                const parsed = JSON.parse(json);
                return {
                    enabled: parsed.enabled,
                    time: new Date(parsed.time),
                };
            }
        } catch (e) {
            console.log('Error reading notification settings', e);
        }
        const defaultTime = new Date();
        defaultTime.setHours(9, 0, 0, 0);
        return { enabled: false, time: defaultTime };
    },

    async saveSettings(settings: NotificationSettings) {
        try {
            await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
            if (settings.enabled) {
                await this.scheduleDailyNotification(settings.time);
            } else {
                await this.cancelAllNotifications();
            }
        } catch (e) {
            console.log('Error saving notification settings', e);
        }
    },

    async scheduleDailyNotification(time: Date) {
        await this.cancelAllNotifications();

        const triggerHour = time.getHours();
        const triggerMinute = time.getMinutes();

        console.log(`Scheduling daily notification for: ${triggerHour}:${triggerMinute}. Current time: ${new Date().toLocaleTimeString()}`);

        try {
            const trigger: Notifications.NotificationTriggerInput = Platform.OS === 'ios' ? {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                hour: triggerHour,
                minute: triggerMinute,
                repeats: true,
            } : {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                channelId: 'daily-quote',
                hour: triggerHour,
                minute: triggerMinute,
            };

            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Daily Inspiration ✨",
                    body: "Your quote of the day is ready for you.",
                    sound: true,
                },
                trigger,
            });
            console.log(`Notification scheduled successfully. Identifier: ${identifier}`);
        } catch (e) {
            console.log('Error scheduling notification:', e);
        }
    },

    async cancelAllNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
};
