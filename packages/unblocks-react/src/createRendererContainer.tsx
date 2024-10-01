import React from 'react';

import RenderRegistry from './RenderRegistry';

type RegistryInput<Props> = (() => RenderRegistry<Props>) | RenderRegistry<Props>;

function resolveRegistry<Props>(registryOrGetter: RegistryInput<Props>): () => RenderRegistry<Props> {
  if (registryOrGetter instanceof RenderRegistry) {
    return () => registryOrGetter;
  }

  return registryOrGetter;
}

/**
 * Helper function to create a container component that
 * chooses a renderer based on the key function.
 * @param displayName The display name of the container component
 * @param registry The registry to get the renderer from
 * @param getKey A function that returns the key to get the renderer from the registry
 * @returns The container component function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createRendererContainer<Props extends Record<string, any>>(
  displayName: string,
  registry: RegistryInput<Props>,
  getKey: (p: Props) => string | undefined
) {
  const getRegistry = resolveRegistry(registry);

  function RendererContainer(props: Props) {
    const key = getKey(props);
    const reg = getRegistry();

    // Get the renderer from given key first,
    // If cannot find, use default renderer, which is guaranteed to not be undefined.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const Renderer = reg.get(key) || reg.get()!;

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Renderer {...props} />;
  }

  RendererContainer.displayName = displayName;
  return RendererContainer;
}
