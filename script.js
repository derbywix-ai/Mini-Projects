const COMPANIONS = [
  {
    id: "luna", name: "Luna", emoji: "🐱",
    personality: "Your slightly judgmental, occasionally helpful cat.",
    messages: {
      empty: "Nothing to do? Suspicious. But fine.",
      low: "You have things to do. I'm just reminding you.",
      mid: "Halfway. Don't get cocky.",
      high: "Almost there. I might purr. Maybe.",
      perfect: "You finished. I'm impressed. Don't let it go to your head."
    },
    greetings: {
      morning: "Morning. I've already judged your to-do list.",
      afternoon: "Afternoon. Have you actually started yet?",
      evening: "Evening. You're cutting it close, aren't you?",
      night: "It's late. Why are you still awake? I'm not judging. I am."
    },
    idle: [
      "Still here. Still watching.",
      "I could be napping. And yet.",
      "You know I can see you, right?",
      "That cursor isn't going to move itself."
    ]
  },
  {
    id: "kofi", name: "Kofi", emoji: "🐶",
    personality: "An over-caffeinated dog who believes in you loudly.",
    messages: {
      empty: "No tasks?! Walk time?! Walk time?!",
      low: "LET'S GO! We've got this! One task at a time!",
      mid: "You're doing great! I'm wagging. Can you tell?",
      high: "ALMOST DONE! I'm doing zoomies mentally!",
      perfect: "YOU DID IT! I'm so proud I could cry. I might."
    },
    greetings: {
      morning: "MORNING!! Best morning! Let's do ALL the things!",
      afternoon: "AFTERNOON!! You're doing amazing! Keep going!",
      evening: "EVENING!! We're in the home stretch! I BELIEVE!",
      night: "It's nighttime! Technically. But also — one more task?"
    },
    idle: [
      "Hey! Hey! You still there?",
      "I'm not distracted, YOU'RE distracted.",
      "Ball? No? Okay. Tasks. Tasks are fine.",
      "I believe in you! I said it again!"
    ]
  },
  {
    id: "sage", name: "Sage", emoji: "🦉",
    personality: "A wise owl who speaks in gentle riddles.",
    messages: {
      empty: "The empty list is also a lesson. Rest, perhaps.",
      low: "A journey of a thousand tasks begins with one click.",
      mid: "Balance is the art of doing and pausing. You are doing well.",
      high: "The end approaches. Breathe. You are almost there.",
      perfect: "The wise finish. And then, they rest. Well done."
    },
    greetings: {
      morning: "The morning asks: what will you begin?",
      afternoon: "The afternoon asks: what will you continue?",
      evening: "The evening asks: what will you finish?",
      night: "The night asks only one thing: will you rest?"
    },
    idle: [
      "The pause between tasks is also a task.",
      "A watched list never finishes. But here we are.",
      "Silence, too, is a form of progress.",
      "You are still here. That is already something."
    ]
  },
  {
    id: "mochi", name: "Mochi", emoji: "🐰",
    personality: "A soft, sleepy bunny who believes in gentle progress.",
    messages: {
      empty: "No tasks... nap? Or maybe just a tiny one?",
      low: "Slow and steady. You don't have to rush.",
      mid: "Look at you go. Softly. Gently. Nicely.",
      high: "Almost there. I'll be right here, napping supportively.",
      perfect: "All done. Now we rest. Together. It's the rule."
    },
    greetings: {
      morning: "Good morning. Take it slow. There's no rush here.",
      afternoon: "Afternoon already? You're doing fine. Really.",
      evening: "Evening. Softly, softly. You've got this.",
      night: "It's late. We can finish tomorrow. Or nap now."
    },
    idle: [
      "Mmm. Still here. Still soft.",
      "I'm not asleep. I'm resting my eyes.",
      "You can do one more. Or not. Both fine.",
      "The pillow says hi."
    ]
  },
  {
    id: "tank", name: "Tank", emoji: "🐢",
    personality: "A steady tortoise who never rushes and never quits.",
    messages: {
      empty: "A slow day is still a day. No shame in it.",
      low: "One step. Then another. That's the whole secret.",
      mid: "You're halfway. I knew you would get here.",
      high: "Almost done. Steady wins. You're steady.",
      perfect: "You finished. Slow is smooth. Smooth is done."
    },
    greetings: {
      morning: "Morning. Plenty of time. Always plenty.",
      afternoon: "Afternoon. You're on pace. That's the whole game.",
      evening: "Evening. We finish, we rest. That's the rhythm.",
      night: "Night. Slow down. You've done enough today."
    },
    idle: [
      "Take your time. I certainly am.",
      "A step is a step. No need to sprint.",
      "The list can wait. The list always waits.",
      "Steady. That's the whole trick."
    ]
  }
];

const KEY_REMINDERS = "habitual.reminders";
const KEY_COMPANION = "habitual.companion";
const KEY_STREAK    = "habitual.streak";

