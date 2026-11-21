import { toySvg, TRAIN_COST, UPGRADES } from "./catalog.js";
import { loadConfig } from "./config.js";
import {
  beginDay,
  buy,
  createGame,
  nextDay,
  portWorlds,
  queueMax,
  snapSpin,
  tapBelt,
  tapStation,
  tick,
  train,
  worldOf,
} from "./engine.js";

const SHOP_ICONS = {
  queue: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="6" cy="16" r="3" fill="#3a2218"/><circle cx="16" cy="16" r="3" fill="#3a2218"/><circle cx="26" cy="16" r="3" fill="#3a2218"/></svg>`,
  track: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 16h18M16 8l8 8-8 8" fill="none" stroke="#c23b4a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  slots: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="8" width="10" height="16" rx="3" fill="none" stroke="#c47a22" stroke-width="2.4"/><rect x="19" y="8" width="10" height="16" rx="3" fill="none" stroke="#c47a22" stroke-width="2.4"/></svg>`,
  cheer: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 12h12v6.2A4.2 4.2 0 0 1 15.8 22h-3.6A4.2 4.2 0 0 1 8 17.8V12z" fill="none" stroke="#e0a03a" stroke-width="2.4"/><path d="M20 14h3a3 3 0 0 1 0 6h-3" fill="none" stroke="#e0a03a" stroke-width="2.4"/><path d="M12 8c.4 1.2 0 1.8.5 2.6M16 8c.4 1.2 0 1.8.5 2.6" fill="none" stroke="#e0a03a" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  station: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="10" fill="none" stroke="#1f8a4c" stroke-width="2.4"/><path d="M16 10v12M10 16h12" stroke="#1f8a4c" stroke-width="2.4" stroke-linecap="round"/></svg>`,
};

let state = createGame(loadConfig(location.search), (Date.now() ^ (Math.random() * 1e9)) >>> 0);
let drag = null;
let lastBurst = 0;
let boardLoaded = false;
const anims = new Set();

const dayEl = document.getElementById("day");
const cashEl = document.getElementById("cash");
const cheerFill = document.getElementById("cheer-fill");
const cheerNum = document.getElementById("cheer-num");
const dayFill = document.getElementById("day-fill");
const floorEl = document.getElementById("floor");
const helpEl = document.getElementById("help");
const shopEl = document.getElementById("shop");
const overlayEl = document.getElementById("overlay");

mountAtmosphere();
requestAnimationFrame(frame);

document.body.addEventListener("pointerdown", onPointerDown);
document.body.addEventListener("pointermove", onPointerMove);
document.body.addEventListener("pointerup", onPointerUp);
document.body.addEventListener("pointercancel", onPointerUp);
document.body.addEventListener("click", onClick);
document.body.addEventListener("submit", onSubmit);

function frame(now) {
  const previous = frame.last || now;
  frame.last = now;
  const dt = document.hidden ? 0 : Math.min(0.05, (now - previous) / 1000);
  if (state.phase === "play") tick(state, dt);
  sync();
  paint();
  requestAnimationFrame(frame);
}

function onPointerDown(event) {
  if (helpEl && !helpEl.hidden && !event.target.closest(".help") && !event.target.closest("[data-action=help]")) {
    helpEl.hidden = true;
  }
  if (state.phase !== "play" || drag) return;
  const held = event.target.closest("[data-held]");
  if (held) {
    tapStation(state, Number(held.dataset.station), Number(held.dataset.slot));
    return;
  }
  if (!event.target.closest("#stage")) return;
  const center = beltCenter();
  drag = {
    id: event.pointerId,
    cx: center.cx,
    cy: center.cy,
    angle: Math.atan2(event.clientY - center.cy, event.clientX - center.cx),
    spin: state.spin,
    x: event.clientX,
    y: event.clientY,
    moved: false,
    belt: event.target.closest("[data-belt]") ? Number(event.target.closest("[data-belt]").dataset.belt) : null,
  };
  state.dragging = true;
  floorEl.setPointerCapture?.(event.pointerId);
}

