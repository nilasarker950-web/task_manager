import React from 'react';
import { Cloud, Plus, Flame, Shield, ChevronDown, Wifi, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenUserModal: () => void;
  onOpenNewTaskModal: () => void;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenUserModal,
  onOpenNewTaskModal,
  isOnline,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-1 ring-indigo-500/20">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
                Cloud Task Manager
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                <span>Firestore</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 ring-2 ring-emerald-100 animate-pulse' : 'bg-slate-400'}`}></span>
                <span>{isOnline ? 'Real-Time Sync Active' : 'Offline Mode'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* User Profile / Auth Toggle Button */}
          <button
            id="user-profile-btn"
            onClick={onOpenUserModal}
            className="flex items-center gap-2.5 py-1.5 px-2.5 sm:px-3 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/80 transition-all text-slate-700 text-xs font-semibold shadow-2xs group cursor-pointer"
            title="Firebase Account & Cloud Sync Settings"
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold bg-indigo-600 shadow-2xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
              </div>
            )}
            <div className="text-left hidden md:block max-w-[130px]">
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                {currentUser?.name || 'Guest Student'}
              </p>
              <p className="text-[10px] text-slate-400 font-normal truncate">
                {currentUser?.isAnonymous ? 'Guest Mode' : 'Google Auth'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-y-0.5" />
          </button>

          {/* New Task CTA */}
          <button
            id="add-new-task-btn"
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-xs transition-all hover:shadow hover:shadow-indigo-100 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="font-semibold">New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
