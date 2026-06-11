import { config } from '@grafana/runtime';

import { api } from 'app/percona/shared/helpers/api';

/**
 * Grafana HTTP API path when `serve_from_sub_path` is true (PMM sets
 * `root_url = https://…/graph`). Browser requests must use `/graph/api/…`,
 * not `/api/…` — the latter hit the host root where nginx does not proxy
 * to Grafana, so service-account calls would fail with 404.
 *
 * @param restPath Path after `/api`, e.g. `/serviceaccounts/search`.
 */
function grafanaHttpApiUrl(restPath: string): string {
  const p = restPath.startsWith('/') ? restPath : `/${restPath}`;
  return `${config.appSubUrl ?? ''}/api${p}`;
}

/**
 * Mints a short-lived Grafana service-account token used by the "Add Node"
 * quick-install command (one-step `install-pmm-client.sh` flow).
 *
 * Implementation note: this used to POST to a PMM backend endpoint
 * (/v1/management/nodes:installToken). That endpoint was removed because
 * the same job can be done by calling Grafana's serviceaccounts API
 * directly — we're already running inside Grafana with the user's session
 * cookie, so there is no extra trust boundary to add. Grafana enforces
 * Admin-only access to `{appSubUrl}/api/serviceaccounts/*`, which is the
 * same gate the removed backend had.
 *
 * Lifecycle mirrors what the old backend did:
 *   - One shared service account per technology ("pmm-install-sa-<tech>"),
 *     created lazily on first use; we don't want one SA per token because
 *     they would accumulate in Grafana forever.
 *   - Each call mints a brand-new token on that SA with a UUID-suffixed
 *     name so concurrent calls don't collide on Grafana's unique-name
 *     constraint per SA.
 *   - Tokens are short-lived (15 min hard cap, matching the previous
 *     server-side cap). Re-run the action to get a fresh one.
 */
export interface CreateNodeInstallTokenResponse {
  token: string;
  expiresAt: string;
}

const MAX_TTL_SECONDS = 15 * 60;
const DEFAULT_TTL_SECONDS = 15 * 60;

const SUPPORTED_TECHNOLOGIES = new Set(['mysql', 'postgresql', 'mongodb', 'valkey']);

const SA_NAME_PREFIX = 'pmm-install-sa';
const TOKEN_NAME_PREFIX = 'pmm-install-st';

interface GrafanaServiceAccount {
  id: number;
  name: string;
}

interface GrafanaServiceAccountSearch {
  totalCount: number;
  serviceAccounts: GrafanaServiceAccount[];
}

interface GrafanaTokenResponse {
  id: number;
  name: string;
  key: string;
}

export async function createNodeInstallToken(
  technology: string,
  ttlSeconds = 0
): Promise<CreateNodeInstallTokenResponse> {
  if (!SUPPORTED_TECHNOLOGIES.has(technology)) {
    throw new Error(`unsupported technology "${technology}"`);
  }

  let ttl = ttlSeconds > 0 ? ttlSeconds : DEFAULT_TTL_SECONDS;
  if (ttl > MAX_TTL_SECONDS) {
    ttl = MAX_TTL_SECONDS;
  }

  const saName = `${SA_NAME_PREFIX}-${technology}`;

  let saId = await findServiceAccountIdByName(saName);
  if (saId === null) {
    saId = await createServiceAccount(saName);
  }

  const tokenName = `${TOKEN_NAME_PREFIX}-${technology}-${crypto.randomUUID()}`;
  const key = await mintToken(saId, tokenName, ttl);

  return {
    token: key,
    expiresAt: new Date(Date.now() + ttl * 1000).toISOString(),
  };
}

async function findServiceAccountIdByName(name: string): Promise<number | null> {
  // Pass disableNotifications=true on all three calls so the single friendly
  // "Could not create install token" toast in the caller is the only one the
  // user sees on failure (api.post would otherwise emit its own toast).
  const res = await api.get<GrafanaServiceAccountSearch, { query: string }>(
    grafanaHttpApiUrl('/serviceaccounts/search'),
    true,
    { params: { query: name } }
  );
  const match = res.serviceAccounts?.find((sa) => sa.name === name) ?? null;
  return match ? match.id : null;
}

async function createServiceAccount(name: string): Promise<number> {
  // Admin role required — `pmm-admin config` / inventory writes need it in
  // real PMM setups, and Grafana itself only lets Admins POST to this route.
  const res = await api.post<GrafanaServiceAccount, { name: string; role: string; isDisabled: boolean }>(
    grafanaHttpApiUrl('/serviceaccounts'),
    { name, role: 'Admin', isDisabled: false },
    true
  );
  return res.id;
}

async function mintToken(serviceAccountId: number, tokenName: string, ttlSeconds: number): Promise<string> {
  // Only name + secondsToLive — passing extra fields (e.g. role) has been
  // observed to make some Grafana versions ignore secondsToLive and fall
  // back to a long default expiry.
  const res = await api.post<GrafanaTokenResponse, { name: string; secondsToLive: number }>(
    grafanaHttpApiUrl(`/serviceaccounts/${serviceAccountId}/tokens`),
    { name: tokenName, secondsToLive: ttlSeconds },
    true
  );
  return res.key;
}
