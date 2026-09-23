<script>
  export let data;
  const { segments, airCanada, index, total } = data;
</script>

<svelte:head>
  <title>Return Flight · Japan 2026</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#f5ede8] py-8 px-4">
  <div class="w-[340px] phone-frame flex flex-col">
    <div class="relative overflow-hidden bg-gradient-to-b from-[#dcd8ee] to-[#f2eaf2] px-5 py-7 text-center">
      <p class="font-sans text-[10px] uppercase tracking-widest text-[#75668e]">Step {index} / {total}</p>
      <span class="material-symbols-rounded mt-3 text-4xl text-[#74549a]">flight_land</span>
      <h1 class="font-cursive text-[#74549a] text-4xl leading-tight mt-1">Heading Home</h1>
      <p class="font-sans text-xs text-[#6b5c70] mt-1">Tokyo, Japan → Raleigh, NC</p>
    </div>

    <div class="flex flex-col gap-4 px-4 py-5">
      <div class="flex items-center justify-center gap-2">
        <span class="material-symbols-rounded text-sm text-[#74549a]">calendar_month</span>
        <span class="font-sans font-semibold text-sm text-[#5a3d38]">Saturday, October 31 · Return day</span>
      </div>

      <div class="glass-card overflow-hidden border-[#c8b8d8]">
        <div class="h-1.5 w-full bg-[#8c6bb1]"></div>
        <div class="px-3 py-3 flex flex-col gap-2.5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-sm text-[#74549a]">flight_takeoff</span>
            <div>
              <p class="font-sans font-bold text-[11px] text-[#5a3d38]">James, Frances &amp; Carlos</p>
              <p class="font-sans text-[9px] text-[#a08878]">Return flight · Delta</p>
            </div>
          </div>

          {#each segments as flight}
            <div class="glass-subtle rounded-lg px-2.5 py-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-sans font-bold text-[11px] text-[#74549a]">{flight.from.code} → {flight.to.code}</span>
                  <span class="font-sans text-[10px] font-bold text-[#5a3d38]">{flight.flight_number}</span>
                </div>
                <div class="flex items-center justify-between gap-2 mt-0.5">
                  <span class="font-sans font-bold text-[10px] text-[#3a2020]">{flight.time_depart} → {flight.time_arrive}</span>
                  <span class="font-sans text-[9px] text-[#7a5c56]">{flight.from.terminal} → {flight.to.terminal}</span>
                </div>
            </div>
          {/each}

          <p class="font-sans text-[9px] leading-relaxed text-[#7a5c56]">
            Be at Haneda early for the 5:35 PM departure. DL274 arrives in Detroit at 4:31 PM, then connect to Raleigh at 11:42 PM.
          </p>
        </div>
      </div>

      <div class="glass-card overflow-hidden border-[#d8b8c8]">
        <div class="h-1.5 w-full bg-[#c8705a]"></div>
        <div class="px-3 py-3 flex flex-col gap-2.5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-sm text-[#a85540]">flight_takeoff</span>
            <div>
              <p class="font-sans font-bold text-[11px] text-[#5a3d38]">Jessy, Yamil, Jurializ &amp; Hilary</p>
              <p class="font-sans text-[9px] text-[#a08878]">Return flight · Air Canada</p>
            </div>
          </div>

          {#if airCanada}
            {#each airCanada.legs as leg}
              {#if leg.layover}
                <div class="flex items-center gap-2 rounded-lg border border-dashed border-[#d8b8c8] bg-[#fff8f4] px-2.5 py-2">
                  <span class="material-symbols-rounded text-sm text-[#c8705a]">connecting_airports</span>
                  <div class="min-w-0">
                    <p class="font-sans font-bold text-[10px] text-[#a85540]">Layover · {leg.city} ({leg.airport})</p>
                    <p class="font-sans text-[9px] text-[#7a5c56]">{leg.duration} · clear connections, then continue to RDU</p>
                  </div>
                </div>
              {:else}
                <div class="glass-subtle rounded-lg px-2.5 py-2">
                  <div class="flex items-center justify-between gap-2">
                    <span class="font-sans font-bold text-[11px] text-[#a85540]">{leg.from} → {leg.to}</span>
                    <span class="font-sans text-[10px] font-bold text-[#5a3d38]">{leg.flight}</span>
                  </div>
                  <div class="flex items-center justify-between gap-2 mt-0.5">
                    <span class="font-sans font-bold text-[10px] text-[#3a2020]">{leg.depart} → {leg.arrive}</span>
                    <span class="font-sans text-[9px] text-[#7a5c56]">T{leg.from_terminal} → T{leg.to_terminal}</span>
                  </div>
                </div>
              {/if}
            {/each}
          {/if}

          <p class="font-sans text-[9px] leading-relaxed text-[#7a5c56]">
            Connect in Toronto (YYZ), then arrive in Raleigh at 9:51 PM.
          </p>

          <!-- Airport timeline -->
          <div class="rounded-xl border border-[#ead7e4] bg-white/55 px-2.5 py-2">
            <div class="flex items-center justify-between gap-1">
              <div class="min-w-0 text-center">
                <span class="material-symbols-rounded text-sm text-[#74549a]">flight_takeoff</span>
                <p class="font-sans text-[9px] font-bold text-[#5a3d38]">HND</p>
                <p class="font-sans text-[8px] text-[#a08878]">Depart</p>
              </div>
              <div class="flex min-w-0 flex-1 items-center gap-1">
                <span class="h-px flex-1 bg-[#d8b8c8]"></span>
                <span class="material-symbols-rounded text-xs text-[#c8705a]">arrow_forward</span>
                <span class="h-px flex-1 bg-[#d8b8c8]"></span>
              </div>
              <div class="min-w-0 text-center">
                <span class="material-symbols-rounded text-sm text-[#c8705a]">connecting_airports</span>
                <p class="font-sans text-[9px] font-bold text-[#5a3d38]">YYZ</p>
                <p class="font-sans text-[8px] text-[#c8705a]">2h 05m</p>
              </div>
              <div class="flex min-w-0 flex-1 items-center gap-1">
                <span class="h-px flex-1 bg-[#d8b8c8]"></span>
                <span class="material-symbols-rounded text-xs text-[#c8705a]">arrow_forward</span>
                <span class="h-px flex-1 bg-[#d8b8c8]"></span>
              </div>
              <div class="min-w-0 text-center">
                <span class="material-symbols-rounded text-sm text-[#74549a]">flight_land</span>
                <p class="font-sans text-[9px] font-bold text-[#5a3d38]">RDU</p>
                <p class="font-sans text-[8px] text-[#a08878]">Arrive</p>
              </div>
            </div>
          </div>

          <!-- AMEX Platinum reminders mixed with Jessy's flight -->
          <div class="rounded-xl border border-[#e2c9d8] bg-[#fff8f4] px-2.5 py-2.5">
            <div class="flex items-start gap-2">
              <span class="material-symbols-rounded text-lg text-[#74549a]">credit_card</span>
              <div class="min-w-0 flex-1">
                <p class="font-sans font-bold text-[11px] text-[#5a3d38]">Jessy’s AMEX Platinum</p>
                <p class="font-sans text-[9px] leading-relaxed text-[#7a5c56] mt-1">
                  Keep the boarding passes and receipts, check lounge access at Haneda and Toronto, and verify the current travel-protection terms in your Amex account.
                </p>
                <p class="font-sans text-[9px] leading-relaxed text-[#7a5c56] mt-1">
                  Future-booking tip: eligible flights booked directly with the airline or through Amex Travel may earn 5X points; verify the current terms first.
                </p>
                <div class="mt-2 space-y-2 font-sans text-[9px] leading-relaxed text-[#5a3d38]">
                  <div class="rounded-lg border border-[#ead7e4] bg-white/60 px-2 py-1.5">
                    <p class="font-bold text-[#74549a]">HND · Tokyo departure</p>
                    <p><strong>Best stop:</strong> Terminal 3 Centurion Lounge after 3:50 PM — access is within 3 hours of the 6:50 PM departure.</p>
                    <p class="mt-1"><strong>Party of 4:</strong> you enter free; the standard rate is <strong>$50 per adult guest</strong> — about <strong>$150</strong> for 3 guests if complimentary guest access is not active. Verify your account status in the Amex app; HND guest rules can vary internationally.</p>
                    <p class="mt-1"><strong>Centurion amenities:</strong> premium food, food/snacks, drinks, charging, seating, beer/wine, Wi‑Fi, and flight information.</p>
                    <p class="mt-1"><strong>Second choice:</strong> Priority Pass Sky Lounge South near Gate 108; open 24 hours, max 3 hours, subject to space. For 4 people, Priority Pass covers you + 2 guests; guest 4 is about <strong>$27</strong>.</p>
                    <p class="mt-1"><strong>Sky Lounge amenities:</strong> food/snacks, drinks, charging, seating, beer/wine, Wi‑Fi, and flight monitors.</p>
                    <div class="mt-2 rounded-lg border border-dashed border-[#e2c9d8] bg-white/70 px-2 py-1.5">
                      <p class="font-bold text-[#74549a]">HND lounge path · same terminal</p>
                      <div class="mt-1 flex flex-wrap items-center gap-x-1 gap-y-1 text-[8px] text-[#7a5c56]">
                        <span class="rounded-full bg-[#f1e8f5] px-1.5 py-0.5 font-bold text-[#74549a]">T3 security</span>
                        <span class="material-symbols-rounded text-[10px] text-[#c8705a]">arrow_forward</span>
                        <span class="rounded-full bg-[#fff0ea] px-1.5 py-0.5">Centurion · 4F / G114</span>
                        <span class="material-symbols-rounded text-[10px] text-[#c8705a]">arrow_forward</span>
                        <span class="rounded-full bg-[#fff0ea] px-1.5 py-0.5">Sky Lounge South · G108</span>
                        <span class="material-symbols-rounded text-[10px] text-[#c8705a]">arrow_forward</span>
                        <span class="rounded-full bg-[#f1e8f5] px-1.5 py-0.5 font-bold text-[#74549a]">AC2 gate</span>
                      </div>
                      <p class="mt-1 text-[8px] text-[#a08878]">Approx. timing: ~3:50 PM T3 security → ~4:05 Centurion → ~5:10 walk to Sky Lounge South → ~5:40 leave for the gate → ~6:00–6:15 PM AC2 gate.</p>
                      <p class="mt-1 text-[8px] text-[#a08878]">No shuttle: these are nearby T3 options. Choose one primary lounge or make the second stop brief, then walk to the assigned gate.</p>
                    </div>
                  </div>
                  <div class="rounded-lg border border-[#f0d0c5] bg-[#fffaf7] px-2 py-1.5">
                    <p class="font-bold text-[#c8705a]">YYZ · Toronto connection</p>
                    <p><strong>Backup only:</strong> Plaza Premium Terminal 1 Transborder near Gate F55 only if customs, security, and the connection are moving quickly.</p>
                    <p class="mt-1"><strong>Party of 4:</strong> if entering with Priority Pass and the lounge accepts it, you + 2 guests are included and guest 4 is about <strong>$27</strong>; Plaza Premium rules can vary.</p>
                    <p class="mt-1"><strong>YYZ amenities:</strong> premium food, food/snacks, drinks, charging, seating, beer/wine, Wi‑Fi, flight monitors, and paid showers; maximum stay is 2 hours.</p>
                    <div class="mt-2 rounded-lg border border-dashed border-[#f0d0c5] bg-white/70 px-2 py-1.5">
                      <p class="font-bold text-[#c8705a]">YYZ lounge path</p>
                      <div class="mt-1 flex flex-wrap items-center gap-x-1 gap-y-1 text-[8px] text-[#7a5c56]">
                        <span class="rounded-full bg-[#fff0ea] px-1.5 py-0.5 font-bold text-[#c8705a]">T1 arrival</span>
                        <span class="material-symbols-rounded text-[10px] text-[#c8705a]">arrow_forward</span>
                        <span class="rounded-full bg-[#fff0ea] px-1.5 py-0.5">customs / security</span>
                        <span class="material-symbols-rounded text-[10px] text-[#c8705a]">arrow_forward</span>
                        <span class="rounded-full bg-[#fff0ea] px-1.5 py-0.5">F55 lounge</span>
                        <span class="material-symbols-rounded text-[10px] text-[#c8705a]">arrow_forward</span>
                        <span class="rounded-full bg-[#f1e8f5] px-1.5 py-0.5 font-bold text-[#74549a]">AC8838 gate</span>
                      </div>
                      <p class="mt-1 text-[8px] text-[#a08878]">Approx. timing: 5:55 PM arrive → ~6:00–6:45 customs/security → ~6:50 F55 lounge → leave by ~7:20 → ~7:35–7:45 AC8838 gate.</p>
                      <p class="mt-1 text-[8px] text-[#a08878]">No shuttle: F55 is in the same T1 transborder area. Only use it if customs and security move quickly; the gate comes first.</p>
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                  <a href="https://global.americanexpress.com/card-benefits/detail/the-lounge-collection/platinum" target="_blank" rel="noopener noreferrer" class="font-sans text-[9px] font-bold text-[#74549a]">Check lounge access ↗</a>
                  <a href="https://www.americanexpress.com/en-us/travel/lounges/the-platinum-card/HND" target="_blank" rel="noopener noreferrer" class="font-sans text-[9px] font-bold text-[#74549a]">HND lounge list ↗</a>
                  <a href="https://www.prioritypass.com/en-GB/lounges/japan/haneda/hnd18-sky-lounge-south" target="_blank" rel="noopener noreferrer" class="font-sans text-[9px] font-bold text-[#74549a]">Sky Lounge South ↗</a>
                  <a href="https://www.torontopearson.com/en/while-you-are-here/toronto-airport-services/plaza-premium-lounge-t1-after-usa-f55" target="_blank" rel="noopener noreferrer" class="font-sans text-[9px] font-bold text-[#74549a]">YYZ F55 details ↗</a>
                  <a href="https://www.americanexpress.com/en-us/account/get-started/platinum/" target="_blank" rel="noopener noreferrer" class="font-sans text-[9px] font-bold text-[#74549a]">Review benefits ↗</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="flex items-center justify-between px-5 pb-6 pt-2 mt-auto">
      <a href="/city/city_tokyo_shinjuku?tab=itinerary" class="font-sans text-xs font-semibold text-[#74549a] flex items-center gap-1">
        <span class="material-symbols-rounded text-sm">arrow_back</span> Itinerary
      </a>
      <span class="font-sans text-[10px] text-[#a08878]">{index} / {total}</span>
      <a href="/" class="font-sans text-xs font-bold text-white bg-[#74549a] rounded-full px-3 py-1.5 flex items-center gap-1">
        Finish <span class="material-symbols-rounded text-sm">home</span>
      </a>
    </div>
  </div>
</main>
