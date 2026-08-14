import React from 'react';
import { UserProfile } from '../types';
import { BrandLogo } from './BrandLogo';
import { useTheme } from '../context/ThemeContext';
import { Plus } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenUserModal: () => void;
  onOpenNewTaskModal?: () => void;
  onOpenThemeModal?: () => void;
  onToggleSidebar?: () => void;
  isOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenUserModal,
  onOpenNewTaskModal,
}) => {
  const { isDark } = useTheme();

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-200 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
          : 'bg-white/90 border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Project Logo and Title */}
        <div className="flex items-center">
          <BrandLogo size="md" />
        </div>

        {/* Right Side: New Task Button + Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* New Task Button (Desktop Only) */}
          {onOpenNewTaskModal && (
            <button
              onClick={onOpenNewTaskModal}
              className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-150 cursor-pointer active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 ${
                isDark
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              }`}
              title="Create new task (N)"
              aria-label="Create new task"
            >
              <Plus size={18} className="flex-shrink-0" />
              <span>New Task</span>
            </button>
          )}

          {/* Profile Avatar */}
          <button
            id="user-profile-avatar-btn"
            onClick={onOpenUserModal}
            className={`p-1 rounded-full transition-all duration-150 cursor-pointer active:scale-90 group focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 ${
              isDark
                ? 'hover:bg-slate-800'
                : 'hover:bg-slate-100'
            }`}
            title={currentUser?.name ? `${currentUser.name} - Profile & Settings` : 'User Profile'}
            aria-label="User Profile & Settings"
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name || 'User avatar'}
                referrerPolicy="no-referrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition-all shadow-xs"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-indigo-600 to-violet-600 ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition-all shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