let reminders = [];
let currentCompanionId = "luna";
let streak = 1;
let idleTimer = null;
let idleActive = false;

// DOM
const $ = sel => document.querySelector(sel);
const addReminderButton = $(".add-reminder-button");
const quickAddButton    = $(".quick-add-button");
const reminderModal  = $("#reminderModal");
const cancelReminder = $("#cancelReminder");
const saveReminder   = $("#saveReminder");
const taskName     = $("#taskName");
const taskTime     = $("#taskTime");
const taskCategory = $("#taskCategory");
const nameError    = $("#nameError");
const timeError    = $("#timeError");
const remindersList = $("#remindersList");
const progressPercentage       = $("#progressPercentage");
const progressFill             = $("#progressFill");
const progressCount            = $("#progressCount");
const streakCount              = $("#streakCount");
const progressCompanionEmoji   = $("#progressCompanionEmoji");
const progressCompanionMessage = $("#progressCompanionMessage");
const companionName        = $("#companionName");
const companionShortName   = $("#companionShortName");
const companionPersonality = $("#companionPersonality");
const companionMessage     = $("#companionMessage");
const companionAvatar      = $("#companionAvatar");
const checkOnCompanion     = $("#checkOnCompanion");
const switchCompanion      = $("#switchCompanion");

// Storage
function loadState() {
  try {
    const r = localStorage.getItem(KEY_REMINDERS);
    if (r) reminders = JSON.parse(r);
    const c = localStorage.getItem(KEY_COMPANION);
    if (c && COMPANIONS.some(x => x.id === c)) currentCompanionId = c;
    const s = localStorage.getItem(KEY_STREAK);
    if (s) streak = parseInt(s, 10) || 1;
  } catch (e) { console.warn(e); }
}
function saveReminders() { try { localStorage.setItem(KEY_REMINDERS, JSON.stringify(reminders)); } catch (e) {} }
function saveCompanion() { try { localStorage.setItem(KEY_COMPANION, currentCompanionId); } catch (e) {} }
function saveStreak()    { try { localStorage.setItem(KEY_STREAK, String(streak)); } catch (e) {} }

