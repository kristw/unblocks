# @unblocks/registry

[![Version](https://img.shields.io/npm/v/@unblocks/registry.svg?style=flat)](https://img.shields.io/npm/v/@unblocks/registry.svg?style=flat)

All-purpose map data structure on steroids.

* Can be used to store state as global, making a true singleton that can be used across packages.
* Can be used locally as well.
* Support asynchronous values.

## Install

```sh
npm install @encodable/registry global-box
```

## Example usage

Create registries

```ts
import { Registry, SyncRegistry, makeSingleton } from '@encodable/registry';

// local registry (when globalId is not defined)
const registry = new Registry<string>();

// global registry
const globalRegistry = new Registry({ globalId: 'my-global-key' });

// create a singleton factory function
const getSingleton = makeSingleton(() => new Registry({ globalId: 'my-global-key' }));

```

Registering

```ts
// constant value
registry.registerValue('key', 1);
// sync loader
registry.registerLoader('key', () => 1);
// async loader
registry.registerLoader('key', () => Promise.resolve(1));
```

* `Registry` can support both constant values and sync/async loaders.
* `SyncRegistry` only support constant values and sync loaders.
