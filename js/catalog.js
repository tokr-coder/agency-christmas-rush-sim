/** Toy icons, elf portraits, the 12-day ramp, and the night shop. */

export const TOYS = [
  { id: "horse", color: "#c47a22", svg: `<path fill="currentColor" d="M4 24c2 3 22 3 24 0-6 2-18 2-24 0z"/><path fill="currentColor" d="M7 19c1-4 6-6 10-4l5-5 3 2-4 4c3 1 4 4 2 6H8z"/><circle cx="24" cy="10" r="3.2" fill="currentColor"/>` },
  { id: "jack", color: "#e23d3d", svg: `<rect x="7" y="14" width="18" height="14" rx="2" fill="currentColor"/><circle cx="16" cy="10" r="5" fill="currentColor"/><rect x="14.2" y="4" width="3.6" height="4" rx="1" fill="currentColor"/>` },
  { id: "bear", color: "#8a5a3b", svg: `<circle cx="8" cy="9" r="4" fill="currentColor"/><circle cx="24" cy="9" r="4" fill="currentColor"/><circle cx="16" cy="18" r="9" fill="currentColor"/>` },
  { id: "drum", color: "#1f8a4c", svg: `<ellipse cx="16" cy="9" rx="10" ry="4" fill="currentColor"/><path fill="currentColor" d="M6 9h20v12c0 2.2-4.5 4-10 4s-10-1.8-10-4V9z"/><path d="M8 12c6 3 10 3 16 0" fill="none" stroke="#fffaf4" stroke-width="1.6"/>` },
  { id: "train", color: "#1d3f6e", svg: `<rect x="3" y="16" width="16" height="8" rx="2" fill="currentColor"/><rect x="16" y="11" width="10" height="9" rx="1.5" fill="currentColor"/><rect x="23" y="6" width="3" height="6" fill="currentColor"/><circle cx="9" cy="25" r="2.6" fill="currentColor"/><circle cx="20" cy="25" r="2.6" fill="currentColor"/>` },
  { id: "duck", color: "#e0a03a", svg: `<ellipse cx="13" cy="21" rx="9" ry="6" fill="currentColor"/><circle cx="22" cy="14" r="5" fill="currentColor"/><path fill="currentColor" d="M26 13h6l-4 4z"/>` },
  { id: "kite", color: "#c4376a", svg: `<polygon points="16,2 29,16 16,30 3,16" fill="currentColor"/><path d="M16 30c2 0 3 2 2 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>` },
  { id: "doll", color: "#6e2430", svg: `<circle cx="16" cy="8" r="5" fill="currentColor"/><path fill="currentColor" d="M7 29 16 14l9 15z"/>` },
];

export const ELVES = [
  { id: "coree", hue: "#6e2430" },
  { id: "brandon", hue: "#1f4a38" },
  { id: "tomas", hue: "#243246" },
  { id: "sean", hue: "#1d3f6e" },
  { id: "kajal", hue: "#b26b2c" },
  { id: "jessica", hue: "#3f6b52" },
];

/** types: how many toy icons exist. list: icons each elf must gather.
 *  stations: benches wanted if a reserve elf is free. spawn: seconds between toys.
 *  event.at is how far through the day the disruption starts. */
export const DAYS = [
  { types: 4, list: 2, stations: 2, spawn: 2.7 },
  { types: 4, list: 2, stations: 2, spawn: 2.45 },
  { types: 5, list: 3, stations: 2, spawn: 2.25 },
  { types: 5, list: 3, stations: 2, spawn: 2.1 },
  { types: 6, list: 3, stations: 3, spawn: 2.0 },
  { types: 6, list: 3, stations: 3, spawn: 1.85 },
  { types: 6, list: 3, stations: 3, spawn: 1.75, event: { at: 0.42, kind: "rush", seconds: 14 } },
  { types: 7, list: 4, stations: 3, spawn: 1.65 },
  { types: 7, list: 4, stations: 4, spawn: 1.55 },
  { types: 8, list: 4, stations: 4, spawn: 1.5, event: { at: 0.48, kind: "jam", seconds: 12, station: 0 } },
  { types: 8, list: 4, stations: 4, spawn: 1.4 },
  { types: 8, list: 4, stations: 4, spawn: 1.3, event: { at: 0.4, kind: "rush", seconds: 16 } },
];

export const UPGRADES = [
  { id: "queue", max: 3, costs: [70, 130, 210] },
  { id: "track", max: 2, costs: [90, 170] },
  { id: "slots", max: 1, costs: [140] },
  { id: "cheer", max: 3, costs: [80, 150, 260] },
  { id: "station", max: 1, costs: [240] },
];

export const TRAIN_COST = 160;

export function toySvg(id) {
  const toy = TOYS.find((item) => item.id === id) || TOYS[0];
  return `<span class="icon" style="color:${toy.color}"><svg viewBox="0 0 32 32" aria-hidden="true">${toy.svg}</svg></span>`;
}
