/** Twelve sorting days. dayLengthSeconds is one day in real time.
 *  A local URL can rehearse a shorter day: ?daySeconds=20
 */

export const CONFIG = {
  dayCount: 12,
  dayLengthSeconds: 75,
  beltSlots: 8,
  queueBase: 4,
  cheerEnabled: false,
  cheerMax: 100,
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
