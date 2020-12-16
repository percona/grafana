import { AddAlertRuleFormValues, NotificationChannel, Severity } from './AddAlertRuleModal.types';
import { formatCreateAPIPayload, formatFilter, formatFilters, formatTemplateOptions } from './AddAlertRuleModal.utils';

describe('AddAlertRuleModal utils', () => {
  test('formatFilter', () => {
    expect(formatFilter('key=value')).toEqual({
      key: 'key',
      value: 'value',
      type: 'EQUAL',
    });

    expect(formatFilter('key=')).toEqual({
      key: 'key',
      value: '',
      type: 'EQUAL',
    });

    expect(formatFilter('=')).toEqual({
      key: '',
      value: '',
      type: 'EQUAL',
    });

    expect(formatFilter('=value')).toEqual({
      key: '',
      value: 'value',
      type: 'EQUAL',
    });

    expect(formatFilter('')).toEqual({
      key: '',
      value: '',
      type: 'EQUAL',
    });
  });

  test('formatFilters', () => {
    expect(formatFilters('')).toEqual([]);
    expect(formatFilters('=')).toEqual([
      {
        key: '',
        value: '',
        type: 'EQUAL',
      },
    ]);
    expect(formatFilters('test=xyz')).toEqual([
      {
        key: 'test',
        value: 'xyz',
        type: 'EQUAL',
      },
    ]);
    expect(formatFilters('  test=xyz, ijk=,   foo =bar,\nzyx=abc, \naaa=   zzz ')).toEqual([
      {
        key: 'test',
        value: 'xyz',
        type: 'EQUAL',
      },
      {
        key: 'ijk',
        value: '',
        type: 'EQUAL',
      },
      {
        key: 'foo ',
        value: 'bar',
        type: 'EQUAL',
      },
      {
        key: 'zyx',
        value: 'abc',
        type: 'EQUAL',
      },
      {
        key: 'aaa',
        value: '   zzz',
        type: 'EQUAL',
      },
    ]);
  });

  test('formatTemplateOptions', () => {
    expect(formatTemplateOptions([])).toEqual([]);
    expect(
      formatTemplateOptions([
        { summary: 'test summary 1', name: 'testsum1', source: 'SAAS', created_at: 'test', yaml: 'test' },
        { summary: '', name: '', source: 'SAAS', created_at: 'test', yaml: 'test' },
        { summary: '   ', name: 'test2', source: 'SAAS', created_at: 'test', yaml: 'test' },
      ])
    ).toEqual([
      {
        value: 'test summary 1',
        label: 'test summary 1',
      },
      {
        value: '',
        label: '',
      },
      {
        value: '   ',
        label: '   ',
      },
    ]);
  });

  test('formatCreateAPIPayload', () => {
    const inputData: AddAlertRuleFormValues = {
      enabled: false,
      duration: 123,
      filters: 'test=filter,',
      name: 'test name',
      notificationChannels: [
        { value: NotificationChannel.pagerDuty, label: 'Pager Duty' },
        { value: NotificationChannel.email, label: 'email' },
        { value: NotificationChannel.slack, label: 'Slack' },
      ],
      severity: { value: Severity.SEVERITY_CRITICAL, label: 'Critical' },
      template: { value: 'Test Template', label: 'Test Template' },
      threshold: 'true',
    };
    expect(formatCreateAPIPayload(inputData)).toEqual({
      custom_labels: {},
      disabled: true,
      channel_ids: [NotificationChannel.pagerDuty, NotificationChannel.email, NotificationChannel.slack],
      filters: [
        {
          key: 'test',
          value: 'filter',
          type: 'EQUAL',
        },
        {
          key: '',
          value: '',
          type: 'EQUAL',
        },
      ],
      for: '123s',
      params: [],
      severity: Severity.SEVERITY_CRITICAL,
      template_name: 'Test Template',
      threshold: 'true',
      summary: 'test name',
    });
  });
});
