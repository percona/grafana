import * as service from 'app/percona/shared/services/services/Services.service';

export const ServicesService = jest.genMockFromModule<typeof service>(
  'app/percona/shared/services/services/Services.service'
).ServicesService;

ServicesService.getServices = () =>
  Promise.resolve({
    services: [],
  });

ServicesService.removeService = () => Promise.resolve({});
