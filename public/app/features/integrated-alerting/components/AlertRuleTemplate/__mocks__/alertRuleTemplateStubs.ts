import { FormattedTemplate, Template, TemplateParamType, TemplateParamUnit } from '../AlertRuleTemplate.types';
import { formatTemplates } from '../AlertRuleTemplate.utils';

export const templateStubs: Template[] = [
  {
    name: 'template_1',
    created_at: '2020-11-25T16:53:39.366Z',
    source: 'BUILT_IN',
    summary: 'MySQL database down',
    yaml: 'yaml file content',
    params: [],
    expr: '',
  },
  {
    name: 'template_2',
    created_at: '2020-11-25T16:53:39.366Z',
    source: 'SAAS',
    summary: 'MongoDB database down',
    yaml: 'yaml file content',
    params: [],
    expr: '',
  },
  {
    name: 'template_3',
    created_at: '2020-11-25T16:53:39.366Z',
    source: 'USER_FILE',
    summary: 'High memory consumption',
    yaml: 'yaml file content',
    params: [],
    expr: '',
  },
  {
    name: 'pmm_mongodb_connections_memory_usage',
    created_at: '2020-11-25T16:53:39.366Z',
    source: 'USER_FILE',
    summary: 'Template',
    yaml: 'yaml file content',
    params: [
      {
        name: 'threshold',
        type: TemplateParamType.FLOAT,
        unit: TemplateParamUnit.PERCENTAGE,
        summary: '',
        float: {
          has_default: true,
          has_min: false,
          has_max: false,
          default: 10,
        },
      },
    ],
    expr: '',
  },
];

export const formattedTemplateStubs: FormattedTemplate[] = formatTemplates(templateStubs);
