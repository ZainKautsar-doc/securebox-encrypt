export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}


export interface TeamMember {
  id: string;
  name: string;
  npm?: string;
  role: string;
  category: 'all' | 'crypto' | 'frontend' | 'security';
  tag: string;
  bio: string;
  skills: string[];
  keyContributions: string[];
  avatarGradient?: string;
  avatarUrl?: string;
  initials: string;
  funFact?: string;
  socials: SocialLinks;
}

