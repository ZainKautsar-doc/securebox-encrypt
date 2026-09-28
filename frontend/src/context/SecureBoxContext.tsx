import React, { createContext, useContext, useState, useEffect } from 'react';
import { HistoryItem } from '../types/history';
import { EncryptResponse, BenchmarkResponse } from '../services/api';

interface EncryptTextState {
  plaintext: string;
  password: string;
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid';
  result: EncryptResponse | null;
}

interface DecryptTextState {
  ciphertext: string;
  password: string;
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid';
  salt: string;
  encrypted_session_key: string;
  nonce: string;
  tag: string;
  checksum_sha256?: string;
  plaintext: string | null;
}

interface FileEncryptState {
  password: string;
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid';
  downloadInfo: {
    url?: string;
    filename: string;
    metadata: any;
  } | null;
}

interface FileDecryptState {
  password: string;
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid';
  salt: string;
  encrypted_session_key: string;
  nonce: string;
  tag: string;
  checksum?: string;
}


interface SecureBoxContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  history: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  
  // In-memory Form States (preserved when switching tabs, reset on page refresh)
  encryptTextState: EncryptTextState;
  setEncryptTextState: React.Dispatch<React.SetStateAction<EncryptTextState>>;
  decryptTextState: DecryptTextState;
  setDecryptTextState: React.Dispatch<React.SetStateAction<DecryptTextState>>;
  fileEncryptState: FileEncryptState;
  setFileEncryptState: React.Dispatch<React.SetStateAction<FileEncryptState>>;
  fileDecryptState: FileDecryptState;
  setFileDecryptState: React.Dispatch<React.SetStateAction<FileDecryptState>>;
  benchmarkResults: BenchmarkResponse[] | null;
  setBenchmarkResults: React.Dispatch<React.SetStateAction<BenchmarkResponse[] | null>>;

  loadIntoDecryptText: (data: {
    ciphertext?: string;
    salt?: string;
    encrypted_session_key?: string;
    nonce?: string;
    tag?: string;
    algorithm?: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid';
    checksum_sha256?: string;
  }) => void;
}


const STORAGE_KEYS = {
  HISTORY: 'securebox_history',
};

const SecureBoxContext = createContext<SecureBoxContextType | undefined>(undefined);

export const SecureBoxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In-memory active tab (starts fresh on refresh, but switches seamlessly without refresh)
  const [activeTab, setActiveTabState] = useState<string>('encrypt');

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  // Activity History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev].slice(0, 100)); // Keep latest 100 items
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  };

  // In-memory Form States:
  // Preserved when navigating between tabs in the app, but cleared upon browser page refresh
  const [encryptTextState, setEncryptTextState] = useState<EncryptTextState>({
    plaintext: '',
    password: '',
    algorithm: 'aes-256-gcm',
    result: null,
  });

  const [decryptTextState, setDecryptTextState] = useState<DecryptTextState>({
    ciphertext: '',
    password: '',
    algorithm: 'aes-256-gcm',
    salt: '',
    encrypted_session_key: '',
    nonce: '',
    tag: '',
    plaintext: null,
  });

  const [fileEncryptState, setFileEncryptState] = useState<FileEncryptState>({
    password: '',
    algorithm: 'aes-256-gcm',
    downloadInfo: null,
  });

  const [fileDecryptState, setFileDecryptState] = useState<FileDecryptState>({
    password: '',
    algorithm: 'aes-256-gcm',
    salt: '',
    encrypted_session_key: '',
    nonce: '',
    tag: '',
  });

  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResponse[] | null>(null);

  const loadIntoDecryptText = (data: {
    ciphertext?: string;
    salt?: string;
    encrypted_session_key?: string;
    nonce?: string;
    tag?: string;
    algorithm?: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid';
    checksum_sha256?: string;
  }) => {
    setDecryptTextState((prev) => ({
      ...prev,
      ciphertext: data.ciphertext ?? prev.ciphertext,
      salt: data.salt ?? prev.salt,
      encrypted_session_key: data.encrypted_session_key ?? prev.encrypted_session_key,
      nonce: data.nonce ?? prev.nonce,
      tag: data.tag ?? prev.tag,
      algorithm: data.algorithm ?? prev.algorithm,
      checksum_sha256: data.checksum_sha256 ?? prev.checksum_sha256,
      plaintext: null,
    }));
    setActiveTab('decrypt');
  };


  return (
    <SecureBoxContext.Provider
      value={{
        activeTab,
        setActiveTab,
        history,
        addHistoryItem,
        deleteHistoryItem,
        clearHistory,
        encryptTextState,
        setEncryptTextState,
        decryptTextState,
        setDecryptTextState,
        fileEncryptState,
        setFileEncryptState,
        fileDecryptState,
        setFileDecryptState,
        benchmarkResults,
        setBenchmarkResults,
        loadIntoDecryptText,
      }}
    >
      {children}
    </SecureBoxContext.Provider>
  );
};

export const useSecureBox = () => {
  const context = useContext(SecureBoxContext);
  if (!context) {
    throw new Error('useSecureBox must be used within a SecureBoxProvider');
  }
  return context;
};
