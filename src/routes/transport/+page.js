import payload from '$lib/payload.json';

export function load() {
  // Normalize: ensure every segment has a `mode` field (some use `type` instead)
  // Exclude Frances & James segments (seg_fj_*)
  const segments = payload.transport.segments
    .filter(s => !s.id?.startsWith('seg_fj'))
    .map(s => ({ ...s, mode: s.mode ?? s.type ?? 'flight' }));

  const flightCount = segments.filter(s => s.mode === 'flight').length;
  const trainCount  = segments.filter(s => s.mode === 'train').length;

  let confirmedSpend = 0;
  for (const s of segments) {
    if (s.price?.status === 'confirmed' && s.price.amount > 0) confirmedSpend += s.price.amount;
  }

  return { segments, flightCount, trainCount, confirmedSpend };
}
