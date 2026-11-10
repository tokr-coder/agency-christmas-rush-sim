/** Rules for The Q4 Rush. No DOM in this file. */

export const GOAL = 100_000;
export const SHIFT_SECONDS = 5 * 60;
export const REWARD_SCALE = 0.5;
export const DURATION_SCALE = 1;

export const STAFF_DEFS = [
  { id: "coree", name: "Coree-Ann", role: "CEO / PM / Sales", specialties: ["Strategy", "Social", "MOU"] },
  { id: "brandon", name: "Brandon", role: "COO / Paid Ads", specialties: ["AdWords", "Display", "Sales"] },
  { id: "tomas", name: "Tomas", role: "Web Lead / Tech", specialties: ["Web Dev", "Design", "Tech"] },
  { id: "sean", name: "Sean", role: "Paid Media Specialist", specialties: ["FB Ads", "Display", "AdWords"] },
  { id: "kajal", name: "Kajal", role: "Graphic / Social / Web", specialties: ["Design", "Social", "UI"] },
  { id: "jessica", name: "Jessica", role: "Financials / PM", specialties: ["Invoicing", "MOU", "Ops"] },
];

export const TEMPLATES = [
  { id: "mou", name: "Client MOU Approval", client: "Northwind Goods", skill: "MOU", secondary: null, base: 16, reward: 2400, patience: null, blurb: "High-value campaigns stay locked until this signature lands." },
  { id: "adwords", name: "AdWords Sprint", client: "Holly & Co.", skill: "AdWords", secondary: "Sales", base: 20, reward: 4200, patience: 72, blurb: "Search terms, sitelinks, and a client who refreshes the dashboard hourly." },
  { id: "web", name: "Web Redesign", client: "Evergreen Market", skill: "Web Dev", secondary: "Design", base: 28, reward: 6400, patience: 88, blurb: "A holiday homepage that has to feel handmade and load like it's nothing." },
  { id: "social", name: "Social Blitz", client: "Mistletoe Audio", skill: "Social", secondary: "Design", base: 18, reward: 3600, patience: 66, blurb: "Twelve posts, three cuts, and a reindeer legal has not approved." },
  { id: "display", name: "Display Retargeting", client: "Pinecone Bank", skill: "Display", secondary: "AdWords", base: 18, reward: 3000, patience: 64, blurb: "Banners that follow shoppers all the way to the checkout carol." },
  { id: "fb", name: "FB Ads Launch", client: "Carol Street", skill: "FB Ads", secondary: "Display", base: 19, reward: 3400, patience: 68, blurb: "A paid social launch with one weekend and zero patience." },
  { id: "strategy", name: "Brand Strategy Deck", client: "Lantern Labs", skill: "Strategy", secondary: "Social", base: 24, reward: 4800, patience: 80, blurb: "Positioning, proof, and a close that survives the group chat." },
  { id: "invoice", name: "Invoice Closeout", client: "Internal", skill: "Invoicing", secondary: "Ops", base: 16, reward: 2200, patience: 58, blurb: "December retainers do not collect themselves." },
  { id: "ui", name: "UI Polish Sprint", client: "Ribbon App", skill: "UI", secondary: "Design", base: 20, reward: 3800, patience: 70, blurb: "Spacing, states, and a button the founder keeps calling the 'candy cane'." },
  { id: "tech", name: "Tech Stabilization", client: "Evergreen Market", skill: "Tech", secondary: "Web Dev", base: 22, reward: 4000, patience: 74, blurb: "The staging site wheezes every time someone opens the hero." },
  { id: "sales", name: "Q4 Sales Deck", client: "Holly & Co.", skill: "Sales", secondary: "AdWords", base: 17, reward: 2800, patience: 62, blurb: "One more leave-behind before the offices go dark." },
  { id: "ops", name: "Ops Cleanup", client: "Internal", skill: "Ops", secondary: "Invoicing", base: 16, reward: 2100, patience: 56, blurb: "Folders, handoffs, and the mystery file named FINAL_final_v7." },
  { id: "design", name: "Holiday Design System", client: "Mistletoe Audio", skill: "Design", secondary: "UI", base: 24, reward: 4500, patience: 78, blurb: "Type, color, and a snowflake that has to work at 16 pixels." },
  { id: "onboard", name: "New Client Onboarding", client: "Kindling Co.", skill: "MOU", secondary: "Strategy", base: 17, reward: 2600, patience: 64, blurb: "Another signature, another kickoff, another shared drive named 'stuff'." },
];

