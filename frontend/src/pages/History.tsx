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
        return <Lock className="w-4 h-4 text-phosphor" />;
      case 'text-decrypt':
        return <Unlock className="w-4 h-4 text-phosphor" />;
      case 'file-encrypt':
        return <FileText className="w-4 h-4 text-phosphor" />;
      case 'file-decrypt':
        return <FileCheck className="w-4 h-4 text-phosphor" />;
      case 'benchmark':
        return <BarChart3 className="w-4 h-4 text-phosphor" />;
      default:
        return <HistoryIcon className="w-4 h-4 text-smoke" />;
    }
  };

  const getTypeBadge = (type: OperationType) => {
    switch (type) {
      case 'text-encrypt':
        return <span className="pill-status !py-0.5 !px-2 text-phosphor !border-forest/40">Text Encrypt</span>;
      case 'text-decrypt':
        return <span className="pill-status !py-0.5 !px-2 text-phosphor !border-forest/40">Text Decrypt</span>;
      case 'file-encrypt':
        return <span className="pill-status !py-0.5 !px-2 text-silver">File Encrypt</span>;
      case 'file-decrypt':
        return <span className="pill-status !py-0.5 !px-2 text-silver">File Decrypt</span>;
      case 'benchmark':
        return <span className="pill-status !py-0.5 !px-2 text-silver">Benchmark</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-ash border border-charcoal text-phosphor rounded-base flex items-center justify-center">
            <HistoryIcon className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h1 className="text-2xl font-normal tracking-tight text-snow">Activity History</h1>
            <p className="text-xs font-mono text-smoke mt-0.5">
              Local persistent protocol logs // Zero plaintext stored on remote servers
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={exportHistoryJson}
              className="btn-pill-ghost !py-1.5 !px-3.5 !text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All JSON</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Clear all local cryptographic history records?')) {
                  clearHistory();
                }
              }}
              className="btn-pill-ghost !py-1.5 !px-3.5 !text-xs !border-charcoal hover:!border-smoke text-smoke hover:text-snow"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center text-smoke mr-1 text-xs">
          <Filter className="w-3.5 h-3.5 mr-1 text-phosphor" />
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
            className={`pill-status cursor-pointer transition-all duration-150 hover:border-graphite ${
              filterType === tab.id
                ? '!border-phosphor text-snow bg-ash'
                : 'text-silver hover:text-snow'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-xs text-smoke font-mono">
              {tab.id === 'all' ? `(${history.length})` : `(${history.filter(h => h.type === tab.id).length})`}
            </span>
          </button>
        ))}
      </div>

      {/* History Items List (Obsidian bg, Charcoal border, 16px radius, hover scale(1.01)) */}
      {filteredHistory.length === 0 ? (
        <div className="bg-obsidian border border-charcoal rounded-base p-12 text-center">
          <div className="w-12 h-12 bg-ash text-smoke rounded-base flex items-center justify-center mx-auto mb-3">
            <HistoryIcon className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-medium text-snow">No History Records Found</h3>
          <p className="text-xs text-smoke mt-1 max-w-sm mx-auto font-normal">
            {filterType === 'all'
              ? 'Execute encryption, decryption, or benchmark operations to view logs recorded here.'
              : `No activity found matching filter "${filterType}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div 
              key={item.id} 
              className="bg-obsidian hover:bg-white/[0.01] border border-charcoal hover:border-graphite rounded-base p-5 space-y-3.5 transition-all duration-150 hover:scale-[1.01]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-ash border border-charcoal rounded-sm mt-0.5 text-phosphor">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm text-snow">{item.title}</span>
                      {getTypeBadge(item.type)}
                      <span className="text-xs font-mono text-smoke">
                        {item.algorithm.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-smoke block mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {item.type === 'text-encrypt' && item.details.ciphertext && (
                    <button
                      onClick={() => loadIntoDecryptText({
                        ciphertext: item.details.ciphertext,
                        salt: item.details.salt,
                        nonce: item.details.nonce,
                        tag: item.details.tag,
                        algorithm: item.algorithm as any,
                      })}
                      className="btn-pill-primary !py-1 !px-3 !text-xs"
                      title="Load into Decrypt Form"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Decrypt</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-1.5 text-smoke hover:text-snow rounded-full hover:bg-ash transition cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details Snippet */}
              {item.type === 'text-encrypt' && (
                <div className="bg-ash border border-charcoal rounded-sm p-3.5 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-silver">
                    <span className="text-smoke">// CIPHERTEXT</span>
                    <div className="flex items-center space-x-3 text-xs font-sans">
                      <button
                        onClick={() => downloadHistoryItemJson(item)}
                        className="text-silver hover:text-snow flex items-center space-x-1 cursor-pointer transition-colors"
                        title="Download JSON"
                      >
                        <Download className="w-3 h-3" />
                        <span>JSON</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(item.details.ciphertext || '', `${item.id}-cipher`)}
                        className="text-silver hover:text-snow flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        {copiedId === `${item.id}-cipher` ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3 text-smoke" />}
                        <span className={copiedId === `${item.id}-cipher` ? 'text-phosphor' : ''}>{copiedId === `${item.id}-cipher` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-obsidian border border-charcoal text-snow p-2.5 rounded-sm text-xs truncate">
                    {item.details.ciphertext}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-smoke text-xs pt-1 border-t border-charcoal">
                    <div><span>Salt:</span> <span className="text-silver font-mono">{item.details.salt?.slice(0, 12)}...</span></div>
                    <div><span>Nonce:</span> <span className="text-silver font-mono">{item.details.nonce?.slice(0, 12)}...</span></div>
                    <div><span>Tag:</span> <span className="text-silver font-mono">{item.details.tag?.slice(0, 12)}...</span></div>
                  </div>
                </div>
              )}

              {item.type === 'text-decrypt' && (
                <div className="bg-ash border border-charcoal rounded-sm p-3.5 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-phosphor font-medium">// DECRYPTED PLAINTEXT</span>
                    <button
                      onClick={() => copyToClipboard(item.details.plaintext || '', `${item.id}-plain`)}
                      className="text-silver hover:text-snow flex items-center space-x-1 cursor-pointer transition-colors font-sans"
                    >
                      {copiedId === `${item.id}-plain` ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3 text-smoke" />}
                      <span className={copiedId === `${item.id}-plain` ? 'text-phosphor' : ''}>{copiedId === `${item.id}-plain` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-snow whitespace-pre-wrap break-all leading-relaxed">
                    {item.details.plaintext}
                  </p>
                </div>
              )}

              {(item.type === 'file-encrypt' || item.type === 'file-decrypt') && (
                <div className="bg-ash border border-charcoal rounded-sm p-3.5 text-xs space-y-2">
                  <div className="flex items-center justify-between text-silver">
                    <span>File: <strong className="text-snow font-medium">{item.details.filename}</strong></span>
                    {item.details.fileSize && (
                      <span className="text-smoke">{(item.details.fileSize / 1024).toFixed(1)} KB</span>
                    )}
                  </div>
                  {item.details.salt && (
                    <div className="flex items-center justify-between text-xs text-smoke pt-1 border-t border-charcoal">
                      <span>Tag: {item.details.tag?.slice(0, 16)}...</span>
                      <div className="flex items-center space-x-3 font-sans">
                        <button
                          onClick={() => downloadHistoryItemJson(item)}
                          className="text-silver hover:text-snow flex items-center space-x-1 cursor-pointer transition-colors"
                          title="Download metadata JSON"
                        >
                          <Download className="w-3 h-3" />
                          <span>JSON</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(item.details, null, 2), `${item.id}-meta`)}
                          className="text-silver hover:text-snow flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          {copiedId === `${item.id}-meta` ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3 text-smoke" />}
                          <span className={copiedId === `${item.id}-meta` ? 'text-phosphor' : ''}>{copiedId === `${item.id}-meta` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {item.type === 'benchmark' && item.details.benchmarkData && (
                <div className="bg-ash border border-charcoal rounded-sm p-3 text-xs text-silver">
                  <span>Benchmark completed across 1KB, 1MB, and 10MB encrypt/decrypt cycles.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
