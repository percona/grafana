import { EmailAuthType, EmailSettings } from '../../../Settings.types';
import { LoadingCallback } from '../../../Settings.service';

export interface EmailProps {
  settings: EmailSettings;
  updateSettings: (body: any, callback: LoadingCallback) => void;
}

export interface FormEmailSettings extends Omit<EmailSettings, 'identity'> {
  authType: EmailAuthType;
}
