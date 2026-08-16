<script>
  export let data;
  const { flights, activities, hotels, tbd, flightTotal, activityTotal, hotelTotal } = data;

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
  <div class="w-[340px] bg-[#faf0eb] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#e8d0c8]">

    <!-- Header -->
    <div class="px-6 pt-7 pb-4 text-center">
      <h1 class="font-cursive text-[#9b3a3a] text-4xl leading-tight">Budget</h1>
      <p class="font-sans text-[#a07870] text-xs mt-1">Confirmed trip spend</p>
    </div>


    <div class="flex flex-col gap-4 px-4 pb-6">

      <!-- ── Flights ── -->
      <section>
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-base text-[#c8705a]">flight</span>
          <h2 class="font-cursive text-[#9b3a3a] text-2xl leading-none">Flights</h2>
          <span class="ml-auto font-sans text-[10px] text-[#a08878]">4 travelers</span>
        </div>

        <div class="flex flex-col gap-2">
          {#each flights as f}
            <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="font-sans font-bold text-sm text-[#3a2020]">{f.label}</p>
                  <p class="font-sans text-[10px] text-[#a08878] mt-0.5">{f.carrier}{f.date ? ' · ' + fmtDate(f.date) : ''}</p>
                  <p class="font-sans text-[10px] text-[#b08878] mt-0.5 leading-snug">{f.travelers_names?.join(', ')}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="font-sans font-bold text-sm text-[#3a2020]">{fmtUSD(f.amount)}</p>
                  <p class="font-sans text-[10px] text-[#287040]">{perPerson(f.amount, f.currency, f.travelers)}/pp</p>
                  <span class="font-sans text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full border {statusColor(f.status)}">{f.status}</span>
                </div>
              </div>
            </div>
          {/each}
          <div class="flex items-center justify-between px-1 py-1">
            <span class="font-sans text-[10px] text-[#a08878]">Flight subtotal</span>
            <span class="font-sans font-bold text-xs text-[#3a2020]">{fmtUSD(flightTotal)} · {fmtUSD(+(flightTotal/4).toFixed(2))}/pp</span>
          </div>
        </div>
      </section>

      <!-- ── Hotels ── -->
      <section>
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-base text-[#c8705a]">hotel</span>
          <h2 class="font-cursive text-[#9b3a3a] text-2xl leading-none">Hotels</h2>
          <span class="ml-auto font-sans text-[10px] text-[#a08878]">7 travelers</span>
        </div>
        <div class="flex flex-col gap-2">
          {#each hotels as h}
            <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm overflow-hidden relative"
                 style={h.group_color ? `border-left: 3px solid ${h.group_color}` : ''}>
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  {#if h.link}
                    <a href={h.link} target="_blank" rel="noopener"
                       class="font-sans font-bold text-[12px] text-[#c8705a] leading-snug hover:underline">{h.label}</a>
                  {:else}
                    <p class="font-sans font-bold text-[12px] text-[#3a2020] leading-snug">{h.label}</p>
                  {/if}
                  <p class="font-sans text-[10px] text-[#a08878] mt-0.5 leading-snug">{h.notes.split('·')[0].trim()}</p>
                  {#if h.cancel_by}
                    <p class="font-sans text-[9px] text-[#287040] mt-0.5">
                      <span class="material-symbols-rounded text-[10px] align-middle">event_available</span>
                      Free cancel by {h.cancel_by}
                    </p>
                  {/if}
                </div>
                <div class="text-right shrink-0">
                  <p class="font-sans font-bold text-sm text-[#3a2020]">{h.approximate ? '~' : ''}{fmtUSD(toUSD(h.amount, h.currency))}</p>
                  <p class="font-sans text-[10px] text-[#287040]">{fmtUSD(+(toUSD(h.amount, h.currency)/h.guests).toFixed(2))}/pp</p>
                  <span class="font-sans text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full border {statusColor(h.status)}">{h.status}</span>
                </div>
              </div>
            </div>
          {/each}
          <div class="flex items-center justify-between px-1 py-1">
            <span class="font-sans text-[10px] text-[#a08878]">Hotel subtotal</span>
            <span class="font-sans font-bold text-xs text-[#3a2020]">{fmtUSD(hotelTotal)} · {fmtUSD(+(hotelTotal/7).toFixed(2))}/pp</span>
          </div>
        </div>
      </section>

      <!-- ── Activities ── -->
      <section>
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-rounded text-base text-[#c8705a]">confirmation_number</span>
          <h2 class="font-cursive text-[#9b3a3a] text-2xl leading-none">Activities</h2>
          <span class="ml-auto font-sans text-[10px] text-[#a08878]">7 travelers</span>
        </div>

        <div class="flex flex-col gap-2">
          {#each activities as a}
            {@const usd = toUSD(a.amount, a.currency)}
            <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <p class="font-sans font-bold text-[12px] text-[#3a2020] leading-snug">{a.label}</p>
                  <p class="font-sans text-[10px] text-[#a08878] mt-0.5">{a.city}{a.date ? ' · ' + fmtDate(a.date) : ''}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="font-sans font-bold text-sm text-[#3a2020]">{fmtUSD(usd)}</p>
                  <p class="font-sans text-[10px] text-[#287040]">{perPerson(a.amount, a.currency, a.travelers)}/pp</p>
                  <span class="font-sans text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full border {statusColor(a.status)}">{a.status}</span>
                </div>
              </div>
            </div>
          {/each}
          <div class="flex items-center justify-between px-1 py-1">
            <span class="font-sans text-[10px] text-[#a08878]">Activity subtotal</span>
            <span class="font-sans font-bold text-xs text-[#3a2020]">{fmtUSD(activityTotal)} · {fmtUSD(+(activityTotal/7).toFixed(2))}/pp</span>
          </div>
        </div>
      </section>

      <!-- ── Per-person summary ── -->
      <section class="bg-white rounded-2xl border border-[#f0d8d0] p-4 shadow-sm">
        <p class="font-sans text-[10px] uppercase tracking-wider text-[#b08878] mb-3">Per-Person Estimate</p>
        <div class="flex flex-col gap-2">
          {#each [
            ['Jessy / Jurializ / Hilary / Yamil', fmtUSD(+(flightTotal/4 + hotelTotal/7 + activityTotal/7).toFixed(2)), '(flights + hotels + activities)'],
            ['Carlos / Frances / James', fmtUSD(+(hotelTotal/7 + activityTotal/7).toFixed(2)), '(hotels + activities)'],
          ] as [who, cost, note]}
            <div class="flex items-center justify-between gap-2">
              <div>
                <p class="font-sans font-bold text-[11px] text-[#3a2020]">{who}</p>
                <p class="font-sans text-[9px] text-[#a08878]">{note}</p>
              </div>
              <p class="font-sans font-bold text-sm text-[#c8705a] shrink-0">{cost}</p>
            </div>
          {/each}
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
              <div class="bg-white/60 rounded-2xl border border-dashed border-[#e0c8c0] p-3">
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
