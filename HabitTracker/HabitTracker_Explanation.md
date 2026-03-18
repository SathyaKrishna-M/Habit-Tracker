# Habit Tracker Project — Complete Beginner's Explanation
### A Textbook-Style Guide for Students with Zero Programming Experience

---

## TABLE OF CONTENTS

1. What is This Project?
2. How the App Works (Big Picture)
3. File Structure — What Each File Does
4. HTML Explained (index.html)
5. CSS Explained (styles.css)
6. JavaScript Core Concepts (Before We Begin)
7. storage.js — Saving and Loading Data
8. auth.js — The Login System
9. ui.js — Shared Tools Used Everywhere
10. script.js — The Dashboard (Main Page Logic)
11. add.js — Adding Habits
12. stats.js — Analytics Page
13. calendar.js — The Heatmap Calendar
14. settings.js — Theme and Reset
15. DOM Manipulation (How the Screen Updates)
16. Event Handling (How Clicks and Keypresses Work)
17. localStorage Explained Simply
18. Data Structures — Arrays and Objects
19. The Full Flow of the Program
20. Beginner-Friendly Examples
21. Common Mistakes and How to Fix Them
22. Summary — Key Concepts
23. Viva Questions and Answers
24. Quick Revision Notes

---

---

# SECTION 1: WHAT IS THIS PROJECT?

## The Problem It Solves

Humans often forget to do daily tasks — drink water, exercise, read, study. A **Habit Tracker** helps you:
- Write down habits you want to build
- Check them off every day
- See your progress over time
- Stay motivated with streaks and rewards

## What This App Does

This is a **web application** — meaning it runs inside a web browser (like Chrome or Firefox). It does NOT need an internet connection after loading. It stores your data directly in your browser using a feature called **localStorage**.

**Features:**
- Login page (simple username/password)
- Dashboard showing today's habits
- Add habits with categories, goals, and reminders
- Streak tracking (increases every day you complete a habit)
- XP points and level system (like a video game)
- Badges you can earn
- Analytics page with a weekly chart
- A GitHub-style heatmap calendar
- Dark and light theme toggle

---

---

# SECTION 2: HOW THE APP WORKS (BIG PICTURE)

**Think of it like this:**

```
User opens browser
      ↓
login.html loads → User types username/password
      ↓
sessionStorage saves the user's name
      ↓
index.html (Dashboard) loads
      ↓
script.js reads habits from localStorage
      ↓
renderAll() draws the habits on screen
      ↓
User ticks a habit → toggleHabit() runs
      ↓
Data is updated in localStorage
      ↓
Screen refreshes to show new progress
```

Every time you check a habit, the JavaScript updates the data and rebuilds what you see on screen — all without reloading the page.

---

---

# SECTION 3: FILE STRUCTURE — WHAT EACH FILE DOES

```
HabitTracker/
├── login.html       ← The login page you see first
├── index.html       ← Main dashboard (home page)
├── add.html         ← Page to add/manage habits
├── stats.html       ← Analytics and charts
├── calendar.html    ← Heatmap calendar showing all completions
├── settings.html    ← Theme toggle, reset data, logout
│
├── css/
│   └── styles.css   ← ALL the visual design (colors, layout, fonts)
│
└── js/
    ├── storage.js   ← Handles saving/reading all data
    ├── ui.js        ← Shared tools: navbar, toasts, theme, XP
    ├── auth.js      ← Login page logic
    ├── script.js    ← Dashboard page logic
    ├── add.js       ← Add habit form logic
    ├── stats.js     ← Analytics calculations
    ├── calendar.js  ← Calendar heatmap logic
    └── settings.js  ← Settings page logic
```

### Why Separate Files?

Imagine writing a book. You wouldn't put the index, chapters, and appendix all on one page. Separate files keep code organized, easier to read, and easier to fix.

| File Type | Job |
|---|---|
| [.html](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/add.html) | Structure — the skeleton of each page |
| [.css](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/styles.css) | Appearance — colors, spacing, fonts |
| [.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js) | Behaviour — what happens when you interact |

---

---

# SECTION 4: HTML EXPLAINED (index.html)

HTML stands for **HyperText Markup Language**. It is NOT a programming language — it is a way to describe the structure of a webpage using **tags**.

A **tag** looks like this: `<tagname>content</tagname>`

Every tag has an opening `<tag>` and a closing `</tag>`.

## 4.1 The Basic Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  ...
</head>
<body>
  ...
