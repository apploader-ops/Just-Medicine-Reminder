import { useState, useEffect, useCallback, useRef } from 'react';
import type { Profile } from '../types';

const NOTIFICATION_LOG_KEY_PREFIX = 'pill-pal-notified-';

export const useNotifications = (profiles: Profile[]) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const lastCheckedTime = useRef<string | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notification");
      return;
    }
    const status = await Notification.requestPermission();
    setPermission(status);
  }, []);
  
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (permission !== 'granted') {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const currentTimeString = now.toTimeString().substring(0, 5); // HH:MM
      const currentDay = now.getDay(); // 0 for Sunday, 6 for Saturday

      if (currentTimeString === lastCheckedTime.current) {
        return;
      }
      lastCheckedTime.current = currentTimeString;
      
      const today = getTodayDateString();
      
      const dueRemindersByProfile: { profileName: string; medicineName: string; dosage: string; reminderId: string; }[] = [];

      profiles.forEach((profile) => {
        profile.reminders.forEach((reminder) => {
          const isDueToday = 
              reminder.frequency === 'daily' || 
              (reminder.frequency === 'weekly' && reminder.dayOfWeek === currentDay);

          if (isDueToday && reminder.times.includes(currentTimeString)) {
            const notificationLogKey = `${NOTIFICATION_LOG_KEY_PREFIX}${reminder.id}-${currentTimeString}`;
            const lastNotifiedDate = localStorage.getItem(notificationLogKey);

            if (lastNotifiedDate !== today) {
              dueRemindersByProfile.push({
                profileName: profile.name,
                medicineName: reminder.medicineName,
                dosage: reminder.dosage,
                reminderId: reminder.id,
              });
            }
          }
        });
      });

      if (dueRemindersByProfile.length > 0) {
        const title = dueRemindersByProfile.length > 1 
            ? `${dueRemindersByProfile.length} medications due`
            : `Reminder for ${dueRemindersByProfile[0].profileName}`;

        const body = dueRemindersByProfile
            .map(r => `${r.profileName}: ${r.medicineName}${r.dosage ? ` (${r.dosage})` : ''}`)
            .join('\n');

        new Notification(title, {
            body,
            icon: '/favicon.ico',
        });

        dueRemindersByProfile.forEach(r => {
            const notificationLogKey = `${NOTIFICATION_LOG_KEY_PREFIX}${r.reminderId}-${currentTimeString}`;
            localStorage.setItem(notificationLogKey, today);
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [permission, profiles]);

  return { permission, requestPermission };
};
