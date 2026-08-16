<script>
  import { browser } from '$app/environment';

  export let data;
  const { buy } = data;

  function fmtPrice(p) {
    if (!p || typeof p !== 'object') return null;
    if (p.status === 'tbd' || p.amount == null) return 'TBD';
    if (p.amount === 0) return 'Free';
    const sym = p.currency === 'JPY' ? '¥' : p.currency === 'KRW' ? '₩' : '$';
    const val = `${p.approximate ? '~' : ''}${sym}${p.amount.toLocaleString()}`;
    return p.per_person ? `${val}/pp` : val;
  }

  const priorityOrder = { must: 0, nice_to_have: 1, flex: 2 };
  function sortByPriority(items) {
    return [...items].sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));
  }

  $: sortedBuy = sortByPriority(buy);

  function sectionSpend(items) {
    let usd = 0, jpy = 0;
    for (const i of items) {
      if (i.price?.status === 'confirmed' && i.price.amount > 0) {
        if (i.price.currency === 'JPY') jpy += i.price.amount;
        else usd += i.price.amount;
      }
    }
    return { usd, jpy };
  }

  function fmtSpend(s) {
    const parts = [];
    if (s.usd > 0) parts.push(`$${s.usd.toLocaleString()}`);
    if (s.jpy > 0) parts.push(`¥${s.jpy.toLocaleString()}`);
    return parts.join(' + ') || null;
  }

  let checked = new Set();
  if (browser) {
    try {
      const saved = localStorage.getItem('trip_checklist');
      if (saved) checked = new Set(JSON.parse(saved));
    } catch {}
  }

  let popping = new Set();

  function toggle(id) {
    if (checked.has(id)) {
      checked.delete(id);
    } else {
      checked.add(id);
      // trigger pop animation
      popping = new Set([...popping, id]);
      setTimeout(() => { popping.delete(id); popping = new Set(popping); }, 350);
    }
    checked = new Set(checked);
    if (browser) localStorage.setItem('trip_checklist', JSON.stringify([...checked]));
  }

  function resetAll() {
    checked = new Set();
    if (browser) localStorage.removeItem('trip_checklist');
  }

  const categoryColors = {
    Transport:  { bg: '#e8f2fd', text: '#1a5898', border: '#98c4f0' },
    Experience: { bg: '#fde8f0', text: '#9b284a', border: '#f4a8c4' },
    Hotel:      { bg: '#f0e8fd', text: '#4828a8', border: '#c898f0' },
    Essential:  { bg: '#e8f4ea', text: '#286838', border: '#98d098' },
    Documents:  { bg: '#fef5e4', text: '#8a5a00', border: '#f0c860' },
    Currency:   { bg: '#fef5e4', text: '#8a5a00', border: '#f0c860' },
  };

  const bookingColors = {
    booked:     { bg: '#e8f4ea', text: '#287040', border: '#98d098' },
    not_booked: { bg: '#fdf0e8', text: '#c8705a', border: '#e8c098' },
    waitlist:   { bg: '#f0e8f8', text: '#8060a0', border: '#c098d8' },
    planned:    { bg: '#e8eef8', text: '#4070a8', border: '#98b0d8' },
  };

  function catStyle(cat) {
    return categoryColors[cat] ?? { bg: '#f0ece8', text: '#7a5c56', border: '#e0c8c0' };
  }

  $: buyDone    = sortedBuy.filter(i => checked.has(i.id)).length;
  $: totalItems = sortedBuy.length;
  $: totalDone  = buyDone;
  $: totalSpend = sectionSpend(buy);
</script>

