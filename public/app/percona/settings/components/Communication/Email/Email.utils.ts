import { EmailSettings, EmailAuthType } from '../../../Settings.types';

export const isEmailFieldNeeded = (field: keyof EmailSettings, authType: EmailAuthType): boolean => {
  let neededFields: EmailAuthType[] = [];

  switch (field) {
    case 'username':
      neededFields = [EmailAuthType.CRAM, EmailAuthType.LOGIN, EmailAuthType.PLAIN];
      break;
    case 'password':
      neededFields = [EmailAuthType.LOGIN, EmailAuthType.PLAIN];
      break;
    case 'secret':
      neededFields = [EmailAuthType.CRAM];
      break;
    default:
      break;
  }

  return neededFields.length >= 0 && neededFields.includes(authType);
};
