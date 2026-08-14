import React from 'react';
import { ListTodo, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { FilterStatus, Task } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TaskStatsProps {
  tasks: Task[];
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
}

export const TaskStats: React.FC<TaskStatsProps> = ({
  tasks,
  activeFilter,
  onSelectFilter,
}) => {
  const { isDark } = useTheme();
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Tasks Tile */}
      <button
        id="stat-total-tasks"
        onClick={() => onSelectFilter('All')}
        className={`group text-left p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
          activeFilter === 'All'
            ? isDark
              ? 'bg-slate-800/90 border-indigo-500 shadow-indigo-950/40 ring-2 ring-indigo-500/20'
              : 'bg-white border-indigo-500 shadow-indigo-100/40 ring-2 ring-indigo-500/10'
            : isDark
            ? 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 hover:shadow-slate-950/30'
            : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-slate-200/40'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Tasks
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all duration-200 group-hover:scale-110">
            <ListTodo className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {total}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">all entries</span>
        </div>
      </button>

      {/* Pending Tasks Tile */}
      <button
        id="stat-pending-tasks"
        onClick={() => onSelectFilter('Pending')}
        className={`group text-left p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
          activeFilter === 'Pending'
            ? isDark
              ? 'bg-slate-800/90 border-amber-500 shadow-amber-950/40 ring-2 ring-amber-500/20'
              : 'bg-white border-amber-500 shadow-amber-100/40 ring-2 ring-amber-500/10'
            : isDark
            ? 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 hover:shadow-slate-950/30'
            : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-slate-200/40'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            In Progress
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400 transition-all duration-200 group-hover:scale-110">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {pending}
          </span>
          <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">pending</span>
        </div>
      </button>

      {/* Completed Tasks Tile with Progress Bar */}
      <button
        id="stat-completed-tasks"
        onClick={() => onSelectFilter('Completed')}
        className={`group text-left p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
          activeFilter === 'Completed'
            ? isDark
              ? 'bg-slate-800/90 border-emerald-500 shadow-emerald-950/40 ring-2 ring-emerald-500/20'
              : 'bg-white border-emerald-500 shadow-emerald-100/40 ring-2 ring-emerald-500/10'
            : isDark
            ? 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 hover:shadow-slate-950/30'
            : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-slate-200/40'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Completed
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-all duration-200 group-hover:scale-110">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {completed}
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold font-mono">
            {completionRate}%
          </span>
        </div>
        {/* Progress Track */}
        <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </button>

      {/* Deadline Urgency Tile */}
      <div
        className={`p-4 rounded-2xl border transition-all duration-200 ${
          isDark
            ? 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
            : 'bg-white border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            Past Deadline
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              overdueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
            }`}
          >
            {overdueCount}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {overdueCount === 0 ? 'All on schedule' : overdueCount === 1 ? '1 overdue' : `${overdueCount} overdue`}
          </span>
        </div>
      </div>
    </div>
  );
};
