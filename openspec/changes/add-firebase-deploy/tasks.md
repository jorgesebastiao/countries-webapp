# Tasks: add-firebase-deploy

## 1. Workflows

- [ ] 1.1 Create `.github/workflows/firebase-hosting-merge.yml`: trigger `push` on `main`; checkout, Node 20 with npm cache, `npm ci`, `npm run build`, deploy via `FirebaseExtended/action-hosting-deploy` with `channelId: live`, `projectId: jorgesebastiao-dev`, service-account secret
- [ ] 1.2 Create `.github/workflows/firebase-hosting-pull-request.yml`: trigger `pull_request` guarded to same-repo PRs; same build steps; deploy to auto preview channel with `permissions` for PR comments

## 2. Credentials (manual, one-time)

- [ ] 2.1 Create the Firebase service account and add it as GitHub secret `FIREBASE_SERVICE_ACCOUNT_JORGESEBASTIAO_DEV` — either run `firebase init hosting:github` (provisions and uploads automatically) or create a Hosting-Admin service account key in the Google Cloud console and add it via repo Settings → Secrets (requires project owner; cannot be done by CI)

## 3. Verification

- [ ] 3.1 Validate both workflow files parse as YAML and reference the correct project (`jorgesebastiao-dev`), build command, and secret name
- [ ] 3.2 Open the PR for this change and confirm the preview workflow runs (deploys if the secret exists; skips/fails with clear auth error if not yet configured)
- [ ] 3.3 After merge to `main`, confirm the live deploy workflow succeeds and https://jorgesebastiao-dev.firebaseapp.com serves the World Cup filter
