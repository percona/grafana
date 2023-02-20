module.exports = {
  stories: ['../src/components/**/*.stories.mdx', '../src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      },
    },
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-knobs',
    '@storybook/addon-storysource',
    'storybook-dark-mode',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  features: {
    storyStoreV7: true,
  },
};
