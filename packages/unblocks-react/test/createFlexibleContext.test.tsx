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
  const { Context, useOptionalContext, useRequiredContext, checkContext, createConstantProvider } =
    createFlexibleContext<string | undefined>(undefined);

  it('returns all expected exports', () => {
    expect(Context).toBeDefined();
    expect(useOptionalContext).toBeDefined();
    expect(useRequiredContext).toBeDefined();
    expect(checkContext).toBeDefined();
    expect(createConstantProvider).toBeDefined();
  });

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

  it('createConstantProvider creates a working provider', () => {
    const ConstantProvider = createConstantProvider('constantValue');

    const TestComponentWithConstant = () => {
      const value = useRequiredContext();
      return <div>{value}</div>;
    };

    const { getByText } = render(
      <ConstantProvider>
        <TestComponentWithConstant />
      </ConstantProvider>
    );

    expect(getByText('constantValue')).not.toBeNull();
  });

  it('createConstantProvider works with optional context', () => {
    const ConstantProvider = createConstantProvider('optionalConstant');

    const TestComponentOptional = () => {
      const value = useOptionalContext();
      return <div>{value || 'undefined'}</div>;
    };

    const { getByText } = render(
      <ConstantProvider>
        <TestComponentOptional />
      </ConstantProvider>
    );

    expect(getByText('optionalConstant')).not.toBeNull();
  });

  it('checkContext can validate context values', () => {
    expect(checkContext('valid')).toBe(true);
    expect(checkContext(undefined)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(checkContext(null as any)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(checkContext('' as any)).toBe(false);
  });

  function TestComponent() {
    const value = useRequiredContext();
    return <div>{value}</div>;
  }
});

describe('createFlexibleContext with custom options', () => {
  it('uses custom contextName in error messages', () => {
    const { useRequiredContext: useCustomRequired } = createFlexibleContext<string | undefined>(undefined, {
      contextName: 'UserContext',
    });

    expect(() => renderHook(() => useCustomRequired())).toThrow(
      "Invalid UserContext 'undefined'. Make sure this component is wrapped under <Context.Provider> with valid value."
    );
  });

  it('uses custom providerTag in error messages', () => {
    const { useRequiredContext: useCustomRequired } = createFlexibleContext<string | undefined>(undefined, {
      providerTag: 'UserProvider',
    });

    expect(() => renderHook(() => useCustomRequired())).toThrow(
      "Invalid context 'undefined'. Make sure this component is wrapped under <UserProvider> with valid value."
    );
  });

  it('uses custom checkContext function', () => {
    const customCheck = (value: string | undefined): value is string => {
      return typeof value === 'string' && value.startsWith('valid-');
    };

    const { Context, useRequiredContext: useCustomRequired } = createFlexibleContext<string | undefined>(undefined, {
      checkContext: customCheck,
    });

    // Should throw for values that don't start with 'valid-'
    expect(() =>
      renderHook(() => useCustomRequired(), {
        wrapper: ({ children }) => <Context.Provider value="invalid">{children}</Context.Provider>,
      })
    ).toThrow("Invalid context 'invalid'");

    // Should not throw for values that start with 'valid-'
    const { result } = renderHook(() => useCustomRequired(), {
      wrapper: ({ children }) => <Context.Provider value="valid-value">{children}</Context.Provider>,
    });

    expect(result.current).toBe('valid-value');
  });

  it('allows all custom options together', () => {
    const customCheck = (value: number | undefined): value is number => {
      return typeof value === 'number' && value > 0;
    };

    const { Context, useRequiredContext: useCustomRequired } = createFlexibleContext<number | undefined>(undefined, {
      contextName: 'CountContext',
      providerTag: 'CountProvider',
      checkContext: customCheck,
    });

    expect(() => renderHook(() => useCustomRequired())).toThrow(
      "Invalid CountContext 'undefined'. Make sure this component is wrapped under <CountProvider> with valid value."
    );

    const { result } = renderHook(() => useCustomRequired(), {
      wrapper: ({ children }) => <Context.Provider value={5}>{children}</Context.Provider>,
    });

    expect(result.current).toBe(5);
  });
});
