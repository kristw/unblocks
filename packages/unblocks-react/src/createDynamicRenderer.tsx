import React from 'react';
import type { ComponentType } from 'react';

import createFlexibleContext from './createFlexibleContext';

export type DynamicRendererContextType<Props, TransformedProps = Props> = {
  getRenderer: (props: Props) => ComponentType<TransformedProps> | undefined;
};

export type CreateDynamicRendererOptions<Props, TransformedProps = Props> = {
  contextName: string;
  transformProps?: (props: Props) => TransformedProps;
  DefaultRenderer?: ComponentType<TransformedProps>;
};

/**
 * Creates a dynamic renderer component that selects a renderer based on context.
 * @param contextName Name of the context for error messages
 * @param DefaultRenderer Default renderer component if none is found in context
 * @returns An object containing the context, dynamic renderer component, and constant provider creator.
 */
export default function createDynamicRenderer<
  Props extends Record<string, unknown>,
  TransformedProps extends Record<string, unknown> = Props,
>({ contextName, transformProps, DefaultRenderer }: CreateDynamicRendererOptions<Props, TransformedProps>) {
  type ContextType = DynamicRendererContextType<Props, TransformedProps>;
  const { Context, useRequiredContext, createConstantProvider } = createFlexibleContext<ContextType>(undefined, {
    contextName,
    providerTag: `${contextName}Context.Provider`,
  });

  function DynamicRenderer(props: Props) {
    const { getRenderer } = useRequiredContext();
    const Renderer = getRenderer(props) || DefaultRenderer;
    if (Renderer) {
      const transformedProps = transformProps ? transformProps(props) : (props as unknown as TransformedProps);
      // eslint-disable-next-line react-hooks/static-components
      return <Renderer {...transformedProps} />;
    }
    return null;
  }

  return {
    Context,
    DynamicRenderer,
    createConstantProvider,
  };
}
