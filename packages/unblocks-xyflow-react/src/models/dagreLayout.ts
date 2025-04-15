import Dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';

export interface DagreOptions {
  direction: 'TB' | 'LR';
  nodesep?: number;
  ranksep?: number;
}

export const DEFAULT_DAGRE_OPTIONS: DagreOptions = { direction: 'LR', nodesep: 8, ranksep: 48 };

export function dagreLayout(nodes: Node[], edges: Edge[], options: DagreOptions = DEFAULT_DAGRE_OPTIONS) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const { nodesep = 8, ranksep = 48 } = options;
  g.setGraph({ rankdir: options.direction, nodesep, ranksep });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
}
