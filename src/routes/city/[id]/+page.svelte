<script>
  import ActivityIcon from '$lib/ActivityIcon.svelte';
  import GuideIcon from '$lib/GuideIcon.svelte';
  import { descriptions, getIconKey } from '$lib/activityMeta.js';
  import { segmentColors, tbd } from '$lib/segmentColors.js';
  import { fade } from 'svelte/transition';

  export let data;
  $: ({ destination, tab, theme, segment, returnSegment, airportCard, railCard, cityGuide,
        prevHref, nextHref, prevLabel, nextLabel, index, total, tabHrefs } = data);
  $: t = theme ?? { pageBg:'#f5ede8', cardBg:'#faf0eb', cardBorder:'#e8d0c8', accent:'#c8705a', accentBg:'#fde8e0', accentMuted:'#a08878', headerBg:'#c8705a' };
  $: ({ city, city_ui, activities, stay, dates } = destination);

  function segLabel(seg, idx, total) {
    if (seg.mode === 'flight' && idx === total - 1 && total > 1) return 'Departing by flight';
    if (seg.mode === 'flight') return 'Arriving by flight';
    return idx === 0 ? 'Arriving by train' : 'Departing by train';
  }

  $: transportSegments = [segment, returnSegment].filter(Boolean);

  function fmtDate(iso) {
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  $: stayRange = `${fmtDate(dates.arrival)} – ${fmtDate(dates.departure)}`;

  $: nightCount = (() => {
    const a = new Date(dates.arrival + 'T12:00:00');
    const d = new Date(dates.departure + 'T12:00:00');
    return Math.round((d - a) / 86400000);
  })();

  $: cityStats = (() => {
    let totalActs = 0, booked = 0, planned = 0, notBooked = 0, spend = 0, transitMin = 0;
    const mustDos = [];
    for (const a of activities) {
      totalActs++;
      if (a.booking_status === 'booked') booked++;
      else if (a.booking_status === 'planned') planned++;
      else notBooked++;
      if (a.price?.status === 'confirmed' && a.price.amount > 0) spend += a.price.amount;
      if (a.transport_from_previous?.duration_minutes) transitMin += a.transport_from_previous.duration_minutes;
      if (a.priority === 'must' && a.category !== 'Food' && a.category !== 'Logistics') mustDos.push(a);
    }
    return { totalActs, booked, planned, notBooked, spend, transitMin, mustDos };
  })();

  $: daySummaries = (() => {
    const ds = destination.day_summaries || {};
    const groups = {};
    for (const a of activities) {
      const d = a.day ?? 0;
      if (!groups[d]) groups[d] = 0;
      groups[d]++;
    }
    return Object.entries(ds)
      .sort(([a], [b]) => +a - +b)
      .map(([day, info]) => ({ day: +day, ...info, actCount: groups[+day] || 0 }));
  })();

  $: daySummaryMap = (() => {
    const m = {};
    for (const ds of daySummaries) m[ds.day] = ds;
    return m;
  })();

  $: mapUrl = destination.map_center
    ? `https://maps.google.com/?q=${destination.map_center.lat},${destination.map_center.lng}`
    : null;

  function dayDate(arrival, dayNum) {
    const d = new Date(arrival + 'T12:00:00');
    d.setDate(d.getDate() + dayNum - 1);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function parseStartToMinutes(label) {
    if (!label) return Number.POSITIVE_INFINITY;
    const raw = String(label).trim();
    const normalized = raw.toLowerCase();
    if (normalized === 'morning') return 9 * 60;
    if (normalized === 'noon') return 12 * 60;
    if (normalized === 'evening') return 18 * 60;
    if (normalized === 'night') return 21 * 60;
    const match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return Number.POSITIVE_INFINITY;
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const ampm = match[3].toUpperCase();
    if (ampm === 'AM') { if (hour === 12) hour = 0; }
    else if (hour !== 12) { hour += 12; }
    return hour * 60 + minute;
  }

  function displayPrice(p) {
    if (!p || typeof p !== 'object') return null;
    if (p.status === 'tbd' || p.amount == null) return 'TBD';
    if (p.amount === 0) return 'Free';
    const sym = p.currency === 'JPY' ? '¥' : p.currency === 'KRW' ? '₩' : '$';
    const val = `${p.approximate ? '~' : ''}${sym}${p.amount.toLocaleString()}`;
    return p.per_person ? `${val}/pp` : val;
  }

  function displayStart(activity) {
    if (activity?.start_time) return activity.start_time;
    const fallback = String(activity?.time_of_day ?? '').trim();
    if (fallback) return fallback;
    const duration = String(activity?.duration ?? '').trim().toLowerCase();
    if (['morning', 'noon', 'evening', 'night'].includes(duration)) {
      return duration.charAt(0).toUpperCase() + duration.slice(1);
    }
    return null;
  }

  const transportIcons = {
    walk: 'directions_walk', train: 'train', taxi: 'local_taxi',
    bus: 'directions_bus', subway: 'subway', drive: 'directions_car',
  };

  $: activityDays = (() => {
    const groups = {};
    for (const a of activities) {
      const d = a.day ?? 0;
      if (!groups[d]) groups[d] = [];
      groups[d].push(a);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([day, items]) => ({
        day: Number(day),
        items: [...items].sort((a, b) => {
          const aStart = parseStartToMinutes(a.start_time ?? a.time_of_day ?? null);
          const bStart = parseStartToMinutes(b.start_time ?? b.time_of_day ?? null);
          if (aStart !== bStart) return aStart - bStart;
          return String(a.name).localeCompare(String(b.name));
        })
      }));
  })();

  function dayMapUrl(items) {
    const stops = items
      .filter(a => a.links?.map)
      .map(a => {
        try { return new URL(a.links.map).searchParams.get('q') ?? ''; }
        catch { return ''; }
      })
      .filter(Boolean);
    if (stops.length === 0) return null;
    if (stops.length === 1) return `https://www.google.com/maps/search/${encodeURIComponent(stops[0])}`;
    return `https://www.google.com/maps/dir/${stops.map(s => encodeURIComponent(s)).join('/')}`;
  }

  const petals = [
    { x: 8, y: 8, r: -30, s: 0.9 }, { x: 88, y: 5, r: 15, s: 0.7 },
    { x: 75, y: 12, r: -10, s: 0.6 }, { x: 15, y: 16, r: 45, s: 0.8 },
    { x: 92, y: 20, r: -40, s: 0.75 }, { x: 5, y: 28, r: 20, s: 0.65 },
  ];

  $: segColor = segment ? (segmentColors[segment.style_tag] ?? segmentColors.sky) : segmentColors.sky;
  $: isFlight = segment?.mode === 'flight';

  function segmentColor(seg) {
    return segmentColors[seg.style_tag] ?? segmentColors.sky;
  }
</script>

<svelte:head><title>{city} · {tab.charAt(0).toUpperCase() + tab.slice(1)}</title></svelte:head>

<main class="min-h-screen flex items-center justify-center py-8 px-4" style="background:{t.pageBg}">
  <div class="phone-frame w-[340px] overflow-hidden flex flex-col" style="background:{t.cardBg}">

    <!-- Hero Banner -->
    <div class="relative overflow-hidden" style="height:160px;">
      <div class="absolute inset-0" style="background:linear-gradient(to bottom, {t.accentBg}, {t.cardBg})"></div>
      {#each petals as p}
        <div class="absolute pointer-events-none" style="left:{p.x}%; top:{p.y}%; transform:rotate({p.r}deg) scale({p.s}); width:18px; height:18px;">
          <svg viewBox="0 0 20 20" fill="none" class="w-full h-full">
            {#each [0,72,144,216,288] as r}
              <g transform="rotate({r} 10 10)"><ellipse cx="10" cy="4" rx="2.3" ry="3.8" fill="#f4b8b0" opacity="0.85"/></g>
            {/each}
            <circle cx="10" cy="10" r="1.5" fill="#fff0f2"/>
          </svg>
        </div>
      {/each}
      <svg viewBox="0 0 340 100" class="absolute bottom-0 w-full" fill="none">
        <circle cx="30" cy="68" r="20" fill="#f4c0b8" opacity="0.55"/>
        <circle cx="14" cy="74" r="14" fill="#f8ccc4" opacity="0.45"/>
        <rect x="58"  y="54" width="20" height="46" rx="2" fill="#e8b8b0" opacity="0.65"/>
        <rect x="82"  y="44" width="24" height="56" rx="2" fill="#dca0a0" opacity="0.6"/>
        <rect x="110" y="50" width="22" height="50" rx="2" fill="#e0a8a0" opacity="0.65"/>
        <rect x="196" y="52" width="24" height="48" rx="2" fill="#e0a8a0" opacity="0.65"/>
        <rect x="224" y="62" width="16" height="38" rx="2" fill="#dca0a0" opacity="0.6"/>
        <rect x="244" y="56" width="20" height="44" rx="2" fill="#e8b8b0" opacity="0.65"/>
        <circle cx="310" cy="66" r="18" fill="#f4c0b8" opacity="0.5"/>
        <circle cx="326" cy="72" r="13" fill="#f8ccc4" opacity="0.4"/>
        <rect x="0" y="98" width="340" height="2" fill="#f0c8c0" opacity="0.4"/>
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center pb-4">
        <p class="font-sans text-[10px] uppercase tracking-widest mt-0.5" style="color:{t.accentMuted}">Step {index} / {total}</p>
        <div class="relative flex items-center justify-center">
          <svg class="absolute -left-6 top-1 w-6 h-6 opacity-30" viewBox="0 0 24 24" fill="none">
            <path d="M20,22 Q14,16 10,6" stroke="{t.accent}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
            <circle cx="10" cy="6" r="2.5" fill="#f4c0d0" opacity="0.8"/>
            <circle cx="14" cy="12" r="2" fill="#f8d0dc" opacity="0.7"/>
          </svg>
          <h1 class="font-cursive text-4xl leading-none mt-0.5" style="color:{t.accent}">{city}</h1>
          <svg class="absolute -right-6 top-1 w-6 h-6 opacity-30" viewBox="0 0 24 24" fill="none">
            <path d="M4,22 Q10,16 14,6" stroke="{t.accent}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
            <circle cx="14" cy="6" r="2.5" fill="#f4c0d0" opacity="0.8"/>
            <circle cx="10" cy="12" r="2" fill="#f8d0dc" opacity="0.7"/>
          </svg>
        </div>
        <p class="font-sans text-xs mt-1" style="color:{t.accentMuted}">{stayRange}</p>
      </div>
    </div>

    <!-- Tab Bar -->
    <div class="flex items-center gap-1.5 px-4 pt-3 pb-0">
      {#each [['summary','Summary'],['itinerary','Itinerary']] as [tabKey, lbl]}
        <a
          href={tabHrefs[tabKey]}
          class="flex-1 text-center font-sans text-xs font-semibold py-1.5 rounded-full border transition-colors"
          style={tab === tabKey
            ? `background:${t.accent}; color:white; border-color:${t.accent}`
            : `background:rgba(255,255,255,0.5); backdrop-filter:blur(8px); color:${t.accent}; border-color:${t.accentBg}`}
        >{lbl}</a>
      {/each}
    </div>

    <!-- Tab Content -->
    <div class="flex flex-col gap-3 px-4 py-4 flex-1">

      <!-- ═══════════ SUMMARY TAB ═══════════ -->
      {#if tab === 'summary'}
      <div in:fade={{ duration: 220, delay: 40 }}>

        <!-- Overview card -->
        <div class="rounded-2xl overflow-hidden shadow-sm border" style="border-color:{t.accentBg}">
          <div class="px-4 py-3" style="background:linear-gradient(135deg, {t.accent}, {t.headerBg})">
            <p class="font-sans font-semibold text-sm text-white/95 leading-snug">{city_ui.hero_subtitle}</p>
          </div>
          <div class="bg-white px-4 py-3 flex flex-col gap-2">
            <div class="flex items-center gap-4 text-xs text-[#7a5c56] font-sans">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-rounded text-sm" style="color:{t.accent}">calendar_month</span>{stayRange}
              </span>
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-rounded text-sm" style="color:{t.accent}">dark_mode</span>{nightCount}N
              </span>
            </div>
            {#if mapUrl}
              <a href={mapUrl} target="_blank" rel="noopener"
                class="flex items-center gap-1 text-xs font-semibold hover:underline" style="color:{t.accent}">
                <span class="material-symbols-rounded text-sm">map</span>View all on map
              </a>
            {/if}
          </div>
        </div>

        <!-- Hotel card -->
        <div class="rounded-2xl overflow-hidden shadow-sm border" style="border-color:{t.accentBg}">
          <div class="flex items-center gap-2 px-4 py-2" style="background:{t.accentBg}">
            <span class="material-symbols-rounded text-sm" style="color:{t.accent}">hotel</span>
            <span class="font-sans text-[10px] font-bold uppercase tracking-wider" style="color:{t.accent}">Accommodation</span>
          </div>
          <div class="bg-white px-4 py-3">
            {#if stay?.hotel_name}
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <a href={stay.hotel_link} target="_blank" rel="noopener"
                    class="font-sans text-sm font-bold hover:underline truncate block" style="color:{t.accent}">
                    {stay.hotel_name}
                  </a>
                  {#if stay.checkin_time || stay.checkout_time}
                    <div class="flex items-center gap-3 text-[10px] text-[#a08878] font-sans mt-1">
                      {#if stay.checkin_time}
                        <span class="flex items-center gap-0.5"><span class="material-symbols-rounded text-xs">login</span>{stay.checkin_time}</span>
                      {/if}
                      {#if stay.checkout_time}
                        <span class="flex items-center gap-0.5"><span class="material-symbols-rounded text-xs">logout</span>{stay.checkout_time}</span>
                      {/if}
                    </div>
                  {/if}
                </div>
                {#if stay.price_per_night}
                  <span class="shrink-0 font-sans text-[11px] font-bold text-[#287040] bg-[#e8f4ea] border border-[#98d098] px-2 py-0.5 rounded-full whitespace-nowrap">
                    {stay.price_per_night}<span class="font-normal text-[9px]">/night</span>
                  </span>
                {/if}
              </div>
            {:else}
              <p class="font-sans text-xs italic text-[#c0a8a0]">Hotel TBD</p>
            {/if}
          </div>
        </div>

        <!-- Stats ring + row -->
        <div class="bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-4" style="border-color:{t.accentBg}">
          <div class="relative shrink-0 w-16 h-16">
            <svg viewBox="0 0 36 36" class="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="{t.accentBg}" stroke-width="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="{t.accent}" stroke-width="3"
                stroke-dasharray="{cityStats.totalActs > 0 ? (cityStats.booked / cityStats.totalActs) * 100 : 0} 100"
                stroke-linecap="round" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="font-sans font-bold text-sm" style="color:{t.accent}">{cityStats.booked}</span>
              <span class="font-sans text-[7px] text-[#a08878] -mt-0.5">of {cityStats.totalActs}</span>
            </div>
          </div>
          <div class="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#287040]"></span>
              <span class="font-sans text-[11px] text-[#5a3d38]"><strong>{cityStats.booked}</strong> booked</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#4070a8]"></span>
              <span class="font-sans text-[11px] text-[#5a3d38]"><strong>{cityStats.planned}</strong> planned</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#c8705a]"></span>
              <span class="font-sans text-[11px] text-[#5a3d38]"><strong>{cityStats.notBooked}</strong> not booked</span>
            </div>
            {#if cityStats.spend > 0}
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-[#287040]"></span>
                <span class="font-sans text-[11px] text-[#5a3d38]"><strong>${cityStats.spend.toLocaleString()}</strong></span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Day by day timeline -->
        {#if daySummaries.length > 0}
          <div class="flex items-center gap-2 px-1">
            <span class="material-symbols-rounded text-sm" style="color:{t.accent}">view_timeline</span>
            <span class="font-sans text-[10px] font-bold uppercase tracking-wider" style="color:{t.accent}">Day by day</span>
          </div>
          <div class="flex flex-col relative">
            <div class="absolute left-[18px] top-2 bottom-2 w-px" style="background:{t.accentBg}"></div>
            {#each daySummaries as ds, dsIdx}
              <a href={tabHrefs.itinerary}
                class="flex items-start gap-3 pl-1 pr-1 py-2 rounded-xl hover:bg-white/60 transition-colors relative z-[1]">
                <div class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border-2" style="background:white; border-color:{t.accent}">
                  <span class="font-sans font-bold text-xs" style="color:{t.accent}">{ds.day}</span>
                </div>
                <div class="flex-1 min-w-0 pt-0.5">
                  <p class="font-sans font-semibold text-xs text-[#3a2020] truncate">{ds.focus}</p>
                  <p class="font-sans text-[10px] text-[#a08878] truncate">{ds.vibe}</p>
                </div>
                <div class="shrink-0 flex flex-col items-end gap-0.5 pt-0.5">
                  <span class="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style="background:{t.accentBg}; color:{t.accent}">{ds.actCount} acts</span>
                  <div class="flex gap-0.5">
                    {#if ds.energy === 'high'}
                      <span class="w-1.5 h-1.5 rounded-full bg-[#e84c4c]"></span>
                      <span class="w-1.5 h-1.5 rounded-full bg-[#e84c4c]"></span>
                      <span class="w-1.5 h-1.5 rounded-full bg-[#e84c4c]"></span>
                    {:else if ds.energy === 'medium'}
                      <span class="w-1.5 h-1.5 rounded-full bg-[#e8a84c]"></span>
                      <span class="w-1.5 h-1.5 rounded-full bg-[#e8a84c]"></span>
                      <span class="w-1.5 h-1.5 rounded-full bg-[#e0d0c8]"></span>
                    {:else}
                      <span class="w-1.5 h-1.5 rounded-full bg-[#4ecb71]"></span>
                      <span class="w-1.5 h-1.5 rounded-full bg-[#e0d0c8]"></span>
                      <span class="w-1.5 h-1.5 rounded-full bg-[#e0d0c8]"></span>
                    {/if}
                  </div>
                </div>
              </a>
            {/each}
          </div>
        {/if}

        <!-- Must-do highlights -->
        {#if cityStats.mustDos.length > 0}
          <div class="flex items-center gap-2 px-1">
            <span class="material-symbols-rounded text-sm" style="color:{t.accent}">star</span>
            <span class="font-sans text-[10px] font-bold uppercase tracking-wider" style="color:{t.accent}">Must-do highlights</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            {#each cityStats.mustDos as act}
              {@const iconKey = act.icon || getIconKey(act.id, act.category)}
              <div class="rounded-2xl border bg-white/80 shadow-sm p-3 flex flex-col gap-2" style="border-color:{t.accentBg}">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center p-1.5" style="background:{t.accentBg}">
                  <ActivityIcon icon={iconKey} />
                </div>
                <p class="font-sans font-bold text-[11px] text-[#3a2020] leading-tight">{act.name}</p>
                <div class="flex items-center gap-1 flex-wrap mt-auto">
                  {#if act.start_time}
                    <span class="font-sans text-[8px] text-[#a07870]">Day {act.day}</span>
                  {/if}
                  {#if act.booking_status === 'booked'}
                    <span class="font-sans text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#e8f4ea] text-[#287040]">Booked</span>
                  {:else if act.booking_status === 'planned'}
                    <span class="font-sans text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#e8eef8] text-[#4070a8]">Planned</span>
                  {:else}
                    <span class="font-sans text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#fdf0e8] text-[#c8705a]">Not booked</span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}

        {#each transportSegments as seg, segIdx}
          {@const c = segmentColor(seg)}
          {@const segIsFlight = seg.mode === 'flight'}
          <p class="font-sans text-[10px] uppercase tracking-wider text-[#b08878] px-1">{segLabel(seg, segIdx, transportSegments.length)}</p>
          <div class="rounded-2xl overflow-hidden border shadow-sm" style="background:{c.bg}; border-color:{c.border}">
            <div class="h-1.5 w-full" style="background:{c.band}"></div>
            <div class="p-3 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-rounded text-sm" style="color:{c.text}">{segIsFlight ? (segIdx === transportSegments.length - 1 && transportSegments.length > 1 ? 'flight_takeoff' : 'flight_land') : 'train'}</span>
                <span class="font-sans font-bold text-xs" style="color:{c.text}">
                  {new Date(seg.date + 'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
                </span>
                <span class="ml-auto font-sans text-[10px] bg-white px-2 py-0.5 rounded-full border capitalize" style="color:{c.text}; border-color:{c.border}">{seg.mode}</span>
              </div>
              {#if seg.legs?.length}
                <div class="flex flex-col gap-1.5">
                  {#each seg.legs as leg}
                    {#if leg.layover}
                      <div class="flex items-center gap-1.5 bg-white/70 rounded-lg px-2 py-1 border text-[10px] font-sans text-[#7a5c56]" style="border-color:{c.border}">
                        <span class="material-symbols-rounded text-xs" style="color:{c.text}">connecting_airports</span>
                        <strong>{leg.duration}</strong> layover · {leg.city} ({leg.airport})
                      </div>
                    {:else}
                      <div class="bg-white rounded-lg p-2 shadow-sm">
                        <div class="flex items-center justify-between">
                          <span class="font-sans font-bold text-[11px]" style="color:{c.text}">{leg.from} → {leg.to}</span>
                          <span class="font-sans text-[9px] text-[#a08878]">{leg.duration}</span>
                        </div>
                        <div class="flex items-center justify-between mt-0.5">
                          <span class="font-sans font-bold text-[10px] text-[#3a2020]">{leg.depart}</span>
                          <span class="font-sans font-bold text-[10px] text-[#3a2020]">{leg.arrive}</span>
                        </div>
                        <p class="font-sans text-[9px] text-[#7a5c56] mt-0.5">{leg.flight} · {leg.aircraft}</p>
                      </div>
                    {/if}
                  {/each}
                </div>
              {:else}
                <div class="grid gap-2" style="grid-template-columns: 68px 1fr 72px">
                  <div class="flex flex-col gap-1">
                    <div class="bg-white rounded-lg p-1.5 text-center shadow-sm">
                      <p class="font-sans font-bold text-xs text-[#3a2020]">
                        {#if tbd(seg.time_depart)}{seg.time_depart}{:else}<span class="italic text-[#c0a8a0]">TBD</span>{/if}
                      </p>
                      <p class="text-[9px] text-[#c0a8a0]">↓</p>
                      <p class="font-sans font-bold text-xs text-[#3a2020]">
                        {#if tbd(seg.time_arrive)}{seg.time_arrive}{:else}<span class="italic text-[#c0a8a0]">TBD</span>{/if}
                      </p>
                    </div>
                    <p class="font-sans font-bold text-[10px] text-center" style="color:{c.text}">{seg.from.code}→{seg.to.code}</p>
                  </div>
                  <div class="flex flex-col gap-1 px-1 justify-center">
                    {#each [['Carrier', seg.carrier], [segIsFlight ? 'Flight' : 'Train', seg.number], ['Res.', seg.reservation_code]] as [lbl, val]}
                      <div class="flex items-baseline gap-1">
                        <span class="font-sans text-[9px] text-[#a08878] shrink-0 w-9">{lbl}</span>
                        {#if tbd(val)}
                          <span class="font-sans font-semibold text-[10px] text-[#3a2020] truncate">{val}</span>
                        {:else}
                          <span class="font-sans text-[9px] italic text-[#c0a8a0] bg-white px-1.5 rounded-full border border-dashed border-[#e0ccc8]">TBD</span>
                        {/if}
                      </div>
                    {/each}
                  </div>
                  <div class="bg-white rounded-lg p-1.5 flex flex-col items-center justify-center gap-0.5 shadow-sm text-center">
                    <span class="font-sans text-[8px] uppercase tracking-wide text-[#a08878]">{segIsFlight ? 'Terminal' : 'Station'}</span>
                    {#if tbd(seg.to.terminal ?? seg.to.station)}
                      <span class="font-cursive text-lg leading-none" style="color:{c.text}">{seg.to.terminal ?? seg.to.station}</span>
                    {:else}
                      <span class="font-sans text-[9px] italic text-[#c0a8a0]">TBD</span>
                    {/if}
                    <span class="font-sans font-bold text-xs text-[#3a2020]">{seg.to.code}</span>
                  </div>
                </div>
              {/if}
              {#if seg.passengers?.length}
                <div class="flex items-center gap-1 flex-wrap px-0.5">
                  <span class="font-sans text-[9px] text-[#a08878]">Pax</span>
                  {#each seg.passengers as name}
                    <span class="font-sans text-[9px] font-semibold text-[#5a3d38] bg-white px-1.5 py-0.5 rounded-full border" style="border-color:{c.border}">{name}</span>
                  {/each}
                </div>
              {/if}
              <div class="flex gap-1.5 flex-wrap">
                {#if seg.baggage?.personal_item}
                  <div class="flex items-center gap-0.5 bg-white rounded-full px-1.5 py-0.5 border text-[9px] font-sans" style="border-color:{c.border}; color:{c.text}">
                    <span class="material-symbols-rounded text-[10px]">backpack</span> Personal
                  </div>
                {/if}
                {#if seg.baggage?.carry_on}
                  <div class="flex items-center gap-0.5 bg-white rounded-full px-1.5 py-0.5 border text-[9px] font-sans" style="border-color:{c.border}; color:{c.text}">
                    <span class="material-symbols-rounded text-[10px]">luggage</span> Carry-on
                  </div>
                {/if}
                {#if seg.baggage?.checked_bag}
                  <div class="flex items-center gap-0.5 bg-white rounded-full px-1.5 py-0.5 border text-[9px] font-sans" style="border-color:{c.border}; color:{c.text}">
                    <span class="material-symbols-rounded text-[10px]">cases</span> Checked
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}

      </div><!-- /summary fade wrapper -->

      <!-- ═══════════ ITINERARY TAB ═══════════ -->
      {:else if tab === 'itinerary'}
      <div in:fade={{ duration: 220, delay: 40 }}>
        {#each activityDays as { day, items }}
          {@const ds = daySummaryMap[day]}
          {@const dMapUrl = dayMapUrl(items)}

          <!-- Day header -->
          <div class="flex flex-col gap-1.5 pt-1">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1.5 text-white rounded-full px-3 py-1 shadow-sm shrink-0" style="background:{t.accent}">
                <span class="font-sans font-bold text-xs">Day {day}</span>
              </div>
              {#if day > 0}
                <span class="font-sans text-[11px] text-[#a08878]">{dayDate(dates.arrival, day)}</span>
              {:else}
                <span class="font-sans text-[11px] italic text-[#c0a8a0]">Unscheduled</span>
              {/if}
              <div class="h-px flex-1 bg-[#f0d8d0]"></div>
              {#if dMapUrl}
                <a href={dMapUrl} target="_blank" rel="noopener" title="View day route on Google Maps"
                  class="shrink-0 flex items-center gap-1 bg-white border border-[#f0d0c8] rounded-full px-2 py-1 text-[#c8705a] hover:bg-[#fde8e0] transition-colors shadow-sm">
                  <span class="material-symbols-rounded text-sm leading-none">route</span>
                  <span class="font-sans text-[10px] font-semibold">{items.filter(a => a.links?.map).length} {items.filter(a => a.links?.map).length === 1 ? 'stop' : 'stops'}</span>
                </a>
              {/if}
            </div>

            <!-- Day summary bar -->
            {#if ds}
              <div class="glass-subtle rounded-lg px-2 py-1.5 flex items-center gap-1.5 flex-wrap">
                {#if ds.focus}
                  <span class="font-sans text-[9px] font-semibold text-[#5a3d38]">{ds.focus}</span>
                {/if}
                {#if ds.day_type}
                  <span class="font-sans text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded-full
                    {ds.day_type === 'full_day' ? 'bg-[#fde8e0] text-[#c8705a]' : ds.day_type === 'chill' ? 'bg-[#e8f4ea] text-[#287040]' : 'bg-[#f0e8f8] text-[#8060a0]'}">{ds.day_type.replace(/_/g, ' ')}</span>
                {/if}
                {#if ds.energy}
                  <span class="flex items-center gap-0.5 font-sans text-[8px] text-[#a08878]">
                    <span class="material-symbols-rounded text-[10px]">bolt</span>{ds.energy}
                  </span>
                {/if}
                {#if ds.transport}
                  <span class="flex items-center gap-0.5 font-sans text-[8px] text-[#a08878]">
                    <span class="material-symbols-rounded text-[10px]">directions</span>{ds.transport}
                  </span>
                {/if}
              </div>
              {#if ds.vibe}
                <p class="font-sans text-[9px] italic text-[#b08878] px-1 -mt-0.5">"{ds.vibe}"</p>
              {/if}
            {/if}
          </div>

          <!-- Activities for this day -->
          {#each items as activity, actIdx}
            {@const iconKey = activity.icon || getIconKey(activity.id, activity.category)}
            {@const desc = descriptions[activity.id] ?? activity.category}
            {@const isMust = activity.priority === 'must'}
            {@const hasTransport = activity.transport_from_previous?.mode && actIdx > 0}

            <!-- Transport connector -->
            {#if hasTransport}
              <div class="flex items-center gap-2 px-5 -my-1">
                <div class="w-px h-3 ml-4" style="background:{t.accent}40"></div>
                <div class="flex items-center gap-1 glass-subtle rounded-full px-2 py-0.5 border border-[#e8d8d0]">
                  <span class="material-symbols-rounded text-[10px] text-[#a08878]">{transportIcons[activity.transport_from_previous.mode] || 'swap_horiz'}</span>
                  <span class="font-sans text-[8px] text-[#a08878]">{activity.transport_from_previous.duration_minutes} min {activity.transport_from_previous.mode}</span>
                </div>
              </div>
            {/if}

            <!-- Sub-stop connector line -->
            {#if activity.sub_stop}
              <div class="flex items-center gap-2 pl-6 -my-0.5">
                <div class="w-px h-3" style="background:{t.accent}40"></div>
                <span class="font-sans text-[8px] text-[#b09888] tracking-wide">↳ stop inside</span>
              </div>
            {/if}

            <!-- Activity card -->
            <div class="{activity.sub_stop ? 'ml-4 border-l-2 rounded-l-none' : ''} glass-card glass-hover shadow-sm overflow-hidden
              {isMust && !activity.sub_stop ? 'border-l-[3px] border-l-[#c8705a]' : ''}
              {activity.sub_stop ? 'border-l-[#c8d0e0] bg-[#f8faff]/70' : ''}"
              style={activity.sub_stop ? 'border-left-color:#c8d8e8' : ''}>
              <div class="p-3 flex flex-col gap-2">
                <!-- Row 1: icon + name + price -->
                <div class="flex items-start gap-2.5">
                  <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center p-2" style="background:{t.accentBg}; border:1px solid {t.accent}30">
                    <ActivityIcon icon={iconKey} />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-1.5">
                      <div class="min-w-0">
                        <p class="font-sans font-bold text-[13px] text-[#3a2020] leading-tight">{activity.name}</p>
                        <p class="font-sans text-[10px] text-[#9a7070] mt-0.5 leading-snug">{desc}</p>
                      </div>
                      {#if displayPrice(activity.price)}
                        <span class="shrink-0 font-sans text-[10px] font-bold text-[#287040] bg-[#e8f4ea] border border-[#98d098] px-1.5 py-0.5 rounded-full">
                          {displayPrice(activity.price)}
                        </span>
                      {/if}
                    </div>
                  </div>
                </div>

                <!-- Row 2: time range + area + category/type -->
                <div class="flex items-center gap-1.5 flex-wrap">
                  {#if displayStart(activity)}
                    <span class="font-sans font-semibold text-[10px] text-[#5a3d38] glass-subtle px-1.5 py-0.5 rounded">
                      {displayStart(activity)}{#if activity.end_time} – {activity.end_time}{/if}
                    </span>
                  {/if}
                  <span class="font-sans text-[10px] font-bold text-[#7a5c56]">{activity.duration}</span>
                  {#if activity.area}
                    <span class="font-sans text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-[#f0e8f8] text-[#6050a0] border border-[#d8c8e8]">{activity.area}</span>
                  {/if}
                  {#if activity.type}
                    <span class="font-sans text-[8px] text-[#a08878]">{activity.category} · {activity.type}</span>
                  {/if}
                </div>

                <!-- Row 3: badges (priority, booking, energy) -->
                <div class="flex items-center gap-1 flex-wrap">
                  {#if activity.priority}
                    {@const priorityLabel = activity.priority === 'nice_to_have' ? 'nice' : activity.priority === 'flex' ? 'optional' : activity.priority}
                    <span class="font-sans text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full
                      {activity.priority === 'must' ? 'bg-[#fde8e0] text-[#c8705a] border border-[#e8b8a8]' :
                       activity.priority === 'nice_to_have' ? 'bg-[#fef5e4] text-[#8a5a00] border border-[#f0c860]' :
                       'bg-[#f0ece8] text-[#7a5c56] border border-[#e0c8c0]'}">
                      {priorityLabel}
                    </span>
                  {/if}
                  {#if activity.booking_status}
                    <span class="font-sans text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full border
                      {activity.booking_status === 'booked' ? 'bg-[#e8f4ea] text-[#287040] border-[#98d098]' :
                       activity.booking_status === 'planned' ? 'bg-[#e8eef8] text-[#4070a8] border-[#98b0d8]' :
                       activity.booking_status === 'waitlist' ? 'bg-[#f0e8f8] text-[#8060a0] border-[#c098d8]' :
                       'bg-[#fdf0e8] text-[#c8705a] border-[#e8c098]'}">
                      {activity.booking_status.replace(/_/g, ' ')}
                    </span>
                  {/if}
                  {#if activity.energy_cost}
                    <span class="flex items-center gap-0.5 font-sans text-[7px] uppercase px-1.5 py-0.5 rounded-full border
                      {activity.energy_cost === 'high' ? 'bg-[#fde8e8] text-[#c04040] border-[#e8a0a0]' :
                       activity.energy_cost === 'medium' ? 'bg-[#fef5e4] text-[#8a6a00] border-[#e8c880]' :
                       'bg-[#e8f4ea] text-[#287040] border-[#98d098]'}">
                      <span class="material-symbols-rounded text-[8px]">bolt</span>{activity.energy_cost}
                    </span>
                  {/if}
                  {#if activity.distance_from_hotel}
                    <span class="flex items-center gap-0.5 font-sans text-[7px] text-[#a08878] px-1.5 py-0.5 rounded-full bg-[#f8f0ec] border border-[#e8d8d0]">
                      <span class="material-symbols-rounded text-[8px]">hotel</span>{activity.distance_from_hotel.text}
                    </span>
                  {/if}
                </div>

                <!-- Row 4: tags -->
                {#if activity.tags?.length}
                  <div class="flex items-center gap-1 flex-wrap">
                    {#each activity.tags as tag}
                      <span class="font-sans text-[7px] px-1.5 py-0.5 rounded-full border
                        {tag === 'rain-safe' ? 'bg-[#e8f0fd] text-[#4070a8] border-[#a0c0e0]' :
                         tag === 'iconic' ? 'bg-[#fef5e4] text-[#8a6a00] border-[#e8c880]' :
                         tag === 'outdoor' ? 'bg-[#e8f4ea] text-[#287040] border-[#98d098]' :
                         tag === 'indoor' ? 'bg-[#f0e8f8] text-[#6050a0] border-[#c098d8]' :
                         tag === 'free' ? 'bg-[#e8f4ea] text-[#287040] border-[#98d098]' :
                         'bg-[#f8f0ec] text-[#7a5c56] border-[#e0d0c8]'}">
                        {tag}
                      </span>
                    {/each}
                  </div>
                {/if}

                <!-- Row 5: notes -->
                {#if activity.notes}
                  <p class="font-sans text-[9px] text-[#a08878] leading-snug italic">{activity.notes}</p>
                {/if}

                <!-- Row 6: fallback hints -->
                {#if activity.fallback}
                  <div class="flex flex-col gap-0.5">
                    {#if activity.fallback.if_rain}
                      <p class="font-sans text-[8px] text-[#4070a8] leading-snug flex items-start gap-1">
                        <span class="material-symbols-rounded text-[10px] shrink-0 mt-px">water_drop</span>
                        <span>{activity.fallback.if_rain}</span>
                      </p>
                    {/if}
                    {#if activity.fallback.if_tired}
                      <p class="font-sans text-[8px] text-[#8a6a00] leading-snug flex items-start gap-1">
                        <span class="material-symbols-rounded text-[10px] shrink-0 mt-px">hotel</span>
                        <span>{activity.fallback.if_tired}</span>
                      </p>
                    {/if}
                  </div>
                {/if}
              </div>

              <!-- Card footer: links -->
              {#if activity.links?.map || activity.links?.website}
                <div class="flex items-center justify-end gap-2 px-3 py-1.5 glass-subtle border-t border-white/30">
                  {#if activity.links?.map}
                    <a href={activity.links.map} target="_blank" rel="noopener"
                      title="View on Map" class="flex items-center gap-0.5 text-[#c8705a] hover:text-[#a85540] font-sans text-[9px]">
                      <span class="material-symbols-rounded text-sm leading-none">location_on</span>Map
                    </a>
                  {/if}
                  {#if activity.links?.website}
                    <a href={activity.links.website} target="_blank" rel="noopener"
                      title="Website" class="flex items-center gap-0.5 text-[#c8705a] hover:text-[#a85540] font-sans text-[9px]">
                      <span class="material-symbols-rounded text-sm leading-none">language</span>Web
                    </a>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        {/each}

      </div><!-- /itinerary fade wrapper -->

      {/if}
    </div>

    <!-- Journey Nav Footer -->
    <div class="glass-subtle rounded-t-2xl flex items-center justify-between px-5 pb-6 pt-2">
      <a href={prevHref} class="font-sans text-[10px] font-semibold flex items-center gap-0.5 max-w-[130px]" style="color:{t.accent}">
        <span class="material-symbols-rounded text-sm shrink-0">arrow_back</span>
        <span class="truncate">{prevLabel}</span>
      </a>
      <span class="font-sans text-[10px] shrink-0 px-1" style="color:{t.accentMuted}">{index} / {total}</span>
      <a href={nextHref} class="font-sans text-[10px] font-semibold flex items-center gap-0.5 max-w-[130px]" style="color:{t.accent}">
        <span class="truncate text-right">{nextLabel}</span>
        <span class="material-symbols-rounded text-sm shrink-0">arrow_forward</span>
      </a>
    </div>

  </div>
</main>
