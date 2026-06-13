# Spec: firebase-deployment

## ADDED Requirements

### Requirement: Automatic production deploy on main
The system SHALL provide a GitHub Actions workflow that, on every push to `main`, installs dependencies with `npm ci`, runs the production build, and deploys the build output to the live channel of the Firebase Hosting project `jorgesebastiao-dev`.

#### Scenario: Merge to main goes live
- **WHEN** a pull request is merged into `main`
- **THEN** the workflow builds the app and deploys it, and the new version is served at the Firebase Hosting URL

#### Scenario: Failed build aborts deploy
- **WHEN** the production build fails on a push to `main`
- **THEN** the workflow fails before the deploy step and the live site keeps serving the previous version

### Requirement: Preview deploy for pull requests
The system SHALL provide a GitHub Actions workflow that, for every pull request originating from the same repository, builds the app and deploys it to an ephemeral Firebase Hosting preview channel, posting the preview URL as a comment on the pull request. Pull requests from forks MUST NOT trigger a deploy.

#### Scenario: PR gets a preview URL
- **WHEN** a pull request is opened or updated from a branch of this repository
- **THEN** the workflow deploys to a preview channel and the PR receives a comment with the preview URL

#### Scenario: Fork PRs are skipped
- **WHEN** a pull request is opened from a fork
- **THEN** the preview workflow does not run a deploy

### Requirement: Deploys use the existing hosting configuration
Both workflows SHALL deploy using the repository's `firebase.json` and `.firebaserc` as-is, publishing the `dist/countries-webapp/browser` directory produced by `npm run build`, and SHALL authenticate via a Firebase service account stored in a GitHub repository secret.

#### Scenario: Build output matches hosting public directory
- **WHEN** the workflow completes the build step
- **THEN** the directory deployed is `dist/countries-webapp/browser`, matching the `hosting.public` setting in `firebase.json`

#### Scenario: Missing credentials fail loudly
- **WHEN** the service-account secret is not configured in the repository
- **THEN** the deploy step fails with an authentication error and nothing is published
