<script>
  import GuideIcon from '$lib/GuideIcon.svelte';

  export let data;
  const { cities } = data;

  const cityAccents = {
    Tokyo:           { band: '#78aae8', bg: '#eef2ff', text: '#1a4898' },
    'Tokyo (Shibuya)': { band: '#a870e8', bg: '#f5eeff', text: '#4828a8' },
    'Tokyo (Shinjuku)': { band: '#78aae8', bg: '#eef2ff', text: '#1a4898' },
    Kyoto:           { band: '#70b878', bg: '#eef5ee', text: '#286838' },
    Osaka:           { band: '#f09ab8', bg: '#fff0f5', text: '#9b284a' },
    Seoul:           { band: '#f0b870', bg: '#fff8ee', text: '#8a5a00' },
  };
</script>

<svelte:head>
  <title>City Guides</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#f5ede8] py-8 px-4">
  <div class="w-[340px] bg-[#faf0eb] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#e8d0c8]">

    <!-- Header -->
    <div class="px-6 pt-7 pb-4 text-center">
      <h1 class="font-cursive text-[#9b3a3a] text-4xl leading-tight">City Guides</h1>
      <p class="font-sans text-[#a07870] text-xs mt-1">Illustrated highlights at a glance</p>
    </div>

    <div class="flex flex-col gap-5 px-4 pb-6">
      {#each cities as cityData}
        {@const accent = cityAccents[cityData.city] ?? cityAccents.Tokyo}
        <section>

          <!-- City section header -->
          <div class="flex items-center gap-2 mb-3">
            <div class="h-0.5 flex-1 rounded-full" style="background:{accent.band}"></div>
            <h2 class="font-cursive text-2xl" style="color:{accent.text}">{cityData.city}</h2>
            <div class="h-0.5 flex-1 rounded-full" style="background:{accent.band}"></div>
          </div>

          <!-- 2-col highlight grid -->
          <div class="grid grid-cols-2 gap-3">
            {#each cityData.highlights as item}
              <div class="rounded-2xl border shadow-sm flex flex-col gap-2 p-3 overflow-hidden" style="background:{accent.bg}; border-color:{accent.band}40">

                <!-- Icon -->
                <div class="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 shadow-sm" style="background:white; border: 1.5px solid {accent.band}50">
                  <GuideIcon icon={item.icon} />
                </div>

                <!-- Text -->
                <div>
                  <p class="font-sans font-bold text-xs text-[#3a2020] leading-tight">{item.title}</p>
                  <p class="font-sans text-[10px] text-[#9a7070] mt-0.5 leading-snug">{item.blurb}</p>
                </div>

              </div>
            {/each}
          </div>

        </section>
      {/each}
    </div>

    <!-- Nav footer -->
    <div class="flex items-center justify-between px-6 pb-6">
      <a href="/quick-info" class="font-sans text-xs font-semibold text-[#c8705a] hover:text-[#a85540]">← Quick Info</a>
      <a href="/" class="font-sans text-xs font-semibold text-[#9b3a3a] flex items-center gap-1 hover:text-[#7a2828]">
        <span class="material-symbols-rounded text-base leading-none">home</span> Home
      </a>
    </div>

  </div>
</main>
