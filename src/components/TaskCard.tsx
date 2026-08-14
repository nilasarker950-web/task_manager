import React from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
}) => {
  const isCompleted = task.status === 'Completed';

  // Format deadline date and calculate relative timing
  const formatDeadline = (deadlineStr: string) => {
    try {
      const date = new Date(deadlineStr);
      if (isNaN(date.getTime())) return { display: deadlineStr, relative: '', isOverdue: false };

      const now = new Date();
      const diffMs = date.getTime() - now.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));

      const isOverdue = diffMs < 0 && !isCompleted;

      let relative = '';
      if (isCompleted) {
        relative = 'Completed';
      } else if (isOverdue) {
        if (Math.abs(diffDays) === 0) relative = 'Overdue by hours';
        else if (Math.abs(diffDays) === 1) relative = 'Overdue by 1 day';
        else relative = `Overdue by ${Math.abs(diffDays)} days`;
      } else if (diffDays === 0) {
        relative = diffHours <= 1 ? 'Due very soon' : `Due today (${diffHours}h remaining)`;
      } else if (diffDays === 1) {
        relative = 'Due tomorrow';
      } else if (diffDays > 1) {
        relative = `Due in ${diffDays} days`;
      }

      const formatted = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return { display: formatted, relative, isOverdue };
    } catch {
      return { display: deadlineStr, relative: '', isOverdue: false };
    }
  };

  const deadlineInfo = formatDeadline(task.deadline);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className={`group relative rounded-xl border p-4 sm:p-5 transition-all ${
        isCompleted
          ? 'bg-slate-50/70 border-slate-200/80'
          : deadlineInfo.isOverdue
          ? 'bg-white border-rose-200 shadow-2xs hover:border-rose-300 hover:shadow-xs'
          : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3.5">
        {/* Left Side: Status Checkbox & Content */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Quick Status Toggle Button */}
          <button
            id={`toggle-status-${task.id}`}
            onClick={() => onToggleStatus(task.id)}
            className={`mt-0.5 shrink-0 rounded-lg p-1.5 transition-all cursor-pointer ${
              isCompleted
                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 ring-1 ring-emerald-200/60'
                : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50/60'
            }`}
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          {/* Task Core Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3
                id={`task-title-${task.id}`}
                className={`text-sm sm:text-base font-semibold tracking-tight truncate ${
                  isCompleted ? 'line-through text-slate-400 font-medium' : 'text-slate-900'
                }`}
              >
                {task.taskName}
              </h3>

              {/* Status Badge */}
              <span
                id={`task-status-badge-${task.id}`}
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {task.status}
              </span>

              {/* Overdue Badge if applicable */}
              {deadlineInfo.isOverdue && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                  <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>{deadlineInfo.relative}</span>
                </span>
              )}
            </div>

            {/* Description */}
            {task.description ? (
              <p
                id={`task-desc-${task.id}`}
                className={`text-xs sm:text-sm mb-3.5 whitespace-pre-wrap leading-relaxed ${
                  isCompleted ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {task.description}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic mb-3.5">
                No description provided.
              </p>
            )}

            {/* Deadline & Metadata Footer */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-2.5 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 text-[11px] font-medium">Deadline:</span>
                <span className={`text-[11px] ${deadlineInfo.isOverdue ? 'font-semibold text-rose-600' : 'font-medium text-slate-700'}`}>
                  {deadlineInfo.display}
                </span>
              </div>

              {!isCompleted && !deadlineInfo.isOverdue && deadlineInfo.relative && (
                <div className="flex items-center gap-1 text-indigo-700 font-medium bg-indigo-50/80 px-2 py-0.5 rounded text-[11px] border border-indigo-100/60">
                  <Clock className="w-3 h-3 text-indigo-500" />
                  <span>{deadlineInfo.relative}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Actions (Edit / Delete) */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            id={`edit-task-btn-${task.id}`}
            onClick={() => onEditTask(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            id={`delete-task-btn-${task.id}`}
            onClick={() => onDeleteTask(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
