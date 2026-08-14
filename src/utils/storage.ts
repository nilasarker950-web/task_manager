import { Task, User } from '../types';

const TASKS_STORAGE_KEY = 'cloud_tasks_data';
const USER_STORAGE_KEY = 'cloud_tasks_current_user';

export const DEFAULT_USERS: User[] = [
  {
    id: 'user_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@cloudlab.edu',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'user_elena',
    name: 'Elena Chen',
    email: 'elena.chen@cloudlab.edu',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'user_guest',
    name: 'Guest Developer',
    email: 'guest@cloudlab.local',
    avatarColor: 'bg-slate-600',
    isGuest: true,
  },
];

// Helper to generate future deadlines
function getFutureDate(daysFromNow: number, hours: number = 18, minutes: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format for datetime-local
}

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    userId: 'user_alex',
    taskName: 'Deploy Serverless Backend API',
    description: 'Set up REST endpoints for task CRUD operations on Cloud Run / Cloud Functions with CORS configuration.',
    deadline: getFutureDate(2, 17, 0),
    status: 'Pending',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-102',
    userId: 'user_alex',
    taskName: 'Configure Cloud Storage Bucket',
    description: 'Create cloud object storage bucket with read/write access permissions and lifecycle retention policies.',
    deadline: getFutureDate(4, 12, 0),
    status: 'Pending',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-103',
    userId: 'user_alex',
    taskName: 'Database Schema Design & Migration',
    description: 'Define relational and document schema for user task management with proper indexing on deadlines and status.',
    deadline: getFutureDate(-1, 20, 0), // Overdue / due yesterday
    status: 'Completed',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-104',
    userId: 'user_alex',
    taskName: 'Submit Cloud Mini Project Report',
    description: 'Document the cloud architecture diagrams, security considerations, and deployment steps for submission.',
    deadline: getFutureDate(7, 23, 59),
    status: 'Pending',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse stored tasks:', err);
  }
  // Default seed
  saveTasks(INITIAL_TASKS);
  return INITIAL_TASKS;
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to storage:', err);
  }
}

export function loadCurrentUser(): User {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse current user:', err);
  }
  const defaultUser = DEFAULT_USERS[0];
  saveCurrentUser(defaultUser);
  return defaultUser;
}

export function saveCurrentUser(user: User): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save current user:', err);
  }
}
