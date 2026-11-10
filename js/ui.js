import {
  GOAL,
  UPGRADES,
  JOKES,
  freshState,
  buildOpening,
  beginShift,
  tick,
  assign,
  buy,
  togglePick,
  modifiers,
  pace,
  payoutFor,
  resourceFactor,
  tierLabel,
  nextEffectLabel,
  money,
  formatClock,
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

/** Drop an approved photo path here to replace an illustrated token. */
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

const GREETINGS = [
  "May your out-of-office be immediate and your cocoa unbothered.",
  "The tree is lit, the decks are closed, and Ignite made the quarter.",
  "Tell the clients the elves are off the clock.",
  "Hang the lights. The invoices already went out.",
];

const queueEl = document.getElementById("queue");
const rosterEl = document.getElementById("roster");
const upgradesEl = document.getElementById("upgrades");
const feedEl = document.getElementById("feed");
const overlayEl = document.getElementById("overlay");
const boardEl = document.getElementById("board");
const toastEl = document.getElementById("toasts");

let state = freshState(seed());
let seen = -1;
let savedFor = null;
let best = loadBest();

buildOpening(state);
mountAtmosphere();
render();
requestAnimationFrame(loop);

document.body.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target || target.disabled) return;
  const action = target.dataset.action;
  if (action === "start") beginShift(state);
  else if (action === "retry") reset();
  else if (action === "pick") togglePick(state, Number(target.dataset.uid));
  else if (action === "cancel") {
    state.picking = null;
    state.rev += 1;
  } else if (action === "assign") assign(state, state.picking, target.dataset.staff);
  else if (action === "buy") buy(state, target.dataset.id);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.picking) {
    state.picking = null;
    state.rev += 1;
  }
});

function loop(now) {
  loop.last = loop.last || now;
  const dt = Math.min(0.1, (now - loop.last) / 1000);
  loop.last = now;
  if (state.phase === "play") tick(state, dt);
  if ((state.phase === "won" || state.phase === "lost") && savedFor !== state) {
    best = persist(state);
    savedFor = state;
    state.rev += 1;
  }
  if (state.rev !== seen) {
    render();
    seen = state.rev;
  }
  paint();
  flushToasts();
  requestAnimationFrame(loop);
}

function reset() {
  state = freshState(seed());
  buildOpening(state);
  savedFor = null;
  seen = -1;
  best = loadBest();
}

function render() {
  const scrolls = [queueEl, rosterEl, upgradesEl, feedEl].map((node) => node.scrollTop);
  document.body.dataset.phase = state.phase;
  queueEl.innerHTML = ordered(state.tasks).map(renderTask).join("");
  rosterEl.innerHTML = renderRoster();
  upgradesEl.innerHTML = UPGRADES.map((upgrade) => renderUpgrade(upgrade)).join("");
  feedEl.innerHTML = `<ul class="feed">${state.feed.map((item) => `<li>${esc(item.text)}</li>`).join("")}</ul>`;
  [queueEl, rosterEl, upgradesEl, feedEl].forEach((node, index) => {
    node.scrollTop = scrolls[index];
  });
  renderOverlay();
}

