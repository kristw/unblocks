# @unblocks

![unblocks](./assets/unblocks_poster.png)

## What's inside?

This Monorepo includes the following packages and apps:

### Packages

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

- `@unblocks/react`: Collection of React utilities
- `@unblocks/registry`: All-purpose map data structure on steroids.

### Shared configs (for internal use)

- `@unblocks/eslint-config`: ESLint configurations used throughout the monorepo
- `@unblocks/jest-presets`: Jest configurations
- `@unblocks/typescript-config`: tsconfig.json's used throughout the monorepo

## Development

### Setup

```sh
cd unblocks
npm install
```

### Utilities

This repo use the following dev tools:

- [Turborepo](https://turbo.build/) for monorepo management
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
- [Changesets](https://github.com/changesets/changesets) for versioning and publishing
