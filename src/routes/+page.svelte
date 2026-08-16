<script>
  export let data;
  const { trip, cities, stats } = data;
  const drives = trip.shared_drives?.receipts || [];
  const photosUrl = trip.shared_drives?.photos;

  const daysUntil = Math.ceil((new Date(trip.dates.start) - new Date()) / 86400000);

  const cityColors = {
    'Tokyo (Shibuya)': '#2a5cb8',
    'Kyoto': '#286840',
    'Osaka': '#c87020',
    'Tokyo (Shinjuku)': '#6830a8',
  };
</script>

<svelte:head>
  <title>Japan 2026</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#f5ede8] p-4">
  <div class="relative w-[380px] phone-frame flex flex-col items-center">

    <!-- Floating cherry blossom petals -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      {#each Array(10) as _, i}
        {@const size = 14 + (i % 3) * 5}
        {@const fill = ['#f4b8b0','#e8a8b8','#f0c0b8','#eaafb8'][i % 4]}
        <svg
          class="absolute petal-drift"
          style="width:{size}px; height:{size}px; left:{5 + i * 10}%; top:-8%; opacity:0; animation-delay:{i * 1.6}s; animation-duration:{9 + i * 1.5}s;"
          viewBox="0 0 24 24" fill="none"
        >
          <path d="M12,22 C7,17 1,12 3,6 C4,2 8,0 11,3 L12,5.5 L13,3 C16,0 20,2 21,6 C23,12 17,17 12,22Z" fill={fill}/>
          <path d="M12,22 C9,17 5,12 6,8 C7,5 9,3.5 11,3 L12,5.5" fill="white" opacity="0.15"/>
        </svg>
      {/each}
    </div>

    <!-- Soft blurred shapes behind content -->
    <div class="absolute top-20 left-0 w-32 h-16 bg-[#f0d0c8] rounded-full opacity-20 blur-xl -translate-x-8"></div>
    <div class="absolute top-32 right-0 w-28 h-14 bg-[#e0c8d8] rounded-full opacity-20 blur-xl translate-x-6"></div>
    <div class="absolute bottom-40 left-0 w-24 h-12 bg-[#d8c8e0] rounded-full opacity-15 blur-xl -translate-x-4"></div>

    <!-- ===== HEADER ===== -->
    <div class="relative z-10 text-center pt-10 pb-2 px-6 w-full">
      {#if daysUntil > 0}
        <div class="inline-flex items-center gap-1.5 glass rounded-full px-3.5 py-1.5 mb-4 shadow-sm">
          <span class="text-[11px] font-bold text-[#c8705a] tabular-nums">{daysUntil}</span>
          <span class="text-[10px] text-[#9b7a70] font-medium">days to go</span>
        </div>
      {/if}

      <!-- Cherry blossom branches flanking the title -->
      <div class="relative inline-block">
        <svg class="absolute -left-10 -top-2 w-8 h-8 opacity-40" viewBox="0 0 32 32" fill="none">
          <path d="M28,28 Q18,20 12,8" stroke="#c8a098" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <circle cx="12" cy="8" r="3" fill="#f4c0d0" opacity="0.8"/>
          <circle cx="16" cy="14" r="2.5" fill="#f8d0dc" opacity="0.7"/>
          <circle cx="9" cy="12" r="2" fill="#f0b8c8" opacity="0.6"/>
        </svg>
        <svg class="absolute -right-10 -top-2 w-8 h-8 opacity-40" viewBox="0 0 32 32" fill="none">
          <path d="M4,28 Q14,20 20,8" stroke="#c8a098" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <circle cx="20" cy="8" r="3" fill="#f4c0d0" opacity="0.8"/>
          <circle cx="16" cy="14" r="2.5" fill="#f8d0dc" opacity="0.7"/>
          <circle cx="23" cy="12" r="2" fill="#f0b8c8" opacity="0.6"/>
        </svg>
        <h1 class="font-cursive text-[#9b3a3a] text-5xl tracking-tight leading-none">
          Japan 2026
        </h1>
      </div>

      <p class="font-sans text-[#7a5c56] text-sm mt-3 font-medium tracking-wide">
        {trip.dates.display}
      </p>

      <div class="flex items-center justify-center gap-1 mt-3">
        {#each trip.route as city, i}
          <span class="text-[10px] font-semibold text-[#9b3a3a] glass rounded-full px-2 py-0.5">{city.replace('Tokyo (Shibuya)','Tokyo').replace('Tokyo (Shinjuku)','Tokyo')}</span>
          {#if i < trip.route.length - 1}
            <span class="text-[#d0a89a] text-[8px]">→</span>
          {/if}
        {/each}
      </div>
    </div>

    <!-- ===== ILLUSTRATION ===== -->
    <div class="relative z-10 w-full px-4 mt-2 flex justify-center">
      <svg viewBox="0 0 300 180" class="w-full max-w-[260px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="150" cy="160" rx="145" ry="30" fill="#f0dbd4" opacity="0.4"/>
        <polygon points="55,170 245,170 225,100 75,100" fill="#c8dce8" opacity="0.85"/>
        <polygon points="85,100 215,100 195,65 105,65" fill="#d8e8f0"/>
        <polygon points="115,65 185,65 170,38 130,38 122,42" fill="white" opacity="0.95"/>
        <polygon points="130,38 122,42 137,45 150,40 163,45 178,42 170,38" fill="#e8f4f8"/>
        <circle cx="68" cy="98" r="18" fill="#f4c8c0" opacity="0.6"/>
        <circle cx="55" cy="104" r="12" fill="#f4c8c0" opacity="0.5"/>
        <circle cx="63" cy="88" r="7" fill="#f8d0c8" opacity="0.8"/>
        <circle cx="75" cy="90" r="6" fill="#f4c0b8" opacity="0.8"/>
        <circle cx="232" cy="102" r="16" fill="#f4c8c0" opacity="0.5"/>
        <circle cx="245" cy="108" r="11" fill="#f4c8c0" opacity="0.45"/>
        <circle cx="238" cy="92" r="7" fill="#f8d0c8" opacity="0.7"/>
        <rect x="158" y="120" width="7" height="48" rx="2" fill="#c8705a"/>
        <rect x="188" y="120" width="7" height="48" rx="2" fill="#c8705a"/>
        <rect x="150" y="113" width="53" height="8" rx="3" fill="#c8705a"/>
        <rect x="148" y="111" width="9" height="4.5" rx="2" fill="#b85a48"/>
        <rect x="196" y="111" width="9" height="4.5" rx="2" fill="#b85a48"/>
        <rect x="155" y="127" width="43" height="5" rx="2" fill="#c8705a"/>
        <path d="M 55 70 Q 100 20 192 50" stroke="#c87878" stroke-width="1.5" stroke-dasharray="5 4" fill="none" opacity="0.6"/>
        <ellipse cx="197" cy="47" rx="12" ry="5" fill="white" stroke="#c0a0a0" stroke-width="0.8"/>
        <path d="M 209 47 Q 214 45.5 212 49 Q 214 50 209 49 Z" fill="white" stroke="#c0a0a0" stroke-width="0.6"/>
        <path d="M 186 47 L 182 38 L 190 44 Z" fill="white" stroke="#c0a0a0" stroke-width="0.6"/>
        <path d="M 195 45.5 L 189 35 L 207 44 Z" fill="white" stroke="#c0a0a0" stroke-width="0.6"/>
      </svg>
    </div>

    <!-- ===== STATS BAR ===== -->
    <div class="relative z-10 w-full px-5 mt-2">
      <div class="glass-strong rounded-2xl px-4 py-3 flex justify-between shadow-md">
        {#each [
          [stats.days, 'days'],
          [stats.cities, 'cities'],
          [stats.activities, 'activities'],
          [stats.foodSpots, 'food spots']
        ] as [val, label]}
          <div class="text-center">
            <div class="text-lg font-bold text-[#9b3a3a] tabular-nums leading-tight">{val}</div>
            <div class="text-[8px] text-[#a0887e] font-bold uppercase tracking-wider">{label}</div>
          </div>
        {/each}
      </div>
    </div>

    <!-- ===== CTA ===== -->
    <div class="relative z-10 w-full px-5 mt-5">
      <a
        href="/departure"
        class="w-full page-gradient hover:opacity-90 active:scale-[0.97] text-white font-sans font-bold text-base py-3.5 rounded-full shadow-lg transition-all duration-150 flex items-center justify-center gap-2"
      >
        Start Our Journey
        <span class="text-lg">→</span>
      </a>
    </div>

    <!-- ===== CITY GRID ===== -->
    <div class="relative z-10 w-full px-5 mt-4">
      <div class="grid grid-cols-2 gap-2">
        {#each cities as { id, city }}
          {@const accent = cityColors[city] ?? '#c8705a'}
          <a
            href="/city/{id}"
            class="glass-card glass-hover flex items-center gap-2.5 px-3 py-2.5 group"
          >
            <span class="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-sm transition-all"
                  style="background:{accent}">
              {city.charAt(0)}
            </span>
            <span class="font-sans text-xs font-semibold text-[#5a3d38] group-hover:text-[#9b3a3a] transition-colors leading-tight">{city}</span>
          </a>
        {/each}
      </div>
    </div>

    <!-- ===== SECTION NAV ===== -->
    <div class="relative z-10 w-full px-5 mt-4">
      <div class="grid grid-cols-2 gap-2">
        {#each [
          ['/transport','flight','Transport','Flights & trains'],
          ['/quick-info','info','Quick Info','Essentials & links'],
          ['/checklist','checklist','Checklist','Bookings & tasks'],
          ['/budget','payments','Budget','Confirmed spend']
        ] as [href, icon, label, subtitle]}
          <a
            {href}
            class="glass-card glass-hover flex items-center gap-2.5 px-3 py-2.5 group"
          >
            <div class="w-8 h-8 rounded-xl bg-[#fde8e0] flex items-center justify-center shrink-0 group-hover:bg-[#c8705a] transition-colors">
              <span class="material-symbols-rounded text-base text-[#c8705a] group-hover:text-white transition-colors">{icon}</span>
            </div>
            <div class="min-w-0">
              <div class="font-sans text-xs font-bold text-[#5a3d38] group-hover:text-[#9b3a3a] transition-colors">{label}</div>
              <div class="text-[9px] text-[#b09a90] leading-tight truncate">{subtitle}</div>
            </div>
          </a>
        {/each}
      </div>
    </div>

    <!-- ===== THE CREW ===== -->
    <div class="relative z-10 w-full px-5 mt-5 mb-3">
      <div class="glass-card p-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[11px] font-bold text-[#9b7a70] uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-rounded text-sm">group</span> The Crew
          </span>
          {#if photosUrl}
            <a href={photosUrl} target="_blank" rel="noopener" class="flex items-center gap-1 text-[10px] font-semibold text-[#c8705a] hover:text-[#9b3a3a] transition-colors">
              <span class="material-symbols-rounded text-sm">photo_library</span>Photos
            </a>
          {/if}
        </div>
        <div class="flex flex-wrap gap-1.5">
          {#each drives as { name, url }}
            <a
              href={url}
              target="_blank"
              rel="noopener"
              class="flex items-center gap-1.5 glass rounded-full pl-1.5 pr-2.5 py-1 glass-hover group"
            >
              <span class="w-5 h-5 rounded-full bg-gradient-to-br from-[#c8705a] to-[#e88870] flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                {name.charAt(0)}
              </span>
              <span class="text-[10px] font-semibold text-[#5a3d38] group-hover:text-[#9b3a3a] transition-colors">{name}</span>
            </a>
          {/each}
        </div>
        <a
          href="https://drive.google.com/drive/folders/102bJN23mQhKn8xe-yuzMMme_goQynfE6?usp=sharing"
          target="_blank"
          rel="noopener"
          class="flex items-center justify-center gap-1 mt-3 text-[10px] font-semibold text-[#b09a90] hover:text-[#9b3a3a] transition-colors"
        >
          <span class="material-symbols-rounded text-sm">folder_shared</span>
          Shared Receipts Folder
        </a>
      </div>
    </div>

    <!-- ===== FOOTER ===== -->
    <div class="relative z-10 w-full text-center pb-8 pt-1">
      <svg viewBox="0 0 40 20" class="w-6 mx-auto mb-2 opacity-15" fill="#c8705a">
        <rect x="6" y="6" width="2" height="14" rx="1"/>
        <rect x="32" y="6" width="2" height="14" rx="1"/>
        <rect x="3" y="3" width="34" height="3" rx="1.5"/>
        <rect x="8" y="8" width="24" height="2" rx="1"/>
      </svg>
      <p class="font-sans text-[9px] text-[#c0a89a] leading-relaxed">
        {trip.metadata.footer_quote}
      </p>
    </div>

  </div>
</main>
