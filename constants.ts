import { Habit, Task, UserProfile } from './types';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h1',
    name: 'Drink Water (2L)',
    type: 'Daily',
    reminderTime: '09:00',
    color: 'bg-blue',
    streak: 3,
    completedDates: [], 
  },
  {
    id: 'h2',
    name: 'Read 10 Pages',
    type: 'Daily',
    reminderTime: '20:00',
    color: 'bg-amber',
    streak: 1,
    completedDates: [],
  },
  {
    id: 'h3',
    name: 'Morning Jog',
    type: 'Daily',
    reminderTime: '06:30',
    color: 'bg-emerald',
    streak: 0,
    completedDates: [],
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Buy Groceries',
    description: 'Milk, Eggs, Bread, Vegetables',
    date: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    completed: false,
  },
  {
    id: 't2',
    title: 'Submit Project Report',
    description: 'Finalize the Q3 financial summary',
    date: new Date().toISOString().split('T')[0],
    priority: 'High',
    completed: false,
  },
];

export const MOCK_USER: UserProfile = {
  name: '', // Empty to trigger "User" fallback
  avatarUrl: '', // Empty to check default avatar if needed (though we handle this in UI)
  totalHabitsCompleted: 42,
  totalTasksCompleted: 15,
  bestStreak: 12,
  achievements: [
    { id: 'a1', title: 'First Step', icon: '🦶', description: 'Completed your first habit', unlockedDate: '2023-10-01' },
    { id: 'a2', title: 'On Fire', icon: '🔥', description: 'Reached a 7-day streak', unlockedDate: '2023-10-08' },
  ]
};

// Bootstrap compatible classes (some custom defined in index.html)
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