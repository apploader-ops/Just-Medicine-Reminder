import React, { useState, useEffect } from 'react';
import type { Reminder } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface ReminderFormModalProps {
  onClose: () => void;
  onSave: (reminder: Omit<Reminder, 'id'> | Reminder) => void;
  reminderToEdit: Reminder | null;
}

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ReminderFormModal: React.FC<ReminderFormModalProps> = ({ onClose, onSave, reminderToEdit }) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [times, setTimes] = useState<string[]>(['09:00']);

  useEffect(() => {
    if (reminderToEdit) {
      setMedicineName(reminderToEdit.medicineName);
      setDosage(reminderToEdit.dosage);
      setFrequency(reminderToEdit.frequency);
      setDayOfWeek(reminderToEdit.dayOfWeek ?? 0);
      setTimes(reminderToEdit.times);
    }
  }, [reminderToEdit]);

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const addTime = () => {
    setTimes([...times, '']);
  };

  const removeTime = (index: number) => {
    if (times.length > 1) {
      setTimes(times.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName || times.some(t => !t)) {
      alert('Please fill in the medicine name and all time fields.');
      return;
    }
    
    const reminderData = {
      medicineName,
      dosage,
      frequency,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
      times,
    };

    if (reminderToEdit) {
      onSave({ ...reminderData, id: reminderToEdit.id });
    } else {
      onSave(reminderData);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-700 mb-6">{reminderToEdit ? 'Edit Reminder' : 'Add Reminder'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="medicineName" className="block text-sm font-medium text-slate-600">
              Medicine Name
            </label>
            <input
              type="text" id="medicineName" value={medicineName} onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g., Vitamin D" required
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-slate-600">
              Dosage (Optional)
            </label>
            <input
              type="text" id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 1 tablet"
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Frequency</label>
            <div className="mt-2 flex gap-4">
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-blue-600" name="frequency" value="daily" checked={frequency === 'daily'} onChange={() => setFrequency('daily')} />
                <span className="ml-2 text-slate-700">Daily</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-blue-600" name="frequency" value="weekly" checked={frequency === 'weekly'} onChange={() => setFrequency('weekly')} />
                <span className="ml-2 text-slate-700">Weekly</span>
              </label>
            </div>
          </div>
          {frequency === 'weekly' && (
            <div>
              <label htmlFor="dayOfWeek" className="block text-sm font-medium text-slate-600">Day of the week</label>
              <select id="dayOfWeek" value={dayOfWeek} onChange={(e) => setDayOfWeek(parseInt(e.target.value, 10))} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                {WEEK_DAYS.map((day, index) => <option key={day} value={index}>{day}</option>)}
              </select>
            </div>
          )}
           <div>
            <label className="block text-sm font-medium text-slate-600">Time(s)</label>
            <div className="space-y-2 mt-1">
              {times.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} required
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button type="button" onClick={() => removeTime(index)} disabled={times.length <= 1} className="p-2 text-slate-400 hover:text-red-500 disabled:text-slate-300 disabled:cursor-not-allowed rounded-full transition-colors">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addTime} className="mt-2 text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
              <PlusIcon className="h-4 w-4" /> Add another time
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
              Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
