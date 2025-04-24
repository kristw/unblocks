# @unblocks/utils

[![Version](https://img.shields.io/npm/v/@unblocks/utils.svg?style=flat)](https://img.shields.io/npm/v/@unblocks/utils.svg?style=flat)

A collection of utility functions and classes.

## Install

```sh
npm install @unblocks/utils
```

## Example usage

### Sizer

```ts
import { Sizer } from '@unblocks/utils';

const sizer = new Sizer(['S', 'M', 'L']);
console.log(sizer.getSize(0)); // S
console.log(sizer.getSize(1)); // M
console.log(sizer.getSize(2)); // L
console.log(sizer.getSize(3)); // throw Error

console.log(sizer.up("S", 1)); // M
console.log(sizer.up("S", 2)); // L
console.log(sizer.up("S", 3)); // L

console.log(sizer.down("L", 1)); // M
console.log(sizer.down("L", 2)); // S
console.log(sizer.down("L", 3)); // S
```
