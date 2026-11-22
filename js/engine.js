import { DAYS, ELVES, TOYS, TRAIN_COST, UPGRADES } from "./catalog.js";

const TRAVEL = [1.15, 0.86, 0.64];
const CHEER_SCALE = [1, 0.78, 0.6, 0.46];

export function createGame(config, seed) {
  return {
    config,
    rand: mulberry32(seed >>> 0),
    phase: "title",
    day: 0,
    dayLeft: 0,
    earned: 0,
    cash: 0,
    cheerMax: config.cheerMax,
    elves: ELVES.map((elf) => ({ ...elf, speed: 1, pending: false, absentLeft: 0 })),
    reserves: ELVES.map((elf) => elf.id),
    exhausted: [],
    stations: [],
    tracks: [],
    belt: Array.from({ length: config.beltSlots }, () => null),
    spin: 0,
    dragging: false,
    queue: [],
    upgrades: { queue: 0, track: 0, slots: 0, cheer: 0, station: 0 },
    uid: 1,
    spawnIn: 0.8,
    spawnEvery: 2.7,
    typeCount: 4,
    listLength: 2,
    event: null,
    rushLeft: 0,
    jam: null,
    breakCursor: 0,
    burst: null,
    burstToken: 0,
    over: false,
  };
}

export function beginDay(state) {
  state.day += 1;
  const plan = DAYS[state.day - 1];
  state.typeCount = plan.types;
  state.listLength = plan.list;
  state.spawnEvery = plan.spawn;
  state.dayLeft = state.config.dayLengthSeconds;
  state.phase = "play";
  state.over = false;
  state.spawnIn = 0.8;
  state.rushLeft = 0;
  state.jam = null;
  state.event = plan.event ? { ...plan.event, armed: true } : null;
  state.belt = state.belt.map(() => null);
  state.queue = [];
  state.tracks = state.stations.map(() => null);
  state.spin = 0;
  state.dragging = false;
  const already = state.stations.length;
  while (state.stations.length < plan.stations && state.reserves.length) addStation(state);
  if (state.day > 1) {
    for (let i = 0; i < already; i += 1) {
      state.stations[i].cheer = Math.max(state.stations[i].cheer, 45);
    }
  }
  for (const elf of state.elves) {
    if (!elf.pending) {
      elf.absentLeft = 0;
      continue;
    }
    elf.speed = Math.min(elf.speed, 0.72);
    elf.pending = false;
    const working = state.stations.some((station) => station.elfId === elf.id);
    elf.absentLeft = working ? state.dayLeft * 0.22 : 0;
  }
  for (const station of state.stations) {
    station.list = rollList(state);
    station.slots = Array.from({ length: station.list.length }, () => null);
  }
  state.tracks = state.stations.map(() => null);
}

export function nextDay(state) {
  if (state.phase !== "shop") return;
  beginDay(state);
}

export function queueMax(state) {
  return state.config.queueBase + state.upgrades.queue;
}

export function holdSlots(state) {
  return state.upgrades.slots > 0 ? 1 : 0;
}

/** Cups on the flat belt. 0 is the queue mouth, at the left of the top rail.
 *  Bottom-rail cups feed the elf spurs. */
export function portWorlds(count) {
  if (count <= 2) return [6, 4];
  if (count === 3) return [6, 4, 5];
  return [6, 4, 7, 3];
}

export function worldOf(beltIndex, spin, n) {
  return mod(beltIndex + spin, n);
}

export function alignedIndex(state, world) {
  const spin = state.dragging ? state.spin : Math.round(state.spin);
  return mod(world - spin, state.belt.length);
}

export function snapSpin(state) {
  state.spin = mod(Math.round(state.spin), state.belt.length);
}

export function tapBelt(state, beltIndex) {
  if (state.phase !== "play" || state.dragging) return false;
  const toy = state.belt[beltIndex];
  if (!toy) return false;
  const n = state.belt.length;
  const world = worldOf(beltIndex, Math.round(state.spin), n);
  const ports = portWorlds(state.stations.length);
  const stationIndex = ports.indexOf(world);
  if (stationIndex < 0 || state.tracks[stationIndex]) return false;
  state.belt[beltIndex] = null;
  state.tracks[stationIndex] = { toy, dir: 1, t: 0, world };
  return true;
}

