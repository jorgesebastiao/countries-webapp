# world-cup-catalog Specification

## Purpose

Static dataset and service exposing all FIFA World Cup editions (year, hosts, champion, participants by ISO alpha-3 code) for consumption by filters and UI.

## Requirements

### Requirement: World Cup editions dataset
The system SHALL ship a static dataset at `src/assets/world-cups.json` containing all 23 FIFA World Cup edition records from 1930 through 2026. Each edition record MUST contain: `year` (number), `hosts` (array of ISO alpha-3 codes), `champion` (ISO alpha-3 code, or `null` if the edition is not yet decided), and `participants` (deduplicated array of ISO alpha-3 codes including hosts and champion). Editions cancelled due to World War II (1942, 1946) MUST NOT appear in the dataset.

#### Scenario: First edition is present
- **WHEN** the dataset is loaded
- **THEN** it contains an edition with `year: 1930`, hosts `["URY"]`, champion `"URY"`, and 13 participants

#### Scenario: Current edition without a champion
- **WHEN** the dataset is loaded and the current edition (2026) has no decided champion
- **THEN** the 2026 record has `hosts: ["USA", "MEX", "CAN"]` and `champion: null`

#### Scenario: Multi-host edition
- **WHEN** the 2002 edition is read
- **THEN** its `hosts` array contains both `"KOR"` and `"JPN"`

### Requirement: Historical participants mapped to modern codes
Participants without their own ISO alpha-3 code SHALL be recorded using the code of their modern or encompassing state: defunct states map to successors (West Germany and East Germany → `DEU`, Soviet Union → `RUS`, Czechoslovakia → `CZE`, Yugoslavia → `SRB`, Zaire → `COD`, Dutch East Indies → `IDN`, Serbia and Montenegro → `SRB`), and the UK home nations (England, Scotland, Wales, Northern Ireland) map to `GBR`. Every participant code MUST resolve to a country in the app's country data. When multiple teams of one edition map to the same code, the `participants` array MUST contain that code once. The dataset MAY record the original team name in an optional `historicalName` field.

#### Scenario: Defunct participant resolves to a modern country
- **WHEN** an edition lists a participant that competed under a defunct state (e.g., West Germany, champion in 1954)
- **THEN** the stored code (`DEU`) matches a country present in the app's country dataset

#### Scenario: Home nation recorded as United Kingdom
- **WHEN** the 1966 edition is read
- **THEN** its host and champion are recorded as `"GBR"` (historically England)

#### Scenario: Collapsed teams are deduplicated
- **WHEN** an edition had multiple teams mapping to the same code (1958: four home nations; 1974: both Germanys; 2026: England and Scotland)
- **THEN** the `participants` array contains that code exactly once

### Requirement: World Cup data service
The system SHALL provide a root-injectable `WorldCupService` that loads the dataset via `HttpClient`, caches it for the session, and exposes the list of editions ordered by year descending (most recent first).

#### Scenario: Editions are loaded and ordered
- **WHEN** a consumer subscribes to the service's editions observable
- **THEN** it receives all editions ordered from the most recent year to 1930

#### Scenario: Dataset is fetched only once per session
- **WHEN** multiple consumers subscribe to the editions observable
- **THEN** the JSON asset is requested over HTTP at most once
