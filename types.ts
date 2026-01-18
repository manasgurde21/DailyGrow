export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO Date string YYYY-MM-DD
  priority: Priority;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  type: 'Daily' | 'Weekly';
  reminderTime: string; // HH:MM
  color: string; // Tailwind color class or hex
  streak: number;
  completedDates: string[]; // Array of ISO Date strings YYYY-MM-DD
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  totalHabitsCompleted: number;
  totalTasksCompleted: number;
  bestStreak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedDate?: string;
}

export type TabView = 'home' | 'habits' | 'tasks' | 'stats' | 'profile';