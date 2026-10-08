import { validators } from 'app/percona/shared/helpers/validatorsForm';

import { RdsAuthMode } from '../../EditInstance.types';

import { Messages } from './RdsCredentials.messages';

const { authMode } = Messages;

export const AUTH_MODE_OPTIONS = [
  { value: RdsAuthMode.accessKey, label: authMode.options.accessKey },
  { value: RdsAuthMode.iamRole, label: authMode.options.iamRole },
  { value: RdsAuthMode.hostCredentials, label: authMode.options.hostCredentials },
];

export const ROLE_ARN_VALIDATORS = [validators.required, validators.awsRoleArn];
export const ACCESS_KEY_VALIDATORS = [validators.required];
