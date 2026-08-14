import React from 'react';
import { ListTodo, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { FilterStatus, Task } from '../types';

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
        className={`group text-left p-4 rounded-xl border transition-all cursor-pointer ${
          activeFilter === 'All'
            ? 'bg-white border-indigo-500 shadow-xs ring-2 ring-indigo-500/10'
            : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total Tasks
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center text-slate-500 transition-colors">
            <ListTodo className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{total}</span>
          <span className="text-[11px] text-slate-400 font-medium">all entries</span>
        </div>
      </button>

      {/* Pending Tasks Tile */}
      <button
        id="stat-pending-tasks"
        onClick={() => onSelectFilter('Pending')}
        className={`group text-left p-4 rounded-xl border transition-all cursor-pointer ${
          activeFilter === 'Pending'
            ? 'bg-white border-amber-500 shadow-xs ring-2 ring-amber-500/10'
            : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            Pending
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{pending}</span>
          <span className="text-[11px] text-amber-700/80 font-medium">in progress</span>
        </div>
      </button>

      {/* Completed Tasks Tile with Progress Bar */}
      <button
        id="stat-completed-tasks"
        onClick={() => onSelectFilter('Completed')}
        className={`group text-left p-4 rounded-xl border transition-all cursor-pointer ${
          activeFilter === 'Completed'
            ? 'bg-white border-emerald-500 shadow-xs ring-2 ring-emerald-500/10'
            : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            Completed
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{completed}</span>
          <span className="text-[11px] text-emerald-700 font-semibold">{completionRate}%</span>
        </div>
        {/* Sleek Completion Progress Track */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </button>

      {/* Deadline Urgency Tile */}
      <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">
            Past Deadline
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className={`text-2xl font-bold tracking-tight ${overdueCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {overdueCount}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {overdueCount === 0 ? 'All on schedule' : overdueCount === 1 ? 'requires attention' : 'require attention'}
          </span>
        </div>
      </div>
    </div>
  );
};
