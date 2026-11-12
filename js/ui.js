import { loadConfig, secondsPerGameHour, shownHours } from "./config.js";
import {
  PERKS,
  SKILL_TREES,
  advance,
  assign,
  breakCostSeconds,
  buyPerk,
  buySkill,
  createGame,
  money,
  nextSkillOffer,
  perkOffer,
  skillsOf,
  startGame,
  takeBreak,
  tick,
} from "./engine.js";

const SKILL_COLOR = {
  Strategy: "#6e2430",
  Social: "#b4532a",
  MOU: "#8a6232",
  AdWords: "#1f6b4a",
  Display: "#1d4e89",
  Sales: "#7a3e6d",
  "Web Dev": "#0f6e6e",
  Design: "#a33b45",
  Tech: "#3d4c7c",
  "FB Ads": "#254e8a",
  UI: "#b26b2c",
  Invoicing: "#3f6b52",
  Ops: "#5c5346",
};

/** Set a path to swap a Lottie token for an approved photo. */
const PORTRAITS = {
  coree: "",
  brandon: "",
  tomas: "",
  sean: "",
  kajal: "",
  jessica: "",
};

const LOOKS = {
  coree: `
    <rect width="64" height="64" rx="20" fill="#6e2430"/>
    <path d="M8 66c2-18 13-26 24-26s22 8 24 26" fill="#431820"/>
    <circle cx="32" cy="31" r="12" fill="#e0ad86"/>
    <path d="M18 32c1-16 9-22 16-20 8 1 13 8 12 18-3-8-8-11-14-10-7 1-11 6-14 12z" fill="#3a241c"/>
    <circle cx="27.5" cy="31" r="1.15" fill="#241c18"/>
    <circle cx="36.5" cy="31" r="1.15" fill="#241c18"/>
    <path d="M47 16l1.1 2.8 2.9.2-2.2 1.9.7 2.8-2.5-1.5-2.5 1.5.7-2.8-2.2-1.9 2.9-.2z" fill="#f0d7a2"/>`,
  brandon: `
    <rect width="64" height="64" rx="20" fill="#1f4a38"/>
    <path d="M8 66c2-18 13-26 24-26s22 8 24 26" fill="#173628"/>
    <circle cx="32" cy="31" r="12" fill="#c68642"/>
    <path d="M20 28c1-12 6-16 12-16s11 5 12 14c-3-4-7-6-12-6s-9 2-12 8z" fill="#2a1b14"/>
    <path d="M24 38c2 3 5 4 8 4s6-1 8-4" fill="none" stroke="#2a1b14" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="27.5" cy="31" r="1.15" fill="#241c18"/>
    <circle cx="36.5" cy="31" r="1.15" fill="#241c18"/>
    <path d="M46 42h8v3h-8z" fill="#d7efe3"/>`,
  tomas: `
    <rect width="64" height="64" rx="20" fill="#243246"/>
    <path d="M8 66c2-18 13-26 24-26s22 8 24 26" fill="#1b2636"/>
    <circle cx="32" cy="31" r="12" fill="#f0c7a0"/>
    <path d="M18 30c2-14 8-20 14-20 7 0 13 6 15 16-4-2-6-8-9-9-5-1-8 2-10 6-2-3-6-4-10-1 0 3 0 6 0 8z" fill="#4a3428"/>
    <circle cx="27.2" cy="31" r="4.2" fill="none" stroke="#d7efe3" stroke-width="1.4"/>
    <circle cx="36.8" cy="31" r="4.2" fill="none" stroke="#d7efe3" stroke-width="1.4"/>
    <path d="M31.4 31h1.2" stroke="#d7efe3" stroke-width="1.4"/>
    <circle cx="27.2" cy="31" r="1.05" fill="#241c18"/>
    <circle cx="36.8" cy="31" r="1.05" fill="#241c18"/>`,
  sean: `
    <rect width="64" height="64" rx="20" fill="#1d3f6e"/>
    <path d="M10 64c1-14 10-20 22-20s21 6 22 20" fill="#16345c"/>
    <path d="M16 46h32v6H16z" fill="#f6f0e6"/>
    <circle cx="32" cy="30" r="12" fill="#8d5524"/>
    <path d="M20 28c2-12 7-16 12-16 6 0 11 5 13 13-4-2-8-3-13-3s-9 1-12 6z" fill="#24160f"/>
    <circle cx="27.5" cy="30" r="1.15" fill="#241c18"/>
    <circle cx="36.5" cy="30" r="1.15" fill="#241c18"/>
    <rect x="44" y="40" width="10" height="7" rx="1.5" fill="#e6b45a"/>`,
  kajal: `
    <rect width="64" height="64" rx="20" fill="#b26b2c"/>
    <path d="M8 66c2-16 12-22 24-22s22 6 24 22" fill="#8a4e18"/>
    <path d="M16 34c0 14 6 24 16 24s16-10 16-24" fill="#2a1b14"/>
    <circle cx="32" cy="29" r="11" fill="#d9a066"/>
    <path d="M20 28c1-12 7-18 13-17 7 1 12 8 11 16-2-7-6-10-12-10s-10 3-12 11z" fill="#2a1b14"/>
    <circle cx="27.6" cy="29" r="1.15" fill="#241c18"/>
    <circle cx="36.2" cy="29" r="1.15" fill="#241c18"/>
    <circle cx="44" cy="34" r="2" fill="#f0d7a2"/>`,
  jessica: `
    <rect width="64" height="64" rx="20" fill="#3f6b52"/>
    <path d="M8 66c2-18 13-26 24-26s22 8 24 26" fill="#f4efe6"/>
    <path d="M28 40h8l2 16H26z" fill="#9d3140"/>
    <circle cx="32" cy="30" r="11.5" fill="#f3d2b5"/>
    <path d="M21 26c2-10 6-14 11-14 6 0 11 5 12 12-2-1-4-6-8-7-5-1-8 1-10 4-1-2-3-3-5-2 0 3 0 5 0 7z" fill="#6b3a28"/>
    <circle cx="32" cy="16" r="4" fill="#6b3a28"/>
    <circle cx="27.6" cy="30" r="1.1" fill="#241c18"/>
    <circle cx="36.2" cy="30" r="1.1" fill="#241c18"/>
    <circle cx="46" cy="18" r="3.2" fill="#9d3140"/>
    <circle cx="46" cy="18" r="1.3" fill="#1f4a38"/>`,
};

