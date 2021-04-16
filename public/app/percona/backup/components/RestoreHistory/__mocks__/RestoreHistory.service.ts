import { DataModel, Status } from 'app/percona/backup/Backup.types';
import { Databases } from 'app/percona/shared/core';
import * as service from '../RestoreHistory.service';
import { Restore } from '../RestoreHistory.types';

export const stubs: Restore[] = [
  {
    id: 'restore_1',
    name: 'Restore 1',
    locationId: 'location_1',
    locationName: 'Location 1',
    started: 1615912580244,
    finished: 1615912580244,
    serviceId: 'service_1',
    serviceName: 'Service 1',
    dataModel: DataModel.LOGICAL,
    status: Status.SUCCESS,
    vendor: Databases.mysql,
  },
  {
    id: 'restore_2',
    name: 'Restore 2',
    locationId: 'location_2',
    locationName: 'Location 2',
    started: 1615912580244,
    finished: 1615912580244,
    serviceId: 'service_2',
    serviceName: 'Service 2',
    dataModel: DataModel.PHYSICAL,
    status: Status.IN_PROGRESS,
    vendor: Databases.mysql,
  },
];

export const RestoreHistoryService = jest.genMockFromModule<typeof service>('../RestoreHistory.service')
  .RestoreHistoryService;
RestoreHistoryService.list = () => Promise.resolve(stubs);
