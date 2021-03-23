import { LoadingCallback } from 'app/percona/settings/Settings.service';
import { SettingsAPI } from '../../Settings.types';

export interface SSHKeyProps {
  sshKey: string;
  updateSettings: (body: Pick<SettingsAPI, 'ssh_key'>, callback: LoadingCallback) => void;
}