const RING = 94.248;
const trayEl = document.getElementById("tray");
const rosterEl = document.getElementById("roster");
const shopEl = document.getElementById("shop");
const overlayEl = document.getElementById("overlay");
const ghostEl = document.getElementById("ghost");

let state = createGame(loadConfig(location.search), (Date.now() ^ (Math.random() * 1e9)) >>> 0);
let seen = -1;
let drag = null;
let breakAnim = null;
let anims = [];
let audioCtx = null;
let audioReady = false;
let celebrationReady = false;
let activeMap = new Map();
let heard = new Set();

mountAtmosphere();
render();
requestAnimationFrame(frame);

document.addEventListener("pointerdown", (event) => {
  unlockAudio();
  onPointerDown(event);
});
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerup", (event) => endDrag(event, true));
document.addEventListener("pointercancel", (event) => endDrag(event, false));
document.addEventListener("contextmenu", (event) => {
  if (event.target.closest("[data-drag]")) event.preventDefault();
});
document.addEventListener("touchmove", (event) => {
  if (drag?.armed) event.preventDefault();
}, { passive: false });
document.body.addEventListener("click", onClick);
document.body.addEventListener("submit", onSubmit);

function frame(now) {
  const previous = frame.last || now;
  frame.last = now;
  let dt = Math.min(0.1, (now - previous) / 1000);
  if (document.hidden) dt = 0;
  if (breakAnim) {
    breakAnim.t += dt;
    if (breakAnim.t >= breakAnim.duration) {
      breakAnim.t = breakAnim.duration;
      paint();
      const kind = breakAnim.kind;
      breakAnim = null;
      takeBreak(state, kind);
      hideBreak();
      render();
    } else paint();
    requestAnimationFrame(frame);
    return;
  }
  if (state.phase === "work" && holdingAlert() && drag) cancelDrag();
  if (state.phase === "work" && dt > 0) tick(state, dt);
  if (drag?.armed && scrollDrag(dt)) moveDrag(drag.x, drag.y);
  if (state.rev !== seen && !drag?.armed) render();
  else paint();
  requestAnimationFrame(frame);
}

function begin() {
  celebrationReady = false;
  activeMap = new Map();
  heard = new Set();
  breakAnim = null;
  hideBreak();
  unlockAudio();
  startGame(state);
  render();
}

function render() {
  if (drag && !drag.armed) {
    window.clearTimeout(drag.timer);
    drag = null;
  }
  seen = state.rev;
  if (state.phase === "work") {
    overlayEl.hidden = true;
    shopEl.hidden = true;
    renderBoard();
    renderAlert();
    watchEvents();
    syncCelebration();
  } else if (state.phase === "shop") {
    overlayEl.hidden = true;
    shopEl.hidden = false;
    hideAlert();
    renderShop();
  } else {
    shopEl.hidden = true;
    hideAlert();
    overlayEl.hidden = false;
    if (state.phase === "results") renderResults();
    else renderTitle();
  }
  if (!breakAnim) hideBreak();
  mountMotion();
  paint();
}

function renderBoard() {
  document.getElementById("day-label").textContent = `Day ${state.day}/12`;
  document.getElementById("notice").textContent = state.notice || "";
  const tasks = trayTasks();
  trayEl.innerHTML = tasks.length ? tasks.map(trayCard).join("") : `<p class="empty">Tray is clear.</p>`;
  rosterEl.innerHTML = state.staff.map((person) => `
    <article class="person" data-staff="${person.id}" style="--hue:${person.hue}">
      <div class="who">
        ${avatarMarkup(person.id)}
        <div>
          <h3>${esc(person.name)}</h3>
          <p class="role">${esc(person.role)}</p>
          <p class="specs">${skillTags(person)}</p>
        </div>
      </div>
      ${activeMarkup(person)}
      ${queueMarkup(person)}
    </article>
  `).join("");
}

