import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  AlertCircle,
  Copy,
  Check,
  User,
  Hash,
  Sparkles,
  Share2,
  FileText,
} from 'lucide-react';
import { Task } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ViewTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (taskId: string) => void;
}

export const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
  isOpen,
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const { isDark } = useTheme();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'Completed';

  // Format deadline date and relative countdown
  const formatDeadlineDetails = (deadlineStr: string) => {
    try {
      const date = new Date(deadlineStr);
      if (isNaN(date.getTime())) return { display: deadlineStr, relative: '', isOverdue: false, diffDays: 0 };

      const now = new Date();
      const diffMs = date.getTime() - now.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));

      const isOverdue = diffMs < 0 && !isCompleted;

      let relative = '';
      if (isCompleted) {
        relative = 'Completed Task';
      } else if (isOverdue) {
        if (Math.abs(diffDays) === 0) relative = 'Overdue by hours';
        else if (Math.abs(diffDays) === 1) relative = 'Overdue by 1 day';
        else relative = `Overdue by ${Math.abs(diffDays)} days`;
      } else if (diffDays === 0) {
        relative = diffHours <= 1 ? 'Due very soon (today)' : `Due today (${diffHours}h remaining)`;
      } else if (diffDays === 1) {
        relative = 'Due tomorrow';
      } else if (diffDays > 1) {
        relative = `Due in ${diffDays} days`;
      }

      const formatted = date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return { display: formatted, relative, isOverdue, diffDays };
    } catch {
      return { display: deadlineStr, relative: '', isOverdue: false, diffDays: 0 };
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const deadlineInfo = formatDeadlineDetails(task.deadline);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-850/80' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                isCompleted
                  ? isDark
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : deadlineInfo.isOverdue
                  ? isDark
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                  : isDark
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : deadlineInfo.isOverdue ? (
                <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
              ) : (
                <Clock className="w-4 h-4 text-amber-500" />
              )}
              <span className="font-mono uppercase tracking-wider text-[11px]">{task.status}</span>
            </span>
            <span className="text-xs font-medium text-slate-400">Task Overview</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCopy(task.taskName, 'title')}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-slate-200 ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
              title="Copy Task Name"
            >
              {copiedField === 'title' ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              id="close-view-task-modal-btn"
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-slate-200 ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Task Name Headline */}
          <div>
            <h2
              className={`text-lg sm:text-xl font-extrabold tracking-tight leading-snug break-words ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {task.taskName}
            </h2>
          </div>

          {/* Deadline & Status Analysis Card */}
          <div
            className={`p-4.5 rounded-2xl border ${
              isCompleted
                ? isDark
                  ? 'bg-emerald-950/20 border-emerald-800/40'
                  : 'bg-emerald-50/50 border-emerald-200/60'
                : deadlineInfo.isOverdue
                ? isDark
                  ? 'bg-rose-950/30 border-rose-800/50'
                  : 'bg-rose-50/60 border-rose-200/80'
                : isDark
                ? 'bg-slate-800/40 border-slate-700/80'
                : 'bg-slate-50/80 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Deadline
                </span>
              </div>
              {deadlineInfo.relative && (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : deadlineInfo.isOverdue
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {deadlineInfo.relative}
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              {deadlineInfo.display}
            </p>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Description
              </h3>
            </div>
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                isDark
                  ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {task.description ? (
                task.description
              ) : (
                <span className="text-slate-400 italic">No description provided for this task.</span>
              )}
            </div>
          </div>

          {/* Detailed Metadata Grid */}
          <div
            className={`p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                Created At
              </span>
              <span className="font-medium">{formatDateTime(task.createdAt)}</span>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                Last Updated
              </span>
              <span className="font-medium">{formatDateTime(task.updatedAt)}</span>
            </div>

            {task.userName && (
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                  Created By
                </span>
                <span className="font-medium">{task.userName}</span>
              </div>
            )}

            <div>
              <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                Task Reference ID
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                <span className="truncate max-w-[130px]">{task.id}</span>
                <button
                  onClick={() => handleCopy(task.id, 'id')}
                  className="hover:text-slate-200 p-0.5 cursor-pointer"
                  title="Copy Task ID"
                >
                  {copiedField === 'id' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`p-4 sm:px-6 border-t flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'border-slate-800 bg-slate-850/80' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          {/* Toggle status button */}
          <button
            id={`view-modal-toggle-status-${task.id}`}
            onClick={() => {
              onToggleStatus(task.id);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              isCompleted
                ? isDark
                  ? 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                : isDark
                ? 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isCompleted ? (
              <>
                <Circle className="w-3.5 h-3.5" />
                <span>Mark as Pending</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Completed</span>
              </>
            )}
          </button>

          {/* Right Action buttons: Edit, Delete, Close */}
          <div className="flex items-center gap-2">
            <button
              id={`view-modal-delete-btn-${task.id}`}
              onClick={() => {
                onClose();
                onDelete(task);
              }}
              className="p-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              id={`view-modal-edit-btn-${task.id}`}
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 border ${
                isDark
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-200'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Edit Details</span>
            </button>

            <button
              id="view-modal-close-btn"
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
