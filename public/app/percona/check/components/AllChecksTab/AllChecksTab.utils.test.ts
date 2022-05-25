import { getFiltersFromUrlParams } from './AllChecksTab.utils';

describe('AllChecks utils', () => {
  test('getFiltersFromUrlParams', () => {
    expect(
      getFiltersFromUrlParams({ name: 'john', description: 'foo', status: 'enabled', interval: 'frequent' })
    ).toEqual({ name: 'john', description: 'foo', status: 'enabled', interval: 'frequent' });

    expect(getFiltersFromUrlParams({})).toEqual({
      name: '',
      description: '',
      status: 'all',
      interval: 'all',
    });

    expect(getFiltersFromUrlParams({ name: 'john', status: 'enabled', interval: 'frequent' })).toEqual({
      name: 'john',
      description: '',
      status: 'enabled',
      interval: 'frequent',
    });
  });
});
