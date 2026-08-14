import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { FilterStatus, SortOption } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TaskFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  counts: { all: number; pending: number; completed: number };
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortOptionChange,
  counts,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl p-2.5 sm:p-3 border shadow-2xs mb-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between transition-all duration-200 ${
        isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200/90'
      }`}
    >
      {/* Segmented Status Filter Tabs */}
      <div
        className={`flex items-center gap-1 p-1 rounded-xl overflow-x-auto ${
          isDark ? 'bg-slate-900/80' : 'bg-slate-100/90'
        }`}
      >
        <button
          id="filter-tab-all"
          onClick={() => onStatusFilterChange('All')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
            statusFilter === 'All'
              ? isDark
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-900 shadow-2xs'
              : isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>All</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              statusFilter === 'All'
                ? isDark
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-slate-100 text-slate-800'
                : isDark
                ? 'bg-slate-800 text-slate-400'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          id="filter-tab-pending"
          onClick={() => onStatusFilterChange('Pending')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
            statusFilter === 'Pending'
              ? isDark
                ? 'bg-amber-950/80 text-amber-200 border border-amber-800 shadow-xs'
                : 'bg-white text-amber-900 shadow-2xs'
              : isDark
              ? 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>Pending</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              statusFilter === 'Pending'
                ? isDark
                  ? 'bg-amber-900/60 text-amber-200'
                  : 'bg-amber-100 text-amber-900'
                : isDark
                ? 'bg-slate-800 text-slate-400'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.pending}
          </span>
        </button>

        <button
          id="filter-tab-completed"
          onClick={() => onStatusFilterChange('Completed')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
            statusFilter === 'Completed'
              ? isDark
                ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800 shadow-xs'
                : 'bg-white text-emerald-900 shadow-2xs'
              : isDark
              ? 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>Completed</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              statusFilter === 'Completed'
                ? isDark
                  ? 'bg-emerald-900/60 text-emerald-200'
                  : 'bg-emerald-100 text-emerald-900'
                : isDark
                ? 'bg-slate-800 text-slate-400'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.completed}
          </span>
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Field with Dynamic Focus Highlights */}
        <div className="relative flex-1 sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-tasks-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className={`w-full pl-8.5 pr-8 py-1.5 text-xs rounded-xl border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
              isDark
                ? 'border-slate-700 bg-slate-900/90 text-slate-100 placeholder:text-slate-500 hover:border-slate-600'
                : 'border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white text-slate-800 placeholder:text-slate-400 hover:border-slate-300'
            }`}
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex items-center">
          <label htmlFor="sort-tasks-select" className="sr-only">
            Sort Tasks
          </label>
          <div className="relative w-full sm:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="sort-tasks-select"
              value={sortOption}
              onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
              className={`w-full sm:w-auto pl-8 pr-7 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-150 cursor-pointer appearance-none shadow-2xs hover:-translate-y-0.5 ${
                isDark
                  ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <option value="deadline_asc">Deadline: Earliest First</option>
              <option value="deadline_desc">Deadline: Latest First</option>
              <option value="created_desc">Created: Newest First</option>
              <option value="name_asc">Alphabetical: A to Z</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
