import React from 'react';
import { GraduationCap, Building2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import type { UserRole } from '../../types/auth';

interface PortalSelectorProps {
  onSelectPortal: (role: UserRole) => void;
  onBackToPublic?: () => void;
}

export const PortalSelector: React.FC<PortalSelectorProps> = ({
  onSelectPortal,
  onBackToPublic
}) => {
  const portals: {
    id: UserRole;
    badge: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    actionLabel: string;
  }[] = [
    {
      id: 'student',
      badge: 'STUDENT ACCESS',
      title: 'Student Portal',
      description: 'Discover opportunities, prepare, apply and launch your career.',
      icon: <GraduationCap className="w-7 h-7 text-[#CCAA68]" />,
      features: [
        'Curated campus placements & internships',
        'AI preparation tracks & skill diagnostics',
        'Direct verified application workflows'
      ],
      actionLabel: 'Sign In as Student'
    },
    {
      id: 'recruiter',
      badge: 'CORPORATE CONNECT',
      title: 'Recruiter Portal',
      description: 'Connect with RVU talent and manage recruitment.',
      icon: <Building2 className="w-7 h-7 text-[#CCAA68]" />,
      features: [
        'Access 1,608 verified candidates across 9 schools',
        'Post requirements & schedule campus recruitment drives',
        'Interview scorecards & real-time candidate dossiers'
      ],
      actionLabel: 'Sign In as Recruiter'
    },
    {
      id: 'placement',
      badge: 'PLACEMENT CELL',
      title: 'Placement Cell',
      description: 'Manage students, recruiters, drives and placement operations.',
      icon: <ShieldCheck className="w-7 h-7 text-[#CCAA68]" />,
      features: [
        'Statutory policy audit & eligibility automation',
        'Institutional drive logistics & student rosters',
        'Live offer auditing & statutory analytics'
      ],
      actionLabel: 'Sign In as Placement Cell'
    }
  ];

  return (
    <div className="min-h-screen bg-[#101A22] text-[#FFFFFF] relative overflow-hidden flex flex-col justify-between selection:bg-[#CCAA68] selection:text-[#101A22]">
      {/* Background Circuit Grid & Ambience */}
      <div className="absolute inset-0 bg-tech-circuit opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-[#CCAA68]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/src/assets/rvu-logo-gold.svg" 
            alt="RV University Logo" 
            className="h-10 w-auto object-contain"
          />
          <div className="border-l border-[#CCAA68]/40 pl-3">
            <div className="text-[11px] font-mono tracking-widest text-[#CCAA68] uppercase font-bold">
              RV UNIVERSITY
            </div>
            <div className="text-base font-bold text-white font-display tracking-tight">
              CAREER HUB
            </div>
          </div>
        </div>

        {onBackToPublic && (
          <button
            onClick={onBackToPublic}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/30 hover:border-[#CCAA68] text-xs text-[#AEB7BC] hover:text-white transition-all shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#CCAA68] group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Public Hub</span>
          </button>
        )}
      </header>

      {/* Center Section: 3-Card Portal Selector */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 my-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCAA68]/15 border border-[#CCAA68]/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCAA68] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#CCAA68] font-mono">
              UNIFIED PORTAL GATEWAY
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight mb-3">
            SELECT YOUR <span className="text-gold-gradient">WORKSPACE</span>
          </h1>

          <p className="text-sm sm:text-base text-[#AEB7BC]">
            Where Talent Meets Opportunity. Select your portal to access personalized tools, verified records, and career operations.
          </p>
        </div>

        {/* 3 Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {portals.map((portal) => (
            <div
              key={portal.id}
              onClick={() => onSelectPortal(portal.id)}
              className="group relative bg-[#20303A]/90 hover:bg-[#19252F] rounded-2xl p-7 border border-[#CCAA68]/30 hover:border-[#CCAA68] shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#CCAA68]/10 cursor-pointer flex flex-col justify-between backdrop-blur-md"
            >
              {/* Subtle top circuit highlight on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCAA68]/0 to-transparent group-hover:via-[#CCAA68] transition-all duration-500 rounded-t-2xl" />

              <div className="space-y-4">
                {/* Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-xl bg-[#101A22] border border-[#CCAA68]/40 flex items-center justify-center p-3 shadow-inner group-hover:scale-105 transition-transform">
                    {portal.icon}
                  </div>
                  <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#CCAA68]/15 text-[#D8B978] border border-[#CCAA68]/30">
                    {portal.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-xl font-bold text-white font-display group-hover:text-[#D8B978] transition-colors">
                    {portal.title}
                  </h2>
                  <p className="text-xs text-[#AEB7BC] mt-1.5 leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                {/* Features list */}
                <ul className="space-y-2 pt-3 border-t border-white/10 text-[11px] text-[#AEB7BC]">
                  {portal.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CCAA68] mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button Indicator */}
              <div className="pt-6">
                <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#101A22] group-hover:bg-[#CCAA68] text-xs font-semibold text-[#D8B978] group-hover:text-[#101A22] border border-[#CCAA68]/40 group-hover:border-[#CCAA68] transition-all duration-200 shadow-md">
                  <span>{portal.actionLabel}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Trust Footer Note */}
        <div className="mt-12 text-center text-xs text-[#AEB7BC]/80 font-mono">
          <span>Official RV University Campus Placement Portal</span>
          <span className="mx-2 text-[#CCAA68]">•</span>
          <span>Secured with Single Sign-On (SSO) & Role-Based Access Control</span>
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="relative z-10 border-t border-white/5 py-4 text-center text-xs text-[#AEB7BC]/60 font-mono">
        © 2026 RV University. Corporate & Alumni Relations (CAR). All rights reserved.
      </footer>
    </div>
  );
};
