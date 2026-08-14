import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
  Check,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

type AuthMode = 'login' | 'register';
type ColorVariant = 'indigo' | 'emerald' | 'sapphire' | 'amber';

const COLOR_VARIANTS: Record<
  ColorVariant,
  {
    name: string;
    primaryClass: string;
    primaryBg: string;
    gradient: string;
    badgeBg: string;
    orbColors: [string, string, string];
  }
> = {
  indigo: {
    name: 'Royal Indigo',
    primaryClass: 'text-indigo-600 dark:text-indigo-400',
    primaryBg: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white',
    gradient: 'from-indigo-600 to-violet-600',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    orbColors: ['rgba(99, 102, 241, 0.25)', 'rgba(168, 85, 247, 0.2)', 'rgba(59, 130, 246, 0.2)'],
  },
  emerald: {
    name: 'Oceanic Emerald',
    primaryClass: 'text-emerald-600 dark:text-emerald-400',
    primaryBg: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white',
    gradient: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    orbColors: ['rgba(16, 185, 129, 0.25)', 'rgba(20, 184, 166, 0.2)', 'rgba(56, 189, 248, 0.2)'],
  },
  sapphire: {
    name: 'Electric Sapphire',
    primaryClass: 'text-blue-600 dark:text-blue-400',
    primaryBg: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white',
    gradient: 'from-blue-600 to-cyan-600',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    orbColors: ['rgba(37, 99, 235, 0.25)', 'rgba(6, 182, 212, 0.2)', 'rgba(99, 102, 241, 0.2)'],
  },
  amber: {
    name: 'Sunset Amber',
    primaryClass: 'text-amber-600 dark:text-amber-400',
    primaryBg: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white',
    gradient: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    orbColors: ['rgba(245, 158, 11, 0.25)', 'rgba(234, 88, 12, 0.2)', 'rgba(236, 72, 153, 0.2)'],
  },
};