function renderTask(task) {
  const mods = modifiers(state);
  const payout = payoutFor(task, mods);
  const solo = Math.round(pace(task, null, mods, 1).duration);
  const bestFit = fastest(task, mods);
  const accent = SKILL_COLOR[task.skill] || "#a9782e";
  const picked = state.picking === task.uid;
  const ready = state.staff.some((person) => person.status === "ready");
  const classes = ["task", task.locked ? "is-locked" : "", task.staffId ? "is-working" : "", picked ? "is-picked" : ""]
    .filter(Boolean)
    .join(" ");
  let action = "";
  if (task.locked) {
    action = `<p class="lockline">Locked — finish Client MOU Approval</p><button class="btn full" type="button" disabled>Assign Staff</button>`;
  } else if (task.staffId) {
    const staff = state.staff.find((person) => person.id === task.staffId);
    action = `
      <div class="bar-row"><span>${esc(staff ? staff.name : "Staff")} · <span data-pace="${task.uid}">In production</span></span><span data-bar-label="${task.uid}">0%</span></div>
      <div class="track"><span data-bar="${task.uid}"></span></div>`;
  } else {
    const disabled = state.phase !== "play" || !ready;
    const label = picked ? "Cancel" : "Assign Staff";
    const actionName = picked ? "cancel" : "pick";
    const reason = !ready && state.phase === "play" ? `<p class="reason">Everyone is on a job.</p>` : "";
    action = `<button class="btn full ${picked ? "ghost" : ""}" type="button" data-action="${actionName}" data-uid="${task.uid}" ${disabled ? "disabled" : ""}>${label}</button>${reason}`;
  }
  const hold = !task.locked && !task.staffId && task.patienceLeft != null
    ? `<div class="bar-row"><span>Client hold</span><span data-patience-label="${task.uid}">${Math.ceil(task.patienceLeft)}s hold</span></div>
       <div class="track patience"><span data-patience="${task.uid}"></span></div>`
    : "";
  return `
    <article class="${classes}" style="--accent:${accent}">
      <div class="task-top">
        <p class="client">${esc(task.client)}</p>
        <p class="reward">${money(payout)}</p>
      </div>
      <h3>${esc(task.name)}</h3>
      <p class="blurb">${esc(task.blurb)}</p>
      <div class="tags">
        ${tag(task.skill, "is-hit")}
        ${task.secondary ? tag(task.secondary) : ""}
      </div>
      <p class="blurb">Solo ${solo}s · ${esc(bestFit.name)} can land it in ${bestFit.seconds}s</p>
      ${hold}
      ${action}
    </article>`;
}

function renderRoster() {
  const mods = modifiers(state);
  const picked = state.tasks.find((task) => task.uid === state.picking);
  const banner = picked
    ? `<div class="pick-banner"><p><strong>Choose a ready teammate</strong> for ${esc(picked.name)}. Highlighted tags match the brief.</p><button class="btn gold" type="button" data-action="cancel">Cancel</button></div>`
    : "";
  const cards = state.staff.map((person) => {
    const working = person.status === "working";
    const tier = picked && !working ? pace(picked, person, mods, 1).tier : "none";
    const matchClass = !picked || working ? "" : tier === "both" || tier === "primary" ? "is-great" : tier === "secondary" ? "is-ok" : "is-stretch";
    const chip = !picked || working ? "" : `<p class="chip">${tierLabel(tier)}</p>`;
    const job = working ? state.tasks.find((task) => task.uid === person.taskUid) : null;
    const progress = job
      ? `<div class="bar-row"><span>${esc(job.name)}</span></div><div class="track"><span data-staff-bar="${person.id}"></span></div>`
      : "";
    const hot = tier === "both" || tier === "primary";
    const button = picked && !working
      ? `<button class="btn ${hot ? "gold" : "ghost"} full" type="button" data-action="assign" data-staff="${person.id}">Assign ${esc(person.name)}</button>`
      : "";
    const hit = (skill) => (picked && (picked.skill === skill || picked.secondary === skill) ? "is-hit" : "");
    return `
      <article class="person ${working ? "is-working is-busy" : "is-ready"} ${matchClass}">
        <div class="person-top">
          ${avatar(person.id)}
          <div class="person-id">
            <div>
              <h3>${esc(person.name)}</h3>
              <p class="role">${esc(person.role)}</p>
              <p class="status"><i></i>${working ? "Working" : "Ready"}</p>
              ${chip}
            </div>
          </div>
        </div>
        <div class="tags">${person.specialties.map((skill) => tag(skill, hit(skill))).join("")}</div>
        ${progress}
        ${button}
      </article>`;
  });
  return `${banner}<div class="roster-grid">${cards.join("")}</div>`;
}

