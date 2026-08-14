import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Task } from '../types';

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
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3.5 border border-rose-100 shadow-2xs">
            <Trash2 className="w-5 h-5" />
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1">Delete Task?</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Are you sure you want to permanently remove <span className="font-semibold text-slate-800">"{task.taskName}"</span> from Cloud Firestore?
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="cancel-delete-task-btn"
              type="button"
              onClick={onClose}
              className="py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-delete-task-btn"
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="py-2.5 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
