import { Interval } from 'app/percona/check/types';

export interface ChangeCheckIntervalModalProps {
  interval: keyof typeof Interval;
  checkName: string;
  isVisible: boolean;
  setVisible: (value: boolean) => void;
}
