import React, { useState } from 'react';
import { Copy, Check, Lock, KeyRound, ShieldAlert } from 'lucide-react';
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

  if (!result && !plaintext) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <h3 className="text-base font-semibold text-slate-800 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-indigo-600" />
          <span>{title}</span>
        </h3>
        {result && (
          <button
            onClick={() => copyToClipboard(JSON.stringify(result, null, 2), 'all')}
            className="text-xs flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded font-medium transition"
          >
            {copiedKey === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'all' ? 'Copied Full JSON' : 'Copy JSON'}</span>
          </button>
        )}
      </div>

      {plaintext !== undefined && plaintext !== null && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Decrypted Plaintext</label>
            <button
              onClick={() => copyToClipboard(plaintext, 'plaintext')}
              className="text-xs text-indigo-600 hover:underline flex items-center space-x-1"
            >
              {copiedKey === 'plaintext' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'plaintext' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 text-emerald-950 font-mono text-sm break-all whitespace-pre-wrap">
            {plaintext}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 font-medium">Algorithm</span>
              <p className="text-sm font-semibold text-slate-800 uppercase">{result.algorithm}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 font-medium">Key Derivation (KDF)</span>
              <p className="text-sm font-semibold text-slate-800 uppercase">{result.kdf} (N=16384, r=8, p=1)</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-600 flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Ciphertext (Base64)</span>
              </span>
              <button
                onClick={() => copyToClipboard(result.ciphertext, 'ciphertext')}
                className="text-xs text-indigo-600 hover:underline flex items-center space-x-1"
              >
                {copiedKey === 'ciphertext' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'ciphertext' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-xs break-all max-h-32 overflow-y-auto">
              {result.ciphertext}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-600 flex items-center space-x-1">
                  <KeyRound className="w-3 h-3" />
                  <span>Salt (16B Base64)</span>
                </span>
                <button
                  onClick={() => copyToClipboard(result.salt, 'salt')}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {copiedKey === 'salt' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <input
                readOnly
                value={result.salt}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-600">Nonce (12B Base64)</span>
                <button
                  onClick={() => copyToClipboard(result.nonce, 'nonce')}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {copiedKey === 'nonce' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <input
                readOnly
                value={result.nonce}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-600">Tag (16B Base64)</span>
                <button
                  onClick={() => copyToClipboard(result.tag, 'tag')}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {copiedKey === 'tag' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <input
                readOnly
                value={result.tag}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
