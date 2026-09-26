import React, { useState } from 'react';
import { Copy, Check, Lock, KeyRound, ShieldCheck, Download } from 'lucide-react';
import { EncryptResponse } from '../services/api';

interface ResultDisplayProps {
  title?: string;
  result: EncryptResponse | null;
  plaintext?: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ title = 'Encryption Result', result, plaintext }) => {
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
    <div className="bg-ash border border-charcoal rounded-base p-6 space-y-6 animate-fade-in-up transition-all duration-150 hover:border-graphite">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal gap-4">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-phosphor animate-pulse-phosphor" />
          <h3 className="text-lg font-medium text-snow tracking-tight">
            {title}
          </h3>
          <span className="pill-status !py-0.5 !px-2 !text-xs !border-forest/50 text-phosphor">
            Verified ✓
          </span>
        </div>

        {result && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => downloadJsonFile(result)}
              className="btn-pill-primary !text-xs !py-1.5 !px-3"
              title="Download metadata & ciphertext as JSON file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
            <button
              onClick={() => copyToClipboard(JSON.stringify(result, null, 2), 'all')}
              className="btn-pill-ghost !text-xs !py-1.5 !px-3"
            >
              {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-phosphor" /> : <Copy className="w-3.5 h-3.5" />}
              <span className={copiedKey === 'all' ? 'text-phosphor' : ''}>{copiedKey === 'all' ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Decrypted Plaintext Result */}
      {plaintext !== undefined && plaintext !== null && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-medium text-silver">
              <ShieldCheck className="w-4 h-4 text-phosphor" />
              <span>Decrypted Plaintext Output</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => downloadPlaintextFile(plaintext)}
                className="btn-pill-ghost !py-1 !px-2.5 !text-xs"
                title="Download plaintext as .txt file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save TXT</span>
              </button>
              <button
                onClick={() => copyToClipboard(plaintext, 'plaintext')}
                className="btn-pill-primary !py-1 !px-2.5 !text-xs"
              >
                {copiedKey === 'plaintext' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'plaintext' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <div className="bg-obsidian border border-charcoal rounded-sm p-4 text-snow font-mono text-xs break-all whitespace-pre-wrap leading-relaxed">
            {plaintext}
          </div>
        </div>
      )}

      {/* Ciphertext & Metadata Result */}
      {result && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-obsidian border border-charcoal rounded-sm">
              <span className="text-smoke block text-[11px] mb-0.5">// ALGORITHM</span>
              <p className="text-sm font-medium text-snow uppercase">{result.algorithm}</p>
            </div>
            <div className="p-3 bg-obsidian border border-charcoal rounded-sm">
              <span className="text-smoke block text-[11px] mb-0.5">// KEY DERIVATION FUNCTION</span>
              <p className="text-sm font-medium text-snow uppercase">{result.kdf} (N=16384, r=8, p=1)</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-silver flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-smoke" />
                <span>CIPHERTEXT (BASE64)</span>
              </span>
              <button
                onClick={() => copyToClipboard(result.ciphertext, 'ciphertext')}
                className="text-silver hover:text-snow text-xs flex items-center space-x-1 cursor-pointer transition-colors"
              >
                {copiedKey === 'ciphertext' ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3 text-smoke" />}
                <span className={copiedKey === 'ciphertext' ? 'text-phosphor' : ''}>{copiedKey === 'ciphertext' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-obsidian border border-charcoal text-snow p-3.5 rounded-sm font-mono text-xs break-all max-h-36 overflow-y-auto leading-relaxed selection:bg-phosphor selection:text-obsidian">
              {result.ciphertext}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-smoke flex items-center space-x-1">
                  <KeyRound className="w-3 h-3 text-smoke" />
                  <span>SALT (16B)</span>
                </span>
                <button
                  onClick={() => copyToClipboard(result.salt, 'salt')}
                  className="text-silver hover:text-snow text-[11px] cursor-pointer"
                >
                  {copiedKey === 'salt' ? <span className="text-phosphor">Copied</span> : 'Copy'}
                </button>
              </div>
              <input
                readOnly
                value={result.salt}
                className="w-full text-xs font-mono bg-obsidian border border-charcoal rounded-sm px-2.5 py-1.5 text-snow select-all outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-smoke">NONCE (12B)</span>
                <button
                  onClick={() => copyToClipboard(result.nonce, 'nonce')}
                  className="text-silver hover:text-snow text-[11px] cursor-pointer"
                >
                  {copiedKey === 'nonce' ? <span className="text-phosphor">Copied</span> : 'Copy'}
                </button>
              </div>
              <input
                readOnly
                value={result.nonce}
                className="w-full text-xs font-mono bg-obsidian border border-charcoal rounded-sm px-2.5 py-1.5 text-snow select-all outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-smoke">AUTH TAG (16B)</span>
                <button
                  onClick={() => copyToClipboard(result.tag, 'tag')}
                  className="text-silver hover:text-snow text-[11px] cursor-pointer"
                >
                  {copiedKey === 'tag' ? <span className="text-phosphor">Copied</span> : 'Copy'}
                </button>
              </div>
              <input
                readOnly
                value={result.tag}
                className="w-full text-xs font-mono bg-obsidian border border-charcoal rounded-sm px-2.5 py-1.5 text-snow select-all outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