function renderShop() {
  const openEvents = state.tasks.filter((task) => task.kind === "event").length;
  shopEl.innerHTML = `
    <div class="sheet-inner">
      <p class="kicker">Night ${state.day}</p>
      <h2>The floor is closed</h2>
      <p class="sheet-cash">${money(state.cash)}</p>
      <p class="sheet-sub">Today ${money(state.earnedToday)} · Earned ${money(state.earned)}</p>
      ${openEvents ? `<p class="warn">${openEvents} emergency still open.</p>` : ""}
      <h3>Office</h3>
      <div class="offers">${PERKS.map(perkCard).join("")}</div>
      <h3>Training</h3>
      <div class="offers">${state.staff.map(skillCard).join("")}</div>
      <button type="button" class="go" data-action="advance">Open day ${state.day + 1}</button>
    </div>
  `;
}

function renderTitle() {
  overlayEl.innerHTML = `
    <div class="modal">
      <p class="kicker">Ignite</p>
      <h2>The Q4 Rush</h2>
      <p class="edition">Holiday Edition</p>
      <p>Twelve working days. Drag the briefs. The score is what the floor earns.</p>
      <button type="button" class="go" data-action="start">Start the floor</button>
      <details>
        <summary>Floor rules</summary>
        <ol>
          <li>Drag a brief onto someone. Drop it on their queue to pick the slot, or drag a pill to reorder.</li>
          <li>The chips are the brief. A specialty match finishes faster. Nothing on the card lights up to tell you who that is.</li>
          <li>An emergency stops the floor. Read it, then send it to the person it names. It takes their desk, even mid-task.</li>
          <li>At night, buy office perks or training. Training spends cash and hours the next morning.</li>
          <li>After day 12 the score is every dollar earned. Top 10 can leave a name. Email stays off the board.</li>
        </ol>
      </details>
    </div>
  `;
}

function renderResults() {
  const score = Math.round(state.earned);
  overlayEl.innerHTML = `
    <div class="modal">
      <p class="kicker">Ignite</p>
      <h2>Christmas break</h2>
      <p class="score">${money(score)}</p>
      <p class="sheet-sub">Earned across 12 days</p>
      <ul class="stats">
        <li>${state.stats.delivered} delivered</li>
        <li>${state.stats.expired} expired</li>
        <li>${state.stats.events} emergencies</li>
      </ul>
      <form id="score-form">
        <p>Top 10 can leave a name. Email stays off the board.</p>
        <label>Name <input name="name" maxlength="24" required autocomplete="nickname" /></label>
        <label>Email <input name="email" type="email" maxlength="120" required autocomplete="email" /></label>
        <button type="submit">Save to the Top 10</button>
      </form>
      <p id="board-note"></p>
      <ol id="board-list"></ol>
      <button type="button" class="go" data-action="again">Run it again</button>
    </div>
  `;
  loadBoard(score);
}

function paint() {
  const dayLeft = displayedDayLeft();
  const hours = hoursFromLeft(dayLeft);
  const clock = document.getElementById("clock");
  clock.textContent = `${Math.max(0, hours).toFixed(1)}h`;
  clock.classList.toggle("is-late", state.phase === "work" && hours < 1 && !breakAnim);
  clock.classList.toggle("is-break", Boolean(breakAnim));
  document.querySelector(".bar")?.classList.toggle("is-break", Boolean(breakAnim));
  document.getElementById("cash").textContent = money(state.cash);
  document.getElementById("earned").textContent = money(state.earned);
  document.getElementById("day-fill").style.width = `${clamp((1 - dayLeft / state.config.dayLengthSeconds) * 100, 0, 100)}%`;
  const countEl = document.getElementById("countdown");
  const count = !breakAnim && state.phase === "work" && state.dayLeft > 0 && state.dayLeft <= 3 ? Math.ceil(state.dayLeft) : 0;
  countEl.hidden = !count;
  countEl.textContent = count ? String(count) : "";
  setMeter("coffee", displayedMeter("coffee"));
  setMeter("morale", displayedMeter("morale"));
  paintBreakControls();
  for (const bar of document.querySelectorAll("[data-bar]")) {
    const task = taskByUid(Number(bar.dataset.bar));
    if (task) bar.style.width = `${task.progress}%`;
  }
  for (const ring of document.querySelectorAll("[data-ring]")) {
    const task = taskByUid(Number(ring.dataset.ring));
    if (!task?.patience) continue;
    const ratio = clamp(task.patienceLeft / task.patience, 0, 1);
    ring.style.strokeDashoffset = String(RING * (1 - ratio));
    ring.classList.toggle("is-short", ratio < 0.28);
  }
  for (const node of document.querySelectorAll("[data-train]")) {
    const person = state.staff.find((member) => member.id === node.dataset.train);
    if (person) node.textContent = hourLabel(Math.max(0, person.trainLeft));
  }
  for (const bar of document.querySelectorAll("[data-train-bar]")) {
    const person = state.staff.find((member) => member.id === bar.dataset.trainBar);
    const span = person?.trainSpan || 0;
    const done = span > 0 ? clamp(1 - person.trainLeft / span, 0, 1) : 0;
    bar.style.width = `${done * 100}%`;
  }
}

