import React, { useState } from 'react';
import { useSecureBox } from '../context/SecureBoxContext';
import { 
  History as HistoryIcon, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Lock, 
  Unlock, 
  FileText, 
  FileCheck, 
  BarChart3,
  Filter
} from 'lucide-react';
import { OperationType, HistoryItem } from '../types/history';

export const History: React.FC = () => {
  const { history, deleteHistoryItem, clearHistory, loadIntoDecryptText } = useSecureBox();
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportHistoryJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `securebox-history-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadHistoryItemJson = (item: HistoryItem) => {
    const filename = item.type === 'file-encrypt'
      ? `${item.details.filename || 'file'}-metadata.json`
      : `securebox-${item.algorithm}-${item.id}.json`;
    const blob = new Blob([JSON.stringify(item.details, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getIcon = (type: OperationType) => {
    switch (type) {
      case 'text-encrypt':
        return <Lock className="w-4 h-4 text-indigo-600" />;
      case 'text-decrypt':
        return <Unlock className="w-4 h-4 text-emerald-600" />;
      case 'file-encrypt':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'file-decrypt':
        return <FileCheck className="w-4 h-4 text-teal-600" />;
      case 'benchmark':
        return <BarChart3 className="w-4 h-4 text-purple-600" />;
      default:
        return <HistoryIcon className="w-4 h-4 text-slate-600" />;
    }
  };

  const getTypeBadge = (type: OperationType) => {
    switch (type) {
      case 'text-encrypt':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded border border-indigo-200">Text Encrypt</span>;
      case 'text-decrypt':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">Text Decrypt</span>;
      case 'file-encrypt':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-200">File Encrypt</span>;
      case 'file-decrypt':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-teal-50 text-teal-700 rounded border border-teal-200">File Decrypt</span>;
      case 'benchmark':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-purple-50 text-purple-700 rounded border border-purple-200">Benchmark</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Activity History</h1>
            <p className="text-xs text-slate-500">
              Persistent record of your encryption, decryption, and benchmark operations.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={exportHistoryJson}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export All JSON</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all history?')) {
                  clearHistory();
                }
              }}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center text-slate-400 mr-1 text-xs">
          <Filter className="w-4 h-4 mr-1" />
          <span>Filter:</span>
        </div>
        {[
          { id: 'all', label: 'All Operations' },
          { id: 'text-encrypt', label: 'Text Encrypt' },
          { id: 'text-decrypt', label: 'Text Decrypt' },
          { id: 'file-encrypt', label: 'File Encrypt' },
          { id: 'file-decrypt', label: 'File Decrypt' },
          { id: 'benchmark', label: 'Benchmark' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label} {tab.id === 'all' ? `(${history.length})` : `(${history.filter(h => h.type === tab.id).length})`}
          </button>
        ))}
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No History Records Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filterType === 'all'
              ? 'Perform an encryption, decryption, or benchmark operation to see your activity logged here.'
              : `No activities found for category "${filterType}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{item.title}</span>
                      {getTypeBadge(item.type)}
                      <span className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 text-slate-600 rounded">
                        {item.algorithm.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {item.type === 'text-encrypt' && item.details.ciphertext && (
                    <button
                      onClick={() => loadIntoDecryptText({
                        ciphertext: item.details.ciphertext,
                        salt: item.details.salt,
                        nonce: item.details.nonce,
                        tag: item.details.tag,
                        algorithm: item.algorithm as any,
                      })}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-md transition flex items-center space-x-1"
                      title="Load this encrypted payload into Decrypt form"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Decrypt This</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details Snippet */}
              {item.type === 'text-encrypt' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Ciphertext:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadHistoryItemJson(item)}
                        className="text-indigo-600 hover:underline flex items-center space-x-1 font-sans"
                        title="Download JSON"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download JSON</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(item.details.ciphertext || '', `${item.id}-cipher`)}
                        className="text-indigo-600 hover:underline flex items-center space-x-1 font-sans"
                      >
                        {copiedId === `${item.id}-cipher` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === `${item.id}-cipher` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-emerald-400 p-2 rounded text-[11px] truncate">
                    {item.details.ciphertext}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-sans text-slate-600 text-[11px]">
                    <div><span className="font-semibold">Salt:</span> <span className="font-mono">{item.details.salt?.slice(0, 10)}...</span></div>
                    <div><span className="font-semibold">Nonce:</span> <span className="font-mono">{item.details.nonce?.slice(0, 10)}...</span></div>
                    <div><span className="font-semibold">Tag:</span> <span className="font-mono">{item.details.tag?.slice(0, 10)}...</span></div>
                  </div>
                </div>
              )}

              {item.type === 'text-decrypt' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-900 text-xs">
                    <span className="font-semibold">Decrypted Plaintext:</span>
                    <button
                      onClick={() => copyToClipboard(item.details.plaintext || '', `${item.id}-plain`)}
                      className="text-emerald-700 hover:underline flex items-center space-x-1 font-sans"
                    >
                      {copiedId === `${item.id}-plain` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === `${item.id}-plain` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-emerald-950 whitespace-pre-wrap break-all">
                    {item.details.plaintext}
                  </p>
                </div>
              )}

              {(item.type === 'file-encrypt' || item.type === 'file-decrypt') && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span><strong>File:</strong> {item.details.filename}</span>
                    {item.details.fileSize && (
                      <span className="text-slate-500">{(item.details.fileSize / 1024).toFixed(1)} KB</span>
                    )}
                  </div>
                  {item.details.salt && (
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                      <span>Tag: {item.details.tag?.slice(0, 16)}...</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadHistoryItemJson(item)}
                          className="text-indigo-600 hover:underline flex items-center space-x-1 font-sans"
                          title="Download metadata JSON"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download JSON</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(item.details, null, 2), `${item.id}-meta`)}
                          className="text-indigo-600 hover:underline flex items-center space-x-1 font-sans"
                        >
                          {copiedId === `${item.id}-meta` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === `${item.id}-meta` ? 'Copied' : 'Copy Metadata'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {item.type === 'benchmark' && item.details.benchmarkData && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700">
                  <span className="font-semibold">Benchmark Completed across 1KB, 1MB, and 10MB payloads.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
