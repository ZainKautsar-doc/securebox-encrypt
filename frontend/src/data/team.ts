import { TeamMember } from '../types/team';

export const teamMembers: TeamMember[] = [
  {
    id: 'developer-1',
    name: 'Zain',
    role: 'Full Stack Developer',
    bio: 'Specialist dalam architecture backend & API design. Memimpin development encryption engine & integration testing untuk menjamin performa nol-kebocoran.',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'AWS', 'TDD'],
    avatarGradient: 'from-[#415fe6] via-[#6366f1] to-[#8b5cf6]',
    funFact: 'Loves building memory-safe cryptographic primitives & drinking single-origin espresso.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'alex.rivera@securebox.dev',
    },
  },
  {
    id: 'developer-2',
    name: 'Nazril',
    role: 'Frontend Developer',
    bio: 'Expert dalam UI/UX implementation. Membuat interface yang intuitif dan performance-optimized untuk seamless zero-knowledge encryption experience.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Web APIs'],
    avatarGradient: 'from-[#5374f0] via-[#8193f8] to-[#c084fc]',
    funFact: 'Obsessed with micro-interactions, sub-millisecond render times, and terminal aesthetics.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'elena.rostova@securebox.dev',
    },
  },
  {
    id: 'developer-3',
    name: 'Fito',
    role: 'DevOps & Security Engineer',
    bio: 'Fokus pada deployment pipeline, security infrastructure, & compliance. Memastikan zero-knowledge principle dan constant-time cryptographic dispatch terjaga di production.',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Security Audit', 'Linux'],
    avatarGradient: 'from-[#1e3a8a] via-[#4338ca] to-[#581c87]',
    funFact: 'Hardcore Linux kernel hacker with zero trust in unauthenticated data streams.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'marcus.vance@securebox.dev',
    },
  },
];
