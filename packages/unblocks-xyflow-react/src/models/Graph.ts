import type { Edge, Node } from '@xyflow/react';

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
      return;
    }
    this.nodes.push(node);
    this.nodeLookup[node.id] = node;
  }

  addNodes(nodes: Node[]) {
    nodes.forEach((node) => this.addNode(node));
  }

  findNode(id: string) {
    return this.nodeLookup[id];
  }

  addEdge(edge: Edge) {
    if (this.edgeLookup[edge.id]) {
      return;
    }
    this.edges.push(edge);
    this.edgeLookup[edge.id] = edge;
  }

  addEdges(edges: Edge[]) {
    edges.forEach((edge) => this.addEdge(edge));
  }

  addExtraEdge(edge: Edge) {
    if (this.extraEdgeLookup[edge.id]) {
      return;
    }
    this.extraEdges.push(edge);
    this.extraEdgeLookup[edge.id] = edge;
  }

  addExtraEdges(edges: Edge[]) {
    edges.forEach((edge) => this.addExtraEdge(edge));
  }

  findEdge(id: string) {
    return this.edgeLookup[id];
  }

  getAllEdges() {
    return this.edges.concat(this.extraEdges);
  }
}
