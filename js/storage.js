(function (global) {
  'use strict';

  const HABITS_KEY  = 'ht_habits';
  const USER_KEY    = 'ht_user';
  const SESSION_KEY = 'ht_session';

  // ─── Habit Helpers ───────────────────────────────────────────────

  function getHabits() {
    try {
      const raw = localStorage.getItem(HABITS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(h => h && typeof h.id === 'number' && typeof h.name === 'string');
    } catch (e) {
      return [];
    }
  }

  function saveHabits(habits) {
    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (e) {
      console.error('[Storage] Failed to save habits:', e);
    }
  }

  // ─── User / Gamification Profile ────────────────────────────────

  function getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return defaultUser();
      return Object.assign(defaultUser(), JSON.parse(raw));
    } catch (e) {
      return defaultUser();
    }
  }

  function defaultUser() {
    return { xp: 0, level: 'Beginner', badges: [], totalCompleted: 0, theme: 'dark' };
  }

  function saveUser(user) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('[Storage] Failed to save user:', e);
    }
  }

  // ─── Session ────────────────────────────────────────────────────

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveSession(session) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  // ─── Utility ────────────────────────────────────────────────────

  function resetAll() {
    localStorage.removeItem(HABITS_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // ─── Expose ─────────────────────────────────────────────────────

  global.HT = global.HT || {};
  global.HT.Storage = {
    getHabits, saveHabits,
    getUser, saveUser,
    getSession, saveSession, clearSession,
    resetAll
  };

})(window);