// Helpers
function getCompanion() {
  return COMPANIONS.find(c => c.id === currentCompanionId) || COMPANIONS[0];
}
function formatTime(t) {
  const [h, m] = t.split(":");
  const d = new Date();
  d.setHours(h); d.setMinutes(m);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function makeId() { return "r_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7); }
function timeOfDay() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}
function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function progressMessageFor(c, total, percent) {
  const m = c.messages;
  if (total === 0) return m.empty;
  if (percent === 100) return m.perfect;
  if (percent >= 66) return m.high;
  if (percent >= 33) return m.mid;
  return m.low;
}
function greetingFor(c) { return c.greetings[timeOfDay()]; }

// Render
function renderReminders() {
  remindersList.innerHTML = "";
  if (reminders.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `<span class="empty-emoji">🌿</span><h3>No reminders yet</h3><p>Add one and your companion will keep an eye on it.</p>`;
    remindersList.appendChild(empty);
    return;
  }
  reminders.forEach(rem => {
    const card = document.createElement("div");
    card.className = "reminder-card" + (rem.completed ? " completed" : "");
    card.dataset.id = rem.id;
    card.innerHTML = `
      <div class="reminder-check">${rem.completed ? "✓" : ""}</div>
      <div class="reminder-info"><h3>${escapeHtml(rem.name)}</h3><p>${formatTime(rem.time)}</p></div>
      <span class="reminder-category ${rem.category}">${capitalize(rem.category)}</span>
      <button class="delete-reminder" aria-label="Delete reminder">×</button>
    `;
    remindersList.appendChild(card);
  });
}

function renderProgress() {
  const total = reminders.length;
  const completed = reminders.filter(r => r.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressPercentage.textContent = percent + "%";
  progressFill.style.width = percent + "%";
  progressCount.textContent = completed + " of " + total;
  streakCount.textContent = streak + " " + (streak === 1 ? "day" : "days");
  const c = getCompanion();
  progressCompanionEmoji.textContent = c.emoji;
  if (!idleActive) progressCompanionMessage.textContent = '"' + progressMessageFor(c, total, percent) + '"';
}

function renderCompanion() {
  const c = getCompanion();
  companionName.textContent = c.name + " " + c.emoji;
  companionShortName.textContent = c.name;
  companionPersonality.textContent = c.personality;
  companionAvatar.textContent = c.emoji;
  if (!idleActive) {
    const total = reminders.length;
    const completed = reminders.filter(r => r.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    companionMessage.textContent = '"' + progressMessageFor(c, total, percent) + '"';
  }
}

function renderAll() { renderReminders(); renderProgress(); renderCompanion(); }

// Reactions
function react(type) {
  companionAvatar.classList.remove("react-happy", "react-sad", "react-complete");
  void companionAvatar.offsetWidth;
  if (type === "happy") companionAvatar.classList.add("react-happy");
  if (type === "sad") companionAvatar.classList.add("react-sad");
  if (type === "complete") companionAvatar.classList.add("react-complete");
  setTimeout(() => companionAvatar.classList.remove("react-happy", "react-sad", "react-complete"), 1000);
}

// Idle musings
function showIdleMusing() {
  const c = getCompanion();
  if (!c.idle || c.idle.length === 0) return;
  const line = c.idle[Math.floor(Math.random() * c.idle.length)];
  idleActive = true;
  companionMessage.textContent = '"' + line + '"';
  progressCompanionMessage.textContent = '"' + line + '"';
  setTimeout(() => { idleActive = false; renderProgress(); renderCompanion(); }, 5000);
}
function startIdle() {
  if (idleTimer) clearInterval(idleTimer);
  idleTimer = setInterval(showIdleMusing, 20000);
}
function resetIdle() { startIdle(); }

// Modal
function openModal() {
  reminderModal.style.display = "flex";
  taskName.value = ""; taskTime.value = ""; taskCategory.value = "health";
  nameError.textContent = ""; timeError.textContent = "";
  setTimeout(() => taskName.focus(), 50);
}
function closeModal() { reminderModal.style.display = "none"; }

addReminderButton.addEventListener("click", openModal);
quickAddButton.addEventListener("click", openModal);
cancelReminder.addEventListener("click", closeModal);
reminderModal.addEventListener("click", e => { if (e.target === reminderModal) closeModal(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && reminderModal.style.display === "flex") closeModal();
});

// Save reminder
saveReminder.addEventListener("click", () => {
  const name = taskName.value.trim();
  const time = taskTime.value;
  const category = taskCategory.value;
  nameError.textContent = ""; timeError.textContent = "";
  let ok = true;
  if (name === "") { nameError.textContent = "Please give your task a name."; ok = false; }
  if (time === "") { timeError.textContent = "Please pick a time."; ok = false; }
  if (!ok) return;
  reminders.push({ id: makeId(), name, time, category, completed: false });
  saveReminders();
  resetIdle();
  react("happy");
  renderAll();
  closeModal();
});

// Check / delete
remindersList.addEventListener("click", e => {
  const card = e.target.closest(".reminder-card");
  if (!card) return;
  const id = card.dataset.id;
  const rem = reminders.find(r => r.id === id);
  if (!rem) return;
  if (e.target.classList.contains("delete-reminder")) {
    reminders = reminders.filter(r => r.id !== id);
    saveReminders();
    react("sad");
    resetIdle();
    renderAll();
    return;
  }
  if (e.target.classList.contains("reminder-check")) {
    rem.completed = !rem.completed;
    saveReminders();
    const allDone = reminders.length > 0 && reminders.every(r => r.completed);
    if (allDone) react("complete");
    else if (rem.completed) react("happy");
    resetIdle();
    renderAll();
  }
});

// Companion
switchCompanion.addEventListener("click", () => {
  const idx = COMPANIONS.findIndex(c => c.id === currentCompanionId);
  const next = (idx + 1) % COMPANIONS.length;
  currentCompanionId = COMPANIONS[next].id;
  saveCompanion();
  idleActive = false;
  react("happy");
  renderAll();
  resetIdle();
});

checkOnCompanion.addEventListener("click", () => {
  const c = getCompanion();
  const total = reminders.length;
  const percent = total === 0 ? 0 : Math.round((reminders.filter(r => r.completed).length / total) * 100);
  react("happy");
  if (total === 0 || percent === 0) companionMessage.textContent = '"' + greetingFor(c) + '"';
  else companionMessage.textContent = '"' + progressMessageFor(c, total, percent) + '"';
  resetIdle();
});

// Streak
function updateStreak() {
  const last = localStorage.getItem("habitual.lastVisit");
  const today = new Date().toDateString();
  if (last && last !== today) { streak += 1; saveStreak(); }
  localStorage.setItem("habitual.lastVisit", today);
}

// Init
function init() {
  loadState();
  updateStreak();
  if (reminders.length === 0 && !localStorage.getItem(KEY_REMINDERS)) {
    reminders = [
      { id: makeId(), name: "Drink Water", time: "10:00", category: "health", completed: true },
      { id: makeId(), name: "Study JavaScript", time: "14:00", category: "focus", completed: false },
      { id: makeId(), name: "Read for 30 minutes", time: "18:00", category: "personal", completed: false }
    ];
    saveReminders();
  }
  const c = getCompanion();
  companionMessage.textContent = '"' + greetingFor(c) + '"';
  progressCompanionMessage.textContent = '"' + greetingFor(c) + '"';
  renderAll();
  startIdle();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) resetIdle(); });
}

init();