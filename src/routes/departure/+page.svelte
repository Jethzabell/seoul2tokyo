<script>
  import { segmentColors, tbd } from '$lib/segmentColors.js';
  export let data;
  const { seg, companionSegments, prevHref, nextHref, nextLabel, index, total } = data;
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

      <!-- Compact flight card -->
      <div class="glass-card overflow-hidden" style="border-color:{c.border}">
        <div class="h-1.5 w-full" style="background:{c.band}"></div>
        <div class="px-3 py-2.5 flex flex-col gap-1.5">

          <!-- Header row -->
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-sm" style="color:{c.text}">flight_takeoff</span>
            <span class="font-sans font-bold text-[11px]" style="color:{c.text}">
              {new Date(seg.date + 'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
            </span>
            {#if priceStr}
              <span class="ml-auto font-sans text-[10px] font-bold text-[#287040]">{priceStr}</span>
            {/if}
          </div>

          <!-- Legs (compact rows) -->
          {#if seg.legs?.length}
            {#each seg.legs as leg}
              {#if leg.layover}
                <div class="flex items-center gap-1.5 px-2 py-0.5">
                  <span class="material-symbols-rounded text-[10px]" style="color:{c.text}">connecting_airports</span>
                  <span class="font-sans text-[9px] text-[#7a5c56]"><strong>{leg.duration}</strong> layover · {leg.city}</span>
                </div>
              {:else}
                <div class="flex items-center gap-2 glass-subtle rounded-lg px-2.5 py-1.5">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="font-sans font-bold text-[11px]" style="color:{c.text}">{leg.from} → {leg.to}</span>
                      <span class="font-sans text-[9px] text-[#a08878]">{leg.duration}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="font-sans font-bold text-[10px] text-[#3a2020]">{leg.depart} → {leg.arrive}</span>
                      <span class="font-sans text-[9px] text-[#7a5c56]">{leg.flight} · {leg.aircraft}</span>
                    </div>
                  </div>
                </div>
              {/if}
            {/each}

            <!-- Meta row: res, fare, pax inline -->
            <div class="flex items-center gap-2 flex-wrap px-0.5 text-[9px] font-sans text-[#a08878]">
              {#each [['Res', seg.reservation_code], ['Fare', seg.fare_class]] as [lbl, val]}
                {#if val && val !== 'TBD'}
                  <span>{lbl}: <strong class="text-[#5a3d38]">{val}</strong></span>
                {/if}
              {/each}
              {#if seg.passengers?.length}
                <span class="text-[#c0a8a0]">·</span>
                <span>{seg.passengers.join(', ')}</span>
              {/if}
              {#if seg.baggage}
                <span class="text-[#c0a8a0]">·</span>
                <span class="flex items-center gap-1">
                  {#if seg.baggage.personal_item}<span class="material-symbols-rounded text-[10px]">backpack</span>{/if}
                  {#if seg.baggage.carry_on}<span class="material-symbols-rounded text-[10px]">luggage</span>{/if}
                  {#if seg.baggage.checked_bag}<span class="material-symbols-rounded text-[10px]">cases</span>{/if}
                </span>
              {/if}
            </div>
          {/if}

        </div>
      </div>

      <!-- Frances, James & Carlos flight -->
      {#if companionSegments?.length}
        <div class="glass-card overflow-hidden border-[#c8b8d8]">
          <div class="h-1.5 w-full bg-[#8c6bb1]"></div>
          <div class="px-3 py-2.5 flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-rounded text-sm text-[#74549a]">flight_takeoff</span>
              <div>
                <p class="font-sans font-bold text-[11px] text-[#5a3d38]">Frances, James &amp; Carlos</p>
                <p class="font-sans text-[9px] text-[#a08878]">Sat, Oct 17 → Sun, Oct 18 · Terminal 3</p>
              </div>
            </div>

            {#each companionSegments as flight, i}
              <div class="glass-subtle rounded-lg px-2.5 py-2 flex items-center gap-2">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5">
                    <span class="font-sans font-bold text-[11px] text-[#74549a]">{flight.from.code} → {flight.to.code}</span>
                    <span class="font-sans text-[9px] text-[#a08878]">{i === 0 ? 'Outbound' : 'Connection'}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="font-sans font-bold text-[10px] text-[#3a2020]">{flight.time_depart} → {flight.time_arrive}</span>
                    <span class="font-sans text-[9px] text-[#7a5c56]">{flight.flight_number || 'Delta'}</span>
                  </div>
                </div>
              </div>
            {/each}

            <p class="font-sans text-[9px] leading-relaxed text-[#7a5c56]">
              They leave Raleigh early Saturday, connect in Detroit, and arrive at Haneda Sunday at 4:15 PM.
            </p>
          </div>
        </div>
      {/if}

      <!-- Visit Japan Web reminder -->
      <div class="glass-subtle rounded-2xl border border-[#d8c0b8] px-3.5 py-3">
        <div class="flex items-start gap-2.5">
          <span class="material-symbols-rounded text-lg text-[#c8705a]">verified_user</span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <p class="font-sans font-bold text-[11px] text-[#5a3d38]">Before landing in Japan</p>
              <span class="font-sans text-[8px] font-bold uppercase tracking-wide text-[#9b7a70]">Do before arrival</span>
            </div>
            <p class="font-sans text-[9px] leading-relaxed text-[#7a5c56] mt-1">
              Complete Visit Japan Web before the flight: register each traveler’s passport, flight, and first accommodation, then finish the immigration and customs forms.
            </p>
            <p class="font-sans text-[9px] leading-relaxed text-[#7a5c56] mt-1.5">
              Save the confirmation QR code on your phone so it is ready when you land.
            </p>
            <a
              href="https://www.vjw.digital.go.jp/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 mt-2 font-sans text-[10px] font-bold text-[#c8705a] hover:text-[#a85540] transition-colors"
            >
              Open Visit Japan Web
              <span class="material-symbols-rounded text-xs">open_in_new</span>
            </a>
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
