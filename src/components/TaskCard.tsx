import React from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Edit2, Trash2, AlertCircle, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Task } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TaskCardProps {
  task: Task;
  index?: number;
  onToggleStatus: (taskId: string) => void;
  onViewTask?: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index = 0,
  onToggleStatus,
  onViewTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { isDark } = useTheme();
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
      initial={{ opacity: 0, y: 16, x: -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{
        opacity: 0,
        x: -28,
        scale: 0.97,
        transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] },
      }}
      transition={{
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
        layout: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
        delay: Math.min(index * 0.035, 0.2),
      }}
      className={`group relative rounded-2xl border p-4 sm:p-5 transition-shadow transition-colors duration-200 hover:-translate-y-1 hover:shadow-lg ${
        isCompleted
          ? isDark
            ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:shadow-slate-950/40'
            : 'bg-slate-50/70 border-slate-200/70 hover:border-slate-300 hover:shadow-slate-200/40'
          : deadlineInfo.isOverdue
          ? isDark
            ? 'bg-slate-900/90 border-rose-900/60 hover:border-rose-700/80 hover:shadow-rose-950/20'
            : 'bg-white border-rose-200/90 hover:border-rose-300 hover:shadow-rose-100/50'
          : isDark
          ? 'bg-slate-800/90 border-slate-700/80 hover:border-indigo-500/50 hover:shadow-indigo-950/20'
          : 'bg-white border-slate-200/90 hover:border-indigo-200 hover:shadow-indigo-100/30'
      }`}
    >
      <div className="flex items-start justify-between gap-3.5">
        {/* Left Side: Status Checkbox & Content */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Status Toggle Button with Hover Spring Effect */}
          <button
            id={`toggle-status-${task.id}`}
            onClick={() => onToggleStatus(task.id)}
            className={`mt-0.5 shrink-0 rounded-xl p-1.5 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isCompleted
                ? isDark
                  ? 'text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 ring-1 ring-emerald-800'
                  : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 ring-1 ring-emerald-200/60'
                : isDark
                ? 'text-slate-500 hover:text-indigo-400 hover:bg-indigo-950/60'
                : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50/60'
            }`}
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 transition-transform duration-200" />
            ) : (
              <Circle className="w-5 h-5 transition-transform duration-200" />
            )}
          </button>

          {/* Task Core Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3
                id={`task-title-${task.id}`}
                onClick={() => onViewTask && onViewTask(task)}
                className={`text-sm sm:text-base font-bold tracking-tight truncate transition-colors duration-150 cursor-pointer ${
                  isCompleted
                    ? 'line-through text-slate-400 dark:text-slate-500 font-medium'
                    : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                title="Click to view task details"
              >
                {task.taskName}
              </h3>

              {/* Status Badge */}
              <span
                id={`task-status-badge-${task.id}`}
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono transition-transform group-hover:scale-105 duration-150 ${
                  isCompleted
                    ? isDark
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : isDark
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {task.status}
              </span>

              {/* Overdue Badge if applicable */}
              {deadlineInfo.isOverdue && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono ${
                    isDark
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <AlertCircle className="w-3 h-3 text-rose-500 shrink-0 animate-pulse" />
                  <span>{deadlineInfo.relative}</span>
                </span>
              )}
            </div>

            {/* Description */}
            {task.description ? (
              <p
                id={`task-desc-${task.id}`}
                onClick={() => onViewTask && onViewTask(task)}
                className={`text-xs sm:text-sm mb-3.5 whitespace-pre-wrap leading-relaxed line-clamp-2 transition-colors cursor-pointer ${
                  isCompleted
                    ? 'text-slate-400 dark:text-slate-500'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                title="Click to view full description"
              >
                {task.description}
              </p>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic mb-3.5">
                No description provided.
              </p>
            )}

            {/* Deadline & Metadata Footer */}
            <div
              className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs pt-2.5 border-t ${
                isDark ? 'border-slate-700/60 text-slate-400' : 'border-slate-100 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-medium opacity-80">Deadline:</span>
                <span
                  className={`text-[11px] ${
                    deadlineInfo.isOverdue
                      ? 'font-semibold text-rose-600 dark:text-rose-400'
                      : 'font-medium text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {deadlineInfo.display}
                </span>
              </div>

              {!isCompleted && !deadlineInfo.isOverdue && deadlineInfo.relative && (
                <div
                  className={`flex items-center gap-1 font-medium px-2 py-0.5 rounded text-[11px] border transition-transform duration-150 group-hover:scale-105 ${
                    isDark
                      ? 'text-indigo-300 bg-indigo-950/60 border-indigo-800/80'
                      : 'text-indigo-700 bg-indigo-50/80 border-indigo-100/60'
                  }`}
                >
                  <Clock className="w-3 h-3 text-indigo-500" />
                  <span>{deadlineInfo.relative}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Actions (View / Edit / Delete) with Smooth Hover Animations */}
        <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          {onViewTask && (
            <button
              id={`view-task-btn-${task.id}`}
              onClick={() => onViewTask(task)}
              className={`p-2 rounded-xl transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/60'
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title="View Task Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            id={`edit-task-btn-${task.id}`}
            onClick={() => onEditTask(task)}
            className={`p-2 rounded-xl transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/60'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            id={`delete-task-btn-${task.id}`}
            onClick={() => onDeleteTask(task)}
            className={`p-2 rounded-xl transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/60'
                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
