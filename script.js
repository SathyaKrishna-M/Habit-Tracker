/**
 * Habit Tracker - script.js
 * A fully functional habit tracker using Vanilla JS + localStorage.
 */

(function () {
  'use strict';

  // ─── Constants ───────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'habitTrackerData';
  const THEME_KEY = 'habitTrackerTheme';

  // ─── DOM References ──────────────────────────────────────────────────────────
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  const form = document.getElementById('addHabitForm');
  const habitInput = document.getElementById('habitInput');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const habitList = document.getElementById('habitList');
  const emptyState = document.getElementById('emptyState');
  const habitTemplate = document.getElementById('habitTemplate');

  // ─── State ───────────────────────────────────────────────────────────────────
  /** @type {{ id: number, name: string, streak: number, completedDates: string[] }[]} */
  let habits = [];

  // ─── Date Helpers ────────────────────────────────────────────────────────────

  /**
   * Returns today's date as a YYYY-MM-DD string.
   * @returns {string}
   */
  function getTodayString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Returns yesterday's date as a YYYY-MM-DD string.
   * @returns {string}
   */
  function getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ─── Streak Calculation ───────────────────────────────────────────────────────

  /**
   * Recalculates the streak for a given habit based on its completion dates.
   * The streak is built from today backwards; any gap breaks it.
   * @param {{ completedDates: string[] }} habit
   * @returns {number} The current streak count
   */
  function calculateStreak(habit) {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;

    // Sort dates descending
    const sorted = [...habit.completedDates].sort((a, b) => b.localeCompare(a));
    const today = getTodayString();
    const yesterday = getYesterdayString();

    // Streak must start from today or yesterday (habit completed recently)
    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      // Build expected previous date by parsing current reference
      const referenceParts = sorted[i - 1].split('-');
      const referenceDate = new Date(
        Number(referenceParts[0]),
        Number(referenceParts[1]) - 1,
        Number(referenceParts[2])
      );
      referenceDate.setDate(referenceDate.getDate() - 1);

      const expectedPrev = [
        referenceDate.getFullYear(),
        String(referenceDate.getMonth() + 1).padStart(2, '0'),
        String(referenceDate.getDate()).padStart(2, '0')
      ].join('-');

      if (sorted[i] === expectedPrev) {
        streak++;
      } else {
        break; // Gap found — streak ends
      }
    }
    return streak;
  }

  // ─── Progress Calculation ─────────────────────────────────────────────────────

  /**
   * Calculates & updates the progress bar and text for today.
   */
  function calculateProgress() {
    if (habits.length === 0) {
      progressBar.style.width = '0%';
      progressText.textContent = '0% completed';
      return;
    }
    const today = getTodayString();
    const completed = habits.filter(h => h.completedDates.includes(today)).length;
    const pct = Math.round((completed / habits.length) * 100);

    progressBar.style.width = `${pct}%`;
    progressText.textContent = `${pct}% completed`;
  }

  // ─── LocalStorage ────────────────────────────────────────────────────────────

  /**
   * Saves the current habits array to localStorage.
   */
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
      console.error('Habit Tracker: Failed to save to localStorage.', e);
    }
  }

  /**
   * Loads habits from localStorage; falls back to an empty array on error.
   */
  function loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // Basic validation – must be an array of objects
      if (Array.isArray(parsed)) {
        habits = parsed.filter(
          h =>
            h &&
            typeof h.id === 'number' &&
            typeof h.name === 'string' &&
            typeof h.streak === 'number' &&
            Array.isArray(h.completedDates)
        );
        // Recalculate streaks on load to account for missed days
        habits.forEach(h => { h.streak = calculateStreak(h); });
        saveToLocalStorage(); // Persist corrected streaks
      }
    } catch (e) {
      console.error('Habit Tracker: localStorage data is corrupt. Resetting.', e);
      habits = [];
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  /**
   * Renders a single habit card into the habit list.
   * @param {{ id: number, name: string, streak: number, completedDates: string[] }} habit
   */
  function renderHabitCard(habit) {
    const today = getTodayString();
    const isCompleted = habit.completedDates.includes(today);

    // Clone the hidden template
    const fragment = habitTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.habit-card');

    card.dataset.id = habit.id;
    if (isCompleted) card.classList.add('completed');

    // Checkbox
    const checkbox = card.querySelector('.habit-checkbox');
    checkbox.checked = isCompleted;
    checkbox.addEventListener('change', () => toggleHabit(habit.id));

    // Name
    card.querySelector('.habit-name').textContent = habit.name;

    // Streak
    card.querySelector('.streak-count').textContent = habit.streak;

    // Highlight fire emoji for milestone streaks (7, 30, 100)
    const fireIcon = card.querySelector('.fire-icon');
    if (habit.streak >= 100) {
      fireIcon.textContent = '💎';
    } else if (habit.streak >= 30) {
      fireIcon.textContent = '⚡';
    } else if (habit.streak >= 7) {
      fireIcon.textContent = '🔥';
    } else if (habit.streak === 0) {
      fireIcon.textContent = '○';
      card.querySelector('.streak-badge').style.color = 'var(--text-muted)';
    }

    // Delete button
    card.querySelector('.delete-btn').addEventListener('click', () => deleteHabit(habit.id));

    habitList.appendChild(fragment);
  }

  /**
   * Clears and re-renders the full habit list.
   */
  function renderHabits() {
    habitList.innerHTML = '';

    if (habits.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      habits.forEach(renderHabitCard);
    }

    calculateProgress();
  }

  // ─── Core Actions ─────────────────────────────────────────────────────────────

  /**
   * Adds a new habit from the input field.
   */
  function addHabit() {
    const name = habitInput.value.trim();

    // Validate input
    if (!name) {
      habitInput.classList.add('input-error');
      habitInput.placeholder = 'Please enter a habit name!';
      setTimeout(() => {
        habitInput.classList.remove('input-error');
        habitInput.placeholder = 'What habit do you want to start?';
      }, 2000);
      return;
    }

    // Prevent duplicates (case-insensitive)
    const duplicate = habits.some(
      h => h.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      habitInput.classList.add('input-error');
      habitInput.placeholder = 'This habit already exists!';
      habitInput.value = '';
      setTimeout(() => {
        habitInput.classList.remove('input-error');
        habitInput.placeholder = 'What habit do you want to start?';
      }, 2000);
      return;
    }

    /** @type {{ id: number, name: string, streak: number, completedDates: string[] }} */
    const newHabit = {
      id: Date.now(),
      name,
      streak: 0,
      completedDates: []
    };

    habits.push(newHabit);
    saveToLocalStorage();
    renderHabits();

    habitInput.value = '';
    habitInput.focus();
  }

  /**
   * Deletes a habit by id after user confirmation.
   * @param {number} id
   */
  function deleteHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    if (!confirm(`Delete "${habit.name}"? This action cannot be undone.`)) return;

    // Animate out before removing from DOM
    const card = habitList.querySelector(`.habit-card[data-id="${id}"]`);
    if (card) {
      card.style.transition = 'all 0.3s ease';
      card.style.transform = 'scale(0.95)';
      card.style.opacity = '0';
      setTimeout(() => {
        habits = habits.filter(h => h.id !== id);
        saveToLocalStorage();
        renderHabits();
      }, 300);
    } else {
      habits = habits.filter(h => h.id !== id);
      saveToLocalStorage();
      renderHabits();
    }
  }

  /**
   * Toggles the completion status of a habit for today.
   * Recalculates the streak after every toggle.
   * @param {number} id
   */
  function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = getTodayString();

    if (habit.completedDates.includes(today)) {
      // Un-complete for today
      habit.completedDates = habit.completedDates.filter(d => d !== today);
    } else {
      // Mark complete for today
      habit.completedDates.push(today);
    }

    // Recalculate streak
    habit.streak = calculateStreak(habit);

    saveToLocalStorage();
    renderHabits();
  }

  // ─── Theme Toggle ─────────────────────────────────────────────────────────────

  /**
   * Applies a theme ('dark-theme' or 'light-theme') and persists to localStorage.
   * @param {'dark-theme'|'light-theme'} theme
   */
  function applyTheme(theme) {
    body.className = theme;
    if (theme === 'dark-theme') {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const current = body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
    applyTheme(current === 'dark-theme' ? 'light-theme' : 'dark-theme');
  }

  // ─── Event Listeners ──────────────────────────────────────────────────────────

  // Form submit (clicking "Add Habit" button)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addHabit();
  });

  // Enter key in input field
  habitInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHabit();
    }
  });

  // Dark / Light mode toggle
  themeToggle.addEventListener('click', toggleTheme);

  // ─── Initialisation ───────────────────────────────────────────────────────────

  /**
   * Bootstrap the app on page load.
   */
  function init() {
    // Restore saved theme or default to dark
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark-theme';
    applyTheme(savedTheme);

    // Load & render habits
    loadFromLocalStorage();
    renderHabits();
  }

  init();

})();