function renderUpgrade(upgrade) {
  const level = state.levels[upgrade.id] || 0;
  const maxed = level >= upgrade.max;
  const cost = maxed ? 0 : upgrade.costs[level];
  const afford = state.phase === "play" && !maxed && state.cash >= cost;
  const label = maxed ? "Installed" : level === 0 ? `Install · ${money(cost)}` : `Upgrade · ${money(cost)}`;
  const reason = !maxed && state.phase === "play" && state.cash < cost ? `<p class="reason">Need ${money(cost - state.cash)} more budget.</p>` : "";
  return `
    <article class="perk">
      <div class="perk-top">
        <h3>${esc(upgrade.name)}</h3>
        <p class="level">Lv ${level}/${upgrade.max}</p>
      </div>
      <p class="blurb">${esc(upgrade.desc)}</p>
      <p class="effect">${esc(nextEffectLabel(upgrade, level))}</p>
      <button class="btn gold full" type="button" data-action="buy" data-id="${upgrade.id}" ${afford ? "" : "disabled"}>${label}</button>
      ${reason}
    </article>`;
}

function renderOverlay() {
  const playing = state.phase === "play";
  overlayEl.hidden = playing;
  boardEl.inert = !playing;
  if (playing) {
    overlayEl.innerHTML = "";
    return;
  }
  if (state.phase === "title") {
    const record = best
      ? `<p class="best">Best run ${money(best.lifetime)}${best.wins ? ` · ${best.wins} shutdown${best.wins === 1 ? "" : "s"} cleared` : ""}.</p>`
      : "";
    overlayEl.innerHTML = `
      <section class="modal">
        <p class="kicker">Ignite · Holiday Edition</p>
        <h2>The Q4 Rush</h2>
        <p class="lede">The floor is yours until Christmas Eve lockout. Sign the MOU, staff the queue, and bank $100,000 in lifetime ROI.</p>
        <ol class="steps">
          <li>Assign Staff on Client MOU Approval. Coree-Ann and Jessica carry that specialty.</li>
          <li>Match skills to finish faster. Mismatches still ship — they just take longer.</li>
          <li>Keep coffee and morale off empty, and spend budget on perks. Spending does not lower the $100k goal.</li>
        </ol>
        ${record}
        <button class="btn gold" type="button" data-action="start">Open the office</button>
      </section>`;
    return;
  }
  const won = state.phase === "won";
  const greeting = GREETINGS[state.stats.delivered % GREETINGS.length];
  const headline = won ? "The lights can go down." : "The lockout hit.";
  const lede = won
    ? greeting
    : `Christmas Eve arrived with ${money(GOAL - state.lifetime)} still on the board. The tree stays up. The quarter does not.`;
  overlayEl.innerHTML = `
    ${won ? `<div class="confetti" aria-hidden="true">${confetti()}</div>` : ""}
    <section class="modal">
      <p class="kicker">${won ? "Holiday shutdown" : "Christmas Eve"}</p>
      <h2>${headline}</h2>
      <p class="lede">${lede}</p>
      <dl class="stats">
        <div><dt>Lifetime ROI</dt><dd>${money(state.lifetime)}</dd></div>
        <div><dt>${won ? "Clock left" : "Shortfall"}</dt><dd>${won ? formatClock(state.timeLeft) : money(GOAL - state.lifetime)}</dd></div>
        <div><dt>Delivered</dt><dd>${state.stats.delivered}</dd></div>
        <div><dt>Clients walked</dt><dd>${state.stats.missed}</dd></div>
        <div><dt>Specialty matches</dt><dd>${state.stats.matches}</dd></div>
        <div><dt>Perks installed</dt><dd>${state.stats.perks}</dd></div>
      </dl>
      <button class="btn gold" type="button" data-action="retry">Run it back</button>
    </section>`;
}