function setMeter(name, value) {
  const rounded = Math.round(value);
  document.getElementById(`${name}-value`).textContent = String(rounded);
  document.getElementById(`${name}-fill`).style.width = `${clamp(value, 0, 100)}%`;
  const meter = document.getElementById(`${name}-meter`);
  const filling = Boolean(breakAnim && ((name === "coffee" && breakAnim.kind === "coffee") || (name === "morale" && breakAnim.kind === "beer")));
  meter.classList.toggle("is-low", rounded <= 12 && rounded > 0);
  meter.classList.toggle("is-empty", rounded <= 0);
  meter.classList.toggle("is-filling", filling);
  meter.classList.toggle("is-beer", name === "morale" && (state.beerSlow || breakAnim?.kind === "beer") && rounded > 0);
  const hint = document.getElementById(`${name}-hint`);
  if (!hint) return;
  const text = meterHint(name, value);
  hint.textContent = text;
  hint.classList.toggle("is-note", Boolean(text) && value > 0);
}

function meterHint(name, value) {
  if (Math.round(value) <= 0) {
    const label = name === "coffee" ? "coffee" : "morale";
    return `Out of ${label}. Every job takes more than twice as long.`;
  }
  if (name === "morale" && (state.beerSlow || breakAnim?.kind === "beer")) {
    return "Beer on the floor. Jobs take 1.5× until close.";
  }
  return "";
}

function paintBreakControls() {
  const coffeeBtn = document.getElementById("coffee-break");
  const beerBtn = document.getElementById("beer-break");
  if (!coffeeBtn || !beerBtn) return;
  const working = state.phase === "work" && !breakAnim;
  const stopped = working && holdingAlert();
  coffeeBtn.hidden = !working || state.coffee >= 50;
  beerBtn.hidden = !working || state.morale >= 80;
  coffeeBtn.disabled = stopped;
  beerBtn.disabled = stopped;
  coffeeBtn.title = stopped
    ? "Deal with the emergency first."
    : state.coffee >= 50
      ? "Coffee is already above 50."
      : "Spend 30 minutes. Coffee returns to 50.";
  beerBtn.title = stopped
    ? "Deal with the emergency first."
    : state.morale >= 80
      ? "Morale is already at 80."
      : "Spend 30 minutes. Morale to 80. Jobs take 1.5× until close.";
}

function onClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target || target.disabled) return;
  const action = target.dataset.action;
  if (action === "start" || action === "again") begin();
  else if (action === "break") startBreak(target.dataset.kind);
  else if (action === "advance") {
    advance(state);
    render();
  } else if (action === "alert") {
    const result = assign(state, Number(target.dataset.uid), target.dataset.staff, 0);
    if (!result.ok && result.reason) state.notice = result.reason;
    render();
  } else if (action === "skill" || action === "perk") {
    const result = action === "skill" ? buySkill(state, target.dataset.staff) : buyPerk(state, target.dataset.id);
    if (!result.ok && result.reason) state.notice = result.reason;
    render();
  }
}

function onSubmit(event) {
  const form = event.target.closest?.("#score-form") || (event.target.id === "score-form" ? event.target : null);
  if (!form) return;
  event.preventDefault();
  submitScore(form);
}

function onPointerDown(event) {
  if (state.phase !== "work" || drag || holdingAlert() || breakAnim) return;
  const el = event.target.closest?.("[data-drag]");
  if (!el) return;
  if (event.button != null && event.button !== 0) return;
  const uid = Number(el.dataset.uid);
  if (!taskByUid(uid)) return;
  const fromTray = Boolean(el.closest(".tray-card"));
  drag = {
    uid,
    el,
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    startX: event.clientX,
    startY: event.clientY,
    fromTray,
    armed: false,
    timer: 0,
    staffId: null,
    index: "end",
    valid: false,
  };
  if (!fromTray || event.pointerType === "mouse") arm(event);
  else {
    drag.timer = window.setTimeout(() => {
      if (drag) arm({ clientX: drag.x, clientY: drag.y });
    }, 160);
  }
}

function onPointerMove(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  drag.x = event.clientX;
  drag.y = event.clientY;
  if (!drag.armed) {
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (drag.fromTray && event.pointerType !== "mouse" && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) + 4) {
      window.clearTimeout(drag.timer);
      drag = null;
      return;
    }
    if (Math.hypot(dx, dy) > 10) arm(event);
    return;
  }
  moveDrag(event.clientX, event.clientY);
}

