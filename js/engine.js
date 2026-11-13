import { CONFIG, morningHours, secondsPerGameHour, shownHours } from "./config.js";
import { EVENTS, PERKS, SKILL_TREES, STAFF, WORK } from "./catalog.js";

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function createGame(overrides = {}, seed = 1) {
  const config = { ...CONFIG, ...overrides };
  return {
    config,
    phase: "title",
    day: 1,
    dayLeft: config.dayLengthSeconds,
    cash: 0,
    earned: 0,
    earnedToday: 0,
    coffee: 100,
    morale: 100,
    /** Beer break leaves jobs slower until the next morning. */
    beerSlow: false,
    tray: [],
    tasks: [],
    staff: STAFF.map((person) => ({
      id: person.id,
      name: person.name,
      role: person.role,
      specialties: person.specialties.slice(),
      hue: person.hue,
      trained: 0,
      pendingTier: 0,
      trainLeft: 0,
      trainSpan: 0,
      active: null,
      queue: [],
    })),
    perks: {},
    pendingPerks: {},
    clearedEvents: [],
    eventIn: null,
    spawnIn: 0.4,
    uid: 1,
    rev: 0,
    notice: "",
    rand: mulberry32(seed),
    stats: { delivered: 0, expired: 0, events: 0 },
  };
}

export function money(n) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function hoursLeft(state) {
  const simHours = state.dayLeft / secondsPerGameHour(state.config);
  return shownHours(state.config, simHours);
}

function touch(state) {
  state.rev += 1;
}

function taskById(state, uid) {
  return state.tasks.find((task) => task.uid === uid) || null;
}

function liveTasks(state) {
  return state.tasks;
}

export function skillsOf(staff) {
  const skills = staff.specialties.slice();
  const tier = staff.trained;
  if (staff.id === "brandon" && tier >= 3) skills.push("FB Ads");
  if (staff.id === "tomas" && tier >= 3) skills.push("UI");
  if (staff.id === "sean" && tier >= 3) skills.push("Social");
  if (staff.id === "kajal" && tier >= 3) skills.push("Web Dev");
  if (staff.id === "jessica" && tier >= 3) skills.push("Strategy");
  return skills;
}

function perkLevel(state, id) {
  return state.perks[id] || 0;
}

function modifiers(state) {
  const mods = {
    coffeeRegen: 5.5,
    moraleRegen: 4,
    coffeeDrain: 4.6,
    moraleDrain: 3.2,
    reward: 0,
  };
  const jessica = state.staff.find((person) => person.id === "jessica");
  if (jessica && jessica.trained >= 2) {
    mods.coffeeDrain *= 0.8;
    mods.moraleDrain *= 0.8;
  }
  for (const perk of PERKS) {
    const level = perkLevel(state, perk.id);
    for (let i = 0; i < level; i += 1) {
      const value = perk.values[i];
      if (perk.effect === "coffeeRegen") mods.coffeeRegen += value;
      if (perk.effect === "moraleRegen") mods.moraleRegen += value;
      if (perk.effect === "coffeeDrain") mods.coffeeDrain *= 1 - value;
      if (perk.effect === "moraleDrain") mods.moraleDrain *= 1 - value;
      if (perk.effect === "reward") mods.reward += value;
    }
  }
  return mods;
}

function hasTag(task, tag) {
  return task.tags?.includes(tag);
}

