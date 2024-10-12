import type { ValueOf } from '../src';

describe('ValueOf<T>', () => {
  it('exports modules', () => {
    const x = {
      a: 1,
      b: 2,
    } as const;
    type X = ValueOf<typeof x>;
    1 satisfies X;
    2 satisfies X;
    // @ts-expect-error
    3 satisfies X;

    expect(x).toBeDefined();
  });
});
