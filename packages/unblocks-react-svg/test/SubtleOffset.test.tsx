import React from 'react';

import { render } from '@testing-library/react';

import SubtleOffset from '../src/components/SubtleOffset';

describe('SubtleOffset', () => {
  it('renders without errors', () => {
    render(
      <svg>
        <SubtleOffset />
      </svg>
    );
    // Add your assertions here
  });

  // Add more test cases as needed
});
