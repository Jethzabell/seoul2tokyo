import payload from '$lib/payload.json';

export function load() {
  return { cities: payload.city_guides.cities };
}
