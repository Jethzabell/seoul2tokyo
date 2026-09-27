# Printable Itinerary and Offline Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Onitsuka Tiger Shinjuku stop, replace the existing itinerary table with a complete 10-page A4 print view, and make the full static site installable and available offline.

**Architecture:** Keep `src/lib/payload.json` and `static/payload.json` as the canonical synchronized trip data. Build the standalone print page from `/payload.json` through a small testable ES module and a separate print stylesheet. Add a SvelteKit service worker that precaches all app routes and static files, plus a manifest and a small global offline-status component.

**Tech Stack:** SvelteKit 2, Svelte 4, Vite 5, adapter-static, browser Service Worker/Cache APIs, Web App Manifest, Node's built-in test runner, HTML/CSS print media.

---

## File Structure

- Modify `package.json` — add the Node test command.
- Create `tests/itinerary-data.test.mjs` — protect the Onitsuka sequence and source/public payload parity.
- Create `tests/print-itinerary.test.mjs` — verify 10 pages, full activity coverage, and density selection.
- Create `tests/offline-assets.test.mjs` — verify the manifest, service-worker route list, and offline fallback.
- Modify `src/lib/payload.json` — add Onitsuka and adjust the Shinjuku evening timing.
- Modify `static/payload.json` — mirror the canonical payload exactly.
- Modify `src/lib/activityMeta.js` — add the Onitsuka print/card description.
- Create `static/itinerary-print.js` — transform payload data, construct ten pages, and render the print preview.
- Create `static/itinerary-print.css` — screen preview and exact A4 landscape print rules.
- Replace `static/itinerary-table.html` — production print-page shell.
- Replace `itinerary-table.html` — development print-page shell, byte-identical to the production shell.
- Create `src/service-worker.js` — versioned same-origin precache and runtime cache.
- Create `static/manifest.webmanifest` — install metadata.
- Create `static/app-icon.svg` — install icon with safe maskable padding.
- Use `static/app-icon.svg` directly for install metadata and the app shell icon.
- Create `static/offline.html` — fallback for uncached navigation.
- Modify `src/app.html` — link the manifest and theme metadata.
- Create `src/lib/OfflineStatus.svelte` — online/offline status and external-link warning.
- Modify `src/routes/+layout.svelte` — mount the offline-status component after unlock.
- Modify `src/routes/quick-info/+page.svelte` — add concise install/offline instructions.

---

### Task 1: Establish the Test Harness

**Files:**
- Modify: `package.json`
- Create: `tests/itinerary-data.test.mjs`

- [ ] **Step 1: Add the test script**

Add this entry to `package.json` under `scripts`:

```json
"test": "node --test tests/*.test.mjs"
```

- [ ] **Step 2: Write the failing itinerary-data test**

Create `tests/itinerary-data.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sourcePath = new URL('../src/lib/payload.json', import.meta.url);
const publicPath = new URL('../static/payload.json', import.meta.url);

async function readJson(url) {
  return JSON.parse(await readFile(url, 'utf8'));
}

test('source and public payloads stay identical', async () => {
  const [source, publicPayload] = await Promise.all([readJson(sourcePath), readJson(publicPath)]);
  assert.deepEqual(publicPayload, source);
});

test('Onitsuka follows Hard Off and precedes the hotel rest stop', async () => {
  const payload = await readJson(sourcePath);
  const city = payload.destinations.find((item) => item.id === 'city_tokyo_shinjuku');
  const day = city.activities
    .filter((activity) => activity.day === 3)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
  const ids = day.map((activity) => activity.id);

  assert.ok(ids.indexOf('tokyo_n_hardoff_shinjuku') < ids.indexOf('tokyo_n_onitsuka_shinjuku'));
  assert.ok(ids.indexOf('tokyo_n_onitsuka_shinjuku') < ids.indexOf('tokyo_n_hotel_dropoff_rest_day3'));

  const onitsuka = day.find((activity) => activity.id === 'tokyo_n_onitsuka_shinjuku');
  const hotel = day.find((activity) => activity.id === 'tokyo_n_hotel_dropoff_rest_day3');
  assert.equal(onitsuka.start_time, '5:25 PM');
  assert.equal(onitsuka.end_time, '6:00 PM');
  assert.equal(hotel.start_time, '6:15 PM');
  assert.equal(hotel.end_time, '6:45 PM');
});
```

- [ ] **Step 3: Run the test and verify the new-stop assertion fails**

Run: `npm test`

