module.exports = {
  webpack: {
    configure: (config) => {
      config.output.publicPath = 'auto';

      if (!config.plugins) {
        config.plugins = [];
      }

      config.plugins.unshift();

      return config;
    },
  },
};
