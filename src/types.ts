export type TaskStatus = 'Pending' | 'Completed';

export interface Task {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  taskName: string;
  description: string;
  deadline: string; // ISO date string (YYYY-MM-DDTHH:mm or YYYY-MM-DD)
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatarColor?: string;
  isAnonymous?: boolean;
  isGuest?: boolean;
}

export type User = UserProfile;

export type FilterStatus = 'All' | 'Pending' | 'Completed';
export type SortOption = 'deadline_asc' | 'deadline_desc' | 'created_desc' | 'name_asc';

export type BackgroundVariant = 'slate' | 'midnight' | 'warm' | 'emerald' | 'minimal';

export interface ThemeConfig {
  id: BackgroundVariant;
  name: string;
  description: string;
  previewBg: string;
  previewBorder: string;
  previewAccent: string;
  isDark?: boolean;
}
