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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-graphite-lift">
        <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">Performance Benchmark</h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            MEASURING AEAD THROUGHPUT & ENCRYPTION/DECRYPTION LATENCY ACROSS 1KB, 1MB, AND 10MB
          </p>
        </div>
      </div>

      {/* Runner Card */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2 h-2 bg-electric-indigo rounded-full"></span>
              <h2 className="text-sm font-bold font-mono text-pure-signal uppercase tracking-wider">
                // BENCHMARK SUITE RUNNER
              </h2>
            </div>
            <p className="text-xs text-soft-mist/70">
              Executes real-time key derivation (scrypt) + authenticated cipher cycles on backend.
            </p>
          </div>
          <button
            onClick={handleRunBenchmark}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{loading ? 'RUNNING BENCHMARKS...' : 'EXECUTE BENCHMARK'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-orchid-whisper/10 border border-orchid-whisper text-orchid-whisper rounded-sm text-xs font-mono">
            {error}
          </div>
        )}

        {benchmarkResults && (
          <div className="space-y-6">
            {/* Benchmark Table (Alternating rows, Graphite Lift Header, Lime Beacon metrics) */}
            <div className="overflow-x-auto border border-graphite-lift rounded-sm">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-graphite-lift text-pure-signal font-sans font-bold text-xs uppercase tracking-wider border-b border-graphite-lift">
                  <tr>
                    <th className="p-3.5">PAYLOAD SIZE</th>
                    <th className="p-3.5">AES-256-GCM ENC</th>
                    <th className="p-3.5">AES-256-GCM DEC</th>
                    <th className="p-3.5">CHACHA20 ENC</th>
                    <th className="p-3.5">CHACHA20 DEC</th>
                    <th className="p-3.5">OPTIMAL CIPHER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-graphite-lift">
                  {benchmarkResults.map((row, idx) => {
                    const aesTotal = row.aes_encrypt_time + row.aes_decrypt_time;
                    const chachaTotal = row.chacha_encrypt_time + row.chacha_decrypt_time;
                    const fastest = aesTotal <= chachaTotal ? 'AES-256-GCM' : 'ChaCha20-Poly1305';

                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-midnight-void' : 'bg-carbon-panel'}>
                        <td className="p-3.5 font-bold text-pure-signal">{row.file_size}</td>
                        <td className="p-3.5 text-soft-mist">{row.aes_encrypt_time} ms</td>
                        <td className="p-3.5 text-soft-mist">{row.aes_decrypt_time} ms</td>
                        <td className="p-3.5 text-soft-mist">{row.chacha_encrypt_time} ms</td>
                        <td className="p-3.5 text-soft-mist">{row.chacha_decrypt_time} ms</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-sm text-[11px] font-mono font-bold ${
                            fastest === 'AES-256-GCM' 
                              ? 'bg-electric-indigo/20 text-periwinkle-veil border border-electric-indigo' 
                              : 'bg-lime-beacon/20 text-lime-beacon border border-lime-beacon'
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

            {/* Visual Bar Comparison (Sharp 2px radius, no shadows) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {benchmarkResults.map((r, i) => (
                <div key={i} className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-pure-signal uppercase">{r.file_size} PAYLOAD</span>
                    <Zap className="w-3.5 h-3.5 text-warm-filament" />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-soft-mist/70 mb-1">
                      <span>AES-256-GCM Total</span>
                      <span className="text-pure-signal font-bold">{(r.aes_encrypt_time + r.aes_decrypt_time).toFixed(2)} ms</span>
                    </div>
                    <div className="w-full bg-midnight-void rounded-sm h-2 border border-graphite-lift">
                      <div
                        className="bg-electric-indigo h-full rounded-sm"
                        style={{
                          width: `${Math.min(100, Math.max(8, ((r.aes_encrypt_time + r.aes_decrypt_time) / (r.aes_encrypt_time + r.aes_decrypt_time + r.chacha_encrypt_time + r.chacha_decrypt_time)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-soft-mist/70 mb-1">
                      <span>ChaCha20 Total</span>
                      <span className="text-pure-signal font-bold">{(r.chacha_encrypt_time + r.chacha_decrypt_time).toFixed(2)} ms</span>
                    </div>
                    <div className="w-full bg-midnight-void rounded-sm h-2 border border-graphite-lift">
                      <div
                        className="bg-lime-beacon h-full rounded-sm"
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
            <div className="p-4 bg-carbon-panel border border-graphite-lift rounded-sm flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-electric-indigo mt-0.5 flex-shrink-0" />
              <div className="text-xs text-soft-mist space-y-1 leading-relaxed">
                <p className="font-bold text-pure-signal uppercase font-mono">// ARCHITECTURE NOTES & HARDWARE DISPATCH</p>
                <p>
                  <strong>AES-256-GCM</strong> leverages dedicated CPU instructions (AES-NI) on modern x86_64 architectures. <strong>ChaCha20-Poly1305</strong> runs constant-time ARX operations in software with zero cache-timing vulnerability on ARM, mobile, and non-AES-NI systems.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Methodology Section */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold text-pure-signal flex items-center space-x-2 font-mono uppercase">
          <BarChart3 className="w-4 h-4 text-electric-indigo" />
          <span>// BENCHMARK METHODOLOGY & ARCHITECTURE</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2">
            <h3 className="font-bold text-pure-signal text-sm font-mono flex items-center space-x-1.5">
              <span className="text-electric-indigo">•</span>
              <span>AES-256-GCM (Hardware Accelerated)</span>
            </h3>
            <p className="text-soft-mist leading-relaxed">
              Advanced Encryption Standard in Galois/Counter Mode utilizes native silicon CPU instructions (AES-NI).
            </p>
            <ul className="list-disc list-inside text-soft-mist/70 space-y-1 font-mono text-[11px] pt-1">
              <li>Optimized for x86_64 servers & workstations.</li>
              <li>High throughput on medium & large payloads.</li>
              <li>128-bit hardware Galois MAC authentication.</li>
            </ul>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2">
            <h3 className="font-bold text-pure-signal text-sm font-mono flex items-center space-x-1.5">
              <span className="text-lime-beacon">•</span>
              <span>ChaCha20-Poly1305 (Software Constant-Time)</span>
            </h3>
            <p className="text-soft-mist leading-relaxed">
              20-round stream cipher with Poly1305 authenticator designed by Daniel J. Bernstein.
            </p>
            <ul className="list-disc list-inside text-soft-mist/70 space-y-1 font-mono text-[11px] pt-1">
              <li>Consistent execution on ARM / mobile devices.</li>
              <li>Immune to cache-timing side-channel attacks.</li>
              <li>No dedicated AES hardware instructions required.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
