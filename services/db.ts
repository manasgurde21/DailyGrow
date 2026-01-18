import Dexie, { Table } from 'dexie';
import { Habit, Task, UserProfile } from '../types';

export interface UserProfileEntity extends UserProfile {
  id: string;
}

export class DailyGrowDatabase extends Dexie {
  habits!: Table<Habit, string>;
  tasks!: Table<Task, string>;
  user!: Table<UserProfileEntity, string>;

  constructor() {
    super('DailyGrowDB');
    // Use type assertion to bypass TS error where 'version' is not found on subclass instance
    (this as any).version(1).stores({
      habits: 'id',
      tasks: 'id',
      user: 'id'
    });
  }
}

export const db = new DailyGrowDatabase();