import { EmailSettings, EmailAuthType } from '../../../Settings.types';
import { FormEmailSettings } from './Email.types';

export const isEmailFieldNeeded = (field: keyof EmailSettings, authType: EmailAuthType): boolean => {
  let needingAuths: EmailAuthType[] = [];

  switch (field) {
    case 'username':
      needingAuths = [EmailAuthType.CRAM, EmailAuthType.LOGIN, EmailAuthType.PLAIN];
      break;
    case 'password':
      needingAuths = [EmailAuthType.LOGIN, EmailAuthType.PLAIN];
      break;
    case 'secret':
      needingAuths = [EmailAuthType.CRAM];
      break;
    case 'identity':
      needingAuths = [EmailAuthType.PLAIN];
      break;
    default:
      needingAuths = [EmailAuthType.CRAM, EmailAuthType.LOGIN, EmailAuthType.PLAIN, EmailAuthType.NONE];
      break;
  }

  return needingAuths.length >= 0 && needingAuths.includes(authType);
};

export const getAuthTypeFromFields = (settings: EmailSettings): EmailAuthType => {
  if (settings.identity) {
    return EmailAuthType.PLAIN;
  }

  if (settings.secret) {
    return EmailAuthType.CRAM;
  }

  if (settings.username) {
    return EmailAuthType.LOGIN;
  }

  return EmailAuthType.NONE;
};

export const getInitialValues = (settings: EmailSettings): FormEmailSettings => {
  const resultSettings = { ...settings, authType: getAuthTypeFromFields(settings) };
  delete resultSettings['identity'];

  return resultSettings;
};
