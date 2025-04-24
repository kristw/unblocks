import React, { memo } from 'react';

import genericMemo from '../src/genericMemo';

describe('genericMemo', () => {
  it('should be just memo with type', () => {
    expect(genericMemo).toBe(memo);
  });

  it('should return a usable react Component', () => {
    const Component = () => <div>Hello, World!</div>;
    const MemoComponent = genericMemo(Component);
    expect(<MemoComponent />).toEqual(<MemoComponent />);
  });
});
