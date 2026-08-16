<script>
  export let data;
  const { flights, activities, hotels, tbd, flightTotal, activityTotal, hotelTotal, hotelGroups } = data;

  const toUSD = (amount, currency) =>
    currency === 'JPY' ? +(amount / 163.88).toFixed(2) : amount;

  function fmtUSD(amount) {
    return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function perPerson(amount, currency, travelers) {
    return fmtUSD(+(toUSD(amount, currency) / travelers).toFixed(2));
  }

  function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const grandTotal = flightTotal + activityTotal + hotelTotal;

  const statusColor = s =>
    s === 'confirmed' ? 'text-[#287040] bg-[#e8f4ea] border-[#98d098]'
    : s === 'pending'  ? 'text-[#c8705a] bg-[#fdf0e8] border-[#e8c098]'
    : 'text-[#a08878] bg-[#f0ece8] border-[#e0d0c8]';
</script>

<svelte:head><title>Trip Budget</title></svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#f5ede8] py-8 px-4">
  <div class="w-[340px] phone-frame">

    <!-- Header -->
    <div class="page-gradient px-6 pt-7 pb-5 text-center relative overflow-hidden">
      <svg viewBox="0 0 80 40" class="absolute right-4 bottom-2 w-16 opacity-10" fill="white">
        <rect x="12" y="12" width="4" height="28" rx="2"/>
        <rect x="64" y="12" width="4" height="28" rx="2"/>
        <rect x="6" y="6" width="68" height="6" rx="3"/>
        <rect x="16" y="16" width="48" height="4" rx="2"/>
      </svg>
      <h1 class="font-cursive text-white text-4xl leading-tight relative">Budget</h1>
      <p class="font-sans text-white/80 text-xs mt-1 relative">Confirmed trip spend</p>
    </div>


    <div class="flex flex-col gap-4 px-4 pb-6 pt-4">

      <!-- ── Flights ── -->
      <section>
        <div class="page-gradient-rose rounded-xl px-3 py-2 flex items-center gap-2 mb-2 shadow-sm">
          <span class="material-symbols-rounded text-base text-white">flight</span>
          <h2 class="font-cursive text-white text-2xl leading-none">Flights</h2>
          <span class="ml-auto font-sans text-[10px] bg-white/20 rounded-full px-2 py-0.5 text-white/90">4 travelers</span>
        </div>

        <div class="glass-card p-2 flex flex-col divide-y divide-white/30">
          {#each flights as f}
            <div class="flex items-center justify-between gap-2 px-1 py-1.5">
              <div class="min-w-0 flex-1">
                <p class="font-sans font-bold text-[11px] text-[#3a2020] truncate">{f.label}</p>
                <p class="font-sans text-[9px] text-[#a08878]">{f.carrier}{f.date ? ' · ' + fmtDate(f.date) : ''}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="font-sans font-bold text-[12px] text-[#3a2020]">{fmtUSD(f.amount)}</p>
                <p class="font-sans text-[9px] text-[#287040]">{perPerson(f.amount, f.currency, f.travelers)}/pp</p>
              </div>
            </div>
          {/each}
        </div>
        <div class="glass-subtle rounded-xl px-3 py-1.5 flex items-center justify-between mt-1">
          <span class="font-sans text-[9px] text-[#9b284a]">Subtotal</span>
          <span class="font-sans font-bold text-[11px] text-[#9b284a]">{fmtUSD(flightTotal)} · {fmtUSD(+(flightTotal/4).toFixed(2))}/pp</span>
        </div>
      </section>

      <!-- ── Hotels ── -->
      <section>
        <div class="page-gradient-blue rounded-xl px-3 py-2 flex items-center gap-2 mb-2 shadow-sm">
          <span class="material-symbols-rounded text-base text-white">hotel</span>
          <h2 class="font-cursive text-white text-2xl leading-none">Hotels</h2>
          <span class="ml-auto font-sans text-[10px] bg-white/20 rounded-full px-2 py-0.5 text-white/90">7 travelers</span>
        </div>
        <div class="glass-card p-2 flex flex-col divide-y divide-white/30">
          {#each hotels as h}
            <div class="flex items-center justify-between gap-2 px-1 py-1.5"
                 style={h.group_color ? `border-left: 3px solid ${h.group_color}; padding-left:8px` : ''}>
              <div class="min-w-0 flex-1">
                <p class="font-sans font-bold text-[11px] text-[#3a2020] truncate">{h.label}</p>
                <p class="font-sans text-[9px] text-[#a08878]">{h.notes.split('·')[0].trim()}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="font-sans font-bold text-[12px] text-[#3a2020]">{h.approximate ? '~' : ''}{fmtUSD(toUSD(h.amount, h.currency))}</p>
                <p class="font-sans text-[9px] text-[#287040]">{fmtUSD(+(toUSD(h.amount, h.currency)/h.guests).toFixed(2))}/pp</p>
              </div>
            </div>
          {/each}
        </div>
        <div class="glass-subtle rounded-xl px-3 py-2 mt-1 flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="font-sans text-[9px] text-[#2a5cb8]">Subtotal</span>
            <span class="font-sans font-bold text-[11px] text-[#2a5cb8]">{fmtUSD(hotelTotal)}</span>
          </div>
          {#each hotelGroups as g}
            <div class="flex items-center justify-between">
              <span class="font-sans text-[8px] text-[#7a8898]">{g.label}</span>
              <span class="font-sans font-bold text-[10px] text-[#2a5cb8]">{fmtUSD(g.perPerson)}/pp</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- ── Activities ── -->
      <section>
        <div class="page-gradient-coral rounded-xl px-3 py-2 flex items-center gap-2 mb-2 shadow-sm">
          <span class="material-symbols-rounded text-base text-white">confirmation_number</span>
          <h2 class="font-cursive text-white text-2xl leading-none">Activities</h2>
          <span class="ml-auto font-sans text-[10px] bg-white/20 rounded-full px-2 py-0.5 text-white/90">7 travelers</span>
        </div>

        <div class="glass-card p-2 flex flex-col divide-y divide-white/30">
          {#each activities as a}
            {@const usd = toUSD(a.amount, a.currency)}
            <div class="flex items-center justify-between gap-2 px-1 py-1.5">
              <div class="min-w-0 flex-1">
                <p class="font-sans font-bold text-[11px] text-[#3a2020] truncate">{a.label}</p>
                <p class="font-sans text-[9px] text-[#a08878]">{a.city}{a.date ? ' · ' + fmtDate(a.date) : ''}</p>
              </div>
              <p class="font-sans font-bold text-[12px] text-[#3a2020] shrink-0">{a.approximate ? '~' : ''}{fmtUSD(usd)}</p>
            </div>
          {/each}
        </div>
        <div class="glass-subtle rounded-xl px-3 py-1.5 flex items-center justify-between mt-1">
          <span class="font-sans text-[9px] text-[#c8705a]">Subtotal</span>
          <span class="font-sans font-bold text-[11px] text-[#c8705a]">{fmtUSD(activityTotal)} · {fmtUSD(+(activityTotal/7).toFixed(2))}/pp</span>
        </div>
      </section>

      <!-- ── Per-person summary ── -->
      <section>
        <p class="font-sans text-[10px] uppercase tracking-wider text-[#b08878] mb-3 px-1">Per-Person Estimate</p>
        <div class="grid grid-cols-2 gap-2">
          <div class="glass-card p-3 flex flex-col">
            <p class="font-sans text-[9px] text-[#a08878] leading-snug mb-2">Jessy / Jurializ / Hilary / Yamil</p>
            <p class="font-sans font-bold text-lg text-[#c8705a] mt-auto">{fmtUSD(+(flightTotal/4 + hotelTotal/7 + activityTotal/7).toFixed(2))}</p>
            <p class="font-sans text-[8px] text-[#a08878] mt-1">(flights + hotels + activities)</p>
          </div>
          <div class="glass-card p-3 flex flex-col">
            <p class="font-sans text-[9px] text-[#a08878] leading-snug mb-2">Carlos / Frances / James</p>
            <p class="font-sans font-bold text-lg text-[#c8705a] mt-auto">{fmtUSD(+(hotelTotal/7 + activityTotal/7).toFixed(2))}</p>
            <p class="font-sans text-[8px] text-[#a08878] mt-1">(hotels + activities)</p>
          </div>
        </div>
      </section>

      <!-- ── Not Yet Booked (shown but NOT in total) ── -->
      {#if tbd.length > 0}
        <section>
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-rounded text-base text-[#a08878]">pending</span>
            <h2 class="font-cursive text-[#9b3a3a] text-2xl leading-none">Still to Reserve</h2>
          </div>
          <p class="font-sans text-[9px] text-[#a08878] mb-2 px-1">Not counted in total above</p>

          <div class="flex flex-col gap-2">
            {#each tbd as item}
              <div class="glass-subtle rounded-2xl border border-dashed border-[#e0c8c0] p-3">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    {#if item.link}
                      <a href={item.link} target="_blank" rel="noopener"
                         class="font-sans font-bold text-[11px] text-[#c8705a] leading-snug hover:underline">{item.label}</a>
                    {:else}
                      <p class="font-sans font-bold text-[11px] text-[#6a4040] leading-snug">{item.label}</p>
                    {/if}
                    <p class="font-sans text-[9px] text-[#b09888] mt-0.5">{item.category}</p>
                  </div>
                  <div class="text-right shrink-0">
                    {#if item.amount != null}
                      <p class="font-sans font-bold text-sm text-[#6a4040]">
                        {fmtUSD(toUSD(item.amount, item.currency))}{item.perPerson ? '/pp' : ''}
                      </p>
                      {#if item.guests && !item.perPerson}
                        <p class="font-sans text-[10px] text-[#287040]">{fmtUSD(+(toUSD(item.amount, item.currency)/item.guests).toFixed(2))}/pp</p>
                      {/if}
                    {:else}
                      <p class="font-sans text-xs text-[#b09888] italic">TBD</p>
                    {/if}
                    <span class="font-sans text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full border {statusColor(item.status)}">{item.status}</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </section>
      {/if}

    </div>

    <!-- Venmo -->
    <div class="flex justify-center px-6 pb-3">
      <a href="https://venmo.com/code?user_id=2169929423912960072&created=1786910339"
         target="_blank" rel="noopener"
         class="glass-card glass-hover flex items-center gap-2 px-4 py-2.5 w-full justify-center">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="#3D95CE">
          <path d="M19.5 1.5c.8 1.3 1.2 2.7 1.2 4.4 0 5.5-4.7 12.6-8.5 17.6H5.2L2.3 3.3l6.2-.6 1.7 13.4c1.6-2.6 3.5-6.7 3.5-9.5 0-1.6-.3-2.7-.7-3.5l6.5-1.6z"/>
        </svg>
        <span class="font-sans text-sm font-bold text-[#3D95CE]">Pay with Venmo</span>
      </a>
    </div>

    <!-- Footer nav -->
    <div class="flex items-center justify-between px-6 pb-4">
      <a href="/" class="font-sans text-xs font-semibold text-[#c8705a] hover:text-[#a85540] flex items-center gap-1">
        <span class="material-symbols-rounded text-base leading-none">home</span> Home
      </a>
      <a href="/checklist" class="font-sans text-xs font-semibold text-[#c8705a] hover:text-[#a85540]">Checklist →</a>
    </div>
    <div class="flex justify-center pb-5">
      <a href="/admin" class="font-sans text-[10px] text-[#c8b0a8] hover:text-[#a08878] flex items-center gap-1 transition-colors">
        <span class="material-symbols-rounded text-sm leading-none">lock</span> Admin
      </a>
    </div>

  </div>
</main>
