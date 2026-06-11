import { buildQuickInstallCommand, QuickInstallTech } from './NodesInstallCommand.utils';

describe('buildQuickInstallCommand', () => {
  it('wraps the downloaded script path in single quotes', () => {
    const cmd = buildQuickInstallCommand('mysql');
    expect(cmd).toContain("'/tmp/install-pmm-client.sh'");
  });

  it('URL-encodes the token before embedding it in --pmm-server-url', () => {
    const cmd = buildQuickInstallCommand('mysql', 'abc:def@ghi/');
    expect(cmd).toContain('service_token:abc%3Adef%40ghi%2F@');
  });

  it('emits <TOKEN> placeholder when no token is provided', () => {
    const cmd = buildQuickInstallCommand('mysql');
    expect(cmd).toContain('service_token:<TOKEN>@');
  });

  it.each<QuickInstallTech>(['mysql', 'postgresql', 'mongodb', 'valkey'])(
    'includes the selected tech in the --tech flag (%s)',
    (tech) => {
      const cmd = buildQuickInstallCommand(tech);
      expect(cmd).toContain(`--tech '${tech}'`);
    }
  );
});
