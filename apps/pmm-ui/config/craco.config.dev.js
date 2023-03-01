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

      config.plugins.unshift();

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
