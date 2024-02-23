import { CSSProperties } from 'react';

import { Folder } from 'app/features/alerting/unified/components/rule-editor/RuleFolderPicker';
import { Template } from 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate.types';
import { FiltersForm } from 'app/percona/integrated-alerting/components/TemplateStep/TemplateStep.types';
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

  // TODO: group interval - isn't handled on BE yet.
  evaluateFor?: string;
}

declare module 'react-table' {
  interface Row {
    isExpanded: boolean;
    getToggleRowExpandedProps?: () => void;
  }

  interface HeaderGroup {
    className?: string;
    style?: CSSProperties;
  }
}
