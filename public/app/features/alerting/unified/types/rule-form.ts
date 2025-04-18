import { Template } from 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate.types';
import { Severity } from 'app/percona/shared/core';
import { AlertQuery, GrafanaAlertStateDecision } from 'app/types/unified-alerting-dto';

import { FiltersForm } from '../components/rule-editor/TemplateStep/TemplateStep.types';

export enum RuleFormType {
  grafana = 'grafana',
  cloudAlerting = 'cloud-alerting',
  cloudRecording = 'cloud-recording',
  // @PERCONA
  templated = 'templated',
}

// @PERCONA
// Added uid here as optional
export interface RuleForm {
  title: string;
  id: number;
  uid?: string;
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

  // @PERCONA
  // templated rules
  // to avoid keeping the name between Percona / Grafana rule forms
  ruleName: string;
  template: Template | null;
  // This is the same as evaluateFor, but we have a different validation
  duration: string;
  filters: FiltersForm[];
  severity: keyof typeof Severity | null;
}
