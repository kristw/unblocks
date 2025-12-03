import { createContext, useContext } from 'react';

import createConstantProvider from './createConstantProvider';

type StoredContextType<T> = T | undefined;

/**
 * Function to check if the context is valid
 * @param context context to check
 * @returns True if context is valid, false otherwise
 */
export function defaultCheckContext<T>(context: StoredContextType<T>): context is T {
  return typeof context !== 'undefined' && context !== null && context !== '';
}

interface CreateFlexibleContextOptions<T> {
  /** Name of the context for error messages */
  contextName?: string;
  /** Tag for the provider in error messages */
  providerTag?: string;
  /** Function to check if the context is valid */
  checkContext?: (context: StoredContextType<T>) => context is T;
}

/**
 * Creates a flexible context with optional and required hooks, and a constant provider creator.
 * @param defaultValue
 * @param options
 * @returns An object containing the context, hooks, and provider creator.
 */
export default function createFlexibleContext<T>(
  defaultValue: StoredContextType<T>,
  options: CreateFlexibleContextOptions<T> = {}
) {
  const Context = createContext(defaultValue);
  const { contextName = 'context', providerTag = 'Context.Provider', checkContext = defaultCheckContext } = options;

  /**
   * Hooks for obtaining context
   * Do not throw but context maybe undefined, null or empty string.
   * @returns context and hasContext flag
   */
  function useOptionalContext() {
    return useContext(Context);
  }

  /**
   * Hooks for obtaining context
   * throws error if context is undefined, but exclude undefined and null from return type
   * @returns context
   */
  function useRequiredContext() {
    const context = useContext(Context);
    if (checkContext(context)) {
      return context;
    }

    throw new Error(
      `Invalid ${contextName} '${context}'. Make sure this component is wrapped under <${providerTag}> with valid value.`
    );
  }

  /**
   * Creates a constant provider for the context
   * @param value
   * @returns Constant provider component
   */
  function _createConstantProvider(value: T) {
    return createConstantProvider(Context, value);
  }

  return {
    Context,
    useOptionalContext,
    useRequiredContext,
    checkContext,
    createConstantProvider: _createConstantProvider,
  };
}
