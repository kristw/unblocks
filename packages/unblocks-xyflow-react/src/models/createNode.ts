import type { PartialExcept } from '@unblocks/types';
import type { Node } from '@xyflow/react';
import { Position } from '@xyflow/react';

export function createNode<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string,
>({
  id,
  data,
  draggable = false,
  position,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
  ...rest
}: PartialExcept<Node<NodeData, NodeType>, 'id' | 'data'>): Node<NodeData, NodeType> {
  return {
    id,
    data,
    draggable,
    position: typeof position === 'undefined' ? { x: 0, y: 0 } : position,
    sourcePosition,
    targetPosition,
    ...rest,
  };
}