function onPointerMove(event) {
  if (!drag || event.pointerId !== drag.id) return;
  const angle = Math.atan2(event.clientY - drag.cy, event.clientX - drag.cx);
  let delta = angle - drag.angle;
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  drag.angle = angle;
  drag.spin += (delta / (Math.PI * 2)) * state.belt.length;
  if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 8) drag.moved = true;
  if (drag.moved) state.spin = drag.spin;
}

function onPointerUp(event) {
  if (!drag || event.pointerId !== drag.id) return;
  const belt = drag.belt;
  const moved = drag.moved;
  drag = null;
  state.dragging = false;
  if (!moved && belt != null) tapBelt(state, belt);
  else snapSpin(state);
}

function onClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "help") {
    helpEl.hidden = !helpEl.hidden;
    return;
  }
  if (action === "start") beginDay(state);
  if (action === "next") nextDay(state);
  if (action === "buy") buy(state, button.dataset.upgrade);
  if (action === "train") train(state, button.dataset.elf);
  if (action === "again") again();
}

function onSubmit(event) {
  if (event.target.id !== "score-form") return;
  event.preventDefault();
  submitScore(event.target);
}

function again() {
  state = createGame(loadConfig(location.search), (Date.now() ^ (Math.random() * 1e9)) >>> 0);
  lastBurst = 0;
  boardLoaded = false;
  document.getElementById("stations").innerHTML = "";
  document.getElementById("lane").dataset.sig = "";
  document.getElementById("pips").dataset.sig = "";
  shopEl.dataset.sig = "";
  overlayEl.dataset.sig = "";
  document.getElementById("siren")?.remove();
}

function sync() {
  floorEl.hidden = state.phase === "title" || state.phase === "results";
  syncPips();
  syncSiren();
  syncLane();
  syncBelt();
  syncStations();
  syncShop();
  syncOverlay();
  if (state.burst && state.burst.token !== lastBurst) {
    lastBurst = state.burst.token;
    spawnBurst(state.burst.station);
  }
  sweepAnims();
}

function syncPips() {
  const root = document.getElementById("pips");
  const working = new Set(state.stations.map((station) => station.elfId));
  const reserve = new Set(state.reserves);
  const html = state.elves.map((elf) => {
    const mode = state.exhausted.includes(elf.id) ? "out" : working.has(elf.id) ? "on" : reserve.has(elf.id) ? "wait" : "out";
    return `<i class="pip is-${mode}" style="--hue:${elf.hue}"></i>`;
  }).join("");
  if (root.dataset.sig !== html) {
    root.dataset.sig = html;
    root.innerHTML = html;
  }
}

function syncSiren() {
  const on = state.phase === "play" && (state.rushLeft > 0 || state.jam);
  const el = document.getElementById("siren");
  if (on && !el) {
    const node = document.createElement("div");
    node.id = "siren";
    node.dataset.lottie = "siren";
    document.querySelector(".top").appendChild(node);
    mountLotties(node);
  } else if (!on && el) el.remove();
}

function syncLane() {
  const lane = document.getElementById("lane");
  const full = state.queue.length >= queueMax(state);
  const sig = `${state.queue.map((toy) => toy.uid).join(".")}:${full}:${state.rushLeft > 0}`;
  lane.classList.toggle("is-full", full);
  lane.classList.toggle("is-rush", state.rushLeft > 0);
  if (lane.dataset.sig === sig) return;
  lane.dataset.sig = sig;
  const waiting = [...state.queue].reverse();
  lane.innerHTML = waiting.map((toy) => `<span class="qtoy">${toySvg(toy.type)}</span>`).join("");
}

function syncBelt() {
  const belt = document.getElementById("belt");
  while (belt.children.length < state.belt.length) {
    const cup = document.createElement("button");
    cup.type = "button";
    cup.className = "cup";
    cup.dataset.belt = String(belt.children.length);
    belt.appendChild(cup);
  }
  [...belt.children].forEach((cup, index) => {
    const toy = state.belt[index];
    const uid = toy ? String(toy.uid) : "";
    if (cup.dataset.uid === uid) return;
    cup.dataset.uid = uid;
    cup.innerHTML = toy ? toySvg(toy.type) : "";
    cup.setAttribute("aria-label", toy ? "Toy" : "Empty cup");
  });
}

