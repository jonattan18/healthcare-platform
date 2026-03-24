import { create } from 'zustand';

interface ThemeState {
  dark: boolean;
  toggle: () => void;
}

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const stored =
  typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;

const initial = stored ? stored === 'dark' : prefersDark;

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// Apply on load
if (typeof document !== 'undefined') applyTheme(initial);

export const useThemeStore = create<ThemeState>((set, get) => ({
  dark: initial,
  toggle: () => {
    const next = !get().dark;
    applyTheme(next);
    set({ dark: next });
  },
}));
