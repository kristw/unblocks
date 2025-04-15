module.exports = {
  stories: ['../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],

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
  },

  docs: {
    autodocs: true,
  },
};
