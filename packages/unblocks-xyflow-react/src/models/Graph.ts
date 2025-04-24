import type { Edge, Node } from '@xyflow/react';

/**
 * Graph class to manage nodes and edges
 */
export default class Graph {
  public nodes: Node[];
  public edges: Edge[];
  /** Edges that do not affect the layout */
  public extraEdges: Edge[];
  private nodeLookup: Record<string, Node>;
  private edgeLookup: Record<string, Edge>;
  private extraEdgeLookup: Record<string, Edge>;

  constructor() {
    this.nodes = [];
    this.edges = [];
    this.extraEdges = [];
    this.nodeLookup = {};
    this.edgeLookup = {};
    this.extraEdgeLookup = {};
  }

  addNode(node: Node) {
    if (this.nodeLookup[node.id]) {
      return this;
    }
    this.nodes.push(node);
    this.nodeLookup[node.id] = node;
    return this;
  }

  addNodes(nodes: Node[]) {
    nodes.forEach((node) => this.addNode(node));
    return this;
  }

  findNode(id: string) {
    return this.nodeLookup[id];
  }

  /**
   * Add an edge to the graph (affects the layout)
   * @param edge
   */
  addEdge(edge: Edge) {
    if (this.edgeLookup[edge.id]) {
      return;
    }
    this.edges.push(edge);
    this.edgeLookup[edge.id] = edge;
    return this;
  }

  addEdges(edges: Edge[]) {
    edges.forEach((edge) => this.addEdge(edge));
    return this;
  }

  /**
   * Add an extra edge that does not affect the layout
   * @param edge edge
   */
  addExtraEdge(edge: Edge) {
    if (this.extraEdgeLookup[edge.id]) {
      return this;
    }
    this.extraEdges.push(edge);
    this.extraEdgeLookup[edge.id] = edge;
    return this;
  }

  addExtraEdges(edges: Edge[]) {
    edges.forEach((edge) => this.addExtraEdge(edge));
    return this;
  }

  findEdge(id: string) {
    return this.edgeLookup[id];
  }

  getAllEdges() {
    return this.edges.concat(this.extraEdges);
  }
}
