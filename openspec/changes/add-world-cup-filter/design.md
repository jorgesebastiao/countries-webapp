# Design: add-world-cup-filter

## Context

The home page (`HomeComponent`) filters the country list client-side via `CountryDataService.filter(name?, region?)`, which operates on an in-memory cache of all countries fetched once by `CountryService`. Country identity throughout the app is the ISO alpha-3 code (`alpha3Code`), also used by routes and border navigation. There is no World Cup information in the REST Countries API, so this feature needs its own dataset.

## Goals / Non-Goals

**Goals:**
- Catalog every FIFA World Cup edition from 1930 to the current edition (2026) in a local static dataset.
- Let users filter the home country list by edition, composing with the existing name/region filters.
- Highlight host and champion countries of the selected edition on the country cards.

**Non-Goals:**
- No match results, squads, scores, or statistics — only participation, hosts, champion.
- No World Cup info on the country detail page (can be a follow-up change).
- No external football API integration; the dataset is curated and shipped with the app.
- No backfill of editions cancelled due to WWII (1942, 1946) — they did not happen and are simply absent.

## Decisions

1. **Static JSON asset (`src/assets/world-cups.json`) instead of an external API.**
   The data is small (23 edition records, 1930–2026; the cancelled 1942/1946 editions don't exist), historical, and changes at most every 4 years. A local asset matches the project's existing offline-fallback philosophy and adds zero runtime dependency. Alternative considered: a football API (e.g., TheSportsDB) — rejected for added failure modes, rate limits, and no benefit for static historical data.

2. **Participants are stored as modern ISO alpha-3 successor codes, deduplicated per edition.**
   Several historical participants no longer exist (West Germany → `DEU`, East Germany → `DEU`, Soviet Union → `RUS`, Czechoslovakia → `CZE`, Yugoslavia → `SRB`, Zaire → `COD`, Dutch East Indies → `IDN`, Serbia and Montenegro → `SRB`). Mapping to successor codes keeps filtering working against REST Countries data with no special cases in code. Trade-off: historical naming accuracy is approximated (documented in the dataset via an optional `historicalName` field on entries, for future UI use). Alternative considered: separate historical-entity entries — rejected as they would never match a country card and would always render as dead filters.

   **UK home nations**: England, Scotland, Wales and Northern Ireland compete separately in FIFA but have no ISO alpha-3 codes — REST Countries only has the United Kingdom (`GBR`). All four map to `GBR`. Consequence: editions where multiple home nations (or both Germanys) played collapse to fewer unique codes than historical teams — 1958 (all four home nations: 16 teams → 13 codes), 1974 (East + West Germany: 16 → 15), 2026 (England + Scotland: 48 → 47). The `participants` array is therefore a deduplicated set of codes, and the 1966 edition records `champion: "GBR"` (host and champion, historically England). Filtering remains correct (the UK card appears for those editions); per-team granularity is knowingly sacrificed.

3. **Dataset shape: one record per edition.**
   ```json
   {
     "year": 2026,
     "hosts": ["USA", "MEX", "CAN"],
     "champion": null,
     "participants": ["ARG", "BRA", ...]
   }
   ```
   `champion` is `null` for the edition still in progress (the 2026 tournament runs June 11 – July 19, 2026 in the USA, Mexico and Canada with 48 teams). Multi-host editions (2002 Korea/Japan, 2026) are arrays from day one.

4. **New root-provided `WorldCupService` loads the asset via HttpClient with `shareReplay(1)`.**
   Going through HttpClient (not a static import) keeps the existing spinner interceptor behavior and lazy-loads the data only when the home page needs it. `shareReplay(1)` caches it for the session.

5. **Filtering extends `CountryDataService.filter(name?, region?, worldCupYear?)`.**
   `CountryDataService` injects `WorldCupService` and intersects the cached country list with the selected edition's participant set (a `Set<string>` of alpha-3 codes for O(1) lookup). All three criteria are conjunctive (AND). Alternative considered: passing the participant set down from `HomeComponent` — rejected; keeping filter knowledge inside the data service matches the existing pattern where the component only forwards raw form values.

6. **Host/champion badges via a new optional input on `CountryCardComponent`.**
   `HomeComponent` derives a role per country (`'host' | 'champion' | 'host-champion' | undefined`) from the selected edition and passes it to the card. The card renders small Material-styled badges over the flag. No badge when no edition is selected. The champion badge takes visual precedence; a country that is both (e.g., Uruguay 1930) shows both labels.

7. **Form integration follows the existing reactive pattern.**
   A `worldCup` control joins the existing `searchForm`; the existing `valueChanges` pipe (debounce + distinct) drives filtering unchanged. The existing clear behavior is extended to also reset the `worldCup` control.

## Risks / Trade-offs

- [Curated dataset may contain errors (participant lists are long: 13–48 teams × 23 editions)] → Source from FIFA's official records during implementation; spec scenarios pin verifiable anchor facts (first edition 1930, hosts, champions) that double as test cases.
- [2026 edition is in progress — champion unknown, data may feel "incomplete"] → `champion: null` is an explicit, supported state; UI shows the edition without a champion badge. Dataset update after the final (July 19, 2026) is a one-line change.
- [Successor-code mapping rewrites history slightly (e.g., 1930 "Yugoslavia" appears as Serbia; 1966 champion "England" appears as United Kingdom)] → Accepted for v1; `historicalName` field preserves the original name in the data for a future tooltip/label.
- [Home-nation collapsing makes some editions show fewer countries than historical teams (1958, 1974, 2026)] → Documented behavior; filtering by country remains correct since the app's unit is the ISO country, not the FIFA member association.
- [Filter select with 23 entries is long] → Acceptable for a Material select with scroll; entries sorted descending (most recent first) so the most relevant editions are on top.

## References

Facts verified online on 2026-06-12: edition list, hosts, champions and team counts ([Wikipedia — FIFA World Cup](https://en.wikipedia.org/wiki/FIFA_World_Cup)); 2026 dates, hosts, 48 qualified teams incl. England and Scotland, debutants Cape Verde/Curaçao/Jordan/Uzbekistan ([Wikipedia — 2026 FIFA World Cup](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup)).
