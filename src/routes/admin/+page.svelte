<script>
  import { browser } from '$app/environment';
  export let data;

  const PASSWORD = 'admin!';
  const SESSION_KEY = 'jp26_admin';

  let unlocked = false;
  let input = '';
  let error = false;

  if (browser) {
    unlocked = sessionStorage.getItem(SESSION_KEY) === '1';
  }

  function attempt() {
    if (input === PASSWORD) {
      unlocked = true;
      error = false;
      if (browser) sessionStorage.setItem(SESSION_KEY, '1');
    } else {
      error = true;
      input = '';
    }
  }

  function lock() {
    unlocked = false;
    if (browser) sessionStorage.removeItem(SESSION_KEY);
  }

  function handleKey(e) {
    if (e.key === 'Enter') attempt();
  }

  const {
    flightPayments, flightTotal, flightPerPerson, flightCollected, flightOutstanding,
    hotels, hotelTotal, hotelPerPerson, hotelPayments, hotelCollected, hotelOutstanding,
    bookedActivities, activityPayments, activityTotal, activityPerPerson, activityCollected, activityOutstanding,
  } = data;

  function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function fmtUSD(n) {
    return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function pct(paid, share) {
    return Math.min(100, Math.round((paid / share) * 100));
  }
</script>

<svelte:head><title>Admin</title></svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#f5ede8] py-8 px-4">
  <div class="w-[340px] bg-[#faf0eb] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#e8d0c8]">

    <!-- Header -->
    <div class="px-6 pt-7 pb-5 text-center">
      <span class="material-symbols-rounded text-3xl text-[#c8705a]">lock</span>
      <h1 class="font-cursive text-[#9b3a3a] text-4xl leading-tight mt-1">Admin</h1>
      <p class="font-sans text-[#a07870] text-xs mt-1">Payment tracker · private</p>
    </div>

    {#if !unlocked}
      <!-- Password gate -->
      <div class="px-6 pb-8 flex flex-col items-center gap-3">
        <input
          type="password"
          bind:value={input}
          on:keydown={handleKey}
          placeholder="Password"
          class="w-full rounded-2xl border {error ? 'border-[#c8705a]' : 'border-[#e0c8c0]'} bg-white px-4 py-3 font-sans text-sm text-[#3a2020] placeholder-[#c0a8a0] focus:outline-none focus:ring-2 focus:ring-[#c8705a] text-center tracking-widest"
        />
        {#if error}
          <p class="font-sans text-[11px] text-[#c8705a]">Incorrect password — try again</p>
        {/if}
        <button
          on:click={attempt}
          class="w-full bg-[#c8705a] hover:bg-[#a85540] text-white font-sans font-bold text-sm py-3 rounded-2xl transition-colors"
        >
          Unlock
        </button>
        <a href="/" class="font-sans text-xs text-[#a08878] hover:text-[#c8705a]">← Back to home</a>
      </div>

    {:else}
      <div class="px-4 pb-6 flex flex-col gap-5">

        <!-- ── Flights ── -->
        <section>
          <div class="flex items-center justify-between mb-2 px-1">
            <div class="flex items-center gap-2">
              <span class="material-symbols-rounded text-base text-[#c8705a]">flight</span>
              <h2 class="font-cursive text-[#9b3a3a] text-2xl leading-none">Flights</h2>
            </div>
            <span class="font-sans text-[10px] text-[#a08878]">{fmtUSD(flightPerPerson)}/pp · 4 travelers</span>
          </div>

          <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm flex flex-col gap-3 mb-2">
            {#each flightPayments as p}
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="font-sans text-[12px] font-semibold text-[#3a2020]">{p.name}</span>
                  <span class="font-sans text-[10px] {p.owes === 0 ? 'text-[#287040]' : p.paid > 0 ? 'text-[#c8705a]' : 'text-[#a08878]'}">
                    {#if p.owes === 0}✓ Paid in full
                    {:else if p.paid > 0}{fmtUSD(p.paid)} · owes {fmtUSD(p.owes)}
                    {:else}Owes {fmtUSD(p.share)}{/if}
                  </span>
                </div>
                <div class="h-2 rounded-full bg-[#f0e0d8] overflow-hidden mb-1">
                  <div class="h-full rounded-full transition-all {p.owes === 0 ? 'bg-[#287040]' : 'bg-[#c8705a]'}"
                    style="width: {pct(p.paid, p.share)}%"></div>
                </div>
                {#if p.history?.length > 0}
                  <div class="flex flex-col gap-0.5 pl-1 border-l-2 border-[#f0e0d8] ml-0.5">
                    {#each p.history as h}
                      <div class="flex justify-between text-[9px] text-[#a08878]">
                        <span>{h.date} · {h.note}</span>
                        <span class="font-semibold text-[#3a2020]">{fmtUSD(h.amount)}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>

          <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm grid grid-cols-3 text-center gap-2">
            <div>
              <p class="font-sans text-[9px] text-[#a08878] uppercase tracking-wide">Total</p>
              <p class="font-sans font-bold text-sm text-[#3a2020]">{fmtUSD(flightTotal)}</p>
            </div>
            <div>
              <p class="font-sans text-[9px] text-[#287040] uppercase tracking-wide">Collected</p>
              <p class="font-sans font-bold text-sm text-[#287040]">{fmtUSD(flightCollected)}</p>
            </div>
            <div>
              <p class="font-sans text-[9px] text-[#c8705a] uppercase tracking-wide">Outstanding</p>
              <p class="font-sans font-bold text-sm text-[#c8705a]">{fmtUSD(flightOutstanding)}</p>
            </div>
          </div>
        </section>

        <!-- divider -->
        <div class="border-t border-dashed border-[#e8d0c8]"></div>

        <!-- ── Hotels ── -->
        <section>
          <div class="flex items-center justify-between mb-2 px-1">
            <div class="flex items-center gap-2">
              <span class="material-symbols-rounded text-base text-[#c8705a]">hotel</span>
              <h2 class="font-cursive text-[#9b3a3a] text-2xl leading-none">Hotels</h2>
            </div>
            <span class="font-sans text-[10px] text-[#a08878]">varies/pp · 7 travelers</span>
          </div>

          <!-- Hotel breakdown -->
          <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm flex flex-col gap-3 mb-2">
            {#each hotels as h}
              <div class="flex items-start justify-between gap-2 pl-2 rounded-lg"
                   style={h.group_color ? `border-left: 3px solid ${h.group_color}` : ''}>
                <div class="min-w-0 flex-1">
                  <p class="font-sans font-bold text-[11px] text-[#3a2020] leading-snug">{h.label}</p>
                  <p class="font-sans text-[9px] text-[#a08878] mt-0.5 leading-snug">{h.notes.split('·')[0].trim()}</p>
                  {#if h.cancel_by}
                    <p class="font-sans text-[9px] text-[#287040] mt-0.5">
                      <span class="material-symbols-rounded text-[10px] align-middle">event_available</span>
                      Free cancel by {h.cancel_by}
                    </p>
                  {/if}
                </div>
                <p class="font-sans font-bold text-sm text-[#3a2020] shrink-0">{h.approximate ? '~' : ''}{fmtUSD(h.amount)}</p>
              </div>
            {/each}
          </div>

          <!-- Hotel payment tracker -->
          <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm flex flex-col gap-3 mb-2">
            {#each hotelPayments as p}
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="font-sans text-[12px] font-semibold text-[#3a2020]">{p.name}</span>
                  <span class="font-sans text-[10px] {p.owes === 0 ? 'text-[#287040]' : p.paid > 0 ? 'text-[#c8705a]' : 'text-[#a08878]'}">
                    {#if p.owes === 0}✓ Paid in full
                    {:else if p.paid > 0}{fmtUSD(p.paid)} · owes {fmtUSD(p.owes)}
                    {:else}Owes {fmtUSD(p.share)}{/if}
                  </span>
                </div>
                <div class="h-2 rounded-full bg-[#f0e0d8] overflow-hidden mb-1">
                  <div class="h-full rounded-full transition-all {p.owes === 0 ? 'bg-[#287040]' : 'bg-[#c8705a]'}"
                    style="width: {pct(p.paid, p.share)}%"></div>
                </div>
                {#if p.history?.length > 0}
                  <div class="flex flex-col gap-0.5 pl-1 border-l-2 border-[#f0e0d8] ml-0.5">
                    {#each p.history as h}
                      <div class="flex justify-between text-[9px] text-[#a08878]">
                        <span>{h.date} · {h.note}</span>
                        <span class="font-semibold text-[#3a2020]">{fmtUSD(h.amount)}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>

          <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm grid grid-cols-3 text-center gap-2">
            <div>
              <p class="font-sans text-[9px] text-[#a08878] uppercase tracking-wide">Total</p>
              <p class="font-sans font-bold text-sm text-[#3a2020]">{fmtUSD(hotelTotal)}</p>
            </div>
            <div>
              <p class="font-sans text-[9px] text-[#287040] uppercase tracking-wide">Collected</p>
              <p class="font-sans font-bold text-sm text-[#287040]">{fmtUSD(hotelCollected)}</p>
            </div>
            <div>
              <p class="font-sans text-[9px] text-[#c8705a] uppercase tracking-wide">Outstanding</p>
              <p class="font-sans font-bold text-sm text-[#c8705a]">{fmtUSD(hotelOutstanding)}</p>
            </div>
          </div>
        </section>

        <!-- divider -->
        <div class="border-t border-dashed border-[#e8d0c8]"></div>

        <!-- ── Activities ── -->
        <section>
          <div class="flex items-center justify-between mb-2 px-1">
            <div class="flex items-center gap-2">
              <span class="material-symbols-rounded text-base text-[#c8705a]">confirmation_number</span>
              <h2 class="font-cursive text-[#9b3a3a] text-2xl leading-none">Activities</h2>
            </div>
            <span class="font-sans text-[10px] text-[#a08878]">{fmtUSD(activityPerPerson)}/pp · 7 travelers</span>
          </div>

          <!-- Activity breakdown list -->
          <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm flex flex-col gap-2 mb-2">
            {#each bookedActivities as a}
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <p class="font-sans font-bold text-[11px] text-[#3a2020] leading-snug">{a.label}</p>
                  <p class="font-sans text-[9px] text-[#a08878]">{a.city}{a.date ? ' · ' + fmtDate(a.date) : ''}</p>
                  {#if a.cancel_by}
                    <p class="font-sans text-[9px] text-[#287040] mt-0.5">
                      <span class="material-symbols-rounded text-[10px] align-middle">event_available</span>
                      Free cancel by {a.cancel_by}
                    </p>
                  {/if}
                </div>
                <p class="font-sans font-bold text-sm text-[#3a2020] shrink-0">{fmtUSD(a.amount)}</p>
              </div>
            {/each}
          </div>

          <!-- Activity payment tracker -->
          <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm flex flex-col gap-3 mb-2">
            {#each activityPayments as p}
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="font-sans text-[12px] font-semibold text-[#3a2020]">{p.name}</span>
                  <span class="font-sans text-[10px] {p.owes === 0 ? 'text-[#287040]' : p.paid > 0 ? 'text-[#c8705a]' : 'text-[#a08878]'}">
                    {#if p.owes === 0}✓ Paid in full
                    {:else if p.paid > 0}{fmtUSD(p.paid)} · owes {fmtUSD(p.owes)}
                    {:else}Owes {fmtUSD(p.share)}{/if}
                  </span>
                </div>
                <div class="h-2 rounded-full bg-[#f0e0d8] overflow-hidden mb-1">
                  <div class="h-full rounded-full transition-all {p.owes === 0 ? 'bg-[#287040]' : 'bg-[#c8705a]'}"
                    style="width: {pct(p.paid, p.share)}%"></div>
                </div>
                {#if p.history?.length > 0}
                  <div class="flex flex-col gap-0.5 pl-1 border-l-2 border-[#f0e0d8] ml-0.5">
                    {#each p.history as h}
                      <div class="flex justify-between text-[9px] text-[#a08878]">
                        <span>{h.date} · {h.note}</span>
                        <span class="font-semibold text-[#3a2020]">{fmtUSD(h.amount)}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>

          <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3 shadow-sm grid grid-cols-3 text-center gap-2">
            <div>
              <p class="font-sans text-[9px] text-[#a08878] uppercase tracking-wide">Total</p>
              <p class="font-sans font-bold text-sm text-[#3a2020]">{fmtUSD(activityTotal)}</p>
            </div>
            <div>
              <p class="font-sans text-[9px] text-[#287040] uppercase tracking-wide">Collected</p>
              <p class="font-sans font-bold text-sm text-[#287040]">{fmtUSD(activityCollected)}</p>
            </div>
            <div>
              <p class="font-sans text-[9px] text-[#c8705a] uppercase tracking-wide">Outstanding</p>
              <p class="font-sans font-bold text-sm text-[#c8705a]">{fmtUSD(activityOutstanding)}</p>
            </div>
          </div>
        </section>

        <!-- ── Lock ── -->
        <button
          on:click={lock}
          class="flex items-center justify-center gap-1.5 w-full border border-[#e0c8c0] rounded-2xl py-2.5 font-sans text-xs text-[#a08878] hover:text-[#c8705a] hover:border-[#c8705a] transition-colors"
        >
          <span class="material-symbols-rounded text-sm leading-none">lock</span> Lock
        </button>

        <a href="/" class="text-center font-sans text-xs text-[#a08878] hover:text-[#c8705a]">← Back to home</a>
      </div>
    {/if}

  </div>
</main>
