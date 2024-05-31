import { createContext, useContext } from 'react';

type StoredContextType<T> = T | undefined;

export function defaultCheckContext<T>(context: StoredContextType<T>): context is T {
  return typeof context !== 'undefined' && context !== null && context !== '';
}

interface CreateStrictContextOptions<T> {
  contextName?: string;
  providerTag?: string;
  checkContext?: (context: StoredContextType<T>) => context is T;
}

export default function createStrictContext<T>(
  defaultValue: StoredContextType<T>,
  options: CreateStrictContextOptions<T> = {}
) {
  const Context = createContext(defaultValue);
  const { contextName = 'context', providerTag = 'Context.Provider', checkContext = defaultCheckContext } = options;

  /**
   * Hooks for obtaining context
   * Do not throw but context maybe undefined, null or empty string.
   * @returns context and hasContext flag
   */
  function useLooseContext() {
    return useContext(Context);
  }

  /**
   * Hooks for obtaining context
   * throws error if context is undefined, but exclude undefined and null from return type
   * @returns context
   */
  function useStrictContext() {
    const context = useContext(Context);
    if (checkContext(context)) {
      return context;
    }

    throw new Error(
      `Invalid ${contextName} '${context}'. Make sure this component is wrapped under <${providerTag}> with valid value.`
    );
  }

  return { Context, useLooseContext, useStrictContext, checkContext };
}
