/**
 * Dynamic contribution allocation engine.
 * Total allocation must always equal 100%.
 * First manually adjusted source becomes locked; others rebalance proportionally.
 * Future-proof: supports dynamic number of sources (data-driven).
 */

export type Source = {
  id: string;
  value: number;
  locked: boolean;
};

/**
 * Rebalance sources when one source changes.
 * - Marks the changed source as locked.
 * - Redistributes remaining % (100 - sum(locked)) proportionally among unlocked sources.
 * - If only one unlocked source remains, it receives the entire remainder.
 * - If all sources are locked, the changed source absorbs the difference so total = 100.
 * - No negative values; total always 100; deterministic, no jitter.
 */
export function rebalanceSources(
  sources: Source[],
  changedId: string,
  newValue: number
): Source[] {
  const result = sources.map((s) => ({ ...s, value: Math.max(0, s.value), locked: s.locked }));

  const idx = result.findIndex((s) => s.id === changedId);
  if (idx === -1) return result;

  const otherLockedSum = result
    .filter((s) => s.locked && s.id !== changedId)
    .reduce((sum, s) => sum + s.value, 0);
  const maxAllowed = 100 - otherLockedSum;
  const clamped = Math.min(100, Math.max(0, newValue), maxAllowed);

  result[idx].value = clamped;
  result[idx].locked = true;

  const lockedSum = result.filter((s) => s.locked).reduce((sum, s) => sum + s.value, 0);
  const remaining = 100 - lockedSum;
  const unlocked = result.filter((s) => !s.locked);

  if (unlocked.length === 0) {
    const otherSum = result.reduce((s, x, i) => (i === idx ? s : s + x.value), 0);
    result[idx].value = Math.min(100, Math.max(0, 100 - otherSum));
    return normalizeTotal(result, idx);
  }

  if (unlocked.length === 1) {
    unlocked[0].value = Math.min(100, Math.max(0, remaining));
    return normalizeTotal(result, idx);
  }

  const unlockedSum = unlocked.reduce((s, x) => s + x.value, 0);
  if (unlockedSum <= 0) {
    const per = remaining / unlocked.length;
    unlocked.forEach((s, i) => {
      s.value = i === unlocked.length - 1 ? remaining - per * (unlocked.length - 1) : per;
    });
  } else {
    unlocked.forEach((s) => {
      s.value = (s.value / unlockedSum) * remaining;
    });
  }

  return normalizeTotal(result, idx);
}

function normalizeTotal(sources: Source[], absorbIndex?: number): Source[] {
  const rounded = sources.map((s) => ({ ...s, value: Math.round(s.value * 10) / 10 }));
  const total = rounded.reduce((s, x) => s + x.value, 0);
  const diff = 100 - total;
  if (diff === 0) return rounded;
  const fallbackIdx = rounded.findIndex((s) => s.locked);
  const absorbIdx = absorbIndex ?? fallbackIdx >= 0 ? fallbackIdx : rounded.length - 1;
  const targetIdx = absorbIdx >= 0 && absorbIdx < rounded.length ? absorbIdx : rounded.length - 1;
  rounded[targetIdx].value = Math.min(100, Math.max(0, rounded[targetIdx].value + diff));
  return rounded;
}

/** Convert plain allocation record to Source[] (no locks). */
export function allocationToSources(
  allocation: Record<string, number>,
  sourceIds: string[]
): Source[] {
  return sourceIds.map((id) => ({
    id,
    value: Math.max(0, allocation[id] ?? 0),
    locked: false,
  }));
}

/** Merge existing locks into sources. */
export function mergeLocks(
  sources: Source[],
  lockedIds: Set<string>
): Source[] {
  return sources.map((s) => ({
    ...s,
    locked: lockedIds.has(s.id),
  }));
}

/** Convert Source[] back to plain allocation record. */
export function sourcesToAllocation(
  sources: Source[],
  sourceIds: string[]
): Record<string, number> {
  const out: Record<string, number> = {};
  sourceIds.forEach((id) => {
    const s = sources.find((x) => x.id === id);
    out[id] = s ? Math.max(0, Math.min(100, s.value)) : 0;
  });
  return out;
}

/** Get set of locked source ids from Source[]. */
export function getLockedIds(sources: Source[]): Set<string> {
  const set = new Set<string>();
  sources.forEach((s) => {
    if (s.locked) set.add(s.id);
  });
  return set;
}
