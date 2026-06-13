# Proposal: add-world-cup-filter

## Why

The app lets users browse countries by name and region, but offers no thematic way to explore them. Cataloging countries by FIFA World Cup participation adds an engaging discovery dimension: users can pick any edition — from the first World Cup (Uruguay 1930) to the current one (2026) — and instantly see which countries took part, who hosted, and who won.

## What Changes

- Add a static World Cup dataset (`src/assets/world-cups.json`) cataloging every FIFA World Cup edition since 1930: year, host country/countries, champion (when decided), and participating countries, all keyed by ISO alpha-3 codes to match the existing country data.
- Add a "World Cup" filter (Material select) to the home page filter bar, alongside the existing name search and region filter, listing every edition from 1930 to the current one.
- When an edition is selected, the country list shows only the countries that participated in that edition; host and champion countries are visually highlighted (badges on the country cards).
- The World Cup filter composes with the existing name search and region filter (all active filters apply together), and is included in the existing clear-filter behavior.

## Capabilities

### New Capabilities

- `world-cup-catalog`: Static dataset and service exposing all FIFA World Cup editions (year, hosts, champion, participants by alpha-3 code) for consumption by filters and UI.
- `world-cup-filter`: Home page filter by World Cup edition, composing with the existing search/region filters, with host and champion highlighting on country cards.

### Modified Capabilities

<!-- none — there are no existing specs in openspec/specs/ yet -->

## Impact

- **New assets**: `src/assets/world-cups.json` (curated static dataset; no external API dependency, consistent with the existing offline-fallback approach).
- **New code**: World Cup service + models under `src/app/features/home/shared/`.
- **Modified code**:
  - `home.component.*` — add the edition select to the reactive filter form.
  - `country-data.service.ts` — extend client-side filtering to also filter by participants of the selected edition.
  - `country-card.component.*` — render host/champion badges.
- **No API changes**: REST Countries API usage is untouched; the dataset is local and loaded via HttpClient (so the existing spinner interceptor applies).
