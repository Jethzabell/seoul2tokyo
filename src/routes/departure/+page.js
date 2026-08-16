import payload from '$lib/payload.json';
import { getNeighbors, stepHref } from '$lib/journeyFlow.js';

export function load() {
  const seg = payload.transport.segments.find(s => s.id === 'seg_01');
  const { prev, next, index, total } = getNeighbors(null, null);
  return {
    seg,
    prevHref:  prev  ? stepHref(prev) : '/',
    nextHref:  stepHref(next),
    nextLabel: next  ? `${next.city} · ${next.label}` : 'Next',
    index,
    total,
  };
}