Expected: the parity test passes and the Onitsuka test fails because `tokyo_n_onitsuka_shinjuku` does not exist.

- [ ] **Step 4: Commit the test harness**

```bash
git add package.json tests/itinerary-data.test.mjs
git commit -m "test: add itinerary data coverage"
```

---

### Task 2: Add Onitsuka and Preserve the Shinjuku Evening

**Files:**
- Modify: `src/lib/payload.json`
- Modify: `static/payload.json`
- Modify: `src/lib/activityMeta.js`
- Test: `tests/itinerary-data.test.mjs`

- [ ] **Step 1: Add the Onitsuka activity to both payload files**

Insert this activity after `tokyo_n_hardoff_shinjuku` in both JSON files:

```json
{
  "id": "tokyo_n_onitsuka_shinjuku",
  "name": "Onitsuka Tiger — Lumine Est Shinjuku",
  "category": "Shopping",
  "type": "Flagship Store",
  "day": 3,
  "date": "2026-10-30",
  "start_time": "5:25 PM",
  "end_time": "6:00 PM",
  "duration": "35 min",
  "duration_minutes": 35,
  "notes": "Onitsuka Tiger at Lumine Est Shinjuku 1F.",
  "location": "Japan, 〒160-0022 Tokyo, Shinjuku City, Shinjuku, 3 Chome−38−1 ルミネエスト新宿 1F",
  "links": {
    "map": "https://maps.google.com/?q=Onitsuka+Tiger+Lumine+Est+Shinjuku"
  },
  "area": "Shinjuku · Lumine Est 1F",
  "priority": "must",
  "booking_status": "planned",
  "icon": "shopping",
  "energy_cost": "low",
  "transport_from_previous": {
    "from": "Hard Off — Shinjuku Marui Men",
    "mode": "walk",
    "duration_minutes": 10
  }
}
```

- [ ] **Step 2: Adjust the hotel-rest card and its inbound transfer**

Change `tokyo_n_hotel_dropoff_rest_day3` in both payloads to:

```json
"start_time": "6:15 PM",
"end_time": "6:45 PM",
"duration": "30 min",
"duration_minutes": 30,
"transport_from_previous": {
  "from": "Onitsuka Tiger — Lumine Est Shinjuku",
  "mode": "walk",
  "duration_minutes": 10
}
```

Keep Omoide Yokocho at 7:00 PM with its existing five-minute walk from the hotel.

- [ ] **Step 3: Add the card description**

Add to `src/lib/activityMeta.js`:

```js
tokyo_n_onitsuka_shinjuku: 'Japanese sneakers and heritage styles at Lumine Est Shinjuku',
```

- [ ] **Step 4: Run the data tests**

Run: `npm test`

Expected: both tests pass.

- [ ] **Step 5: Validate JSON and parity**

Run:

```bash
node -e "JSON.parse(require('fs').readFileSync('src/lib/payload.json')); JSON.parse(require('fs').readFileSync('static/payload.json'))"
cmp -s src/lib/payload.json static/payload.json
```

Expected: both commands exit with status 0.

- [ ] **Step 6: Commit the schedule update**

```bash
git add src/lib/activityMeta.js src/lib/payload.json static/payload.json
git commit -m "feat: add Onitsuka Shinjuku stop"
```

---

### Task 3: Build the Ten-Page Print Model

**Files:**
- Create: `static/itinerary-print.js`
- Create: `tests/print-itinerary.test.mjs`

- [ ] **Step 1: Write failing print-model tests**

Create `tests/print-itinerary.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPrintPages, densityForCount } from '../static/itinerary-print.js';

const payload = JSON.parse(
  await readFile(new URL('../static/payload.json', import.meta.url), 'utf8')
);

test('print model produces exactly ten pages', () => {
  assert.equal(buildPrintPages(payload).length, 10);
});

test('every activity appears exactly once in the day pages', () => {
  const expected = payload.destinations.flatMap((city) => city.activities.map((item) => item.id)).sort();
  const actual = buildPrintPages(payload)
    .flatMap((page) => page.days ?? [])
    .flatMap((day) => day.activities)
    .map((item) => item.id)
    .sort();
  assert.deepEqual(actual, expected);
});

test('density preserves the 8.5pt minimum for packed days', () => {
  assert.deepEqual(densityForCount(5), { className: 'density-spacious', bodyPt: 11.5 });
  assert.deepEqual(densityForCount(7), { className: 'density-standard', bodyPt: 10 });
  assert.deepEqual(densityForCount(10), { className: 'density-compact', bodyPt: 8.5 });
});
```

