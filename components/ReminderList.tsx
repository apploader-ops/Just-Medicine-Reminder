import React from 'react';
import type { Reminder } from '../types';
import { ReminderItem } from './ReminderItem';
import { BellIcon } from './icons';

interface ReminderListProps {
  reminders: Reminder[];
  onDeleteReminder: (id: string) => void;
  onEditReminder: (reminder: Reminder) => void;
}

export const ReminderList: React.FC<ReminderListProps> = ({ reminders, onDeleteReminder, onEditReminder }) => {
  if (reminders.length === 0) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-sm">
        <BellIcon className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-2 text-lg font-medium text-slate-800">No reminders yet</h3>
        <p className="mt-1 text-sm text-slate-500">Add a reminder using the button above to get started.</p>
      </div>
    );
  }

  const sortedReminders = [...reminders].sort((a, b) => {
    const timeA = a.times[0] || '23:59';
    const timeB = b.times[0] || '23:59';
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="space-y-4">
      {sortedReminders.map((reminder) => (
        <ReminderItem 
            key={reminder.id} 
            reminder={reminder} 
            onDelete={onDeleteReminder}
            onEdit={onEditReminder}
        />
      ))}
    </div>
  );
};
