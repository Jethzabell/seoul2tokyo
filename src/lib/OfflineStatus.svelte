<script>
  import { onMount } from 'svelte';

  let online = true;
  let externalWarning = '';

  onMount(() => {
    const sync = () => (online = navigator.onLine);
    const intercept = (event) => {
      const link = event.target.closest?.('a[href]');
      if (!link || navigator.onLine) return;

      const url = new URL(link.href, location.href);
      if (url.origin === location.origin) return;

      event.preventDefault();
      externalWarning = 'Internet is required to open maps and external websites.';
      window.setTimeout(() => (externalWarning = ''), 4000);
    };

    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    document.addEventListener('click', intercept, true);

    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
      document.removeEventListener('click', intercept, true);
    };
  });
</script>

{#if !online}
  <div class="fixed left-1/2 bottom-4 z-50 -translate-x-1/2 rounded-full bg-[#3a2d32] px-4 py-2 font-sans text-xs font-bold text-white shadow-lg">
    Offline · Saved trip pages are available
  </div>
{/if}

{#if externalWarning}
  <div class="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl bg-[#fff3d6] px-4 py-3 font-sans text-xs font-bold text-[#6b4b20] shadow-lg" role="status">
    {externalWarning}
  </div>
{/if}
