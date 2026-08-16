<script>
  import { segmentColors, tbd } from '$lib/segmentColors.js';

  export let data;
  const { segments, flightCount, trainCount, confirmedSpend } = data;

  function fmtDate(iso) {
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  }

  function fmtPrice(p) {
    if (!p || typeof p !== 'object') return null;
    if (p.status === 'included') return 'Included';
    if (p.status === 'tbd' || p.amount == null) return null;
    if (p.amount === 0) return 'JR Pass';
    const sym = p.currency === 'JPY' ? '¥' : p.currency === 'KRW' ? '₩' : '$';
    const val = `${p.approximate ? '~' : ''}${sym}${p.amount.toLocaleString()}`;
    return p.per_person ? `${val}/pp` : val;
  }

  const modeLabel = { flight: 'Flight', train: 'Train' };
  const modeIcon  = { flight: 'flight', train: 'train' };

  $: lastSeg = segments[segments.length - 1];
  $: lastC = segmentColors[lastSeg?.style_tag] ?? segmentColors.sakura;

  function segLabel(seg, idx) {
    if (seg.mode === 'flight' && idx === 0) return 'Outbound';
    if (seg.mode === 'flight' && idx > 0) return 'Return';
    return `${seg.from.city} → ${seg.to.city}`;
  }
</script>