- [ ] **Step 2: Run the print test and verify it fails**

Run: `npm test`

Expected: failure because `static/itinerary-print.js` does not exist.

- [ ] **Step 3: Implement the pure print model**

Create `static/itinerary-print.js` with these exported model functions before adding browser rendering:

```js
export const PAGE_PLAN = [
  { kind: 'overview' },
  { cityId: 'city_tokyo_shibuya', days: [1, 2] },
  { cityId: 'city_tokyo_shibuya', days: [3, 4] },
  { cityId: 'city_tokyo_shibuya', days: [5, 6] },
  { cityId: 'city_kyoto', days: [1, 2] },
  { cityId: 'city_kyoto', days: [3, 4] },
  { cityId: 'city_osaka', days: [1, 2] },
  { cityId: 'city_osaka', days: [3] },
  { cityId: 'city_tokyo_shinjuku', days: [1, 2] },
  { cityId: 'city_tokyo_shinjuku', days: [3, 4] }
];

export function densityForCount(count) {
  if (count <= 5) return { className: 'density-spacious', bodyPt: 11.5 };
  if (count <= 7) return { className: 'density-standard', bodyPt: 10 };
  return { className: 'density-compact', bodyPt: 8.5 };
}

function timeValue(value = '') {
  const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return hour * 60 + Number(match[2]);
}

function dayModel(city, dayNumber) {
  const activities = city.activities
    .filter((item) => item.day === dayNumber)
    .sort((a, b) => timeValue(a.start_time) - timeValue(b.start_time));
  const summary = city.day_summaries?.[String(dayNumber)] ?? {};
  return {
    cityId: city.id,
    cityName: city.name,
    dayNumber,
    date: activities[0]?.date ?? '',
    leaveHotelBy: summary.leave_hotel_by ?? '',
    leaveHotelFor: summary.leave_hotel_for ?? '',
    density: densityForCount(activities.length),
    activities
  };
}

export function buildPrintPages(payload) {
  return PAGE_PLAN.map((plan, index) => {
    if (plan.kind === 'overview') {
      return {
        number: index + 1,
        kind: 'overview',
        trip: payload.trip,
        transport: payload.transport?.segments ?? []
      };
    }
    const city = payload.destinations.find((item) => item.id === plan.cityId);
    if (!city) throw new Error(`Missing destination: ${plan.cityId}`);
    return {
      number: index + 1,
      kind: 'days',
      cityId: city.id,
      cityName: city.name,
      stay: city.stay,
      days: plan.days.map((day) => dayModel(city, day))
    };
  });
}
```

- [ ] **Step 4: Run the model tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 5: Commit the model**

```bash
git add static/itinerary-print.js tests/print-itinerary.test.mjs
git commit -m "feat: add ten-page print model"
```

---

### Task 4: Replace the Old Table with the Print Preview

**Files:**
- Replace: `static/itinerary-table.html`
- Replace: `itinerary-table.html`
- Create: `static/itinerary-print.css`
- Modify: `static/itinerary-print.js`
- Test: `tests/print-itinerary.test.mjs`

- [ ] **Step 1: Add HTML-escaping and formatting tests**

Extend `tests/print-itinerary.test.mjs`:

```js
import { escapeHtml, formatDate, formatTransfer } from '../static/itinerary-print.js';

test('print helpers escape data and format travel details', () => {
  assert.equal(escapeHtml('<b>&</b>'), '&lt;b&gt;&amp;&lt;/b&gt;');
  assert.match(formatDate('2026-10-24'), /Oct 24/);
  assert.equal(
    formatTransfer({ mode: 'train', duration_minutes: 25 }),
    '25 min train'
  );
});
```

- [ ] **Step 2: Add the helper exports and verify tests pass**

Append to the model section of `static/itinerary-print.js`:

```js
export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  });
}

export function formatTransfer(transfer) {
  if (!transfer || transfer.duration_minutes == null) return '';
  return `${transfer.duration_minutes} min ${transfer.mode ?? 'transfer'}`;
}
```

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 3: Replace both HTML entry files with the same shell**

