import * as featureLoaderService from '../FeatureLoader.service';

export const FeatureLoaderService = jest.genMockFromModule<typeof featureLoaderService>('../FeatureLoader.service')
  .FeatureLoaderService;

FeatureLoaderService.getSettings = () =>
  Promise.resolve({ settings: { alerting_enabled: true, backup_management_enabled: false } });
