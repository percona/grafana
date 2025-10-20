import { FormattedCheckResult } from 'app/percona/check/types';

export interface RunAdvisorChecksYamlModalProps {
  isVisible: boolean;
  setVisible: (value: boolean) => void;
}

export interface CheckYamlFormValues {
  yaml: string;
}

export interface CheckResultsState {
  results: FormattedCheckResult[];
  hasRun: boolean;
}
