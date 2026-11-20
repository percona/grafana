import { webcrypto } from 'crypto';

import { apiInventory } from 'app/percona/shared/helpers/api';

import { seal, sealSecrets } from './sealSecrets';

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
}

const base64UrlToBytes = (s: string): Uint8Array =>
  Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

// Opens a sealed reference as pmm-agent does, with the private key of the recipient.
const open = async (privateKey: CryptoKey, ref: string): Promise<string> => {
  const match = ref.match(/^vault:pmm-agent-sealed\/([A-Za-z0-9_-]+)#.+$/);
  expect(match).not.toBeNull();
  const sealed = base64UrlToBytes(match![1]);
  const { subtle } = globalThis.crypto;
  const ephemeral = await subtle.importKey(
    'raw',
    sealed.slice(0, 65),
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );
  const shared = await subtle.deriveBits({ name: 'ECDH', public: ephemeral }, privateKey, 256);
  const hkdf = await subtle.importKey('raw', shared, 'HKDF', false, ['deriveKey']);
  const aesKey = await subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: new TextEncoder().encode('pmm-agent-sealed v1') },
    hkdf,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  const value = await subtle.decrypt({ name: 'AES-GCM', iv: sealed.slice(65, 77) }, aesKey, sealed.slice(77));
  return new TextDecoder().decode(value);
};

const recipient = async () => {
  const keys = await globalThis.crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const publicKey = new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', keys.publicKey));
  return { privateKey: keys.privateKey, publicKey: btoa(String.fromCharCode(...publicKey)) };
};

describe('sealSecrets', () => {
  afterEach(() => jest.restoreAllMocks());

  it('seals the secrets to store in Vault to the key of the pmm-agent', async () => {
    const { privateKey, publicKey } = await recipient();
    const get = jest.spyOn(apiInventory, 'get').mockResolvedValue({
      pmm_agent_id: 'pmm-server',
      public_key: publicKey,
      algorithm: 'ECDH-P256+HKDF-SHA256+AES-256-GCM',
    });

    const payload = {
      vault_path: 'secret/data/pmm/mysql',
      pmm_agent_id: 'pmm-server',
      username: 'pmm',
      password: 'p@ss:w/rd#?',
      tls_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQ\n-----END PRIVATE KEY-----\n',
      tls_ca: 'vault:secret/data/pmm/ca#ca',
      port: 3306,
    };
    const sealed = await sealSecrets(payload);

    expect(get).toHaveBeenCalledWith('/agents/pmm-server/sealing-key', true);
    expect(sealed.password).toMatch(/^vault:pmm-agent-sealed\/[A-Za-z0-9_-]+#password$/);
    expect(sealed.tls_key).toMatch(/#tls_key$/);
    expect(await open(privateKey, sealed.password)).toBe(payload.password);
    expect(await open(privateKey, sealed.tls_key)).toBe(payload.tls_key);
    expect(sealed.tls_ca).toBe(payload.tls_ca);
    expect(sealed.username).toBe('pmm');
    expect(sealed.port).toBe(3306);
    expect(payload.password).toBe('p@ss:w/rd#?');
  });

  it('leaves a payload without a Vault path as it is', async () => {
    const get = jest.spyOn(apiInventory, 'get');
    const payload = { pmm_agent_id: 'pmm-server', password: 's3cr3t' };

    expect(await sealSecrets(payload)).toBe(payload);
    expect(get).not.toHaveBeenCalled();
  });

  it('leaves the secrets for a pmm-agent that does not seal them as they are', async () => {
    jest.spyOn(apiInventory, 'get').mockRejectedValue(new Error('Request failed with status code 409'));
    const payload = { vault_path: 'secret/data/pmm/mysql', pmm_agent_id: 'pmm-server', password: 's3cr3t' };

    expect(await sealSecrets(payload)).toBe(payload);
  });

  it('seals for the key of pmm-agent only', async () => {
    const { publicKey } = await recipient();
    const other = await recipient();
    const ref = await seal(
      Uint8Array.from(atob(publicKey), (c) => c.charCodeAt(0)),
      'password',
      's3cr3t'
    );

    await expect(open(other.privateKey, ref)).rejects.toThrow();
  });
});