Use this complete shell for `static/itinerary-table.html` and `itinerary-table.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="theme-color" content="#9b3a3a" />
  <title>Japan 2026 — Printable Itinerary</title>
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="icon" href="/favicon.svg" />
  <link rel="stylesheet" href="/itinerary-print.css" />
</head>
<body>
  <header class="screen-toolbar">
    <div>
      <strong>Japan 2026 · Printable Itinerary</strong>
      <span id="page-count">Preparing 10 pages…</span>
    </div>
    <button id="print-button" type="button">Print / Save PDF</button>
  </header>
  <p class="screen-note">For A4 landscape, use 100% scale and disable browser headers and footers.</p>
  <div id="external-warning" class="external-warning" role="status" hidden>Internet is required to open maps and external websites.</div>
  <main id="print-root" aria-live="polite">
    <div class="loading-card">Loading the itinerary…</div>
  </main>
  <template id="error-template">
    <section class="error-card">
      <h1>Unable to load the itinerary</h1>
      <p>Reconnect and try again. The page will work offline after one successful online load.</p>
      <button type="button" onclick="location.reload()">Retry</button>
    </section>
  </template>
  <script type="module" src="/itinerary-print.js"></script>
</body>
</html>
```

- [ ] **Step 4: Add complete browser rendering to `static/itinerary-print.js`**

Append these complete render functions. They preserve all scalar notes, addresses, transport, booking codes, detail lists, and links while keeping Node imports safe:

```js
function activityClass(activity) {
  const joined = [activity.id, activity.name, activity.type].filter(Boolean).join(' ').toLowerCase();
  return [
    activity.booking_status === 'booked' ? 'reserved' : '',
    /hotel.*(drop|rest|break|stop)/.test(joined) ? 'rest' : '',
    /open evening|flexible|dinner tbd|lunch tbd/.test(joined) ? 'flexible' : '',
    /sunset/.test(joined) ? 'sunset' : '',
    activity.sub_stop ? 'sub-stop' : ''
  ].filter(Boolean).join(' ');
}

function detailLines(activity) {
  const lines = [];
  if (activity.area) lines.push(activity.area);
  if (activity.location) lines.push(activity.location);
  if (activity.transport_from_previous) lines.push(formatTransfer(activity.transport_from_previous));
  if (activity.booking_status) lines.push(`Status: ${activity.booking_status.replaceAll('_', ' ')}`);
  if (activity.reservation_code) lines.push(`Reservation: ${activity.reservation_code}`);
  if (activity.confirmation_code) lines.push(`Confirmation: ${activity.confirmation_code}`);
  if (activity.operator) lines.push(`Operator: ${activity.operator}`);
  if (activity.cancel_by) lines.push(`Cancel by: ${activity.cancel_by}`);
  if (activity.details?.length) lines.push(...activity.details);
  if (activity.exclusions?.length) lines.push(`Not included: ${activity.exclusions.join(' · ')}`);
  return lines.filter(Boolean);
}

function renderActivity(activity) {
  const links = Object.entries(activity.links ?? {})
    .filter(([, href]) => href)
    .map(([label, href]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
    .join(' · ');
  return `<article class="activity ${activityClass(activity)}" data-activity-id="${escapeHtml(activity.id)}">
    <div class="activity-time">${escapeHtml(activity.start_time || 'Open')}${activity.end_time ? `<br>– ${escapeHtml(activity.end_time)}` : ''}</div>
    <div>
      <div class="activity-name">${activity.sub_stop ? '↳ ' : ''}${escapeHtml(activity.name)}</div>
      ${activity.description ? `<div class="activity-notes">${escapeHtml(activity.description)}</div>` : ''}
      ${activity.notes ? `<div class="activity-notes">${escapeHtml(activity.notes)}</div>` : ''}
      ${detailLines(activity).length ? `<div class="activity-meta">${detailLines(activity).map(escapeHtml).join(' · ')}</div>` : ''}
      ${links ? `<div class="activity-links">${links}</div>` : ''}
    </div>
  </article>`;
}

function renderDay(day) {
  const leave = day.leaveHotelBy
    ? `<div class="leave-line">Leave hotel by ${escapeHtml(day.leaveHotelBy)}${day.leaveHotelFor ? ` · for ${escapeHtml(day.leaveHotelFor)}` : ''}</div>`
    : '';
  return `<section class="day-column ${day.density.className}" style="--body-pt:${day.density.bodyPt}pt">
    <header class="day-heading"><strong>${escapeHtml(formatDate(day.date))}</strong>${leave}</header>
    <div>${day.activities.map(renderActivity).join('')}</div>
  </section>`;
}

function renderTransport(segment) {
  const number = segment.number ?? segment.flight_number ?? '';
  const passengers = segment.passengers ?? segment.travelers_names ?? [];
  const legs = (segment.legs ?? []).map((leg) => leg.layover
    ? `${leg.airport} layover · ${leg.duration}`
    : `${leg.from} → ${leg.to} · ${leg.flight} · ${leg.depart}–${leg.arrive}`
  );
  return `<article class="transport-card">
    <div class="transport-route">${escapeHtml(segment.from?.code)} → ${escapeHtml(segment.to?.code)}</div>
    <div><strong>${escapeHtml(segment.carrier)} ${escapeHtml(number)}</strong> · ${escapeHtml(segment.date)} · ${escapeHtml(segment.time_depart)}–${escapeHtml(segment.time_arrive)}</div>
    ${passengers.length ? `<div>${escapeHtml(passengers.join(', '))}</div>` : ''}
    ${legs.length ? `<div>${legs.map(escapeHtml).join(' · ')}</div>` : ''}
    ${segment.notes ? `<div>${escapeHtml(segment.notes)}</div>` : ''}
  </article>`;
}

function renderPage(page) {
  if (page.kind === 'overview') {
    return `<section class="print-page overview-page">
      <header class="page-title"><div><small>JAPAN 2026</small><h1>${escapeHtml(page.trip.title)}</h1></div><span>${escapeHtml(page.trip.dates.display)}</span></header>
      <div class="overview-grid">${page.transport.map(renderTransport).join('')}</div>
      <footer class="page-footer">${page.number} / 10</footer>
    </section>`;
  }
  return `<section class="print-page">
    <header class="page-title"><div><small>JAPAN 2026</small><h1>${escapeHtml(page.cityName)}</h1></div><span>${escapeHtml(page.stay?.hotel_name ?? '')}</span></header>
    <div class="days-grid ${page.days.length === 1 ? 'single-day' : ''}">${page.days.map(renderDay).join('')}</div>
    <footer class="page-footer">${page.number} / 10</footer>
  </section>`;
}

export function renderPrintDocument(pages, root) {
  root.innerHTML = pages.map(renderPage).join('');
  const count = document.getElementById('page-count');
  if (count) count.textContent = `${pages.length} A4 landscape pages`;
}

if (typeof document !== 'undefined') {
  document.getElementById('print-button')?.addEventListener('click', () => window.print());
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || navigator.onLine) return;
    const url = new URL(link.href, location.href);
    if (url.origin === location.origin) return;
    event.preventDefault();
    const warning = document.getElementById('external-warning');
    warning.hidden = false;
    window.setTimeout(() => (warning.hidden = true), 4000);
  });
  fetch('/payload.json')
    .then((response) => {
      if (!response.ok) throw new Error(`Payload request failed: ${response.status}`);
      return response.json();
    })
    .then((payload) => renderPrintDocument(buildPrintPages(payload), document.getElementById('print-root')))
    .catch(() => {
      const root = document.getElementById('print-root');
      root.replaceChildren(document.getElementById('error-template').content.cloneNode(true));
    });
}
```