<svelte:head>
  <title>Flights & Trains</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#f5ede8] py-8 px-4">
  <div class="w-[340px] phone-frame">

    <!-- Header -->
    <div class="px-6 pt-7 pb-3 text-center">
      <h1 class="font-cursive text-[#9b3a3a] text-4xl leading-tight">Flights &amp;<br/>Trains</h1>
      <p class="font-sans text-[#a07870] text-xs mt-1">Your complete journey · {segments.length} segments</p>
    </div>

    <div class="flex flex-col gap-4 px-4 pb-6">

      <!-- Stats bar -->
      <div class="glass-strong rounded-2xl border border-[#f0d8d0] p-3 shadow-sm">
        <div class="grid grid-cols-3 gap-2 text-center">
          <div>
            <div class="flex items-center justify-center gap-1">
              <span class="material-symbols-rounded text-sm text-[#9b284a]">flight</span>
              <span class="font-sans font-bold text-base text-[#5a3d38]">{flightCount}</span>
            </div>
            <p class="font-sans text-[8px] uppercase tracking-wide text-[#b08878]">Flight{flightCount !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <div class="flex items-center justify-center gap-1">
              <span class="material-symbols-rounded text-sm text-[#286838]">train</span>
              <span class="font-sans font-bold text-base text-[#5a3d38]">{trainCount}</span>
            </div>
            <p class="font-sans text-[8px] uppercase tracking-wide text-[#b08878]">Train{trainCount !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <div class="flex items-center justify-center gap-1">
              <span class="material-symbols-rounded text-sm text-[#287040]">payments</span>
              <span class="font-sans font-bold text-base text-[#287040]">${confirmedSpend}</span>
            </div>
            <p class="font-sans text-[8px] uppercase tracking-wide text-[#b08878]">Confirmed</p>
          </div>
        </div>
      </div>

      <!-- Journey route timeline -->
      <div class="glass rounded-2xl border border-[#f0d8d0] p-3 shadow-sm">
        <p class="font-sans text-[9px] uppercase tracking-wider text-[#b08878] mb-2">Route</p>
        <div class="flex items-center gap-0">
          {#each segments as seg, i}
            {@const c = segmentColors[seg.style_tag] ?? segmentColors.sakura}
            {#if i > 0}
              <div class="flex-1 h-px" style="background:{c.border}"></div>
            {/if}
            <div class="flex flex-col items-center gap-0.5 shrink-0">
              <div class="w-7 h-7 rounded-full flex items-center justify-center border-2" style="border-color:{c.band}; background:{c.bg}">
                <span class="material-symbols-rounded text-xs" style="color:{c.text}">{modeIcon[seg.mode]}</span>
              </div>
              <span class="font-sans text-[7px] font-bold text-[#5a3d38]">{seg.from.code}</span>
            </div>
          {/each}
          <div class="flex-1 h-px" style="background:{lastC.border}"></div>
          <div class="flex flex-col items-center gap-0.5 shrink-0">
            <div class="w-7 h-7 rounded-full flex items-center justify-center border-2" style="border-color:{lastC.band}; background:{lastC.bg}">
              <span class="material-symbols-rounded text-xs" style="color:{lastC.text}">flag</span>
            </div>
            <span class="font-sans text-[7px] font-bold text-[#5a3d38]">{lastSeg.to.code}</span>
          </div>
        </div>
      </div>

      <!-- Segments -->
      {#each segments as seg, segIdx}
        {@const c = segmentColors[seg.style_tag] ?? segmentColors.sakura}
        {@const isFlight = seg.mode === 'flight'}
        {@const dest = seg.to}
        {@const terminal = tbd(dest.terminal ?? dest.station)}
        {@const priceStr = fmtPrice(seg.price)}
        {@const label = segLabel(seg, segIdx)}

        <!-- Segment label -->
        <div class="flex items-center gap-2 pt-1">
          <div class="flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-sm text-white text-xs font-sans font-bold" style="background:{c.band}">
            <span class="material-symbols-rounded text-sm">{modeIcon[seg.mode]}</span>
            {label}
          </div>
          <div class="h-px flex-1" style="background:{c.border}"></div>
          <span class="font-sans text-[10px] text-[#a08878]">{segIdx + 1}/{segments.length}</span>
        </div>

        <div class="glass-card overflow-hidden" style="border-color:{c.border}">

          <div class="h-1.5 w-full" style="background:{c.band}"></div>

          <div class="px-3 py-2 flex flex-col gap-1.5">

            <!-- Header: route + date + price -->
            <div class="flex items-center gap-2">
              <span class="material-symbols-rounded text-sm" style="color:{c.text}">{modeIcon[seg.mode]}</span>
              <span class="font-sans font-bold text-[11px]" style="color:{c.text}">{seg.from.code} → {seg.to.code}</span>
              <span class="font-sans text-[9px] text-[#a08878]">{fmtDate(seg.date)}</span>
              <div class="ml-auto flex items-center gap-1.5">
                {#if priceStr}
                  <span class="font-sans text-[10px] font-bold text-[#287040]">{priceStr}</span>
                {:else if seg.price?.status === 'included'}
                  <span class="font-sans text-[10px] font-bold text-[#4070a8]">Included</span>
                {/if}
              </div>
            </div>

            <!-- Multi-leg compact -->
            {#if seg.legs?.length}
              {#each seg.legs as leg}
                {#if leg.layover}
                  <div class="flex items-center gap-1.5 px-2 py-0.5">
                    <span class="material-symbols-rounded text-[10px]" style="color:{c.text}">connecting_airports</span>
                    <span class="font-sans text-[9px] text-[#7a5c56]"><strong>{leg.duration}</strong> layover · {leg.city}</span>
                  </div>
                {:else}
                  <div class="glass-subtle rounded-lg px-2.5 py-1.5">
                    <div class="flex items-center gap-1.5">
                      <span class="font-sans font-bold text-[11px]" style="color:{c.text}">{leg.from} → {leg.to}</span>
                      <span class="font-sans text-[9px] text-[#a08878]">{leg.duration}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="font-sans font-bold text-[10px] text-[#3a2020]">{leg.depart} → {leg.arrive}</span>
                      <span class="font-sans text-[9px] text-[#7a5c56]">{leg.flight} · {leg.aircraft}</span>
                    </div>
                    {#if leg.operated_by}
                      <p class="font-sans text-[8px] italic text-[#b0a0a0] mt-0.5">{leg.operated_by}</p>
                    {/if}
                  </div>
                {/if}
              {/each}

              <!-- Meta: res, pax, baggage inline -->
              <div class="flex items-center gap-2 flex-wrap px-0.5 text-[9px] font-sans text-[#a08878]">
                {#each [['Res', seg.reservation_code]] as [lbl, val]}
                  {#if tbd(val)}
                    <span>{lbl}: <strong class="text-[#5a3d38]">{val}</strong></span>
                  {/if}
                {/each}
                {#if seg.passengers?.length}
                  <span>{seg.passengers.join(', ')}</span>
                {/if}
              </div>

            <!-- Simple layout (trains etc.) -->
            {:else}
              <div class="glass-subtle rounded-lg px-2.5 py-1.5">
                <div class="flex items-center gap-2">
                  <span class="font-sans font-bold text-[10px] text-[#3a2020]">
                    {#if tbd(seg.time_depart)}{seg.time_depart}{:else}TBD{/if} → {#if tbd(seg.time_arrive)}{seg.time_arrive}{:else}TBD{/if}
                  </span>
                  <span class="font-sans text-[9px] text-[#7a5c56]">{seg.carrier}{seg.number ? ` ${seg.number}` : ''}</span>
                  {#if terminal}
                    <span class="ml-auto font-sans text-[9px] text-[#a08878]">{dest.code}</span>
                  {/if}
                </div>
              </div>
            {/if}

            <!-- Notes -->
            {#if seg.notes}
              <p class="font-sans text-[10px] italic text-[#7a5c56] px-1 flex items-start gap-1">
                <span class="material-symbols-rounded text-xs shrink-0 mt-px" style="color:{c.text}">info</span>
                {seg.notes}
              </p>
            {/if}

            <div class="border-t border-dashed my-0.5" style="border-color:{c.border}"></div>

            <!-- Baggage row -->
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
      {/each}
    </div>

    <!-- Nav footer -->
    <div class="flex items-center justify-between px-6 pb-6">
      <a href="/" class="font-sans text-xs font-semibold text-[#c8705a] flex items-center gap-1 hover:text-[#a85540]">
        <span class="material-symbols-rounded text-base leading-none">home</span> Home
      </a>
      <a href="/quick-info" class="font-sans text-xs font-semibold text-[#c8705a] hover:text-[#a85540]">Quick Info →</a>
    </div>

  </div>
</main>