export function durationHours(state, staff, task) {
  let hours = task.hours;
  const skills = skillsOf(staff);
  const primary = skills.includes(task.skill);
  const secondary = Boolean(task.secondary && skills.includes(task.secondary));
  if (!primary && !secondary) hours *= 1.85;
  else if (!primary && secondary) hours *= 1.28;
  else if (primary && secondary) hours *= 0.9;

  const tier = staff.trained;
  if (staff.id === "coree" && tier >= 1 && task.skill === "MOU") hours *= 0.7;
  if (staff.id === "coree" && tier >= 3 && task.skill === "Social") hours *= 0.75;
  if (staff.id === "brandon" && tier >= 1 && (task.skill === "AdWords" || task.skill === "Display")) hours *= 0.75;
  if (staff.id === "tomas" && tier >= 2 && task.skill === "Web Dev") hours *= 0.65;
  if (staff.id === "sean" && tier >= 2 && ["FB Ads", "Display", "AdWords"].includes(task.skill)) hours /= 1.2;
  if (staff.id === "kajal" && tier >= 1 && (task.skill === "Design" || task.skill === "UI")) hours *= 0.7;
  if (staff.id === "jessica" && tier >= 1 && task.skill === "Invoicing") hours *= 0.75;

  if (hasTag(task, "server") && staff.id === "tomas" && tier >= 1) hours *= 0.58;
  if ((hasTag(task, "scope") || hasTag(task, "pr")) && staff.id === "coree" && tier >= 3) hours *= 0.5;
  if (hasTag(task, "platform") && staff.id === "brandon" && tier >= 3) hours *= 0.5;
  if ((hasTag(task, "finance") || hasTag(task, "domain")) && staff.id === "jessica" && tier >= 3) hours *= 0.5;

  if (state.coffee <= 0 || state.morale <= 0) hours *= 2.35;
  if (state.beerSlow) hours *= 1.5;
  return Math.max(0.35, hours);
}

function payoutFor(state, staff, task) {
  const frozen = liveTasks(state).some((item) => hasTag(item, "freeze"));
  if (frozen && (task.skill === "MOU" || task.skill === "Invoicing" || task.secondary === "MOU" || task.secondary === "Invoicing")) {
    return 0;
  }
  let pay = task.reward;
  const tier = staff.trained;
  if (staff.id === "coree" && tier >= 2 && (task.skill === "Strategy" || task.secondary === "Strategy")) pay *= 1.25;
  if (staff.id === "brandon" && tier >= 2 && (task.skill === "Sales" || task.secondary === "Sales")) pay *= 1.3;
  if (staff.id === "sean" && tier >= 1 && (task.skill === "FB Ads" || task.skill === "Display")) pay *= 1.2;
  if (staff.id === "kajal" && tier >= 2 && (task.skill === "Design" || task.skill === "Social" || task.secondary === "Design" || task.secondary === "Social")) pay *= 1.25;
  if (staff.id === "jessica" && tier >= 1 && task.skill === "Invoicing") pay *= 1.2;
  pay *= 1 + modifiers(state).reward;
  return Math.round(pay);
}

function pickTitle(state, titles) {
  const used = new Set(state.tasks.map((task) => task.title));
  const open = titles.filter((title) => !used.has(title));
  const pool = open.length ? open : titles;
  return pool[Math.floor(state.rand() * pool.length)];
}

function makeTask(state, fields) {
  const task = {
    kind: "work",
    title: "",
    skill: "Ops",
    secondary: null,
    hours: 2,
    reward: 0,
    patience: null,
    patienceLeft: null,
    progress: 0,
    tags: [],
    allows: null,
    joint: false,
    eventDay: null,
    group: null,
    lottie: null,
    holding: false,
    detail: "",
    ...fields,
    uid: state.uid++,
  };
  state.tasks.push(task);
  return task;
}

function spawnWork(state, patienceHours) {
  const bag = [];
  for (const template of WORK) {
    for (let i = 0; i < template.weight; i += 1) bag.push(template);
  }
  const template = bag[Math.floor(state.rand() * bag.length)];
  const span = state.day === 1 ? state.config.tutorialPatienceHours : patienceHours;
  const task = makeTask(state, {
    title: pickTitle(state, template.titles),
    skill: template.skill,
    secondary: template.secondary,
    hours: template.hours,
    reward: template.reward,
    patience: span,
    patienceLeft: span,
  });
  state.tray.push(task.uid);
  touch(state);
}

function spawnOpening(state) {
  spawnWork(state, state.config.tutorialPatienceHours);
  spawnWork(state, state.config.tutorialPatienceHours);
}

function simHoursUntilNoon(state) {
  const left = state.dayLeft / secondsPerGameHour(state.config);
  const afternoon = state.config.gameHoursPerDay - morningHours(state.config);
  return Math.max(0, left - afternoon);
}

