import React from 'react';
import {
  ListTodo,
  Clock,
  AlertTriangle,
  User,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { FilterStatus, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MobileBottomNavProps {
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
  onOpenNewTaskModal: () => void;
  onOpenUserModal: () => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
    overdue?: number;
  };
  currentUser: UserProfile | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeFilter,
  onSelectFilter,
  onOpenNewTaskModal,
  onOpenUserModal,
  counts,
  currentUser,
}) => {
  const { isDark } = useTheme();
  const overdueCount = counts.overdue ?? 0;

  return (
    <div
      id="mobile-bottom-nav"
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t backdrop-blur-xl transition-colors duration-200 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] ${
        isDark
          ? 'bg-slate-900/95 border-slate-800/90 text-slate-400'
          : 'bg-white/95 border-slate-200/90 text-slate-600'
      }`}
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto relative">
        {/* Tab 1: All Tasks */}
        <button
          id="mobile-nav-all"
          onClick={() => onSelectFilter('All')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 cursor-pointer min-w-[56px] relative active:scale-95 ${
            activeFilter === 'All'
              ? isDark
                ? 'text-indigo-400 font-bold'
                : 'text-indigo-600 font-bold'
              : 'hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ListTodo className={`w-5 h-5 ${activeFilter === 'All' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {counts.all > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[15px] h-[15px] rounded-full text-[9px] font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                {counts.all}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">All</span>
          {activeFilter === 'All' && (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
          )}
        </button>

        {/* Tab 2: Pending Tasks */}
        <button
          id="mobile-nav-pending"
          onClick={() => onSelectFilter('Pending')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 cursor-pointer min-w-[56px] relative active:scale-95 ${
            activeFilter === 'Pending'
              ? isDark
                ? 'text-amber-400 font-bold'
                : 'text-amber-600 font-bold'
              : 'hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Clock className={`w-5 h-5 ${activeFilter === 'Pending' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {counts.pending > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[15px] h-[15px] rounded-full text-[9px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                {counts.pending}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Pending</span>
          {activeFilter === 'Pending' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />
          )}
        </button>

        {/* Center Primary Action: Quick Add Task Floating-style Button */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            id="mobile-nav-add-task-fab"
            onClick={onOpenNewTaskModal}
            className="w-13 h-13 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer border-4 border-white dark:border-slate-900"
            aria-label="Add new task"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            New
          </span>
        </div>

        {/* Tab 4: Past Deadline (Overdue) */}
        <button
          id="mobile-nav-overdue"
          onClick={() => onSelectFilter('Overdue')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 cursor-pointer min-w-[56px] relative active:scale-95 ${
            activeFilter === 'Overdue'
              ? isDark
                ? 'text-rose-400 font-bold'
                : 'text-rose-600 font-bold'
              : 'hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <AlertTriangle className={`w-5 h-5 ${activeFilter === 'Overdue' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {overdueCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[15px] h-[15px] rounded-full text-[9px] font-mono font-bold bg-rose-500 text-white flex items-center justify-center animate-pulse">
                {overdueCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Overdue</span>
          {activeFilter === 'Overdue' && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-0.5" />
          )}
        </button>

        {/* Tab 5: Completed */}
        <button
          id="mobile-nav-completed"
          onClick={() => onSelectFilter('Completed')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 cursor-pointer min-w-[56px] relative active:scale-95 ${
            activeFilter === 'Completed'
              ? isDark
                ? 'text-emerald-400 font-bold'
                : 'text-emerald-600 font-bold'
              : 'hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <CheckCircle2 className={`w-5 h-5 ${activeFilter === 'Completed' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {counts.completed > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[15px] h-[15px] rounded-full text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                {counts.completed}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Done</span>
          {activeFilter === 'Completed' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
