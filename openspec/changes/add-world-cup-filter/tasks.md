# Tasks: add-world-cup-filter

## 1. World Cup dataset

- [x] 1.1 Create `src/assets/world-cups.json` with all 23 editions 1930–2026 (year, hosts, champion, participants as alpha-3 codes; `champion: null` for 2026), sourcing participants from FIFA's official records
- [x] 1.2 Map teams without own ISO codes and deduplicate per edition: defunct states (West Germany and East Germany→DEU, USSR→RUS, Czechoslovakia→CZE, Yugoslavia→SRB, Zaire→COD, Dutch East Indies→IDN, Serbia and Montenegro→SRB) and UK home nations (England/Scotland/Wales/Northern Ireland→GBR); record `historicalName` for them
- [x] 1.3 Validate every participant/host/champion code against `src/assets/data.json` (no orphan codes — including CUW for Curaçao, 2026 debutant) and verify anchor facts: 1930 = URY host+champion with 13 participants, 1966 = GBR host+champion, 2002 hosts KOR+JPN, 2022 champion ARG, 2026 hosts USA+MEX+CAN with `champion: null`

## 2. World Cup catalog service

- [x] 2.1 Create `WorldCupViewModel` (and edition model) in `src/app/features/home/shared/models/world-cups.model.ts`
- [x] 2.2 Create root-provided `WorldCupService` in `src/app/features/home/shared/world-cup.service.ts` loading the asset via HttpClient with `shareReplay(1)`, exposing editions ordered by year descending

## 3. Filtering

- [x] 3.1 Extend `CountryDataService.filter` with an optional `worldCupYear` parameter that intersects countries with the selected edition's participant `Set` (conjunctive with name and region)
- [x] 3.2 Add the `worldCup` control to `searchForm` in `HomeComponent` and forward its value through the existing `valueChanges` pipeline
- [x] 3.3 Add the "World Cup" Material select to the home filter bar listing editions (label: year + host names), with an empty option, styled per the existing region select
- [x] 3.4 Extend the existing clear-filter behavior to also reset the `worldCup` control

## 4. Host/champion badges

- [x] 4.1 Add an optional `worldCupRole` input (`'host' | 'champion' | 'host-champion'`) to `CountryCardComponent` and render badges over the flag, themed for light and dark modes
- [x] 4.2 Compute each country's role in `HomeComponent` from the selected edition (champion only when not `null`) and pass it to the cards; no role when no edition is selected

## 5. Verification

- [x] 5.1 Run `npm run build` and fix any errors (strict templates)
- [x] 5.2 Manually verify spec scenarios: 1930 → 13 countries with URY double badge; 2022 + region Europe → only European participants; 2026 → three host badges, no champion; clear filters resets the edition
