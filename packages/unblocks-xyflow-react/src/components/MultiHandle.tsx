import React, { memo } from 'react';

import { Handle, Position } from '@xyflow/react';

import type { MultiHandleNodeData } from '../types';

export type MultiHandleProps = MultiHandleNodeData;

function MultiHandle({
  topSourceHandle = false,
  topTargetHandle = true,
  leftSourceHandle = false,
  leftTargetHandle = false,
  rightSourceHandle = false,
  rightTargetHandle = false,
  bottomSourceHandle = true,
  bottomTargetHandle = false,
}: MultiHandleProps) {
  return (
    <>
      {topSourceHandle && <Handle type="source" id="top-source" position={Position.Top} />}
      {topTargetHandle && <Handle type="target" id="top-target" position={Position.Top} />}
      {bottomSourceHandle && <Handle type="source" id="bottom-source" position={Position.Bottom} />}
      {bottomTargetHandle && <Handle type="target" id="bottom-target" position={Position.Bottom} />}
      {leftSourceHandle && <Handle type="source" id="left-source" position={Position.Left} />}
      {leftTargetHandle && <Handle type="target" id="left-target" position={Position.Left} />}
      {rightSourceHandle && <Handle type="source" id="right-source" position={Position.Right} />}
      {rightTargetHandle && <Handle type="target" id="right-target" position={Position.Right} />}
    </>
  );
}

export default memo(MultiHandle);
