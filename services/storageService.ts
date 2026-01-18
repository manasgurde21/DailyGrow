import { Habit, Task, UserProfile } from '../types';
import { INITIAL_HABITS, INITIAL_TASKS, MOCK_USER } from '../constants';

const HABITS_KEY = 'dailygrow_habits';
const TASKS_KEY = 'dailygrow_tasks';
const USER_KEY = 'dailygrow_user';

export const getStoredHabits = (): Habit[] => {
  const stored = localStorage.getItem(HABITS_KEY);
  if (stored) return JSON.parse(stored);
  // Initialize with today's date in completedDates for demo purposes if creating fresh
  return INITIAL_HABITS; 
};

export const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

export const getStoredTasks = (): Task[] => {
  const stored = localStorage.getItem(TASKS_KEY);
  return stored ? JSON.parse(stored) : INITIAL_TASKS;
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getStoredUser = (): UserProfile => {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : MOCK_USER;
};

export const saveUser = (user: UserProfile) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};