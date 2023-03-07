const path = require('path');

const EXTERNAL_BUILD = process.env.NODE_ENV === 'production';

module.exports = {
  stories: EXTERNAL_BUILD
    ? ['../stories/**/*.public.stories.mdx', '../stories/**/*.public.stories.@(js|jsx|ts|tsx)']
    : ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  core: {
    builder: 'webpack5',
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-postcss',
    '@storybook/addon-actions',
  ],
  docs: {
    autodocs: true,
  },
  // ************* Add this **********
  webpackFinal: async (config) => {
    config.resolve.modules = [...(config.resolve.modules || []), path.resolve(__dirname, '../src')];

    return config;
  },
};