function syncStations() {
  const root = document.getElementById("stations");
  if (root.children.length !== state.stations.length) {
    root.innerHTML = state.stations.map((station, index) => stationHtml(station, index)).join("");
    mountLotties(root);
    return;
  }
  state.stations.forEach((station, index) => {
    const sig = stationSig(station, index);
    const node = root.children[index];
    if (node?.dataset.sig === sig) return;
    const fresh = document.createElement("template");
    fresh.innerHTML = stationHtml(station, index);
    node.replaceWith(fresh.content.firstElementChild);
    mountLotties(root.children[index]);
  });
}

function stationSig(station, index) {
  const elf = state.elves.find((item) => item.id === station.elfId);
  const jammed = state.jam && state.jam.station === index ? 1 : 0;
  return [
    station.elfId,
    elf?.absentLeft > 0 ? 1 : 0,
    jammed,
    station.list.join("."),
    station.slots.map((toy) => toy?.uid || 0).join("."),
  ].join("|");
}

function stationHtml(station, index) {
  const elf = state.elves.find((item) => item.id === station.elfId);
  const absent = elf.absentLeft > 0;
  const jammed = state.jam && state.jam.station === index;
  return `<article class="station${absent ? " is-absent" : ""}${jammed ? " is-jam" : ""}" data-sig="${stationSig(station, index)}" style="--hue:${elf.hue}">
    <div class="elf"><div class="avatar-lottie" data-lottie="${elf.id}"></div></div>
    <div class="list">${station.list.map((id) => toySvg(id)).join("")}</div>
    <div class="holds">${station.slots.map((toy, slot) => `<button type="button" class="hold" data-held data-station="${index}" data-slot="${slot}" aria-label="${toy ? "Toy" : "Empty"}">${toy ? toySvg(toy.type) : ""}</button>`).join("")}</div>
  </article>`;
}

function syncShop() {
  if (state.phase !== "shop") {
    shopEl.hidden = true;
    return;
  }
  const sig = JSON.stringify({
    cash: state.cash,
    upgrades: state.upgrades,
    elves: state.elves.map((elf) => [elf.id, elf.pending, elf.speed, state.exhausted.includes(elf.id)]),
    reserves: state.reserves.length,
    stations: state.stations.length,
  });
  shopEl.hidden = false;
  if (shopEl.dataset.sig === sig) return;
  shopEl.dataset.sig = sig;
  const offers = UPGRADES.map((upgrade) => {
    const level = state.upgrades[upgrade.id] || 0;
    const done = level >= upgrade.max;
    const blocked = upgrade.id === "station" && (!state.reserves.length || state.stations.length >= 4);
    const cost = done ? "" : upgrade.costs[level];
    const affordable = !done && !blocked && state.cash >= cost;
    return `<button type="button" class="offer" data-action="buy" data-upgrade="${upgrade.id}" ${affordable ? "" : "disabled"} aria-label="${upgrade.id}">${SHOP_ICONS[upgrade.id]}<b>${done ? "✓" : cost}</b></button>`;
  }).join("");
  const trainees = state.elves.filter((elf) => !state.exhausted.includes(elf.id)).map((elf) => {
    const ready = !elf.pending && elf.speed >= 1 && state.cash >= TRAIN_COST;
    const mark = elf.speed < 1 ? "✓" : elf.pending ? "…" : TRAIN_COST;
    return `<button type="button" class="trainee" style="--hue:${elf.hue}" data-action="train" data-elf="${elf.id}" ${ready ? "" : "disabled"} aria-label="Train elf"><b>${mark}</b></button>`;
  }).join("");
  shopEl.innerHTML = `<div class="card"><p class="sheet-cash">${state.cash}</p><div class="offers">${offers}</div><div class="trainees">${trainees}</div><button type="button" class="next" data-action="next" aria-label="Next day">✓</button></div>`;
}

