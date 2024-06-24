# @unblocks

[![codecov](https://codecov.io/gh/kristw/unblocks/graph/badge.svg?token=UKWMR5LJUH)](https://codecov.io/gh/kristw/unblocks)

![unblocks](./assets/unblocks_poster.png)

## What's inside?

This monorepo includes the following:

### Packages

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

- [`@unblocks/react`](./packages//unblocks-react/): Collection of React utilities
- [`@unblocks/react-svg`](./packages//unblocks-react-svg/): Collection of utilities for working with SVG in React
- [`@unblocks/registry`](./packages/unblocks-registry/): All-purpose map data structure that supports lazy loading (sync & async)
- [`d3-time-format-thai`](./packages/d3-time-format-thai/): `d3-time-format` with Thai locale support
- [`global-box`](./packages/global-box/): A simple key-value store singleton

### Shared configs (for internal use)

- [`@unblocks/eslint-config`](./packages/config-eslint/): ESLint configurations used throughout the monorepo
- [`@unblocks/jest-presets`](./packages/jest-presets/): Jest configurations
- [`@unblocks/typescript-config`](./packages/config-typescript/): tsconfig.json's used throughout the monorepo

## Development

### Setup

```sh
cd unblocks
npm install
```

### Lint, typecheck, and test

```sh
npm run check-all
```

or

```sh
npm run lint:fix
npm run typecheck
npm run test
```

### Prepare release

The publish process is handled by CI.
To prepare a release, run:

```sh
npm run changeset
# then follow the prompt
```

### Utilities

This repo use the following dev tools:

- [Turborepo](https://turbo.build/) for monorepo management
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
- [Changesets](https://github.com/changesets/changesets) for versioning and publishing
