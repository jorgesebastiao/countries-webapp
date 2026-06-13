# Proposal: add-firebase-deploy

## Why

Deploys to Firebase Hosting are manual today (run from a developer machine), so the live demo (https://jorgesebastiao-dev.firebaseapp.com) drifts from `main` — the just-merged World Cup filter is not live. Automating deploy on merge keeps the demo always current and gives reviewers a preview URL per pull request.

## What Changes

- Add a GitHub Actions workflow that, on every push to `main`, installs dependencies, runs the production build, and deploys `dist/countries-webapp/browser` to the live channel of the Firebase Hosting site `jorgesebastiao-dev`.
- Add a GitHub Actions workflow that, on every pull request from this repository, builds and deploys to a temporary Firebase Hosting preview channel and comments the preview URL on the PR.
- Document the one-time manual setup: a Firebase service account stored as the GitHub repository secret used by both workflows.

## Capabilities

### New Capabilities

- `firebase-deployment`: CI/CD pipeline deploying the app to Firebase Hosting — live channel on merge to `main`, preview channels for pull requests.

### Modified Capabilities

<!-- none — existing specs (world-cup-catalog, world-cup-filter) are unaffected -->

## Impact

- **New files**: `.github/workflows/firebase-hosting-merge.yml`, `.github/workflows/firebase-hosting-pull-request.yml`.
- **Repository settings**: new GitHub secret with the Firebase service account JSON (manual, one-time; requires Firebase project owner access).
- **No app code changes**: `firebase.json` (public dir `dist/countries-webapp/browser`, SPA rewrites) and `.firebaserc` (project `jorgesebastiao-dev`) already exist and are used as-is.
- **GitHub Actions usage**: ~2–4 build minutes per push/PR on the free tier.
