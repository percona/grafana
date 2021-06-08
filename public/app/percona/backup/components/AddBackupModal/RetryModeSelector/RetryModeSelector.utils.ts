import { RetryMode } from 'app/percona/backup/Backup.types';
import validators from 'app/percona/shared/helpers/validators';
import { AddBackupFormProps } from '../AddBackupModal.types';

export const MINIMUM_RETRY = 1;

export const retryValidator = (value: RetryMode, { retryMode }: AddBackupFormProps) =>
  retryMode === RetryMode.AUTO ? undefined : validators.min(MINIMUM_RETRY)(value);
