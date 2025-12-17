## Project Overview

This is a Nuxt.js project, a personal website. It uses Vue.js, Vuetify for the frontend, and Firebase for various backend services like a real-time database, hosting, and authentication. The project is set up with TypeScript, ESLint, Prettier, and Stylelint for code quality and consistency. It also includes commit linting to enforce a standard for commit messages.

This document provides an overview of the project, including how to build, run, and contribute to it.

## Environment Setup

This project specifies the Node.js and Bun versions to be used. It is recommended to use a version manager like `nvm` or `volta` to ensure you are using the correct versions.

- **Node.js:** `lts/jod` (as specified in `package.json`)
- **Bun:** `1.3.5` (as specified in `package.json`)

If you are using Volta, it will automatically pick up the correct versions from `package.json`.

## Building and Running

### Dependencies

Install dependencies with:

```bash
bun install
```

### Development

To run the development server:

```bash
bun run dev
```

or

```bash
bun run start
```

The development server will be available at http://localhost:3000.

### Production

To build the application for production:

```bash
bun run build
```

To preview the production build locally:

```bash
bun run preview
```

To generate a static site:

```bash
bun run generate
```

### Linting and Type Checking

To run all linters and the type checker:

```bash
bun run lint
```

To run only the JavaScript/TypeScript linter:

```bash
bun run lint:js
```

To run only the style linter:

```bash
bun run lint:style
```

To run only the type checker:

```bash
bun run check:types
```

## Development Conventions

- **Framework:** The project is built with Nuxt.js, a framework for Vue.js.
- **UI:** The UI is built with Vuetify, a Material Design component framework for Vue.
- **State Management:** Pinia is used for state management.
- **Styling:** SCSS is used for styling, with Stylelint for linting.
- **Code Quality:** ESLint and Prettier are used to enforce code quality and a consistent style.
- **Commits:** Commitlint is used to enforce a conventional commit message format.
- **Testing:** The `README.md` mentions that there are no tests yet.

## Pages

The following pages are available in the project:

- `/` (index.vue)
- `/2048` (2048.vue)
- `/CatAndMouse` (CatAndMouse.vue)
- `/CodeEditor` (CodeEditor.vue)
- `/games` (games.vue)
- `/links` (links.vue)
- `/Pong` (Pong.vue)
- `/blog` (blog/index.vue)
- `/blog/[id]` (blog/[id].vue)

## Key Dependencies

### Production Dependencies

- `@mdi/js`: Material Design Icons
- `@nuxtjs/robots`: Nuxt module for `robots.txt`
- `@pinia/nuxt`: Pinia integration for Nuxt
- `@vueuse/core`: Collection of essential Vue Composition Utilities
- `firebase`: Firebase SDK
- `highlight.js`: Syntax highlighting
- `quill`: Rich text editor
- `vuetify`: Material Design component framework for Vue

### Development Dependencies

- `@commitlint/cli`: Linter for commit messages
- `@nuxt/eslint`: ESLint integration for Nuxt
- `@nuxtjs/device`: Nuxt module for device detection
- `eslint`: JavaScript/TypeScript linter
- `husky`: Git hooks
- `stylelint`: CSS/SCSS linter
- `typescript`: TypeScript compiler
