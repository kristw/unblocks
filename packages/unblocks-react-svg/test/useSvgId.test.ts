import { renderHook } from '@testing-library/react';

import useSvgId from '../src/hooks/useSvgId';

describe('useSvgId', () => {
  it('should generate unique ids with the given prefix', () => {
    const { result } = renderHook(() => useSvgId('prefix'));

    const [id1, url1] = result.current;
    console.log(id1, url1);
    expect(url1).toBe(`url(#${id1})`);
    expect(id1).toMatch(/^prefix-[A-Za-z0-9-]+$/);
  });

  it('should generate different ids for different prefixes', () => {
    const { result: result1 } = renderHook(() => useSvgId('prefix1'));
    const { result: result2 } = renderHook(() => useSvgId('prefix2'));

    const id1 = result1.current[0];
    const id2 = result2.current[0];

    expect(id1).not.toBe(id2);
  });
});
