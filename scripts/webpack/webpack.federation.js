const { ModuleFederationPlugin } = require('webpack').container;
const { dependencies } = require('../../package.json');

module.exports = {
  federationFactory: (moduleMapper) =>
    new ModuleFederationPlugin({
      remotes: {
        pmm_ui: moduleMapper('pmm_ui'),
      },
      shared: {
        //TODO: doesn't work with deps links
        // ...dependencies,
        react: {
          singleton: true,
          requiredVersion: dependencies['react'],
        },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
        },
      },
    }),
};