function scheduleEvent(state) {
  const spec = EVENTS.find((item) => item.day === state.day);
  if (!spec || state.clearedEvents.includes(spec.day)) {
    state.eventIn = null;
    return;
  }
  const morning = morningHours(state.config);
  const latest = Math.max(0.15, morning - 0.2);
  state.eventIn = 0.15 + state.rand() * (latest - 0.15);
}

/** Keep the emergency on the clock. A skipped half hour must not push it past noon. */
function advanceEvent(state, simHours) {
  if (state.eventIn == null) return;
  state.eventIn -= simHours;
  const untilNoon = simHoursUntilNoon(state);
  if (state.eventIn > untilNoon) state.eventIn = untilNoon;
  if (state.eventIn <= 0.0001) {
    state.eventIn = null;
    if (state.dayLeft > 0) spawnEvent(state);
  }
}

function spawnEvent(state) {
  const spec = EVENTS.find((item) => item.day === state.day);
  if (!spec) return;
  if (state.clearedEvents.includes(spec.day)) return;
  if (state.tasks.some((task) => task.eventDay === spec.day)) return;
  const task = makeTask(state, {
    kind: "event",
    title: spec.title,
    skill: "Ops",
    secondary: null,
    hours: spec.hours,
    reward: 0,
    patience: null,
    patienceLeft: null,
    tags: spec.tags.slice(),
    allows: spec.allows.slice(),
    joint: Boolean(spec.joint),
    eventDay: spec.day,
    lottie: spec.lottie,
    detail: spec.detail,
    holding: true,
  });
  state.notice = spec.detail;
  touch(state);
}

function nameOf(state, id) {
  return state.staff.find((person) => person.id === id)?.name || id;
}

function commitNight(state) {
  for (const person of state.staff) {
    if (person.pendingTier > person.trained) {
      let downtime = 0;
      for (let tier = person.trained; tier < person.pendingTier; tier += 1) {
        downtime += SKILL_TREES[person.id][tier].downtime;
      }
      person.trained = person.pendingTier;
      person.trainLeft += downtime;
      person.trainSpan = person.trainLeft;
    }
  }
  for (const [id, level] of Object.entries(state.pendingPerks)) {
    state.perks[id] = Math.max(state.perks[id] || 0, level);
  }
  state.pendingPerks = {};
}

export function startGame(state) {
  if (state.phase !== "title" && state.phase !== "results") return;
  const fresh = createGame(state.config, (state.rand() * 1e9) >>> 0);
  Object.assign(state, fresh);
  state.phase = "work";
  state.day = 1;
  beginDay(state, true);
}

function beginDay(state, opening) {
  commitNight(state);
  state.phase = "work";
  state.dayLeft = state.config.dayLengthSeconds;
  state.earnedToday = 0;
  state.coffee = clamp(Math.max(state.coffee, 62), 0, 100);
  state.morale = clamp(Math.max(state.morale, 62), 0, 100);
  state.beerSlow = false;
  state.spawnIn = state.day === 1 ? 0.2 : 0.1;
  state.notice = state.day === 1 ? "Drag work onto a person." : "";
  if (opening) spawnOpening(state);
  scheduleEvent(state);
  for (const person of state.staff) promote(state, person);
  touch(state);
}

function owner(state, uid) {
  const task = taskById(state, uid);
  if (task?.holding) return { person: null, where: "alert", index: -1 };
  for (const person of state.staff) {
    if (person.active === uid) return { person, where: "active", index: -1 };
    const index = person.queue.indexOf(uid);
    if (index >= 0) return { person, where: "queue", index };
  }
  if (state.tray.includes(uid)) return { person: null, where: "tray", index: state.tray.indexOf(uid) };
  return null;
}

function detach(state, uid) {
  const place = owner(state, uid);
  if (!place) return null;
  if (place.where === "alert") {
    const task = taskById(state, uid);
    if (task) task.holding = false;
  } else if (place.where === "tray") state.tray.splice(place.index, 1);
  else if (place.where === "queue") place.person.queue.splice(place.index, 1);
  else return null;
  return place;
}

