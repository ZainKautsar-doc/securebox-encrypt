export interface EncryptRequest {
  plaintext: string;
  password: string;
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305';
}

export interface EncryptResponse {
  algorithm: string;
  kdf: string;
  salt: string;
  nonce: string;
  tag: string;
  ciphertext: string;
}

export interface DecryptRequest {
  ciphertext: string;
  password: string;
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305';
  salt: string;
  nonce: string;
  tag: string;
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

  async encryptFile(
    file: File,
    password: string,
    algorithm: string
  ): Promise<{
    blob: Blob;
    filename: string;
    metadata: {
      algorithm: string;
      kdf: string;
      salt: string;
      nonce: string;
      tag: string;
      file_size: number;
      filename: string;
    };
  }> {
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
    tag: string
  ): Promise<{ blob: Blob; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    formData.append('algorithm', algorithm);
    formData.append('salt', salt);
    formData.append('nonce', nonce);
    formData.append('tag', tag);

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
