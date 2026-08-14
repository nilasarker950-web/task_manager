import React, { useState } from 'react';
import {
  X,
  LogOut,
  User,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Palette,
  ShieldCheck,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { useTheme, THEMES } from '../context/ThemeContext';
import { BackgroundVariant } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskCount?: { total: number; completed: number; pending: number };
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  taskCount = { total: 0, completed: 0, pending: 0 },
}) => {
  const { isDark, theme, setTheme } = useTheme();
  const {
    currentUser,
    signInWithGoogle,
    signInAsGuest,
    logout,
    authError,
    clearAuthError,
  } = useAuth();

  const [loadingAction, setLoadingAction] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance'>('profile');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoadingAction(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch {
      // Handled in context
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoadingAction(true);
    try {
      await signInAsGuest();
      onClose();
    } catch {
      // Handled in context
    } finally {
      setLoadingAction(false);
    }
  };

  const handleLogout = async () => {
    setLoadingAction(true);
    try {
      await logout();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCopyUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const completionRate =
    taskCount.total > 0
      ? Math.round((taskCount.completed / taskCount.total) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Dedicated Profile Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-800/40' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showLabel={false} />
            <div>
              <h2 className="text-sm font-bold leading-tight">Dedicated Profile & Workspace</h2>
              <p className="text-[11px] text-slate-400">Account identity, productivity stats & preferences</p>
            </div>
          </div>
          <button
            id="close-user-modal-btn"
            onClick={() => {
              clearAuthError();
              onClose();
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div
          className={`flex border-b px-6 pt-2 text-xs font-semibold ${
            isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/40'
          }`}
        >
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Account</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`pb-2.5 px-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'appearance'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Appearance</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <>
              {currentUser ? (
                <div className="space-y-4">
                  {/* Identity Card */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border ${
                      isDark
                        ? 'bg-slate-800/50 border-slate-700/80'
                        : 'bg-slate-50/80 border-slate-200/90'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-2xl ring-2 ring-indigo-500/30 shadow-xs object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-bold flex items-center justify-center text-xl shadow-xs">
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold truncate">
                            {currentUser.name}
                          </h3>
                          <span
                            className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1 ${
                              currentUser.isAnonymous
                                ? isDark
                                  ? 'bg-slate-700 text-slate-300'
                                  : 'bg-slate-200 text-slate-700'
                                : isDark
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span>{currentUser.isAnonymous ? 'Guest Mode' : 'Verified Google'}</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 truncate mt-1">
                          {currentUser.email || 'guest-session@taskpulse.app'}
                        </p>

                        {/* UID & Quick Copy */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-900/60 px-2 py-0.5 rounded border border-slate-300/40 dark:border-slate-700/50">
                            UID: {currentUser.id.slice(0, 10)}...
                          </span>
                          <button
                            onClick={() => handleCopyUid(currentUser.id)}
                            className="text-[10px] text-indigo-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer font-medium"
                            title="Copy Unique Identifier"
                          >
                            {copiedUid ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy ID</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Upgrade to Google Account Banner for Guests */}
                    {currentUser.isAnonymous && (
                      <div
                        className={`mt-4 p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          isDark
                            ? 'bg-indigo-950/40 border-indigo-800/80 text-indigo-200'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                        }`}
                      >
                        <div className="text-xs">
                          <p className="font-semibold">Upgrade to Google Account</p>
                          <p className="text-[11px] opacity-80">
                            Sync your tasks across all devices seamlessly.
                          </p>
                        </div>
                        <button
                          onClick={handleGoogleSignIn}
                          disabled={loadingAction}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-transform active:scale-95"
                        >
                          <span>Connect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dedicated Workspace Productivity Card */}
                  <div
                    className={`p-4 rounded-2xl border space-y-3 ${
                      isDark
                        ? 'bg-slate-800/40 border-slate-700/70'
                        : 'bg-white border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Activity className="w-4 h-4 text-indigo-500" />
                        <span>Workspace Activity & Velocity</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {completionRate}% Complete
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div
                      className={`w-full h-2 rounded-full overflow-hidden ${
                        isDark ? 'bg-slate-700' : 'bg-slate-100'
                      }`}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>

                    {/* Statistics Tiles */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div
                        className={`p-2.5 rounded-xl border text-center ${
                          isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/60'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 font-medium block">Total Tasks</span>
                        <span className="text-base font-bold">{taskCount.total}</span>
                      </div>
                      <div
                        className={`p-2.5 rounded-xl border text-center ${
                          isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/60'
                        }`}
                      >
                        <span className="text-[10px] text-amber-500 font-medium block">Pending</span>
                        <span className="text-base font-bold text-amber-500">{taskCount.pending}</span>
                      </div>
                      <div
                        className={`p-2.5 rounded-xl border text-center ${
                          isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/60'
                        }`}
                      >
                        <span className="text-[10px] text-emerald-500 font-medium block">Completed</span>
                        <span className="text-base font-bold text-emerald-500">{taskCount.completed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sign Out Action */}
                  <div
                    className={`pt-3 border-t flex items-center justify-between ${
                      isDark ? 'border-slate-800' : 'border-slate-200/80'
                    }`}
                  >
                    <span className="text-xs text-slate-400">
                      Session Active
                    </span>
                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      disabled={loadingAction}
                      className="px-3.5 py-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Unauthenticated View */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-800 shadow-2xs">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Sign in to TaskPulse</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                      Connect your account to sync tasks seamlessly across devices with real-time cloud persistence.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 max-w-xs mx-auto">
                    <button
                      id="google-sign-in-btn"
                      onClick={handleGoogleSignIn}
                      disabled={loadingAction}
                      className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#ffffff"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#ffffff"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#ffffff"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#ffffff"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </button>

                    <p className="text-[11px] text-slate-400">
                      Sign in directly with your Google account to sync all tasks in real-time.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Choose a workspace visual theme and background atmosphere:
              </div>

              <div className="space-y-2.5">
                {THEMES.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as BackgroundVariant)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500'
                            : 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500'
                          : isDark
                          ? 'border-slate-700 bg-slate-800/40 hover:bg-slate-800'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg border ${t.previewBorder} ${t.previewBg} flex items-center justify-center`}
                        >
                          <div className={`w-3 h-3 rounded-full ${t.previewAccent}`} />
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                            <span>{t.name}</span>
                            {t.isDark && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-mono">
                                Dark
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{t.description}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
