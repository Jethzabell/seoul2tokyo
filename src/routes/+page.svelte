<script>
  export let data;
  const { trip, cities, stats } = data;
  const drives = trip.shared_drives?.receipts || [];
  const photosUrl = trip.shared_drives?.photos;

  const daysUntil = Math.ceil((new Date(trip.dates.start) - new Date()) / 86400000);
</script>

<svelte:head>
  <title>Japan 2026</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#f5ede8] p-4">
  <div class="relative w-[380px] bg-[#faf0eb] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col items-center border border-[#e8d0c8]">

    <!-- Animated floating petals -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      {#each Array(10) as _, i}
        {@const size = 16 + (i % 3) * 6}
        {@const fill = ['#f4b8b0','#e8a8b8','#f0c0b8','#eaafb8'][i % 4]}
        {@const initRot = [15, -25, 40, -10, 55, -35, 20, -45, 30, -20][i]}
        <svg
          class="absolute petal"
          style="
            width: {size}px;
            height: {size}px;
            left: {5 + i * 10}%;
            top: {-8 - (i % 4) * 6}%;
            opacity: {0.35 + (i % 3) * 0.1};
            animation-delay: {i * 1.6}s;
            animation-duration: {9 + i * 1.5}s;
            --init-rot: {initRot}deg;
          "
          viewBox="0 0 24 24" fill="none"
        >
          <!-- Sakura petal: two rounded lobes with V-notch at top, tapers to a point at bottom -->
          <path d="M12,22 C7,17 1,12 3,6 C4,2 8,0 11,3 L12,5.5 L13,3 C16,0 20,2 21,6 C23,12 17,17 12,22Z" fill={fill}/>
          <path d="M12,22 C9,17 5,12 6,8 C7,5 9,3.5 11,3 L12,5.5" fill="white" opacity="0.15"/>
        </svg>
      {/each}
    </div>

    <!-- Soft cloud blobs -->
    <div class="absolute top-16 left-0 w-28 h-14 bg-[#f0d8d0] rounded-full opacity-30 blur-md -translate-x-6"></div>
    <div class="absolute top-24 right-0 w-24 h-12 bg-[#f0d8d0] rounded-full opacity-25 blur-md translate-x-4"></div>

    <!-- ========== HEADER ========== -->
    <div class="relative z-10 text-center pt-10 pb-2 px-6 w-full">
      <!-- Countdown pill -->
      {#if daysUntil > 0}
        <div class="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-[#f0d0c8] rounded-full px-3 py-1 mb-4 shadow-sm">
          <span class="text-[11px] font-bold text-[#c8705a] tabular-nums">{daysUntil}</span>
          <span class="text-[10px] text-[#9b7a70] font-medium">days to go</span>
        </div>
      {/if}

      <h1 class="font-cursive text-[#9b3a3a] text-5xl tracking-tight leading-none">
        Japan 2026
      </h1>

      <p class="font-sans text-[#7a5c56] text-sm mt-3 font-medium tracking-wide">
        {trip.dates.display}
      </p>

      <!-- Route pills -->
      <div class="flex items-center justify-center gap-1 mt-3">
        {#each trip.route as city, i}
          <span class="text-[10px] font-semibold text-[#9b3a3a] bg-white/60 border border-[#f0d0c8] rounded-full px-2 py-0.5">{city.replace('Tokyo (Shibuya)','Tokyo').replace('Tokyo (Shinjuku)','Tokyo')}</span>
          {#if i < trip.route.length - 1}
            <span class="text-[#d0a89a] text-[8px]">→</span>
          {/if}
        {/each}
      </div>
    </div>

    <!-- ========== ILLUSTRATION ========== -->
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

    <!-- ========== STATS BAR ========== -->
    <div class="relative z-10 w-full px-5 mt-2">
      <div class="flex justify-between bg-white/50 backdrop-blur-sm border border-[#f0d0c8] rounded-2xl px-4 py-2.5">
        {#each [
          [stats.days, 'days'],
          [stats.cities, 'cities'],
          [stats.activities, 'activities'],
          [stats.foodSpots, 'food spots']
        ] as [val, label]}
          <div class="text-center">
            <div class="text-base font-bold text-[#9b3a3a] tabular-nums leading-tight">{val}</div>
            <div class="text-[9px] text-[#a0887e] font-medium uppercase tracking-wider">{label}</div>
          </div>
        {/each}
      </div>
    </div>

    <!-- ========== CTA ========== -->
    <div class="relative z-10 w-full px-5 mt-5">
      <a
        href="/departure"
        class="w-full bg-[#c8705a] hover:bg-[#b85a48] active:scale-[0.97] text-white font-sans font-bold text-base py-3.5 rounded-full shadow-lg transition-all duration-150 flex items-center justify-center gap-2"
      >
        Start Our Journey
        <span class="text-lg">→</span>
      </a>
    </div>

    <!-- ========== CITY GRID ========== -->
    <div class="relative z-10 w-full px-5 mt-4">
      <div class="grid grid-cols-2 gap-2">
        {#each cities as { id, city }}
          <a
            href="/city/{id}"
            class="flex items-center gap-2 bg-white/60 hover:bg-white border border-[#f0d0c8] hover:border-[#d8a898] rounded-xl px-3 py-2.5 transition-all group"
          >
            <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-[#fde8e0] text-[#c8705a] group-hover:bg-[#c8705a] group-hover:text-white transition-colors font-bold">
              {city.charAt(0)}
            </span>
            <span class="font-sans text-xs font-semibold text-[#7a5c56] group-hover:text-[#9b3a3a] transition-colors leading-tight">{city}</span>
          </a>
        {/each}
      </div>
    </div>

    <!-- ========== SECTION NAV ========== -->
    <div class="relative z-10 w-full px-5 mt-4">
      <div class="grid grid-cols-2 gap-2">
        {#each [
          ['/transport','flight','Transport','Flights & trains'],
          ['/quick-info','qr_code_2','Quick Info','Essentials & links'],
          ['/checklist','checklist','Checklist','Bookings & tasks'],
          ['/budget','payments','Budget','Confirmed spend & costs']
        ] as [href, icon, label, subtitle]}
          <a
            {href}
            class="flex items-center gap-2.5 bg-white/40 hover:bg-white/70 border border-[#ecdcd6] hover:border-[#d8a898] rounded-xl px-3 py-2.5 transition-all group"
          >
            <span class="material-symbols-rounded text-lg text-[#c8705a] group-hover:scale-110 transition-transform">{icon}</span>
            <div class="min-w-0">
              <div class="font-sans text-xs font-semibold text-[#7a5c56] group-hover:text-[#9b3a3a] transition-colors">{label}</div>
              <div class="text-[9px] text-[#b09a90] leading-tight truncate">{subtitle}</div>
            </div>
          </a>
        {/each}
      </div>
    </div>

    <!-- ========== GROUP / SHARED DRIVES ========== -->
    <div class="relative z-10 w-full px-5 mt-5 mb-3">
      <div class="bg-white/40 border border-[#ecdcd6] rounded-2xl p-3.5">
        <div class="flex items-center justify-between mb-2.5">
          <span class="text-[11px] font-bold text-[#9b7a70] uppercase tracking-wider">The Crew</span>
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
              class="flex items-center gap-1 bg-white/70 hover:bg-white border border-[#f0d0c8] hover:border-[#d8a898] rounded-full pl-1.5 pr-2.5 py-1 transition-all group"
            >
              <span class="w-5 h-5 rounded-full bg-[#fde8e0] flex items-center justify-center text-[9px] font-bold text-[#c8705a] group-hover:bg-[#c8705a] group-hover:text-white transition-colors">
                {name.charAt(0)}
              </span>
              <span class="text-[10px] font-semibold text-[#7a5c56] group-hover:text-[#9b3a3a] transition-colors">{name}</span>
            </a>
          {/each}
        </div>
        <a
          href="https://drive.google.com/drive/folders/102bJN23mQhKn8xe-yuzMMme_goQynfE6?usp=sharing"
          target="_blank"
          rel="noopener"
          class="flex items-center justify-center gap-1 mt-2.5 text-[10px] font-semibold text-[#b09a90] hover:text-[#9b3a3a] transition-colors"
        >
          <span class="material-symbols-rounded text-sm">folder_shared</span>
          Shared Receipts Folder
        </a>
      </div>
    </div>

    <!-- ========== FOOTER ========== -->
    <div class="relative z-10 w-full text-center pb-8 pt-1">
      <p class="font-sans text-[9px] text-[#c0a89a] leading-relaxed">
        {trip.metadata.footer_quote}
      </p>
    </div>

  </div>
</main>

<style>
  @keyframes petal-fall {
    0% {
      transform: translateY(0) rotate(var(--init-rot, 0deg)) translateX(0) scale(1);
      opacity: 0;
    }
    6% { opacity: 0.5; }
    20% { transform: translateY(160px) rotate(calc(var(--init-rot, 0deg) + 80deg)) translateX(-18px) scale(0.95); }
    40% { transform: translateY(330px) rotate(calc(var(--init-rot, 0deg) + 170deg)) translateX(22px) scale(0.9); }
    60% { transform: translateY(500px) rotate(calc(var(--init-rot, 0deg) + 260deg)) translateX(-12px) scale(0.85); }
    80% { transform: translateY(670px) rotate(calc(var(--init-rot, 0deg) + 320deg)) translateX(15px) scale(0.8); }
    93% { opacity: 0.25; }
    100% {
      transform: translateY(850px) rotate(calc(var(--init-rot, 0deg) + 400deg)) translateX(5px) scale(0.75);
      opacity: 0;
    }
  }
  .petal {
    animation: petal-fall 12s ease-in-out infinite;
  }
</style>
