import { alertsStubs } from './alertsStubs';

import * as alertsService from '../Alerts.service';

export const AlertsService = jest.genMockFromModule<typeof alertsService>('../AlertRules.service').AlertsService;

AlertsService.list = () => Promise.resolve({ alerts: alertsStubs });
