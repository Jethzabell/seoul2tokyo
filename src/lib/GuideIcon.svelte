<script>
  export let icon = 'pin';
</script>

{#if icon === 'lantern'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <line x1="20" y1="2" x2="20" y2="7" stroke="#c8705a" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="20" cy="8" rx="6" ry="2" fill="#e8a090"/>
    <rect x="12" y="8" width="16" height="22" rx="6" fill="#f4c0a0"/>
    <rect x="12" y="14" width="16" height="2" rx="1" fill="#e8a090"/>
    <rect x="12" y="22" width="16" height="2" rx="1" fill="#e8a090"/>
    <ellipse cx="20" cy="30" rx="6" ry="2" fill="#e8a090"/>
    <line x1="20" y1="32" x2="20" y2="37" stroke="#c8705a" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="20" cy="19" rx="4" ry="5" fill="#ffd0a0" opacity="0.6"/>
  </svg>

{:else if icon === 'fuji'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <polygon points="4,36 36,36 30,18 10,18" fill="#c8dce8"/>
    <polygon points="10,18 30,18 26,10 14,10" fill="#d8e8f0"/>
    <polygon points="16,10 24,10 22,6 18,6" fill="white" opacity="0.95"/>
    <rect x="17" y="26" width="6" height="10" rx="1" fill="#c8705a"/>
    <rect x="13" y="24" width="14" height="3" rx="1" fill="#c8705a"/>
    <rect x="11" y="30" width="18" height="2.5" rx="1" fill="#b85a48"/>
  </svg>

{:else if icon === 'pokeball'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <circle cx="20" cy="20" r="17" fill="white" stroke="#c8705a" stroke-width="2"/>
    <path d="M3 20 H37" stroke="#c8705a" stroke-width="2"/>
    <circle cx="20" cy="20" r="6" fill="white" stroke="#c8705a" stroke-width="2"/>
    <circle cx="20" cy="20" r="3" fill="#c8705a"/>
    <path d="M3 20 A17 17 0 0 1 37 20" fill="#f4c8b0" opacity="0.3"/>
  </svg>

{:else if icon === 'tea'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <path d="M15 8 Q17 5 15 2" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M22 8 Q24 5 22 2" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M8 14 L10 30 Q10 34 20 34 Q30 34 30 30 L32 14 Z" fill="#e8a090"/>
    <ellipse cx="20" cy="14" rx="12" ry="3" fill="#c8705a"/>
    <ellipse cx="20" cy="14" rx="9" ry="2" fill="#d4855a" opacity="0.6"/>
    <path d="M30 18 Q38 18 38 24 Q38 30 30 30" stroke="#c8705a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="20" cy="35" rx="14" ry="3" fill="#c8705a"/>
  </svg>

{:else if icon === 'katana'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <path d="M8 34 L32 6" stroke="#c8d8e8" stroke-width="3" stroke-linecap="round"/>
    <path d="M9 33 L31 7" stroke="white" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
    <rect x="6" y="30" width="8" height="5" rx="1" transform="rotate(-45 10 32.5)" fill="#c8705a"/>
    <rect x="4" y="34" width="5" height="3" rx="1" transform="rotate(-45 6.5 35.5)" fill="#a85a40"/>
    <circle cx="30" cy="8" r="2" fill="#e8d080" opacity="0.8"/>
  </svg>

{:else if icon === 'ramen'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <path d="M14 8 Q16 5 14 2" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M20 8 Q22 5 20 2" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M26 8 Q28 5 26 2" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M6 16 Q6 32 20 34 Q34 32 34 16 Z" fill="#e8a090"/>
    <ellipse cx="20" cy="16" rx="14" ry="4" fill="#c8705a"/>
    <ellipse cx="20" cy="22" rx="9" ry="3" fill="white" opacity="0.5"/>
    <line x1="16" y1="10" x2="13" y2="22" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="24" y1="10" x2="27" y2="22" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round"/>
  </svg>

{:else if icon === 'steak'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <ellipse cx="20" cy="26" rx="16" ry="10" fill="#e8a090"/>
    <ellipse cx="20" cy="24" rx="12" ry="7" fill="#c87050"/>
    <ellipse cx="18" cy="22" rx="5" ry="3" fill="#e09070" opacity="0.6"/>
    <line x1="28" y1="6" x2="28" y2="18" stroke="#c8705a" stroke-width="2" stroke-linecap="round"/>
    <path d="M25 6 Q25 12 28 14" stroke="#c8705a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M31 6 Q31 12 28 14" stroke="#c8705a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <line x1="12" y1="6" x2="12" y2="18" stroke="#c8705a" stroke-width="2" stroke-linecap="round"/>
  </svg>

{:else if icon === 'history'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <circle cx="13" cy="24" r="9" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <circle cx="13" cy="24" r="5" fill="white" stroke="#c8705a" stroke-width="1"/>
    <circle cx="27" cy="24" r="9" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <circle cx="27" cy="24" r="5" fill="white" stroke="#c8705a" stroke-width="1"/>
    <rect x="18" y="20" width="4" height="4" rx="1" fill="#c8705a"/>
    <rect x="10" y="10" width="6" height="10" rx="2" fill="#c8705a"/>
    <rect x="24" y="10" width="6" height="10" rx="2" fill="#c8705a"/>
  </svg>

{:else if icon === 'hanbok'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <circle cx="20" cy="7" r="5" fill="#e8a090"/>
    <path d="M12 14 Q14 12 20 12 Q26 12 28 14 L32 38 H8 Z" fill="#f4b8b0"/>
    <path d="M8 38 Q14 28 20 26 Q26 28 32 38" fill="#e8a090"/>
    <path d="M12 14 L8 22" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M28 14 L32 22" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M16 12 Q18 16 20 14 Q22 16 24 12" stroke="#c8705a" stroke-width="1" fill="none"/>
  </svg>

{:else if icon === 'torii'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <rect x="4" y="10" width="32" height="4" rx="2" fill="#c8705a"/>
    <rect x="6" y="14" width="28" height="3" rx="1.5" fill="#e8a090"/>
    <rect x="10" y="17" width="4" height="20" rx="2" fill="#c8705a"/>
    <rect x="26" y="17" width="4" height="20" rx="2" fill="#c8705a"/>
    <rect x="8"  y="6"  width="6" height="4"  rx="1" transform="rotate(-8 11 8)"  fill="#c8705a"/>
    <rect x="26" y="6"  width="6" height="4"  rx="1" transform="rotate(8 29 8)"   fill="#c8705a"/>
    <line x1="12" y1="17" x2="28" y2="17" stroke="#b85a48" stroke-width="1" stroke-dasharray="2 2" opacity="0.6"/>
  </svg>

{:else if icon === 'crossing'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <!-- Zebra crossing stripes -->
    <rect x="4"  y="26" width="32" height="4" rx="1" fill="#e8d0c8"/>
    <rect x="4"  y="32" width="32" height="4" rx="1" fill="#e8d0c8"/>
    <!-- Traffic light post -->
    <rect x="28" y="8" width="3" height="20" rx="1.5" fill="#c8705a"/>
    <rect x="25" y="7" width="9" height="14" rx="2" fill="#c8705a"/>
    <circle cx="29.5" cy="10.5" r="2" fill="#e84c4c"/>
    <circle cx="29.5" cy="15.5" r="2" fill="#e8c84c"/>
    <circle cx="29.5" cy="20.5" r="2" fill="#4ce870"/>
    <!-- Walking figure -->
    <circle cx="14" cy="10" r="3" fill="#c8705a"/>
    <path d="M14 13 L12 22 L16 22" stroke="#c8705a" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M13 18 L11 24" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M15 18 L17 24" stroke="#c8705a" stroke-width="1.5" stroke-linecap="round"/>
  </svg>

{:else if icon === 'bamboo'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <!-- Left stalk -->
    <rect x="12" y="4" width="6" height="33" rx="3" fill="#70b878"/>
    <line x1="12" y1="15" x2="18" y2="15" stroke="#5a9a60" stroke-width="1.5"/>
    <line x1="12" y1="25" x2="18" y2="25" stroke="#5a9a60" stroke-width="1.5"/>
    <!-- Right stalk -->
    <rect x="22" y="8" width="6" height="30" rx="3" fill="#88c890"/>
    <line x1="22" y1="18" x2="28" y2="18" stroke="#5a9a60" stroke-width="1.5"/>
    <line x1="22" y1="28" x2="28" y2="28" stroke="#5a9a60" stroke-width="1.5"/>
    <!-- Leaves -->
    <path d="M18 12 Q24 8 28 6" stroke="#5a9a60" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M14 22 Q8 18 6 14" stroke="#70b878" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M28 22 Q34 18 36 14" stroke="#70b878" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>

{:else if icon === 'castle'}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <!-- Pagoda tower -->
    <polygon points="20,4 6,16 34,16" fill="#c8705a"/>
    <polygon points="20,10 9,20 31,20" fill="#e8a090"/>
    <polygon points="20,16 12,24 28,24" fill="#c8705a"/>
    <rect x="15" y="24" width="10" height="14" rx="1" fill="#e8a090"/>
    <rect x="17" y="28" width="6" height="10" rx="1" fill="#c8705a"/>
    <!-- Decorative tip -->
    <line x1="20" y1="2" x2="20" y2="6" stroke="#c8705a" stroke-width="2" stroke-linecap="round"/>
    <circle cx="20" cy="2" r="1.5" fill="#e8d080"/>
    <!-- Roof upturns -->
    <path d="M6 16 Q4 14 2 15" stroke="#b85a48" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M34 16 Q36 14 38 15" stroke="#b85a48" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  </svg>

{:else}
  <svg viewBox="0 0 40 40" fill="none" class="w-full h-full">
    <path d="M20 4 C13 4 8 10 8 17 C8 26 20 38 20 38 C20 38 32 26 32 17 C32 10 27 4 20 4 Z" fill="#e8a090" stroke="#c8705a" stroke-width="1.5"/>
    <circle cx="20" cy="17" r="5" fill="white" stroke="#c8705a" stroke-width="1.5"/>
  </svg>
{/if}