- [ ] **Step 5: Create the print stylesheet**

Create `static/itinerary-print.css` with the complete screen, page, activity, overview, and print rules below:

```css
* { box-sizing: border-box; }
:root { font-family: Arial, Helvetica, sans-serif; color: #30282c; background: #eee9e3; }
body { margin: 0; }
.screen-toolbar { position: sticky; top: 0; z-index: 5; display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; background: #fff; border-bottom: 1px solid #ddd; }
.screen-toolbar span { margin-left: 10px; color: #786b6d; font-size: 13px; }
.screen-toolbar button, .error-card button { border: 0; border-radius: 999px; padding: 10px 16px; background: #9b3a3a; color: #fff; font-weight: 700; cursor: pointer; }
.screen-note { margin: 12px auto; max-width: 1120px; color: #6f6264; font-size: 13px; }
.external-warning { position: fixed; top: 68px; left: 50%; z-index: 8; translate: -50% 0; padding: 10px 14px; border-radius: 12px; background: #fff3d6; color: #6b4b20; font-size: 12px; font-weight: 700; box-shadow: 0 5px 18px #0002; }
.external-warning[hidden] { display: none; }
#print-root { display: grid; gap: 18px; padding: 0 18px 36px; justify-content: center; }
.print-page { width: 297mm; height: 210mm; padding: 10mm 11mm 9mm; overflow: hidden; background: #fff; box-shadow: 0 5px 22px #0002; break-after: page; page-break-after: always; }
.page-title { display: flex; justify-content: space-between; align-items: end; border-bottom: 2px solid #b95f4c; padding-bottom: 3mm; margin-bottom: 4mm; }
.page-title h1 { margin: 1mm 0 0; font-size: 22pt; }
.page-title small { color: #a44d40; font-weight: 800; letter-spacing: .12em; }
.page-title > span { color: #756b6c; font-size: 9pt; }
.days-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
.days-grid.single-day { grid-template-columns: 1fr; }
.day-column { min-width: 0; font-size: var(--body-pt); }
.day-heading { padding: 2.5mm 3mm; margin-bottom: 3mm; border-radius: 2mm; background: #f5e9e4; }
.leave-line { margin-top: 1mm; color: #765b55; font-size: .82em; }
.activity { display: grid; grid-template-columns: 24mm 1fr; gap: 1.5mm 3mm; padding: 1.8mm 0; border-bottom: .25mm solid #e7e0dc; break-inside: avoid; }
.activity-time { color: #a44d40; font-weight: 800; }
.activity-name { font-weight: 800; }
.activity-meta, .activity-notes { color: #716668; font-size: .88em; line-height: 1.25; }
.activity-links { margin-top: .6mm; font-size: .82em; }
.activity-links a { color: #8f493c; }
.activity.reserved { border-left: 1.5mm solid #8eb4e2; padding-left: 2mm; }
.activity.rest { border-left: 1.5mm solid #8fc09b; padding-left: 2mm; }
.activity.flexible { border-left: 1.5mm solid #ddbd62; padding-left: 2mm; }
.activity.sunset { border-left: 1.5mm solid #dc956b; padding-left: 2mm; }
.activity.sub-stop { margin-left: 4mm; background: #f6f9fc; }
.density-spacious { --body-pt: 11.5pt; }
.density-standard { --body-pt: 10pt; }
.density-compact { --body-pt: 8.5pt; }
.density-compact .activity { padding-block: 1.1mm; }
.overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 6mm; }
.transport-card { padding: 3mm; border: .3mm solid #dfd5d0; border-radius: 2mm; font-size: 8.5pt; line-height: 1.35; break-inside: avoid; }
.transport-route { color: #9b3a3a; font-size: 12pt; font-weight: 800; }
.page-footer { margin-top: 3mm; padding-top: 2mm; border-top: .25mm solid #ddd; text-align: right; font-size: 8pt; color: #766; }
.loading-card, .error-card { margin: 60px auto; max-width: 520px; padding: 30px; border-radius: 16px; background: #fff; text-align: center; }

@page { size: A4 landscape; margin: 0; }
@media print {
  html, body { width: 297mm; background: #fff; }
  .screen-toolbar, .screen-note, .external-warning { display: none !important; }
  #print-root { display: block; padding: 0; }
  .print-page { margin: 0; box-shadow: none; }
  .print-page:last-child { break-after: auto; page-break-after: auto; }
  a { color: inherit; text-decoration: none; }
}
```