function spillQueue(state, person) {
  while (person.queue.length > state.config.queueLimit) {
    let index = -1;
    for (let i = person.queue.length - 1; i >= 0; i -= 1) {
      const task = taskById(state, person.queue[i]);
      if (task && task.kind !== "event") {
        index = i;
        break;
      }
    }
    if (index < 0) return false;
    const [uid] = person.queue.splice(index, 1);
    state.tray.push(uid);
    const task = taskById(state, uid);
    if (task && task.patience != null) task.patienceLeft = Math.max(task.patienceLeft ?? 0, 0.45);
  }
  return true;
}

function seize(state, person, uid) {
  if (person.active && person.active !== uid) {
    person.queue.unshift(person.active);
    person.active = null;
  }
  person.queue = person.queue.filter((id) => id !== uid);
  if (person.trainLeft > 0) {
    person.queue.unshift(uid);
    spillQueue(state, person);
    return;
  }
  person.active = uid;
  spillQueue(state, person);
  state.coffee = clamp(state.coffee - 2, 0, 100);
  state.morale = clamp(state.morale - 1, 0, 100);
}

function promote(state, person) {
  if (person.trainLeft > 0 || person.active || !person.queue.length) return;
  person.active = person.queue.shift();
  state.coffee = clamp(state.coffee - 2, 0, 100);
  state.morale = clamp(state.morale - 1, 0, 100);
}

export function assign(state, taskUid, staffId, insertAt = "end") {
  if (state.phase !== "work") return { ok: false, reason: "closed" };
  const task = taskById(state, taskUid);
  const person = state.staff.find((member) => member.id === staffId);
  if (!task || !person) return { ok: false, reason: "missing" };
  const place = owner(state, taskUid);
  if (!place || place.where === "active") return { ok: false, reason: "locked" };
  if (task.kind === "event" && !task.allows.includes(staffId)) {
    return { ok: false, reason: `Only ${task.allows.map((id) => nameOf(state, id)).join(" or ")}` };
  }

  if (task.joint) {
    const group = task.uid;
    detach(state, task.uid);
    state.tasks = state.tasks.filter((item) => item.uid !== task.uid);
    for (const id of task.allows) {
      const copy = makeTask(state, {
        kind: "event",
        title: task.title,
        detail: task.detail,
        hours: task.hours,
        tags: task.tags.slice(),
        allows: [id],
        joint: false,
        eventDay: task.eventDay,
        group,
        lottie: task.lottie,
      });
      const target = state.staff.find((member) => member.id === id);
      seize(state, target, copy.uid);
    }
    state.notice = `${task.title} took both desks.`;
    touch(state);
    return { ok: true };
  }

  if (task.kind === "event") {
    detach(state, task.uid);
    task.holding = false;
    seize(state, person, task.uid);
    state.notice = person.trainLeft > 0
      ? `${person.name} is training. ${task.title} is next.`
      : `${task.title} took over ${person.name}'s desk.`;
    touch(state);
    return { ok: true };
  }

  detach(state, task.uid);

  const startNow = person.trainLeft <= 0
    && !person.active
    && person.queue.length === 0
    && (insertAt === "end" || insertAt === "start" || insertAt === 0);
  if (startNow) {
    person.active = task.uid;
    state.coffee = clamp(state.coffee - 2, 0, 100);
    state.morale = clamp(state.morale - 1, 0, 100);
    if (task.kind === "event") state.notice = `${task.title} is with ${person.name}.`;
    touch(state);
    return { ok: true };
  }

  let index = insertAt === "end" ? person.queue.length : insertAt === "start" ? 0 : Number(insertAt);
  if (!Number.isFinite(index)) index = person.queue.length;
  index = clamp(index, 0, person.queue.length);
  if (task.kind === "event") index = 0;
  person.queue.splice(index, 0, task.uid);
  spillQueue(state, person);
  if (!person.queue.includes(task.uid) && person.active !== task.uid) {
    touch(state);
    return { ok: false, reason: "Queue is full" };
  }
  promote(state, person);
  if (task.kind === "event") state.notice = `${task.title} is with ${person.name}.`;
  touch(state);
  return { ok: true };
}

