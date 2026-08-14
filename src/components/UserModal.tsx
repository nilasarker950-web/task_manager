import React, { useState, useEffect, useRef } from 'react';
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
  Camera,
  Upload,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  RefreshCw,
  KeyRound,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { useTheme, THEMES } from '../context/ThemeContext';
import { BackgroundVariant } from '../types';
import { AnimatePresence, motion } from 'motion/react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskCount?: { total: number; completed: number; pending: number };
}

type ModalTab = 'profile' | 'password' | 'stats' | 'appearance';

// Predefined stylish avatar presets
const PRESET_AVATARS = [
  { id: 'av1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=b6e3f4', label: 'Robo Alpha' },
  { id: 'av2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aneka&backgroundColor=c0aede', label: 'Robo Violet' },
  { id: 'av3', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Trouble&backgroundColor=d1d4f9', label: 'Robo Slate' },
  { id: 'av4', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Precious&backgroundColor=ffd5dc', label: 'Robo Coral' },
  { id: 'av5', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Shadow&backgroundColor=ffdfbf', label: 'Robo Amber' },
  { id: 'av6', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gizmo&backgroundColor=c1f4c5', label: 'Robo Mint' },
];

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  taskCount = { total: 0, completed: 0, pending: 0 },
}) => {
  const { isDark, theme, setTheme } = useTheme();
  const {
    currentUser,
    firebaseUser,
    signInWithGoogle,
    updateUserProfile,
    changePassword,
    logout,
    authError,
    clearAuthError,
  } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<ModalTab>('profile');
  const [loadingAction, setLoadingAction] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditAvatarUrl(currentUser.avatarUrl || '');
    }
    setSaveSuccess(null);
    setPasswordSuccess(false);
    setPasswordError(null);
    clearAuthError();
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  // Is authenticated via Google SSO
  const isGoogleUser = firebaseUser?.providerData.some((p) => p.providerId === 'google.com');

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setLoadingAction(true);
    setSaveSuccess(null);
    clearAuthError();

    try {
      await updateUserProfile({
        name: editName.trim(),
        avatarUrl: editAvatarUrl || undefined,
      });
      setSaveSuccess('Profile information updated successfully!');
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch {
      // Error handled in authError
    } finally {
      setLoadingAction(false);
    }
  };

  // Handle Image File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (under 2MB for fast local rendering)
    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setEditAvatarUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    clearAuthError();

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please verify.');
      return;
    }

    setLoadingAction(true);
    try {
      await changePassword(newPassword);
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCopyUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleLogout = async () => {
    setLoadingAction(true);
    try {
      await logout();
      onClose();
    } finally {
      setLoadingAction(false);
    }
  };

  const completionRate =
    taskCount.total > 0
      ? Math.round((taskCount.completed / taskCount.total) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-850/80' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showLabel={false} />
            <div>
              <h2 className="text-sm font-bold leading-tight">Account & Profile Settings</h2>
              <p className="text-[11px] text-slate-400">Manage identity, security credentials & visual theme</p>
            </div>
          </div>
          <button
            id="close-user-modal-btn"
            onClick={() => {
              clearAuthError();
              onClose();
            }}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`flex border-b px-4 sm:px-6 pt-2 text-xs font-semibold gap-1 sm:gap-2 overflow-x-auto ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/50'
          }`}
        >
          <button
            id="tab-profile-edit"
            onClick={() => {
              setActiveTab('profile');
              setSaveSuccess(null);
            }}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Edit Profile & Avatar</span>
          </button>

          <button
            id="tab-password-change"
            onClick={() => {
              setActiveTab('password');
              setPasswordError(null);
              setPasswordSuccess(false);
            }}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'password'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Security & Password</span>
          </button>

          <button
            id="tab-productivity-stats"
            onClick={() => setActiveTab('stats')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Productivity</span>
          </button>

          <button
            id="tab-theme-appearance"
            onClick={() => setActiveTab('appearance')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Themes</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* TAB 1: Edit Profile & Avatar */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {saveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {/* Avatar Section */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border ${
                  isDark ? 'bg-slate-800/40 border-slate-700/80' : 'bg-slate-50/80 border-slate-200/90'
                }`}
              >
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Profile Picture & Avatar
                </label>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Current Avatar Preview */}
                  <div className="relative group shrink-0">
                    {editAvatarUrl ? (
                      <img
                        src={editAvatarUrl}
                        alt="Avatar Preview"
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-2xl shadow-md">
                        {editName ? editName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                    >
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span>Change</span>
                    </button>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Avatar Options */}
                  <div className="flex-1 space-y-3 w-full">
                    {/* Action Buttons: Upload & Custom URL */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Upload Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Use Image URL</span>
                      </button>

                      {editAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setEditAvatarUrl('')}
                          className="px-2.5 py-1.5 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10 font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Custom URL Input Accordion */}
                    {showUrlInput && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="url"
                          placeholder="Paste image link (https://...)"
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          className={`flex-1 px-3 py-1.5 text-xs rounded-xl border outline-none ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white'
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customUrlInput.trim()) {
                              setEditAvatarUrl(customUrlInput.trim());
                              setCustomUrlInput('');
                              setShowUrlInput(false);
                            }
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    )}

                    {/* Preset Avatars Palette */}
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">
                        Or pick a fun preset avatar:
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {PRESET_AVATARS.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setEditAvatarUrl(av.url)}
                            title={av.label}
                            className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                              editAvatarUrl === av.url
                                ? 'border-indigo-600 scale-110 ring-2 ring-indigo-500/30'
                                : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                            }`}
                          >
                            <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Email Fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your full name"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                        isDark
                          ? 'bg-slate-950/70 border-slate-800 focus:border-indigo-500 text-white'
                          : 'bg-white border-slate-200 focus:border-indigo-500 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <span className="truncate">{currentUser?.email || 'guest-session@taskpulse.local'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">
                      {currentUser?.isAnonymous ? 'Guest ID' : 'Verified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-150 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loadingAction ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Security & Password */}
          {activeTab === 'password' && (
            <div className="space-y-4">
              {isGoogleUser ? (
                <div
                  className={`p-5 rounded-2xl border text-center space-y-3 ${
                    isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold">Google Single Sign-On Managed</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Your account is securely authenticated through Google SSO. Password changes and multi-factor authentication are managed directly within your Google Account settings.
                  </p>
                </div>
              ) : currentUser?.isAnonymous ? (
                <div
                  className={`p-5 rounded-2xl border text-center space-y-3 ${
                    isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold">Guest Session</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    You are currently using an instant guest session. Upgrade to a registered Google or Email account to set passwords and sync tasks across devices.
                  </p>
                  <button
                    onClick={signInWithGoogle}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <span>Connect Google Account</span>
                  </button>
                </div>
              ) : (
                /* Email-Password User Password Update Form */
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold">Change Your Password</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ensure your new password contains at least 6 characters for maximum security.
                    </p>
                  </div>

                  {passwordSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Your password has been changed successfully!</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                            isDark
                              ? 'bg-slate-950/70 border-slate-800 focus:border-indigo-500 text-white'
                              : 'bg-white border-slate-200 focus:border-indigo-500 text-slate-900'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                            isDark
                              ? 'bg-slate-950/70 border-slate-800 focus:border-indigo-500 text-white'
                              : 'bg-white border-slate-200 focus:border-indigo-500 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={loadingAction}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-150 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loadingAction ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Productivity & Workspace Activity */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div
                className={`p-4.5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-800/40 border-slate-700/70' : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <span>Workspace Sprint Velocity</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {completionRate}% Complete
                  </span>
                </div>

                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] text-slate-400 font-medium block">Total Tasks</span>
                    <span className="text-base font-bold">{taskCount.total}</span>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] text-amber-500 font-medium block">Pending</span>
                    <span className="text-base font-bold text-amber-500">{taskCount.pending}</span>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] text-emerald-500 font-medium block">Completed</span>
                    <span className="text-base font-bold text-emerald-500">{taskCount.completed}</span>
                  </div>
                </div>
              </div>

              {/* User Identifier Card */}
              {currentUser && (
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="text-xs">
                    <p className="font-bold">Unique User ID (UID)</p>
                    <p className="text-[11px] font-mono text-slate-400 truncate max-w-[240px] sm:max-w-xs">{currentUser.id}</p>
                  </div>
                  <button
                    onClick={() => handleCopyUid(currentUser.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  >
                    {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUid ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Themes & Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">
                Choose a workspace visual theme and background atmosphere:
              </p>

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
                        <div className={`w-8 h-8 rounded-lg border ${t.previewBorder} ${t.previewBg} flex items-center justify-center`}>
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

          {/* Bottom Sign Out Bar */}
          <div
            className={`pt-4 border-t flex items-center justify-between ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <span className="text-xs text-slate-400">
              {currentUser?.isAnonymous ? 'Guest Mode Active' : 'Authenticated Session'}
            </span>
            <button
              id="modal-logout-action-btn"
              type="button"
              onClick={handleLogout}
              disabled={loadingAction}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
