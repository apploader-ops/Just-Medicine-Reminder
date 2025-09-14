import React from 'react';
import type { Reminder } from '../types';
import { ClockIcon, PillIcon, TrashIcon, PencilIcon } from './icons';

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ReminderItemProps {
  reminder: Reminder;
  onDelete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
}

const formatTimeTo12Hour = (time: string): string => {
    if (!time) return '';
    const [hoursStr, minutes] = time.split(':');
    const hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    let formattedHours = hours % 12;
    if (formattedHours === 0) {
      formattedHours = 12; // Handle midnight and noon
    }
    return `${formattedHours}:${minutes} ${ampm}`;
};

export const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, onDelete, onEdit }) => {
  const getScheduleText = () => {
    if (reminder.frequency === 'weekly') {
      return `Weekly on ${WEEK_DAYS[reminder.dayOfWeek || 0]}`;
    }
    return 'Daily';
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-start justify-between transition-shadow hover:shadow-md">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-3 rounded-full mt-1">
            <PillIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="font-bold text-lg text-slate-800">{reminder.medicineName}</p>
          {reminder.dosage && (
             <div className="flex items-center text-sm text-slate-500 mt-1">
                <span>{reminder.dosage}</span>
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 items-center">
            <p className="text-sm font-medium text-slate-600">{getScheduleText()}</p>
            <div className="flex flex-wrap gap-2">
              {reminder.times.sort().map(time => (
                <p key={time} className="font-mono text-sm text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />
                  {formatTimeTo12Hour(time)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-shrink-0 ml-4">
        <button
            onClick={() => onEdit(reminder)}
            className="text-slate-400 hover:text-blue-600 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label={`Edit reminder for ${reminder.medicineName}`}
        >
            <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(reminder.id)}
          className="text-slate-400 hover:text-red-500 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          aria-label={`Delete reminder for ${reminder.medicineName}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
