export interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: 'daily' | 'weekly';
  dayOfWeek?: number; // 0 (Sun) to 6 (Sat), only if frequency is 'weekly'
  times: string[]; // Array of 'HH:MM'
}

export interface Profile {
  id: string;
  name: string;
  reminders: Reminder[];
}