- [ ] **Step 6: Add parity and shell assertions to the print test**

Extend `tests/print-itinerary.test.mjs`:

```js
test('development and production print shells stay identical', async () => {
  const [rootHtml, staticHtml] = await Promise.all([
    readFile(new URL('../itinerary-table.html', import.meta.url), 'utf8'),
    readFile(new URL('../static/itinerary-table.html', import.meta.url), 'utf8')
  ]);
  assert.equal(rootHtml, staticHtml);
  assert.match(staticHtml, /itinerary-print\.css/);
  assert.match(staticHtml, /itinerary-print\.js/);
});
```

- [ ] **Step 7: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: tests pass and adapter-static writes the site to `build`.

- [ ] **Step 8: Commit the print page**

```bash
git add itinerary-table.html static/itinerary-table.html static/itinerary-print.css static/itinerary-print.js tests/print-itinerary.test.mjs
git commit -m "feat: add ten-page printable itinerary"
```

---

### Task 5: Add Installable Full-Site Offline Caching

**Files:**
- Create: `src/service-worker.js`
- Create: `static/manifest.webmanifest`
- Create: `static/app-icon.svg`
- Create: `static/offline.html`
- Modify: `src/app.html`
- Create: `tests/offline-assets.test.mjs`

- [ ] **Step 1: Write failing offline-asset tests**

