import React, { createContext, useContext, useState, useEffect } from 'react';
import { BackgroundVariant, ThemeConfig } from '../types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'slate',
    name: 'Slate Studio',
    description: 'Clean modern slate with subtle dot grid and crisp indigo accents',
    previewBg: 'bg-slate-100',
    previewBorder: 'border-slate-300',
    previewAccent: 'bg-indigo-600',
    isDark: false,
  },
  {
    id: 'midnight',
    name: 'Midnight Executive',
    description: 'Deep obsidian dark theme with sapphire glow and high-contrast text',
    previewBg: 'bg-slate-900',
    previewBorder: 'border-slate-700',
    previewAccent: 'bg-indigo-500',
    isDark: true,
  },
  {
    id: 'warm',
    name: 'Warm Sandstone',
    description: 'Soothing warm titanium canvas with amber and terracotta accents',
    previewBg: 'bg-amber-50',
    previewBorder: 'border-amber-200',
    previewAccent: 'bg-amber-600',
    isDark: false,
  },
  {
    id: 'emerald',
    name: 'Emerald Workspace',
    description: 'Refreshing mint and calm sage workspace with emerald accents',
    previewBg: 'bg-emerald-50',
    previewBorder: 'border-emerald-200',
    previewAccent: 'bg-emerald-600',
    isDark: false,
  },
  {
    id: 'minimal',
    name: 'Pure Monochrome',
    description: 'Ultra-crisp studio paper white with sharp contrast geometry',
    previewBg: 'bg-zinc-100',
    previewBorder: 'border-zinc-300',
    previewAccent: 'bg-zinc-900',
    isDark: false,
  },
];

interface ThemeContextType {
  theme: BackgroundVariant;
  setTheme: (theme: BackgroundVariant) => void;
  isDark: boolean;
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<BackgroundVariant>(() => {
    const saved = localStorage.getItem('taskpulse_theme_variant');
    if (saved && ['slate', 'midnight', 'warm', 'emerald', 'minimal'].includes(saved)) {
      return saved as BackgroundVariant;
    }
    return 'slate';
  });

  const setTheme = (newTheme: BackgroundVariant) => {
    setThemeState(newTheme);
    localStorage.setItem('taskpulse_theme_variant', newTheme);
  };

  const themeConfig = THEMES.find((t) => t.id === theme) || THEMES[0];
  const isDark = themeConfig.isDark || false;

  useEffect(() => {
    // Update body background and color attributes
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