export const AuthPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    authError,
    clearAuthError,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedColor, setSelectedColor] = useState<ColorVariant>('indigo');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [localValidation, setLocalValidation] = useState<string | null>(null);

  const activeColor = COLOR_VARIANTS[selectedColor];

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(score, 4);
  };

  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-slate-300', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalValidation(null);
    clearAuthError();

    if (!email || !password) {
      setLocalValidation('Please fill in all required credentials.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setLocalValidation('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setLocalValidation('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalValidation('Passwords do not match. Please verify.');
        return;
      }
      if (!agreeTerms) {
        setLocalValidation('Please accept the Terms of Service to continue.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'register') {
        await signUpWithEmail(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch {
      // Handled in authError
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLocalValidation(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      // Error handled in authError
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = async () => {
    setLocalValidation(null);
    setGuestLoading(true);
    try {
      await signInAsGuest();
    } catch {
      // Error handled
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F17] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* 1. Dynamic Animated Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Dot grid texture */}
        <div
          className={`absolute inset-0 opacity-[0.03] dark:opacity-[0.06] ${
            isDark ? 'bg-[radial-gradient(#ffffff_1px,transparent_1px)]' : 'bg-[radial-gradient(#000000_1px,transparent_1px)]'
          } [background-size:24px_24px]`}
        />

        {/* Floating Glowing Ambient Orbs with smooth animations */}
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full blur-3xl"
          style={{ backgroundColor: activeColor.orbColors[0] }}
        />
        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 60, -30, 0],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ backgroundColor: activeColor.orbColors[1] }}
        />
        <motion.div
          animate={{
            x: [0, 40, -60, 0],
            y: [0, -40, 50, 0],
            scale: [1, 1.1, 1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: activeColor.orbColors[2] }}
        />
      </div>

      {/* 2. Top Header Navigation Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" showLabel={true} badgeText="ENTERPRISE" />
        </div>

        {/* Header Controls: Color Variant Picker & Dark Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Color Variants Dropdown / Chips */}
          <div
            className={`flex items-center gap-1.5 p-1 rounded-xl border backdrop-blur-md ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200 shadow-2xs'
            }`}
          >
            {(['indigo', 'emerald', 'sapphire', 'amber'] as ColorVariant[]).map((cKey) => {
              const c = COLOR_VARIANTS[cKey];
              const isSelected = selectedColor === cKey;
              return (
                <button
                  key={cKey}
                  id={`color-variant-${cKey}`}
                  onClick={() => setSelectedColor(cKey)}
                  title={c.name}
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-offset-1 scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor:
                      cKey === 'indigo'
                        ? '#4f46e5'
                        : cKey === 'emerald'
                        ? '#059669'
                        : cKey === 'sapphire'
                        ? '#2563eb'
                        : '#d97706',
                  }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <button
            id="auth-theme-toggle"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 3. Main Split-Screen Workspace Container */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 lg:py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Interactive Product Showcase & Enterprise Trust (Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold w-fit backdrop-blur-md shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={activeColor.primaryClass}>Next-Gen Task Orchestration</span>
            </div>

            <div>
              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
                Empower your sprint with{' '}
                <span className={`bg-gradient-to-r ${activeColor.gradient} bg-clip-text text-transparent`}>
                  real-time cloud synchronization
                </span>
              </h1>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                TaskPulse delivers seamless task lifecycle tracking, live deadline calculations, and persistent multi-device state management in one unified workspace.
              </p>
            </div>

            {/* Live Interactive Preview Card Mockup */}
            <div
              className={`rounded-2xl border p-5 backdrop-blur-md shadow-lg transition-all ${
                isDark
                  ? 'bg-slate-900/70 border-slate-800 shadow-slate-950/40'
                  : 'bg-white/80 border-slate-200/90 shadow-slate-200/60'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] font-mono text-slate-400">workspace.sync.live</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  99.9% Uptime
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-md bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold line-through text-slate-400">Implement real-time sync listeners</p>
                      <p className="text-[10px] text-slate-400">Completed 12m ago</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">Done</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-md border-2 border-indigo-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Review Sprint Architecture & Deploy</p>
                      <p className="text-[10px] text-amber-500 font-semibold">Due in 2 hours</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">Pending</span>
                </div>
              </div>

              {/* Live Metric Badges */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">100%</p>
                  <p className="text-[10px] text-slate-400 font-medium">Cloud Redundancy</p>
                </div>
                <div>
                  <p className="text-base font-extrabold text-emerald-500">0 ms</p>
                  <p className="text-[10px] text-slate-400 font-medium">Local State Lag</p>
                </div>
                <div>
                  <p className="text-base font-extrabold text-indigo-500">End-to-End</p>
                  <p className="text-[10px] text-slate-400 font-medium">Encrypted Vault</p>
                </div>
              </div>
            </div>

            {/* Quick Guest Explorer Notice */}
            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Want to test immediately? Try <strong>Instant Guest Mode</strong> on the right to start creating tasks without an account.
              </span>
            </div>
          </div>

          {/* Right Column: Dedicated High-End Authentication Card */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-md">
              <div
                className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-900/85 border-slate-800/90 shadow-slate-950/70'
                    : 'bg-white/95 border-slate-200/90 shadow-slate-200/70'
                }`}
              >
                {/* 4. Dedicated Mode Toggle (Sign In vs Register) */}
                <div
                  className={`grid grid-cols-2 p-1.5 rounded-2xl mb-6 border ${
                    isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100/90 border-slate-200/80'
                  }`}
                >
                  <button
                    id="auth-mode-login-btn"
                    type="button"
                    onClick={() => {
                      clearAuthError();
                      setLocalValidation(null);
                      setMode('login');
                    }}
                    className={`py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      mode === 'login'
                        ? isDark
                          ? 'bg-slate-800 text-white shadow-md'
                          : 'bg-white text-slate-900 shadow-md'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Sign In</span>
                  </button>

                  <button
                    id="auth-mode-register-btn"
                    type="button"
                    onClick={() => {
                      clearAuthError();
                      setLocalValidation(null);
                      setMode('register');
                    }}
                    className={`py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      mode === 'register'
                        ? isDark
                          ? 'bg-slate-800 text-white shadow-md'
                          : 'bg-white text-slate-900 shadow-md'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Create Account</span>
                  </button>
                </div>

                {/* Form Heading */}
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold tracking-tight">
                    {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {mode === 'login'
                      ? 'Sign in to access your persistent tasks and workspace.'
                      : 'Join TaskPulse to synchronize your workflow seamlessly.'}
                  </p>
                </div>

                {/* Alerts (Error or Local Validation) */}
                <AnimatePresence>
                  {(authError || localValidation) && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="flex-1 leading-snug">{localValidation || authError}</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Google 1-Click Sign-In */}
                <button
                  id="auth-google-action-btn"
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading || guestLoading}
                  className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border text-xs font-bold shadow-2xs transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:opacity-50 cursor-pointer ${
                    isDark
                      ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-white'
                      : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
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

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                    <span className={`px-3 ${isDark ? 'bg-[#0B0F17] text-slate-500' : 'bg-[#F8FAFC] text-slate-400'}`}>
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Name field (Only in Register mode) */}
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          id="auth-name-input"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                            isDark
                              ? 'bg-slate-950/70 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600'
                              : 'bg-white border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400'
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email field */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        id="auth-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                          isDark
                            ? 'bg-slate-950/70 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600'
                            : 'bg-white border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Password
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setLocalValidation('For security, use Google sign-in if you forgot your password.')}
                          className="text-[11px] font-medium text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        id="auth-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                          isDark
                            ? 'bg-slate-950/70 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600'
                            : 'bg-white border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password strength meter (in Register mode) */}
                    {mode === 'register' && password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`flex-1 rounded-full transition-all duration-300 ${
                                strengthScore >= step ? strengthColors[strengthScore] : 'bg-slate-200 dark:bg-slate-800'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-right font-medium text-slate-400">
                          Security: {strengthLabels[strengthScore]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password (Only in Register mode) */}
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          id="auth-confirm-password-input"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                            isDark
                              ? 'bg-slate-950/70 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600'
                              : 'bg-white border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400'
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Checkboxes */}
                  <div className="pt-1 flex items-center justify-between text-xs">
                    {mode === 'login' ? (
                      <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Remember this device</span>
                      </label>
                    ) : (
                      <label className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>I agree to the Workspace Privacy Policy and Cloud Storage Terms</span>
                      </label>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    id="auth-main-submit-btn"
                    type="submit"
                    disabled={isLoading || guestLoading}
                    className={`w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-150 disabled:opacity-50 cursor-pointer ${activeColor.primaryBg}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting to Workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 5. Working Instant Guest Mode Button */}
                <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                  <button
                    id="auth-guest-mode-btn"
                    type="button"
                    onClick={handleGuestMode}
                    disabled={guestLoading || isLoading}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border border-dashed text-left transition-all duration-150 hover:scale-[1.01] active:scale-95 cursor-pointer group ${
                      isDark
                        ? 'border-slate-700 bg-slate-950/40 hover:bg-indigo-950/20 hover:border-indigo-500/50 text-slate-300'
                        : 'border-slate-300 bg-slate-50/70 hover:bg-indigo-50/50 hover:border-indigo-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        {guestLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Compass className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          Continue as Guest
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Instant access without registration
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      ⚡ Instant Demo
                    </span>
                  </button>
                </div>

                {/* Bottom Toggle Link */}
                <div className="mt-5 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {mode === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            clearAuthError();
                            setLocalValidation(null);
                            setMode('register');
                          }}
                          className={`font-bold hover:underline cursor-pointer ${activeColor.primaryClass}`}
                        >
                          Create an account
                        </button>
                      </>
                    ) : (
                      <>
                        Already registered?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            clearAuthError();
                            setLocalValidation(null);
                            setMode('login');
                          }}
                          className={`font-bold hover:underline cursor-pointer ${activeColor.primaryClass}`}
                        >
                          Sign In here
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Trust badges footer */}
              <div className="mt-6 flex items-center justify-center gap-5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-time Sync</span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Encrypted Storage</span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Guest Friendly</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 6. Simple Minimal Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-[11px] text-slate-400 border-t border-slate-200/40 dark:border-slate-800/40">
        TaskPulse &copy; 2026 &bull; High Performance Task Management Suite
      </footer>
    </div>
  );
};
