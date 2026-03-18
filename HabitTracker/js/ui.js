(function (global) {
  'use strict';

  // ─── Auth Guard ──────────────────────────────────────────────────

  function requireAuth() {
    if (!HT.Storage.getSession()) {
      window.location.href = 'login.html';
    }
  }

  // ─── Theme ───────────────────────────────────────────────────────

  function applyTheme(theme) {
    document.body.dataset.theme = theme || 'dark';
  }

  function loadTheme() {
    const user = HT.Storage.getUser();
    applyTheme(user.theme || 'dark');
  }

  function toggleTheme() {
    const user = HT.Storage.getUser();
    user.theme = user.theme === 'dark' ? 'light' : 'dark';
    HT.Storage.saveUser(user);
    applyTheme(user.theme);
    return user.theme;
  }

  // ─── Navbar ──────────────────────────────────────────────────────

  function buildNavbar(activePage) {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    const session  = HT.Storage.getSession();
    const username = session ? session.username : 'Guest';

    const links = [
      { page: 'index',    href: 'index.html',    icon: '🏠', label: 'Home' },
      { page: 'add',      href: 'add.html',       icon: '➕', label: 'Add' },
      { page: 'stats',    href: 'stats.html',     icon: '📊', label: 'Stats' },
      { page: 'calendar', href: 'calendar.html',  icon: '📅', label: 'Calendar' },
      { page: 'settings', href: 'settings.html',  icon: '⚙️',  label: 'Settings' },
    ];

    nav.innerHTML = `
      <div class="nav-brand">
        <span class="nav-logo">⚡</span>
        <span class="nav-title">HabitTracker</span>
      </div>
      <ul class="nav-links">
        ${links.map(l => `
          <li>
            <a href="${l.href}" class="nav-link ${l.page === activePage ? 'active' : ''}">
              <span class="nav-icon">${l.icon}</span>
              <span class="nav-label">${l.label}</span>
            </a>
          </li>
        `).join('')}
      </ul>
      <div class="nav-user">
        <span class="nav-username">👤 ${username}</span>
        <button id="logoutBtn" class="logout-btn" title="Log out">↩ Logout</button>
      </div>`;

    document.getElementById('logoutBtn').addEventListener('click', () => {
      HT.Storage.clearSession();
      window.location.href = 'login.html';
    });
  }

  // ─── Toast Notifications ─────────────────────────────────────────

  let toastContainer = null;

  function ensureToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }

  function showToast(message, type = 'info', duration = 3000) {
    ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
      toast.classList.remove('visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  }

  // ─── Date Utilities ──────────────────────────────────────────────

  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function yesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function calcStreak(completedDates) {
    if (!completedDates || completedDates.length === 0) return 0;
    const sorted = [...completedDates].sort((a, b) => b.localeCompare(a));
    const t = today(), y = yesterday();
    if (sorted[0] !== t && sorted[0] !== y) return 0;
    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      prev.setDate(prev.getDate() - 1);
      const expected = `${prev.getFullYear()}-${pad(prev.getMonth() + 1)}-${pad(prev.getDate())}`;
      if (sorted[i] === expected) streak++;
      else break;
    }
    return streak;
  }

  // ─── Gamification ────────────────────────────────────────────────

  const LEVELS = [
    { name: 'Beginner',      minXP:    0 },
    { name: 'Apprentice',    minXP:  100 },
    { name: 'Intermediate',  minXP:  300 },
    { name: 'Advanced',      minXP:  700 },
    { name: 'Pro',           minXP: 1500 },
    { name: 'Elite',         minXP: 3000 },
    { name: 'Legend',        minXP: 6000 },
  ];

  const BADGE_DEFS = [
    { id: 'first1',    label: '⭐ First Step',       desc: 'Complete your very first habit' },
    { id: 'streak7',   label: '🔥 Week Warrior',    desc: '7-day streak on any habit'     },
    { id: 'streak30',  label: '💎 Month Master',     desc: '30-day streak on any habit'    },
    { id: 'streak100', label: '👑 Century Club',      desc: '100-day streak on any habit'   },
    { id: 'habits5',   label: '📋 Habit Builder',    desc: 'Track 5 or more habits'        },
    { id: 'complete7', label: '⚡ Perfect Week',      desc: 'Complete all habits in a day for 7 days' },
    { id: 'total50',   label: '🌟 Half Century',     desc: '50 total completions'          },
    { id: 'total100',  label: '🏆 Centurion',        desc: '100 total completions'         },
  ];

  function xpToLevel(xp) {
    let level = LEVELS[0];
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].minXP) { level = LEVELS[i]; break; }
    }
    const idx  = LEVELS.indexOf(level);
    const next = LEVELS[idx + 1] || { minXP: level.minXP + 1000 };
    const pct  = Math.min(100, Math.round(((xp - level.minXP) / (next.minXP - level.minXP)) * 100));
    return { name: level.name, minXP: level.minXP, nextXP: next.minXP, pct };
  }

  function awardXP(habits, amount = 10) {
    const user = HT.Storage.getUser();
    user.xp += amount;
    user.totalCompleted = (user.totalCompleted || 0) + 1;

    const earned    = new Set(user.badges || []);
    const maxStreak = Math.max(...habits.map(h => h.streak || 0), 0);

    const checks = [
      { id: 'first1',    cond: user.totalCompleted >= 1 },
      { id: 'streak7',   cond: maxStreak >= 7 },
      { id: 'streak30',  cond: maxStreak >= 30 },
      { id: 'streak100', cond: maxStreak >= 100 },
      { id: 'habits5',   cond: habits.length >= 5 },
      { id: 'total50',   cond: user.totalCompleted >= 50 },
      { id: 'total100',  cond: user.totalCompleted >= 100 },
    ];

    let newBadge = null;
    checks.forEach(c => {
      if (c.cond && !earned.has(c.id)) {
        earned.add(c.id);
        newBadge = BADGE_DEFS.find(b => b.id === c.id);
      }
    });

    user.badges = [...earned];
    user.level  = xpToLevel(user.xp).name;
    HT.Storage.saveUser(user);

    if (newBadge) showToast(`Badge unlocked: ${newBadge.label}`, 'success', 4000);
    return { user, newBadge };
  }

  // ─── Daily Reminder ──────────────────────────────────────────────

  function dailyReminder(habits) {
    if (habits.length === 0) return;
    const t    = today();
    const done = habits.filter(h => h.completedDates && h.completedDates.includes(t)).length;
    if (done === 0) {
      showToast("You haven't completed any habits today. Let's go! 💪", 'warning', 5000);
    }
  }

  // ─── Expose ──────────────────────────────────────────────────────

  global.HT = global.HT || {};
  global.HT.UI = {
    requireAuth, applyTheme, loadTheme, toggleTheme,
    buildNavbar, showToast,
    today, yesterday, daysAgo, calcStreak,
    xpToLevel, BADGE_DEFS, awardXP, dailyReminder
  };

})(window);