export const UPGRADES = [
  {
    id: "espresso",
    name: "Commercial Espresso Machine",
    desc: "A real machine for the rush. Coffee fuel returns faster.",
    max: 3,
    costs: [2600, 5400, 9800],
    effect: "coffeeRegen",
    values: [0.7, 0.75, 0.95],
  },
  {
    id: "cookies",
    name: "Holiday Cookie Station",
    desc: "Morale recovers faster. The gingerbread is load-bearing.",
    max: 3,
    costs: [1800, 4000, 7600],
    effect: "moraleRegen",
    values: [0.36, 0.42, 0.5],
  },
  {
    id: "automou",
    name: "Auto-MOU System",
    desc: "Onboarding templates. MOU work finishes faster and new jobs arrive sooner.",
    max: 1,
    costs: [4500],
    effect: "autoMou",
    values: [true],
  },
  {
    id: "mute",
    name: "Slack Holiday Mute",
    desc: "Fewer pings. Active jobs sip less coffee.",
    max: 1,
    costs: [2800],
    effect: "coffeeDrain",
    values: [0.28],
  },
  {
    id: "pods",
    name: "Noise-Cancelling Pods",
    desc: "Surprise standups bounce off the glass. Morale drains slower.",
    max: 1,
    costs: [5200],
    effect: "moraleDrain",
    values: [0.32],
  },
  {
    id: "monitors",
    name: "Dual Monitor Mountain",
    desc: "Every deliverable on the floor moves a little quicker.",
    max: 2,
    costs: [3400, 7200],
    effect: "globalSpeed",
    values: [0.08, 0.09],
  },
  {
    id: "render",
    name: "Overnight Render Farm",
    desc: "Web, design, UI, and tech tasks finish faster.",
    max: 1,
    costs: [8600],
    effect: "renderFarm",
    values: [true],
  },
  {
    id: "media",
    name: "Paid Media Suite",
    desc: "AdWords, Display, and FB Ads tasks finish faster.",
    max: 1,
    costs: [8600],
    effect: "mediaSuite",
    values: [true],
  },
  {
    id: "warroom",
    name: "Campaign War Room",
    desc: "Sharper pitches, richer retainers. Every ROI reward goes up.",
    max: 2,
    costs: [6800, 12400],
    effect: "reward",
    values: [0.12, 0.13],
  },
  {
    id: "bonus",
    name: "Festive Bonus Pool",
    desc: "A little extra written onto every invoice that clears.",
    max: 1,
    costs: [9200],
    effect: "reward",
    values: [0.15],
  },
];

export const JOKES = [
  "Client asked to make the logo 200% bigger!",
  "The brief says “make it pop” and then the document ends.",
  "Stakeholder wants the homepage more blue, and also less blue.",
  "Legal redlined the word “joy” for being too emotional.",
  "A meeting was booked to discuss the meeting about the meeting.",
  "Q4 forecast revised to “festive, pending feedback.”",
  "Please make the CTA louder. No, not like that.",
  "Can we circle back after the holidays we are currently surviving?",
  "The competitor shipped a green button. We are calm. We are not calm.",
  "Client forwarded a board titled “magic??”",
  "“Quick tweak” arrived with fourteen attachments.",
  "The logo must work in snow, on a sweater, and embroidered on a goose.",
  "Someone suggested we add bells. The bells have notes.",
  "Hero copy options: Hello / Hi / Hey / Happy something.",
];

