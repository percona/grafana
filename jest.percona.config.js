const grafanaConfig = require('./jest.config');

module.exports = {
  ...grafanaConfig,
  roots: ['<rootDir>/public/app/percona'],
};
