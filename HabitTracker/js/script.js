(function () {
  'use strict';

  HT.UI.requireAuth();
  HT.UI.loadTheme();
  HT.UI.buildNavbar('index');

  // ─── Greeting & Date ─────────────────────────────────────────────

  function setGreeting() {
    const session = HT.Storage.getSession();
    const hour    = new Date().getHours();
    const name    = session ? session.username : 'there';
    const greet   = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    document.getElementById('greeting').textContent = `${greet}, ${name}! 👋`;

    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateLabel').textContent = new Date().toLocaleDateString(undefined, opts);
  }

  // ─── Filter State ────────────────────────────────────────────────

  let activeFilter = 'All';

  // ─── Render XP / Level ───────────────────────────────────────────

  function renderXP() {
    const user      = HT.Storage.getUser();
    const levelInfo = HT.UI.xpToLevel(user.xp);

    const lvlIcons = {
      'Beginner': '🌱', 'Apprentice': '📘', 'Intermediate': '⚡',
      'Advanced': '🔥', 'Pro': '💎', 'Elite': '🌟', 'Legend': '👑'
    };

    document.getElementById('levelBadge').textContent = lvlIcons[levelInfo.name] || '⚡';
    document.getElementById('xpLevel').textContent    = levelInfo.name;
    document.getElementById('xpLabel').textContent    = `${user.xp} / ${levelInfo.nextXP} XP to next level`;
    document.getElementById('xpBar').style.width      = `${levelInfo.pct}%`;
    document.getElementById('xpNumbers').textContent  = `Total XP: ${user.xp} · Completions: ${user.totalCompleted || 0}`;
  }

  // ─── Render Progress ─────────────────────────────────────────────

  function renderProgress(habits) {
    const today = HT.UI.today();
    const total = habits.length;
    const done  = habits.filter(h => h.completedDates.includes(today)).length;
    const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById('progressBar').style.width  = `${pct}%`;
    document.getElementById('progressText').textContent = `${pct}% completed`;
    document.getElementById('progressSub').textContent  = `${done} of ${total} habits done today`;
  }

  // ─── Category Filters ────────────────────────────────────────────

  function renderFilters(habits) {
    const cats   = ['All', ...new Set(habits.map(h => h.category || 'Other'))];
    const tabsEl = document.getElementById('filterTabs');
    tabsEl.innerHTML = '';

    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `btn btn-secondary${cat === activeFilter ? ' active-filter' : ''}`;
      btn.style.cssText = 'padding:0.35rem 0.9rem;font-size:0.8rem;';
      if (cat === activeFilter) {
        btn.style.cssText += 'background:var(--primary);color:#fff;border-color:var(--primary);';
      }
      btn.textContent = cat;
      btn.addEventListener('click', () => { activeFilter = cat; renderAll(); });
      tabsEl.appendChild(btn);
    });
  }

  // ─── Habit Card Renderer ─────────────────────────────────────────

  function renderHabits(habits) {
    const listEl  = document.getElementById('habitList');
    const emptyEl = document.getElementById('emptyState');
    listEl.innerHTML = '';

    const filtered = activeFilter === 'All'
      ? habits
      : habits.filter(h => (h.category || 'Other') === activeFilter);

    if (habits.length === 0) {
      emptyEl.style.display = 'block';
      return;
    }
    emptyEl.style.display = 'none';

    const today = HT.UI.today();

    filtered.forEach(habit => {
      const isComplete = habit.completedDates.includes(today);
      const catClass   = `cat-${(habit.category || 'other').toLowerCase()}`;
      const fireIcon   = habit.streak >= 100 ? '👑' : habit.streak >= 30 ? '💎' : habit.streak > 0 ? '🔥' : '○';

      const card = document.createElement('div');
      card.className = `habit-card${isComplete ? ' completed' : ''}`;
      card.dataset.id = habit.id;
      card.innerHTML = `
        <label class="check-wrap" title="${isComplete ? 'Mark incomplete' : 'Mark complete'}">
          <input type="checkbox" class="habit-checkbox" ${isComplete ? 'checked' : ''}>
          <span class="custom-check"></span>
        </label>
        <div class="habit-info">
          <div class="habit-name">${escHtml(habit.name)}</div>
          <div class="habit-meta">
            <span class="habit-cat ${catClass}">${habit.category || 'Other'}</span>
            <span class="streak-info">${fireIcon} ${habit.streak} day streak</span>
            ${habit.goal ? `<span class="habit-goal">🎯 ${escHtml(habit.goal)}</span>` : ''}
            ${habit.time ? `<span class="habit-time">⏰ ${habit.time}</span>` : ''}
          </div>
        </div>
        <button class="delete-btn" title="Delete habit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>`;

      card.querySelector('.habit-checkbox').addEventListener('change', () => toggleHabit(habit.id));
      card.querySelector('.delete-btn').addEventListener('click', () => deleteHabit(habit.id));

      listEl.appendChild(card);
    });
  }

  // ─── Core Actions ────────────────────────────────────────────────

  function toggleHabit(id) {
    let habits  = HT.Storage.getHabits();
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = HT.UI.today();
    if (habit.completedDates.includes(today)) {
      habit.completedDates = habit.completedDates.filter(d => d !== today);
      habit.streak = HT.UI.calcStreak(habit.completedDates);
    } else {
      habit.completedDates.push(today);
      habit.streak     = HT.UI.calcStreak(habit.completedDates);
      habit.bestStreak = Math.max(habit.bestStreak || 0, habit.streak);
      HT.UI.awardXP(habits, 10);
    }

    HT.Storage.saveHabits(habits);
    renderAll();
  }

  function deleteHabit(id) {
    const habits = HT.Storage.getHabits();
    const habit  = habits.find(h => h.id === id);
    if (!habit) return;
    if (!confirm(`Delete "${habit.name}"?`)) return;

    const card = document.querySelector(`.habit-card[data-id="${id}"]`);
    if (card) {
      card.style.transition = 'all 0.3s ease';
      card.style.transform  = 'scale(0.95)';
      card.style.opacity    = '0';
      setTimeout(() => {
        HT.Storage.saveHabits(habits.filter(h => h.id !== id));
        renderAll();
      }, 280);
    } else {
      HT.Storage.saveHabits(habits.filter(h => h.id !== id));
      renderAll();
    }
  }

  // ─── Master Render ───────────────────────────────────────────────

  function renderAll() {
    const habits = HT.Storage.getHabits();
    renderXP();
    renderProgress(habits);
    renderFilters(habits);
    renderHabits(habits);
  }

  // ─── Helpers ─────────────────────────────────────────────────────

  function escHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  // ─── Init ────────────────────────────────────────────────────────

  setGreeting();
  renderAll();
  HT.UI.dailyReminder(HT.Storage.getHabits());

})();
