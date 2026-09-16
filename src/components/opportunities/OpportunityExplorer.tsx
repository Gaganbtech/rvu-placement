import React, { useState } from 'react';
import {
  Search,
  Briefcase,
  Building,
  GraduationCap,
  Globe,
  Users,
  Layers,
  ArrowRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { usePlatformStore } from '../../data/platform/studentStore';
import { RVUPlacementEcosystemPanel } from './RVUPlacementEcosystemPanel';
import type { Opportunity } from '../../data/platform/types';

interface OpportunityExplorerProps {
  onNavigatePortal?: (route: string) => void;
  onOpenStudentLoginModal?: () => void;
}

const CATEGORY_CARDS = [
  {
    id: 'placement',
    title: 'PLACEMENTS',
    description: 'Explore placement opportunities and recruitment pathways.',
    cta: 'Explore Placements',
    route: '/opportunities?type=placement',
    icon: Briefcase,
    accent: 'text-gold bg-gold-faint border-gold/30'
  },
  {
    id: 'internship',
    title: 'INTERNSHIPS',
    description: 'Explore internship pathways including summer and winter internships.',
    cta: 'Explore Internships',
    route: '/opportunities?type=internship',
    icon: GraduationCap,
    accent: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  },
  {
    id: 'live-project',
    title: 'LIVE PROJECTS',
    description: 'Connect academic learning with real-world industry problems.',
    cta: 'Explore Live Projects',
    route: '/opportunities?type=live-project',
    icon: Layers,
    accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    id: 'industry-mentoring',
    title: 'INDUSTRY MENTORING',
    description: 'Learn directly from experienced industry professionals.',
    cta: 'Explore Mentoring',
    route: '/opportunities?type=industry-mentoring',
    icon: Users,
    accent: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  },
  {
    id: 'capstone',
    title: 'CAPSTONE PROJECTS',
    description: 'Apply academic knowledge through industry-relevant capstone work.',
    cta: 'Explore Capstones',
    route: '/opportunities?type=capstone',
    icon: Sparkles,
    accent: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    id: 'international-internship',
    title: 'INTERNATIONAL INTERNSHIPS',
    description: 'Explore global internship opportunities when published through the RVU ecosystem.',
    cta: 'Explore International',
    route: '/opportunities?type=international-internship',
    icon: Globe,
    accent: 'text-teal-400 bg-teal-500/10 border-teal-500/30'
  }
];

export const OpportunityExplorer: React.FC<OpportunityExplorerProps> = ({
  onNavigatePortal,
  onOpenStudentLoginModal
}) => {
  const store = usePlatformStore();
  const [searchQuery, setSearchQuery] = useState('');

  const isStudent = store.currentRole === 'STUDENT';
  const opportunities: Opportunity[] = store.opportunities;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNavigatePortal) {
      onNavigatePortal('/opportunities' + (searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''));
    }
  };

  const navigate = (route: string) => {
    if (onNavigatePortal) {
      onNavigatePortal(route);
    }
  };

  return (
    <section id="opportunities" className="relative py-24 bg-navy overflow-hidden border-b border-gold-border/40">
      
      {/* Subtle Background Circuit */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* 1. SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Briefcase className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              CAREER DISCOVERY
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-rvu-text font-display tracking-tight mb-4">
            Find Your Opportunity
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted leading-relaxed mb-4">
            Explore placement, internship and industry-connected opportunities across RV University.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs font-mono text-rvu-subtle">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-surface border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {isStudent ? 'Personalized for you' : 'RVU Career Ecosystem'}
            </span>
          </div>
        </div>

        {/* 2. PROMINENT SEARCH BAR */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-5 h-5 text-gold absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities, roles, skills or domains…"
              className="w-full bg-navy-surface border border-gold/30 rounded-2xl pl-12 pr-32 py-4 text-sm sm:text-base text-rvu-text placeholder-rvu-subtle focus:border-gold focus:ring-2 focus:ring-gold shadow-xl transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-gold text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-gold-sm flex items-center gap-1.5"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 3. FUNCTIONAL OPPORTUNITY CATEGORY CARDS */}
        <div className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase text-gold tracking-wider block mb-1">
                OFFICIAL PATHWAYS
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-rvu-text">
                Explore by Opportunity Type
              </h3>
            </div>

            <button
              onClick={() => navigate('/opportunities')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-gold hover:underline"
            >
              <span>View All Types</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORY_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigate(card.route)}
                  className="group card-glass rounded-2xl p-6 transition-all duration-300 hover:border-gold hover:-translate-y-1.5 hover:shadow-gold-glow cursor-pointer flex flex-col justify-between border border-gold-border/40"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className={`p-2.5 rounded-xl border ${card.accent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-rvu-subtle uppercase">
                        RVU Ecosystem
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-rvu-text font-display group-hover:text-gold transition-colors mb-2">
                      {card.title}
                    </h4>

                    <p className="text-xs text-rvu-muted leading-relaxed mb-6">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gold-border/30 flex items-center justify-between text-xs font-semibold text-gold">
                    <span className="group-hover:underline">{card.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. VERIFIED OPPORTUNITIES PREVIEW (SHARED STORE DATA) */}
        <div className="mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase text-gold tracking-wider block mb-1">
                CAMPUS RECRUITMENT DRIVES
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-rvu-text">
                Published Placement & Internship Listings
              </h3>
            </div>

            <button
              onClick={() => navigate('/opportunities')}
              className="btn-gold text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-gold-sm"
            >
              <span>Explore All Opportunities</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.slice(0, 6).map((opp) => {
                const hasApplied = isStudent && store.applications.some(a => a.opportunityId === opp.id && a.studentId === store.student.id);

                return (
                  <div
                    key={opp.id}
                    onClick={() => navigate(`/opportunities/${opp.id}`)}
                    className="group card-glass rounded-2xl p-6 transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-gold-glow cursor-pointer flex flex-col justify-between border border-gold-border/40"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-faint text-gold border border-gold/30 font-semibold uppercase">
                          {opp.type}
                        </span>
                        <span className="text-[10px] font-mono text-rvu-subtle">
                          {opp.workMode}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-rvu-text font-display group-hover:text-gold transition-colors mb-1 line-clamp-1">
                        {opp.role}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-rvu-muted mb-3">
                        <Building className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="font-semibold text-rvu-text truncate">{opp.companyName}</span>
                        <span>•</span>
                        <span className="truncate">{opp.location}</span>
                      </div>

                      <p className="text-xs text-rvu-muted line-clamp-2 leading-relaxed mb-4">
                        {opp.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono mb-4 text-rvu-subtle">
                        <span className="text-gold font-bold">{opp.ctcLpa}</span>
                        <span>•</span>
                        <span>Min CGPA: {opp.minCgpa}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gold-border/30 flex items-center justify-between text-xs">
                      {opp.applicationDeadline ? (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-rvu-subtle">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Due {opp.applicationDeadline}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-emerald-400">Open Drive</span>
                      )}

                      <span className="text-gold font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {hasApplied ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Applied
                          </span>
                        ) : (
                          <>
                            <span>View Opportunity</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card-glass rounded-2xl p-8 text-center max-w-xl mx-auto border-gold/30">
              <p className="text-sm text-rvu-muted mb-4">
                No live opportunities are currently published for public viewing.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={onOpenStudentLoginModal}
                  className="btn-gold text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Sign in as Student
                </button>
                <button
                  onClick={() => navigate('/student/preparation')}
                  className="btn-navy-outline text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Explore Career Preparation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. OFFICIAL RVU PLACEMENT ECOSYSTEM PANEL */}
        <div className="mb-12">
          <RVUPlacementEcosystemPanel />
        </div>

        {/* 6. BOTTOM CALL TO ACTION */}
        <div className="text-center pt-8 border-t border-gold-border/30">
          <button
            onClick={() => navigate('/opportunities')}
            className="btn-gold text-sm sm:text-base font-bold px-8 py-3.5 rounded-2xl shadow-gold-glow inline-flex items-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <span>Explore All Opportunities in RVU Career Hub</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

    </section>
  );
};
