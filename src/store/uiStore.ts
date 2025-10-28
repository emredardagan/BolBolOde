import { create } from 'zustand';
import { AppTheme, Language } from '../types/enums';

interface UIState {
  theme: AppTheme;
  language: Language;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: Language) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: AppTheme.Auto,
  language: Language.TR,
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}));

