import { Severity } from 'app/percona/shared/core';
import { AlertQuery, GrafanaAlertStateDecision } from 'app/types/unified-alerting-dto';

import { FiltersForm } from '../components/rule-editor/TemplateStep/TemplateStep.types';

export enum RuleFormType {
  grafana = 'grafana',
  cloudAlerting = 'cloud-alerting',
  cloudRecording = 'cloud-recording',
  percona = 'percona',
}

export interface RuleForm {
  title: string;
  id: number;
}

export interface RuleFormValues {
  // common
  name: string;
  type?: RuleFormType;
  dataSourceName: string | null;
  group: string;

  labels: Array<{ key: string; value: string }>;
  annotations: Array<{ key: string; value: string }>;

  // grafana rules
  queries: AlertQuery[];
  condition: string | null; // refId of the query that gets alerted on
  noDataState: GrafanaAlertStateDecision;
  execErrState: GrafanaAlertStateDecision;
  folder: RuleForm | null;
  evaluateEvery: string;
  evaluateFor: string;

  // cortex / loki rules
  namespace: string;
  forTime: number;
  forTimeUnit: string;
  expression: string;

  // templated rules
  template: string;
  duration: number;
  filters: FiltersForm[];
  notificationChannels: string[];
  severity: keyof typeof Severity;
  enabled: boolean;
}
