import React from 'react';
import { Menu, Plus, ChevronDown, Wifi, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenUserModal: () => void;
  onOpenNewTaskModal: () => void;
  onToggleSidebar: () => void;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenUserModal,
  onOpenNewTaskModal,
  onToggleSidebar,
  isOnline,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            id="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="p-2 -ml-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <BrandLogo size="md" badgeText="WORKSPACE" />
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Live Sync Status Pill */}
          <div
            id="system-status-indicator"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600"
            title="Real-time reactive state synchronization"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500 ring-2 ring-emerald-100 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="font-semibold text-slate-700">
              {isOnline ? 'Cloud Synced' : 'Offline'}
            </span>
          </div>

          {/* User Profile / Auth Toggle Button */}
          <button
            id="user-profile-btn"
            onClick={onOpenUserModal}
            className="flex items-center gap-2.5 py-1 px-2 sm:px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 transition-all text-slate-700 text-xs font-semibold shadow-2xs group cursor-pointer"
            title="Account & Security Settings"
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold bg-indigo-600 shadow-2xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
              </div>
            )}
            <div className="text-left hidden md:block max-w-[120px]">
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                {currentUser?.name || 'Guest User'}
              </p>
              <p className="text-[10px] text-slate-400 font-normal truncate">
                {currentUser?.isAnonymous ? 'Guest Mode' : 'Verified'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-y-0.5" />
          </button>

          {/* New Task Primary Button */}
          <button
            id="add-new-task-btn"
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-xs hover:shadow transition-all cursor-pointer group"
          >
            <Plus className="w-4 h-4 shrink-0 group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-semibold">New Task</span>
            <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.2 bg-indigo-700 text-[9px] font-mono rounded text-indigo-100">
              N
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