function finishTask(state, person, task) {
  if (task.kind === "work") {
    const pay = payoutFor(state, person, task);
    state.cash += pay;
    state.earned += pay;
    state.earnedToday += pay;
    state.stats.delivered += 1;
    state.notice = pay ? `${task.title} cleared ${money(pay)}` : `${task.title} cleared. Payouts are frozen.`;
  } else {
    const siblings = state.tasks.filter((item) => item.group && item.group === task.group && item.uid !== task.uid);
    if (!siblings.length && task.eventDay && !state.clearedEvents.includes(task.eventDay)) {
      state.clearedEvents.push(task.eventDay);
      state.stats.events += 1;
      state.notice = `${task.title} is handled.`;
    }
  }
  person.active = null;
  state.tasks = state.tasks.filter((item) => item.uid !== task.uid);
  promote(state, person);
  touch(state);
}

function expireTask(state, uid) {
  state.tray = state.tray.filter((id) => id !== uid);
  state.tasks = state.tasks.filter((task) => task.uid !== uid);
  state.stats.expired += 1;
  state.morale = clamp(state.morale - 5, 0, 100);
  state.notice = "A brief left the tray.";
  touch(state);
}

/** Shown-clock cost of a coffee or beer break: half an hour, five tenths. */
export function breakCostSeconds(config) {
  const shown = 0.5;
  const simHours = shown * (config.gameHoursPerDay / config.shownHoursPerDay);
  return simHours * secondsPerGameHour(config);
}

export function takeBreak(state, kind) {
  if (state.phase !== "work") return { ok: false, reason: "closed" };
  if (kind !== "coffee" && kind !== "beer") return { ok: false, reason: "missing" };
  if (state.tasks.some((task) => task.holding)) return { ok: false, reason: "The office is stopped." };
  const spent = Math.min(state.dayLeft, breakCostSeconds(state.config));
  state.dayLeft -= spent;
  if (kind === "coffee") {
    state.coffee = 50;
  } else {
    state.morale = Math.max(state.morale, 80);
    state.beerSlow = true;
  }
  const closed = state.dayLeft <= 0;
  if (closed) {
    state.dayLeft = 0;
    state.eventIn = null;
    state.phase = state.day >= state.config.dayCount ? "results" : "shop";
    state.notice = state.phase === "results" ? "The break is here." : "The office is closed for the night.";
  } else {
    advanceEvent(state, spent / secondsPerGameHour(state.config));
  }
  if (!closed && !state.tasks.some((task) => task.holding)) {
    if (kind === "coffee") {
      const stopped = state.tasks.some((task) => hasTag(task, "coffeeStop"));
      state.notice = stopped
        ? "Coffee break. The machine is still down, so this pot will not come back on its own."
        : "Coffee break. The pot is back to 50.";
    } else {
      state.notice = "Beer break. Morale is up. Jobs take 1.5× until close.";
    }
  }
  touch(state);
  return { ok: true, spent, closed };
}

