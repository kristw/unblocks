import { NOOP } from '../src';

describe('index', () => {
  it('exports modules', () => {
    [NOOP].forEach((x) => expect(x).toBeDefined());
  });
});
