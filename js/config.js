/** Tunable clock for the 12-day rush.
 *  dayLengthSeconds is one working day in real time. 240 = 4 minutes.
 *  gameHoursPerDay is the simulation hour. Catalog durations stay in these
 *  hours, so a job keeps the same real minutes when the label changes.
 *  shownHoursPerDay is what the clock and labels read. 6 shown hours across
 *  the same 12 simulation hours means every label is half as long.
 *  The floor opens at 8:00 and closes at 14:00, so noon is 4 shown hours in.
 *  A local URL can rehearse a shorter day: ?daySeconds=20
 */

export const CONFIG = {
  dayCount: 12,
  dayLengthSeconds: 240,
  gameHoursPerDay: 12,
  shownHoursPerDay: 6,
  trayLimit: 3,
  queueLimit: 3,
  /** Game hours between new briefs once the tray has room. */
  spawnHours: 0.16,
  /** How long a brief sits in the tray, in game hours, before it walks. */
  patienceHours: [1.7, 2.25],
  tutorialSpawnHours: 0.28,
  tutorialPatienceHours: 3.6,
};

export function loadConfig(search = "") {
  const params = new URLSearchParams(search);
  const daySeconds = Number(params.get("daySeconds"));
  const config = { ...CONFIG };
  if (Number.isFinite(daySeconds) && daySeconds >= 8 && daySeconds <= 3600) {
    config.dayLengthSeconds = daySeconds;
  }
  return config;
}

export function secondsPerGameHour(config) {
  return config.dayLengthSeconds / config.gameHoursPerDay;
}

/** Simulation hours, shown on the 6-hour clock. */
export function shownHours(config, simHours) {
  return simHours * (config.shownHoursPerDay / config.gameHoursPerDay);
}

/** Simulation hours from open until noon (8:00 to 12:00). */
export function morningHours(config) {
  const shownMorning = 4;
  return shownMorning * (config.gameHoursPerDay / config.shownHoursPerDay);
}
