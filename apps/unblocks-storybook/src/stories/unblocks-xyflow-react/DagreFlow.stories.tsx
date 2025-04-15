import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import type { DagreOptions } from '@unblocks/xyflow-react';
import { createEdge, createNode, DagreFlow, Graph } from '@unblocks/xyflow-react';

import wrapReactFlowProvider from '../../decorators/wrapReactFlowProvider';
import { minimalParameters } from '../../utils';

import '@xyflow/react/dist/style.css';

/*--------------------------------------
 * 1. Set component and title
 *--------------------------------------*/
const component = DagreFlow;
const title = '@unblocks/xyflow-react/DagreFlow';

// Generate Storybook types
type Component = typeof component;
type Story = StoryObj<Component>;
type MetaType = Meta<Component>;
type ArgTypesType = MetaType['argTypes'];

/*--------------------------------------
 * 2. Define argTypes
 * https://storybook.js.org/docs/api/arg-types
 *--------------------------------------*/

const argTypes: ArgTypesType = {};

// Export component metadata
export default {
  title,
  component,
  argTypes,
  parameters: minimalParameters(argTypes),
  decorators: [wrapReactFlowProvider],
} as MetaType;

/*--------------------------------------
 * 3. (Optional) Define constants, etc.
 *--------------------------------------*/

/*--------------------------------------
 * 4. Write the stories
 * https://storybook.js.org/docs/writing-stories
 *--------------------------------------*/

export const Basic: Story = {
  render: () => {
    const graph = new Graph();
    graph.addNodes([
      createNode({
        id: '1',
        data: { label: 'Node 1' },
      }),
      createNode({
        id: '2',
        data: { label: 'Node 2' },
      }),
      createNode({
        id: '3',
        data: { label: 'Node 3' },
      }),
    ]);
    graph.addEdges([
      createEdge({
        source: '1',
        target: '2',
      }),
      createEdge({
        source: '1',
        target: '3',
      }),
    ]);

    const DAGRE_OPTIONS: DagreOptions = { direction: 'TB', nodesep: 80 };

    return (
      <div style={{ width: '100%', height: '400px' }}>
        <DagreFlow graph={graph} dagreOptions={DAGRE_OPTIONS} />
      </div>
    );
  },
};