function arm(event) {
  if (!drag || drag.armed) return;
  const task = taskByUid(drag.uid);
  if (!task) {
    drag = null;
    return;
  }
  drag.armed = true;
  drag.el.classList.add("is-source");
  try { drag.el.setPointerCapture(drag.pointerId); } catch { /* pointer already up */ }
  ghostEl.hidden = false;
  ghostEl.classList.toggle("is-event", task.kind === "event");
  ghostEl.innerHTML = `<strong>${esc(task.title)}</strong><em>${esc(task.kind === "event" ? "Emergency" : task.skill)}</em>`;
  moveDrag(event.clientX ?? drag.x, event.clientY ?? drag.y);
}

function moveDrag(x, y) {
  if (!drag) return;
  ghostEl.style.left = `${x}px`;
  ghostEl.style.top = `${y}px`;
  clearDrop();
  drag.staffId = null;
  drag.valid = false;
  drag.index = "end";
  const task = taskByUid(drag.uid);
  const { personEl, hit } = personNear(x, y);
  if (!task || !personEl || !hit) return;
  const staffId = personEl.dataset.staff;
  const allowed = task.kind !== "event" || task.allows.includes(staffId);
  personEl.classList.add(allowed ? "is-over" : "is-bad");
  drag.staffId = staffId;
  drag.valid = allowed;
  if (!allowed) return;
  const queue = personEl.querySelector("[data-queue]");
  const overQueue = Boolean(hit.closest("[data-queue]"));
  if (task.kind === "event") drag.index = 0;
  else if (overQueue && queue) drag.index = insertionIndex(queue, y, drag.uid);
  if (queue && (task.kind === "event" || overQueue)) showGap(queue, drag.index);
}

function cancelDrag() {
  if (!drag) return;
  window.clearTimeout(drag.timer);
  drag.el?.classList.remove("is-source");
  clearDrop();
  ghostEl.hidden = true;
  drag = null;
}

function holdingAlert() {
  return state.tasks.some((task) => task.holding);
}

function startBreak(kind) {
  if (breakAnim || state.phase !== "work" || holdingAlert()) return;
  if (kind !== "coffee" && kind !== "beer") return;
  if (kind === "coffee" && state.coffee >= 50) return;
  if (kind === "beer" && state.morale >= 80) return;
  cancelDrag();
  const spent = Math.min(state.dayLeft, breakCostSeconds(state.config));
  breakAnim = {
    kind,
    t: 0,
    duration: 2,
    startLeft: state.dayLeft,
    endLeft: Math.max(0, state.dayLeft - spent),
    startMeter: kind === "coffee" ? state.coffee : state.morale,
    endMeter: kind === "coffee" ? 50 : Math.max(state.morale, 80),
  };
  showBreak(kind);
  paint();
}

function displayedDayLeft() {
  if (!breakAnim) return state.dayLeft;
  const p = clamp(breakAnim.t / breakAnim.duration, 0, 1);
  return breakAnim.startLeft + (breakAnim.endLeft - breakAnim.startLeft) * p;
}

function displayedMeter(name) {
  const live = name === "coffee" ? state.coffee : state.morale;
  if (!breakAnim) return live;
  const active = (name === "coffee" && breakAnim.kind === "coffee") || (name === "morale" && breakAnim.kind === "beer");
  if (!active) return live;
  const p = clamp(breakAnim.t / breakAnim.duration, 0, 1);
  return breakAnim.startMeter + (breakAnim.endMeter - breakAnim.startMeter) * p;
}

function hoursFromLeft(dayLeft) {
  return shownHours(state.config, dayLeft / secondsPerGameHour(state.config));
}

function showBreak(kind) {
  const el = document.getElementById("break-pop");
  const beer = kind === "beer";
  el.hidden = false;
  el.innerHTML = `
    <div class="break-card ${beer ? "is-beer" : ""}" role="dialog" aria-modal="true" aria-labelledby="break-title">
      <div class="break-art" aria-hidden="true">${beer ? beerArt() : coffeeArt()}</div>
      <p class="kicker">${beer ? "Beer break" : "Coffee break"}</p>
      <h2 id="break-title">${beer ? "One round" : "The pot is back"}</h2>
      <p>${beer
        ? "Half an hour off the clock. Morale to 80. Jobs take 1.5× until close."
        : "Half an hour off the clock. Coffee returns to 50."}</p>
    </div>
  `;
}

function hideBreak() {
  const el = document.getElementById("break-pop");
  if (!el || el.hidden) return;
  el.hidden = true;
  el.innerHTML = "";
}

function coffeeArt() {
  return `
    <div class="break-stage">
      <div class="wisps" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="saucer"></div>
      <div class="bowl">
        <div class="brew"></div>
      </div>
      <div class="handle"></div>
    </div>
  `;
}

function beerArt() {
  return `
    <div class="break-stage is-beer">
      <div class="saucer"></div>
      <div class="bowl">
        <div class="brew">
          <div class="head"></div>
          <div class="bubbles"><i></i><i></i><i></i></div>
        </div>
      </div>
      <div class="handle"></div>
    </div>
  `;
}

function hideAlert() {
  const el = document.getElementById("alert");
  el.hidden = true;
  el.innerHTML = "";
}

