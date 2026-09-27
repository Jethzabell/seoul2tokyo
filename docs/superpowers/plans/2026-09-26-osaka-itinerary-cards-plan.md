# Osaka Itinerary Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make city itinerary cards compact and expandable while correcting Osaka’s schedule, route origins, and travel durations.

**Architecture:** Keep the existing single city-page component and JSON payload model. Update the card markup in `src/routes/city/[id]/+page.svelte` to show essential facts first and place long notes/fallbacks in a native `<details>` block. Keep `src/lib/payload.json` and `static/payload.json` identical so local and built data remain synchronized.

**Tech Stack:** SvelteKit, Svelte markup, Tailwind utility classes already used by the city route, JSON payload data, npm build.

---

### Task 1: Correct Osaka schedule and route metadata

**Files:**
- Modify: `src/lib/payload.json` Osaka activities and `static/payload.json` matching entries.

- [ ] **Step 1: Fix Day 2 sequence metadata**

Keep the order Osaka Castle → Lunch After Osaka Castle → Pokémon Center Osaka → Kobe Steak Ishida → Karaoke Night. Set the following values:

```json
{
  "id": "osaka_pokemon",
  "start_time": "2:00 PM",
  "end_time": "3:00 PM",
  "transport_from_previous": { "from": "Lunch After Osaka Castle", "mode": "train", "duration_minutes": 10 }
}
```

```json
{
  "id": "osaka_kobe",
  "start_time": "8:00 PM",
  "end_time": "10:00 PM",
  "duration": "2 hours",
  "duration_minutes": 120,
  "transport_from_previous": { "from": "Pokémon Center Osaka", "mode": "train", "duration_minutes": 20 }
}
```

```json
{
  "id": "osaka_karaoke",
  "start_time": "10:30 PM",
  "end_time": "12:30 AM",
  "duration": "2 hours",
  "duration_minutes": 120,
  "transport_from_previous": { "from": "Kobe Steak Ishida — LINKS UMEDA", "mode": "train", "duration_minutes": 20 }
}
```

- [ ] **Step 2: Fix Day 3 sequence metadata**

Keep Cooking Class → Kuromon Market → Shinkansen. Update origins and the train’s end time:

```json
{
  "id": "osaka_kuromon",
  "transport_from_previous": { "from": "Ramen and Gyoza Cooking Class", "mode": "train", "duration_minutes": 15 }
}
```

```json
{
  "id": "osaka_train_tokyo",
  "start_time": "5:00 PM",
  "end_time": "7:30 PM",
  "duration": "2.5 hours",
  "duration_minutes": 150,
  "transport_from_previous": { "from": "Kuromon Market", "mode": "train", "duration_minutes": 15 }
}
```

- [ ] **Step 3: Validate both payload copies**

Run:

```bash
cmp -s src/lib/payload.json static/payload.json
node -e "JSON.parse(require('fs').readFileSync('src/lib/payload.json')); JSON.parse(require('fs').readFileSync('static/payload.json'))"
git diff --check
```

Expected: all commands exit successfully.

### Task 2: Compact the activity cards without losing information

**Files:**
- Modify: `src/routes/city/[id]/+page.svelte` activity-card markup around the `<!-- Activity card -->` block.

- [ ] **Step 1: Keep the primary summary always visible**

Preserve the current card’s icon, name, price, time range, duration, area, and footer links. Reduce visual density by using a smaller icon (`w-8 h-8`, `p-1.5`), tighter card padding (`p-2.5`), and a single compact metadata row.

- [ ] **Step 2: Make long secondary content expandable**

Replace the always-visible notes/fallback section with:

```svelte
{#if activity.notes || activity.fallback}
  <details class="group">
    <summary class="list-none cursor-pointer font-sans text-[9px] text-[#a08878] leading-snug flex items-center gap-1">
      <span class="material-symbols-rounded text-[12px] transition-transform group-open:rotate-90">chevron_right</span>
      <span>{activity.notes ? 'Details' : 'Alternatives'}</span>
    </summary>
    <div class="mt-1.5 flex flex-col gap-0.5 pl-4">
      {#if activity.notes}
        <p class="font-sans text-[9px] text-[#a08878] leading-snug italic">{activity.notes}</p>
      {/if}
      {#if activity.fallback?.if_rain}
        <p class="font-sans text-[8px] text-[#4070a8] leading-snug flex items-start gap-1"><span class="material-symbols-rounded text-[10px] shrink-0 mt-px">water_drop</span><span>{activity.fallback.if_rain}</span></p>
      {/if}
      {#if activity.fallback?.if_tired}
        <p class="font-sans text-[8px] text-[#8a6a00] leading-snug flex items-start gap-1"><span class="material-symbols-rounded text-[10px] shrink-0 mt-px">hotel</span><span>{activity.fallback.if_tired}</span></p>
      {/if}
    </div>
  </details>
{/if}
```

- [ ] **Step 3: Preserve transport connectors**

Leave the existing connector rendering in place and keep the connector visible between cards whenever `duration_minutes > 0`, so the compact view still communicates distance and mode.

### Task 3: Verify locally and document the result

**Files:**
- Test: generated build output and local route `/city/city_osaka?tab=itinerary`.

- [ ] **Step 1: Run the build checks**

Run:

```bash
cmp -s src/lib/payload.json static/payload.json
git diff --check
npm run build
```

Expected: build succeeds; only known pre-existing warnings may appear.

- [ ] **Step 2: Verify the Osaka itinerary in the running local app**

Open `http://127.0.0.1:5176/city/city_osaka?tab=itinerary` and confirm:

- Day 1 is check-in → dinner → Dotonbori.
- Day 2 is Osaka Castle → lunch → Pokémon → steak → karaoke, with no overlapping times.
- Day 3 is cooking class → Kuromon → Shinkansen, with the 7:30 PM arrival.
- Long notes and fallback guidance are accessible from each card’s Details/Alternatives row.
- Map/Web links and transport connectors remain available.

- [ ] **Step 3: Review the final diff**

Run `git diff --stat` and `git status --short`; confirm only the intended Svelte component and the two synchronized payload files changed after the already-committed design/spec documents.
