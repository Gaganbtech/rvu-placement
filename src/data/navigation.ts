export interface NavLink {
  label: string;
  href: string;
  highlight?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Impact', href: '#impact' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Talent Pool', href: '#talent' },
  { label: 'Schools', href: '#schools' },
  { label: 'Performance', href: '#performance' },
  { label: 'Why RVU', href: '#why-recruit' },
  { label: 'Opportunities', href: '#opportunities' },
];

export const PORTAL_ROUTES = {
  student: '/student',
  recruiter: '/recruiter',
  management: '/management'
};

export const FOOTER_SECTIONS = {
  quickLinks: [
    { label: 'Home', href: '#home' },
    { label: 'Placement Performance', href: '#performance' },
    { label: '9 Academic Schools', href: '#schools' },
    { label: 'Eligible Talent Pool', href: '#talent' },
    { label: 'Corporate Engagement', href: '#why-recruit' },
  ],
  students: [
    { label: 'Student Career Portal', href: '/student', isPortal: true },
    { label: 'Career Journey Roadmap', href: '#journey' },
    { label: 'Preparation Resources', href: '#resources' },
    { label: 'AI Career Assistant', href: '#ai-assistant' },
  ],
  recruiters: [
    { label: 'Recruiter Hiring Portal', href: '/recruiter', isPortal: true },
    { label: 'Why Recruit at RVU', href: '#why-recruit' },
    { label: 'Eligible Talent Statistics', href: '#talent' },
    { label: 'Contact CAR Office', href: 'mailto:placements@rvu.edu.in' },
  ],
  parents: [
    { label: 'Career Ecosystem Overview', href: '#parent-ecosystem' },
    { label: 'Placement Audited Data', href: '#performance' },
    { label: 'Mentorship & Preparation', href: '#ecosystem' },
    { label: 'RSST Institutional Legacy', href: '#why-recruit' },
  ],
  management: [
    { label: 'Management Portal', href: '/management', isPortal: true },
    { label: 'CAR Institutional Reports', href: '#performance' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Accessibility Statement', href: '#' },
  ]
};
