import payload from '$lib/payload.json';
import { getNeighbors, stepHref } from '$lib/journeyFlow.js';

export function load() {
  const seg = payload.transport.segments.find(s => s.id === 'seg_01');
  const companionSegments = payload.transport.segments.filter(s =>
    s.travelers_names?.includes('Carlos') && s.date === '2026-10-17'
  );
  const { prev, next, index, total } = getNeighbors(null, null);
  return {
    seg,
    companionSegments,
    prevHref:  prev  ? stepHref(prev) : '/',
    nextHref:  stepHref(next),
    nextLabel: next  ? `${next.city} · ${next.label}` : 'Next',
    index,
    total,
  };
}
