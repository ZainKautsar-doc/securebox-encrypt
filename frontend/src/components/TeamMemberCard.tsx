import React, { useState } from 'react';
import { TeamMember } from '../types/team';
import { Github, Linkedin, Twitter, Mail, Sparkles, Terminal } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const [showFact, setShowFact] = useState(false);

  return (
    <div className="group relative bg-carbon-panel border border-graphite-lift hover:border-electric-indigo rounded-sm p-6 sm:p-7 lg:p-8 transition-all duration-200 ease-out hover:scale-[1.02] flex flex-col justify-between shadow-sm hover:shadow-[0_0_20px_rgba(65,95,230,0.15)] hover:bg-carbon-panel/90">
      <div>
        {/* Avatar Image (120x120px with 2px radius and Electric Indigo border) */}
        <div className="relative mb-5 inline-block">
          <div
            className={`w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-sm bg-gradient-to-br ${member.avatarGradient} border-2 border-electric-indigo flex items-center justify-center text-pure-signal text-2xl font-bold font-mono shadow-inner transition-transform duration-200 group-hover:scale-105 group-hover:border-periwinkle-veil overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center space-y-1">
              <Terminal className="w-6 h-6 text-pure-signal/80" />
              <span className="text-xs font-mono font-bold tracking-wider">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
          </div>
          {/* Online/Status Node */}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-lime-beacon border-2 border-carbon-panel rounded-full" title="Active Engineer" />
        </div>

        {/* Name & Fun Fact Hover */}
        <div className="relative mb-1">
          <h3
            className="font-sans font-bold text-xl sm:text-2xl text-pure-signal tracking-tight flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setShowFact(true)}
            onMouseLeave={() => setShowFact(false)}
          >
            <span>{member.name}</span>
            <Sparkles className="w-3.5 h-3.5 text-electric-indigo/60 group-hover:text-periwinkle-veil transition-colors" />
          </h3>

          {/* Fun Fact Tooltip */}
          {showFact && member.funFact && (
            <div className="absolute -top-10 left-0 z-20 bg-midnight-void border border-electric-indigo text-pure-signal text-[11px] font-mono px-3 py-1.5 rounded-sm shadow-xl whitespace-nowrap animate-fade-in-down pointer-events-none">
              <span className="text-electric-indigo font-bold">// </span>
              {member.funFact}
            </div>
          )}
        </div>

        {/* Role / Position */}
        <p className="font-mono text-xs text-electric-indigo tracking-tight uppercase mb-4 font-semibold">
          {member.role}
        </p>

        {/* Bio / Description */}
        <p className="font-sans text-sm text-soft-mist leading-relaxed mb-6 font-normal">
          {member.bio}
        </p>
      </div>

      <div>
        {/* Skills / Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {member.skills.map((skill, idx) => (
            <span
              key={idx}
              className="border border-graphite-lift group-hover:border-graphite-lift/80 bg-midnight-void/60 text-soft-mist font-mono text-[11px] px-2.5 py-1 rounded-sm transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-graphite-lift">
          {member.socials.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} GitHub profile`}
              className="text-soft-mist hover:text-electric-indigo transition-colors duration-150 p-1 rounded-sm hover:bg-midnight-void"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn profile`}
              className="text-soft-mist hover:text-electric-indigo transition-colors duration-150 p-1 rounded-sm hover:bg-midnight-void"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {member.socials.twitter && (
            <a
              href={member.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} Twitter profile`}
              className="text-soft-mist hover:text-electric-indigo transition-colors duration-150 p-1 rounded-sm hover:bg-midnight-void"
            >
              <Twitter className="w-5 h-5" />
            </a>
          )}
          {member.socials.email && (
            <a
              href={`mailto:${member.socials.email}`}
              aria-label={`Email ${member.name}`}
              className="text-soft-mist hover:text-electric-indigo transition-colors duration-150 p-1 rounded-sm hover:bg-midnight-void"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