export function tick(state, dt) {
  if (state.phase !== "work" || dt <= 0) return;
  if (state.tasks.some((task) => task.holding)) return;
  const dtHours = dt / secondsPerGameHour(state.config);
  state.dayLeft -= dt;

  const mods = modifiers(state);
  const fatigue = state.tasks.some((task) => hasTag(task, "adFatigue"));
  let workers = 0;
  let moraleWorkers = 0;
  for (const person of state.staff) {
    if (person.trainLeft > 0) {
      person.trainLeft = Math.max(0, person.trainLeft - dtHours);
      if (person.trainLeft > 0) continue;
    }
    if (!person.active) {
      promote(state, person);
    }
    if (!person.active) continue;
    const task = taskById(state, person.active);
    if (!task) {
      person.active = null;
      continue;
    }
    workers += 1;
    const immune = person.id === "sean" && person.trained >= 3 && fatigue;
    if (!immune) moraleWorkers += 1;
    const hours = durationHours(state, person, task);
    task.progress = Math.min(100, task.progress + (100 / hours) * dtHours);
    if (task.progress >= 100) finishTask(state, person, task);
  }

  const coffeeStopped = state.tasks.some((task) => hasTag(task, "coffeeStop"));
  const regen = coffeeStopped ? 0 : mods.coffeeRegen;
  state.coffee = clamp(state.coffee + (regen - workers * mods.coffeeDrain) * dtHours, 0, 100);
  state.morale = clamp(state.morale + (mods.moraleRegen - moraleWorkers * mods.moraleDrain) * dtHours, 0, 100);

  for (const uid of [...state.tray]) {
    const task = taskById(state, uid);
    if (!task || task.kind !== "work" || task.patienceLeft == null) continue;
    task.patienceLeft -= dtHours;
    if (task.patienceLeft <= 0) expireTask(state, uid);
  }

  if (state.dayLeft > 0) advanceEvent(state, dtHours);

  const workCount = state.tray.filter((uid) => taskById(state, uid)?.kind === "work").length;
  if (workCount < state.config.trayLimit) {
    state.spawnIn -= dtHours;
    const interval = state.day === 1 ? state.config.tutorialSpawnHours : state.config.spawnHours;
    if (state.spawnIn <= 0) {
      const [minPatience, maxPatience] = state.config.patienceHours;
      const patience = state.day === 1
        ? state.config.tutorialPatienceHours
        : minPatience + state.rand() * (maxPatience - minPatience);
      spawnWork(state, patience);
      state.spawnIn = interval;
    }
  } else {
    state.spawnIn = state.day === 1 ? state.config.tutorialSpawnHours : state.config.spawnHours;
  }

  if (state.dayLeft <= 0) {
    state.dayLeft = 0;
    state.phase = state.day >= state.config.dayCount ? "results" : "shop";
    state.notice = state.phase === "results" ? "The break is here." : "The office is closed for the night.";
    touch(state);
  }
}

export function nextSkillOffer(person) {
  const owned = Math.max(person.trained, person.pendingTier);
  return SKILL_TREES[person.id][owned] || null;
}

export function buySkill(state, staffId) {
  if (state.phase !== "shop") return { ok: false, reason: "night only" };
  const person = state.staff.find((member) => member.id === staffId);
  if (!person) return { ok: false, reason: "missing" };
  const owned = Math.max(person.trained, person.pendingTier);
  const offer = SKILL_TREES[person.id][owned];
  if (!offer) return { ok: false, reason: "maxed" };
  if (person.pendingTier > person.trained) return { ok: false, reason: "Already training tonight" };
  if (state.cash < offer.cost) return { ok: false, reason: "short" };
  state.cash -= offer.cost;
  person.pendingTier = owned + 1;
  state.notice = `${person.name} trains tomorrow.`;
  touch(state);
  return { ok: true };
}

export function perkOffer(state, perk) {
  const owned = Math.max(state.perks[perk.id] || 0, state.pendingPerks[perk.id] || 0);
  if (owned >= perk.max) return null;
  if ((state.pendingPerks[perk.id] || 0) > (state.perks[perk.id] || 0)) return null;
  return { level: owned, cost: perk.costs[owned] };
}

export function buyPerk(state, perkId) {
  if (state.phase !== "shop") return { ok: false, reason: "night only" };
  const perk = PERKS.find((item) => item.id === perkId);
  if (!perk) return { ok: false, reason: "missing" };
  const offer = perkOffer(state, perk);
  if (!offer) return { ok: false, reason: "maxed" };
  if (state.cash < offer.cost) return { ok: false, reason: "short" };
  state.cash -= offer.cost;
  state.pendingPerks[perk.id] = offer.level + 1;
  state.notice = `${perk.name} arrives in the morning.`;
  touch(state);
  return { ok: true };
}

export function advance(state) {
  if (state.phase !== "shop") return { ok: false };
  if (state.day >= state.config.dayCount) {
    state.phase = "results";
    touch(state);
    return { ok: true };
  }
  state.day += 1;
  beginDay(state, false);
  return { ok: true };
}

export function resetGame(state) {
  const next = createGame(state.config, (Math.random() * 1e9) >>> 0);
  Object.assign(state, next);
  touch(state);
}

export { EVENTS, PERKS, SKILL_TREES, STAFF, modifiers };