<svelte:head><title>Trip Checklist</title></svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#f5ede8] py-8 px-4">
  <div class="w-[340px] bg-[#faf0eb] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#e8d0c8]">

    <div class="px-6 pt-7 pb-3 text-center">
      <h1 class="font-cursive text-[#9b3a3a] text-4xl leading-tight">Checklist</h1>
      <p class="font-sans text-[#a07870] text-xs mt-1">Tap to check off as you go</p>
    </div>

    <div class="flex flex-col gap-5 px-4 pb-6">

      <!-- Overall summary -->
      <div class="bg-white rounded-2xl border border-[#f0d8d0] p-3.5 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-full bg-[#fde8e0] flex items-center justify-center">
              <span class="font-sans font-bold text-sm text-[#c8705a]">{totalDone}/{totalItems}</span>
            </div>
            <div>
              <p class="font-sans font-bold text-xs text-[#3a2020]">Overall Progress</p>
              <p class="font-sans text-[10px] text-[#a08878]">{fmtSpend(totalSpend) ? `${fmtSpend(totalSpend)} confirmed` : 'No confirmed spend yet'}</p>
            </div>
          </div>
          {#if totalDone > 0}
            <button on:click={resetAll}
              class="font-sans text-[9px] text-[#c8705a] hover:text-[#a85540] underline">Reset</button>
          {/if}
        </div>
        <div class="h-2 bg-[#f0d8d0] rounded-full mt-3 overflow-hidden">
          <div class="h-full bg-gradient-to-r from-[#c8705a] to-[#e88870] rounded-full transition-all duration-500"
            style="width:{totalItems ? (totalDone/totalItems)*100 : 0}%"></div>
        </div>
      </div>

      <!-- Buy & Pack section -->
      {#each [
        { title: 'Buy & Pack', icon: 'shopping_bag', items: sortedBuy, done: buyDone, spend: sectionSpend(buy) },
      ] as section}
        <section>
          <div class="flex items-center justify-between mb-2">
            <h2 class="font-cursive text-[#9b3a3a] text-2xl flex items-center gap-2">
              <span class="material-symbols-rounded text-xl">{section.icon}</span> {section.title}
            </h2>
            <div class="flex items-center gap-2">
              {#if fmtSpend(section.spend)}
                <span class="font-sans text-[9px] font-bold text-[#287040] bg-[#e8f4ea] px-1.5 py-0.5 rounded-full">{fmtSpend(section.spend)}</span>
              {/if}
              <span class="font-sans text-xs text-[#a08878]">{section.done}/{section.items.length}</span>
            </div>
          </div>

          <div class="h-1.5 bg-[#f0d8d0] rounded-full mb-3 overflow-hidden">
            <div class="h-full bg-[#c8705a] rounded-full transition-all duration-300"
              style="width:{section.items.length ? (section.done/section.items.length)*100 : 0}%"></div>
          </div>

          <div class="flex flex-col gap-2">
            {#each section.items as item}
              {@const done = checked.has(item.id)}
              {@const cs = catStyle(item.category)}
              {@const bs = bookingColors[item.booking_status] ?? bookingColors.not_booked}
              {@const isMust = item.priority === 'must'}
              <button
                on:click={() => toggle(item.id)}
                class="w-full text-left rounded-2xl border p-3 flex items-start gap-3 shadow-sm transition-all duration-150
                  {done ? 'opacity-50 bg-[#f8f4f0] border-[#e0d0c8]' : 'bg-white border-[#f0d8d0] hover:border-[#e8b8a8]'}
                  {isMust && !done ? 'border-l-[3px] border-l-[#c8705a]' : ''}"
              >
                <div class="shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  {done ? 'bg-[#c8705a] border-[#c8705a]' : 'border-[#e0c8c0] bg-white'}
                  {popping.has(item.id) ? 'scale-125' : 'scale-100'}">
                  {#if done}
                    <span class="material-symbols-rounded text-white text-xs leading-none">check</span>
                  {/if}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <p class="font-sans font-bold text-sm text-[#3a2020] leading-tight {done ? 'line-through text-[#a08878]' : ''}">
                      {item.label}
                    </p>
                    {#if fmtPrice(item.price)}
                      <span class="shrink-0 font-sans text-[10px] font-bold text-[#287040] bg-[#e8f4ea] border border-[#98d098] px-1.5 py-0.5 rounded-full">
                        {fmtPrice(item.price)}
                      </span>
                    {/if}
                  </div>

                  {#if item.notes}
                    <p class="font-sans text-[10px] text-[#a08878] mt-0.5 leading-snug">{item.notes}</p>
                  {/if}

                  <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span class="font-sans text-[8px] font-semibold px-1.5 py-0.5 rounded-full border"
                      style="background:{cs.bg}; color:{cs.text}; border-color:{cs.border}">
                      {item.category}
                    </span>
                    {#if item.priority}
                      <span class="font-sans text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full
                        {item.priority === 'must' ? 'bg-[#fde8e0] text-[#c8705a] border border-[#e8b8a8]' :
                         item.priority === 'nice_to_have' ? 'bg-[#fef5e4] text-[#8a5a00] border border-[#f0c860]' :
                         'bg-[#f0ece8] text-[#7a5c56] border border-[#e0c8c0]'}">
                        {item.priority === 'nice_to_have' ? 'nice' : item.priority}
                      </span>
                    {/if}
                    {#if item.booking_status}
                      <span class="font-sans text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full border"
                        style="background:{bs.bg}; color:{bs.text}; border-color:{bs.border}">
                        {item.booking_status.replace(/_/g, ' ')}
                      </span>
                    {/if}
                    <div class="flex-1"></div>
                    {#if item.link}
                      <a href={item.link} target="_blank" rel="noopener"
                        on:click|stopPropagation
                        title="Open link" class="text-[#c8705a] hover:text-[#a85540]">
                        <span class="material-symbols-rounded text-base leading-none">open_in_new</span>
                      </a>
                    {/if}
                  </div>
                </div>
              </button>
            {/each}
          </div>
        </section>
      {/each}

    </div>

    <div class="flex items-center justify-between px-6 pb-6">
      <a href="/" class="font-sans text-xs font-semibold text-[#c8705a] hover:text-[#a85540] flex items-center gap-1">
        <span class="material-symbols-rounded text-base leading-none">home</span> Home
      </a>
      <a href="/transport" class="font-sans text-xs font-semibold text-[#c8705a] hover:text-[#a85540]">Flights & Trains →</a>
    </div>

  </div>
</main>