export const EVENTS = [
  { text: "Client asked to make the logo 200% bigger!", morale: -4, coffee: -1 },
  { text: "The brief says “make it pop” and then the document ends.", morale: -3 },
  { text: "Someone brought peppermint bark to the war room.", morale: 8, coffee: 2 },
  { text: "Legal redlined the word “joy” for being too emotional.", morale: -4 },
  { text: "A standup sprouted out of a calendar crack.", coffee: -6, morale: -3 },
  { text: "The espresso machine hissed like it had revision notes.", coffee: -8 },
  { text: "Client sent a reindeer GIF and no other context.", morale: 5 },
  { text: "Finance found a December retainer we forgot to bill.", cash: 500 },
  { text: "A director replied “looks good” in under a minute.", morale: 7 },
  { text: "The hero image is now a snowman. Nobody approved a snowman.", morale: -3, coffee: -2 },
  { text: "Slack went quiet for ninety whole seconds.", morale: 4, coffee: 3 },
  { text: "Stakeholder wants it more festive, more premium, and cheaper.", morale: -5 },
  { text: "The printer jammed on a deck titled FINAL_final_v7.", coffee: -3, morale: -2 },
  { text: "Reception lit a cinnamon candle where the stress used to sit.", morale: 6 },
];

const CLIENTS = [
  "Holly & Co.",
  "Evergreen Market",
  "Mistletoe Audio",
  "Pinecone Bank",
  "Carol Street",
  "Lantern Labs",
  "Ribbon App",
  "Northwind Goods",
  "Kindling Co.",
  "Snowglass",
  "Yule Electric",
  "Hearth & Hammer",
];

const CRAFT = new Set(["Web Dev", "Design", "UI", "Tech"]);
const MEDIA = new Set(["AdWords", "Display", "FB Ads"]);

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

function touch(state) {
  state.rev += 1;
}

function pushFeed(state, text) {
  state.feed.unshift({ id: state.uid++, text });
  if (state.feed.length > 16) state.feed.length = 16;
  touch(state);
}

function pushToast(state, text, tone = "info") {
  state.toasts.push({ id: state.toastId++, text, tone });
  if (state.toasts.length > 3) state.toasts.shift();
  touch(state);
}

