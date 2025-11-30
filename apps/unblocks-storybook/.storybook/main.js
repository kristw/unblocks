module.exports = {
  stories: ['../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  features: {
    emotionAlias: false,
  },

  webpackFinal: (config) => {
    // So we can use @/ to start from the src folder
    // config.resolve.alias['@'] = path.resolve(__dirname, '../src');
    return config;
  }
};
