import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Task, TaskStatus, UserProfile } from '../types';

const TASKS_COLLECTION = 'tasks';
const USERS_COLLECTION = 'users';

export function subscribeToUserTasks(
  userId: string,
  onSuccess: (tasks: Task[]) => void,
  onError: (error: Error) => void
): () => void {
  const tasksRef = collection(db, TASKS_COLLECTION);
  const q = query(tasksRef, where('userId', '==', userId));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const taskList: Task[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        taskList.push({
          id: docSnap.id,
          userId: data.userId || userId,
          userEmail: data.userEmail,
          userName: data.userName,
          taskName: data.taskName || '',
          description: data.description || '',
          deadline: data.deadline || new Date().toISOString(),
          status: (data.status as TaskStatus) || 'Pending',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      });
      onSuccess(taskList);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, TASKS_COLLECTION);
      } catch (e) {
        onError(e as Error);
      }
    }
  );

  return unsubscribe;
}

export async function createCloudTask(
  userId: string,
  taskData: {
    taskName: string;
    description: string;
    deadline: string;
    status: TaskStatus;
    userEmail?: string;
    userName?: string;
  }
): Promise<string> {
  const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const taskDocRef = doc(db, TASKS_COLLECTION, taskId);
  const now = new Date().toISOString();

  const payload: Record<string, any> = {
    userId,
    taskName: taskData.taskName.slice(0, 200),
    description: taskData.description.slice(0, 2000),
    deadline: taskData.deadline,
    status: taskData.status,
    createdAt: now,
    updatedAt: now,
  };

  if (taskData.userEmail) payload.userEmail = taskData.userEmail;
  if (taskData.userName) payload.userName = taskData.userName;

  try {
    await setDoc(taskDocRef, payload);
    return taskId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${TASKS_COLLECTION}/${taskId}`);
  }
}

export async function updateCloudTask(
  taskId: string,
  updates: {
    taskName?: string;
    description?: string;
    deadline?: string;
    status?: TaskStatus;
  }
): Promise<void> {
  const taskDocRef = doc(db, TASKS_COLLECTION, taskId);
  const now = new Date().toISOString();

  const payload: Record<string, any> = {
    updatedAt: now,
  };

  if (updates.taskName !== undefined) payload.taskName = updates.taskName.slice(0, 200);
  if (updates.description !== undefined) payload.description = updates.description.slice(0, 2000);
  if (updates.deadline !== undefined) payload.deadline = updates.deadline;
  if (updates.status !== undefined) payload.status = updates.status;

  try {
    await updateDoc(taskDocRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${TASKS_COLLECTION}/${taskId}`);
  }
}

export async function deleteCloudTask(taskId: string): Promise<void> {
  const taskDocRef = doc(db, TASKS_COLLECTION, taskId);
  try {
    await deleteDoc(taskDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${TASKS_COLLECTION}/${taskId}`);
  }
}

export async function syncUserProfile(user: UserProfile): Promise<void> {
  const userDocRef = doc(db, USERS_COLLECTION, user.id);
  const now = new Date().toISOString();

  const payload: Record<string, any> = {
    id: user.id,
    name: user.name.slice(0, 100),
    email: user.email.slice(0, 150),
    lastLoginAt: now,
  };

  if (user.avatarUrl) {
    payload.avatarUrl = user.avatarUrl.slice(0, 500);
  }

  try {
    await setDoc(userDocRef, { ...payload, createdAt: now }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${USERS_COLLECTION}/${user.id}`);
  }
}
