<script>
  import { segmentColors, tbd } from '$lib/segmentColors.js';
  export let data;
  const { seg, prevHref, nextHref, nextLabel, index, total } = data;
  const c = segmentColors[seg.style_tag] ?? segmentColors.sakura;

  function fmtPrice(p) {
    if (!p || p.status !== 'confirmed' || p.amount == null) return null;
    return `$${p.amount.toLocaleString()}`;
  }
  $: priceStr = fmtPrice(seg.price);
</script>

<svelte:head><title>Departure · Raleigh</title></svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#f5ede8] py-8 px-4">
  <div class="w-[340px] phone-frame flex flex-col">

    <!-- Hero banner -->
    <div class="relative overflow-hidden" style="height:170px;">
      <div class="absolute inset-0 bg-gradient-to-b from-[#f9d8d0] to-[#fae8e4]"></div>

      <!-- Simple city silhouette + plane -->
      <svg viewBox="0 0 340 110" class="absolute bottom-0 w-full" fill="none">
        <!-- Buildings -->
        <rect x="20"  y="65" width="18" height="45" rx="2" fill="#e0a8a0" opacity="0.6"/>
        <rect x="42"  y="50" width="22" height="60" rx="2" fill="#d898a0" opacity="0.6"/>
        <rect x="68"  y="58" width="16" height="52" rx="2" fill="#e0a8a0" opacity="0.5"/>
        <rect x="88"  y="44" width="28" height="66" rx="2" fill="#d898a0" opacity="0.55"/>
        <!-- Ground -->
        <rect x="0" y="108" width="340" height="2" fill="#e8c0b8" opacity="0.5"/>
        <!-- Airplane taking off -->
        <g transform="translate(220,38) rotate(-18)">
          <ellipse cx="0" cy="0" rx="18" ry="7" fill="white" stroke="#c0a0a0" stroke-width="1.2"/>
          <path d="M18 0 Q24 -2 22 3 Q24 4 18 3 Z" fill="white" stroke="#c0a0a0" stroke-width="0.8"/>
          <path d="M-12 0 L-4 0" stroke="#c0a0a0" stroke-width="0.8"/>
          <path d="M-4 -7 L8 -2" stroke="#c0a0a0" stroke-width="1" stroke-linecap="round" fill="none"/>
          <path d="M-4 7 L8 2" stroke="#c0a0a0" stroke-width="1" stroke-linecap="round" fill="none"/>
          <circle cx="4"  cy="0" r="1.5" fill="#d8e8f0"/>
          <circle cx="10" cy="-0.5" r="1.5" fill="#d8e8f0"/>
        </g>
        <!-- Dashed trail -->
        <path d="M140 85 Q180 60 218 44" stroke="#c87878" stroke-width="1.5" stroke-dasharray="4 3" fill="none" opacity="0.5"/>
        <!-- Petals -->
        <g transform="rotate(-20 60 30) translate(58,28)">
          {#each [0,72,144,216,288] as r}
            <g transform="rotate({r} 0 0)"><ellipse cx="0" cy="-5" rx="2" ry="3.5" fill="#f4b8b0" opacity="0.7"/></g>
          {/each}
          <circle r="1.2" fill="#fff0f2"/>
        </g>
        <g transform="rotate(10 290 22) translate(289,22)">
          {#each [0,72,144,216,288] as r}
            <g transform="rotate({r} 0 0)"><ellipse cx="0" cy="-5" rx="2" ry="3.5" fill="#f4b8b0" opacity="0.6"/></g>
          {/each}
          <circle r="1.2" fill="#fff0f2"/>
        </g>
      </svg>

      <!-- Title -->
      <div class="absolute inset-0 flex flex-col items-center justify-center pb-6">
        <div class="glass-subtle rounded-2xl px-5 py-3 text-center">
          <p class="font-sans text-[10px] uppercase tracking-widest text-[#b08878] mb-1">Step {index} / {total}</p>
          <h1 class="font-cursive text-[#9b3a3a] text-4xl leading-tight text-center">It Begins!</h1>
          <p class="font-sans text-[#7a5c56] text-xs mt-1">Raleigh, NC → Tokyo, Japan</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-4 px-4 py-5">

      <!-- Date chip -->
      <div class="flex items-center justify-center gap-2">
        <span class="material-symbols-rounded text-sm text-[#c8705a]">calendar_month</span>
        <span class="font-sans font-semibold text-sm text-[#5a3d38]">
          {new Date(seg.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Departure Day
        </span>
      </div>

      <!-- Boarding pass card -->
      <div class="rounded-2xl overflow-hidden border shadow-sm" style="background:{c.bg}; border-color:{c.border}">
        <div class="h-2 w-full" style="background:{c.band}"></div>
        <div class="p-3 flex flex-col gap-2.5">

          <!-- Header -->
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-base" style="color:{c.text}">flight_takeoff</span>
            <span class="font-sans font-bold text-xs" style="color:{c.text}">
              {new Date(seg.date + 'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
            </span>
            <span class="ml-auto font-sans text-[10px] bg-white px-2 py-0.5 rounded-full border capitalize" style="color:{c.text}; border-color:{c.border}">Flight</span>
          </div>

          <!-- Legs (multi-leg) -->
          {#if seg.legs?.length}
            <div class="flex flex-col gap-1.5">
              {#each seg.legs as leg}
                {#if leg.layover}
                  <div class="flex items-center gap-1.5 glass-subtle rounded-lg px-2.5 py-1 border" style="border-color:{c.border}">
                    <span class="material-symbols-rounded text-xs" style="color:{c.text}">connecting_airports</span>
                    <span class="font-sans text-[10px] text-[#7a5c56]">
                      <strong>{leg.duration}</strong> layover · {leg.city} ({leg.airport})
                    </span>
                  </div>
                {:else}
                  <div class="glass rounded-xl p-2.5 shadow-sm flex flex-col gap-1">
                    <div class="flex items-center justify-between">
                      <span class="font-sans font-bold text-sm" style="color:{c.text}">{leg.from} → {leg.to}</span>
                      <span class="font-sans text-[10px] text-[#a08878]">{leg.duration}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="font-sans font-bold text-xs text-[#3a2020]">{leg.depart}</span>
                      <span class="text-[10px] text-[#c0a8a0]">──────</span>
                      <span class="font-sans font-bold text-xs text-[#3a2020]">{leg.arrive}</span>
                    </div>
                    <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span class="font-sans text-[10px] font-semibold text-[#5a3d38]">{leg.flight}</span>
                      <span class="text-[10px] text-[#c0a8a0]">·</span>
                      <span class="font-sans text-[10px] text-[#7a5c56]">{leg.aircraft}</span>
                    </div>
                    {#if leg.operated_by}
                      <p class="font-sans text-[9px] italic text-[#b0a0a0]">{leg.operated_by}</p>
                    {/if}
                    {#if leg.note}
                      <p class="font-sans text-[9px] italic text-[#c08878]">{leg.note}</p>
                    {/if}
                  </div>
                {/if}
              {/each}
            </div>
            <div class="flex items-center gap-3 px-1 flex-wrap">
              {#each [['Res.', seg.reservation_code], ['Seat', seg.seat]] as [lbl, val]}
                <div class="flex items-baseline gap-1">
                  <span class="font-sans text-[10px] text-[#a08878]">{lbl}</span>
                  {#if tbd(val)}
                    <span class="font-sans font-semibold text-[11px] text-[#3a2020]">{val}</span>
                  {:else}
                    <span class="font-sans text-[9px] italic text-[#c0a8a0] bg-white px-1.5 rounded-full border border-dashed border-[#e0ccc8]">TBD</span>
                  {/if}
                </div>
              {/each}
              {#if seg.fare_class}
                <div class="flex items-baseline gap-1">
                  <span class="font-sans text-[10px] text-[#a08878]">Fare</span>
                  <span class="font-sans font-semibold text-[11px] text-[#3a2020]">{seg.fare_class}</span>
                </div>
              {/if}
              {#if priceStr}
                <div class="flex items-baseline gap-1">
                  <span class="font-sans text-[10px] text-[#a08878]">Paid</span>
                  <span class="font-sans font-semibold text-[11px] text-[#287040]">{priceStr}</span>
                </div>
              {/if}
            </div>
            {#if seg.passengers?.length}
              <div class="flex items-center gap-1.5 px-1 flex-wrap">
                <span class="font-sans text-[10px] text-[#a08878]">Pax</span>
                {#each seg.passengers as name}
                  <span class="font-sans text-[10px] font-semibold text-[#5a3d38] glass px-2 py-0.5 rounded-full border" style="border-color:{c.border}">{name}</span>
                {/each}
              </div>
            {/if}
          {/if}

          <!-- Separator + Baggage -->
          <div class="border-t border-dashed my-0.5" style="border-color:{c.border}"></div>
          <div class="flex items-center gap-2 flex-wrap">
            {#if seg.baggage?.personal_item}
              <div class="flex items-center gap-1 glass rounded-full px-2 py-0.5 border text-[10px] font-sans" style="border-color:{c.border}; color:{c.text}">
                <span class="material-symbols-rounded text-xs">backpack</span> Personal
              </div>
            {/if}
            {#if seg.baggage?.carry_on}
              <div class="flex items-center gap-1 glass rounded-full px-2 py-0.5 border text-[10px] font-sans" style="border-color:{c.border}; color:{c.text}">
                <span class="material-symbols-rounded text-xs">luggage</span> Carry-on
              </div>
            {/if}
            {#if seg.baggage?.checked_bag}
              <div class="flex items-center gap-1 glass rounded-full px-2 py-0.5 border text-[10px] font-sans" style="border-color:{c.border}; color:{c.text}">
                <span class="material-symbols-rounded text-xs">cases</span> Checked
              </div>
            {/if}
          </div>
        </div>
      </div>

    </div>

    <!-- Journey nav -->
    <div class="flex items-center justify-between px-5 pb-6 pt-2 mt-auto">
      <a href={prevHref} class="font-sans text-xs font-semibold text-[#c8705a] flex items-center gap-1 hover:text-[#a85540]">
        <span class="material-symbols-rounded text-sm">arrow_back</span> Home
      </a>
      <span class="font-sans text-[10px] text-[#c0a8a0]">{index} / {total}</span>
      <a href={nextHref} class="font-sans text-xs font-bold text-white bg-[#c8705a] hover:bg-[#b05040] rounded-full px-3 py-1.5 flex items-center gap-1 transition-colors max-w-[140px]">
        <span class="truncate">{nextLabel}</span>
        <span class="material-symbols-rounded text-sm shrink-0">arrow_forward</span>
      </a>
    </div>

  </div>
</main>