function syncOverlay() {
  if (state.phase !== "title" && state.phase !== "results") {
    overlayEl.hidden = true;
    return;
  }
  overlayEl.hidden = false;
  const sig = state.phase;
  if (overlayEl.dataset.sig === sig) return;
  overlayEl.dataset.sig = sig;
  boardLoaded = false;
  if (state.phase === "title") {
    overlayEl.innerHTML = `<div class="cover"><img class="logo" src="img/ignite.png" alt="" /><button type="button" class="go" data-action="start">Start</button></div>`;
    return;
  }
  overlayEl.innerHTML = `<div class="cover"><p class="score">${state.earned}</p><form id="score-form"><input name="name" autocomplete="nickname" maxlength="24" aria-label="Name" required /><input name="email" type="email" autocomplete="email" maxlength="120" aria-label="Email" required /><button type="submit" class="go">Save</button></form><p class="note" id="board-note"></p><ol class="board" id="board-list"></ol><button type="button" class="again" data-action="again" aria-label="Play again">↻</button></div>`;
  loadBoard(state.earned);
}

function paint() {
  dayEl.textContent = String(Math.max(state.day, 1));
  cashEl.textContent = String(state.earned);
  const cheerRatio = state.cheerMax ? state.cheer / state.cheerMax : 0;
  cheerFill.style.width = `${Math.max(0, Math.min(1, cheerRatio)) * 100}%`;
  cheerNum.textContent = String(Math.max(0, Math.round(state.cheer)));
  const span = state.config.dayLengthSeconds || 1;
  const gone = state.phase === "play" ? 1 - state.dayLeft / span : state.phase === "title" ? 0 : 1;
  dayFill.style.width = `${Math.max(0, Math.min(1, gone)) * 100}%`;
  if (floorEl.hidden) return;
  const box = metrics();
  if (!box) return;
  const ring = document.getElementById("ring");
  const diameter = box.r * 2 + 36;
  ring.style.width = `${diameter}px`;
  ring.style.height = `${diameter}px`;
  ring.style.left = `${box.sx - diameter / 2}px`;
  ring.style.top = `${box.sy - diameter / 2}px`;
  const n = state.belt.length;
  const ports = portWorlds(state.stations.length);
  for (const cup of document.querySelectorAll(".cup")) {
    const world = worldOf(Number(cup.dataset.belt), state.spin, n);
    const angle = -Math.PI / 2 + (world / n) * Math.PI * 2;
    cup.style.left = `${box.sx + Math.cos(angle) * box.r}px`;
    cup.style.top = `${box.sy + Math.sin(angle) * box.r}px`;
    cup.classList.toggle("is-intake", circ(world, 0, n) < 0.34);
    cup.classList.toggle("is-port", ports.some((port) => circ(world, port, n) < 0.34));
  }
  paintWires(box);
}

function paintWires(box) {
  const wires = document.getElementById("wires");
  const riders = document.getElementById("riders");
  const cards = [...document.querySelectorAll(".station")];
  const n = state.belt.length;
  const ends = [];
  let markup = "";
  portWorlds(state.stations.length).forEach((world, index) => {
    const angle = -Math.PI / 2 + (world / n) * Math.PI * 2;
    const x1 = box.fx + Math.cos(angle) * (box.r + 22);
    const y1 = box.fy + Math.sin(angle) * (box.r + 22);
    const card = cards[index]?.getBoundingClientRect();
    if (!card) return;
    const x2 = card.left - box.floor.left + card.width / 2;
    const y2 = card.top - box.floor.top + 4;
    const jammed = state.jam && state.jam.station === index;
    markup += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${jammed ? "#e23d3d" : "#c47a22"}" stroke-width="${jammed ? 8 : 6}" stroke-linecap="round" ${jammed ? 'stroke-dasharray="8 8"' : ""}/>`;
    ends.push({ x1, y1, x2, y2 });
  });
  if (wires.dataset.sig !== markup) {
    wires.dataset.sig = markup;
    wires.innerHTML = markup;
  }
  const active = [];
  state.tracks.forEach((track, index) => {
    if (!track || !ends[index]) return;
    const end = ends[index];
    const x = end.x1 + (end.x2 - end.x1) * track.t;
    const y = end.y1 + (end.y2 - end.y1) * track.t;
    active.push({ uid: track.toy.uid, type: track.toy.type, x, y });
  });
  const sig = active.map((item) => item.uid).join(".");
  if (riders.dataset.sig !== sig) {
    riders.dataset.sig = sig;
    riders.innerHTML = active.map((item) => `<div class="rider" data-rider="${item.uid}">${toySvg(item.type)}</div>`).join("");
  }
  for (const item of active) {
    const node = riders.querySelector(`[data-rider="${item.uid}"]`);
    if (!node) continue;
    node.style.left = `${item.x}px`;
    node.style.top = `${item.y}px`;
  }
}

