export type QuickInstallTech = 'mysql' | 'postgresql' | 'mongodb' | 'valkey';

const shellEscape = (value: string): string => `'${value.replace(/'/g, `'\\''`)}'`;

/**
 * Minimal install command: install pmm-client, configure pmm-agent, add selected DB with defaults.
 * DB credentials are prompted on the node by install-pmm-client.sh when not passed via env.
 * When `token` is omitted, PMM_SERVER_URL uses the literal placeholder `<TOKEN>` (paste a Grafana service account token).
 *
 * Aligns with PMM "Install PMM Client" page: curl -k, sudo -E, bash -s -- --pmm-server-insecure-tls.
 */
export function buildQuickInstallCommand(tech: QuickInstallTech, token?: string): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const protocol = window.location.protocol;
  const host = window.location.hostname;
  const port = window.location.port || (protocol === 'https:' ? '443' : '80');
  const origin = `${protocol}//${window.location.host}`;
  const scriptUrl = `${origin}/pmm-static/install-pmm-client.sh`;
  const tokenForUrl = token ? encodeURIComponent(token) : '<TOKEN>';
  const serverUrl = `https://service_token:${tokenForUrl}@${host}:${port}`;

  const curl = `curl -fsSLk ${shellEscape(scriptUrl)}`;

  return [
    `${curl} | sudo -E env \\`,
    `  PMM_SERVER_URL=${shellEscape(serverUrl)} \\`,
    `  TECH=${shellEscape(tech)} \\`,
    `bash -s -- \\`,
    `  --pmm-server-insecure-tls`,
  ].join('\n');
}
