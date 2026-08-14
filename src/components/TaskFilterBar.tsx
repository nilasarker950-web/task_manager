import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { FilterStatus, SortOption } from '../types';

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
  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs mb-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      {/* Segmented Status Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-lg overflow-x-auto">
        <button
          id="filter-tab-all"
          onClick={() => onStatusFilterChange('All')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'All'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <span>All</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              statusFilter === 'All'
                ? 'bg-slate-100 text-slate-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          id="filter-tab-pending"
          onClick={() => onStatusFilterChange('Pending')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'Pending'
              ? 'bg-white text-amber-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <span>Pending</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              statusFilter === 'Pending'
                ? 'bg-amber-100 text-amber-900 font-bold'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.pending}
          </span>
        </button>

        <button
          id="filter-tab-completed"
          onClick={() => onStatusFilterChange('Completed')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'Completed'
              ? 'bg-white text-emerald-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <span>Completed</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              statusFilter === 'Completed'
                ? 'bg-emerald-100 text-emerald-900 font-bold'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.completed}
          </span>
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Field */}
        <div className="relative flex-1 sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-tasks-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter tasks by name..."
            className="w-full pl-8.5 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
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
              className="w-full sm:w-auto pl-8 pr-7 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none shadow-2xs"
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