</body>
</html>
```

- `<!DOCTYPE html>` — Tells the browser: "This is an HTML5 document."
- `<html lang="en">` — The root element. `lang="en"` tells assistive tools the page is in English.
- `<head>` — Contains settings and links. NOTHING in here is visible on screen.
- `<body>` — Everything visible on screen goes here.

## 4.2 Inside the `<head>`

```html
<meta charset="UTF-8">
```
- `<meta>` — Provides invisible information about the page.
- `charset="UTF-8"` — Tells the browser which character system to use. UTF-8 supports emojis and special characters.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
- Makes the page work correctly on mobile phones. Without this, a phone would show a shrunken desktop version.

```html
<title>Dashboard — HabitTracker</title>
```
- Sets the text shown on the browser tab.

```html
<link rel="stylesheet" href="css/styles.css">
```
- Links the CSS file to this HTML file. `href` is the path (location) to the file.

## 4.3 The `<body>` — What You See

```html
<body data-theme="dark">
```
- `data-theme="dark"` is a **custom data attribute**. CSS uses it to decide which color scheme to apply.

```html
<div class="app-shell">
```
- `<div>` is a generic container. It groups things together.
- `class="app-shell"` — the name we give it so CSS can style it.

## 4.4 The Navigation Bar

```html
<nav id="navbar"></nav>
```
- `<nav>` is a semantic tag specifically for navigation links.
- `id="navbar"` — A unique ID. JavaScript uses this to INSERT the navbar content dynamically.
- The navbar is **empty in the HTML**. JavaScript fills it in later (see ui.js).

## 4.5 The Main Content Area

```html
<main class="main-content">
```
- `<main>` is a semantic tag for the main content of the page.

```html
<div class="page-header">
  <h1 id="greeting">Good morning! 👋</h1>
  <p id="dateLabel">Loading...</p>
</div>
```
- `<h1>` is a heading (the biggest one). There should only be one per page.
- `id="greeting"` — JavaScript will update this text based on the time of day and username.
- `<p>` is a paragraph tag. `id="dateLabel"` is updated by JavaScript to show today's date.

## 4.6 The XP Card

```html
<div class="card xp-card" id="xpCard">
  <div class="level-badge" id="levelBadge">🌱</div>
  <div class="xp-info">
    <div class="xp-level" id="xpLevel">Beginner</div>
    <div class="xp-label" id="xpLabel">0 / 100 XP to next level</div>
    <div class="xp-bar-wrap">
      <div class="xp-bar" id="xpBar" style="width:0%"></div>
    </div>
  </div>
</div>
```
- Multiple nested `<div>` elements build the layout.
- `class="card"` applies the card style from CSS.
- Elements with `id=` are all JavaScript targets — JS will update their text and width.
- `style="width:0%"` starts the XP progress bar at 0. JavaScript changes this to e.g. `width:40%`.

## 4.7 The Progress Bar

```html
<div class="progress-container">
  <div class="progress-fill" id="progressBar" style="width:0%"></div>
</div>
```
- Outer div is the full grey track.
- Inner div (`progressBar`) is the coloured fill. JavaScript changes its `width` to reflect completion.

## 4.8 The Habit List

```html
<div id="habitList" class="habit-list"></div>
<div id="emptyState" class="empty-state" style="display:none;">
  ...
</div>
```
- `id="habitList"` — JavaScript inserts habit cards here.
- `id="emptyState"` — Only shown when there are no habits (`display:none` hides it by default).

## 4.9 Script Tags at the Bottom

```html
<script src="js/storage.js"></script>
<script src="js/ui.js"></script>
<script src="js/script.js"></script>
```
- `<script>` loads JavaScript files.
- They are placed at the **bottom** of the body. This ensures the HTML elements exist before JavaScript tries to interact with them.
- Order matters: [storage.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/storage.js) must load before [ui.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js), and [ui.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js) before [script.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/script.js).

---

---

# SECTION 5: CSS EXPLAINED (css/styles.css)

CSS stands for **Cascading Style Sheets**. It controls how HTML elements look.

## 5.1 CSS Variables (Design Tokens)

```css
:root {
  --bg:      #0b0f1a;
  --card:    #1a2235;
  --primary: #6c63ff;
  --text:    #e8eaf6;
}
```

- `:root` means "apply to the entire document."
- `--variable-name: value` creates a **CSS custom property** (variable).
- You use a variable like this: `color: var(--text);`
- **Why?** Change ONE variable and the entire theme updates everywhere.

## 5.2 Dark and Light Themes

```css
:root, [data-theme="dark"] { --bg: #0b0f1a; }
[data-theme="light"]       { --bg: #f0f4ff; }
```

- When `<body data-theme="dark">`, the dark variables apply.
- When JavaScript changes it to `data-theme="light"`, light variables take over.

## 5.3 Flexbox Layout

Flexbox is used to arrange elements in rows or columns.

```css
.app-shell {
  display: flex;
}
```

- `display: flex` makes `.app-shell` a flex **container**.
- Its children (the navbar and main content) become **flex items** and sit side by side.

```css
#navbar {
  width: 220px;
  position: fixed;
}
.main-content {
  margin-left: 220px;
}
```

- The navbar is fixed on the left and is always 220px wide.
- The main content is pushed 220px to the right so they don't overlap.

## 5.4 Hover Effects and Transitions

```css
.habit-card {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.habit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.3);
}
```

- `transition: all 0.2s` — Any change takes 0.2 seconds instead of happening instantly.
- `cubic-bezier(...)` — Controls how smooth the animation feels (accelerate and decelerate).
- `.habit-card:hover` — These styles apply only when the mouse hovers over the card.
- `transform: translateY(-2px)` — Moves the card 2 pixels up, creating a "lift" effect.

## 5.5 Animations (Keyframes)

```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.habit-card {
  animation: slideIn 0.3s ease-out;
}
```

- `@keyframes` defines a named animation.
- `from` = start state, [to](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js#106-110) = end state.
- The card starts invisible and 10px down, then fades in and slides up over 0.3 seconds.

## 5.6 Media Queries (Responsive Design)

```css
@media (max-width: 768px) {
  #navbar {
    width: 100%;
    height: auto;
    bottom: 0;
    flex-direction: row;
  }
  .main-content {
    margin-left: 0;
    padding-bottom: 5rem;
  }
}
```

- `@media (max-width: 768px)` — These rules only apply if the screen is 768px wide or smaller (phones/tablets).
- The sidebar navbar moves to the **bottom** of the screen on mobile.
- The main content no longer has a left margin.

---

---

# SECTION 6: JAVASCRIPT CORE CONCEPTS (BEFORE WE BEGIN)

Before explaining the code, you need to understand these fundamentals.

## 6.1 What is a Variable?

A variable is a **named box** that stores a value.

```javascript
let name = "Alice";     // 'name' stores the text "Alice"
const age = 20;         // 'age' stores the number 20
```

- [let](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/script.js#150-170) — Can be changed later.
- `const` — Cannot be changed after it is set.
- `var` — Old style. Avoid using it.

## 6.2 What is a Function?

A function is a **reusable block of code** with a name.

```javascript
function greet(name) {
  return "Hello, " + name;
}

