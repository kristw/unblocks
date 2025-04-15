export interface MultiHandleNodeData {
  [key: string]: unknown;
  topTargetHandle?: boolean;
  leftTargetHandle?: boolean;
  rightTargetHandle?: boolean;
  bottomTargetHandle?: boolean;
  topSourceHandle?: boolean;
  leftSourceHandle?: boolean;
  rightSourceHandle?: boolean;
  bottomSourceHandle?: boolean;
}
