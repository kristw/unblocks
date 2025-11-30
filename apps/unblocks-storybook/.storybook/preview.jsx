import React from 'react';

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export default {
  decorators: [
    (Story) => (
      <Story />
    ),
  ],

  tags: ['autodocs']
};
