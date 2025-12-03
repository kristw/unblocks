import React, { memo } from 'react';
import type { Context, ReactNode } from 'react';

/**
 * Creates a constant provider for the given context and value.
 * @param Context The React context for which to create the provider.
 * @param value The constant value to provide.
 * @returns A memoized React component that provides the constant value.
 */
export default function createConstantProvider<T>(Context: Context<T>, value: T) {
  function ConstantProvider({ children }: { children: ReactNode }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  return memo(ConstantProvider);
}
