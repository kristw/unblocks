# @unblocks/xyflow-react

[![Version](https://img.shields.io/npm/v/@unblocks/xyflow-react.svg?style=flat)](https://img.shields.io/npm/v/@unblocks/xyflow-react.svg?style=flat)

A collection of utility functions and classes.

## Install

```sh
npm install @unblocks/xyflow-react
```

## Example usage

```tsx
import { DagreFlow, createNode, createEdge, Graph } from '@unblocks/xyflow-react';

function MyFlow() {
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
}

```
