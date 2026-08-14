import React, { useState } from 'react';
import { X, LogIn, LogOut, Flame, ShieldCheck, User, Sparkles, AlertCircle, Database, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    firebaseUser,
    signInWithGoogle,
    signInAsGuest,
    logout,
    authError,
    clearAuthError,
  } = useAuth();

  const [loadingAction, setLoadingAction] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200/50">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Firebase Cloud Account</h2>
              <p className="text-[11px] text-slate-500">Authentication & Cloud Firestore Sync</p>
            </div>
          </div>
          <button
            id="close-user-modal-btn"
            onClick={() => {
              clearAuthError();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4.5">
          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Current User Card */}
          {currentUser ? (
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
              <div className="flex items-center gap-3.5 mb-3.5">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full ring-2 ring-slate-200/80 shadow-2xs object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-2xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {currentUser.name}
                    </h3>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full font-mono ${
                        currentUser.isAnonymous
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {currentUser.isAnonymous ? 'Guest' : 'Verified'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{currentUser.email}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                    UID: {currentUser.id}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ABAC Security Rules Enforced</span>
                </span>
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  disabled={loadingAction}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2.5 border border-indigo-100">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Sign in to sync your tasks</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Your tasks will be persistently stored and synchronized with Firestore across all devices.
              </p>
            </div>
          )}

          {/* Sign In Actions */}
          <div className="space-y-2">
            <button
              id="google-sign-in-btn"
              onClick={handleGoogleSignIn}
              disabled={loadingAction}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              id="guest-sign-in-btn"
              onClick={handleGuestSignIn}
              disabled={loadingAction}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-dashed border-slate-300 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Use Instant Guest Mode</span>
            </button>
          </div>

          {/* Infrastructure Specs Card */}
          <div className="rounded-xl p-3 bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cloud Firestore Database Architecture</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono pt-1">
              <div>
                <span className="text-slate-400 block font-sans text-[9px] uppercase font-bold">Region</span>
                <span>asia-southeast1</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[9px] uppercase font-bold">Target Path</span>
                <span>/tasks/{'{taskId}'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
