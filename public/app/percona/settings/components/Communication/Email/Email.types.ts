import { EmailSettings } from '../../../Settings.types';
import { LoadingCallback } from '../../../Settings.service';

export interface EmailProps {
  settings: EmailSettings;
  updateSettings: (body: any, callback: LoadingCallback) => void;
}
