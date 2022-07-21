import {
  TemplateFloatParam,
  TemplateParamUnit,
} from 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate.types';
import { beautifyUnit } from 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate.utils';

export const Messages = {
  channels: {
    email: 'Email',
    pagerDuty: 'PagerDuty',
    slack: 'Slack',
  },
  tooltips: {
    template: 'The alert template to use for this rule.',
    name: 'The name for this rule.',
    duration: 'The alert query duration, in seconds.',
    severity: 'The severity level for the alert triggered by this rule.',
    channels: 'Which contact points should be used to send the alert through.',
    filters: 'Apply rule only to required services or nodes.',
  },
  filter: {
    header: 'Filters',
    addButton: 'Add Filter',
    fieldLabel: 'Label',
    fieldOperators: 'Operators',
    fieldValue: 'Value',
  },
  title: 'Add Alert Rule',
  addRuleTitle: 'Add Alert Rule',
  editRuleTitle: 'Edit Alert Rule',
  create: 'Add',
  update: 'Save',
  cancel: 'Cancel',
  createSuccess: 'Alert rule created',
  updateSuccess: 'Alert rule updated',
  templateField: 'Template',
  nameField: 'Name',
  thresholdField: 'Threshold',
  durationField: 'Duration (s)',
  severityField: 'Severity',
  channelField: 'Contact points',
  activateSwitch: 'Activate',
  templateExpression: 'Template Expression',
  ruleAlert: 'Rule Alert',
  advanced: 'Advanced details',
  getFloatDescription: (name: string, summary: string, unit: TemplateParamUnit, float?: TemplateFloatParam) => {
    if (!float) {
      return '';
    }

    const lowerCaseNameSentenceArr = name.toLowerCase().split(' ');
    const capitalizedSentence = lowerCaseNameSentenceArr
      .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
      .join(' ');
    const { hasMin, hasMax, min = 0, max = 0 } = float;
    const paramDetails: string[] = [beautifyUnit(unit)];

    if (hasMin) {
      paramDetails.push(`min: ${min}`);
    }

    if (hasMax) {
      paramDetails.push(`max: ${max}`);
    }

    return `${capitalizedSentence} - ${summary} (${paramDetails.join(', ')})`;
  },
};
