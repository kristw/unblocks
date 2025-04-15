import React, { memo } from 'react';

import type { MultiHandleProps } from './MultiHandle';
import MultiHandle from './MultiHandle';

export type WithMultiHandleProps = MultiHandleProps & {
  children: React.ReactNode;
};

function WithMultiHandle({ children, ...restProps }: WithMultiHandleProps) {
  return (
    <>
      {children}
      <MultiHandle {...restProps} />
    </>
  );
}

export default memo(WithMultiHandle);
