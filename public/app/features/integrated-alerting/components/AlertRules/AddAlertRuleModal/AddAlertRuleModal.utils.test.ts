import { formatFilter, formatFilters } from './AddAlertRuleModal.utils';

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
});
