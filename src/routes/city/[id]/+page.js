import payload from '$lib/payload.json';
import { normalizeTab, getNeighbors, stepHref, getCityTabModel } from '$lib/journeyFlow.js';
import { error } from '@sveltejs/kit';

const cityThemes = {
  city_tokyo_shibuya: {
    pageBg:   '#e8eef8',
    cardBg:   '#f0f4fc',
    cardBorder: '#c0d0e8',
    accent:   '#2a5cb8',
    accentBg: '#dde8f8',
    accentMuted: '#7090c8',
    headerBg: '#2a5cb8',
    tabActive: '#2a5cb8',
    tabActiveBg: '#2a5cb8',
    name: 'blue',
  },
  city_kyoto: {
    pageBg:   '#e8f2ec',
    cardBg:   '#f0f8f2',
    cardBorder: '#b0d8b8',
    accent:   '#286840',
    accentBg: '#d8f0dc',
    accentMuted: '#60a870',
    headerBg: '#286840',
    tabActive: '#286840',
    tabActiveBg: '#286840',
    name: 'green',
  },
  city_osaka: {
    pageBg:   '#fdf0e4',
    cardBg:   '#fef8f0',
    cardBorder: '#f0c890',
    accent:   '#c87020',
    accentBg: '#fde8cc',
    accentMuted: '#d89050',
    headerBg: '#c87020',
    tabActive: '#c87020',
    tabActiveBg: '#c87020',
    name: 'amber',
  },
  city_tokyo_shinjuku: {
    pageBg:   '#f0eaf8',
    cardBg:   '#f8f0fc',
    cardBorder: '#d0b0e8',
    accent:   '#6830a8',
    accentBg: '#ecdcf8',
    accentMuted: '#9860c8',
    headerBg: '#6830a8',
    tabActive: '#6830a8',
    tabActiveBg: '#6830a8',
    name: 'purple',
  },
};

const defaultTheme = {
  pageBg:   '#f5ede8',
  cardBg:   '#faf0eb',
  cardBorder: '#e8d0c8',
  accent:   '#c8705a',
  accentBg: '#fde8e0',
  accentMuted: '#a08878',
  headerBg: '#c8705a',
  tabActive: '#c8705a',
  tabActiveBg: '#c8705a',
  name: 'terracotta',
};

export function entries() {
  return payload.destinations.map(d => ({ id: d.id }));
}

export function load({ params, url }) {
  let tabParam = null;
  try { tabParam = url.searchParams.get('tab'); } catch { /* prerender */ }
  const tab = normalizeTab(tabParam, params.id);
  const model = getCityTabModel(payload, params.id);

  if (!model.destination) throw error(404, 'City not found');

  const { prev, next, index, total } = getNeighbors(params.id, tab);

  return {
    ...model,
    tab,
    theme: cityThemes[params.id] ?? defaultTheme,
    prevHref:  prev ? stepHref(prev) : '/',
    nextHref:  next ? stepHref(next) : '/',
    prevLabel: prev ? `${prev.city} · ${prev.label}` : 'Home',
    nextLabel: next ? `${next.city} · ${next.label}` : 'Done',
    index,
    total,
    tabHrefs: {
      summary:   `/city/${params.id}?tab=summary`,
      itinerary: `/city/${params.id}?tab=itinerary`,
      extra:     `/city/${params.id}?tab=extra`,
    },
  };
}