greet("Alice");  // Returns: "Hello, Alice"
```

- `name` is the **parameter** (input).
- `return` sends a value back to whoever called the function.

## 6.3 Arrow Functions

A shorter way to write functions:

```javascript
const add = (a, b) => a + b;
add(3, 4);  // Returns: 7
```

## 6.4 Arrays

An array is a **list** of items.

```javascript
let fruits = ["apple", "banana", "mango"];
fruits[0];  // "apple"  ← index starts at 0
fruits.length;  // 3
```

Common array methods used in this project:

| Method | What it does |
|---|---|
| `.push(x)` | Adds `x` to the end |
| `.filter(fn)` | Returns items where `fn` returns true |
| `.map(fn)` | Returns a new array by transforming each item |
| `.find(fn)` | Returns the first item where `fn` is true |
| `.forEach(fn)` | Runs `fn` for each item |
| `.includes(x)` | Returns true if `x` is in the array |
| `.reduce(fn, start)` | Reduces array to a single value |

## 6.5 Objects

An object stores **key-value pairs** (like a form with labelled fields).

```javascript
let habit = {
  id: 1,
  name: "Drink Water",
  streak: 5,
  completedDates: ["2026-03-15", "2026-03-16"]
};

habit.name;    // "Drink Water"
habit.streak;  // 5
```

## 6.6 Template Literals (Backtick Strings)

```javascript
let name = "Alice";
let msg = `Hello, ${name}!`;  // "Hello, Alice!"
```

Use backticks (`` ` ``) and `${}` to insert variables into a string.

## 6.7 if / else

```javascript
if (hour < 12) {
  greeting = "Good morning";
} else if (hour < 17) {
  greeting = "Good afternoon";
} else {
  greeting = "Good evening";
}
```

The short form (ternary operator):
```javascript
let greeting = hour < 12 ? "Good morning" : "Good evening";
```
Read as: "If hour < 12, use 'Good morning', else use 'Good evening'."

## 6.8 IIFE (Immediately Invoked Function Expression)

All JS files are wrapped in:
```javascript
(function () {
  'use strict';
  // ... all code here ...
})();
```

- This runs **immediately** when the file loads.
- `'use strict'` — Makes JavaScript enforce stricter rules to catch bugs.
- Everything inside stays private — no accidental name conflicts with other files.

---

---

# SECTION 7: storage.js — SAVING AND LOADING DATA

This file is loaded first. It is the **data layer** — the only place that talks to localStorage.

## The Keys (Addresses in localStorage)

```javascript
const HABITS_KEY  = 'ht_habits';
const USER_KEY    = 'ht_user';
const SESSION_KEY = 'ht_session';
```

These are the names used to store data in localStorage. Think of them as folder names.

## getHabits()

```javascript
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
```

**Step by step:**
1. `localStorage.getItem('ht_habits')` — Gets the stored data as a text string.
2. `if (!raw) return []` — If nothing is stored, return an empty list.
3. `JSON.parse(raw)` — Converts the text string back into a JavaScript array of objects.
4. `.filter(h => h && ...)` — Removes any corrupted/invalid items.
5. `try...catch` — If anything goes wrong (e.g., data is corrupt), return `[]` instead of crashing.

## saveHabits(habits)

```javascript
function saveHabits(habits) {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('[Storage] Failed to save habits:', e);
  }
}
```

