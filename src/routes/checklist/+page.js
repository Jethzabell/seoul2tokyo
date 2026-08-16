import payload from '$lib/payload.json';

export function load() {
  return {
    reserve: payload.checklist.reserve,
    buy: payload.checklist.buy
  };
}
