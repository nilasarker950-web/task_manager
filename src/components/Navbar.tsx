import React from 'react';
import { Plus, ChevronDown, Menu } from 'lucide-react';
import { UserProfile } from '../types';
import { BrandLogo } from './BrandLogo';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenUserModal: () => void;
  onOpenNewTaskModal: () => void;
  onOpenThemeModal?: () => void;
  onToggleSidebar?: () => void;
  isOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenUserModal,
  onOpenNewTaskModal,
  onToggleSidebar,
}) => {
  const { isDark } = useTheme();

  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-200 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
          : 'bg-white/90 border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className={`p-2 rounded-xl border lg:hidden transition-colors cursor-pointer ${
                isDark
                  ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <BrandLogo size="md" badgeText="WORKSPACE" />
        </div>

        {/* Right Side: Dedicated Profile & Primary Action */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dedicated User Profile Button */}
          <button
            id="user-profile-btn"
            onClick={onOpenUserModal}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-xl border transition-all duration-150 cursor-pointer text-xs font-semibold shadow-2xs hover:-translate-y-0.5 hover:shadow-xs active:scale-95 group ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
            title="Dedicated Profile & Account Settings"
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600"
              />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold bg-indigo-600 shadow-2xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
              </div>
            )}
            <div className="text-left max-w-[120px]">
              <p className="text-xs font-semibold truncate leading-tight">
                {currentUser?.name || 'Guest User'}
              </p>
              <p className="text-[10px] text-slate-400 font-normal truncate">
                {currentUser?.isAnonymous ? 'Guest Mode' : 'Verified'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform group-hover:translate-y-0.5" />
          </button>

          {/* New Task Primary Button */}
          <button
            id="add-new-task-btn"
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer group"
          >
            <Plus className="w-4 h-4 shrink-0 group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-semibold">New Task</span>
            <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.2 bg-indigo-700/80 text-[9px] font-mono rounded text-indigo-100">
              N
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
