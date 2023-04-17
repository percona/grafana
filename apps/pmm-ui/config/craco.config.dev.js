const {DefinePlugin} = require("webpack");
require('dotenv').config({path: './.env'});

module.exports = {
  webpack: {
    devServer: {
      port: 3001,
      open: false,
    },
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
            }
          }),
        }),
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
