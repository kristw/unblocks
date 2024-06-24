import React, { memo } from 'react';

export type SubtleOffsetProps = React.SVGProps<SVGGElement>;

function SubtleOffset(props: SubtleOffsetProps) {
  return <g transform="translate(0.5,0.5)" {...props} />;
}

export default memo(SubtleOffset);
