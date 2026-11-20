import { apiInventory } from 'app/percona/shared/helpers/api';

/**
 * The fields of a payload that PMM Server stores in the Vault secret of the agent when it has a Vault path: the
 * password, and the TLS files.
 */
export const SEALED_FIELDS = [
  'password',
  'tls_ca',
  'tls_cert',
  'tls_key',
  'tls_certificate_key',
  'tls_certificate_key_file_password',
];

const VAULT_REF_PREFIX = 'vault:';
const SEALED_PATH_PREFIX = 'pmm-agent-sealed/';
const SEALING_INFO = 'pmm-agent-sealed v1';
const NONCE_LENGTH = 12;

interface SealingKeyResponse {
  pmm_agent_id: string;
  public_key: string;
  algorithm: string;
}

const base64ToBytes = (base64: string): Uint8Array<ArrayBuffer> =>
  Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

const bytesToBase64Url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

/**
 * Seals value, the value of key in the Vault secret, to the public key of a pmm-agent, an uncompressed P-256 point, as
 * pmm-agent opens it: ECDH with an ephemeral key, HKDF with SHA-256 for an AES-256 key, and AES-GCM. Returns the
 * reference that carries it, which PMM Server passes on to that pmm-agent without being able to read it.
 */
export const seal = async (publicKey: Uint8Array<ArrayBuffer>, key: string, value: string): Promise<string> => {
  const { subtle } = globalThis.crypto;
  const recipient = await subtle.importKey('raw', publicKey, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const ephemeral = await subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const shared = await subtle.deriveBits({ name: 'ECDH', public: recipient }, ephemeral.privateKey, 256);
  const hkdf = await subtle.importKey('raw', shared, 'HKDF', false, ['deriveKey']);
  const aesKey = await subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: new TextEncoder().encode(SEALING_INFO) },
    hkdf,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const nonce = globalThis.crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));
  const ciphertext = new Uint8Array(
    await subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, new TextEncoder().encode(value))
  );
  const ephemeralPublicKey = new Uint8Array(await subtle.exportKey('raw', ephemeral.publicKey));

  const sealed = new Uint8Array(ephemeralPublicKey.length + nonce.length + ciphertext.length);
  sealed.set(ephemeralPublicKey);
  sealed.set(nonce, ephemeralPublicKey.length);
  sealed.set(ciphertext, ephemeralPublicKey.length + nonce.length);
  return `${VAULT_REF_PREFIX}${SEALED_PATH_PREFIX}${bytesToBase64Url(sealed)}#${key}`;
};

/**
 * Seals the secrets of a payload with a Vault path to the key of its pmm-agent, so that they reach Vault through
 * that pmm-agent alone, and PMM Server passes them on unread. A payload without a Vault path, or for a pmm-agent
 * that does not seal secrets, is returned as it is: PMM Server passes the secrets on without storing them then.
 */
export const sealSecrets = async <T extends object>(payload: T): Promise<T> => {
  const values = new Map<string, unknown>(Object.entries(payload));
  const vaultPath = values.get('vault_path');
  const agentId = values.get('pmm_agent_id');
  if (typeof vaultPath !== 'string' || !vaultPath || typeof agentId !== 'string' || !agentId) {
    return payload;
  }

  const fields = SEALED_FIELDS.filter((field) => {
    const value = values.get(field);
    return typeof value === 'string' && value !== '' && !value.startsWith(VAULT_REF_PREFIX);
  });
  if (!fields.length) {
    return payload;
  }

  let publicKey: Uint8Array<ArrayBuffer>;
  try {
    const key = await apiInventory.get<SealingKeyResponse, void>(
      `/agents/${encodeURIComponent(agentId)}/sealing-key`,
      true
    );
    publicKey = base64ToBytes(key.public_key);
  } catch {
    return payload;
  }

  const sealed: Record<string, string> = {};
  for (const field of fields) {
    sealed[field] = await seal(publicKey, field, String(values.get(field)));
  }
  return { ...payload, ...sealed };
};
