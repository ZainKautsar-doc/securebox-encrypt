import React, { useState } from 'react';
import { Copy, Check, Lock, KeyRound, ShieldAlert, Download } from 'lucide-react';
import { EncryptResponse } from '../services/api';

interface ResultDisplayProps {
  title?: string;
  result: EncryptResponse | null;
  plaintext?: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ title = 'Result', result, plaintext }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadJsonFile = (data: EncryptResponse) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `securebox-${data.algorithm}-${timestamp}.json`;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPlaintextFile = (text: string) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `securebox-decrypted-${timestamp}.txt`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!result && !plaintext) return null;

  return (
    <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-6 shadow-none space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-graphite-lift gap-3">
        <h3 className="text-base font-bold text-pure-signal flex items-center space-x-2 font-sans">
          <ShieldAlert className="w-5 h-5 text-electric-indigo" />
          <span>{title}</span>
        </h3>
        {result && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => downloadJsonFile(result)}
              className="btn-primary !py-1.5 !px-3 text-xs"
              title="Download metadata & ciphertext as JSON file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD JSON</span>
            </button>
            <button
              onClick={() => copyToClipboard(JSON.stringify(result, null, 2), 'all')}
              className="btn-secondary !py-1.5 !px-3 text-xs"
            >
              {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-lime-beacon" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all' ? 'COPIED FULL JSON' : 'COPY JSON'}</span>
            </button>
          </div>
        )}
      </div>

      {plaintext !== undefined && plaintext !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">// DECRYPTED PLAINTEXT</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => downloadPlaintextFile(plaintext)}
                className="btn-secondary !py-1 !px-2.5 text-xs"
                title="Download plaintext as .txt file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SAVE TXT</span>
              </button>
              <button
                onClick={() => copyToClipboard(plaintext, 'plaintext')}
                className="btn-primary !py-1 !px-2.5 text-xs"
              >
                {copiedKey === 'plaintext' ? <Check className="w-3.5 h-3.5 text-lime-beacon" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'plaintext' ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>
          </div>
          <div className="bg-midnight-void border border-lime-beacon/40 rounded-sm p-4 text-pure-signal font-mono text-sm break-all whitespace-pre-wrap leading-relaxed">
            {plaintext}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-graphite-lift border border-graphite-lift rounded-sm">
              <span className="text-xs text-smoke font-mono uppercase block mb-0.5">// ALGORITHM</span>
              <p className="text-sm font-bold text-pure-signal uppercase">{result.algorithm}</p>
            </div>
            <div className="p-3 bg-graphite-lift border border-graphite-lift rounded-sm">
              <span className="text-xs text-smoke font-mono uppercase block mb-0.5">// KEY PROTECTION / KDF</span>
              <p className="text-sm font-bold text-pure-signal uppercase">
                {result.key_algorithm ? result.key_algorithm.toUpperCase() : `${result.kdf} (N=16384, r=8, p=1)`}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono text-soft-mist flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-electric-indigo" />
                <span>CIPHERTEXT (BASE64)</span>
              </span>
              <button
                onClick={() => copyToClipboard(result.ciphertext, 'ciphertext')}
                className="text-xs text-periwinkle-veil hover:text-pure-signal flex items-center space-x-1 cursor-pointer"
              >
                {copiedKey === 'ciphertext' ? <Check className="w-3.5 h-3.5 text-lime-beacon" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'ciphertext' ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>
            <div className="bg-midnight-void border border-graphite-lift text-pure-signal p-3.5 rounded-sm font-mono text-xs break-all max-h-36 overflow-y-auto leading-relaxed selection:bg-electric-indigo">
              {result.ciphertext}
            </div>
          </div>

          {result.encrypted_session_key && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-soft-mist flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-electric-indigo" />
                  <span>ENCRYPTED SESSION KEY (RSA-OAEP 2048-BIT BASE64)</span>
                </span>
                <button
                  onClick={() => copyToClipboard(result.encrypted_session_key!, 'enc_session_key')}
                  className="text-xs text-periwinkle-veil hover:text-pure-signal flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'enc_session_key' ? <Check className="w-3.5 h-3.5 text-lime-beacon" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'enc_session_key' ? 'COPIED!' : 'COPY'}</span>
                </button>
              </div>
              <div className="bg-midnight-void border border-graphite-lift text-periwinkle-veil p-3.5 rounded-sm font-mono text-xs break-all max-h-24 overflow-y-auto leading-relaxed">
                {result.encrypted_session_key}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {result.salt && (
              <div>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-soft-mist/70 flex items-center space-x-1">
                    <KeyRound className="w-3.5 h-3.5 text-electric-indigo" />
                    <span>SALT (16B)</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.salt!, 'salt')}
                    className="text-periwinkle-veil hover:text-pure-signal text-[11px] cursor-pointer"
                  >
                    {copiedKey === 'salt' ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
                <input
                  readOnly
                  value={result.salt}
                  className="w-full text-xs font-mono bg-midnight-void border border-graphite-lift rounded-sm px-2.5 py-2 text-pure-signal select-all outline-none"
                />
              </div>
            )}

            <div className={result.salt ? '' : 'md:col-span-1'}>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-soft-mist/70">NONCE (12B)</span>
                <button
                  onClick={() => copyToClipboard(result.nonce, 'nonce')}
                  className="text-periwinkle-veil hover:text-pure-signal text-[11px] cursor-pointer"
                >
                  {copiedKey === 'nonce' ? 'COPIED!' : 'COPY'}
                </button>
              </div>
              <input
                readOnly
                value={result.nonce}
                className="w-full text-xs font-mono bg-midnight-void border border-graphite-lift rounded-sm px-2.5 py-2 text-pure-signal select-all outline-none"
              />
            </div>

            <div className={result.salt ? '' : 'md:col-span-2'}>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-soft-mist/70">AUTH TAG (16B)</span>
                <button
                  onClick={() => copyToClipboard(result.tag, 'tag')}
                  className="text-periwinkle-veil hover:text-pure-signal text-[11px] cursor-pointer"
                >
                  {copiedKey === 'tag' ? 'COPIED!' : 'COPY'}
                </button>
              </div>
              <input
                readOnly
                value={result.tag}
                className="w-full text-xs font-mono bg-midnight-void border border-graphite-lift rounded-sm px-2.5 py-2 text-pure-signal select-all outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
