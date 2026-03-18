(function () {
  'use strict';

  HT.UI.requireAuth();
  HT.UI.loadTheme();
  HT.UI.buildNavbar('add');

  const form      = document.getElementById('addHabitForm');
  const nameInput = document.getElementById('habitName');
  const catSel    = document.getElementById('habitCategory');
  const timeInput = document.getElementById('habitTime');
  const goalInput = document.getElementById('habitGoal');
  const nameError = document.getElementById('nameError');
  const listEl    = document.getElementById('habitList');
  const emptyMsg  = document.getElementById('emptyMsg');

  // ─── Helpers ─────────────────────────────────────────────────────

  function escHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  // ─── Render List ─────────────────────────────────────────────────

  function renderList() {
    const habits = HT.Storage.getHabits();
    listEl.innerHTML = '';

    if (habits.length === 0) {
      emptyMsg.style.display = 'block';
      return;
    }
    emptyMsg.style.display = 'none';

    habits.forEach(habit => {
      const catClass = `cat-${(habit.category || 'other').toLowerCase()}`;
      const card = document.createElement('div');
      card.className = 'habit-card';
      card.dataset.id = habit.id;
      card.innerHTML = `
        <div class="habit-info" style="flex:1;">
          <div class="habit-name">${escHtml(habit.name)}</div>
          <div class="habit-meta">
            <span class="habit-cat ${catClass}">${habit.category || 'Other'}</span>
            ${habit.goal ? `<span class="habit-goal">🎯 ${escHtml(habit.goal)}</span>` : ''}
            ${habit.time ? `<span class="habit-time">⏰ ${habit.time}</span>` : ''}
          </div>
        </div>
        <button class="delete-btn" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>`;

      card.querySelector('.delete-btn').addEventListener('click', () => {
        if (!confirm(`Delete "${habit.name}"?`)) return;
        const updated = HT.Storage.getHabits().filter(h => h.id !== habit.id);
        HT.Storage.saveHabits(updated);
        renderList();
        HT.UI.showToast('Habit deleted', 'info');
      });

      listEl.appendChild(card);
    });
  }

  // ─── Form Submit ─────────────────────────────────────────────────

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();

    if (!name) {
      nameInput.classList.add('input-error');
      nameError.style.display = 'block';
      nameInput.focus();
      setTimeout(() => { nameInput.classList.remove('input-error'); nameError.style.display = 'none'; }, 2500);
      return;
    }

    const habits = HT.Storage.getHabits();
    if (habits.some(h => h.name.toLowerCase() === name.toLowerCase())) {
      HT.UI.showToast('A habit with that name already exists!', 'warning');
      return;
    }

    const newHabit = {
      id: Date.now(),
      name,
      category: catSel.value,
      time: timeInput.value || '',
      goal: goalInput.value.trim(),
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: HT.UI.today()
    };

    habits.push(newHabit);
    HT.Storage.saveHabits(habits);
    renderList();

    nameInput.value = '';
    goalInput.value = '';
    timeInput.value = '';
    catSel.value    = 'Health';
    nameInput.focus();

    HT.UI.showToast(`"${name}" added successfully!`, 'success');
  });

  // ─── Init ────────────────────────────────────────────────────────

  renderList();

})();
