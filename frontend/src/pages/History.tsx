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
  Filter,
  AlertTriangle,
  X
} from 'lucide-react';
import { OperationType, HistoryItem } from '../types/history';

export const History: React.FC = () => {
  const { history, deleteHistoryItem, clearHistory, loadIntoDecryptText } = useSecureBox();
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // State for Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'single' | 'all';
    targetItem?: HistoryItem;
  }>({
    isOpen: false,
    type: 'single'
  });

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

  const openSingleDeleteModal = (item: HistoryItem) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'single',
      targetItem: item
    });
  };

  const openClearAllModal = () => {
    setDeleteConfirm({
      isOpen: true,
      type: 'all'
    });
  };

  const closeDeleteModal = () => {
    setDeleteConfirm({ isOpen: false, type: 'single', targetItem: undefined });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.type === 'single' && deleteConfirm.targetItem) {
      deleteHistoryItem(deleteConfirm.targetItem.id);
    } else if (deleteConfirm.type === 'all') {
      clearHistory();
    }
    closeDeleteModal();
  };

  const getIcon = (type: OperationType) => {
    switch (type) {
      case 'text-encrypt':
        return <Lock className="w-4 h-4 text-electric-indigo" />;
      case 'text-decrypt':
        return <Unlock className="w-4 h-4 text-lime-beacon" />;
      case 'file-encrypt':
        return <FileText className="w-4 h-4 text-periwinkle-veil" />;
      case 'file-decrypt':
        return <FileCheck className="w-4 h-4 text-lime-beacon" />;
      case 'benchmark':
        return <BarChart3 className="w-4 h-4 text-orchid-whisper" />;
      default:
        return <HistoryIcon className="w-4 h-4 text-soft-mist" />;
    }
  };

  const getTypeBadge = (type: OperationType) => {
    switch (type) {
      case 'text-encrypt':
        return <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-electric-indigo/20 text-pure-signal rounded-sm border border-electric-indigo">TEXT ENCRYPT</span>;
      case 'text-decrypt':
        return <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-lime-beacon/20 text-lime-beacon rounded-sm border border-lime-beacon">TEXT DECRYPT</span>;
      case 'file-encrypt':
        return <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-periwinkle-veil/20 text-periwinkle-veil rounded-sm border border-periwinkle-veil">FILE ENCRYPT</span>;
      case 'file-decrypt':
        return <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-lime-beacon/20 text-lime-beacon rounded-sm border border-lime-beacon">FILE DECRYPT</span>;
      case 'benchmark':
        return <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-orchid-whisper/20 text-orchid-whisper rounded-sm border border-orchid-whisper">BENCHMARK</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-graphite-lift">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
            <HistoryIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-pure-signal">Activity History</h1>
            <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
              LOCAL PERSISTENT PROTOCOL LOGS // ZERO PLAINTEXT SAVED ON REMOTE SERVER
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={exportHistoryJson}
              className="btn-secondary !py-1.5 !px-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT ALL JSON</span>
            </button>
            <button
              onClick={openClearAllModal}
              className="bg-transparent border border-orchid-whisper text-orchid-whisper hover:bg-orchid-whisper/10 font-mono text-xs font-bold uppercase py-1.5 px-3 rounded-sm transition cursor-pointer flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR LOGS</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center text-soft-mist/60 mr-1 text-xs font-mono uppercase">
          <Filter className="w-3.5 h-3.5 mr-1 text-electric-indigo" />
          <span>FILTER:</span>
        </div>
        {[
          { id: 'all', label: 'ALL LOGS' },
          { id: 'text-encrypt', label: 'TEXT ENCRYPT' },
          { id: 'text-decrypt', label: 'TEXT DECRYPT' },
          { id: 'file-encrypt', label: 'FILE ENCRYPT' },
          { id: 'file-decrypt', label: 'FILE DECRYPT' },
          { id: 'benchmark', label: 'BENCHMARK' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-sm font-mono text-xs tracking-wider transition-colors uppercase cursor-pointer border ${
              filterType === tab.id
                ? 'bg-electric-indigo text-pure-signal border-electric-indigo font-bold'
                : 'bg-carbon-panel border-graphite-lift text-soft-mist hover:text-pure-signal hover:bg-graphite-lift'
            }`}
          >
            {tab.label} {tab.id === 'all' ? `(${history.length})` : `(${history.filter(h => h.type === tab.id).length})`}
          </button>
        ))}
      </div>

      {/* History Items List (Carbon Panel, Hover Graphite Lift, 2px radius, Mono metadata) */}
      {filteredHistory.length === 0 ? (
        <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-12 text-center">
          <div className="w-12 h-12 bg-graphite-lift text-soft-mist/40 rounded-sm flex items-center justify-center mx-auto mb-3">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-mono font-bold text-pure-signal uppercase tracking-wider">NO HISTORY LOGS RECORDED</h3>
          <p className="text-xs text-soft-mist/60 mt-1 max-w-sm mx-auto font-mono">
            {filterType === 'all'
              ? 'Execute encryption, decryption, or benchmark routines to view recorded outputs.'
              : `No activity found matching filter "${filterType}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div 
              key={item.id} 
              className="bg-carbon-panel hover:bg-graphite-lift/70 border border-graphite-lift rounded-sm p-5 space-y-3 transition duration-150"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-graphite-lift border border-graphite-lift rounded-sm mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-sans font-bold text-sm text-pure-signal">{item.title}</span>
                      {getTypeBadge(item.type)}
                      <span className="px-2 py-0.5 text-[11px] font-mono bg-graphite-lift text-soft-mist rounded-sm border border-graphite-lift">
                        {item.algorithm.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-soft-mist/50 block mt-1">
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
                      className="btn-primary !py-1 !px-2.5 !text-[11px]"
                      title="Load into Decryption Form"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>DECRYPT</span>
                    </button>
                  )}
                  <button
                    onClick={() => openSingleDeleteModal(item)}
                    className="p-1.5 text-soft-mist/60 hover:text-orchid-whisper rounded-sm transition cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details Snippet */}
              {item.type === 'text-encrypt' && (
                <div className="bg-midnight-void border border-graphite-lift rounded-sm p-3.5 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-soft-mist">
                    <span className="font-bold text-[11px] text-warm-filament">// CIPHERTEXT</span>
                    <div className="flex items-center space-x-3 text-xs">
                      <button
                        onClick={() => downloadHistoryItemJson(item)}
                        className="text-periwinkle-veil hover:text-pure-signal flex items-center space-x-1 cursor-pointer"
                        title="Download JSON"
                      >
                        <Download className="w-3 h-3" />
                        <span>JSON</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(item.details.ciphertext || '', `${item.id}-cipher`)}
                        className="text-periwinkle-veil hover:text-pure-signal flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedId === `${item.id}-cipher` ? <Check className="w-3 h-3 text-lime-beacon" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === `${item.id}-cipher` ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-carbon-panel border border-graphite-lift text-pure-signal p-2.5 rounded-sm text-[11px] truncate">
                    {item.details.ciphertext}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-soft-mist/60 text-[11px] pt-1 border-t border-graphite-lift">
                    <div><span>SALT:</span> <span className="text-pure-signal font-mono">{item.details.salt?.slice(0, 12)}...</span></div>
                    <div><span>NONCE:</span> <span className="text-pure-signal font-mono">{item.details.nonce?.slice(0, 12)}...</span></div>
                    <div><span>TAG:</span> <span className="text-pure-signal font-mono">{item.details.tag?.slice(0, 12)}...</span></div>
                  </div>
                </div>
              )}

              {item.type === 'text-decrypt' && (
                <div className="bg-midnight-void border border-lime-beacon/40 rounded-sm p-3.5 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-lime-beacon">// DECRYPTED PLAINTEXT</span>
                    <button
                      onClick={() => copyToClipboard(item.details.plaintext || '', `${item.id}-plain`)}
                      className="text-periwinkle-veil hover:text-pure-signal flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedId === `${item.id}-plain` ? <Check className="w-3 h-3 text-lime-beacon" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === `${item.id}-plain` ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-pure-signal whitespace-pre-wrap break-all leading-relaxed">
                    {item.details.plaintext}
                  </p>
                </div>
              )}

              {(item.type === 'file-encrypt' || item.type === 'file-decrypt') && (
                <div className="bg-midnight-void border border-graphite-lift rounded-sm p-3.5 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-soft-mist">
                    <span><strong>FILE:</strong> <span className="text-pure-signal">{item.details.filename}</span></span>
                    {item.details.fileSize && (
                      <span className="text-soft-mist/60">{(item.details.fileSize / 1024).toFixed(1)} KB</span>
                    )}
                  </div>
                  {item.details.salt && (
                    <div className="flex items-center justify-between text-[11px] text-soft-mist/60 pt-1 border-t border-graphite-lift">
                      <span>TAG: {item.details.tag?.slice(0, 16)}...</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => downloadHistoryItemJson(item)}
                          className="text-periwinkle-veil hover:text-pure-signal flex items-center space-x-1 cursor-pointer"
                          title="Download metadata JSON"
                        >
                          <Download className="w-3 h-3" />
                          <span>DOWNLOAD JSON</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(item.details, null, 2), `${item.id}-meta`)}
                          className="text-periwinkle-veil hover:text-pure-signal flex items-center space-x-1 cursor-pointer"
                        >
                          {copiedId === `${item.id}-meta` ? <Check className="w-3 h-3 text-lime-beacon" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === `${item.id}-meta` ? 'COPIED' : 'COPY'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {item.type === 'benchmark' && item.details.benchmarkData && (
                <div className="bg-midnight-void border border-graphite-lift rounded-sm p-3 text-xs font-mono text-soft-mist">
                  <span>BENCHMARK COMPLETED ACROSS 1KB, 1MB, AND 10MB ENCRYPT/DECRYPT CYCLES.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Styled Dark Theme Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-void/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-carbon-panel border border-orchid-whisper/50 rounded-sm shadow-2xl max-w-md w-full p-6 space-y-5 relative">
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 text-soft-mist/60 hover:text-pure-signal cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-orchid-whisper/10 border border-orchid-whisper/30 text-orchid-whisper rounded-sm shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-pure-signal tracking-tight uppercase font-sans">
                  {deleteConfirm.type === 'all' ? 'HAPUS SEMUA RIWAYAT' : 'HAPUS CATATAN RIWAYAT'}
                </h3>
                <p className="text-xs font-mono text-soft-mist/70 leading-relaxed">
                  {deleteConfirm.type === 'all'
                    ? 'Apakah Anda yakin ingin menghapus seluruh log riwayat kriptografi? Tindakan ini tidak dapat dibatalkan.'
                    : `Apakah Anda yakin ingin menghapus log "${deleteConfirm.targetItem?.title || 'item ini'}" dari riwayat lokal?`}
                </p>
              </div>
            </div>

            {deleteConfirm.type === 'single' && deleteConfirm.targetItem && (
              <div className="bg-midnight-void border border-graphite-lift rounded-sm p-3 text-xs font-mono text-soft-mist/80 space-y-1">
                <div><span className="text-warm-filament">ALGORITMA:</span> {deleteConfirm.targetItem.algorithm.toUpperCase()}</div>
                <div><span className="text-warm-filament">TIPE:</span> {deleteConfirm.targetItem.type.toUpperCase()}</div>
                <div><span className="text-warm-filament">WAKTU:</span> {new Date(deleteConfirm.targetItem.timestamp).toLocaleString()}</div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-graphite-lift">
              <button
                onClick={closeDeleteModal}
                className="btn-secondary !py-2 !px-4 !text-xs font-mono"
              >
                BATAL
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-orchid-whisper/20 hover:bg-orchid-whisper/30 text-orchid-whisper border border-orchid-whisper font-mono text-xs font-bold uppercase py-2 px-4 rounded-sm transition cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>YA, HAPUS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

