# Jason's Website

[![Deploy to Firebase Hosting on merge](https://github.com/Djeisen642/website2/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/Djeisen642/website2/actions/workflows/firebase-hosting-merge.yml)

Runs live at https://jasonsuttles.dev

## Setup

Make sure to install the dependencies:

```bash
yarn install
```

## Development Server

Start the development server at http://localhost:3000

```bash
yarn dev
# OR
yarn start
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

## Notes:

- uses Nuxt 3, Vue 3, Vuetify to build the frontend framework
- uses Google Firebase for realtime store, hosting, metrics, authentication (just for admin)
- uses vue-axe to check for accessibility
- uses commitlint to ensure commit messages follow a standard
- uses GitHub Actions to lint, SAST, build, and publish to Google Firebase
- No tests... 😅
- @nuxtjs/robots is not working for some reason

## Reminders:

- Adding the Content-Security-Policy is a non-trivial process
