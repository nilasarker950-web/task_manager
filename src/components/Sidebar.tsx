import React from 'react';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Settings,
  X,
  Palette,
  LogOut,
} from 'lucide-react';
import { FilterStatus, Task, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
  currentUser: UserProfile | null;
  onOpenUserModal: () => void;
  onOpenNewTaskModal?: () => void;
  onOpenThemeModal: () => void;
  isOnline: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  tasks,
  activeFilter,
  onSelectFilter,
  currentUser,
  onOpenUserModal,
  onOpenThemeModal,
}) => {
  const { isDark, themeConfig } = useTheme();
  const { logout } = useAuth();
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;

  const now = new Date().getTime();
  const overdueCount = tasks.filter((t) => {
    if (t.status === 'Completed') return false;
    const deadlineTime = new Date(t.deadline).getTime();
    return deadlineTime < now;
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleSidebarLogout = async () => {
    onClose();
    await logout();
  };

  const navItems = [
    {
      id: 'All',
      label: 'All Tasks',
      icon: ListTodo,
      count: total,
      color: isDark ? 'text-slate-400' : 'text-slate-600',
      activeBg: isDark
        ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800 font-semibold shadow-xs'
        : 'bg-indigo-50 text-indigo-700 border-indigo-200/80 font-semibold shadow-xs',
      badgeBg: isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700',
    },
    {
      id: 'Pending',
      label: 'In Progress',
      icon: Clock,
      count: pending,
      color: 'text-amber-500',
      activeBg: isDark
        ? 'bg-amber-950/60 text-amber-300 border-amber-800 font-semibold shadow-xs'
        : 'bg-amber-50 text-amber-900 border-amber-200/80 font-semibold shadow-xs',
      badgeBg: isDark ? 'bg-amber-950 text-amber-300' : 'bg-amber-100 text-amber-800',
    },
    {
      id: 'Completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: completed,
      color: 'text-emerald-500',
      activeBg: isDark
        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 font-semibold shadow-xs'
        : 'bg-emerald-50 text-emerald-900 border-emerald-200/80 font-semibold shadow-xs',
      badgeBg: isDark ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'Overdue',
      label: 'Past Deadline',
      icon: AlertTriangle,
      count: overdueCount,
      color: 'text-rose-500',
      activeBg: isDark
        ? 'bg-rose-950/60 text-rose-300 border-rose-800 font-semibold shadow-xs'
        : 'bg-rose-50 text-rose-900 border-rose-200/80 font-semibold shadow-xs',
      badgeBg: isDark ? 'bg-rose-950 text-rose-300' : 'bg-rose-100 text-rose-800',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sticky Desktop & Off-canvas Mobile Sidebar Panel */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 border-r flex flex-col overflow-hidden transition-all duration-300 ease-out lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:self-start lg:shrink-0 lg:z-20 lg:w-68 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl lg:shadow-none'
            : 'bg-white border-slate-200/90 text-slate-800 shadow-2xl lg:shadow-none'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Mobile Header (Hidden on Desktop) */}
        <div
          className={`h-16 px-4 border-b flex items-center justify-between lg:hidden ${
            isDark ? 'border-slate-800 bg-slate-850/80' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              TP
            </div>
            <div>
              <span className="text-xs font-bold tracking-tight block">TaskPulse</span>
              <span className="text-[10px] text-slate-400 font-mono">Workspace Menu</span>
            </div>
          </div>
          <button
            id="close-sidebar-btn"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Polished Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {/* Main Views */}
          <div>
            <div className="px-2.5 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Workspace Views
              </span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id.toLowerCase()}`}
                    onClick={() => {
                      onSelectFilter(item.id as FilterStatus);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-150 cursor-pointer border ${
                      isActive
                        ? item.activeBg
                        : isDark
                        ? 'border-transparent text-slate-400 hover:bg-slate-800/80 hover:text-white font-medium'
                        : 'border-transparent text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? '' : item.color}`} />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/80 dark:bg-slate-800 shadow-2xs' : item.badgeBg
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Productivity Velocity Card */}
          <div
            className={`p-4 rounded-2xl border space-y-2.5 transition-all duration-200 ${
              isDark
                ? 'bg-slate-800/50 border-slate-700/70'
                : 'bg-slate-50/80 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                <span>Task Velocity</span>
              </span>
              <span className="text-xs font-bold text-indigo-500 font-mono">
                {completionRate}%
              </span>
            </div>
            <div
              className={`w-full h-1.5 rounded-full overflow-hidden ${
                isDark ? 'bg-slate-700' : 'bg-slate-200/80'
              }`}
            >
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{completed} of {total} done</span>
              {overdueCount > 0 ? (
                <span className="text-rose-500 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  {overdueCount} overdue
                </span>
              ) : (
                <span className="text-emerald-500 font-semibold">On Track</span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: User Profile + Direct Logout for Mobile */}
        <div
          className={`p-3.5 border-t space-y-2 ${
            isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          {/* User Profile Settings Button */}
          <button
            id="sidebar-user-profile-btn"
            onClick={() => {
              onOpenUserModal();
              onClose();
            }}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-transparent transition-all duration-150 text-left group cursor-pointer ${
              isDark
                ? 'hover:bg-slate-800 hover:border-slate-700'
                : 'hover:bg-white hover:border-slate-200'
            }`}
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-indigo-600 shadow-2xs shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {currentUser?.name || 'User Profile'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.isAnonymous ? 'Guest Session' : currentUser?.email || 'Active Account'}
              </p>
            </div>
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform group-hover:rotate-45" />
          </button>

          {/* Quick 1-Tap Logout Button (Especially clear and easy on mobile) */}
          <button
            id="sidebar-logout-btn"
            onClick={handleSidebarLogout}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-600 transition-all duration-150 cursor-pointer border border-rose-500/20 active:scale-95 ${
              isDark
                ? 'bg-rose-950/20 hover:bg-rose-950/40 hover:border-rose-800'
                : 'bg-rose-50/60 hover:bg-rose-100/80 hover:border-rose-200'
            }`}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out / Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