function paint() {
  const mods = modifiers(state);
  const factor = resourceFactor(state);
  const roi = document.getElementById("roi-value");
  const nextRoi = `${money(state.lifetime)} / ${money(GOAL)}`;
  if (roi.textContent !== nextRoi) {
    roi.textContent = nextRoi;
    roi.classList.remove("pop");
    void roi.offsetWidth;
    roi.classList.add("pop");
  }
  document.getElementById("roi-fill").style.width = `${Math.min(100, (state.lifetime / GOAL) * 100)}%`;
  document.getElementById("budget").textContent = money(state.cash);
  document.getElementById("budget-side").textContent = money(state.cash);
  setMeter("coffee", state.coffee);
  setMeter("morale", state.morale);

  const clock = document.getElementById("clock");
  clock.textContent = formatClock(state.timeLeft);
  clock.classList.toggle("is-late", state.phase === "play" && state.timeLeft <= 60);
  clock.classList.toggle("is-critical", state.phase === "play" && state.timeLeft <= 20);

  const fumes = document.getElementById("fumes");
  const showFumes = state.phase === "play" && factor < 1;
  fumes.hidden = !showFumes;
  if (showFumes) {
    if (state.coffee <= 0.05 && state.morale <= 0.05) {
      fumes.textContent = "Coffee and morale are both empty. Every job just slowed to a crawl.";
    } else if (state.coffee <= 0.05) {
      fumes.textContent = "Coffee is out. The floor is moving at a crawl until the machine catches up.";
    } else {
      fumes.textContent = "Morale is out. Work is still moving, just nowhere near holiday speed.";
    }
  }

  const working = state.staff.filter((person) => person.status === "working").length;
  document.getElementById("roster-meta").textContent = `${state.staff.length - working} ready · ${working} working`;
  const open = state.tasks.filter((task) => !task.locked).length;
  document.getElementById("queue-meta").textContent = state.mouCleared ? `${open} live on the board` : "MOU is the gate";

  for (const task of state.tasks) {
    const bar = document.querySelector(`[data-bar="${task.uid}"]`);
    if (bar) bar.style.width = `${task.progress}%`;
    const label = document.querySelector(`[data-bar-label="${task.uid}"]`);
    if (label) label.textContent = `${Math.floor(task.progress)}%`;
    const patience = document.querySelector(`[data-patience="${task.uid}"]`);
    if (patience && task.patience) {
      patience.style.width = `${Math.max(0, (task.patienceLeft / task.patience) * 100)}%`;
      patience.parentElement.classList.toggle("is-urgent", task.patienceLeft < 15);
      patience.closest(".task")?.classList.toggle("is-urgent", task.patienceLeft < 15);
    }
    const patienceLabel = document.querySelector(`[data-patience-label="${task.uid}"]`);
    if (patienceLabel && task.patienceLeft != null) patienceLabel.textContent = `${Math.max(0, Math.ceil(task.patienceLeft))}s hold`;
    const paceNode = document.querySelector(`[data-pace="${task.uid}"]`);
    if (paceNode && task.staffId) {
      const staff = state.staff.find((person) => person.id === task.staffId);
      const rating = pace(task, staff, mods, factor);
      const solo = pace(task, null, mods, 1).duration;
      const speed = solo / pace(task, staff, mods, 1).duration;
      paceNode.textContent = `${tierLabel(rating.tier)} · ${speed.toFixed(1)}×${factor < 1 ? " · fumes" : ""}`;
    }
    const staffBar = task.staffId ? document.querySelector(`[data-staff-bar="${task.staffId}"]`) : null;
    if (staffBar) staffBar.style.width = `${task.progress}%`;
  }
}

function flushToasts() {
  for (const toast of state.toasts) {
    if (toastEl.querySelector(`[data-toast="${toast.id}"]`)) continue;
    const node = document.createElement("div");
    node.className = `toast toast-${toast.tone}`;
    node.dataset.toast = String(toast.id);
    node.textContent = toast.text;
    toastEl.appendChild(node);
    window.setTimeout(() => {
      node.classList.add("is-out");
      window.setTimeout(() => {
        node.remove();
        state.toasts = state.toasts.filter((item) => item.id !== toast.id);
      }, 250);
    }, 3400);
  }
}

