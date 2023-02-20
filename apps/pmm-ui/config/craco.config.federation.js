const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const fs = require('fs');

const deps = require('../package.json').dependencies;

const exposeDirectory = (dirName) =>
  fs.readdirSync(dirName).reduce((exposes, file) => {
    exposes[`./${file.replace(/[.].*$/, '')}`] = `${dirName}/${file}`;
    return exposes;
  }, {});

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.publicPath = 'auto';

      if (!config.plugins) {
        config.plugins = [];
      }

      config.plugins.unshift(
        new ModuleFederationPlugin({
          name: 'pmm_ui',
          filename: 'remoteEntry.js',
          remotes: {
            // <export-name>: "<name>@http://<host>:<port>/remoteEntry.js"
          },
          exposes: exposeDirectory('./src/federated'),
          // exposes: {
          //     './App': './src/App',
          // },
          shared: {
            ...deps,
            react: {
              singleton: true,
              requiredVersion: deps.react,
            },
            'react-dom': {
              singleton: true,
              requiredVersion: deps['react-dom'],
            },
          },
        })
      );

      config.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          );
        },
      ];

      return config;
    },
  },
};
