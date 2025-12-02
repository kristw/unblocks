import React from 'react';
import type { ReactNode } from 'react';

export type ProviderProps = { children: ReactNode };

/**
 * Function to compose multiple providers into a single provider component
 * @param providers Array of provider components. The first provider in the array will be the outermost provider.
 * @returns Composed provider component
 */
export default function composeProvider(providers: React.ComponentType<ProviderProps>[]) {
  return providers.reduceRight(
    (Acc, Provider) => {
      return function ComposedProvider(props: ProviderProps) {
        return (
          <Provider>
            <Acc {...props} />
          </Provider>
        );
      };
    },
    ({ children }: ProviderProps) => <>{children}</>
  );
}
