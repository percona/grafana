const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const fs = require('fs');

const deps = require('../package.json').dependencies;
const { DefinePlugin } = require('webpack');
require('dotenv').config({ path: './.env' });

const exposeDirectory = (dirName) =>
  fs.readdirSync(dirName).reduce((exposes, file) => {
    exposes[`./${file.replace(/[.].*$/, '')}`] = `${dirName}/${file}`;
    return exposes;
  }, {});

module.exports = {
  devServer: {
    port: 3001,
    open: false,
  },
  webpack: {
    configure: (config) => {
      config.output.publicPath = 'auto';

      if (!config.plugins) {
        config.plugins = [];
      }

      config.plugins.unshift(
        new DefinePlugin({
          'process.env': JSON.stringify({
            ...process.env,
            ...{
              NODE_ENV: JSON.stringify('development'),
            },
          }),
        }),
        new ModuleFederationPlugin({
          name: 'pmm_ui',
          filename: 'remoteEntry.js',
          remotes: {
            // <export-name>: "<name>@http://<host>:<port>/remoteEntry.js"
          },
          exposes: exposeDirectory('./src/federated'),
          shared: {
            ...deps,
            react: {
              singleton: true,
              version: '0.0.0', //workaround, to force loading dependency from grafana
              requiredVersion: deps.react,
            },
            'react-dom': {
              singleton: true,
              version: '0.0.0', //workaround, to force loading dependency from grafana
              requiredVersion: deps['react-dom'],
            },
            'calculate-size': {
              singleton: true,
              requiredVersion: deps['calculate-size'],
            },
            '@grafana/ui': {
              singleton: true,
              requiredVersion: deps['@grafana/ui'],
            },
            '@emotion/css': {
              singleton: true,
              requiredVersion: deps['@emotion/css'],
            },
            '@emotion/react': {
              singleton: true,
              requiredVersion: deps['@emotion/react'],
            },
            '@grafana/data': {
              singleton: true,
              requiredVersion: deps['@grafana/data'],
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
