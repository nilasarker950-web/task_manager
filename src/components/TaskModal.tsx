import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Task, TaskStatus } from '../types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialTask ? 'Edit Task Details' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-500">
              Syncing to Cloud Firestore with deadline notifications
            </p>
          </div>
          <button
            id="close-task-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="task-name-input"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
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
              placeholder="e.g., Configure Firebase Authentication Rules"
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 shadow-2xs"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="task-desc-input"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
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
              placeholder="Add project details, execution steps, or acceptance requirements..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 resize-y shadow-2xs"
            />
          </div>

          {/* Deadline */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="task-deadline-input"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
              >
                Deadline <span className="text-rose-500">*</span>
              </label>
              {/* Quick Presets */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuickDeadline(0, 18)}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(1, 18)}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(3, 18)}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  +3 Days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(7, 18)}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  +1 Week
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
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 shadow-2xs font-mono"
              />
            </div>
          </div>

          {/* Status (Pending / Completed) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="status-option-pending"
                onClick={() => setStatus('Pending')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  status === 'Pending'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/10 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Pending</span>
              </button>

              <button
                type="button"
                id="status-option-completed"
                onClick={() => setStatus('Completed')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  status === 'Completed'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/10 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Completed</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="cancel-task-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-task-btn"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{initialTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
