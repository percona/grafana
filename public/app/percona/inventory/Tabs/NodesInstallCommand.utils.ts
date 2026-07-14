export type QuickInstallTech = 'mysql' | 'postgresql' | 'mongodb' | 'valkey';

const shellEscape = (value: string): string => `'${value.replace(/'/g, `'\\''`)}'`;

/** Same path as PMM UI "Prompt on node" / install-pmm-client.sh docs. */
const DOWNLOADED_SCRIPT_PATH = '/tmp/install-pmm-client.sh';

/**
 * Minimal install command: install pmm-client, configure pmm-agent, add selected DB with defaults.
 * Uses download-then-run (not curl|bash) so install-pmm-client.sh can prompt for DB credentials on a TTY.
 * If DB_USER / DB_PASSWORD (or per-tech MYSQL_* / …) are already exported, `sudo -E` preserves them and prompts are skipped.
 *
 * Aligns with PMM Install PMM Client "Prompt on node" command shape.
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

  const curl = `curl -fsSLk -o ${shellEscape(DOWNLOADED_SCRIPT_PATH)} ${shellEscape(scriptUrl)}`;

  const flags = [
    `--pmm-server-url ${shellEscape(serverUrl)}`,
    `--tech ${shellEscape(tech)}`,
    '--pmm-server-insecure-tls',
  ];

  return [curl, `sudo -E bash ${shellEscape(DOWNLOADED_SCRIPT_PATH)} \\`, `  ${flags.join(' \\\n  ')}`].join('\n');
}
