import type { PartialOnly } from '@unblocks/types';
import type { Edge } from '@xyflow/react';

export function createEdge<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string | undefined = string | undefined,
>({ id, source, target, ...rest }: PartialOnly<Edge<EdgeData, EdgeType>, 'id'>): Edge<EdgeData, EdgeType> {
  return {
    id: id ?? `${source}-${target}`,
    source,
    target,
    ...rest,
  };
}