- `JSON.stringify(habits)` — Converts the JavaScript array into a text string so it can be stored.
- `localStorage.setItem(key, value)` — Stores the string.

## getUser() and saveUser()

Same pattern — reads/writes the player's XP, level, badges, and theme preference.

## getSession() and saveSession()

```javascript
function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
```

- Uses `sessionStorage` instead of `localStorage`.
- **Difference:** `sessionStorage` is cleared when you close the browser tab. `localStorage` persists forever.
- This simulates a login session.

---

---

# SECTION 8: auth.js — THE LOGIN SYSTEM

This file handles the login page.

## validate(username, password)

```javascript
function validate(username, password) {
  const users = getCredentials();
  return users.some(u => u.username === username.trim() && u.password === password);
}
```

- [getCredentials()](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/auth.js#11-19) returns the list of allowed users (default: demo/demo, admin/admin123).
- `.some(...)` returns `true` if **at least one** user matches both the username and password.
- `username.trim()` removes any accidental spaces the user typed.

## The Submit Event

```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();
  ...
  if (validate(username, password)) {
    HT.Storage.saveSession({ username });
    setTimeout(() => { window.location.href = 'index.html'; }, 600);
  } else {
    showError('Invalid username or password.');
  }
});
```

- `e.preventDefault()` — Stops the form from doing its default action (reloading the page).
- If login is valid: save the session and redirect to the dashboard after 600ms.
- If invalid: show an error message.

## requireAuth() in ui.js

```javascript
function requireAuth() {
  if (!HT.Storage.getSession()) {
    window.location.href = 'login.html';
  }
}
```

Every protected page calls this at the top. If no session exists, it instantly redirects to login.html.

---

---

# SECTION 9: ui.js — SHARED TOOLS USED EVERYWHERE

This is the "toolkit" file. It provides functions every page needs.

## buildNavbar(activePage)

```javascript
function buildNavbar(activePage) {
  const nav = document.getElementById('navbar');
  nav.innerHTML = `
    <div class="nav-brand">...</div>
    <ul class="nav-links">
      ${links.map(l => `<li><a href="${l.href}" class="${l.page === activePage ? 'active' : ''}">${l.label}</a></li>`).join('')}
    </ul>`;
}
```

- Gets the empty `<nav id="navbar">` element.
- Sets its `innerHTML` to building a full navigation menu using a template literal.
- `.map()` turns the links array into `<li>` elements. The active page gets the `active` class for highlighting.
- `.join('')` merges all the pieces into one string with no separator.

## showToast(message, type, duration)

```javascript
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => { toast.classList.remove('visible'); }, duration);
}
```

- Creates a new `<div>` element in JavaScript (without touching the HTML file).
- Adds it to the toast container on screen.
- Uses `requestAnimationFrame` to trigger the CSS animation on the next render cycle.
- After `duration` milliseconds, removes the visible class (triggers fade-out).

## today() and daysAgo(n)

```javascript
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
```

- `new Date()` creates a Date object for right now.
- Formats it as "YYYY-MM-DD" (e.g., "2026-03-18").
- [pad()](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js#123-124) ensures month and day are always 2 digits (e.g., "03" not "3").

## calcStreak(completedDates)

```javascript
function calcStreak(completedDates) {
  const sorted = [...completedDates].sort((a, b) => b.localeCompare(a));
  const t = today(), y = yesterday();
  if (sorted[0] !== t && sorted[0] !== y) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    ...
    if (sorted[i] === expected) streak++;
    else break;
  }
  return streak;
}
```

**Step by step:**
1. Sort dates newest first.
2. If the most recent completion was not today or yesterday, the streak is broken → return 0.
3. Start counting from 1. For each date, check if the previous date was exactly one day before.
4. If yes, add 1 to streak. If not, stop counting (break).

## xpToLevel(xp)

```javascript
const LEVELS = [
  { name: 'Beginner', minXP: 0 },
  { name: 'Intermediate', minXP: 300 },
  ...
];
function xpToLevel(xp) {
  // Find the highest level whose minXP is <= user's XP
  let level = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) { level = LEVELS[i]; break; }
  }
  ...
  return { name, pct }; // pct = progress % to next level
}
```

## awardXP(habits, amount)

```javascript
function awardXP(habits, amount = 10) {
  const user = HT.Storage.getUser();
  user.xp += amount;
  user.totalCompleted += 1;
  // Check badge conditions
  const checks = [
    { id: 'first1',  cond: user.totalCompleted >= 1 },
    { id: 'streak7', cond: maxStreak >= 7 },
    ...
  ];
  checks.forEach(c => {
    if (c.cond && !earned.has(c.id)) { earned.add(c.id); }
  });
  HT.Storage.saveUser(user);
}
```

- Adds XP to the user.
- Checks all badge conditions. If one is newly met and the badge isn't earned yet, it is awarded.
- Shows a toast notification for any newly earned badge.

---

---

# SECTION 10: script.js — THE DASHBOARD

This is the main page logic. It runs when [index.html](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/index.html) is opened.

## The IIFE and Initial Setup

```javascript
(function () {
  'use strict';
  HT.UI.requireAuth();   // Redirect to login if not logged in
  HT.UI.loadTheme();     // Apply dark/light theme
  HT.UI.buildNavbar('index');  // Build and inject the navbar
  ...
})();
```

These three lines always run first on every protected page.

## setGreeting()

```javascript
function setGreeting() {
  const hour  = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent = `${greet}, ${name}! 👋`;
}
```

- Gets the current hour (0-23).
- Uses nested ternary operators to pick the right greeting.
- Updates the `<h1 id="greeting">` with the personalised message.

## renderProgress(habits)

```javascript
function renderProgress(habits) {
  const today = HT.UI.today();
  const total = habits.length;
  const done  = habits.filter(h => h.completedDates.includes(today)).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById('progressBar').style.width  = `${pct}%`;
  document.getElementById('progressText').textContent = `${pct}% completed`;
}
```

**Step by step:**
1. Get today's date as "YYYY-MM-DD".
2. Count total habits.
3. `habits.filter(...)` — Keep only habits that have today's date in their completedDates array.
4. Calculate percentage: [(done / total) * 100](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js#123-124), rounded to a whole number.
5. Set the progress bar's width and update the text.

## renderFilters(habits)

```javascript
const cats = ['All', ...new Set(habits.map(h => h.category || 'Other'))];
```

- `habits.map(h => h.category)` — Creates a new array of just the categories.
- `new Set(...)` — Removes duplicates (a Set only holds unique values).
- `['All', ...]` — Spreads the unique categories into a new array with 'All' at the front.

## renderHabits(habits)

```javascript
filtered.forEach(habit => {
  const card = document.createElement('div');
  card.className = 'habit-card';
  card.innerHTML = `...`;
  card.querySelector('.habit-checkbox').addEventListener('change', () => toggleHabit(habit.id));
  listEl.appendChild(card);
});
```

**Step by step:**
1. Loop through each habit.
2. Create a new `<div>` element in JavaScript.
3. Fill it with HTML using a template literal.
4. Attach an event listener for the checkbox.
5. Add the card to the page.

## toggleHabit(id)

```javascript
function toggleHabit(id) {
  let habits  = HT.Storage.getHabits();
  const habit = habits.find(h => h.id === id);

  if (habit.completedDates.includes(today)) {
    habit.completedDates = habit.completedDates.filter(d => d !== today);
  } else {
    habit.completedDates.push(today);
    habit.streak     = HT.UI.calcStreak(habit.completedDates);
    habit.bestStreak = Math.max(habit.bestStreak || 0, habit.streak);
    HT.UI.awardXP(habits, 10);
  }

  HT.Storage.saveHabits(habits);
  renderAll();
}
```

**What this does:**
- Finds the habit in the array using `.find()`.
- If already completed today → remove today's date from the array (undo).
- If not completed → add today's date, recalculate streak, update best streak, award 10 XP.
- Save the updated array back to localStorage.
- Call [renderAll()](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/script.js#173-180) to refresh the screen.

## deleteHabit(id)

```javascript
function deleteHabit(id) {
  if (!confirm(`Delete "${habit.name}"?`)) return;
  card.style.transition = 'all 0.3s ease';
  card.style.opacity    = '0';
  setTimeout(() => {
    HT.Storage.saveHabits(habits.filter(h => h.id !== id));
    renderAll();
  }, 280);
}
```

- `confirm(...)` shows a browser popup. If user clicks Cancel, `return` stops the function.
- Fades the card out visually over 0.3 seconds.
- After 280ms (just before animation ends), removes from data and refreshes the screen.

## renderAll()

```javascript
function renderAll() {
  const habits = HT.Storage.getHabits();
  renderXP();
  renderProgress(habits);
  renderFilters(habits);
  renderHabits(habits);
}
```

The master function. Whenever data changes, call this to rebuild everything on screen.

---

---

# SECTION 11: add.js — ADDING HABITS

The key part is the form submission:

```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();

  if (!name) { /* show error */ return; }

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
});
```

- `Date.now()` generates a unique number based on the current timestamp (milliseconds since 1970). Used as the unique ID.
- `.some(...)` checks for duplicates — case-insensitive.
- The new habit object starts with `streak: 0` and an empty `completedDates` array.

---

---

# SECTION 12: stats.js — ANALYTICS PAGE

## renderWeekChart(habits)

```javascript
const weekData = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(sunday);
  d.setDate(d.getDate() + i);
  const done = habits.filter(h => h.completedDates.includes(dateStr)).length;
  return { day: days[i], pct: pct(done, habits.length) };
});
```

- Creates 7 items (one per day of the week), starting from Sunday.
- For each day, counts how many habits were completed.
- Calculates a percentage.
- The result is an array of objects like: `[{day:'Sun', pct:80}, {day:'Mon', pct:60}, ...]`

## renderMonthly(habits)

```javascript
const possible = habits.length * days;
const actual   = habits.reduce((sum, h) =>
  sum + monthDates.filter(d => h.completedDates.includes(d)).length, 0);
const rate = pct(actual, possible);
```

- `possible` = total checkboxes in the month (habits × number of days).
- `.reduce()` adds up how many actual completions happened this month across all habits.
- Divided to get a percentage.

---

---

# SECTION 13: calendar.js — THE HEATMAP

## How the Grid is Built

```javascript
function buildDateRange() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);  // Go back 364 days
  while (start.getDay() !== 0) start.setDate(start.getDate() - 1); // Rewind to Sunday
  ...
}
```

This creates an array of every date for the last 52 weeks (364 days), starting on a Sunday.

## The Colour Levels

```javascript
const ratio = map[d] / maxHabits;
levelMap[d] = ratio <= 0.25 ? 1 : ratio <= 0.5 ? 2 : ratio <= 0.75 ? 3 : 4;
```

- Level 0 = no completions (grey)
- Level 1 = 1–25% of habits done (light green)
- Level 2 = 26–50% (medium green)
- Level 3 = 51–75% (dark green)
- Level 4 = 76–100% (darkest green)

CSS then colours each cell based on `data-level`:
```css
.heatmap-cell[data-level="4"] { background: rgba(6,214,160,0.9); }
```

---

---

# SECTION 14: settings.js — THEME AND RESET

## Theme Toggle

```javascript
themeToggle.addEventListener('change', () => {
  const newTheme = themeToggle.checked ? 'dark' : 'light';
  const u = HT.Storage.getUser();
  u.theme = newTheme;
  HT.Storage.saveUser(u);
  HT.UI.applyTheme(newTheme);
});
```

- When the toggle changes, update the user's theme preference in localStorage.
- [applyTheme(newTheme)](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js#14-17) sets `document.body.dataset.theme = newTheme`.
- This triggers the CSS to switch all colour variables instantly.

---

---

# SECTION 15: DOM MANIPULATION

## What is the DOM?

DOM stands for **Document Object Model**. When a browser loads HTML, it creates a tree of objects in memory — one object for each element. JavaScript can walk this tree and make changes.

```
<body>
  └── <div class="app-shell">
       ├── <nav id="navbar">
       └── <main class="main-content">
            ├── <h1 id="greeting">
            └── <div id="habitList">
```

## Selecting Elements

```javascript
document.getElementById('greeting')     // Find by id
document.querySelector('.habit-card')   // Find first matching CSS selector
document.querySelectorAll('.habit-card') // Find ALL matching
```

## Modifying Elements

```javascript
el.textContent = "New text";         // Change text
el.innerHTML   = "<b>Bold</b>";      // Change HTML inside
el.style.width = "60%";              // Change inline style
el.classList.add('completed');        // Add a CSS class
el.classList.remove('completed');     // Remove a CSS class
```

## Creating Elements

```javascript
const card = document.createElement('div');
card.className = 'habit-card';
card.innerHTML = `<p>Hello</p>`;
document.getElementById('habitList').appendChild(card);
```

---

---

# SECTION 16: EVENT HANDLING

## What is an Event?

An event is something that happens in the browser:
- User clicks a button → `click` event
- User types in a field → `input` or `keydown` event
- Form is submitted → `submit` event
- Checkbox state changes → `change` event
- Page finishes loading → `DOMContentLoaded` event

## Event Listeners

```javascript
button.addEventListener('click', function() {
  alert("Button clicked!");
});
```

- `addEventListener(eventType, handlerFunction)` — Registers a listener.
- Whenever the event fires, the handler function runs.
- Arrow function version: `button.addEventListener('click', () => { ... });`

## Preventing Default Behaviour

```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();  // Stop the page from reloading
  // Now handle the form ourselves
});
```

---

---

# SECTION 17: localStorage EXPLAINED SIMPLY

## What is localStorage?

Think of localStorage as a **tiny database built into every browser**. It can store text strings.

```javascript
localStorage.setItem('name', 'Alice');   // Save
localStorage.getItem('name');            // Get → "Alice"
localStorage.removeItem('name');         // Delete
localStorage.clear();                    // Delete everything
```

Data in localStorage **survives** closing the browser and even restarting the computer.

## Why JSON?

localStorage can only store **strings** (text). But we need to store complex objects and arrays.

**Solution: JSON**

- `JSON.stringify(array)` → converts to a string: `'[{"id":1,"name":"Drink Water"}]'`
- `JSON.parse(string)` → converts back to a real JavaScript array.

```javascript
const habits = [{ id: 1, name: "Drink Water" }];
localStorage.setItem('habits', JSON.stringify(habits));

const loaded = JSON.parse(localStorage.getItem('habits'));
loaded[0].name; // "Drink Water"
```

## sessionStorage vs localStorage

| Feature | localStorage | sessionStorage |
|---|---|---|
| Where data lives | Browser permanently | Current browser tab only |
| Cleared when? | Manually by user or code | Tab is closed |
| Used for | Habits, user profile, theme | Login session |

---

---

# SECTION 18: DATA STRUCTURES

## How a Habit is Stored

Every habit is an **object**:

```javascript
{
  id: 1742236800000,          // Unique number (timestamp)
  name: "Drink Water",        // What the habit is called
  category: "Health",         // One of: Health, Study, Fitness, Money, Other
  time: "09:00",              // Optional reminder time
  goal: "8 glasses",          // Optional goal description
  streak: 5,                  // Current consecutive days
  bestStreak: 10,             // All-time best streak
  completedDates: [           // Array of dates completed
    "2026-03-14",
    "2026-03-15",
    "2026-03-16"
  ],
  createdAt: "2026-03-10"     // When it was created
}
```

All habits together form an **array of objects**:

```javascript
[
  { id: 1, name: "Drink Water", ... },
  { id: 2, name: "Read Book", ... },
  { id: 3, name: "Morning Run", ... }
]
```

This entire array is converted to a string and stored in localStorage as one entry.

## The User Profile Object

```javascript
{
  xp: 120,
  level: "Apprentice",
  badges: ["first1", "streak7"],
  totalCompleted: 12,
  theme: "dark"
}
```

---

---

# SECTION 19: THE FULL FLOW OF THE PROGRAM

## First Ever Open

```
1. login.html loads
2. auth.js checks sessionStorage → no session found
3. User types "demo" / "demo" → form submitted
4. validate() confirms the credentials match
5. saveSession({ username: 'demo' }) → saves to sessionStorage
6. Redirected to index.html after 600ms
```

## Dashboard Load

```
1. index.html loads in the browser
2. storage.js loads → defines all storage functions globally
3. ui.js loads → defines navbar, theme, toast, etc.
4. script.js loads and the IIFE runs immediately
5. requireAuth() → checks sessionStorage → session found → continue
6. loadTheme() → reads user.theme from localStorage → sets body data-theme
7. buildNavbar('index') → injects the full navbar into <nav id="navbar">
8. setGreeting() → reads hour and username → updates <h1 id="greeting">
9. renderAll() → reads habits from localStorage → draws everything
10. dailyReminder() → if no habits done today → shows warning toast
```

## User Ticks a Habit

```
1. User clicks checkbox
2. 'change' event fires on the checkbox
3. toggleHabit(id) runs
4. getHabits() reads current habits from localStorage
5. .find(h => h.id === id) → find the matching habit
6. today's date is NOT in completedDates → push today's date
7. calcStreak() → count consecutive days → update habit.streak
8. awardXP() → add 10 XP, check badges, save user
9. saveHabits() → write updated array to localStorage
10. renderAll() → re-read from localStorage → redraw everything on screen
```

---

---

# SECTION 20: BEGINNER-FRIENDLY EXAMPLES

## Arrays

```javascript
let habits = ["Drink Water", "Exercise", "Read"];

// Add a new habit
habits.push("Meditate");
// habits is now: ["Drink Water", "Exercise", "Read", "Meditate"]

// Remove "Exercise"
habits = habits.filter(h => h !== "Exercise");
// habits is now: ["Drink Water", "Read", "Meditate"]

// Check if an item exists
habits.includes("Read");  // true
```

## Objects

```javascript
let habit = { name: "Read", streak: 3 };

// Read a property
habit.name;   // "Read"

// Update a property
habit.streak = 4;

// Add a new property
habit.category = "Study";
```

## Filtering an Array of Objects

```javascript
let habits = [
  { name: "Drink Water", category: "Health" },
  { name: "Read Book",   category: "Study" },
  { name: "Exercise",    category: "Health" },
];

let healthHabits = habits.filter(h => h.category === "Health");
// [{ name: "Drink Water" }, { name: "Exercise" }]
```

---

---

# SECTION 21: COMMON MISTAKES AND FIXES

| Mistake | Example | Fix |
|---|---|---|
| Accessing element before it loads | `document.getElementById('x')` in `<head>` | Move `<script>` to the bottom of `<body>` |
| Forgetting JSON.parse | `localStorage.getItem('habits')[0]` (always undefined) | Always `JSON.parse(localStorage.getItem('habits'))` |
| Comparing wrong types | `"5" === 5` → false | Use `Number("5") === 5` or `"5" == 5` |
| Mutating array without saving | `habits.push(x)` without calling [saveHabits()](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/storage.js#22-29) | Always call [saveHabits(habits)](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/storage.js#22-29) after changes |
| Forgetting e.preventDefault() | Form reloads the page on submit | Add `e.preventDefault()` as the first line |
| Off-by-one in date month | `new Date().getMonth()` returns 0-11 | Always add 1: `d.getMonth() + 1` |

---

---

# SECTION 22: SUMMARY — KEY CONCEPTS LEARNED

| Concept | Where Used |
|---|---|
| HTML structure, tags, attributes | All [.html](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/add.html) files |
| CSS variables, Flexbox, Media queries | [css/styles.css](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/css/styles.css) |
| JavaScript functions, arrays, objects | All [.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js) files |
| DOM manipulation (select, create, update) | [script.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/script.js), [ui.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js) |
| Event handling (click, submit, change) | All [.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js) files |
| localStorage (save/load persistent data) | [storage.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/storage.js) |
| sessionStorage (temporary session) | [storage.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/storage.js), [auth.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/auth.js) |
| JSON stringify/parse | [storage.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/storage.js) |
| Array methods (.filter, .map, .find, .reduce) | [script.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/script.js), [stats.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/stats.js) |
| Date objects and formatting | [ui.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/ui.js), [stats.js](file:///d:/7KLH/S1-Even/FWD/EndSemProject/HabitTracker/js/stats.js) |

---

---

# SECTION 23: VIVA QUESTIONS AND ANSWERS

**Q1: What is the purpose of this project?**
A: It is a Habit Tracker web application that lets users add daily habits, mark them as complete, track streaks, and view analytics. Data is saved using localStorage.

**Q2: What are the three main technologies used?**
A: HTML (structure), CSS (appearance), and JavaScript (behaviour).

**Q3: What is localStorage?**
A: localStorage is a browser-provided key-value store that saves data permanently even after the browser closes. Data is stored as strings.

**Q4: Why do we use JSON.stringify() and JSON.parse()?**
A: localStorage can only store strings. JSON.stringify converts a JavaScript object/array to a string. JSON.parse converts it back to a usable object.

**Q5: What is sessionStorage? How is it different from localStorage?**
A: sessionStorage works the same way but is cleared when the browser tab is closed. We use it to store the login session.

**Q6: What is the DOM?**
A: The Document Object Model. When the browser loads HTML, it creates a tree of objects in memory. JavaScript can read and modify this tree to update what the user sees.

**Q7: What is an event listener?**
A: A function that is registered to "listen" for a specific event on an element. When the event occurs (e.g., a click), the function runs automatically.

**Q8: What does e.preventDefault() do?**
A: It prevents the browser's default action for an event. For a form's submit event, the default action is to reload the page. Calling preventDefault() stops this so JavaScript can handle the form itself.

**Q9: What is an IIFE and why is it used?**
A: An Immediately Invoked Function Expression. It runs as soon as it is defined, and everything inside is private to that function. It prevents variable names from clashing between different JavaScript files.

**Q10: How is a habit's streak calculated?**
A: The completedDates array is sorted newest first. Starting from today or yesterday, we count backwards. If each previous date is exactly one day before the next, we increment the streak. As soon as there is a gap, we stop.

**Q11: How does the progress bar work?**
A: We count how many habits have today's date in their completedDates array. We divide by total habits and multiply by 100 to get a percentage. We then set the CSS width of the inner bar element to that percentage.

**Q12: What is the difference between .map() and .filter()?**
A: `.map()` transforms each element and returns a new array of the same length. `.filter()` returns only the elements that pass a condition — the new array may be shorter.

**Q13: How does the theme toggle work?**
A: The user's theme preference is stored in localStorage. When toggled, JavaScript sets `document.body.dataset.theme = 'light'` (or 'dark'). CSS uses the `[data-theme="light"]` selector to apply different colour variables.

**Q14: How is a new habit's unique ID created?**
A: `Date.now()` returns the current number of milliseconds since January 1, 1970. Since no two habits are created at the exact same millisecond, this gives a unique ID.

**Q15: What is Flexbox?**
A: A CSS layout model that makes it easy to align and distribute space among elements in a container. `display: flex` on a container makes its children arrange horizontally or vertically.

---

---

# SECTION 24: QUICK REVISION NOTES

```
HTML
----
- <!DOCTYPE html> → HTML5 document
- <head> → settings (not visible)
- <body> → visible content
- <div> → generic container
- <nav>, <main>, <h1>, <p> → semantic elements
- id="x" → unique target for JavaScript
- class="x" → style target for CSS

CSS
---
- :root { --color: value; } → global variables
- var(--color) → use a variable
- display: flex → flexbox layout
- transition → smooth animated changes
- :hover → styles when mouse is over element
- @media (max-width: 768px) → mobile styles
- @keyframes → define animations

JavaScript
----------
- let / const → declare variables
- function name() {} → define function
- array.filter(fn) → keep items where fn=true
- array.map(fn) → transform every item
- array.find(fn) → find first match
- array.reduce(fn, start) → combine to single value
- document.getElementById('x') → select element
- el.textContent = "..." → change text
- el.innerHTML = "<b>...</b>" → change HTML
- el.style.width = "60%" → change style
- el.addEventListener('click', fn) → listen for events

localStorage
------------
- localStorage.setItem('key', JSON.stringify(data))
- JSON.parse(localStorage.getItem('key'))

sessionStorage
--------------
- Same API as localStorage
- Cleared when tab is closed
- Used for login sessions

Data Structure
--------------
habits = [
  {
    id: number,
    name: string,
    category: string,
    streak: number,
    bestStreak: number,
    completedDates: [string],
    createdAt: string
  }
]
```

---

*End of Document — HabitTracker Project Explanation*
*Generated for academic/exam preparation purposes.*