function mountAtmosphere() {
  const snow = document.getElementById("snow");
  snow.innerHTML = Array.from({ length: 28 }, (_, index) => {
    const left = (index * 37) % 100;
    const delay = ((index % 9) * 0.7).toFixed(2);
    const duration = 9 + (index % 6) * 1.6;
    const size = 4 + (index % 4);
    const opacity = (0.35 + (index % 5) * 0.1).toFixed(2);
    return `<span style="left:${left}%; animation-delay:${delay}s; animation-duration:${duration}s; width:${size}px; height:${size}px; opacity:${opacity}"></span>`;
  }).join("");

  const bulbs = ["#e6b45a", "#9d3140", "#7dcea0", "#f6f0e6", "#e07a86"];
  document.getElementById("lights").innerHTML = Array.from({ length: 22 }, (_, index) => {
    return `<i style="--i:${index}; --bulb:${bulbs[index % bulbs.length]}"></i>`;
  }).join("");

  const jokes = [...JOKES, ...JOKES];
  document.getElementById("marquee").innerHTML = `<div class="marquee-track">${jokes.map((joke) => `<span>${esc(joke)}</span>`).join("")}</div>`;
}

function setMeter(name, value) {
  document.getElementById(`${name}-value`).textContent = `${Math.round(value)}%`;
  document.getElementById(`${name}-fill`).style.width = `${value}%`;
  document.getElementById(`${name}-meter`).classList.toggle("is-low", value <= 12);
}

function ordered(tasks) {
  return [...tasks].sort((a, b) => {
    const rank = (task) => (task.locked ? 2 : task.staffId ? 1 : 0);
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    return (a.patienceLeft ?? 999) - (b.patienceLeft ?? 999);
  });
}

function fastest(task, mods) {
  let name = "A generalist";
  let seconds = Math.round(pace(task, null, mods, 1).duration);
  for (const person of state.staff) {
    const duration = Math.round(pace(task, person, mods, 1).duration);
    if (duration < seconds) {
      seconds = duration;
      name = person.name;
    }
  }
  return { name, seconds };
}

function tag(skill, extra = "") {
  const color = SKILL_COLOR[skill] || "#5c5346";
  return `<span class="tag ${extra}" style="--skill:${color}">${esc(skill)}</span>`;
}

function avatar(id) {
  if (PORTRAITS[id]) return `<img class="avatar" alt="" src="${esc(PORTRAITS[id])}" />`;
  return `<svg class="avatar" viewBox="0 0 64 64" aria-hidden="true">${LOOKS[id]}</svg>`;
}

function confetti() {
  const colors = ["#e6b45a", "#f6f0e6", "#9d3140", "#7dcea0", "#f0d7a2"];
  return Array.from({ length: 32 }, (_, index) => {
    const left = (index * 31) % 100;
    const delay = ((index % 10) * 0.15).toFixed(2);
    const duration = (2.6 + (index % 5) * 0.4).toFixed(2);
    return `<i style="left:${left}%; animation: fall ${duration}s linear ${delay}s infinite; background:${colors[index % colors.length]}"></i>`;
  }).join("");
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function seed() {
  return (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
}

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem("q4-rush-best") || "null");
  } catch {
    return null;
  }
}

function persist(current) {
  const prev = loadBest() || {};
  const next = {
    lifetime: Math.max(prev.lifetime || 0, Math.round(current.lifetime)),
    wins: (prev.wins || 0) + (current.phase === "won" ? 1 : 0),
    bestLeft: current.phase === "won" ? Math.max(prev.bestLeft || 0, Math.round(current.timeLeft)) : prev.bestLeft || 0,
  };
  try {
    localStorage.setItem("q4-rush-best", JSON.stringify(next));
  } catch {
    /* Storage can be blocked. The shift still stands. */
  }
  return next;
}
