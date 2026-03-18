(function () {
  'use strict';

  const CREDS_KEY = 'ht_credentials';

  const DEFAULT_USERS = [
    { username: 'admin', password: 'admin123' },
    { username: 'demo',  password: 'demo' }
  ];

  function getCredentials() {
    try {
      const raw = localStorage.getItem(CREDS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  }

  function validate(username, password) {
    const users = getCredentials();
    return users.some(u => u.username === username.trim() && u.password === password);
  }

  function init() {
    const form       = document.getElementById('loginForm');
    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');
    const errorEl    = document.getElementById('loginError');
    const togglePasswordBtn = document.getElementById('togglePassword');

    if (!form) return;

    if (HT.Storage.getSession()) {
      window.location.href = 'index.html';
      return;
    }

    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener('click', () => {
        const type = passwordEl.type === 'password' ? 'text' : 'password';
        passwordEl.type = type;
        togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = usernameEl.value.trim();
      const password = passwordEl.value;

      if (!username || !password) {
        showError('Please enter both username and password.');
        return;
      }

      if (validate(username, password)) {
        HT.Storage.saveSession({ username });
        form.closest('.login-card').classList.add('success');
        setTimeout(() => { window.location.href = 'index.html'; }, 600);
      } else {
        showError('Invalid username or password. Try: demo / demo');
        passwordEl.value = '';
        passwordEl.focus();
      }
    });

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
      form.classList.add('shake');
      setTimeout(() => { form.classList.remove('shake'); }, 500);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
