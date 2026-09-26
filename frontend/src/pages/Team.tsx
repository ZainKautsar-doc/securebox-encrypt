import React, { useState } from 'react';
import { teamMembers } from '../data/team';
import { TeamMemberCard } from '../components/TeamMemberCard';
import { Users, Send, CheckCircle2 } from 'lucide-react';
import { useSecureBox } from '../context/SecureBoxContext';

export const Team: React.FC = () => {
  const { setActiveTab } = useSecureBox();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmailInput('');
      }, 3000);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* 1. HERO SECTION (Min-height 300px mobile / 350px tablet / 400px desktop, Geometric ASCII grid backdrop) */}
      <div className="relative overflow-hidden bg-midnight-void border border-graphite-lift rounded-sm px-6 py-12 sm:py-16 lg:py-20 text-center flex flex-col items-center justify-center">
        {/* Subtle ASCII / Geometric grid background decoration (15% opacity) */}
        <div className="absolute inset-0 pointer-events-none opacity-15 select-none font-mono text-[10px] sm:text-xs text-electric-indigo leading-tight overflow-hidden flex flex-col justify-around">
          <div>+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+</div>
          <div>| 0 | 1 | 0 | 1 | S | C | R | Y | P | T | _ | K | D | F | 2 | 5 | 6 | |</div>
          <div>+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+</div>
          <div>| A | E | S | _ | 2 | 5 | 6 | _ | G | C | M | _ | A | U | T | H | 1 | |</div>
          <div>+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+</div>
          <div>| C | H | A | C | H | A | 2 | 0 | _ | P | O | L | Y | 1 | 3 | 0 | 5 | |</div>
          <div>+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+</div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-carbon-panel border border-graphite-lift rounded-sm text-xs font-mono text-warm-filament uppercase tracking-widest">
            <Users className="w-3.5 h-3.5 text-electric-indigo" />
            <span>// THE PROTOCOL ARCHITECTS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-pure-signal leading-tight">
            Meet the Team
          </h1>

          <p className="text-sm sm:text-base text-soft-mist max-w-xl mx-auto leading-relaxed">
            Passionate developers and security researchers building the future of zero-knowledge data encryption.
          </p>
        </div>
      </div>

      {/* 2. MOTIVATIONAL VALUE PROPOSITION SECTION */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 text-center max-w-4xl mx-auto space-y-3">
        <div className="w-2 h-2 bg-electric-indigo rounded-full mx-auto" />
        <h2 className="text-lg sm:text-xl font-bold font-sans text-pure-signal tracking-tight">
          Driving the Future of Encrypted Data
        </h2>
        <p className="text-sm text-soft-mist leading-relaxed max-w-2xl mx-auto">
          Our team combines deep expertise in modern applied cryptography, full-stack engineering, and infrastructure security to deliver a zero-knowledge encryption suite you can trust.
        </p>

        {/* Team Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-graphite-lift text-xs font-mono">
          <div className="p-3 bg-midnight-void border border-graphite-lift rounded-sm">
            <span className="text-electric-indigo font-bold text-sm block">100%</span>
            <span className="text-soft-mist/70">OPEN SOURCE & AUDITABLE</span>
          </div>
          <div className="p-3 bg-midnight-void border border-graphite-lift rounded-sm">
            <span className="text-lime-beacon font-bold text-sm block">ZERO</span>
            <span className="text-soft-mist/70">PLAINTEXT RETENTION</span>
          </div>
          <div className="p-3 bg-midnight-void border border-graphite-lift rounded-sm">
            <span className="text-periwinkle-veil font-bold text-sm block">24/7</span>
            <span className="text-soft-mist/70">DEV COMMUNITY DRIVEN</span>
          </div>
        </div>
      </div>

      {/* 3. TEAM MEMBER GRID (1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      {/* 4. JOIN US & CONTACT CTA SECTION */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-10 text-center max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-pure-signal font-sans">
            Join the SecureBox Collective
          </h2>
          <p className="text-sm text-soft-mist max-w-md mx-auto leading-relaxed">
            Interested in building high-throughput secure infrastructure and memory-hard cryptographic systems? We're always looking for passionate engineers.
          </p>
        </div>

        {/* Interactive In-line Email Form */}
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your email (e.g. dev@domain.com)"
            className="input-protocol flex-1 text-sm font-sans"
          />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap px-6"
          >
            <Send className="w-3.5 h-3.5" />
            <span>GET IN TOUCH</span>
          </button>
        </form>

        {subscribed && (
          <div className="p-3 bg-lime-beacon/10 border border-lime-beacon text-lime-beacon rounded-sm text-xs font-mono flex items-center justify-center space-x-2 animate-fade-in-down">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you! Our engineering team will reach out shortly.</span>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-soft-mist/70">
          <a
            href="mailto:careers@securebox.dev"
            className="hover:text-electric-indigo underline transition-colors"
          >
            careers@securebox.dev
          </a>
          <span>•</span>
          <button
            type="button"
            onClick={() => setActiveTab('how-it-works')}
            className="hover:text-electric-indigo underline transition-colors cursor-pointer"
          >
            Read Cryptographic Spec
          </button>
        </div>
      </div>
    </div>
  );
};
