import { ReactFlowProvider } from '@xyflow/react';

export default function wrapReactFlowProvider(Story: React.ComponentType) {
  return (
    <ReactFlowProvider>
      <Story />
    </ReactFlowProvider>
  );
}
