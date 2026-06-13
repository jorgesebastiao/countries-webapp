# Design: add-firebase-deploy

## Context

The repo already contains working Firebase Hosting config: `firebase.json` (public dir `dist/countries-webapp/browser`, SPA rewrite to `index.html`) and `.firebaserc` (default project `jorgesebastiao-dev`). `npm run build` produces a production build by default (Angular `defaultConfiguration: production`). The repo lives on GitHub (`jorgesebastiao/countries-webapp`) with a PR-based flow into `main`, so GitHub Actions is the natural CI home. There is currently no `.github/` directory.

## Goals / Non-Goals

**Goals:**
- Every merge to `main` automatically goes live on `jorgesebastiao-dev.firebaseapp.com`.
- Every same-repo pull request gets an ephemeral preview URL commented on the PR.
- Deploys only happen after a successful production build.

**Non-Goals:**
- No test/lint CI stage (there are no specs or lint config in the repo yet — a future change can extend the workflows).
- No multi-environment promotion (staging/prod) — single Firebase project.
- No change to Firebase config, custom domains, or hosting headers.

## Decisions

1. **Official `FirebaseExtended/action-hosting-deploy` GitHub Action instead of raw `firebase-tools` CLI steps.**
   This is the action `firebase init hosting:github` itself generates: it handles service-account auth, preview-channel creation, PR comments with the preview URL, and channel expiry. A hand-rolled `npx firebase-tools deploy` would re-implement all of that. Alternative considered: Firebase App Hosting / `firebase deploy` from a local machine — rejected; the point is removing the manual step.

2. **Two workflows, mirroring the `firebase init hosting:github` convention.**
   `firebase-hosting-merge.yml` (trigger: `push` to `main` → `channelId: live`) and `firebase-hosting-pull-request.yml` (trigger: `pull_request` → auto preview channel). Keeping them separate makes triggers and permissions independently obvious.

3. **Auth via service-account JSON in a GitHub secret (`FIREBASE_SERVICE_ACCOUNT_JORGESEBASTIAO_DEV`).**
   The action authenticates with `firebaseServiceAccount`; the secret is created once, either by running `firebase init hosting:github` (which provisions the service account and uploads the secret automatically) or manually from a service account key in the Google Cloud console. This is the only manual step and requires project-owner access — it cannot be automated from this repo.

4. **Preview workflow guarded to same-repo PRs.**
   `if: github.event.pull_request.head.repo.full_name == github.repository` — fork PRs don't receive secrets, so the job would fail anyway; the guard makes that explicit and avoids red ✗ on fork PRs. `permissions: checks: write, contents: read, pull-requests: write` lets the action comment the preview URL.

5. **Build steps: Node 20 + `npm ci` + `npm run build`.**
   Angular 18 supports Node ^18.19/^20.11/^22; Node 20 (LTS) matches the dev environment. `npm ci` gives reproducible installs from `package-lock.json`, with npm caching via `actions/setup-node`. The existing bundle-budget warning (initial > 512 kB) does not fail `ng build`, so no budget changes are needed.

## Risks / Trade-offs

- [Secret setup is manual and blocks first deploy] → Task list includes it explicitly as a human step with both options (`firebase init hosting:github` or console); workflows are inert until the secret exists, failing with a clear auth error.
- [Preview channels accumulate] → The action sets a default 7-day expiry on preview channels; they clean themselves up.
- [Deploy without tests could ship a broken app] → Out of scope by decision (no tests exist yet); the production build itself (strict TS + strict templates) is the current quality gate, and a failed build aborts the deploy.
- [Service account key is a long-lived credential in GitHub secrets] → Accepted for a personal project; scoping the account to Firebase Hosting Admin limits blast radius. Workload Identity Federation would be the upgrade path.
