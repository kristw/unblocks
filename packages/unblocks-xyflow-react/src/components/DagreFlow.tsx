import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { Edge, Node, ReactFlowProps } from '@xyflow/react';
import { Background, Controls, ReactFlow, useNodesInitialized, useNodesState, useReactFlow } from '@xyflow/react';

import type { DagreOptions } from '../models/dagreLayout';
import { dagreLayout } from '../models/dagreLayout';
import type Graph from '../models/Graph';

export type DagreFlowProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  graph: Graph;
  dagreOptions?: DagreOptions;
} & Omit<ReactFlowProps<NodeType, EdgeType>, 'nodes' | 'edges' | 'onNodesChange'>;

const OPTIONS = {
  includeHiddenNodes: false,
};

const DEFAULT_CHILDREN = (
  <>
    <Background />
    <Controls />
  </>
);

export default function DagreFlow({ graph, dagreOptions, children, ...restProps }: DagreFlowProps) {
  const nodesInitialized = useNodesInitialized(OPTIONS);
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes);
  const [layoutedNodes, setLayoutedNodes] = useState<Node[]>(graph.nodes);
  const isInitialized = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLayoutedNodes(graph.nodes);
    setNodes(graph.nodes);
  }, [graph, setNodes]);

  useEffect(() => {
    if (nodesInitialized) {
      if (!isInitialized.current) {
        const newNodes = dagreLayout(nodes, graph.edges, dagreOptions).nodes;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLayoutedNodes(newNodes.concat());
        isInitialized.current = true;
      }
    } else {
      setLayoutedNodes(nodes.concat());
      isInitialized.current = false;
    }
    setTimeout(() => {
      requestAnimationFrame(() => {
        fitView();
      });
    }, 10);
  }, [nodes, fitView, graph, nodesInitialized, dagreOptions]);

  const allEdges = useMemo(() => graph.getAllEdges(), [graph]);

  return (
    <ReactFlow nodes={layoutedNodes} edges={allEdges} onNodesChange={onNodesChange} fitView {...restProps}>
      {typeof children === 'undefined' ? DEFAULT_CHILDREN : children}
    </ReactFlow>
  );
}
