# d3-time-format-thai

## Usage

```sh
npm install d3-time-format-thai --save
```

`timeFormat` and `utcFormat` takes the same format string as `d3-time-format`'s.
[See documentation](https://github.com/d3/d3-time-format)

```ts
import { timeFormat, utcFormat } from 'd3-time-format-thai';

console.log(timeFormat('%a %0d %b')(new Date(2019, 10, 1)));
// ศ. 01 พ.ย.
```

The library was written in Typescript and provide typings as part of the package.

### License

Apache-2.0