Create `tests/offline-assets.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('manifest defines an installable standalone app', async () => {
  const manifest = JSON.parse(await read('../static/manifest.webmanifest'));
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, '/');
  assert.ok(manifest.icons.some((icon) => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some((icon) => icon.sizes === '512x512' && icon.purpose.includes('maskable')));
});

test('service worker precaches every first-party route', async () => {
  const source = await read('../src/service-worker.js');
  for (const route of ['/', '/departure', '/return', '/quick-info', '/checklist', '/budget', '/admin', '/itinerary-table.html', '/payload.json', '/city/city_tokyo_shibuya', '/city/city_kyoto', '/city/city_osaka', '/city/city_tokyo_shinjuku']) {
    assert.ok(source.includes(`'${route}'`), `missing ${route}`);
  }
  assert.match(source, /offline\.html/);
});

test('app shell links the manifest', async () => {
  assert.match(await read('../src/app.html'), /manifest\.webmanifest/);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test`

Expected: offline tests fail because the manifest and service worker do not exist.

- [ ] **Step 3: Create the manifest and icon**

Create `static/manifest.webmanifest`:

```json
{
  "name": "Japan 2026 Trip",
  "short_name": "Japan 2026",
  "description": "Offline itinerary for the Japan 2026 group trip",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#f5ede8",
  "theme_color": "#9b3a3a",
  "icons": [
    {
      "src": "/app-icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

Create `static/app-icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#f5ede8"/>
  <circle cx="256" cy="250" r="150" fill="#fde8f0"/>
  <path d="M150 170h212v30H150zM176 205h160v24H176zM190 229h28v150h-28zM294 229h28v150h-28zM210 260h92v22h-92z" fill="#9b3a3a"/>
  <circle cx="374" cy="132" r="18" fill="#f4bfd0"/>
  <circle cx="402" cy="160" r="13" fill="#f4bfd0"/>
  <circle cx="365" cy="171" r="12" fill="#f4bfd0"/>
