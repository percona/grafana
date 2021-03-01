// TODO remove when API's ready
const mockedData = [
  {
    name: 'pg-sales-ncarolina-prod-10',
    created: Date.now(),
    location: 'postgresql-sles-production',
  },
  {
    name: 'pg-sales-ncarolina-prod-11',
    created: Date.now(),
    location: 'postgresql-sles-production',
  },
  {
    name: 'pg-sales-ncarolina-prod-12',
    created: Date.now(),
    location: 'postgresql-sles-production',
  },
];

export const BackupInventoryService = {
  async list(): Promise<any> {
    return Promise.resolve(mockedData);
  },
};
