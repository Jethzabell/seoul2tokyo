<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const PASSWORD   = 'ready!';
  const STORAGE_KEY = 'jp26_access';

  let mounted = false;
  let unlocked = false;
  let input = '';
  let error = false;
  let shake = false;

  onMount(() => {
    mounted = true;
    unlocked = localStorage.getItem(STORAGE_KEY) === '1';
  });

  function attempt() {
    if (input.trim().toLowerCase() === PASSWORD) {
      error = false;
      localStorage.setItem(STORAGE_KEY, '1');
      unlocked = true;
    } else {
      error = true;
      input = '';
      shake = true;
      setTimeout(() => (shake = false), 500);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') attempt();
  }

  // Floating petals data (x%, delay, size, duration)
  const petals = [
    [8,  0,   14, 7],
    [18, 1.2, 10, 9],
    [32, 0.4, 12, 8],
    [47, 2.1, 8,  10],
    [61, 0.8, 14, 7.5],
    [74, 1.6, 10, 9],
    [85, 0.2, 12, 8.5],
    [93, 2.8, 8,  11],
    [24, 3.2, 10, 8],
    [55, 1.9, 12, 9.5],
  ];
</script>

{#if !mounted}
  <!-- Wait for hydration -->
  <main class="min-h-screen bg-[#f5ede8]"></main>
{:else if !unlocked}
  <!-- ── Password gate ── -->
  <main class="min-h-screen flex items-center justify-center bg-[#f5ede8] px-4 overflow-hidden relative">

    <!-- Floating cherry petals -->
    {#each petals as [x, delay, size, dur]}
      <div class="petal absolute top-0 pointer-events-none"
           style="left:{x}%; width:{size}px; height:{size}px; animation-delay:{delay}s; animation-duration:{dur}s;">
        <svg viewBox="0 0 20 20" fill="none">
          <ellipse cx="10" cy="10" rx="7" ry="4" fill="#f0b8c8" opacity="0.75" transform="rotate(30 10 10)"/>
        </svg>
      </div>
    {/each}

    <div class="w-[320px] flex flex-col items-center gap-6 text-center relative z-10"
         in:fly={{ y: 24, duration: 600, delay: 100 }}>

      <!-- Illustration -->
      <div class="illustration-breathe">
        <svg viewBox="0 0 180 140" class="w-44 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Sky gradient circle -->
          <circle cx="90" cy="70" r="65" fill="#fde8f0" opacity="0.4"/>
          <!-- Mt Fuji -->
          <polygon points="90,16 44,92 136,92" fill="#e8d0c8" stroke="#c8a098" stroke-width="1.5"/>
          <polygon points="90,16 72,46 108,46" fill="white" opacity="0.75"/>
          <!-- Snow detail -->
          <path d="M72,46 Q90,38 108,46" stroke="#e0c8d0" stroke-width="1" fill="none"/>
          <!-- Base ground -->
          <rect x="30" y="90" width="120" height="8" rx="4" fill="#e8d0c8" opacity="0.5"/>
          <!-- Torii gate -->
          <rect x="66" y="76" width="5" height="30" rx="2.5" fill="#c8705a"/>
          <rect x="109" y="76" width="5" height="30" rx="2.5" fill="#c8705a"/>
          <rect x="60" y="70" width="60" height="7" rx="3.5" fill="#c8705a"/>
          <rect x="62" y="71" width="6" height="4" rx="2" fill="#c8705a" opacity="0.6"/>
          <rect x="112" y="71" width="6" height="4" rx="2" fill="#c8705a" opacity="0.6"/>
          <rect x="68" y="80" width="44" height="4" rx="2" fill="#c8705a"/>
          <!-- Lantern -->
          <rect x="87" y="84" width="6" height="8" rx="2" fill="#f0d060" opacity="0.9"/>
          <rect x="88" y="92" width="4" height="2" rx="1" fill="#c8a040"/>
          <!-- Cherry blossom clusters left -->
          <circle cx="22" cy="38" r="7" fill="#f4c0d0" opacity="0.7"/>
          <circle cx="30" cy="30" r="5" fill="#f8d0dc" opacity="0.6"/>
          <circle cx="14" cy="28" r="4" fill="#f0b8c8" opacity="0.5"/>
          <circle cx="34" cy="42" r="4" fill="#f4c0d0" opacity="0.5"/>
          <!-- Branch left -->
          <path d="M10,50 Q22,35 35,28" stroke="#c8a098" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <!-- Cherry blossom clusters right -->
          <circle cx="158" cy="35" r="7" fill="#f4c0d0" opacity="0.7"/>
          <circle cx="150" cy="26" r="5" fill="#f8d0dc" opacity="0.6"/>
          <circle cx="165" cy="26" r="4" fill="#f0b8c8" opacity="0.5"/>
          <circle cx="148" cy="40" r="4" fill="#f4c0d0" opacity="0.5"/>
          <!-- Branch right -->
          <path d="M170,50 Q158,32 148,26" stroke="#c8a098" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <!-- Stars/dots -->
          <circle cx="50"  cy="22" r="1.5" fill="#c8a098" opacity="0.6"/>
          <circle cx="130" cy="18" r="1.5" fill="#c8a098" opacity="0.6"/>
          <circle cx="160" cy="55" r="1"   fill="#c8a098" opacity="0.5"/>
          <circle cx="20"  cy="60" r="1"   fill="#c8a098" opacity="0.5"/>
          <!-- Moon -->
          <circle cx="148" cy="22" r="10" fill="#fef0d0" opacity="0.5"/>
          <circle cx="152" cy="20" r="9"  fill="#f5ede8" opacity="0.6"/>
        </svg>
      </div>

      <div>
        <h1 class="font-cursive text-[#9b3a3a] text-4xl leading-tight">Japan 2026</h1>
        <p class="font-sans text-[#a07870] text-sm mt-1">Jessy's Japan 2026 trip planner</p>
      </div>

      <div class="w-full flex flex-col gap-3">
        <div class="{shake ? 'shake' : ''}">
          <input
            type="password"
            bind:value={input}
            on:keydown={handleKey}
            placeholder="Enter password to continue"
            autofocus
            class="w-full rounded-2xl border-2 {error ? 'border-[#c8705a]' : 'border-[#e0c8c0]'} bg-white px-4 py-3.5 font-sans text-sm text-[#3a2020] placeholder-[#c0a8a0] focus:outline-none focus:border-[#c8705a] text-center tracking-widest transition-colors"
          />
        </div>

        {#if error}
          <p class="font-sans text-[11px] text-[#c8705a] -mt-1" in:fly={{ y: -6, duration: 200 }}>
            Wrong password — try again 🙈
          </p>
        {/if}

        <button
          on:click={attempt}
          class="w-full bg-[#c8705a] hover:bg-[#a85540] active:scale-95 text-white font-sans font-bold text-sm py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg"
        >
          {mounted ? "Let's go" : 'Loading…'}
        </button>
      </div>

      <p class="font-sans text-[10px] text-[#c8b0a8]">💕 Made with love - Jethzabell, 2026.</p>
    </div>
  </main>

{:else}
  <div in:fade={{ duration: 400 }}>
    <slot />
  </div>
{/if}

<style>
  /* Floating petals */
  .petal {
    animation: floatDown linear infinite;
    opacity: 0;
  }
  @keyframes floatDown {
    0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0; }
    10%  { opacity: 0.8; }
    90%  { opacity: 0.5; }
    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
  }

  /* Breathing illustration */
  .illustration-breathe {
    animation: breathe 4s ease-in-out infinite;
  }
  @keyframes breathe {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-5px); }
  }

  /* Shake on wrong password */
  .shake {
    animation: wiggle 0.4s ease;
  }
  @keyframes wiggle {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    40%     { transform: translateX(8px); }
    60%     { transform: translateX(-6px); }
    80%     { transform: translateX(6px); }
  }
</style>
