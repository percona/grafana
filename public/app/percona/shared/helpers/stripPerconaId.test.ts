import { stripPerconaApiId, formatPerconaApiId } from './stripPerconaId';

const originalPlatformCore = jest.requireActual('@percona/platform-core');

jest.mock('@percona/platform-core', () => ({
  ...originalPlatformCore,
  logger: {
    error: jest.fn(),
  },
}));

describe('FailedChecksTab::utils', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('stripPerconaApiId', () => {
    expect(stripPerconaApiId('', 'service_id')).toBe('');
    expect(stripPerconaApiId('service_id/service1', 'service_id')).toBe('');
    expect(stripPerconaApiId('/service_idservice1', 'service_id')).toBe('');
    expect(stripPerconaApiId('/service_id/', 'service_id')).toBe('');
    expect(stripPerconaApiId('/service_id/service1', 'service_id')).toBe('service1');
  });

  test('formatPerconaApiId', () => {
    expect(formatPerconaApiId('', 'service_id')).toBe('/service_id/');
    expect(formatPerconaApiId('service1', 'service_id')).toBe('/service_id/service1');
  });
});
