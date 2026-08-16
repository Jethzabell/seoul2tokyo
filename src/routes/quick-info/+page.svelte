<script>
  import { tbd } from '$lib/segmentColors.js';

  export let data;
  const { trip, travelerCount, flightSegments, flightParty, airport_cards, rail_cards, qr_placeholders, hotels, tripStats } = data;

  function fmtDate(iso) {
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  function nights(a, d) {
    return Math.round((new Date(d + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);
  }
</script>

<svelte:head>
  <title>Quick Info</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center page-gradient py-8 px-4">
  <div class="w-[340px] phone-frame">

    <div class="page-gradient px-6 pt-7 pb-4 text-center">
      <h1 class="font-cursive text-white text-4xl leading-tight">Quick Info</h1>
      <p class="font-sans text-white/80 text-xs mt-1">Everything you need at a glance</p>
    </div>

    <div class="flex flex-col gap-5 px-4 pb-6">

      <!-- Trip at a Glance -->
      <section>
        <div class="glass-card p-4 flex flex-col gap-2.5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-lg text-[#c8705a]">flight_takeoff</span>
            <span class="font-sans font-bold text-sm text-[#3a2020]">{trip.duration}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-[#7a5c56] font-sans">
            <span class="material-symbols-rounded text-sm text-[#a08878]">calendar_month</span>
            {trip.dates.display}
          </div>
          <div class="flex items-center gap-1.5 text-xs text-[#a08878] font-sans flex-wrap">
            {#each trip.route as city, i}
              {#if i > 0}<span class="text-[#c8705a]">→</span>{/if}
              <span class="font-semibold text-[#5a3d38]">{city}</span>
            {/each}
          </div>
          <div class="flex items-center gap-2 text-xs text-[#a08878] font-sans">
            <span class="material-symbols-rounded text-sm">group</span>
            {travelerCount} travelers
          </div>
        </div>
      </section>

      <!-- Flights -->
      {#if flightSegments.length}
        <section>
          <svg viewBox="0 0 40 20" class="w-6 mx-auto opacity-15 mb-2" fill="#c8705a"><rect x="6" y="6" width="2" height="14" rx="1"/><rect x="32" y="6" width="2" height="14" rx="1"/><rect x="3" y="3" width="34" height="3" rx="1.5"/><rect x="8" y="8" width="24" height="2" rx="1"/></svg>
          <h2 class="font-cursive text-[#9b3a3a] text-2xl mb-3 flex items-center gap-2">
            <span class="material-symbols-rounded text-xl">flight</span> Flights
          </h2>
          <div class="flex flex-col gap-2">
            {#each flightSegments as seg, i}
              {@const c = { bg: '#fde8f0', border: '#f4a8c4', band: '#f09ab8', text: '#9b284a' }}
              <div class="glass-card p-3 flex flex-col gap-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-sans font-bold text-xs text-[#5a3d38]">{i === 0 ? 'Outbound' : 'Return'} · {seg.from.code} → {seg.to.code}</span>
                  {#if seg.reservation_code && seg.reservation_code !== 'TBD'}
                    <span class="font-sans text-[10px] font-bold text-[#9b284a] bg-[#fde8f0] px-2 py-0.5 rounded-full">{seg.reservation_code}</span>
                  {/if}
                </div>
                <div class="font-sans text-[10px] text-[#7a5c56]">
                  {fmtDate(seg.date)} · {seg.time_depart} → {seg.time_arrive} · {seg.carrier} {seg.number}
                </div>
                {#if seg.fare_class}
                  <div class="font-sans text-[10px] text-[#a08878]">{seg.fare_class}</div>
                {/if}
                {#if seg.passengers?.length}
                  <div class="flex items-center gap-1 flex-wrap">
                    {#each seg.passengers as name}
                      <span class="font-sans text-[9px] font-semibold text-[#5a3d38] bg-[#fde8e0] px-2 py-0.5 rounded-full">{name}</span>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
            {#if flightParty?.booking_ref}
              <p class="font-sans text-[10px] italic text-[#a08878] px-1">Booking ref {flightParty.booking_ref} · {flightParty.fare_class ?? 'Economy'}</p>
            {/if}
          </div>
        </section>
      {/if}

      <!-- Hotels -->
      <section>
        <svg viewBox="0 0 40 20" class="w-6 mx-auto opacity-15 mb-2" fill="#c8705a"><rect x="6" y="6" width="2" height="14" rx="1"/><rect x="32" y="6" width="2" height="14" rx="1"/><rect x="3" y="3" width="34" height="3" rx="1.5"/><rect x="8" y="8" width="24" height="2" rx="1"/></svg>
        <h2 class="font-cursive text-[#9b3a3a] text-2xl mb-3 flex items-center gap-2">
          <span class="material-symbols-rounded text-xl">hotel</span> Hotels
        </h2>
        <div class="flex flex-col gap-2">
          {#each hotels as h}
            <div class="glass-card p-3">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  {#if h.link}
                    <a href={h.link} target="_blank" rel="noopener"
                      class="font-sans font-bold text-xs text-[#c8705a] hover:underline truncate block">{h.name || 'TBD'}</a>
                  {:else}
                    <p class="font-sans font-bold text-xs text-[#3a2020] truncate">{h.name || 'TBD'}</p>
                  {/if}
                  <p class="font-sans text-[10px] text-[#a08878] mt-0.5">{h.city}</p>
                </div>
                <span class="shrink-0 font-sans text-[10px] font-bold text-[#5a3d38] bg-[#fde8e0] px-2 py-0.5 rounded-full">{nights(h.arrival, h.departure)}N</span>
              </div>
              <div class="flex items-center gap-3 mt-1.5 text-[9px] text-[#a08878] font-sans">
                <span>{fmtDate(h.arrival)} – {fmtDate(h.departure)}</span>
                {#if h.checkin}
                  <span class="flex items-center gap-0.5"><span class="material-symbols-rounded text-[10px]">login</span>{h.checkin}</span>
                {/if}
                {#if h.checkout}
                  <span class="flex items-center gap-0.5"><span class="material-symbols-rounded text-[10px]">logout</span>{h.checkout}</span>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- Airports -->
      <section>
        <svg viewBox="0 0 40 20" class="w-6 mx-auto opacity-15 mb-2" fill="#c8705a"><rect x="6" y="6" width="2" height="14" rx="1"/><rect x="32" y="6" width="2" height="14" rx="1"/><rect x="3" y="3" width="34" height="3" rx="1.5"/><rect x="8" y="8" width="24" height="2" rx="1"/></svg>
        <h2 class="font-cursive text-[#9b3a3a] text-2xl mb-3 flex items-center gap-2">
          <span class="material-symbols-rounded text-xl">flight</span> Airports
        </h2>
        <div class="flex flex-col gap-3">
          {#each airport_cards as card}
            <div class="glass-card overflow-hidden flex">
              <div class="w-20 shrink-0 bg-gradient-to-br from-[#fde8f0] to-[#f4c8d8] flex flex-col items-center justify-center p-2 gap-0.5">
                <span class="font-sans text-[9px] uppercase tracking-wider text-[#c8705a]">Terminal</span>
                {#if tbd(card.terminal)}
                  <span class="font-cursive text-2xl text-[#9b3a3a] leading-none">{card.terminal}</span>
                {:else}
                  <span class="font-sans text-xs italic text-[#c0a8a0] bg-white px-1.5 py-0.5 rounded-full border border-dashed border-[#e0ccc8]">TBD</span>
                {/if}
                <span class="font-sans font-bold text-sm text-[#9b3a3a] mt-1">{card.airport_code}</span>
              </div>
              <div class="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <p class="font-sans font-bold text-sm text-[#3a2020] leading-tight">{card.name}</p>
                  <p class="font-sans text-xs text-[#a08878] mt-0.5 flex items-center gap-1">
                    <span class="material-symbols-rounded text-xs">location_on</span>{card.city}
                  </p>
                  {#if card.notes}
                    <p class="font-sans text-[10px] text-[#7a5c56] mt-1 leading-snug">{card.notes}</p>
                  {/if}
                </div>
                <a href={card.map} target="_blank" rel="noopener"
                  title="View on Map" class="text-[#c8705a] hover:text-[#a85540] mt-1.5 self-start">
                  <span class="material-symbols-rounded text-xl leading-none">location_on</span>
                </a>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- Rail Stations -->
      <section>
        <svg viewBox="0 0 40 20" class="w-6 mx-auto opacity-15 mb-2" fill="#c8705a"><rect x="6" y="6" width="2" height="14" rx="1"/><rect x="32" y="6" width="2" height="14" rx="1"/><rect x="3" y="3" width="34" height="3" rx="1.5"/><rect x="8" y="8" width="24" height="2" rx="1"/></svg>
        <h2 class="font-cursive text-[#9b3a3a] text-2xl mb-3 flex items-center gap-2">
          <span class="material-symbols-rounded text-xl">train</span> Rail Stations
        </h2>
        <div class="flex flex-col gap-2">
          {#each rail_cards as card}
            <div class="glass-card overflow-hidden flex">
              <div class="w-16 shrink-0 bg-gradient-to-br from-[#e8f4ea] to-[#c8e8c8] flex flex-col items-center justify-center p-2 gap-0.5">
                <span class="material-symbols-rounded text-xl text-[#287040]">directions_railway</span>
                <span class="font-sans font-bold text-[9px] text-[#287040] text-center leading-tight">{card.city}</span>
              </div>
              <div class="flex-1 p-2.5 flex items-center justify-between gap-2">
                <div class="min-w-0">
                  <p class="font-sans font-bold text-xs text-[#3a2020] leading-tight">{card.code}</p>
                  <p class="font-sans text-[10px] text-[#a08878] mt-0.5 leading-snug">{card.notes}</p>
                </div>
                <a href={card.map} target="_blank" rel="noopener"
                  title="View on Map" class="text-[#c8705a] hover:text-[#a85540] shrink-0">
                  <span class="material-symbols-rounded text-lg leading-none">location_on</span>
                </a>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- Essential Japan Tips -->
      <section>
        <svg viewBox="0 0 40 20" class="w-6 mx-auto opacity-15 mb-2" fill="#c8705a"><rect x="6" y="6" width="2" height="14" rx="1"/><rect x="32" y="6" width="2" height="14" rx="1"/><rect x="3" y="3" width="34" height="3" rx="1.5"/><rect x="8" y="8" width="24" height="2" rx="1"/></svg>
        <h2 class="font-cursive text-[#9b3a3a] text-2xl mb-3 flex items-center gap-2">
          <span class="material-symbols-rounded text-xl">lightbulb</span> Japan Essentials
        </h2>
        <div class="grid grid-cols-2 gap-2">
          <div class="glass-card glass-hover p-3 flex flex-col gap-1">
            <span class="material-symbols-rounded text-lg text-[#c8705a]">currency_yen</span>
            <p class="font-sans font-bold text-[11px] text-[#3a2020]">Currency</p>
            <p class="font-sans text-[9px] text-[#a08878] leading-snug">Japanese Yen (¥). Use 7-Eleven ATMs. ~¥150 = $1</p>
          </div>
          <div class="glass-card glass-hover p-3 flex flex-col gap-1">
            <span class="material-symbols-rounded text-lg text-[#c8705a]">power</span>
            <p class="font-sans font-bold text-[11px] text-[#3a2020]">Power</p>
            <p class="font-sans text-[9px] text-[#a08878] leading-snug">Type A plugs (same as US 2-prong). Bring converter for 3-prong.</p>
          </div>
          <div class="glass-card glass-hover p-3 flex flex-col gap-1">
            <span class="material-symbols-rounded text-lg text-[#c8705a]">contactless</span>
            <p class="font-sans font-bold text-[11px] text-[#3a2020]">IC Card</p>
            <p class="font-sans text-[9px] text-[#a08878] leading-snug">Get Suica or Pasmo for metro, buses, and konbini payments.</p>
          </div>
          <div class="glass-card glass-hover p-3 flex flex-col gap-1">
            <span class="material-symbols-rounded text-lg text-[#c8705a]">wifi</span>
            <p class="font-sans font-bold text-[11px] text-[#3a2020]">WiFi / SIM</p>
            <p class="font-sans text-[9px] text-[#a08878] leading-snug">Rent pocket WiFi or buy SIM at airport. Station WiFi is spotty.</p>
          </div>
          <div class="glass-card glass-hover p-3 flex flex-col gap-1">
            <span class="material-symbols-rounded text-lg text-[#c8705a]">do_not_disturb_on</span>
            <p class="font-sans font-bold text-[11px] text-[#3a2020]">No Tipping</p>
            <p class="font-sans text-[9px] text-[#a08878] leading-snug">Tipping is not customary and can be seen as rude.</p>
          </div>
          <div class="glass-card glass-hover p-3 flex flex-col gap-1">
            <span class="material-symbols-rounded text-lg text-[#c8705a]">delete</span>
            <p class="font-sans font-bold text-[11px] text-[#3a2020]">Trash</p>
            <p class="font-sans text-[9px] text-[#a08878] leading-snug">No public bins. Carry a small bag for trash until you find one.</p>
          </div>
        </div>
      </section>

      <!-- Useful Phrases -->
      <section>
        <svg viewBox="0 0 40 20" class="w-6 mx-auto opacity-15 mb-2" fill="#c8705a"><rect x="6" y="6" width="2" height="14" rx="1"/><rect x="32" y="6" width="2" height="14" rx="1"/><rect x="3" y="3" width="34" height="3" rx="1.5"/><rect x="8" y="8" width="24" height="2" rx="1"/></svg>
        <h2 class="font-cursive text-[#9b3a3a] text-2xl mb-3 flex items-center gap-2">
          <span class="material-symbols-rounded text-xl">translate</span> Key Phrases
        </h2>
        <div class="glass-card overflow-hidden">
          {#each [
            ['Hello', 'Konnichiwa', 'こんにちは'],
            ['Thank you', 'Arigatō gozaimasu', 'ありがとうございます'],
            ['Excuse me', 'Sumimasen', 'すみません'],
            ['Yes / No', 'Hai / Iie', 'はい / いいえ'],
            ['How much?', 'Ikura desu ka?', 'いくらですか？'],
            ['Where is...?', 'Doko desu ka?', '…はどこですか？'],
            ['Delicious!', 'Oishii!', 'おいしい！'],
            ['Check, please', 'Okaikei onegaishimasu', 'お会計お願いします'],
          ] as [en, romaji, jp], i}
            <div class="flex items-center gap-2 px-3.5 py-2 {i % 2 === 0 ? 'bg-transparent' : 'glass-subtle'}">
              <span class="font-sans font-bold text-[10px] text-[#5a3d38] w-[72px] shrink-0">{en}</span>
              <span class="font-sans text-[10px] text-[#a08878] flex-1">{romaji}</span>
              <span class="font-sans text-[11px] text-[#9b3a3a] shrink-0">{jp}</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- Emergency -->
      <section>
        <svg viewBox="0 0 40 20" class="w-6 mx-auto opacity-15 mb-2" fill="#c8705a"><rect x="6" y="6" width="2" height="14" rx="1"/><rect x="32" y="6" width="2" height="14" rx="1"/><rect x="3" y="3" width="34" height="3" rx="1.5"/><rect x="8" y="8" width="24" height="2" rx="1"/></svg>
        <h2 class="font-cursive text-[#9b3a3a] text-2xl mb-3 flex items-center gap-2">
          <span class="material-symbols-rounded text-xl">emergency</span> Emergency
        </h2>
        <div class="glass-card p-4 flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <span class="material-symbols-rounded text-lg text-[#e84c4c]">local_police</span>
            <div>
              <p class="font-sans font-bold text-xs text-[#3a2020]">Police</p>
              <p class="font-sans text-lg font-bold text-[#e84c4c]">110</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="material-symbols-rounded text-lg text-[#e84c4c]">local_hospital</span>
            <div>
              <p class="font-sans font-bold text-xs text-[#3a2020]">Fire / Ambulance</p>
              <p class="font-sans text-lg font-bold text-[#e84c4c]">119</p>
            </div>
          </div>
          <div class="flex items-center gap-3 pt-1 border-t border-[#f0e0d8]">
            <span class="material-symbols-rounded text-lg text-[#c8705a]">flag</span>
            <div>
              <p class="font-sans font-bold text-xs text-[#3a2020]">US Embassy Tokyo</p>
              <p class="font-sans text-[10px] text-[#a08878]">+81-3-3224-5000</p>
            </div>
          </div>
        </div>
      </section>


    </div>

    <div class="flex items-center justify-between px-6 pb-6">
      <a href="/transport" class="font-sans text-xs font-semibold text-[#c8705a] hover:text-[#a85540]">← Flights &amp; Trains</a>
      <a href="/" class="font-sans text-xs font-semibold text-[#9b3a3a] flex items-center gap-1 hover:text-[#7a2828]">
        <span class="material-symbols-rounded text-base leading-none">home</span> Home
      </a>
      <a href="/overview.html" class="font-sans text-xs font-semibold text-[#c8705a] hover:text-[#a85540]">Overview →</a>
    </div>

  </div>
</main>
