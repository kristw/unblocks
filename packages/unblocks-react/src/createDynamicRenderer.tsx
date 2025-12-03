import React from 'react';
import type { ComponentType } from 'react';

import createFlexibleContext from './createFlexibleContext';

export type DynamicRendererContextType<Props> = {
  getRenderer: (props: Props) => ComponentType<Props> | undefined;
};

export type CreateDynamicRendererOptions<Props> = {
  contextName: string;
  DefaultRenderer?: ComponentType<Props>;
};

/**
 * Creates a dynamic renderer component that selects a renderer based on context.
 * @param contextName Name of the context for error messages
 * @param DefaultRenderer Default renderer component if none is found in context
 * @returns An object containing the context, dynamic renderer component, and constant provider creator.
 */
export default function createDynamicRenderer<Props extends Record<string, unknown>>({
  contextName,
  DefaultRenderer,
}: CreateDynamicRendererOptions<Props>) {
  type ContextType = DynamicRendererContextType<Props>;
  const { Context, useRequiredContext, createConstantProvider } = createFlexibleContext<ContextType>(undefined, {
    contextName,
    providerTag: `${contextName}Context.Provider`,
  });

  function DynamicRenderer(props: Props) {
    const { getRenderer } = useRequiredContext();
    const Renderer = getRenderer(props) || DefaultRenderer;
    if (Renderer) {
      // eslint-disable-next-line react-hooks/static-components
      return <Renderer {...props} />;
    }
    return null;
  }

  return {
    Context,
    DynamicRenderer,
    createConstantProvider,
  };
}