export function tapStation(state, stationIndex, slotIndex) {
  if (state.phase !== "play" || state.dragging) return false;
  const station = state.stations[stationIndex];
  if (!station || state.tracks[stationIndex]) return false;
  const held = slotIndex === "hold";
  const toy = held ? station.hold : station.slots[slotIndex];
  if (!toy) return false;
  if (held) station.hold = null;
  else station.slots[slotIndex] = null;
  state.tracks[stationIndex] = {
    toy,
    dir: -1,
    t: 1,
    world: portWorlds(state.stations.length)[stationIndex],
  };
  return true;
}

export function buy(state, id) {
  if (state.phase !== "shop") return false;
  const spec = UPGRADES.find((item) => item.id === id);
  const level = state.upgrades[id] || 0;
  if (!spec || level >= spec.max) return false;
  const cost = spec.costs[level];
  if (state.cash < cost) return false;
  if (id === "cheer" && !state.config.cheerEnabled) return false;
  if (id === "station" && (!state.reserves.length || state.stations.length >= 4)) return false;
  state.cash -= cost;
  state.upgrades[id] = level + 1;
  if (id === "station") addStation(state);
  return true;
}

export function train(state, elfId) {
  if (state.phase !== "shop") return false;
  const elf = state.elves.find((item) => item.id === elfId);
  if (!elf || elf.pending || elf.speed < 1 || state.exhausted.includes(elfId)) return false;
  if (state.cash < TRAIN_COST) return false;
  state.cash -= TRAIN_COST;
  elf.pending = true;
  return true;
}

export function tick(state, dt) {
  if (state.phase !== "play" || !(dt > 0)) return;
  state.dayLeft -= dt;
  if (state.dayLeft <= 0) {
    state.dayLeft = 0;
    state.dragging = false;
    state.phase = state.day >= state.config.dayCount ? "results" : "shop";
    return;
  }
  if (state.event?.armed && state.dayLeft <= state.config.dayLengthSeconds * (1 - state.event.at)) {
    state.event.armed = false;
    if (state.event.kind === "rush") state.rushLeft = state.event.seconds;
    if (state.event.kind === "jam") {
      state.jam = {
        station: Math.min(state.event.station || 0, state.stations.length - 1),
        left: state.event.seconds,
      };
    }
  }
  if (state.rushLeft > 0) state.rushLeft = Math.max(0, state.rushLeft - dt);
  if (state.jam) {
    state.jam.left -= dt;
    if (state.jam.left <= 0) state.jam = null;
  }
  for (const elf of state.elves) {
    if (elf.absentLeft > 0) elf.absentLeft = Math.max(0, elf.absentLeft - dt);
  }
  state.spawnIn -= dt;
  if (state.spawnIn <= 0) {
    state.spawnIn = state.rushLeft > 0 ? state.spawnEvery * 0.55 : state.spawnEvery;
    if (state.queue.length >= queueMax(state)) {
      if (state.config.cheerEnabled) {
        loseCheer(state, cheerHit(state));
        if (state.phase !== "play") return;
      }
    } else {
      state.queue.push(makeToy(state));
    }
  }
  acceptIntake(state);
  moveTracks(state, dt);
}

function acceptIntake(state) {
  if (state.dragging || !state.queue.length) return;
  const index = alignedIndex(state, 0);
  if (state.belt[index]) return;
  if (state.tracks.some((track) => track && track.dir < 0 && alignedIndex(state, track.world) === index)) return;
  state.belt[index] = state.queue.shift();
}

function moveTracks(state, dt) {
  state.tracks.forEach((track, index) => {
    if (!track) return;
    const step = dt / travelSeconds(state, state.stations[index]);
    track.t += step * track.dir;
    if (track.dir > 0 && track.t >= 1) {
      track.t = 1;
      arriveStation(state, index);
    } else if (track.dir < 0 && track.t <= 0) {
      track.t = 0;
      arriveBelt(state, index);
    }
  });
}