export function money(n) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function formatClock(seconds) {
  if (seconds <= 0) return "00:00";
  const total = Math.ceil(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function freshState(seed = 1) {
  return {
    phase: "title",
    cash: 0,
    lifetime: 0,
    coffee: 100,
    morale: 100,
    timeLeft: SHIFT_SECONDS,
    tasks: [],
    staff: STAFF_DEFS.map((person) => ({
      id: person.id,
      name: person.name,
      role: person.role,
      specialties: person.specialties.slice(),
      status: "ready",
      taskUid: null,
    })),
    levels: {},
    stats: { delivered: 0, missed: 0, matches: 0, perks: 0 },
    feed: [],
    toasts: [],
    spawnIn: 0,
    eventIn: 24,
    uid: 1,
    toastId: 1,
    picking: null,
    mouCleared: false,
    rev: 0,
    rand: mulberry32(seed),
  };
}

function templateById(id) {
  return TEMPLATES.find((template) => template.id === id);
}

function makeTask(state, template, locked, client = template.client) {
  return {
    uid: state.uid++,
    templateId: template.id,
    name: template.name,
    client,
    skill: template.skill,
    secondary: template.secondary,
    reward: template.reward,
    base: template.base,
    patience: template.patience,
    patienceLeft: locked || template.patience == null ? null : template.patience,
    locked,
    progress: 0,
    staffId: null,
    blurb: template.blurb,
  };
}

export function buildOpening(state) {
  state.tasks = [
    makeTask(state, templateById("mou"), false),
    makeTask(state, templateById("adwords"), true),
    makeTask(state, templateById("web"), true),
    makeTask(state, templateById("social"), true),
  ];
  state.mouCleared = false;
  state.picking = null;
  state.feed = [];
  pushFeed(state, "High-value campaigns are locked. The client MOU has to be signed first.");
}

export function beginShift(state) {
  if (state.phase === "play") return;
  state.phase = "play";
  state.timeLeft = SHIFT_SECONDS;
  pushToast(state, "Assign a MOU specialty — Coree-Ann or Jessica — to unlock the queue.", "info");
}

export function modifiers(state) {
  const mods = {
    coffeeRegen: 1.2,
    moraleRegen: 0.74,
    coffeeDrain: 0.52,
    moraleDrain: 0.3,
    globalSpeed: 0,
    reward: 0,
    autoMou: false,
    renderFarm: false,
    mediaSuite: false,
  };
  for (const upgrade of UPGRADES) {
    const level = state.levels[upgrade.id] || 0;
    for (let i = 0; i < level; i += 1) {
      const value = upgrade.values[i];
      switch (upgrade.effect) {
        case "coffeeRegen":
          mods.coffeeRegen += value;
          break;
        case "moraleRegen":
          mods.moraleRegen += value;
          break;
        case "coffeeDrain":
          mods.coffeeDrain *= 1 - value;
          break;
        case "moraleDrain":
          mods.moraleDrain *= 1 - value;
          break;
        case "globalSpeed":
          mods.globalSpeed += value;
          break;
        case "reward":
          mods.reward += value;
          break;
        case "autoMou":
          mods.autoMou = true;
          break;
        case "renderFarm":
          mods.renderFarm = true;
          break;
        case "mediaSuite":
          mods.mediaSuite = true;
          break;
        default:
          break;
      }
    }
  }
  return mods;
}

export function matchTier(staff, task) {
  if (!staff) return "none";
  const primary = staff.specialties.includes(task.skill);
  const secondary = Boolean(task.secondary && staff.specialties.includes(task.secondary));
  if (primary && secondary) return "both";
  if (primary) return "primary";
  if (secondary) return "secondary";
  return "none";
}

export function tierLabel(tier) {
  if (tier === "both") return "Perfect match";
  if (tier === "primary") return "Specialty match";
  if (tier === "secondary") return "Partial match";
  return "Stretch assignment";
}

export function pace(task, staff, mods, resourceFactor = 1) {
  let timeMul = 1;
  const tier = matchTier(staff, task);
  if (tier === "both") timeMul = 0.66;
  else if (tier === "primary") timeMul = 0.74;
  else if (tier === "secondary") timeMul = 0.88;

  const touchesMou = task.skill === "MOU" || task.secondary === "MOU";
  if (mods.autoMou && touchesMou) timeMul *= 0.58;
  if (mods.renderFarm && (CRAFT.has(task.skill) || CRAFT.has(task.secondary))) timeMul *= 0.78;
  if (mods.mediaSuite && (MEDIA.has(task.skill) || MEDIA.has(task.secondary))) timeMul *= 0.78;
  timeMul /= 1 + mods.globalSpeed;

  const duration = task.base * DURATION_SCALE * timeMul;
  return { duration, perSec: (100 / duration) * resourceFactor, tier };
}

export function payoutFor(task, mods) {
  return Math.round(task.reward * REWARD_SCALE * (1 + mods.reward));
}

export function resourceFactor(state) {
  const coffeeOut = state.coffee <= 0.05;
  const moraleOut = state.morale <= 0.05;
  if (coffeeOut && moraleOut) return 0.28;
  if (coffeeOut || moraleOut) return 0.42;
  return 1;
}

export function nextEffectLabel(upgrade, level) {
  if (level >= upgrade.max) return "Fully installed";
  const value = upgrade.values[level];
  switch (upgrade.effect) {
    case "coffeeRegen":
      return `Next: coffee regen +${value.toFixed(2)}/s`;
    case "moraleRegen":
      return `Next: morale regen +${value.toFixed(2)}/s`;
    case "coffeeDrain":
      return `Next: coffee drain −${Math.round(value * 100)}%`;
    case "moraleDrain":
      return `Next: morale drain −${Math.round(value * 100)}%`;
    case "globalSpeed":
      return `Next: floor speed +${Math.round(value * 100)}%`;
    case "reward":
      return `Next: ROI rewards +${Math.round(value * 100)}%`;
    case "autoMou":
      return "Next: faster MOUs, quicker new work";
    case "renderFarm":
      return "Next: web, design, and tech speed up";
    case "mediaSuite":
      return "Next: paid media tasks speed up";
    default:
      return "";
  }
}

function removeTask(state, uid) {
  const index = state.tasks.findIndex((task) => task.uid === uid);
  if (index >= 0) state.tasks.splice(index, 1);
  if (state.picking === uid) state.picking = null;
}

function completeTask(state, task, mods) {
  const staff = state.staff.find((person) => person.id === task.staffId);
  const payout = payoutFor(task, mods);
  state.cash += payout;
  state.lifetime += payout;
  state.stats.delivered += 1;
  if (staff) {
    staff.status = "ready";
    staff.taskUid = null;
  }
  const templateId = task.templateId;
  removeTask(state, task.uid);
  pushToast(state, `${task.name} delivered. +${money(payout)} ROI.`, "good");
  pushFeed(
    state,
    `${task.client}: ${task.name} shipped${staff ? `. ${staff.name} is free` : ""}. +${money(payout)}.`,
  );
  if (templateId === "mou" && !state.mouCleared) {
    state.mouCleared = true;
    for (const queued of state.tasks) {
      if (!queued.locked) continue;
      queued.locked = false;
      queued.patienceLeft = queued.patience;
    }
    pushToast(state, "MOU signed. AdWords, web, and social work just unlocked.", "good");
    pushFeed(state, "Client MOU approved. The rest of the queue is live.");
  }
}

function failTask(state, task) {
  removeTask(state, task.uid);
  state.stats.missed += 1;
  state.morale = clamp(state.morale - 7, 0, 100);
  pushToast(state, `${task.client} walked on ${task.name}.`, "bad");
  pushFeed(state, `${task.client} took ${task.name} to another shop. Morale dips.`);
}

function spawnRandom(state) {
  const active = new Set(state.tasks.map((task) => task.templateId));
  let pool = TEMPLATES.filter((template) => template.id !== "mou" && !active.has(template.id));
  if (!pool.length) pool = TEMPLATES.filter((template) => template.id !== "mou");
  const template = pool[Math.floor(state.rand() * pool.length)];
  const client = CLIENTS[Math.floor(state.rand() * CLIENTS.length)];
  const task = makeTask(state, template, false, client);
  state.tasks.push(task);
  pushFeed(state, `${task.client} sent a ${task.name} brief to the queue.`);
}

function fireEvent(state) {
  const event = EVENTS[Math.floor(state.rand() * EVENTS.length)];
  if (event.coffee) state.coffee = clamp(state.coffee + event.coffee, 0, 100);
  if (event.morale) state.morale = clamp(state.morale + event.morale, 0, 100);
  if (event.cash) {
    state.cash += event.cash;
    state.lifetime += event.cash;
  }
  pushFeed(state, event.text);
  const swing = (event.morale || 0) + (event.coffee || 0) + (event.cash ? 1 : 0);
  pushToast(state, event.text, swing >= 0 ? "good" : "bad");
}

export function togglePick(state, taskUid) {
  if (state.phase !== "play") return { ok: false };
  const task = state.tasks.find((item) => item.uid === taskUid);
  if (!task || task.locked || task.staffId) return { ok: false };
  state.picking = state.picking === taskUid ? null : taskUid;
  touch(state);
  return { ok: true };
}

export function assign(state, taskUid, staffId) {
  if (state.phase !== "play") return { ok: false, reason: "phase" };
  const task = state.tasks.find((item) => item.uid === taskUid);
  const staff = state.staff.find((person) => person.id === staffId);
  if (!task || task.locked || task.staffId) return { ok: false, reason: "task" };
  if (!staff || staff.status !== "ready") return { ok: false, reason: "staff" };

  task.staffId = staff.id;
  task.patienceLeft = null;
  staff.status = "working";
  staff.taskUid = task.uid;
  state.coffee = clamp(state.coffee - 3, 0, 100);
  state.morale = clamp(state.morale - 2, 0, 100);
  const tier = matchTier(staff, task);
  if (tier !== "none") state.stats.matches += 1;
  const note =
    tier === "both" || tier === "primary"
      ? `${staff.name} matched ${task.skill} and took ${task.name}.`
      : tier === "secondary"
        ? `${staff.name} has a neighboring skill and started ${task.name}.`
        : `${staff.name} started ${task.name} outside their specialty. It will take longer.`;
  pushFeed(state, note);
  state.picking = null;
  touch(state);
  return { ok: true, tier };
}

export function buy(state, id) {
  if (state.phase !== "play") return { ok: false, reason: "phase" };
  const upgrade = UPGRADES.find((item) => item.id === id);
  if (!upgrade) return { ok: false, reason: "missing" };
  const level = state.levels[id] || 0;
  if (level >= upgrade.max) return { ok: false, reason: "max" };
  const cost = upgrade.costs[level];
  if (state.cash < cost) return { ok: false, reason: "cash" };
  state.cash -= cost;
  state.levels[id] = level + 1;
  state.stats.perks += 1;
  pushToast(state, `${upgrade.name} installed.`, "good");
  pushFeed(state, `${upgrade.name} is in. The floor feels it.`);
  return { ok: true };
}

export function tick(state, dt) {
  if (state.phase !== "play" || dt <= 0) return;
  state.timeLeft -= dt;

  const mods = modifiers(state);
  const active = state.staff.filter((person) => person.status === "working").length;
  state.coffee = clamp(state.coffee + (mods.coffeeRegen - active * mods.coffeeDrain) * dt, 0, 100);
  state.morale = clamp(state.morale + (mods.moraleRegen - active * mods.moraleDrain) * dt, 0, 100);
  const factor = resourceFactor(state);

  const finished = [];
  const failed = [];
  for (const task of state.tasks) {
    if (task.staffId) {
      const staff = state.staff.find((person) => person.id === task.staffId);
      task.progress = Math.min(100, task.progress + pace(task, staff, mods, factor).perSec * dt);
      if (task.progress >= 100) finished.push(task);
    } else if (!task.locked && task.patienceLeft != null) {
      task.patienceLeft -= dt;
      if (task.patienceLeft <= 0) failed.push(task);
    }
  }
  for (const task of finished) completeTask(state, task, mods);
  for (const task of failed) {
    if (state.tasks.includes(task)) failTask(state, task);
  }

  if (state.mouCleared) {
    const delay = mods.autoMou ? 1.55 : 2.5;
    if (state.tasks.length < 4) {
      state.spawnIn -= dt;
      if (state.spawnIn <= 0) {
        spawnRandom(state);
        state.spawnIn = delay;
      }
    } else {
      state.spawnIn = delay;
    }
  }

  state.eventIn -= dt;
  if (state.eventIn <= 0) {
    fireEvent(state);
    state.eventIn = 18 + state.rand() * 16;
  }

  if (state.lifetime >= GOAL) {
    state.phase = "won";
    state.timeLeft = Math.max(0, state.timeLeft);
    pushFeed(state, "Target ROI cleared. The holiday shutdown can actually begin.");
    return;
  }
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.phase = "lost";
    pushFeed(state, "Christmas Eve lockout. The $100k goal is still on the whiteboard.");
  }
}
