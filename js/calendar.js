(function () {
  'use strict';

  HT.UI.requireAuth();
  HT.UI.loadTheme();
  HT.UI.buildNavbar('calendar');

  const filterSel   = document.getElementById('habitFilter');
  const monthsEl    = document.getElementById('heatmapMonths');
  const gridEl      = document.getElementById('heatmapGrid');
  const calStatGrid = document.getElementById('calStatGrid');

  // ─── Date Range ──────────────────────────────────────────────────

  function buildDateRange() {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    while (start.getDay() !== 0) start.setDate(start.getDate() - 1);

    const dates = [];
    const cur   = new Date(start);
    while (cur <= today) {
      dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  }

  function fmt(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  // ─── Habit Filter ────────────────────────────────────────────────

  function populateFilter(habits) {
    filterSel.innerHTML = `<option value="__all__">All Habits</option>` +
      habits.map(h => `<option value="${h.id}">${escHtml(h.name)}</option>`).join('');
  }

  // ─── Completion Map ───────────────────────────────────────────────

  function buildCompletionMap(habits, filterId) {
    const selected = filterId === '__all__'
      ? habits
      : habits.filter(h => String(h.id) === filterId);

    const map = {};
    selected.forEach(h => {
      h.completedDates.forEach(d => {
        map[d] = (map[d] || 0) + 1;
      });
    });

    const maxHabits = selected.length || 1;
    const levelMap  = {};
    Object.keys(map).forEach(d => {
      const ratio = map[d] / maxHabits;
      levelMap[d] = ratio <= 0 ? 0 : ratio <= 0.25 ? 1 : ratio <= 0.5 ? 2 : ratio <= 0.75 ? 3 : 4;
    });
    return { map, levelMap };
  }

  // ─── Render Heatmap ───────────────────────────────────────────────

  function renderHeatmap(habits, filterId) {
    const allDates  = buildDateRange();
    const { map, levelMap } = buildCompletionMap(habits, filterId);
    const MONTHS    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const DAYS      = ['Su','Mo','Tu','We','Th','Fr','Sa'];

    const weeks = [];
    let week    = [];
    allDates.forEach(d => {
      week.push(d);
      if (d.getDay() === 6) { weeks.push(week); week = []; }
    });
    if (week.length) weeks.push(week);

    monthsEl.innerHTML = '';
    let lastMonth = -1;
    weeks.forEach(w => {
      const firstDay = w[0];
      const mLabel   = document.createElement('span');
      mLabel.className = 'heatmap-month-label';
      mLabel.style.width   = `${w.length * 17}px`;
      mLabel.style.display = 'inline-block';
      if (firstDay.getMonth() !== lastMonth) {
        mLabel.textContent = MONTHS[firstDay.getMonth()];
        lastMonth = firstDay.getMonth();
      }
      monthsEl.appendChild(mLabel);
    });

    gridEl.innerHTML = '';
    const gridWrapper = document.createElement('div');
    gridWrapper.style.cssText = 'display:flex;gap:0;';

    const dayLabels = document.createElement('div');
    dayLabels.style.cssText = 'display:flex;flex-direction:column;gap:3px;margin-right:4px;justify-content:space-around;';
    DAYS.forEach((day, i) => {
      const s = document.createElement('span');
      s.textContent = i % 2 === 1 ? day : '';
      s.style.cssText = 'font-size:0.65rem;color:var(--text2);height:14px;display:flex;align-items:center;';
      dayLabels.appendChild(s);
    });
    gridWrapper.appendChild(dayLabels);

    weeks.forEach(w => {
      const col = document.createElement('div');
      col.style.cssText = 'display:flex;flex-direction:column;gap:3px;';
      if (w === weeks[0] && w[0].getDay() !== 0) {
        for (let i = 0; i < w[0].getDay(); i++) {
          const empty = document.createElement('div');
          empty.style.cssText = 'width:14px;height:14px;';
          col.appendChild(empty);
        }
      }
      w.forEach(d => {
        const dateStr = fmt(d);
        const level   = levelMap[dateStr] || 0;
        const count   = map[dateStr] || 0;
        const cell    = document.createElement('div');
        cell.className = 'heatmap-cell';
        if (level > 0) cell.dataset.level = level;
        cell.title = `${dateStr}: ${count} completion${count !== 1 ? 's' : ''}`;
        col.appendChild(cell);
      });
      gridWrapper.appendChild(col);
    });

    gridEl.appendChild(gridWrapper);

    const yearStart  = fmt(allDates[0]);
    const totalDays  = allDates.length;
    const activeDays = Object.keys(levelMap).filter(d => d >= yearStart).length;
    const totalComp  = Object.values(map).reduce((s, n) => s + n, 0);
    const longestStrk = computeLongestStreak(habits, filterId);

    calStatGrid.innerHTML = [
      { value: totalDays,          label: 'Days in View' },
      { value: activeDays,         label: 'Active Days' },
      { value: totalComp,          label: 'Total Completions' },
      { value: longestStrk + '🔥', label: 'Longest Streak' },
    ].map(s => `
      <div class="stat-card">
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>`).join('');
  }

  // ─── Longest Streak ───────────────────────────────────────────────

  function computeLongestStreak(habits, filterId) {
    const selected = filterId === '__all__'
      ? habits
      : habits.filter(h => String(h.id) === filterId);

    if (selected.length === 0) return 0;
    const allDates = new Set(selected.flatMap(h => h.completedDates));
    const sorted   = [...allDates].sort();
    let max = 0, cur = 0, prev = null;
    sorted.forEach(d => {
      if (prev) {
        const prevDate = new Date(prev);
        prevDate.setDate(prevDate.getDate() + 1);
        const expectedNext = fmt(prevDate);
        if (d === expectedNext) { cur++; }
        else { cur = 1; }
      } else { cur = 1; }
      max  = Math.max(max, cur);
      prev = d;
    });
    return max;
  }

  // ─── Helpers ─────────────────────────────────────────────────────

  function escHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  // ─── Init ────────────────────────────────────────────────────────

  function init() {
    const habits = HT.Storage.getHabits();
    populateFilter(habits);
    renderHeatmap(habits, '__all__');

    filterSel.addEventListener('change', () => {
      renderHeatmap(HT.Storage.getHabits(), filterSel.value);
    });
  }

  init();

})();
