import { useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

class ThemeStore {
  private theme: Theme = 'system';
  private listeners = new Set<(theme: Theme) => void>();

  private initialized = false;

  constructor() {
    // We will initialize lazily to avoid SSR crashes
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Only access AsyncStorage on the client side
    if (typeof window !== 'undefined') {
      AsyncStorage.getItem('app-theme').then(val => {
        if (val === 'light' || val === 'dark' || val === 'system') {
          this.theme = val;
          this.notify();
        }
      }).catch(() => {
        // Ignore errors
      });
    }
  }

  get() {
    return this.theme;
  }

  set(theme: Theme) {
    this.theme = theme;
    if (typeof window !== 'undefined') {
      AsyncStorage.setItem('app-theme', theme).catch(() => {});
    }
    this.notify();
  }

  subscribe(listener: (theme: Theme) => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notify() {
    this.listeners.forEach(l => l(this.theme));
  }
}

export const themeStore = new ThemeStore();

export function useAppTheme() {
  const [theme, setTheme] = useState(themeStore.get());
  const systemTheme = useNativeColorScheme() ?? 'light';

  useEffect(() => {
    themeStore.init();
    return themeStore.subscribe(setTheme);
  }, []);

  return theme === 'system' ? systemTheme : theme;
}

export function useThemeSetting() {
  const [theme, setTheme] = useState(themeStore.get());
  useEffect(() => {
    themeStore.init();
    return themeStore.subscribe(setTheme);
  }, []);
  return { theme, setTheme: (t: Theme) => themeStore.set(t) };
}