function beltCenter() {
  const stage = document.getElementById("stage").getBoundingClientRect();
  const box = metrics();
  if (!box) return { cx: stage.left + stage.width / 2, cy: stage.top + stage.height / 2 };
  return { cx: stage.left + box.sx, cy: stage.top + box.sy };
}

function metrics() {
  const floor = floorEl.getBoundingClientRect();
  const stage = document.getElementById("stage").getBoundingClientRect();
  if (stage.width < 20 || stage.height < 20) return null;
  const size = Math.min(stage.width, stage.height);
  const r = Math.max(64, Math.min(128, size * 0.33));
  return {
    r,
    sx: stage.width / 2,
    sy: Math.min(stage.height * 0.46, r + 28),
    fx: stage.left - floor.left + stage.width / 2,
    fy: stage.top - floor.top + Math.min(stage.height * 0.46, r + 28),
    floor,
  };
}

function spawnBurst(stationIndex) {
  const card = document.querySelectorAll(".station")[stationIndex];
  if (!card) return;
  const el = document.createElement("div");
  el.className = "burst";
  el.dataset.lottie = "burst";
  card.querySelector(".elf")?.appendChild(el);
  mountLotties(el);
  window.setTimeout(() => el.remove(), 900);
}

function mountLotties(root) {
  if (!window.lottie || !root) return;
  for (const el of root.matches?.("[data-lottie]") ? [root, ...root.querySelectorAll("[data-lottie]")] : root.querySelectorAll("[data-lottie]")) {
    if (el.dataset.mounted === "1") continue;
    el.dataset.mounted = "1";
    const anim = window.lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: el.dataset.lottie !== "burst",
      autoplay: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      path: `lottie/${el.dataset.lottie}.json`,
    });
    anims.add({ el, anim });
  }
}

function sweepAnims() {
  for (const entry of anims) {
    if (entry.el.isConnected) continue;
    entry.anim.destroy();
    anims.delete(entry);
  }
}

function circ(a, b, n) {
  const d = Math.abs(a - b) % n;
  return Math.min(d, n - d);
}

function mountAtmosphere() {
  const bulbs = ["#e23d3d", "#fff", "#1f8a4c", "#f2c14b"];
  document.getElementById("lights").innerHTML = Array.from({ length: 14 }, (_, index) => {
    return `<i style="--i:${index};--bulb:${bulbs[index % bulbs.length]}"></i>`;
  }).join("");
  document.getElementById("snow").innerHTML = Array.from({ length: 36 }, (_, index) => {
    const left = (index * 37) % 100;
    const delay = ((index % 12) * 0.6).toFixed(2);
    const duration = (8 + (index % 6)).toFixed(2);
    const size = 3 + (index % 4);
    return `<span style="left:${left}%;animation-duration:${duration}s;animation-delay:-${delay}s;width:${size}px;height:${size}px;opacity:${(0.35 + (index % 5) * 0.1).toFixed(2)}"></span>`;
  }).join("");
}

async function loadBoard(score) {
  const list = document.getElementById("board-list");
  const note = document.getElementById("board-note");
  const form = document.getElementById("score-form");
  if (!list || boardLoaded) return;
  boardLoaded = true;
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
    if (note && document.body.contains(note)) note.textContent = "This host can't store the board. The Top 10 list needs PHP.";
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
        score: state.earned,
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
    form.hidden = true;
    if (note) note.textContent = "Saved.";
  } catch {
    if (note) note.textContent = "This host can't store the board. The Top 10 list needs PHP.";
    button.disabled = false;
  }
}

function paintBoard(rows) {
  const list = document.getElementById("board-list");
  if (!list) return;
  list.innerHTML = rows.map((row) => `<li><span>${esc(row.name)}</span><span>${Math.round(Number(row.score) || 0)}</span></li>`).join("");
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
