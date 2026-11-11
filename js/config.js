/** Tunable clock for the 12-day rush.
 *  dayLengthSeconds is one working day in real time. 240 = 4 minutes.
 *  gameHoursPerDay maps that span onto a 12-hour floor day, so a "6-hour"
 *  emergency stays half a day even if you change the real-time length.
 *  A local URL can rehearse a shorter day: ?daySeconds=20
 */

export const CONFIG = {
  dayCount: 12,
  dayLengthSeconds: 240,
  gameHoursPerDay: 12,
  trayLimit: 3,
  queueLimit: 3,
  /** Game hours between new briefs once the tray has room. */
  spawnHours: 0.4,
  /** How long a brief sits in the tray, in game hours, before it walks. */
  patienceHours: [1.7, 2.25],
  tutorialSpawnHours: 0.75,
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