function renderAlert() {
  const task = state.tasks.find((item) => item.holding);
  const el = document.getElementById("alert");
  if (!task) {
    hideAlert();
    return;
  }
  const people = (task.allows || []).map((id) => state.staff.find((person) => person.id === id)).filter(Boolean);
  const buttons = task.joint
    ? `<button type="button" class="go" data-action="alert" data-uid="${task.uid}" data-staff="${people[0]?.id || ""}">Send ${esc(people.map((person) => person.name).join(" and "))}</button>`
    : people.map((person) => `<button type="button" class="go" data-action="alert" data-uid="${task.uid}" data-staff="${person.id}">${esc(person.name)}</button>`).join("");
  el.hidden = false;
  el.innerHTML = `
    <div class="alert-card" role="dialog" aria-modal="true" aria-labelledby="alert-title">
      <div class="alert-art"><div data-lottie="${esc(task.lottie || "siren")}"></div></div>
      <p class="kicker">Emergency</p>
      <h2 id="alert-title">${esc(task.title)}</h2>
      <p>${esc(task.detail || "")}</p>
      <p class="meta">${hourLabel(task.hours)} on their desk. The floor waits.</p>
      <div class="alert-actions">${buttons}</div>
    </div>
  `;
}

function scrollDrag(dt) {
  if (!drag?.armed || dt <= 0) return false;
  const edge = 88;
  const y = drag.y;
  const viewH = window.innerHeight;
  let dir = 0;
  let depth = 0;
  if (y < edge) {
    dir = -1;
    depth = (edge - y) / edge;
  } else if (y > viewH - edge) {
    dir = 1;
    depth = (y - (viewH - edge)) / edge;
  }
  if (!dir) return false;
  const delta = dir * (280 + clamp(depth, 0, 1) * 1100) * dt;
  const max = Math.max(0, rosterEl.scrollHeight - rosterEl.clientHeight);
  const next = clamp(rosterEl.scrollTop + delta, 0, max);
  if (next === rosterEl.scrollTop) return false;
  rosterEl.scrollTop = next;
  return true;
}

function endDrag(event, commit) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const current = drag;
  window.clearTimeout(current.timer);
  drag = null;
  current.el.classList.remove("is-source");
  clearDrop();
  ghostEl.hidden = true;
  if (commit && current.armed && current.valid && current.staffId) {
    const result = assign(state, current.uid, current.staffId, current.index);
    const note = document.getElementById("notice");
    if (!result.ok && result.reason && !["closed", "missing", "locked"].includes(result.reason) && note) {
      note.textContent = result.reason;
    }
  }
  if (state.rev !== seen) render();
}

function insertionIndex(queue, y, uid) {
  const pills = [...queue.querySelectorAll(".pill")];
  let index = pills.length;
  for (let i = 0; i < pills.length; i += 1) {
    const rect = pills[i].getBoundingClientRect();
    if (y < rect.top + rect.height / 2) {
      index = i;
      break;
    }
  }
  const from = pills.findIndex((pill) => Number(pill.dataset.uid) === uid);
  if (from >= 0 && from < index) index -= 1;
  return index;
}

function showGap(queue, index) {
  const pills = [...queue.querySelectorAll(".pill")].filter((pill) => !drag || Number(pill.dataset.uid) !== drag.uid);
  if (index >= pills.length) queue.classList.add("is-endgap");
  else pills[index]?.classList.add("is-gap");
}

function personNear(x, y) {
  const hit = elementUnder(x, y);
  const direct = hit?.closest("[data-staff]");
  if (direct) return { personEl: direct, hit };
  let personEl = null;
  let best = 36;
  for (const card of document.querySelectorAll("[data-staff]")) {
    const rect = card.getBoundingClientRect();
    const cx = clamp(x, rect.left, rect.right);
    const cy = clamp(y, rect.top, rect.bottom);
    const dist = Math.hypot(x - cx, y - cy);
    if (dist <= best) {
      best = dist;
      personEl = card;
    }
  }
  return { personEl, hit: personEl };
}

function elementUnder(x, y) {
  for (const el of document.elementsFromPoint(x, y)) {
    if (el === ghostEl || ghostEl.contains(el)) continue;
    if (drag && (el === drag.el || drag.el.contains(el))) continue;
    return el;
  }
  return null;
}

function clearDrop() {
  document.querySelectorAll(".is-over, .is-bad, .is-gap, .is-endgap").forEach((el) => {
    el.classList.remove("is-over", "is-bad", "is-gap", "is-endgap");
  });
}

function trayTasks() {
  return state.tray
    .map((uid) => taskByUid(uid))
    .filter(Boolean)
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "event" ? -1 : 1;
      if (a.kind === "event") return (a.eventDay || 0) - (b.eventDay || 0);
      return (a.patienceLeft ?? 99) - (b.patienceLeft ?? 99);
    });
}

