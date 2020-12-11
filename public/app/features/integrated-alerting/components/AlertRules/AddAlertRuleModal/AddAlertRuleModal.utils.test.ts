import { formatFilter } from './AddAlertRuleModal.utils';

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
});
