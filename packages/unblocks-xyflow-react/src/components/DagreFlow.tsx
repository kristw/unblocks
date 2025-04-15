import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { Node, ReactFlowProps } from '@xyflow/react';
import { Background, Controls, ReactFlow, useNodesInitialized, useNodesState, useReactFlow } from '@xyflow/react';

import type { DagreOptions } from '../models/dagreLayout';
import { dagreLayout } from '../models/dagreLayout';
import type Graph from '../models/Graph';

export type DagreFlowProps = {
  graph: Graph;
  nodeTypes?: ReactFlowProps['nodeTypes'];
  dagreOptions?: DagreOptions;
};

const OPTIONS = {
  includeHiddenNodes: false,
};

export default function DagreFlow({ graph, dagreOptions, ...restProps }: DagreFlowProps) {
  const nodesInitialized = useNodesInitialized(OPTIONS);
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes);
  const [layoutedNodes, setLayoutedNodes] = useState<Node[]>(graph.nodes);
  const isInitialized = useRef(false);

  useEffect(() => {
    setLayoutedNodes(graph.nodes);
    setNodes(graph.nodes);
  }, [graph, setNodes]);

  useEffect(() => {
    if (nodesInitialized) {
      if (!isInitialized.current) {
        const newNodes = dagreLayout(nodes, graph.edges, dagreOptions).nodes;
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
      <Background />
      <Controls />
    </ReactFlow>
  );
}
