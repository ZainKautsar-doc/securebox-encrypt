import React, { useState } from "react";
import { teamMembers } from "../data/team";
import { TeamMemberCard } from "../components/TeamMemberCard";
import {
  Users,
  GraduationCap,
  GitFork,
  ShieldCheck,
  Layers,
  Cpu,
  Code2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { useSecureBox } from "../context/SecureBoxContext";

export const Team: React.FC = () => {
  const { setActiveTab } = useSecureBox();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "crypto" | "frontend" | "security"
  >("all");
  const [showEngineeringNotes, setShowEngineeringNotes] = useState(false);

  const filteredMembers =
    selectedCategory === "all"
      ? teamMembers
      : teamMembers.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-10 sm:space-y-12 pb-12">
      {/* 1. HERO SECTION (Cryptographic Protocol Backdrop) */}
      <div className="relative overflow-hidden bg-carbon-panel border border-graphite-lift rounded-sm px-5 py-10 sm:py-14 lg:py-16 text-center flex flex-col items-center justify-center">
        {/* Responsive ASCII / Geometric grid background decoration */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-10 select-none font-mono text-[9px] sm:text-[11px] text-electric-indigo leading-tight overflow-hidden flex flex-col justify-center items-center text-center whitespace-nowrap"
        >
          <div>
            +-----------------------------------------------------------------------------+
          </div>
          <div>
            | 0 | 1 | 0 | 1 | S C R Y P T _ K D F _ 2 5 6 | 1 | 0 | 1 | 0 | A E
            A D |
          </div>
          <div>
            +-----------------------------------------------------------------------------+
          </div>
          <div>
            | A | E | S | _ | 2 | 5 | 6 | _ | G | C | M | _ | A | U | T | H | T
            | A | G |
          </div>
          <div>
            +-----------------------------------------------------------------------------+
          </div>
          <div>
            | C | H | A | C | H | A | 2 | 0 | _ | P | O | L | Y | 1 | 3 | 0 | 5
            | A R X |
          </div>
          <div>
            +-----------------------------------------------------------------------------+
          </div>
          <div>
            | Z E R O - K N O W L E D G E | S T A T E L E S S | 1 2 8 - B I T M
            A C |
          </div>
          <div>
            +-----------------------------------------------------------------------------+
          </div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-midnight-void border border-graphite-lift rounded-sm text-xs font-mono text-warm-filament uppercase tracking-widest">
            <Users className="w-3.5 h-3.5 text-electric-indigo" />
            <span>// THE PROTOCOL ARCHITECTS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-pure-signal leading-tight">
            Meet the Project Team
          </h1>

          <p className="text-sm sm:text-base text-soft-mist max-w-xl mx-auto leading-relaxed">
            Pengembang dan perancang SecureBox — sistem kriptografi
            terotentikasi zero-knowledge dengan derivasi kunci memory-hard dan
            cipher AEAD standar industri.
          </p>

          {/* Academic Badge */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-midnight-void border border-graphite-lift text-pure-signal rounded-sm">
              <GraduationCap className="w-3.5 h-3.5 text-electric-indigo" />
              <span>Proyek Keamanan Informasi (KI)</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-midnight-void border border-graphite-lift text-pure-signal rounded-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-beacon" />
              <span>Topik A: Enkripsi Algoritma Modern</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. ARCHITECTURAL DIVISION OF RESPONSIBILITIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-4 sm:p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-electric-indigo font-bold">
              <Cpu className="w-4 h-4" />
              <span>PILLAR 1: CRYPTO ENGINE</span>
            </div>
            <h3 className="font-bold text-pure-signal text-sm">
              Fito Anugrah Nurzaman
            </h3>
            <p className="text-xs text-soft-mist leading-relaxed">
              Arsitektur KDF scrypt, implementasi cipher AEAD (AES-256-GCM &
              ChaCha20-Poly1305), REST API routes, dan dual-layer Hybrid
              RSA-OAEP.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-graphite-lift text-[11px] font-mono text-soft-mist/70">
            NPM: 247006111156
          </div>
        </div>

        <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-4 sm:p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-periwinkle-veil font-bold">
              <Code2 className="w-4 h-4" />
              <span>PILLAR 2: USER EXPERIENCE</span>
            </div>
            <h3 className="font-bold text-pure-signal text-sm">
              Zain Kautsar Ridha
            </h3>
            <p className="text-xs text-soft-mist leading-relaxed">
              Desain visual berorientasi protokol, visualisasi langkah enkripsi
              4-tahap, persistent client storage, dan penanganan berkas biner
              hingga 10 MB.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-graphite-lift text-[11px] font-mono text-soft-mist/70">
            NPM: 247006111153
          </div>
        </div>

        <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-4 sm:p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-lime-beacon font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>PILLAR 3: SECURITY & AUDIT</span>
            </div>
            <h3 className="font-bold text-pure-signal text-sm">
              Muhammad Nazril Putra Rosida
            </h3>
            <p className="text-xs text-soft-mist leading-relaxed">
              Verifikasi tamper resistance (bit-flipping detection), pengujian
              integritas Auth Tag, benchmark throughput performa, dan evaluasi
              entropi Shannon.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-graphite-lift text-[11px] font-mono text-soft-mist/70">
            NPM: 247006111162
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE CATEGORY FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-graphite-lift">
        <div className="flex items-center space-x-2 text-xs font-mono text-soft-mist">
          <Layers className="w-3.5 h-3.5 text-electric-indigo" />
          <span className="font-semibold uppercase tracking-wider">
            // FILTER DOMAIN:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "ALL MEMBERS" },
            { id: "crypto", label: "CORE CRYPTO" },
            { id: "frontend", label: "FRONTEND & UI" },
            { id: "security", label: "SECURITY & QA" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition cursor-pointer border ${
                selectedCategory === tab.id
                  ? "bg-electric-indigo text-white border-electric-indigo font-bold"
                  : "bg-carbon-panel text-soft-mist border-graphite-lift hover:border-electric-indigo hover:text-pure-signal"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. TEAM MEMBER GRID (1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredMembers.map((member) => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              showFunFact={showEngineeringNotes}
              onToggleFunFact={() => setShowEngineeringNotes(prev => !prev)}
            />
          ))}
        </div>
      </div>

      {/* 5. PROJECT REPOSITORY & LIVE LINKS */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-warm-filament">
            <GitFork className="w-3.5 h-3.5 text-electric-indigo" />
            <span>OPEN SOURCE REPOSITORY</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans text-pure-signal tracking-tight">
            SecureBox Cryptographic Suite on GitHub
          </h2>
          <p className="text-xs sm:text-sm text-soft-mist leading-relaxed">
            Akses kode sumber lengkap, suite pengujian unit/integrasi, serta
            dokumentasi matematis protokol di repositori resmi project.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/ZainKautsar-doc/securebox-encrypt"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center space-x-2 px-5 py-2.5 text-xs font-mono"
          >
            <span>VIEW ON GITHUB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setActiveTab("how-it-works")}
            className="btn-secondary flex items-center space-x-2 px-5 py-2.5 text-xs font-mono"
          >
            <BookOpen className="w-3.5 h-3.5 text-electric-indigo" />
            <span>PROTOCOL SPEC</span>
          </button>
        </div>
      </div>
    </div>
  );
};
