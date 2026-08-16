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
  <div class="w-[340px] bg-[#faf0eb] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#e8d0c8]">

    <!-- Header -->
    <div class="px-6 pt-7 pb-3 text-center">
      <h1 class="font-cursive text-[#9b3a3a] text-4xl leading-tight">Flights &amp;<br/>Trains</h1>
      <p class="font-sans text-[#a07870] text-xs mt-1">Your complete journey · {segments.length} segments</p>
    </div>

    <div class="flex flex-col gap-4 px-4 pb-6">

      <!-- Stats bar -->
      <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm">
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
      <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm">
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

        <div class="rounded-2xl overflow-hidden shadow-sm border" style="background:{c.bg}; border-color:{c.border}">

          <div class="h-2 w-full" style="background:{c.band}"></div>

          <div class="p-3 flex flex-col gap-2.5">

            <!-- Row 1: date + price + mode -->
            <div class="flex items-center gap-2">
              <span class="material-symbols-rounded text-base" style="color:{c.text}">{modeIcon[seg.mode]}</span>
              <span class="font-sans font-bold text-xs" style="color:{c.text}">{fmtDate(seg.date)}</span>
              <div class="ml-auto flex items-center gap-1.5">
                {#if priceStr}
                  <span class="font-sans text-[11px] font-bold text-[#287040] bg-[#e8f4ea] border border-[#98d098] px-2 py-0.5 rounded-full">
                    {priceStr}
                  </span>
                {:else if seg.price?.status === 'included'}
                  <span class="font-sans text-[11px] font-bold text-[#4070a8] bg-[#e8eef8] border border-[#98b0d8] px-2 py-0.5 rounded-full">
                    Included
                  </span>
                {/if}
                <span class="font-sans text-[10px] bg-white px-2 py-0.5 rounded-full border capitalize" style="color:{c.text}; border-color:{c.border}">
                  {modeLabel[seg.mode]}
                </span>
              </div>
            </div>

            <!-- Route summary chip -->
            <div class="flex items-center gap-2 bg-white/60 rounded-lg px-2.5 py-1.5">
              <span class="font-sans font-bold text-sm" style="color:{c.text}">{seg.from.code}</span>
              <div class="flex-1 flex items-center gap-1">
                <div class="flex-1 h-px" style="background:{c.border}"></div>
                <span class="material-symbols-rounded text-xs" style="color:{c.text}">{isFlight ? 'flight' : 'directions_railway'}</span>
                <div class="flex-1 h-px" style="background:{c.border}"></div>
              </div>
              <span class="font-sans font-bold text-sm" style="color:{c.text}">{seg.to.code}</span>
            </div>

            <!-- Multi-leg layout -->
            {#if seg.legs?.length}
              <div class="flex flex-col gap-1.5">
                {#each seg.legs as leg}
                  {#if leg.layover}
                    <div class="flex items-center gap-1.5 bg-white/70 rounded-lg px-2.5 py-1.5 border" style="border-color:{c.border}">
                      <span class="material-symbols-rounded text-xs" style="color:{c.text}">connecting_airports</span>
                      <span class="font-sans text-[10px] text-[#7a5c56]">
                        <strong>{leg.duration}</strong> layover · {leg.city} ({leg.airport})
                      </span>
                    </div>
                  {:else}
                    <div class="bg-white rounded-xl p-2.5 shadow-sm flex flex-col gap-1.5">
                      <div class="flex items-center justify-between">
                        <span class="font-sans font-bold text-sm" style="color:{c.text}">{leg.from} → {leg.to}</span>
                        <span class="font-sans text-[10px] font-semibold bg-white border px-1.5 py-0.5 rounded-full" style="color:{c.text}; border-color:{c.border}">{leg.duration}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="text-center">
                          <p class="font-sans font-bold text-sm text-[#3a2020]">{leg.depart}</p>
                          <p class="font-sans text-[8px] text-[#b08878]">{leg.from}</p>
                        </div>
                        <div class="flex-1 flex items-center gap-1 px-2">
                          <div class="flex-1 border-t border-dashed" style="border-color:{c.border}"></div>
                          <span class="material-symbols-rounded text-xs" style="color:{c.text}">{isFlight ? 'flight' : 'train'}</span>
                          <div class="flex-1 border-t border-dashed" style="border-color:{c.border}"></div>
                        </div>
                        <div class="text-center">
                          <p class="font-sans font-bold text-sm text-[#3a2020]">{leg.arrive}</p>
                          <p class="font-sans text-[8px] text-[#b08878]">{leg.to}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="font-sans text-[10px] font-semibold text-[#5a3d38]">{leg.flight}</span>
                        <span class="text-[10px] text-[#c0a8a0]">·</span>
                        <span class="font-sans text-[10px] text-[#7a5c56]">{leg.aircraft}</span>
                      </div>
                      {#if leg.operated_by}
                        <p class="font-sans text-[9px] italic text-[#b0a0a0]">{leg.operated_by}</p>
                      {/if}
                      {#if leg.note}
                        <p class="font-sans text-[9px] italic text-[#c08878] flex items-center gap-1">
                          <span class="material-symbols-rounded text-[10px]">info</span>{leg.note}
                        </p>
                      {/if}
                    </div>
                  {/if}
                {/each}
              </div>

              <div class="flex items-center gap-3 px-1">
                {#each [['Res.', seg.reservation_code], [isFlight ? 'Seat' : 'Car/Seat', seg.seat]] as [lbl, val]}
                  <div class="flex items-baseline gap-1">
                    <span class="font-sans text-[10px] text-[#a08878]">{lbl}</span>
                    {#if tbd(val)}
                      <span class="font-sans font-semibold text-[11px] text-[#3a2020]">{val}</span>
                    {:else}
                      <span class="font-sans text-[9px] italic text-[#c0a8a0] bg-white px-1.5 rounded-full border border-dashed border-[#e0ccc8]">TBD</span>
                    {/if}
                  </div>
                {/each}
              </div>
              {#if seg.passengers?.length}
                <div class="flex items-center gap-1.5 px-1 flex-wrap">
                  <span class="font-sans text-[10px] text-[#a08878]">Pax</span>
                  {#each seg.passengers as name}
                    <span class="font-sans text-[10px] font-semibold text-[#5a3d38] bg-white px-2 py-0.5 rounded-full border" style="border-color:{c.border}">{name}</span>
                  {/each}
                </div>
              {/if}

            <!-- Simple layout (no legs) -->
            {:else}
              <div class="grid gap-2" style="grid-template-columns: 72px 1fr 76px">
                <div class="flex flex-col gap-1.5">
                  <div class="bg-white rounded-xl p-2 text-center shadow-sm">
                    <p class="font-sans font-bold text-sm text-[#3a2020]">
                      {#if tbd(seg.time_depart)}{seg.time_depart}{:else}<span class="text-[10px] italic text-[#c0a8a0]">TBD</span>{/if}
                    </p>
                    <p class="text-[10px] text-[#c0a8a0]">↓</p>
                    <p class="font-sans font-bold text-sm text-[#3a2020]">
                      {#if tbd(seg.time_arrive)}{seg.time_arrive}{:else}<span class="text-[10px] italic text-[#c0a8a0]">TBD</span>{/if}
                    </p>
                  </div>
                  <p class="font-sans font-bold text-xs text-center" style="color:{c.text}">{seg.from.code} → {seg.to.code}</p>
                </div>
                <div class="flex flex-col gap-1 px-1 justify-center">
                  {#each [
                    ['Carrier', seg.carrier],
                    [isFlight ? 'Flight' : 'Train', seg.number],
                    seg.aircraft ? ['Aircraft', seg.aircraft] : null,
                    ['Res.', seg.reservation_code],
                    [isFlight ? 'Seat' : 'Car/Seat', (seg.car && seg.car !== 'TBD') ? `${seg.car} / ${seg.seat}` : seg.seat]
                  ].filter(Boolean) as [label, val]}
                    <div class="flex items-baseline gap-1 min-w-0">
                      <span class="font-sans text-[10px] text-[#a08878] shrink-0 w-10">{label}</span>
                      {#if tbd(val)}
                        <span class="font-sans font-semibold text-[11px] text-[#3a2020] truncate">{val}</span>
                      {:else}
                        <span class="font-sans text-[10px] italic text-[#c0a8a0] bg-white px-1.5 rounded-full border border-dashed border-[#e0ccc8]">TBD</span>
                      {/if}
                    </div>
                  {/each}
                </div>
                <div class="bg-white rounded-xl p-2 flex flex-col items-center justify-center gap-0.5 shadow-sm text-center">
                  <span class="font-sans text-[9px] uppercase tracking-wide text-[#a08878]">{isFlight ? 'Terminal' : 'Station'}</span>
                  {#if terminal}
                    <span class="font-cursive text-xl leading-none" style="color:{c.text}">{terminal}</span>
                  {:else}
                    <span class="font-sans text-xs italic text-[#c0a8a0]">TBD</span>
                  {/if}
                  <span class="font-sans font-bold text-sm text-[#3a2020] mt-0.5">{dest.code}</span>
                  <span class="font-sans text-[9px] text-[#a08878] leading-tight">{dest.city}</span>
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
                <div class="flex items-center gap-1 bg-white rounded-full px-2 py-0.5 border text-[10px] font-sans" style="border-color:{c.border}; color:{c.text}">
                  <span class="material-symbols-rounded text-xs">backpack</span> Personal
                </div>
              {/if}
              {#if seg.baggage?.carry_on}
                <div class="flex items-center gap-1 bg-white rounded-full px-2 py-0.5 border text-[10px] font-sans" style="border-color:{c.border}; color:{c.text}">
                  <span class="material-symbols-rounded text-xs">luggage</span> Carry-on
                </div>
              {/if}
              {#if seg.baggage?.checked_bag}
                <div class="flex items-center gap-1 bg-white rounded-full px-2 py-0.5 border text-[10px] font-sans" style="border-color:{c.border}; color:{c.text}">
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
