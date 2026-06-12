# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 18 standalone-components app implementing the Frontend Mentor "REST Countries API with color theme switcher" challenge. Uses Angular Material (Material 3 theming) and is deployed to Firebase Hosting (`dist/countries-webapp/browser`). Reference designs live in `design/` (JPGs) and `style-guide.md` (colors, typography: Nunito Sans).

## Commands

- `npm start` — dev server at http://localhost:4200 (ng serve)
- `npm run build` — production build to `dist/countries-webapp`
- `npm run watch` — development build in watch mode
- `npm test` — unit tests via Karma/Jasmine (no `.spec.ts` files exist yet)
- Run a single test: Karma has no built-in filter flag; use `fdescribe`/`fit` in the spec file
- There is no lint configuration (no ESLint setup)

## Architecture

Fully standalone (no NgModules). Bootstrapped via `src/main.ts` → `app.config.ts`, which registers the router, async animations, and `provideHttpClient` with the `spinnerInterceptor`.

**Path aliases** (tsconfig.json): `@components/*`, `@features/*`, `@shared/*` → corresponding folders under `src/app/`. Barrel files (`index.ts`) re-export components in `components/` and `features/`.

**Data flow** (everything lives under `src/app/features/home/`):

- `shared/country.service.ts` (`CountryService`, root-provided) — wraps the REST Countries v2 API (`https://restcountries.com/v2`). Every call has a fallback chain: on API failure it retries against the local snapshot `src/assets/data.json`, and only errors if both fail. Preserve this fallback pattern when adding endpoints.
- `shared/country-data.service.ts` (`CountryDataService`) — component-scoped (provided in `HomeComponent`, not root). Caches the full country list in memory and exposes a `BehaviorSubject`-backed `countries` observable; `filter(name, region)` filters the cached list client-side and re-emits. Search/region filtering never re-hits the API.
- Routes (`app.routes.ts`): `''` → `HomeComponent`; `country/:countryAlpha3Code` → `CountryDetailComponent`, with the country pre-loaded by `countryDetailResolver` (so the detail component reads `route.data`, it does not fetch).
- Models are in `shared/models/countries.model.ts` (`CountryViewModel` etc., shaped after the v2 API response).

**Cross-cutting UI** (`src/app/components/`): `ToolbarComponent` (theme toggle + home nav) and `SpinnerComponent`. The spinner is driven by `SpinnerService` via the HTTP interceptor — any HttpClient request automatically shows/hides it; never toggle the spinner manually.

**Theming**: `AppComponent.onToggleChange()` swaps `light-theme`/`dark-theme` classes on `<body>`. Both themes are defined in `src/app/shared/styles/material.scss` using Material 3 theme files (`m3-theme-light.scss` / `m3-theme-dark.scss`) plus CSS custom-property overrides matching the style-guide palette. Component styles should consume those CSS variables (e.g. `--mat-app-background-color`, `--mat-app-text-color`) rather than hard-coding colors, so both themes work. Shared SCSS partials live in `src/app/shared/styles/components/`.
