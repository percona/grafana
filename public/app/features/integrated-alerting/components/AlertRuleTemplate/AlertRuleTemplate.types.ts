export interface UploadAlertRuleTemplatePayload {
  yaml: string;
}

export interface UpdateAlertRuleTemplatePayload {
  yaml: string;
  name: string;
}

export interface DeleteAlertRuleTemplatePayload {
  name: string;
}

export interface TemplatesList {
  templates: Template[];
}

export enum SourceDescription {
  BUILT_IN = 'Built-in',
  SAAS = 'Percona Enterprise Platform',
  USER_FILE = 'User-defined (file)',
  USER_API = 'User-defined (UI)',
}

// https://github.com/percona/pmm-managed/blob/ec05154dbe2ae131a56d870bff5764e2193349fb/vendor/github.com/percona-platform/saas/pkg/alert/type.go
export enum TemplateParamType {
  FLOAT = 'FLOAT',
  BOOL = 'BOOL',
  STRING = 'STRING',
}

// https://github.com/percona/pmm-managed/blob/ec05154dbe2ae131a56d870bff5764e2193349fb/vendor/github.com/percona-platform/saas/pkg/alert/unit.go
export enum TemplateParamUnit {
  PERCENTAGE = 'PERCENTAGE',
  SECONDS = 'SECONDS',
}

export interface TemplateFloatParam {
  has_default: boolean;
  has_min: boolean;
  has_max: boolean;
  default?: number;
  min?: number;
  max?: number;
}

export interface TemplateParam {
  name: string;
  type: TemplateParamType;
  unit: TemplateParamUnit;
  summary: string;
  float?: TemplateFloatParam;
}

export interface Template {
  summary: string;
  name: string;
  source: keyof typeof SourceDescription;
  created_at: string | undefined;
  yaml: string;
  params?: TemplateParam[];
  expr: string;
}

export interface FormattedTemplate {
  name: string;
  summary: string;
  source: SourceDescription[keyof SourceDescription];
  created_at: string | undefined;
  yaml: string;
}

export interface AlertRuleTemplatesTableProps {
  pendingRequest: boolean;
  data: FormattedTemplate[];
  getAlertRuleTemplates: () => void;
}
