// packages/unblocks-react/src/createStrictContext.test.ts
import React from 'react';

import { render, renderHook } from '@testing-library/react';

import createFlexibleContext, { defaultCheckContext } from '../src/createFlexibleContext';

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

describe('createFlexibleContext', () => {
  const { Context, useOptionalContext, useRequiredContext } = createFlexibleContext<string | undefined>(undefined);

  it('useOptionalContext retrieves the context value without throwing errors', () => {
    const { result } = renderHook(() => useOptionalContext());
    expect(result.current).toBeUndefined();
  });

  it('useRequiredContext retrieves the context value when valid', () => {
    const { result } = renderHook(() => useRequiredContext(), {
      wrapper: ({ children }) => <Context.Provider value="strictValue">{children}</Context.Provider>,
    });
    expect(result.current).toBe('strictValue');
  });

  it('useRequiredContext throws an error when not wrapped in a Context.Provider', () => {
    expect(() => renderHook(() => useRequiredContext())).toThrow(
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
    const value = useRequiredContext();
    return <div>{value}</div>;
  }
});