</svg>
```

The SVG is used directly by the manifest and app shell, preserving the artwork at any display size.

- [ ] **Step 4: Add manifest metadata to the app shell**

Add inside `src/app.html` `<head>`:

```html
<link rel="manifest" href="%sveltekit.assets%/manifest.webmanifest" />
<meta name="theme-color" content="#9b3a3a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<link rel="apple-touch-icon" href="%sveltekit.assets%/app-icon.svg" />
```

- [ ] **Step 5: Create the offline fallback**

Create `static/offline.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Japan 2026 · Offline</title>
  <style>
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #f5ede8; color: #3a2d32; font-family: Arial, sans-serif; }
    main { width: min(88vw, 440px); padding: 30px; border-radius: 24px; background: #fff; box-shadow: 0 12px 36px #0001; text-align: center; }
    h1 { color: #9b3a3a; }
    .actions { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
    button { border: 0; border-radius: 999px; padding: 10px 16px; background: #9b3a3a; color: #fff; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <h1>You’re offline</h1>
    <p>Previously loaded trip pages are still available. Maps and external booking websites require internet.</p>
    <div class="actions"><button onclick="history.back()">Go back</button><button onclick="location.reload()">Try again</button></div>
  </main>
</body>
</html>
```

- [ ] **Step 6: Implement the service worker**

Create `src/service-worker.js`:

```js
import { build, files, version } from '$service-worker';

const CACHE = `japan-2026-${version}`;
const APP_ROUTES = [
  '/', '/departure', '/return', '/quick-info', '/checklist', '/budget', '/admin',
  '/itinerary-table.html', '/payload.json', '/offline.html', '/manifest.webmanifest',
  '/city/city_tokyo_shibuya', '/city/city_kyoto', '/city/city_osaka', '/city/city_tokyo_shinjuku'
];
const PRECACHE = [...new Set([...build, ...files, ...APP_ROUTES])];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('japan-2026-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
      event.respondWith(
        caches.open(CACHE).then(async (cache) => {
          const cached = await cache.match(event.request);
          if (cached) return cached;
          const response = await fetch(event.request);
          cache.put(event.request, response.clone());
          return response;
        })
      );
    }
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE);
          return (await cache.match(event.request, { ignoreSearch: true })) ?? cache.match('/offline.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached ?? fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }))
  );
});
```

- [ ] **Step 7: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: tests pass; `build/service-worker.js`, `build/manifest.webmanifest`, and `build/offline.html` exist.

- [ ] **Step 8: Commit PWA infrastructure**

```bash
git add src/app.html src/service-worker.js static/app-icon.svg static/manifest.webmanifest static/offline.html tests/offline-assets.test.mjs
git commit -m "feat: add full-site offline caching"
```

---

### Task 6: Add Offline Status and Install Guidance

**Files:**
- Create: `src/lib/OfflineStatus.svelte`
- Modify: `src/routes/+layout.svelte`
- Modify: `src/routes/quick-info/+page.svelte`

- [ ] **Step 1: Create the offline-status component**

Create `src/lib/OfflineStatus.svelte`:

```svelte
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
```

- [ ] **Step 2: Mount the component in the unlocked app layout**

Import it in `src/routes/+layout.svelte`:

```svelte
import OfflineStatus from '$lib/OfflineStatus.svelte';
```

Render `<OfflineStatus />` once inside the unlocked branch, outside the page content so it is available on every route.

- [ ] **Step 3: Add Quick Info installation instructions**

Add this compact card inside the Quick Info content container in `src/routes/quick-info/+page.svelte`:

```svelte
<section class="glass-card rounded-3xl border border-white/60 p-5 shadow-sm">
  <div class="flex items-start gap-3">
    <span class="material-symbols-rounded text-[#9b3a3a]">download_for_offline</span>
    <div>
      <h2 class="font-sans text-base font-bold text-[#3a2d32]">Save the trip for offline use</h2>
      <ol class="mt-3 list-decimal space-y-2 pl-5 font-sans text-sm text-[#6f5d60]">
        <li>Open the site once while connected to Wi-Fi.</li>
        <li>Use the browser’s Add to Home Screen or Install action.</li>
        <li>Open the installed app once and test it in airplane mode before departure.</li>
      </ol>
      <p class="mt-3 font-sans text-xs font-semibold text-[#9b685f]">Maps and external booking websites still require internet.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Build and manually test online/offline state changes**

Run: `npm run build && npm run preview -- --host 127.0.0.1`

Expected: the site builds, the offline badge appears when DevTools Network is set to Offline, and external links show the warning.

- [ ] **Step 5: Commit the offline UI**

```bash
git add src/lib/OfflineStatus.svelte src/routes/+layout.svelte src/routes/quick-info/+page.svelte
git commit -m "feat: add offline status and install guidance"
```

---

### Task 7: Final Print, Offline, and Regression Verification

**Files:**
- Verify: all modified files
- Update if needed: `static/itinerary-print.css`

- [ ] **Step 1: Run automated verification**

Run:

```bash
npm test
npm run build
git diff --check
cmp -s src/lib/payload.json static/payload.json
```

Expected: every command exits with status 0.

- [ ] **Step 2: Verify all activities are printed**

In the production preview console, run:

```js
Promise.all([
  fetch('/payload.json').then((response) => response.json()),
  Promise.resolve([...document.querySelectorAll('[data-activity-id]')].map((element) => element.dataset.activityId))
]).then(([payload, printed]) => {
  const expected = payload.destinations.flatMap((city) => city.activities.map((activity) => activity.id));
  console.log({ expected: expected.length, printed: printed.length, missing: expected.filter((id) => !printed.includes(id)) });
});
```

Expected: `missing` is empty and the expected/printed counts match.

- [ ] **Step 3: Verify the 10-page print contract**

Open `/itinerary-table.html`, choose Print, select A4 landscape, 100% scale, and disable browser headers/footers.

Expected:

- Exactly 10 pages.
- No activity or day is split across pages.
- No text is clipped.
- Packed days remain at least 8.5 pt.
- Hotel rests, reservations, flexible plans, addresses, and confirmation details remain visible.

If a packed day clips, reduce vertical activity padding in `.density-compact` before changing font size. Do not reduce body text below 8.5 pt.

- [ ] **Step 4: Verify offline navigation**

With the production preview loaded online once:

1. Open every top-level route and each city route.
2. Enable browser offline mode.
3. Reload `/`, `/departure`, `/return`, `/quick-info`, `/checklist`, `/budget`, every city route, and `/itinerary-table.html`.
4. Open an external map link.

Expected: all first-party pages reload; the map click shows the internet-required warning; uncached navigation uses `/offline.html`.

- [ ] **Step 5: Verify install metadata**

Run Lighthouse PWA checks or inspect Application → Manifest and Service Workers.

Expected: the manifest parses, the service worker controls the page, the app icon is present, and the browser offers installation where supported.

- [ ] **Step 6: Review the final diff and commit any verification adjustments**

Run: `git diff --stat && git status --short`

If CSS-only print fitting changes were required:

```bash
git add static/itinerary-print.css
git commit -m "fix: fit printable itinerary to ten pages"
```

- [ ] **Step 7: Push only after explicit user approval**

Show the local print preview and offline behavior first. After the user approves the result, push the completed commits to the authorized repository and branch.
