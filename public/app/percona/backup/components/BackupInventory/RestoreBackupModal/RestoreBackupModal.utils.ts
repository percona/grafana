import moment from 'moment/moment';

import { formatDataModel } from 'app/percona/backup/Backup.utils';
import { DATABASE_LABELS } from 'app/percona/shared/core';

import { Backup } from '../BackupInventory.types';

import { RestoreBackupFormProps, ServiceTypeSelect } from './RestoreBackupModal.types';

type ToFormProps = (props: Backup) => RestoreBackupFormProps;

export const toFormProps: ToFormProps = ({ vendor, serviceId, serviceName, dataModel }) => ({
  serviceType: ServiceTypeSelect.SAME,
  vendor: DATABASE_LABELS[vendor],
  service: { label: serviceName, value: serviceId },
  dataModel: formatDataModel(dataModel),
});

export const isSameDay = (firstDay: Date | string, secondDay: Date | string) =>
  moment(firstDay).isSame(secondDay, 'date');
export const getHours = (date: string) => moment(date).hours();
export const getMinutes = (date: string) => moment(date).minute();
export const getSeconds = (date: string) => moment(date).second();
