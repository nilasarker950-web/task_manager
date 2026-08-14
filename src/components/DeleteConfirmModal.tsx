import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Task } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  task: Task | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  task,
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm rounded-2xl shadow-2xl border p-6 text-center animate-in zoom-in-95 duration-150 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold mb-1">Delete Task?</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
          Are you sure you want to permanently remove <span className="font-semibold text-slate-800 dark:text-slate-200">"{task.taskName}"</span> from your workspace? This action cannot be undone.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="cancel-delete-btn"
            onClick={onClose}
            className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            onClick={onConfirm}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-xs hover:shadow-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};
