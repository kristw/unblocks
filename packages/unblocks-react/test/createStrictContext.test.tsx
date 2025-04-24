// packages/unblocks-react/src/createStrictContext.test.ts
import React from 'react';

import { render, renderHook } from '@testing-library/react';

import createStrictContext, { defaultCheckContext } from '../src/createStrictContext';

describe('defaultCheckContext', () => {
  it('returns true for valid values', () => {
    expect(defaultCheckContext('valid')).toBe(true);
    expect(defaultCheckContext(123)).toBe(true);
    expect(defaultCheckContext({})).toBe(true);
  });

  it('returns false for invalid values', () => {
    expect(defaultCheckContext(undefined)).toBe(false);
    expect(defaultCheckContext(null)).toBe(false);
    expect(defaultCheckContext('')).toBe(false);
  });
});

describe('createStrictContext', () => {
  const { Context, useLooseContext, useStrictContext } = createStrictContext<string | undefined>(undefined);

  it('useLooseContext retrieves the context value without throwing errors', () => {
    const { result } = renderHook(() => useLooseContext());
    expect(result.current).toBeUndefined();
  });

  it('useStrictContext retrieves the context value when valid', () => {
    const { result } = renderHook(() => useStrictContext(), {
      wrapper: ({ children }) => <Context.Provider value="strictValue">{children}</Context.Provider>,
    });
    expect(result.current).toBe('strictValue');
  });

  it('useStrictContext throws an error when not wrapped in a Context.Provider', () => {
    expect(() => renderHook(() => useStrictContext())).toThrow(
      "Invalid context 'undefined'. Make sure this component is wrapped under <Context.Provider> with valid value."
    );
  });

  it('works correctly when wrapped in a Context.Provider', () => {
    const { getByText } = render(
      <Context.Provider value="providedValue">
        <TestComponent />
      </Context.Provider>
    );
    expect(getByText('providedValue')).not.toBeNull();
  });

  function TestComponent() {
    const value = useStrictContext();
    return <div>{value}</div>;
  }
});
