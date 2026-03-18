(function () {
  'use strict';

  HT.UI.requireAuth();
  HT.UI.loadTheme();
  HT.UI.buildNavbar('settings');

  const themeToggle = document.getElementById('themeToggle');
  const resetBtn    = document.getElementById('resetBtn');
  const logoutBtn   = document.getElementById('settingsLogout');
  const loggedInAs  = document.getElementById('loggedInAs');

  // ─── Current User ────────────────────────────────────────────────

  const session = HT.Storage.getSession();
  loggedInAs.textContent = session ? session.username : 'Guest';

  // ─── Theme Toggle ────────────────────────────────────────────────

  const user = HT.Storage.getUser();
  themeToggle.checked = (user.theme !== 'light');

  themeToggle.addEventListener('change', () => {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    const u = HT.Storage.getUser();
    u.theme = newTheme;
    HT.Storage.saveUser(u);
    HT.UI.applyTheme(newTheme);
    HT.UI.showToast(`Switched to ${newTheme} mode`, 'info');
  });

  // ─── Reset All Data ──────────────────────────────────────────────

  resetBtn.addEventListener('click', () => {
    const habits = HT.Storage.getHabits();
    if (habits.length === 0) {
      HT.UI.showToast('There is no data to reset.', 'info');
      return;
    }
    const confirmed = confirm(
      `⚠️ This will permanently delete ALL ${habits.length} habit(s) and your progress.\n\nThis cannot be undone. Are you sure?`
    );
    if (!confirmed) return;
    HT.Storage.resetAll();
    HT.UI.showToast('All data has been reset.', 'success');
  });

  // ─── Logout ──────────────────────────────────────────────────────

  logoutBtn.addEventListener('click', () => {
    HT.Storage.clearSession();
    window.location.href = 'login.html';
  });

})();
