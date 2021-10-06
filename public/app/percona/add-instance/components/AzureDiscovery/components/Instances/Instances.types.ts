import { Instance } from '../../Discovery.types';
import { AvailableTypes } from '../../../../panel.types';

export type OnSelectInstance = ({ type, credentials }: { type: AvailableTypes | ''; credentials: any }) => void;

export interface InstancesTableProps {
  instances: Instance[];
  selectInstance: OnSelectInstance;
  loading: boolean;
  credentials: any;
}
