import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, taskId?: string) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
}) => {
  const { isDark } = useTheme();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset form values
  useEffect(() => {
    if (initialTask) {
      setTaskName(initialTask.taskName);
      setDescription(initialTask.description);
      try {
        const d = new Date(initialTask.deadline);
        const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setDeadline(isoLocal);
      } catch {
        setDeadline(initialTask.deadline);
      }
      setStatus(initialTask.status);
    } else {
      // Default: new task with deadline in 2 days at 18:00
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 2);
      defaultDate.setHours(18, 0, 0, 0);
      const isoLocal = new Date(defaultDate.getTime() - defaultDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setTaskName('');
      setDescription('');
      setDeadline(isoLocal);
      setStatus('Pending');
    }
    setError(null);
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setError('Please provide a Task Name');
      return;
    }
    if (!deadline) {
      setError('Please specify a Deadline');
      return;
    }

    onSave(
      {
        taskName: taskName.trim(),
        description: description.trim(),
        deadline: new Date(deadline).toISOString(),
        status,
      },
      initialTask?.id
    );
    onClose();
  };

  const setQuickDeadline = (daysAhead: number, hour: number = 18) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(hour, 0, 0, 0);
    const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setDeadline(isoLocal);
    if (error) setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-800/40' : 'border-slate-100 bg-slate-50/60'
          }`}
        >
          <div>
            <h2 className="text-base font-bold">
              {initialTask ? 'Edit Task Details' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-400">
              Set title, description, and time-bound deadline parameters
            </p>
          </div>
          <button
            id="close-task-modal-btn"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="task-name-input"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Task Name <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {taskName.length}/200
              </span>
            </div>
            <input
              id="task-name-input"
              type="text"
              required
              maxLength={200}
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g., Complete System Architecture Diagram"
              className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-all ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 hover:border-slate-600'
                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="task-desc-input"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Description
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {description.length}/2000
              </span>
            </div>
            <textarea
              id="task-desc-input"
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add task specifications, milestones, or notes..."
              className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y shadow-2xs transition-all ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 hover:border-slate-600'
                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
              }`}
            />
          </div>

          {/* Deadline */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="task-deadline-input"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Deadline <span className="text-rose-500">*</span>
              </label>
              {/* Quick Presets with Hover Effects */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuickDeadline(0, 18)}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer hover:scale-105"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(1, 18)}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer hover:scale-105"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(3, 18)}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer hover:scale-105"
                >
                  +3 Days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(7, 18)}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer hover:scale-105"
                >
                  +1 Wk
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                id="task-deadline-input"
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (error) setError(null);
                }}
                className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs font-mono transition-all ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-white hover:border-slate-600'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                }`}
              />
            </div>
          </div>

          {/* Status (Pending / Completed) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-slate-700 dark:text-slate-300">
              Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="status-option-pending"
                onClick={() => setStatus('Pending')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer hover:-translate-y-0.5 ${
                  status === 'Pending'
                    ? isDark
                      ? 'border-amber-500 bg-amber-950/60 text-amber-200 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/10 shadow-2xs'
                    : isDark
                    ? 'border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-500" />
                <span>In Progress</span>
              </button>

              <button
                type="button"
                id="status-option-completed"
                onClick={() => setStatus('Completed')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer hover:-translate-y-0.5 ${
                  status === 'Completed'
                    ? isDark
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/10 shadow-2xs'
                    : isDark
                    ? 'border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Completed</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div
            className={`pt-4 border-t flex items-center justify-end gap-2.5 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <button
              type="button"
              id="cancel-task-btn"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-task-btn"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer flex items-center gap-1.5"
            >
              <span>{initialTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
