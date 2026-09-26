export type OperationType = 
  | 'text-encrypt'
  | 'text-decrypt'
  | 'file-encrypt'
  | 'file-decrypt'
  | 'benchmark';

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: OperationType;
  algorithm: string;
  title: string;
  details: {
    plaintext?: string;
    ciphertext?: string;
    salt?: string;
    nonce?: string;
    tag?: string;
    kdf?: string;
    filename?: string;
    fileSize?: number;
    benchmarkData?: any[];
    success?: boolean;
    message?: string;
  };
}
