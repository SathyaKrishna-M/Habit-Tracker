(function () {
  'use strict';

  HT.UI.requireAuth();
  HT.UI.loadTheme();
  HT.UI.buildNavbar('stats');

  // ─── Helpers ─────────────────────────────────────────────────────

  function pct(num, den) {
    if (den === 0) return 0;
    return Math.round((num / den) * 100);
  }

  function escHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  // ─── Summary Stats ────────────────────────────────────────────────

  function renderStatGrid(habits) {
    const today     = HT.UI.today();
    const todayDone = habits.filter(h => h.completedDates.includes(today)).length;
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak || h.streak || 0), 0);
    const totalComp  = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
    const maxStreak  = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

    const stats = [
      { value: habits.length,        label: 'Total Habits' },
      { value: todayDone,            label: 'Done Today' },
      { value: maxStreak + '🔥',     label: 'Active Streak' },
      { value: bestStreak + '💎',    label: 'Best Streak Ever' },
      { value: totalComp,            label: 'All-time Completions' },
    ];

    const grid = document.getElementById('statGrid');
    grid.innerHTML = stats.map(s => `
      <div class="stat-card">
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>`).join('');
  }

  // ─── XP / Level Card ──────────────────────────────────────────────

  function renderXP() {
    const user  = HT.Storage.getUser();
    const info  = HT.UI.xpToLevel(user.xp);
    const icons = { 'Beginner': '🌱', 'Apprentice': '📘', 'Intermediate': '⚡', 'Advanced': '🔥', 'Pro': '💎', 'Elite': '🌟', 'Legend': '👑' };

    document.getElementById('levelBadge').textContent = icons[info.name] || '⚡';
    document.getElementById('xpLevel').textContent    = info.name;
    document.getElementById('xpLabel').textContent    = `${user.xp} XP (${info.pct}% to ${info.name === 'Legend' ? 'max' : 'next level'})`;
    document.getElementById('xpBar').style.width      = `${info.pct}%`;
    document.getElementById('xpNumbers').textContent  = `Total XP: ${user.xp} · Completions: ${user.totalCompleted || 0}`;
  }

  // ─── Weekly Bar Chart ─────────────────────────────────────────────

  function renderWeekChart(habits) {
    const days  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chart = document.getElementById('weekChart');
    if (habits.length === 0) { chart.innerHTML = '<p style="color:var(--text2);font-size:0.85rem;">No data yet.</p>'; return; }

    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay();
    const sunday    = new Date(todayDate);
    sunday.setDate(sunday.getDate() - dayOfWeek);

    function pad2(n) { return String(n).padStart(2, '0'); }
    function toDateStr(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }

    const weekData = Array.from({ length: 7 }, (_, i) => {
      const d       = new Date(sunday);
      d.setDate(d.getDate() + i);
      const dateStr = toDateStr(d);
      const isFuture = d > todayDate;
      const done    = isFuture ? null : habits.filter(h => h.completedDates.includes(dateStr)).length;
      return { day: days[i], done, total: habits.length, pct: done === null ? 0 : pct(done, habits.length), isFuture };
    });

    const maxVal = Math.max(...weekData.map(w => w.pct), 1);

    chart.innerHTML = weekData.map(w => `
      <div class="bar-col">
        <span class="bar-val" style="${w.isFuture ? 'color:var(--border);' : ''}">${w.isFuture ? '—' : w.pct + '%'}</span>
        <div class="bar" style="height:${Math.round((w.pct / maxVal) * 100)}%;${w.isFuture ? 'background:var(--border);' : ''}" title="${w.isFuture ? 'Future' : w.done + '/' + w.total + ' habits'}"></div>
        <span class="bar-label">${w.day}</span>
      </div>`).join('');
  }

  // ─── Monthly Success Rate ─────────────────────────────────────────

  function renderMonthly(habits) {
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth();
    const days  = new Date(year, month + 1, 0).getDate();

    const monthDates = Array.from({ length: days }, (_, i) => {
      const d = i + 1;
      return `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    });

    if (habits.length === 0) {
      document.getElementById('monthRate').textContent = 'N/A';
      document.getElementById('monthSub').textContent  = 'Add some habits first.';
      return;
    }

    const possible = habits.length * days;
    const actual   = habits.reduce((sum, h) =>
      sum + monthDates.filter(d => h.completedDates.includes(d)).length, 0);

    const rate = pct(actual, possible);
    document.getElementById('monthRate').textContent = `${rate}%`;
    document.getElementById('monthBar').style.width  = `${rate}%`;
    const monthName = now.toLocaleDateString(undefined, { month: 'long' });
    document.getElementById('monthSub').textContent  = `${actual} of ${possible} possible completions in ${monthName}`;
  }

  // ─── Per-Habit Table ──────────────────────────────────────────────

  function renderHabitTable(habits) {
    const container = document.getElementById('habitTable');
    if (habits.length === 0) {
      container.innerHTML = '<p style="color:var(--text2);font-size:0.85rem;">No habits yet.</p>';
      return;
    }

    const today = HT.UI.today();
    const last7 = Array.from({ length: 7 }, (_, i) => HT.UI.daysAgo(i));

    const rows = habits.map(h => {
      const week7     = last7.filter(d => h.completedDates.includes(d)).length;
      const pct7      = pct(week7, 7);
      const doneToday = h.completedDates.includes(today) ? '✅' : '⬜';
      return `<tr>
        <td style="padding:0.6rem 0.5rem;font-weight:500;">${escHtml(h.name)}</td>
        <td style="padding:0.6rem 0.5rem;text-align:center;"><span class="habit-cat cat-${(h.category||'other').toLowerCase()}">${h.category||'Other'}</span></td>
        <td style="padding:0.6rem 0.5rem;text-align:center;">${doneToday}</td>
        <td style="padding:0.6rem 0.5rem;text-align:center;font-weight:700;color:var(--warning);">${h.streak}🔥</td>
        <td style="padding:0.6rem 0.5rem;text-align:center;color:var(--accent);">${pct7}%</td>
        <td style="padding:0.6rem 0.5rem;text-align:center;color:var(--text2);">${h.completedDates.length}</td>
      </tr>`;
    }).join('');

    container.innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
        <thead>
          <tr style="color:var(--text2);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid var(--border);">
            <th style="padding:0.5rem 0.5rem;text-align:left;">Habit</th>
            <th style="padding:0.5rem 0.5rem;">Category</th>
            <th style="padding:0.5rem 0.5rem;">Today</th>
            <th style="padding:0.5rem 0.5rem;">Streak</th>
            <th style="padding:0.5rem 0.5rem;">7-day %</th>
            <th style="padding:0.5rem 0.5rem;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  // ─── Badges ───────────────────────────────────────────────────────

  function renderBadges() {
    const user   = HT.Storage.getUser();
    const earned = new Set(user.badges || []);
    const grid   = document.getElementById('badgesGrid');

    grid.innerHTML = HT.UI.BADGE_DEFS.map(b => `
      <div class="badge-item ${earned.has(b.id) ? 'earned' : 'locked'}">
        <div class="badge-icon">${b.label.split(' ')[0]}</div>
        <div class="badge-name">${b.label.split(' ').slice(1).join(' ')}</div>
        <div class="badge-desc">${b.desc}</div>
        ${earned.has(b.id) ? '<div style="font-size:0.72rem;color:var(--accent);margin-top:0.3rem;font-weight:700;">UNLOCKED ✓</div>' : ''}
      </div>`).join('');
  }

  // ─── Init ────────────────────────────────────────────────────────

  function init() {
    const habits = HT.Storage.getHabits();
    renderStatGrid(habits);
    renderXP();
    renderWeekChart(habits);
    renderMonthly(habits);
    renderHabitTable(habits);
    renderBadges();
  }

  init();

})();
