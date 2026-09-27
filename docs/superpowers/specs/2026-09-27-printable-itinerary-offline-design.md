# Printable Itinerary and Offline Access Design

## Objective

Replace the current `/itinerary-table.html` table with a clean, print-first itinerary that preserves all trip information in no more than 10 landscape A4 pages. Make the complete website installable and usable offline after one successful online visit. Add Onitsuka Tiger Lumine Est Shinjuku to the Shinjuku itinerary without removing any existing stop.

## Scope

This work includes:

- A redesigned printable itinerary at the existing `/itinerary-table.html` URL.
- A fixed 10-page landscape A4 print plan covering all six trip steps.
- Adaptive typography based on each day's activity density.
- Full preservation of activities, dates, times, locations, transit guidance, hotel breaks, notes, booking status, reservation details, addresses, and confirmation codes.
- An Onitsuka Tiger Lumine Est Shinjuku stop after Hard Off on October 30.
- Full-site offline caching and installability as a Progressive Web App.
- Offline-state messaging for links that require an internet connection.

The work does not include offline copies of Google Maps, airline sites, booking sites, or other third-party pages.

## Printable Itinerary

### URL and screen behavior

The existing `/itinerary-table.html` URL remains valid. Its current interactive table is replaced with a print-preview page built from the canonical trip payload. The screen view includes:

- A concise trip header.
- A Print / Save PDF button.
- A page-count indicator showing 10 planned pages.
- Ten page previews in print order.
- A short note explaining that external map and website links require internet.

Print-only CSS hides controls and renders the previews as exact A4 landscape sheets.

### Page allocation

The itinerary uses exactly 10 logical pages:

1. Trip overview, outbound flight, arrival essentials, and return-flight summary.
2. Tokyo Shibuya days 1–2.
3. Tokyo Shibuya days 3–4.
4. Tokyo Shibuya days 5–6.
5. Kyoto days 1–2.
6. Kyoto days 3–4.
7. Osaka days 1–2.
8. Osaka day 3 plus Osaka-to-Tokyo transfer details and essential reservation notes.
9. Tokyo Shinjuku days 1–2.
10. Tokyo Shinjuku days 3–4 plus final departure essentials.

No activity may be omitted to satisfy the page target. Information is compacted through layout, grouping, and typography only.

### Daily layout

Each itinerary page uses two equal day columns when two days are present. A day column contains:

- Date and city.
- “Leave hotel by” guidance and travel time to the first stop.
- Chronological activities.
- Start/end time, title, area, and transfer from the previous stop.
- Notes, address, booking status, and reservation information when present.
- Visual treatment for reservations, hotel-rest stops, flexible/TBD plans, and sunset activities.

Sub-stops remain visually nested under their parent activity. Hotel drop-off/rest stops remain visible and use a calm green treatment. Reserved activities use blue, flexible/TBD plans use amber or soft red, and sunset activities use warm sunset tones.

### Adaptive typography

Typography is selected independently for each day column:

- Up to 5 activities: spacious density, approximately 11–12 pt body text.
- 6–7 activities: standard density, approximately 10–11 pt body text.
- 8 or more activities: compact density, approximately 8.5–9.5 pt body text.

The minimum body size is 8.5 pt. If a dense day still overflows, spacing and secondary metadata gaps are reduced before font size. Activity names, times, and reservation markers remain visually prominent. A day must never be split across pages.

### Data source

The page reads `/payload.json`, the same public payload used by the application. It derives city/day groupings and print density classes at runtime. This avoids maintaining a second handwritten itinerary and keeps print output synchronized with the app.

If payload loading fails, the page displays a clear retry message and does not attempt to print incomplete content.

## Onitsuka Tiger Shinjuku Stop

Add a new shopping activity on Tokyo Shinjuku day 3:

- Name: Onitsuka Tiger — Lumine Est Shinjuku.
- Address: Japan, 〒160-0022 Tokyo, Shinjuku City, Shinjuku, 3 Chome−38−1 ルミネエスト新宿 1F.
- Placement: after Hard Off — Shinjuku Marui Men.
- Planned time: 5:25–6:00 PM.
- Transfer from Hard Off: approximately 10 minutes on foot.

Move the existing hotel drop-off/rest stop to 6:15–6:45 PM. Omoide Yokocho remains at 7:00 PM. This preserves all existing activities and leaves a short walk/buffer before dinner.

## Offline and Installable Website

### Architecture

Use SvelteKit's service-worker support with a web app manifest:

- `src/service-worker.js` precaches all generated application pages, static assets, the public payload, and the printable itinerary.
- `static/manifest.webmanifest` defines the app name, theme colors, standalone display mode, start URL, and icons.
- The root HTML links the manifest and declares the theme color.
- A lightweight status component reports online/offline state without blocking navigation.

The service worker uses a versioned cache. New deployments populate a new cache and remove obsolete app caches during activation.

### Caching policy

- Generated site pages, application assets, local images, `/payload.json`, and `/itinerary-table.html`: cache-first after installation.
- Same-origin navigation requests: serve cached content when offline; refresh from the network when available.
- External URLs: never proxy or cache. They open normally online and receive an offline warning when the device has no connection.
- Failed same-origin navigation with no cached response: show an offline fallback page explaining how to reconnect.

One complete online visit after deployment is the supported setup path. The browser may then install the site through “Add to Home Screen,” and the same cached content also works when reopened in a normal browser tab.

### Install experience

The site exposes native browser installability rather than implementing a custom install prompt. Quick Info includes short platform-neutral instructions: open the site online once, choose Add to Home Screen/Install, and verify offline access before departure.

## Error Handling

- The printable page shows a retry state if payload data cannot be loaded.
- Service-worker registration failure leaves the online website fully usable.
- Offline external-link clicks show a concise “Internet required” message and preserve the destination URL for later use.
- Cache upgrades retain the currently active cache until the new service worker activates successfully.

## Verification

### Print verification

- Confirm Chrome/Safari print preview reports exactly 10 landscape A4 pages at 100% scale with browser headers and footers disabled.
- Confirm no day or activity is split across pages.
- Confirm all payload activity IDs appear in the printable document.
- Confirm dense days use compact typography no smaller than 8.5 pt.
- Confirm reservation codes, hotel-rest stops, transport notes, and addresses are present.

### Schedule verification

- Confirm Onitsuka follows Hard Off and precedes the hotel stop.
- Confirm the adjusted Shinjuku day 3 schedule has no overlap and includes sufficient transfer time.
- Confirm no pre-existing activity, card, or place is removed.

### Offline verification

- Build the static site and serve the production output locally.
- Load every route once, switch the browser to offline mode, and confirm all same-origin pages remain available.
- Confirm `/payload.json` and `/itinerary-table.html` load offline.
- Confirm the manifest is valid and the site meets browser installability requirements.
- Confirm external links display the offline warning instead of failing silently.

## Success Criteria

- The print view is readable, complete, and limited to 10 landscape A4 pages.
- All six trip steps and every current activity are represented.
- Onitsuka Tiger appears in the correct Shinjuku sequence.
- The full site works offline after initial caching and can be installed on a phone.
- Existing online behavior remains functional when service-worker registration or caching is unavailable.
