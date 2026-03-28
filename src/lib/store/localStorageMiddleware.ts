import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from './store';

const STORAGE_KEY = 'saral_gamification_state';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  try {
    const state = store.getState() as RootState;
    const { enabled, rewards } = state.gamification;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled, rewards }));
    }
  } catch {
    // localStorage unavailable (SSR, private browsing, quota exceeded)
  }
  return result;
};
