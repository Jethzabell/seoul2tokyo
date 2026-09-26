# Osaka itinerary review and card-density design

## Goal

Make the Osaka itinerary easier to scan on mobile while preserving schedule, duration, area, transport, notes, links, prices, and fallback information.

## Chosen approach

Use compact cards with the primary trip facts always visible:

- activity name and icon
- time range, duration, and area
- price when present
- short note when present
- map/website actions

Long notes and fallback guidance remain available in a native expandable details section instead of being removed. Transport connectors remain between cards and continue to show mode and approximate minutes.

## Schedule corrections

Review the Osaka data for chronological and geographic consistency:

- Keep Day 1 check-in → Umeda dinner → Dotonbori.
- Keep Day 2 Osaka Castle → lunch nearby → Pokémon Center → Kobe Steak → karaoke, correcting connector origins and any duration mismatch.
- Keep Day 3 cooking class → Kuromon Market → Shin-Osaka, correcting connector origins and the train arrival time to match its duration.
- Keep the Ueno vintage-bag stop after Akihabara and before the Shinjuku bar tour.

## Verification

Validate both payload copies remain identical, parse as JSON, pass `git diff --check`, and build the SvelteKit app. Verify the Osaka itinerary locally at `/city/city_osaka?tab=itinerary`.
