export interface EncryptRequest {
  plaintext: string;
  password: string;
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid';
}

export interface EncryptResponse {
  algorithm: string;
  kdf?: string;
  key_algorithm?: string;
  salt?: string;
  encrypted_session_key?: string;
  nonce: string;
  tag: string;
  ciphertext: string;
  checksum_sha256?: string;
}

export interface DecryptRequest {
  ciphertext: string;
  password?: string;
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid';
  salt?: string;
  encrypted_session_key?: string;
  nonce: string;
  tag: string;
  checksum_sha256?: string;
}


export interface HybridEncryptRequest {
  plaintext: string;
}

export interface HybridEncryptResponse {
  algorithm: string;
  key_algorithm: string;
  encrypted_session_key: string;
  nonce: string;
  auth_tag: string;
  ciphertext: string;
}

export interface HybridDecryptRequest {
  encrypted_session_key: string;
  nonce: string;
  auth_tag: string;
  ciphertext: string;
}

export interface DecryptResponse {
  plaintext: string;
  success: boolean;
  message: string;
}

export interface BenchmarkResponse {
  file_size: string;
  aes_encrypt_time: number;
  aes_decrypt_time: number;
  chacha_encrypt_time: number;
  chacha_decrypt_time: number;
}

const API_BASE = 'http://localhost:8000/api';

export const api = {
  async encryptText(data: EncryptRequest): Promise<EncryptResponse> {
    const res = await fetch(`${API_BASE}/crypto/encrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.detail || 'Encryption failed');
    }
    return json;
  },

  async decryptText(data: DecryptRequest): Promise<DecryptResponse> {
    const res = await fetch(`${API_BASE}/crypto/decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.detail || 'Decryption failed');
    }
    return json;
  },

  async encryptHybridText(plaintext: string): Promise<EncryptResponse> {
    const res = await fetch(`${API_BASE}/hybrid/encrypt/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plaintext }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.detail || 'Hybrid encryption failed');
    }
    return {
      algorithm: json.algorithm,
      key_algorithm: json.key_algorithm,
      encrypted_session_key: json.encrypted_session_key,
      nonce: json.nonce,
      tag: json.auth_tag,
      ciphertext: json.ciphertext,
    };
  },

  async decryptHybridText(data: {
    encrypted_session_key: string;
    nonce: string;
    auth_tag: string;
    ciphertext: string;
  }): Promise<DecryptResponse> {
    const res = await fetch(`${API_BASE}/hybrid/decrypt/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.detail || 'Hybrid decryption failed');
    }
    return json;
  },

  async encryptFile(
    file: File,
    password: string,
    algorithm: string
  ): Promise<{
    blob: Blob;
    filename: string;
    metadata: {
      algorithm: string;
      kdf?: string;
      key_algorithm?: string;
      salt?: string;
      encrypted_session_key?: string;
      nonce: string;
      tag: string;
      file_size: number;
      filename: string;
      checksum_sha256?: string;
    };
  }> {
    if (algorithm === 'hybrid') {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/hybrid/encrypt/file`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || json.detail || 'Hybrid file encryption failed');
      }

      const encSessionKey = res.headers.get('X-Crypto-Encrypted-Session-Key') || '';
      const nonce = res.headers.get('X-Crypto-Nonce') || '';
      const tag = res.headers.get('X-Crypto-Tag') || '';
      const keyAlgo = res.headers.get('X-Crypto-Key-Algorithm') || 'rsa-oaep-sha256';
      const algo = res.headers.get('X-Crypto-Algorithm') || 'aes-256-gcm';
      const origFilename = res.headers.get('X-Crypto-Original-Filename') || file.name;
      const fileSize = parseInt(res.headers.get('X-Crypto-File-Size') || '0', 10);

      const blob = await res.blob();
      return {
        blob,
        filename: `${origFilename}.enc`,
        metadata: {
          algorithm: algo,
          key_algorithm: keyAlgo,
          encrypted_session_key: encSessionKey,
          nonce,
          tag,
          file_size: fileSize,
          filename: origFilename,
        },
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    formData.append('algorithm', algorithm);

    const res = await fetch(`${API_BASE}/crypto/file/encrypt`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || json.detail || 'File encryption failed');
    }

    const salt = res.headers.get('X-Crypto-Salt') || '';
    const nonce = res.headers.get('X-Crypto-Nonce') || '';
    const tag = res.headers.get('X-Crypto-Tag') || '';
    const checksum = res.headers.get('X-Crypto-Checksum-Sha256') || '';
    const kdf = res.headers.get('X-Crypto-KDF') || 'scrypt';
    const algo = res.headers.get('X-Crypto-Algorithm') || algorithm;
    const origFilename = res.headers.get('X-Crypto-Original-Filename') || file.name;
    const fileSize = parseInt(res.headers.get('X-Crypto-File-Size') || '0', 10);

    const blob = await res.blob();
    return {
      blob,
      filename: `${origFilename}.enc`,
      metadata: {
        algorithm: algo,
        kdf,
        salt,
        nonce,
        tag,
        checksum_sha256: checksum,
        file_size: fileSize,
        filename: origFilename,
      },
    };
  },

  async decryptFile(
    file: File,
    password: string,
    algorithm: string,
    salt: string,
    nonce: string,
    tag: string,
    encrypted_session_key?: string,
    checksum?: string
  ): Promise<{ blob: Blob; filename: string }> {
    if (algorithm === 'hybrid') {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('encrypted_session_key', encrypted_session_key || '');
      formData.append('nonce', nonce);
      formData.append('tag', tag);

      const res = await fetch(`${API_BASE}/hybrid/decrypt/file`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || json.detail || 'Hybrid file decryption failed');
      }

      let disposition = res.headers.get('Content-Disposition') || '';
      let filename = file.name.replace(/\.enc$/i, '');
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }

      const blob = await res.blob();
      return { blob, filename };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    formData.append('algorithm', algorithm);
    formData.append('salt', salt);
    formData.append('nonce', nonce);
    formData.append('tag', tag);
    if (checksum) {
      formData.append('checksum', checksum);
    }

    const res = await fetch(`${API_BASE}/crypto/file/decrypt`, {
      method: 'POST',
      body: formData,
    });


    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || json.detail || 'File decryption failed');
    }

    let disposition = res.headers.get('Content-Disposition') || '';
    let filename = file.name.replace(/\.enc$/i, '');
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }

    const blob = await res.blob();
    return { blob, filename };
  },

  async runBenchmark(): Promise<BenchmarkResponse[]> {
    const res = await fetch(`${API_BASE}/crypto/compare`, {
      method: 'POST',
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.detail || 'Benchmark failed');
    }
    return json;
  },
};
