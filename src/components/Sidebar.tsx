import React from 'react';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  TrendingUp,
  Shield,
  Layers,
  Settings,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { FilterStatus, Task, UserProfile } from '../types';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
  currentUser: UserProfile | null;
  onOpenUserModal: () => void;
  onOpenNewTaskModal: () => void;
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
  onOpenNewTaskModal,
  isOnline,
}) => {
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

  const navItems = [
    {
      id: 'All',
      label: 'All Tasks',
      icon: ListTodo,
      count: total,
      color: 'text-slate-600',
      activeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 font-semibold',
      badgeBg: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'Pending',
      label: 'In Progress',
      icon: Clock,
      count: pending,
      color: 'text-amber-600',
      activeBg: 'bg-amber-50 text-amber-900 border-amber-200/80 font-semibold',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'Completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: completed,
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200/80 font-semibold',
      badgeBg: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200/90 shadow-lg lg:shadow-none flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <BrandLogo size="sm" badgeText="PRO" />
          <button
            id="close-sidebar-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 pb-2">
          <button
            id="sidebar-new-task-btn"
            onClick={() => {
              onOpenNewTaskModal();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer group"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-200 group-hover:scale-110 transition-transform" />
            <span>Create New Task</span>
            <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 text-[9px] font-mono font-normal bg-indigo-700/80 rounded text-indigo-100">
              N
            </kbd>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Main Views */}
          <div>
            <div className="px-3 mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border ${
                      isActive
                        ? item.activeBg
                        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? '' : item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-white/80 shadow-2xs' : item.badgeBg
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
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                <span>Task Velocity</span>
              </span>
              <span className="text-xs font-bold text-indigo-600 font-mono">
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>{completed} of {total} completed</span>
              {overdueCount > 0 ? (
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  {overdueCount} overdue
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold">On Track</span>
              )}
            </div>
          </div>

          {/* Quick System Status Card */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Sync Engine
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <span>{isOnline ? 'Live & Connected' : 'Offline Mode'}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              State updates persist securely across devices in real-time.
            </p>
          </div>
        </div>

        {/* Sidebar Footer / User Profile Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button
            id="sidebar-user-profile-btn"
            onClick={() => {
              onOpenUserModal();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:border-slate-200 border border-transparent transition-all text-left group cursor-pointer shadow-2xs"
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-indigo-600 shadow-2xs shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {currentUser?.name || 'Guest User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.isAnonymous ? 'Guest Session' : currentUser?.email || 'Verified Account'}
              </p>
            </div>
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-45" />
          </button>
        </div>
      </aside>
    </>
  );
};
