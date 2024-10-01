import React from 'react';

import { render } from '@testing-library/react';

import { createRendererContainer, RenderRegistry } from '../src';

describe('createRendererContainer', () => {
  type Props = {
    name: string;
  };

  function EasyRenderer({ name }: Props) {
    return <div>{name}</div>;
  }

  const registry = new RenderRegistry<Props>();
  registry.registerValue('test', EasyRenderer);

  const RendererContainer = createRendererContainer('RendererContainer', registry, () => 'test');

  it('renders the correct renderer', () => {
    const { getByText } = render(<RendererContainer name="test" />);
    expect(getByText('test')).toBeDefined();
  });
});