function trayCard(task) {
  if (task.kind === "event") {
    const names = (task.allows || []).map((id) => state.staff.find((person) => person.id === id)?.name || id);
    const who = task.joint ? names.join(" + ") : names.join(" or ");
    return `<article class="tray-card is-event" data-drag data-uid="${task.uid}">
      <div class="event-art"><div data-lottie="${esc(task.lottie || "siren")}"></div></div>
      <h3>${esc(task.title)}</h3>
      <p class="need">${esc(who)}</p>
      <p class="meta">${hourLabel(task.hours)}</p>
    </article>`;
  }
  return `<article class="tray-card" data-drag data-uid="${task.uid}">
    <svg class="ring" viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="15"></circle>
      <circle cx="18" cy="18" r="15" data-ring="${task.uid}" style="stroke-dashoffset:${ringOffset(task)}"></circle>
    </svg>
    <h3>${esc(task.title)}</h3>
    <p class="chips">${tag(task.skill)}${task.secondary ? tag(task.secondary) : ""}</p>
    <p class="meta">${money(task.reward)} · ${hourLabel(task.hours)}</p>
  </article>`;
}

function activeMarkup(person) {
  const task = person.active ? taskByUid(person.active) : null;
  if (person.trainLeft > 0) {
    const span = person.trainSpan || person.trainLeft;
    const done = clamp(1 - person.trainLeft / span, 0, 1);
    return `<div class="active is-training">
      <span>Training <b data-train="${person.id}">${hourLabel(person.trainLeft)}</b></span>
      <div class="track"><span data-train-bar="${person.id}" style="width:${(done * 100).toFixed(1)}%"></span></div>
      ${task ? `<small>Paused</small>` : ""}
    </div>`;
  }
  if (!task) return `<div class="active is-idle"><span>Open</span></div>`;
  return `<div class="active">
    <span>${esc(task.title)}</span>
    <div class="track"><span data-bar="${task.uid}" style="width:${task.progress}%"></span></div>
  </div>`;
}

function queueMarkup(person) {
  const pills = person.queue.map((uid) => {
    const task = taskByUid(uid);
    if (!task) return "";
    return `<div class="pill ${task.kind === "event" ? "is-event" : ""}" data-drag data-uid="${task.uid}" style="--skill:${SKILL_COLOR[task.skill] || "#5c5346"}">
      <i></i><span>${esc(task.title)}</span>
    </div>`;
  }).join("");
  return `<div class="queue" data-queue="${person.id}">${pills}</div>`;
}

function skillTags(person) {
  return skillsOf(person).map((skill) => tag(skill, person.specialties.includes(skill) ? "" : "is-new")).join("");
}

function perkCard(perk) {
  const owned = state.perks[perk.id] || 0;
  const pending = state.pendingPerks[perk.id] || 0;
  const offer = perkOffer(state, perk);
  const waiting = pending > owned;
  const status = !offer && !waiting ? "Installed" : waiting ? "In the morning" : money(offer.cost);
  const afford = Boolean(offer && state.cash >= offer.cost);
  return `<article class="offer">
    <div>
      <h3>${esc(perk.name)}</h3>
      <p>${esc(perk.blurb)}</p>
      <p class="cost">${status}</p>
    </div>
    ${offer ? `<button type="button" data-action="perk" data-id="${perk.id}" ${afford ? "" : "disabled"}>Buy</button>` : ""}
  </article>`;
}

function skillCard(person) {
  const waiting = person.pendingTier > person.trained;
  const current = waiting ? SKILL_TREES[person.id][person.pendingTier - 1] : null;
  const offer = waiting ? null : nextSkillOffer(person);
  const afford = Boolean(offer && state.cash >= offer.cost);
  return `<article class="offer">
    <div>
      <h3>${esc(person.name)}</h3>
      <p class="pips">${[1, 2, 3].map((tier) => `<i class="${tier <= person.trained ? "on" : tier === person.pendingTier ? "wait" : ""}"></i>`).join("")}</p>
      <p class="skill-name">${esc(waiting ? current.name : offer ? offer.name : "Mastered")}</p>
      <p>${esc(waiting ? "In the morning" : offer ? offer.blurb : "Every tier is trained.")}</p>
      ${offer ? `<p class="cost">${money(offer.cost)} · ${hourLabel(offer.downtime)} off the floor tomorrow</p>` : ""}
    </div>
    ${offer ? `<button type="button" data-action="skill" data-staff="${person.id}" ${afford ? "" : "disabled"}>Train</button>` : ""}
  </article>`;
}

function avatarMarkup(id) {
  if (PORTRAITS[id]) {
    return `<div class="avatar"><img class="avatar-fallback" alt="" src="${esc(PORTRAITS[id])}" /></div>`;
  }
  return `<div class="avatar"><div class="avatar-fallback"><svg class="token" viewBox="0 0 64 64" aria-hidden="true">${LOOKS[id] || ""}</svg></div><div class="avatar-lottie" data-lottie="${esc(id)}"></div></div>`;
}

function tag(skill, extra = "") {
  return `<span class="tag ${extra}" style="--skill:${SKILL_COLOR[skill] || "#5c5346"}">${esc(skill)}</span>`;
}

function ringOffset(task) {
  const ratio = task.patience ? clamp(task.patienceLeft / task.patience, 0, 1) : 1;
  return (RING * (1 - ratio)).toFixed(2);
}

