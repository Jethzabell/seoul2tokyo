<script>
  export let icon = 'pin';
  // icon sizes are 40x40 viewBox
</script>

{#if icon === 'pokeball'}
  <!-- Pokéball -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <circle cx="20" cy="20" r="17" fill="white" stroke="#c8705a" stroke-width="2"/>
    <path d="M3 20 H37" stroke="#c8705a" stroke-width="2"/>
    <circle cx="20" cy="20" r="6" fill="white" stroke="#c8705a" stroke-width="2"/>
    <circle cx="20" cy="20" r="3" fill="#c8705a"/>
    <path d="M3 20 A17 17 0 0 1 37 20" fill="#f4c8b0" opacity="0.3"/>
  </svg>

{:else if icon === 'pagoda'}
  <!-- Pagoda / temple -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <!-- Spire -->
    <line x1="20" y1="2" x2="20" y2="9" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Roof 1 (top) -->
    <polygon points="12,9 28,9 26,14 14,14" fill="#e8a090" stroke="#c8705a" stroke-width="1"/>
    <!-- Roof 2 (mid) -->
    <polygon points="9,16 31,16 28,21 12,21" fill="#c8705a" stroke="#c8705a" stroke-width="1"/>
    <!-- Body -->
    <rect x="14" y="21" width="12" height="7" rx="1" fill="#e8a090"/>
    <!-- Base roof -->
    <polygon points="6,28 34,28 30,33 10,33" fill="#c8705a"/>
    <!-- Base -->
    <rect x="12" y="33" width="16" height="4" rx="1" fill="#e8a090"/>
    <!-- Door -->
    <rect x="17" y="25" width="6" height="3" rx="1" fill="#c8705a"/>
  </svg>

{:else if icon === 'food'}
  <!-- Ramen bowl / food -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <!-- Steam lines -->
    <path d="M14 8 Q16 5 14 2" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M20 8 Q22 5 20 2" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M26 8 Q28 5 26 2" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <!-- Bowl -->
    <path d="M6 16 Q6 32 20 34 Q34 32 34 16 Z" fill="#e8a090"/>
    <ellipse cx="20" cy="16" rx="14" ry="4" fill="#c8705a"/>
    <!-- Noodle swirl inside -->
    <ellipse cx="20" cy="22" rx="9" ry="3" fill="white" opacity="0.5"/>
    <!-- Chopsticks -->
    <line x1="16" y1="10" x2="13" y2="22" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="24" y1="10" x2="27" y2="22" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round"/>
  </svg>

{:else if icon === 'tea'}
  <!-- Tea cup -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <!-- Steam -->
    <path d="M15 8 Q17 5 15 2" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M22 8 Q24 5 22 2" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <!-- Cup body -->
    <path d="M8 14 L10 30 Q10 34 20 34 Q30 34 30 30 L32 14 Z" fill="#e8a090"/>
    <!-- Cup rim -->
    <ellipse cx="20" cy="14" rx="12" ry="3" fill="#c8705a"/>
    <!-- Tea surface -->
    <ellipse cx="20" cy="14" rx="9" ry="2" fill="#d4855a" opacity="0.6"/>
    <!-- Handle -->
    <path d="M30 18 Q38 18 38 24 Q38 30 30 30" stroke="#c8705a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Saucer -->
    <ellipse cx="20" cy="35" rx="14" ry="3" fill="#c8705a"/>
  </svg>

{:else if icon === 'nightlife'}
  <!-- Wine glass -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <!-- Glass bowl -->
    <path d="M10 4 H30 L26 20 Q24 28 20 28 Q16 28 14 20 Z" fill="#e8a090"/>
    <!-- Wine level fill -->
    <path d="M12 12 L28 12 L26 20 Q24 28 20 28 Q16 28 14 20 Z" fill="#c8705a" opacity="0.6"/>
    <!-- Stem -->
    <line x1="20" y1="28" x2="20" y2="36" stroke="#c8705a" stroke-width="2" stroke-linecap="round"/>
    <!-- Base -->
    <ellipse cx="20" cy="37" rx="9" ry="2.5" fill="#c8705a"/>
  </svg>

{:else if icon === 'historical'}
  <!-- Binoculars / monument -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <!-- Left lens -->
    <circle cx="13" cy="24" r="9" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <circle cx="13" cy="24" r="5" fill="white" stroke="#c8705a" stroke-width="1"/>
    <!-- Right lens -->
    <circle cx="27" cy="24" r="9" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <circle cx="27" cy="24" r="5" fill="white" stroke="#c8705a" stroke-width="1"/>
    <!-- Bridge -->
    <rect x="18" y="20" width="4" height="4" rx="1" fill="#c8705a"/>
    <!-- Top handles -->
    <rect x="10" y="10" width="6" height="10" rx="2" fill="#c8705a"/>
    <rect x="24" y="10" width="6" height="10" rx="2" fill="#c8705a"/>
  </svg>

{:else if icon === 'shopping'}
  <!-- Shopping bag -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <!-- Bag body -->
    <rect x="6" y="14" width="28" height="22" rx="3" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <!-- Handles -->
    <path d="M14 14 Q14 6 20 6 Q26 6 26 14" stroke="#c8705a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Star / sparkle decoration -->
    <path d="M20 22 L21.5 25 L25 25 L22.3 27.2 L23.3 30.5 L20 28.5 L16.7 30.5 L17.7 27.2 L15 25 L18.5 25 Z" fill="#c8705a" opacity="0.7"/>
  </svg>

{:else if icon === 'kart'}
  <!-- Go-kart / car -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <!-- Body -->
    <rect x="4" y="20" width="32" height="12" rx="4" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <!-- Cabin -->
    <path d="M10 20 L13 12 H27 L30 20 Z" fill="#c8705a"/>
    <!-- Windows -->
    <path d="M15 20 L17 13 H23 L25 20 Z" fill="white" opacity="0.7"/>
    <!-- Wheels -->
    <circle cx="11" cy="32" r="5" fill="#c8705a"/>
    <circle cx="11" cy="32" r="2.5" fill="white"/>
    <circle cx="29" cy="32" r="5" fill="#c8705a"/>
    <circle cx="29" cy="32" r="2.5" fill="white"/>
    <!-- Speed lines -->
    <line x1="0" y1="24" x2="5" y2="24" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="0" y1="27" x2="5" y2="27" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  </svg>

{:else if icon === 'sightseeing'}
  <!-- Camera -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <rect x="4" y="14" width="32" height="22" rx="4" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <rect x="14" y="9" width="12" height="7" rx="2" fill="#c8705a"/>
    <circle cx="20" cy="26" r="8" fill="white" stroke="#c8705a" stroke-width="1.5"/>
    <circle cx="20" cy="26" r="5" fill="#e8a090"/>
    <circle cx="20" cy="26" r="2" fill="#c8705a"/>
    <circle cx="32" cy="19" r="2.5" fill="white" stroke="#c8705a" stroke-width="1"/>
  </svg>

{:else if icon === 'torii'}
  <!-- Torii gate -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <rect x="8" y="6" width="24" height="4" rx="1" fill="#c8705a"/>
    <rect x="6" y="5" width="28" height="2" rx="1" fill="#c8705a"/>
    <rect x="10" y="13" width="20" height="2" rx="0.5" fill="#e8a090"/>
    <rect x="10" y="10" width="3" height="28" rx="1" fill="#c8705a"/>
    <rect x="27" y="10" width="3" height="28" rx="1" fill="#c8705a"/>
  </svg>

{:else if icon === 'mountain'}
  <!-- Mt. Fuji -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <polygon points="20,4 2,36 38,36" fill="#e8a090" stroke="#c8705a" stroke-width="1.5" stroke-linejoin="round"/>
    <polygon points="20,4 14,16 26,16" fill="white" stroke="none"/>
    <circle cx="10" cy="12" r="3" fill="#c8705a" opacity="0.2"/>
    <circle cx="7" cy="14" r="3" fill="#c8705a" opacity="0.15"/>
    <circle cx="13" cy="13" r="2.5" fill="#c8705a" opacity="0.15"/>
  </svg>

{:else if icon === 'bamboo'}
  <!-- Bamboo stalks -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <rect x="10" y="2" width="4" height="36" rx="2" fill="#c8705a"/>
    <rect x="18" y="6" width="4" height="32" rx="2" fill="#e8a090"/>
    <rect x="26" y="4" width="4" height="34" rx="2" fill="#c8705a" opacity="0.7"/>
    <line x1="10" y1="12" x2="14" y2="12" stroke="#e8a090" stroke-width="1.5"/>
    <line x1="10" y1="22" x2="14" y2="22" stroke="#e8a090" stroke-width="1.5"/>
    <line x1="18" y1="16" x2="22" y2="16" stroke="#c8705a" stroke-width="1.5"/>
    <line x1="18" y1="26" x2="22" y2="26" stroke="#c8705a" stroke-width="1.5"/>
    <line x1="26" y1="14" x2="30" y2="14" stroke="#e8a090" stroke-width="1.5"/>
    <line x1="26" y1="24" x2="30" y2="24" stroke="#e8a090" stroke-width="1.5"/>
    <path d="M6 8 Q8 4 10 8" fill="#c8705a" opacity="0.3"/>
    <path d="M14 2 Q16 -2 18 4" fill="#e8a090" opacity="0.3"/>
    <path d="M30 6 Q32 2 34 6" fill="#c8705a" opacity="0.2"/>
  </svg>

{:else if icon === 'castle'}
  <!-- Castle -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <rect x="4" y="28" width="32" height="10" rx="1" fill="#e8a090" stroke="#c8705a" stroke-width="1"/>
    <rect x="8" y="20" width="24" height="10" rx="1" fill="#e8a090" stroke="#c8705a" stroke-width="1"/>
    <polygon points="8,20 20,12 32,20" fill="#c8705a"/>
    <rect x="6" y="4" width="4" height="8" rx="0.5" fill="#c8705a"/>
    <rect x="30" y="4" width="4" height="8" rx="0.5" fill="#c8705a"/>
    <rect x="17" y="30" width="6" height="8" rx="1" fill="#c8705a"/>
    <rect x="12" y="22" width="4" height="4" rx="0.5" fill="white" opacity="0.6"/>
    <rect x="24" y="22" width="4" height="4" rx="0.5" fill="white" opacity="0.6"/>
  </svg>

{:else if icon === 'lantern'}
  <!-- Paper lantern -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <line x1="20" y1="2" x2="20" y2="8" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="15" y="6" width="10" height="3" rx="1" fill="#c8705a"/>
    <ellipse cx="20" cy="22" rx="11" ry="14" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <line x1="12" y1="16" x2="28" y2="16" stroke="#c8705a" stroke-width="0.8" opacity="0.4"/>
    <line x1="11" y1="22" x2="29" y2="22" stroke="#c8705a" stroke-width="0.8" opacity="0.4"/>
    <line x1="12" y1="28" x2="28" y2="28" stroke="#c8705a" stroke-width="0.8" opacity="0.4"/>
    <ellipse cx="20" cy="22" rx="4" ry="6" fill="#c8705a" opacity="0.2"/>
    <rect x="16" y="34" width="8" height="2" rx="0.5" fill="#c8705a"/>
  </svg>

{:else if icon === 'neon'}
  <!-- Neon sign -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <rect x="4" y="6" width="32" height="28" rx="3" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <circle cx="14" cy="16" r="4" stroke="#c8705a" stroke-width="2" fill="none"/>
    <circle cx="26" cy="16" r="4" stroke="#c8705a" stroke-width="2" fill="none"/>
    <path d="M12 26 Q20 32 28 26" stroke="#c8705a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="8" cy="10" r="1.5" fill="#c8705a" opacity="0.5"/>
    <circle cx="32" cy="10" r="1.5" fill="#c8705a" opacity="0.5"/>
    <circle cx="8" cy="30" r="1.5" fill="#c8705a" opacity="0.5"/>
    <circle cx="32" cy="30" r="1.5" fill="#c8705a" opacity="0.5"/>
  </svg>

{:else if icon === 'ghibli'}
  <!-- Totoro silhouette -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <ellipse cx="20" cy="24" rx="14" ry="14" fill="#e8a090"/>
    <path d="M10 12 L12 4 L15 12" fill="#c8705a"/>
    <path d="M25 12 L28 4 L30 12" fill="#c8705a"/>
    <circle cx="15" cy="18" r="3" fill="white" stroke="#c8705a" stroke-width="1"/>
    <circle cx="25" cy="18" r="3" fill="white" stroke="#c8705a" stroke-width="1"/>
    <circle cx="15" cy="18" r="1.5" fill="#c8705a"/>
    <circle cx="25" cy="18" r="1.5" fill="#c8705a"/>
    <ellipse cx="20" cy="26" rx="6" ry="3" fill="#c8705a" opacity="0.3"/>
    <path d="M14 24 Q20 30 26 24" stroke="#c8705a" stroke-width="1.5" fill="none"/>
  </svg>

{:else if icon === 'hotel'}
  <!-- Bed / hotel -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <rect x="4" y="22" width="32" height="8" rx="3" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <rect x="6" y="16" width="10" height="8" rx="2" fill="#c8705a" opacity="0.6"/>
    <rect x="6" y="30" width="2" height="6" rx="1" fill="#c8705a"/>
    <rect x="32" y="30" width="2" height="6" rx="1" fill="#c8705a"/>
    <ellipse cx="11" cy="15" rx="4" ry="3.5" fill="#c8705a" opacity="0.4"/>
    <rect x="4" y="28" width="32" height="2" rx="0.5" fill="#c8705a"/>
  </svg>

{:else if icon === 'transit'}
  <!-- Train -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <rect x="8" y="4" width="24" height="28" rx="6" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <rect x="10" y="8" width="20" height="10" rx="2" fill="white" opacity="0.7"/>
    <line x1="20" y1="8" x2="20" y2="18" stroke="#c8705a" stroke-width="1" opacity="0.4"/>
    <circle cx="14" cy="26" r="2.5" fill="#c8705a"/>
    <circle cx="26" cy="26" r="2.5" fill="#c8705a"/>
    <rect x="12" y="20" width="16" height="2" rx="0.5" fill="#c8705a" opacity="0.3"/>
    <line x1="10" y1="32" x2="6" y2="38" stroke="#c8705a" stroke-width="2" stroke-linecap="round"/>
    <line x1="30" y1="32" x2="34" y2="38" stroke="#c8705a" stroke-width="2" stroke-linecap="round"/>
  </svg>

{:else if icon === 'explore'}
  <!-- Compass -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <circle cx="20" cy="20" r="16" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <circle cx="20" cy="20" r="12" fill="white" stroke="#c8705a" stroke-width="1"/>
    <polygon points="20,8 23,18 20,16 17,18" fill="#c8705a"/>
    <polygon points="20,32 23,22 20,24 17,22" fill="#e8a090" stroke="#c8705a" stroke-width="0.5"/>
    <polygon points="8,20 18,17 16,20 18,23" fill="#e8a090" stroke="#c8705a" stroke-width="0.5"/>
    <polygon points="32,20 22,17 24,20 22,23" fill="#c8705a" opacity="0.6"/>
    <circle cx="20" cy="20" r="2" fill="#c8705a"/>
  </svg>

{:else if icon === 'city'}
  <!-- Cityscape / crossing -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <rect x="4" y="16" width="8" height="22" rx="1" fill="#e8a090" stroke="#c8705a" stroke-width="1"/>
    <rect x="14" y="8" width="8" height="30" rx="1" fill="#c8705a" opacity="0.8"/>
    <rect x="24" y="12" width="12" height="26" rx="1" fill="#e8a090" stroke="#c8705a" stroke-width="1"/>
    <rect x="6" y="20" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
    <rect x="6" y="26" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
    <rect x="16" y="12" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
    <rect x="16" y="18" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
    <rect x="16" y="24" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
    <rect x="27" y="16" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
    <rect x="27" y="22" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
    <rect x="33" y="16" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
    <rect x="33" y="22" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
  </svg>

{:else if icon === 'art'}
  <!-- Art / immersive -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <circle cx="20" cy="20" r="16" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <circle cx="14" cy="14" r="3" fill="#c8705a" opacity="0.5"/>
    <circle cx="26" cy="12" r="2" fill="#c8705a" opacity="0.7"/>
    <circle cx="12" cy="24" r="2.5" fill="#c8705a" opacity="0.4"/>
    <circle cx="28" cy="24" r="3.5" fill="#c8705a" opacity="0.6"/>
    <circle cx="20" cy="28" r="2" fill="#c8705a" opacity="0.3"/>
    <circle cx="20" cy="20" r="4" fill="white" opacity="0.5"/>
    <path d="M16 20 Q20 14 24 20 Q20 26 16 20" fill="#c8705a" opacity="0.3"/>
  </svg>

{:else if icon === 'samurai'}
  <!-- Samurai helmet -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <path d="M20 4 L8 18 L32 18 Z" fill="#c8705a"/>
    <path d="M6 18 Q6 30 20 34 Q34 30 34 18 Z" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <rect x="6" y="18" width="28" height="3" rx="1" fill="#c8705a"/>
    <path d="M4 20 L2 14 L8 18" fill="#c8705a" opacity="0.6"/>
    <path d="M36 20 L38 14 L32 18" fill="#c8705a" opacity="0.6"/>
    <circle cx="15" cy="26" r="2" fill="#c8705a" opacity="0.5"/>
    <circle cx="25" cy="26" r="2" fill="#c8705a" opacity="0.5"/>
    <rect x="14" y="30" width="12" height="2" rx="1" fill="#c8705a" opacity="0.4"/>
  </svg>

{:else}
  <!-- Pin fallback -->
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <path d="M20 4 C13 4 8 10 8 17 C8 26 20 38 20 38 C20 38 32 26 32 17 C32 10 27 4 20 4 Z" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <circle cx="20" cy="17" r="5" fill="white" stroke="#c8705a" stroke-width="1.5"/>
  </svg>
{/if}
