import { CSSProperties } from 'react';

import { Folder } from 'app/features/alerting/unified/types/rule-form';
import { Template } from 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate.types';
import { FiltersForm } from 'app/percona/integrated-alerting/components/TemplateForm/TemplateForm.types';
import { Severity } from 'app/percona/shared/core';

export interface UploadAlertRuleTemplatePayload {
  yaml: string;
}

export interface TemplatedAlertFormValues {
  duration: string;
  filters: FiltersForm[];
  ruleName: string;
  severity: keyof typeof Severity | null;
  template: Template | null;
  folder: Folder | null;
  group: string;
  evaluateEvery: string;
}

declare module 'react-table' {
  export interface Row<D extends object = {}> {
    isExpanded: boolean;
    getToggleRowExpandedProps: (...args: unknown[]) => Record<string, unknown>;
  }

  export interface HeaderGroup<D extends object = {}> {
    className?: string;
    style?: CSSProperties;
  }
}
