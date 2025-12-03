import React, { memo } from 'react';
import type { Context, ReactNode } from 'react';

export default function createConstantProvider<T>(Context: Context<T>, value: T) {
  function ConstantProvider({ children }: { children: ReactNode }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  return memo(ConstantProvider);
}