function arriveStation(state, index) {
  const track = state.tracks[index];
  const station = state.stations[index];
  const elf = state.elves.find((item) => item.id === station.elfId);
  const open = station.slots.findIndex((slot) => !slot);
  const holdOpen = holdSlots(state) > 0 && !station.hold;
  const jammed = state.jam && state.jam.station === index;
  if (jammed || elf.absentLeft > 0 || (open < 0 && !holdOpen)) {
    track.dir = -1;
    return;
  }
  if (open >= 0) station.slots[open] = track.toy;
  else station.hold = track.toy;
  state.tracks[index] = null;
  if (open < 0 || !covers(station.slots, station.list)) return;
  const pay = 24 + station.list.length * 14 + (state.day - 1) * 3;
  state.earned += pay;
  state.cash += pay;
  station.list = rollList(state);
  station.slots = Array.from({ length: station.list.length }, () => null);
  state.burst = { station: index, token: ++state.burstToken };
}

function arriveBelt(state, index) {
  const track = state.tracks[index];
  const beltIndex = alignedIndex(state, track.world);
  if (state.belt[beltIndex]) {
    track.dir = 1;
    return;
  }
  state.belt[beltIndex] = track.toy;
  state.tracks[index] = null;
}

function loseCheer(state, amount) {
  const broke = [];
  state.stations.forEach((station, index) => {
    station.cheer = Math.max(0, station.cheer - amount);
    if (station.cheer === 0) broke.push(index);
  });
  for (const index of broke) {
    if (state.phase !== "play") return;
    if (!state.reserves.length) {
      state.dragging = false;
      state.over = true;
      state.phase = "results";
      return;
    }
    const station = state.stations[index];
    state.exhausted.push(station.elfId);
    station.elfId = state.reserves.shift();
    station.cheer = state.cheerMax;
    station.slots = station.slots.map(() => null);
    state.tracks[index] = null;
    state.burst = { station: index, token: ++state.burstToken };
  }
}

function cheerHit(state) {
  return 18 * CHEER_SCALE[state.upgrades.cheer];
}

function travelSeconds(state, station) {
  const elf = state.elves.find((item) => item.id === station.elfId);
  return TRAVEL[state.upgrades.track] * (elf?.speed || 1);
}

function addStation(state) {
  const elfId = state.reserves.shift();
  if (!elfId) return;
  state.stations.push({
    elfId,
    cheer: state.cheerMax,
    slots: [],
    hold: null,
    list: rollList(state),
  });
  state.tracks.push(null);
}

function makeToy(state) {
  const types = TOYS.slice(0, state.typeCount);
  const rescue = rescueType(state);
  const type = rescue || types[Math.floor(state.rand() * types.length)].id;
  return { uid: state.uid++, type };
}

/** When the belt is more than half full and a list is one toy short, with a cup open, the next toy is that missing one. */
function rescueType(state) {
  const filled = state.belt.filter(Boolean).length;
  if (filled / state.belt.length <= 0.5) return null;
  const due = [];
  for (const station of state.stations) {
    const missing = missingTypes(station);
    const empty = station.slots.filter((slot) => !slot).length;
    if (missing.length === 1 && empty >= 1) due.push(missing[0]);
  }
  if (!due.length) return null;
  return due[Math.floor(state.rand() * due.length)];
}

function missingTypes(station) {
  const have = new Map();
  for (const toy of station.slots) {
    if (toy) have.set(toy.type, (have.get(toy.type) || 0) + 1);
  }
  const missing = [];
  for (const type of station.list) {
    const left = (have.get(type) || 0) - 1;
    if (left < 0) missing.push(type);
    else have.set(type, left);
  }
  return missing;
}

function rollList(state) {
  const types = TOYS.slice(0, state.typeCount);
  const list = [];
  const used = new Set();
  for (let i = 0; i < state.listLength; i += 1) {
    let pool = types.filter((toy) => !used.has(toy.id));
    if (!pool.length) pool = types;
    const pick = pool[Math.floor(state.rand() * pool.length)];
    if (used.size < types.length) used.add(pick.id);
    list.push(pick.id);
  }
  return list;
}

function covers(slots, list) {
  const have = new Map();
  for (const toy of slots) {
    if (toy) have.set(toy.type, (have.get(toy.type) || 0) + 1);
  }
  const need = new Map();
  for (const type of list) need.set(type, (need.get(type) || 0) + 1);
  for (const [type, count] of need) {
    if ((have.get(type) || 0) < count) return false;
  }
  return true;
}

function mod(value, size) {
  return ((value % size) + size) % size;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let n = t;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}
