import { DAYS, ELVES, TOYS, UPGRADES } from "./catalog.js";

const TRAVEL = [1.15, 0.86, 0.64];
const CHEER_SCALE = [1, 0.78, 0.6, 0.46];

export function createGame(config, seed) {
  return {
    config,
    rand: mulberry32(seed >>> 0),
    phase: "title",
    day: 0,
    earned: 0,
    cash: 0,
    cheerMax: config.cheerMax,
    elves: ELVES.map((elf) => ({ ...elf })),
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
    batch: 0,
    processed: 0,
    spawned: 0,
    listStack: [],
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
  state.batch = plan.batch;
  state.processed = 0;
  state.spawned = 0;
  state.phase = "play";
  state.over = false;
  state.spawnIn = 0.8;
  state.rushLeft = 0;
  state.jam = null;
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
  state.listStack = buildLists(state);
  for (const station of state.stations) assignList(state, station);
  state.tracks = state.stations.map(() => null);
}

function endDay(state) {
  state.dragging = false;
  state.phase = state.day >= state.config.dayCount ? "results" : "shop";
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
  return mod(world - Math.round(state.spin), state.belt.length);
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

export function tick(state, dt) {
  if (state.phase !== "play" || !(dt > 0)) return;
  if (state.rushLeft > 0) state.rushLeft = Math.max(0, state.rushLeft - dt);
  if (state.jam) {
    state.jam.left -= dt;
    if (state.jam.left <= 0) state.jam = null;
  }
  releaseHeldToys(state);
  if (state.phase !== "play") return;
  state.spawnIn -= dt;
  if (state.spawnIn <= 0) {
    state.spawnIn = state.spawnEvery;
    if (state.spawned < state.batch) {
      if (state.queue.length >= queueMax(state)) {
        endDay(state);
        return;
      }
      const toy = makeToy(state);
      if (toy) {
        state.queue.push(toy);
        state.spawned += 1;
      }
    } else if (state.queue.length < queueMax(state)) {
      const { current } = toyOutlook(state);
      if (current.length) {
        const type = current[Math.floor(state.rand() * current.length)];
        state.queue.push({ uid: state.uid++, type });
        state.spawned += 1;
      }
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
    const step = dt / travelSeconds(state);
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
  const open = station.slots.findIndex((slot) => !slot);
  const holdOpen = holdSlots(state) > 0 && !station.hold;
  const jammed = state.jam && state.jam.station === index;
  if (jammed) {
    track.dir = -1;
    return;
  }
  if (open >= 0) {
    station.slots[open] = track.toy;
    state.tracks[index] = null;
    payList(state, index);
    return;
  }
  if (holdOpen) {
    station.hold = track.toy;
    state.tracks[index] = null;
    settleHold(state, index);
    return;
  }
  if (station.hold && listStillNeeds(station, track.toy.type) && excessSlot(station) >= 0) {
    const parked = station.hold;
    station.hold = track.toy;
    track.toy = parked;
    track.dir = -1;
    settleHold(state, index);
    return;
  }
  track.dir = -1;
}

/** A held toy finishes the list when that list needs it. A wrong toy in a list cup stays in the hold.
 *  A finished elf sends a held toy back when another list still needs that toy and no other copy is out. */
function releaseHeldToys(state) {
  for (let index = 0; index < state.stations.length; index += 1) {
    if (state.phase !== "play") return;
    settleHold(state, index);
  }
  if (state.phase !== "play") return;
  for (let index = 0; index < state.stations.length; index += 1) returnIdleHold(state, index);
}

function settleHold(state, index) {
  const station = state.stations[index];
  if (!station.hold || !station.list.length || state.phase !== "play") return;
  if (!listStillNeeds(station, station.hold.type)) return;
  const open = station.slots.findIndex((slot) => !slot);
  if (open >= 0) {
    station.slots[open] = station.hold;
    station.hold = null;
    payList(state, index);
    return;
  }
  const excess = excessSlot(station);
  if (excess < 0) return;
  const displaced = station.slots[excess];
  station.slots[excess] = station.hold;
  station.hold = displaced;
  payList(state, index);
}

function excessSlot(station) {
  const seen = new Map();
  for (let i = 0; i < station.slots.length; i += 1) {
    const toy = station.slots[i];
    if (!toy) continue;
    const used = (seen.get(toy.type) || 0) + 1;
    seen.set(toy.type, used);
    if (used > countType(station.list, toy.type)) return i;
  }
  return -1;
}

function returnIdleHold(state, index) {
  const station = state.stations[index];
  if (station.list.length || !station.hold || state.tracks[index]) return;
  const type = station.hold.type;
  const needed = state.stations.some((other, otherIndex) => otherIndex !== index && listStillNeeds(other, type));
  if (!needed || copyReady(state, type)) return;
  const world = portWorlds(state.stations.length)[index];
  const beltIndex = alignedIndex(state, world);
  if (state.belt[beltIndex]) return;
  if (state.tracks.some((track) => track && track.dir < 0 && alignedIndex(state, track.world) === beltIndex)) return;
  state.tracks[index] = { toy: station.hold, dir: -1, t: 1, world };
  station.hold = null;
}

function listStillNeeds(station, type) {
  return placedCount(station, type) < countType(station.list, type);
}

function placedCount(station, type) {
  let count = 0;
  for (const toy of station.slots) if (toy?.type === type) count += 1;
  return count;
}

function countType(list, type) {
  let count = 0;
  for (const item of list) if (item === type) count += 1;
  return count;
}

function copyReady(state, type) {
  if (state.queue.some((toy) => toy.type === type)) return true;
  if (state.belt.some((toy) => toy?.type === type)) return true;
  if (state.tracks.some((track) => track?.toy.type === type)) return true;
  return state.stations.some((station) => placedCount(station, type) > countType(station.list, type));
}

function payList(state, index) {
  const station = state.stations[index];
  if (!station.list.length || !covers(station.slots, station.list)) return;
  const pay = 24 + station.list.length * 14 + (state.day - 1) * 3;
  state.earned += pay;
  state.cash += pay;
  state.processed += station.list.length;
  assignList(state, station);
  state.burst = { station: index, token: ++state.burstToken };
  if (state.processed >= state.batch) endDay(state);
}

function arriveBelt(state, index) {
  const track = state.tracks[index];
  const beltIndex = alignedIndex(state, track.world);
  if (!Number.isInteger(beltIndex) || state.belt[beltIndex]) {
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

function travelSeconds(state) {
  return TRAVEL[state.upgrades.track];
}

function addStation(state) {
  const elfId = state.reserves.shift();
  if (!elfId) return;
  state.stations.push({
    elfId,
    cheer: state.cheerMax,
    slots: [],
    hold: null,
    list: [],
  });
  state.tracks.push(null);
}

function makeToy(state) {
  const type = nextToyType(state);
  if (!type) return null;
  return { uid: state.uid++, type };
}

/** Next toy is a random uncovered need on a bench. Later-list toys wait until those needs are already out. */
function nextToyType(state) {
  const { current, future } = toyOutlook(state);
  const pool = current.length ? current : future;
  if (!pool.length) return null;
  return pool[Math.floor(state.rand() * pool.length)];
}

function toyOutlook(state) {
  const needs = [];
  const shared = tally(state.queue);
  for (const toy of state.belt) if (toy) addTally(shared, toy.type);
  state.stations.forEach((station, index) => {
    if (station.hold) addTally(shared, station.hold.type);
    const inbound = state.tracks[index];
    const have = tally(station.slots);
    if (inbound && inbound.dir > 0) addTally(have, inbound.toy.type);
    else if (inbound) addTally(shared, inbound.toy.type);
    for (const type of station.list) {
      if (!takeTally(have, type)) needs.push(type);
    }
    for (const [type, count] of have) {
      for (let n = 0; n < count; n += 1) addTally(shared, type);
    }
  });
  const current = needs.filter((type) => !takeTally(shared, type));
  const future = state.listStack.flatMap((list) => list).filter((type) => !takeTally(shared, type));
  return { current, future };
}

function tally(toys) {
  const counts = new Map();
  for (const toy of toys) if (toy) addTally(counts, toy.type);
  return counts;
}

function addTally(counts, type) {
  counts.set(type, (counts.get(type) || 0) + 1);
}

function takeTally(counts, type) {
  const left = counts.get(type) || 0;
  if (left <= 0) return false;
  counts.set(type, left - 1);
  return true;
}

function buildLists(state) {
  const count = state.batch / state.listLength;
  const lists = Array.from({ length: count }, () => rollList(state));
  for (let i = lists.length - 1; i > 0; i -= 1) {
    const j = Math.floor(state.rand() * (i + 1));
    const swap = lists[i];
    lists[i] = lists[j];
    lists[j] = swap;
  }
  return lists;
}

function assignList(state, station) {
  station.list = state.listStack.pop() || [];
  station.slots = Array.from({ length: station.list.length }, () => null);
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
