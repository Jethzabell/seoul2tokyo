import payload from '$lib/payload.json';

export function load() {
  const segments = payload.transport.segments.filter(s => ['seg_fj_03', 'seg_fj_04'].includes(s.id));
  const airCanada = payload.transport.segments.find(s => s.id === 'seg_05');
  return { segments, airCanada, index: 10, total: 10 };
}
