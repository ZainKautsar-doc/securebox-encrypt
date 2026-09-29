import React, { useState } from "react";
import { TeamMember } from "../types/team";
import {
  Github,
  Mail,
  Check,
  Terminal,
  ChevronDown,
  ChevronUp,
  Cpu,
  Shield,
  Code2,
} from "lucide-react";

interface TeamMemberCardProps {
  member: TeamMember;
  showFunFact?: boolean;
  onToggleFunFact?: () => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, showFunFact: propShowFunFact, onToggleFunFact }) => {
  const [showContributions, setShowContributions] = useState(false);
  const [localShowFunFact, setLocalShowFunFact] = useState(false);
  
  const showFunFact = propShowFunFact !== undefined ? propShowFunFact : localShowFunFact;

  const handleToggleFunFact = () => {
    if (onToggleFunFact) {
      onToggleFunFact();
    } else {
      setLocalShowFunFact(!localShowFunFact);
    }
  };
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "crypto":
        return <Cpu className="w-3.5 h-3.5 text-electric-indigo" />;
      case "frontend":
        return <Code2 className="w-3.5 h-3.5 text-periwinkle-veil" />;
      case "security":
        return <Shield className="w-3.5 h-3.5 text-lime-beacon" />;
      default:
        return <Terminal className="w-3.5 h-3.5 text-electric-indigo" />;
    }
  };

  return (
    <div className="bg-carbon-panel border border-graphite-lift hover:border-electric-indigo rounded-sm p-5 sm:p-6 lg:p-7 transition-colors duration-150 flex flex-col justify-between h-full group relative">
      <div>
        {/* Header: Tag & NPM Node */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-graphite-lift text-[11px] font-mono">
          <div className="flex items-center space-x-1.5 text-warm-filament">
            {getCategoryIcon(member.category)}
            <span className="font-semibold tracking-wider uppercase">
              {member.tag}
            </span>
          </div>
          {member.npm && (
            <span className="px-2 py-0.5 bg-midnight-void border border-graphite-lift text-soft-mist rounded-sm">
              NPM: {member.npm}
            </span>
          )}
        </div>

        {/* Avatar & Identification Row */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative flex-shrink-0">
            {member.avatarUrl && !imgError ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                onError={() => setImgError(true)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm border-2 border-electric-indigo object-cover bg-midnight-void"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm border-2 border-electric-indigo bg-midnight-void flex flex-col items-center justify-center text-electric-indigo">
                <Terminal className="w-6 h-6 mb-0.5 text-electric-indigo" />
                <span className="font-mono font-bold text-xs tracking-wider text-pure-signal">
                  {member.initials}
                </span>
              </div>
            )}
            {/* Active Node Ping */}
            <span
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-lime-beacon border-2 border-carbon-panel rounded-full"
              title="Verified Protocol Contributor"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-sans font-bold text-lg sm:text-xl text-pure-signal tracking-tight leading-snug break-words">
              {member.name}
            </h3>
            <p className="font-mono text-xs text-electric-indigo uppercase font-semibold mt-1 tracking-tight">
              {member.role}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="font-sans text-xs sm:text-sm text-soft-mist leading-relaxed mb-4">
          {member.bio}
        </p>

        {/* Skills / Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {member.skills.map((skill, idx) => (
            <span
              key={idx}
              className="border border-graphite-lift bg-midnight-void text-soft-mist font-mono text-[10px] sm:text-[11px] px-2 py-0.5 rounded-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Interactive Key Contributions Toggle */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowContributions(!showContributions)}
            className="w-full flex items-center justify-between px-3 py-2 bg-midnight-void/80 hover:bg-midnight-void border border-graphite-lift hover:border-electric-indigo rounded-sm font-mono text-xs text-pure-signal transition cursor-pointer"
          >
            <span className="flex items-center space-x-1.5">
              <span className="text-electric-indigo font-bold">//</span>
              <span>KEY MODULES & CONTRIBUTIONS</span>
            </span>
            {showContributions ? (
              <ChevronUp className="w-3.5 h-3.5 text-electric-indigo" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-soft-mist" />
            )}
          </button>

          {showContributions && (
            <div className="mt-2 p-3 bg-midnight-void border border-graphite-lift rounded-sm space-y-1.5 text-xs font-mono text-soft-mist animate-fade-in-down">
              {member.keyContributions.map((contrib, cIdx) => (
                <div key={cIdx} className="flex items-start space-x-2">
                  <span className="text-electric-indigo select-none">›</span>
                  <span className="leading-relaxed">{contrib}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fun Fact / Security Note Toggle */}
        {member.funFact && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleToggleFunFact}
              className="text-[11px] font-mono text-warm-filament/90 hover:text-warm-filament flex items-center space-x-1.5 cursor-pointer underline underline-offset-2"
            >
              <span>{showFunFact ? "Hide" : "View"} Engineering Note</span>
            </button>
            {showFunFact && (
              <div className="mt-2 p-2.5 bg-midnight-void border border-warm-filament/30 rounded-sm text-[11px] font-mono text-warm-filament leading-relaxed">
                <span className="text-electric-indigo font-bold">// </span>
                {member.funFact}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Social / Connect Bar */}
      <div className="pt-3 border-t border-graphite-lift flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          {member.socials.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} GitHub`}
              className="p-1.5 bg-midnight-void border border-graphite-lift hover:border-electric-indigo text-soft-mist hover:text-pure-signal rounded-sm transition flex items-center space-x-1"
              title="GitHub Profile"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">GITHUB</span>
            </a>
          )}
          {member.socials.email && (
            <button
              type="button"
              onClick={() => handleCopyEmail(member.socials.email!)}
              className="p-1.5 bg-midnight-void border border-graphite-lift hover:border-electric-indigo text-soft-mist hover:text-pure-signal rounded-sm transition flex items-center space-x-1 cursor-pointer"
              title="Copy Email Address"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-lime-beacon" />
                  <span className="text-[10px] text-lime-beacon font-bold">
                    COPIED
                  </span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">EMAIL</span>
                </>
              )}
            </button>
          )}
        </div>

        <span className="text-[10px] text-soft-mist/60 font-mono">
          SECUREBOX PROTOCOL
        </span>
      </div>
    </div>
  );
};
