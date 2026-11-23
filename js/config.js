/** Twelve sorting days. A day ends when its toy batch is finished, or when the queue is full and the next toy cannot enter. */

export const CONFIG = {
  dayCount: 12,
  beltSlots: 8,
  queueBase: 4,
  cheerEnabled: false,
  cheerMax: 100,
};

export function loadConfig() {
  return { ...CONFIG };
}
