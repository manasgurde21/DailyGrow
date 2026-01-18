import { db, UserProfileEntity } from './db';
import { Habit, Task, UserProfile } from '../types';
import { INITIAL_HABITS, INITIAL_TASKS, MOCK_USER } from '../constants';

const USER_ID = 'currentUser';

// --- Habits ---

export const getStoredHabits = async (): Promise<Habit[]> => {
  const count = await db.habits.count();
  if (count === 0) {
    await db.habits.bulkAdd(INITIAL_HABITS);
    return INITIAL_HABITS;
  }
  return await db.habits.toArray();
};

export const addHabit = async (habit: Habit) => {
  await db.habits.put(habit);
};

export const updateHabit = async (habit: Habit) => {
  await db.habits.put(habit);
};

export const deleteHabit = async (id: string) => {
  await db.habits.delete(id);
};

// --- Tasks ---

export const getStoredTasks = async (): Promise<Task[]> => {
  const count = await db.tasks.count();
  if (count === 0) {
    await db.tasks.bulkAdd(INITIAL_TASKS);
    return INITIAL_TASKS;
  }
  return await db.tasks.toArray();
};

export const addTask = async (task: Task) => {
  await db.tasks.put(task);
};

export const updateTask = async (task: Task) => {
  await db.tasks.put(task);
};

export const deleteTask = async (id: string) => {
  await db.tasks.delete(id);
};

// --- User Profile ---

export const getStoredUser = async (): Promise<UserProfile> => {
  const user = await db.user.get(USER_ID);
  if (!user) {
    const newUser: UserProfileEntity = { ...MOCK_USER, id: USER_ID };
    await db.user.put(newUser);
    return MOCK_USER;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...profile } = user;
  return profile;
};

export const saveUser = async (user: UserProfile) => {
  const userEntity: UserProfileEntity = { ...user, id: USER_ID };
  await db.user.put(userEntity);
};