function hourLabel(simHours) {
  const rounded = Math.round(shownHours(state.config, simHours) * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}h`;
}

function taskByUid(uid) {
  return state.tasks.find((task) => task.uid === uid) || null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function syncCelebration() {
  if (!celebrationReady) {
    for (const person of state.staff) activeMap.set(person.id, person.active);
    celebrationReady = true;
    return;
  }
  for (const person of state.staff) {
    const previous = activeMap.get(person.id);
    if (previous && previous !== person.active) burst(person.id);
    activeMap.set(person.id, person.active);
  }
}

function burst(id) {
  if (!window.lottie) return;
  const card = document.querySelector(`[data-staff="${id}"] .avatar`);
  if (!card) return;
  const el = document.createElement("div");
  el.className = "burst";
  card.appendChild(el);
  const anim = window.lottie.loadAnimation({
    container: el,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: "lottie/burst.json",
  });
  window.setTimeout(() => {
    anim.destroy();
    el.remove();
  }, 900);
}

function watchEvents() {
  for (const task of state.tasks) {
    if (task.kind !== "event" || task.group || heard.has(task.eventDay)) continue;
    heard.add(task.eventDay);
    if (audioReady) chime();
  }
}

function unlockAudio() {
  audioReady = true;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  try {
    audioCtx = audioCtx || new Ctx();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch { /* audio is optional */ }
}

function chime() {
  try {
    if (!audioCtx || audioCtx.state !== "running") return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.setValueAtTime(760, now + 0.08);
    osc.frequency.setValueAtTime(520, now + 0.16);
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch { /* audio is optional */ }
}

function mountMotion() {
  for (const anim of anims) anim.destroy();
  anims = [];
  if (state.phase !== "work" || !window.lottie) return;
  for (const el of document.querySelectorAll("[data-lottie]")) {
    const anim = window.lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: true,
      autoplay: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      path: `lottie/${el.dataset.lottie}.json`,
    });
    anims.push(anim);
    const fallback = el.parentElement?.querySelector(".avatar-fallback");
    if (fallback) {
      anim.addEventListener("DOMLoaded", () => {
        fallback.style.opacity = "0";
      });
    }
  }
}

function ensureLottie() {
  if (window.lottie) return;
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
  script.onload = () => { if (window.lottie) mountMotion(); };
  document.head.appendChild(script);
}

async function loadBoard(score) {
  const list = document.getElementById("board-list");
  const note = document.getElementById("board-note");
  const form = document.getElementById("score-form");
  if (!list) return;
  try {
    const response = await fetch("leaderboard.php", { cache: "no-store" });
    if (!response.ok) throw new Error("status");
    const data = await response.json();
    if (!data.ok || !document.body.contains(list) || state.phase !== "results") return;
    paintBoard(data.top || []);
    const top = data.top || [];
    const last = top.length ? top[top.length - 1].score : 0;
    const open = top.length < 10 || score > last;
    if (form) form.hidden = !open;
    if (!open && note) note.textContent = "Top 10 is ahead of this run.";
  } catch {
    if (note && document.body.contains(note)) {
      note.textContent = "This host can't store the board. The Top 10 list needs PHP.";
    }
  }
}

async function submitScore(form) {
  const note = document.getElementById("board-note");
  const button = form.querySelector("button");
  button.disabled = true;
  try {
    const response = await fetch("leaderboard.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        score: Math.round(state.earned),
      }),
    });
    const data = await response.json();
    if (!document.body.contains(form) || state.phase !== "results") return;
    if (!data.ok) {
      if (note) note.textContent = data.error || "The board refused that score.";
      if (data.top) paintBoard(data.top);
      button.disabled = false;
      return;
    }
    paintBoard(data.top || []);
    form.reset();
    form.hidden = true;
    if (note) note.textContent = "Saved. The board shows your name.";
  } catch {
    if (note) note.textContent = "This host can't store the board. The Top 10 list needs PHP.";
    button.disabled = false;
  }
}

function paintBoard(rows) {
  const list = document.getElementById("board-list");
  if (!list) return;
  list.innerHTML = rows.map((row) => `<li><span>${esc(row.name)}</span><span>${money(row.score)}</span></li>`).join("");
}

function mountAtmosphere() {
  const bulbs = ["#e6b45a", "#f2f2f2", "#9d3140", "#7dcea0"];
  document.getElementById("lights").innerHTML = Array.from({ length: 18 }, (_, index) => {
    return `<i style="--i:${index};--bulb:${bulbs[index % bulbs.length]}"></i>`;
  }).join("");
  document.getElementById("snow").innerHTML = Array.from({ length: 36 }, (_, index) => {
    const left = (index * 37) % 100;
    const delay = ((index % 12) * 0.6).toFixed(2);
    const duration = (8 + (index % 6)).toFixed(2);
    const size = 3 + (index % 4);
    return `<span style="left:${left}%;animation-duration:${duration}s;animation-delay:-${delay}s;width:${size}px;height:${size}px;opacity:${(0.35 + (index % 5) * 0.1).toFixed(2)}"></span>`;
  }).join("");
  ensureLottie();
}
