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
      setError(err.message || 'Failed to execute cryptographic benchmark.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-charcoal">
        <div className="w-10 h-10 bg-ash border border-charcoal text-phosphor rounded-base flex items-center justify-center">
          <BarChart3 className="w-5 h-5 stroke-[1.75]" />
        </div>
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-snow">Performance Benchmark</h1>
          <p className="text-xs font-mono text-smoke mt-0.5">
            Throughput & execution latency across 1KB, 1MB, and 10MB payload sizes
          </p>
        </div>
      </div>

      {/* Runner Card */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 space-y-6 transition-all duration-150 hover:border-graphite">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2 h-2 bg-phosphor rounded-full" />
              <h2 className="text-base font-medium text-snow">
                Benchmark Suite Runner
              </h2>
            </div>
            <p className="text-xs text-silver font-normal">
              Executes in-memory scrypt key derivation + AEAD cipher cycles on the backend engine.
            </p>
          </div>
          <button
            onClick={handleRunBenchmark}
            disabled={loading}
            className="btn-pill-primary"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{loading ? 'Running...' : 'Execute Benchmark'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-smoke/[0.08] border border-smoke/30 text-smoke rounded-sm text-xs font-mono animate-fade-in-down">
            {error}
          </div>
        )}

        {benchmarkResults && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Comparison Table (Supabase 16px container radius, Ash header, Charcoal row borders) */}
            <div className="overflow-x-auto border border-charcoal rounded-base">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-ash text-snow font-sans font-medium text-xs tracking-tight border-b border-charcoal">
                  <tr>
                    <th className="p-3.5">Payload Size</th>
                    <th className="p-3.5">AES-256-GCM Enc</th>
                    <th className="p-3.5">AES-256-GCM Dec</th>
                    <th className="p-3.5">ChaCha20 Enc</th>
                    <th className="p-3.5">ChaCha20 Dec</th>
                    <th className="p-3.5">Optimal Cipher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal">
                  {benchmarkResults.map((row, idx) => {
                    const aesTotal = row.aes_encrypt_time + row.aes_decrypt_time;
                    const chachaTotal = row.chacha_encrypt_time + row.chacha_decrypt_time;
                    const fastest = aesTotal <= chachaTotal ? 'AES-256-GCM' : 'ChaCha20-Poly1305';

                    return (
                      <tr key={idx} className="bg-obsidian hover:bg-ash/40 transition-colors">
                        <td className="p-3.5 font-medium text-snow font-sans">{row.file_size}</td>
                        <td className="p-3.5 text-silver">{row.aes_encrypt_time} ms</td>
                        <td className="p-3.5 text-silver">{row.aes_decrypt_time} ms</td>
                        <td className="p-3.5 text-silver">{row.chacha_encrypt_time} ms</td>
                        <td className="p-3.5 text-silver">{row.chacha_decrypt_time} ms</td>
                        <td className="p-3.5">
                          <span className="pill-status !py-0.5 !px-2 !text-xs !border-forest text-phosphor">
                            {fastest}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visual Bar Comparison (Ash cards, 16px radius, Phosphor progress) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {benchmarkResults.map((r, i) => (
                <div key={i} className="p-5 bg-ash border border-charcoal rounded-base space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-snow font-sans uppercase">{r.file_size} Payload</span>
                    <Zap className="w-3.5 h-3.5 text-phosphor" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-smoke mb-1 font-sans">
                      <span>AES-256-GCM</span>
                      <span className="text-snow font-mono">{(r.aes_encrypt_time + r.aes_decrypt_time).toFixed(2)} ms</span>
                    </div>
                    <div className="w-full bg-obsidian rounded-full h-1.5 border border-charcoal overflow-hidden">
                      <div
                        className="bg-phosphor h-full rounded-full transition-all duration-250"
                        style={{
                          width: `${Math.min(100, Math.max(8, ((r.aes_encrypt_time + r.aes_decrypt_time) / (r.aes_encrypt_time + r.aes_decrypt_time + r.chacha_encrypt_time + r.chacha_decrypt_time)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-smoke mb-1 font-sans">
                      <span>ChaCha20</span>
                      <span className="text-snow font-mono">{(r.chacha_encrypt_time + r.chacha_decrypt_time).toFixed(2)} ms</span>
                    </div>
                    <div className="w-full bg-obsidian rounded-full h-1.5 border border-charcoal overflow-hidden">
                      <div
                        className="bg-mint h-full rounded-full transition-all duration-250"
                        style={{
                          width: `${Math.min(100, Math.max(8, ((r.chacha_encrypt_time + r.chacha_decrypt_time) / (r.aes_encrypt_time + r.aes_decrypt_time + r.chacha_encrypt_time + r.chacha_decrypt_time)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Architecture Insights Callout */}
            <div className="p-4 bg-ash border border-charcoal rounded-base flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-phosphor mt-0.5 flex-shrink-0" />
              <div className="text-xs text-silver space-y-1 leading-relaxed font-normal">
                <p className="font-medium text-snow font-sans">Hardware Acceleration vs Constant-Time Execution</p>
                <p>
                  <strong>AES-256-GCM</strong> utilizes hardware instructions (AES-NI) on modern x86_64 CPUs for maximum throughput. <strong>ChaCha20-Poly1305</strong> runs pure constant-time ARX logic in software, making it immune to cache-timing attacks on mobile, ARM, and embedded systems.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Methodology Section */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 space-y-6 transition-all duration-150 hover:border-graphite">
        <h2 className="text-lg font-medium text-snow flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-phosphor" />
          <span>Benchmark Methodology</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 bg-ash border border-charcoal rounded-base space-y-2">
            <h3 className="font-medium text-snow text-sm flex items-center space-x-1.5">
              <span className="text-phosphor">•</span>
              <span>AES-256-GCM (Hardware Accelerated)</span>
            </h3>
            <p className="text-silver leading-relaxed font-normal">
              Advanced Encryption Standard with Galois Counter Mode leverages native silicon CPU instructions (AES-NI).
            </p>
            <ul className="list-disc list-inside text-smoke space-y-1 font-mono text-[11px] pt-1">
              <li>Optimized for x86_64 servers & laptops.</li>
              <li>High throughput on medium & large payloads.</li>
              <li>128-bit hardware Galois MAC authentication.</li>
            </ul>
          </div>

          <div className="p-5 bg-ash border border-charcoal rounded-base space-y-2">
            <h3 className="font-medium text-snow text-sm flex items-center space-x-1.5">
              <span className="text-phosphor">•</span>
              <span>ChaCha20-Poly1305 (Constant-Time)</span>
            </h3>
            <p className="text-silver leading-relaxed font-normal">
              20-round stream cipher with Poly1305 authenticator designed by Daniel J. Bernstein.
            </p>
            <ul className="list-disc list-inside text-smoke space-y-1 font-mono text-[11px] pt-1">
              <li>Consistent execution on ARM & mobile devices.</li>
              <li>Immune to cache-timing side-channel attacks.</li>
              <li>No dedicated AES hardware instructions required.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
