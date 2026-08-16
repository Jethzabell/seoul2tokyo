// Linear journey step sequence + navigation helpers

const VALID_TABS = ['summary', 'itinerary'];

/** Normalise a raw tab string → valid tab, defaulting to 'summary' */
export function normalizeTab(raw, cityId) {
  if (!cityId) return undefined;
  return VALID_TABS.includes(raw) ? raw : 'summary';
}

export const steps = [
  { id: 'departure',                  path: '/departure',                    city: 'Raleigh',           dates: 'Oct 17',      label: 'Departure',  type: 'departure' },
  { id: 'tokyo-shibuya-summary',      path: '/city/city_tokyo_shibuya',      city: 'Tokyo (Shibuya)',   dates: 'Oct 18–22',   label: 'Summary',    tab: 'summary'    },
  { id: 'tokyo-shibuya-itinerary',    path: '/city/city_tokyo_shibuya',      city: 'Tokyo (Shibuya)',   dates: 'Oct 18–22',   label: 'Itinerary',  tab: 'itinerary'  },
  { id: 'kyoto-summary',              path: '/city/city_kyoto',              city: 'Kyoto',             dates: 'Oct 23–26',   label: 'Summary',    tab: 'summary'    },
  { id: 'kyoto-itinerary',            path: '/city/city_kyoto',              city: 'Kyoto',             dates: 'Oct 23–26',   label: 'Itinerary',  tab: 'itinerary'  },
  { id: 'osaka-summary',              path: '/city/city_osaka',              city: 'Osaka',             dates: 'Oct 26–28',   label: 'Summary',    tab: 'summary'    },
  { id: 'osaka-itinerary',            path: '/city/city_osaka',              city: 'Osaka',             dates: 'Oct 26–28',   label: 'Itinerary',  tab: 'itinerary'  },
  { id: 'tokyo-shinjuku-summary',     path: '/city/city_tokyo_shinjuku',     city: 'Tokyo (Shinjuku)',  dates: 'Oct 28–31',   label: 'Summary',    tab: 'summary'    },
  { id: 'tokyo-shinjuku-itinerary',   path: '/city/city_tokyo_shinjuku',     city: 'Tokyo (Shinjuku)',  dates: 'Oct 28–31',   label: 'Itinerary',  tab: 'itinerary'  },
];

export function stepHref(step) {
  if (!step) return '/';
  return step.tab ? `${step.path}?tab=${step.tab}` : step.path;
}

/** Returns { prev, next, current, index, total } for city/[id] + tab, or departure */
export function getNeighbors(cityId, tab) {
  const normalizedTab = normalizeTab(tab, cityId);

  let idx = cityId
    ? steps.findIndex(s => s.path === `/city/${cityId}` && s.tab === normalizedTab)
    : steps.findIndex(s => s.id === 'departure');

  if (idx < 0) idx = steps.findIndex(s => s.id === 'departure');

  return {
    current: steps[idx]      ?? null,
    prev:    steps[idx - 1]  ?? null,
    next:    steps[idx + 1]  ?? null,
    index:   idx + 1,
    total:   steps.length,
  };
}

// ── Data resolvers ──────────────────────────────────────────────────────────

export const finders = {
  destination: (data, id)   => data?.destinations?.find(d => d.id === id) ?? null,
  segment:     (data, id)   => id ? data?.transport?.segments?.find(s => s.id === id) ?? null : null,
  airport:     (data, id)   => id ? data?.quick_info_cards?.airport_cards?.find(a => a.id === id) ?? null : null,
  rail:        (data, id)   => id ? data?.quick_info_cards?.rail_cards?.find(r => r.id === id) ?? null : null,
  guide:       (data, city) => city ? data?.city_guides?.cities?.find(c => c.city === city) ?? null : null,
};

export function getCityTabModel(data, cityId) {
  const meta = cityMeta[cityId] ?? {};
  const returnSegment = cityId === 'city_tokyo_shinjuku'
    ? finders.segment(data, RETURN_SEGMENT_ID)
    : null;
  return {
    destination: finders.destination(data, cityId),
    segment:     finders.segment(data, meta.segId),
    returnSegment,
    airportCard: finders.airport(data, meta.airportId),
    railCard:    finders.rail(data, meta.railId),
    cityGuide:   finders.guide(data, meta.guideCity),
  };
}

export const cityMeta = {
  city_tokyo_shibuya:  { segId: 'seg_01', airportId: 'air_tokyo',  railId: null,          guideCity: 'Tokyo'  },
  city_kyoto:          { segId: 'seg_02', airportId: null,          railId: 'rail_kyoto',  guideCity: 'Kyoto'  },
  city_osaka:          { segId: 'seg_03', airportId: null,          railId: 'rail_osaka',  guideCity: 'Osaka'  },
  city_tokyo_shinjuku: { segId: 'seg_04', airportId: 'air_tokyo',  railId: null,          guideCity: 'Tokyo'  },
};

export const RETURN_SEGMENT_ID = 'seg_05';
