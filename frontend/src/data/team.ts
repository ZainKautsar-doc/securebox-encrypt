import { TeamMember } from '../types/team';

export const teamMembers: TeamMember[] = [
  {
    id: 'developer-1',
    name: 'Zain Kautsar Ridha',
    npm: '247006111153',
    role: 'Frontend & UI/UX',
    category: 'frontend',
    tag: 'UI/UX // INTERFACE',
    initials: 'ZKR',
    avatarUrl: 'https://github.com/ZainKautsar-doc.png',
    bio: 'Merancang antarmuka pengguna SecureBox yang intuitif dan berorientasi protokol keamanan. Mengembangkan alur kerja interaktif step-by-step, manajemen state lokal browser, dan responsive design.',
    skills: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'State Persistence', 'Web APIs', 'Lucide Icons'],
    keyContributions: [
      'Visualisasi 4-Langkah Alur Kriptografi matematis interaktif di setiap modul',
      'State persistence & log history tersinkronisasi secara lokal via SecureBoxContext & localStorage',
      'Komponen drag-and-drop file encryption/decryption biner hingga 10 MB dengan format .enc & JSON',
      'Implementasi Dark/Light theme switch dengan palet warna protokol kontras tinggi'
    ],
    funFact: 'Tante tante culik aku dong....',
    socials: {
      github: 'https://github.com/ZainKautsar-doc',
      email: 'zainkautsarridha@gmail.com',
    },
  },
  {
    id: 'developer-2',
    name: 'Fito Anugrah Nurzaman',
    npm: '247006111156',
    role: 'Project Lead & Backend',
    category: 'crypto',
    tag: 'ENGINE // ARCHITECT',
    initials: 'FAN',
    avatarUrl: 'https://github.com/FitoAnugrah.png',
    bio: 'Memimpin arsitektur komputasi kriptografi zero-knowledge pada backend. Merancang engine derivasi kunci memory-hard scrypt, integrasi cipher AEAD native, dan sistem hybrid encryption berbasis RSA-OAEP.',
    skills: ['Python 3.10+', 'FastAPI', 'cryptography native', 'scrypt KDF', 'AES-256-GCM', 'ChaCha20-Poly1305', 'RSA-OAEP'],
    keyContributions: [
      'Arsitektur derivasi kunci memory-hard scrypt (N=16384, r=8, p=1, Salt 16B acak)',
      'Engine enkripsi terotentikasi AEAD (AES-256-GCM & ChaCha20) dengan verifikasi 128-bit Auth Tag',
      'Stateless REST API routes (/api/encrypt & /api/decrypt) dengan zero plaintext server retention',
      'Dual-layer Hybrid Encryption (RSA-OAEP 2048-bit + ephemeral AES session key)'
    ],
    funFact: 'ku gak mau malam minggu cuma bengong....',
    socials: {
      github: 'https://github.com/FitoAnugrah',
      email: 'fito@securebox.dev',
    },
  },
  {
    id: 'developer-3',
    name: 'Muhammad Nazril Putra Rosida',
    npm: '247006111162',
    role: 'Testing & Documentation',
    category: 'security',
    tag: 'SECURITY // VERIFICATION',
    initials: 'MNP',
    avatarUrl: 'https://github.com/apeeppp.png',
    bio: 'Bertanggung jawab atas verifikasi keamanan sistem, validasi integritas ciphertext, pengujian ketahanan terhadap modifikasi bit (tamper detection), serta benchmarking performa throughput.',
    skills: ['Pytest', 'Ciphertext Integrity', 'Shannon Entropy', 'Avalanche Analysis'],
    keyContributions: [
      'Automated testing integritas data: memastikan deteksi manipulasi 1-bit seketika (InvalidTag)',
      'Benchmark komparatif throughput dan latensi (1 KB, 1 MB, 10 MB) antara AES-NI vs ChaCha20',
      'Modul analisis matematis tingkat lanjut: Shannon entropy, avalanche effect, & histogram byte',
      'Audit pipeline arsitektur stateless untuk menjamin prinsip zero-knowledge compliance'
    ],
    funFact: 'Tante tante ajak dugem dong',
    socials: {
      github: 'https://github.com/apeeppp',
      email: 'nazril@securebox.dev',
    },
  },
];
