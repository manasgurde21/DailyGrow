import { Habit, Task, UserProfile } from './types';

export const INITIAL_HABITS: Habit[] = [];

export const INITIAL_TASKS: Task[] = [];

export const MOCK_USER: UserProfile = {
  name: 'New User', // Default name
  avatarUrl: '', 
  totalHabitsCompleted: 0,
  totalTasksCompleted: 0,
  bestStreak: 0,
  achievements: []
};

// Bootstrap compatible classes
export const COLORS = [
  { name: 'Red', value: 'bg-rose' },
  { name: 'Orange', value: 'bg-orange' },
  { name: 'Amber', value: 'bg-amber' },
  { name: 'Green', value: 'bg-emerald' },
  { name: 'Teal', value: 'bg-teal' },
  { name: 'Cyan', value: 'bg-cyan' },
  { name: 'Blue', value: 'bg-blue' },
  { name: 'Indigo', value: 'bg-indigo' },
  { name: 'Purple', value: 'bg-purple' },
  { name: 'Pink', value: 'bg-pink' },
];