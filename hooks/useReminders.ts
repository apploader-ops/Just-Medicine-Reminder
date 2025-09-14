import { useState, useEffect, useCallback } from 'react';
import type { Reminder, Profile } from '../types';

const STORAGE_KEY = 'just-medicine-reminder-profiles';

export const useReminders = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(STORAGE_KEY);
      if (storedProfiles) {
        setProfiles(JSON.parse(storedProfiles));
      } else {
        // Create a default profile for the first-time user
        setProfiles([{ id: 'default-user', name: 'Me', reminders: [] }]);
      }
    } catch (error) {
      console.error("Failed to load profiles from localStorage", error);
       setProfiles([{ id: 'default-user', name: 'Me', reminders: [] }]);
    }
  }, []);

  useEffect(() => {
    if (profiles.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      } catch (error) {
        console.error("Failed to save profiles to localStorage", error);
      }
    }
  }, [profiles]);

  const addProfile = useCallback((name: string) => {
    const newProfile: Profile = {
      id: new Date().toISOString() + Math.random(),
      name,
      reminders: []
    };
    setProfiles(prev => [...prev, newProfile]);
    return newProfile;
  }, []);
  
  const updateProfileName = useCallback((profileId: string, name: string) => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, name } : p));
  }, []);
  
  const deleteProfile = useCallback((profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  }, []);

  const addReminder = useCallback((profileId: string, reminderData: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      id: new Date().toISOString() + Math.random(),
      ...reminderData,
    };
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        return { ...p, reminders: [...p.reminders, newReminder] };
      }
      return p;
    }));
  }, []);

  const updateReminder = useCallback((profileId: string, updatedReminder: Reminder) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        const updatedReminders = p.reminders.map(r => r.id === updatedReminder.id ? updatedReminder : r);
        return { ...p, reminders: updatedReminders };
      }
      return p;
    }));
  }, []);

  const deleteReminder = useCallback((profileId: string, reminderId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        return { ...p, reminders: p.reminders.filter(r => r.id !== reminderId) };
      }
      return p;
    }));
  }, []);

  return { profiles, addProfile, updateProfileName, deleteProfile, addReminder, updateReminder, deleteReminder };
};
