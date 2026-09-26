import React, { useState } from 'react';
import { api } from '../services/api';
import { BarChart3, Loader2, Play, Zap, ShieldCheck } from 'lucide-react';
import { useSecureBox } from '../context/SecureBoxContext';

export const Compare: React.FC = () => {
  const { benchmarkResults, setBenchmarkResults, addHistoryItem } = useSecureBox();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunBenchmark = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.runBenchmark();
      setBenchmarkResults(data);

      addHistoryItem({
        type: 'benchmark',
        algorithm: 'AES-GCM vs ChaCha20',
        title: 'Benchmark comparison across 1KB, 1MB, and 10MB',
        details: {
          benchmarkData: data,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to run benchmark suite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Performance Comparison Benchmark</h1>
          <p className="text-xs text-slate-500">
            Compare throughput & execution time of AES-256-GCM vs ChaCha20-Poly1305 on 1KB, 1MB, and 10MB payloads.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Benchmark Suite Runner</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Executes key derivation and authenticated encryption/decryption cycles.
            </p>
          </div>
          <button
            onClick={handleRunBenchmark}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-sm transition flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{loading ? 'Executing Benchmarks...' : 'Run Benchmark'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {benchmarkResults && (
          <div className="mt-6 space-y-6">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">File Size</th>
                    <th className="p-3">AES-256-GCM Encrypt</th>
                    <th className="p-3">AES-256-GCM Decrypt</th>
                    <th className="p-3">ChaCha20 Encrypt</th>
                    <th className="p-3">ChaCha20 Decrypt</th>
                    <th className="p-3">Fastest Overall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {benchmarkResults.map((row, idx) => {
                    const aesTotal = row.aes_encrypt_time + row.aes_decrypt_time;
                    const chachaTotal = row.chacha_encrypt_time + row.chacha_decrypt_time;
                    const fastest = aesTotal <= chachaTotal ? 'AES-256-GCM' : 'ChaCha20-Poly1305';

                    return (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="p-3 font-semibold text-slate-800">{row.file_size}</td>
                        <td className="p-3 font-mono text-slate-700">{row.aes_encrypt_time} ms</td>
                        <td className="p-3 font-mono text-slate-700">{row.aes_decrypt_time} ms</td>
                        <td className="p-3 font-mono text-slate-700">{row.chacha_encrypt_time} ms</td>
                        <td className="p-3 font-mono text-slate-700">{row.chacha_decrypt_time} ms</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            fastest === 'AES-256-GCM' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {fastest}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visual Bar Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {benchmarkResults.map((r, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">{r.file_size} Payload</span>
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>AES-256-GCM Total</span>
                      <span className="font-semibold font-mono">{(r.aes_encrypt_time + r.aes_decrypt_time).toFixed(2)} ms</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(10, ((r.aes_encrypt_time + r.aes_decrypt_time) / (r.aes_encrypt_time + r.aes_decrypt_time + r.chacha_encrypt_time + r.chacha_decrypt_time)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>ChaCha20-Poly1305 Total</span>
                      <span className="font-semibold font-mono">{(r.chacha_encrypt_time + r.chacha_decrypt_time).toFixed(2)} ms</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(10, ((r.chacha_encrypt_time + r.chacha_decrypt_time) / (r.aes_encrypt_time + r.aes_decrypt_time + r.chacha_encrypt_time + r.chacha_decrypt_time)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-medium text-slate-800">Insights & Architecture Note:</p>
                <p>
                  AES-256-GCM benefits from hardware acceleration (AES-NI instructions on x86_64 CPUs). ChaCha20-Poly1305 is optimized for software execution without dedicated AES instructions (ideal for mobile and ARM architectures).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Benchmark Explanation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <span>Penjelasan & Metodologi Benchmark</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-bold text-indigo-700 text-sm flex items-center space-x-1.5">
              <span>1. AES-256-GCM (Hardware Acceleration)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Advanced Encryption Standard (AES)</strong> dalam mode Galois/Counter Mode (GCM) memanfaatkan instruksi khusus prosesor seperti <strong>AES-NI</strong> pada CPU Intel/AMD.
            </p>
            <ul className="list-disc list-inside text-slate-500 space-y-1 pt-1">
              <li>Sangat cepat pada komputer desktop, laptop, dan server x86_64.</li>
              <li>Menghasilkan otentikasi data terintegrasi (Auth Tag 16-byte).</li>
              <li>Throughput tinggi pada payload besar (1MB - 10MB).</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-bold text-emerald-700 text-sm flex items-center space-x-1.5">
              <span>2. ChaCha20-Poly1305 (Software Optimization)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>ChaCha20-Poly1305</strong> adalah stream cipher modern berkecepatan tinggi yang berjalan murni di software menggunakan operasi sederhana ADD-ROTATE-XOR (ARX).
            </p>
            <ul className="list-disc list-inside text-slate-500 space-y-1 pt-1">
              <li>Performa konsisten di arsitektur ARM, perangkat mobile, dan tablet.</li>
              <li>Waktu eksekusi konstan (kebal terhadap serangan <em>side-channel timing attacks</em>).</li>
              <li>Tidak membutuhkan instruksi hardware AES-NI khusus.</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2 text-xs">
          <span className="font-bold text-amber-400 block text-sm">Metodologi Pengujian Benchmark:</span>
          <p className="text-slate-300 leading-relaxed">
            Pengujian diukur secara riil pada server backend untuk payload ukuran <strong>1 KB</strong> (pesan teks), <strong>1 MB</strong> (dokumen sedang), dan <strong>10 MB</strong> (berkas besar).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-mono text-slate-400">
            <div className="p-2 bg-slate-800 rounded border border-slate-700">
              <span className="text-indigo-400 block font-bold">1 KB Payload</span>
              Waktu eksekusi didominasi oleh scrypt KDF.
            </div>
            <div className="p-2 bg-slate-800 rounded border border-slate-700">
              <span className="text-indigo-400 block font-bold">1 MB Payload</span>
              Mengukur efisiensi cipher pada memori menengah.
            </div>
            <div className="p-2 bg-slate-800 rounded border border-slate-700">
              <span className="text-indigo-400 block font-bold">10 MB Payload</span>
              Menampilkan batas kecepatan maksimal (throughput MB/s).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
