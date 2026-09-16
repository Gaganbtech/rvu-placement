import React, { useState, useMemo } from 'react';
import {
  Search,
  Briefcase,
  Building,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { usePlatformStore } from '../../data/platform/studentStore';
import { RVU_OFFICIAL_SCHOOLS } from '../../data/schools';
import { RVUPlacementEcosystemPanel } from './RVUPlacementEcosystemPanel';
import type { Opportunity } from '../../data/platform/types';

interface OpportunitiesDirectoryViewProps {
  initialType?: string;
  onSelectOpportunity: (opportunityId: string) => void;
  onBackToHub: () => void;
  onNavigatePortal: (route: string) => void;
  onOpenStudentLoginModal: () => void;
}

const OPPORTUNITY_TYPES: { label: string; value: string }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Placements', value: 'placement' },
  { label: 'Internships', value: 'internship' },
  { label: 'Live Projects', value: 'live-project' },
  { label: 'Industry Mentoring', value: 'industry-mentoring' },
  { label: 'Capstone Projects', value: 'capstone' },
  { label: 'International', value: 'international-internship' }
];

export const OpportunitiesDirectoryView: React.FC<OpportunitiesDirectoryViewProps> = ({
  initialType,
  onSelectOpportunity,
  onBackToHub,
  onNavigatePortal,
  onOpenStudentLoginModal
}) => {
  const store = usePlatformStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(initialType?.toLowerCase() || 'all');
  const [prevInitialType, setPrevInitialType] = useState<string | undefined>(initialType);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');

  if (initialType !== prevInitialType) {
    setPrevInitialType(initialType);
    setSelectedType(initialType?.toLowerCase() || 'all');
  }

  const isStudent = store.currentRole === 'STUDENT';

  // Filter opportunities from shared store
  const filteredOpportunities: Opportunity[] = useMemo(() => {
    return store.opportunities.filter((opp) => {
      // 1. Text Search across verified fields
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        opp.role.toLowerCase().includes(query) ||
        opp.companyName.toLowerCase().includes(query) ||
        opp.location.toLowerCase().includes(query) ||
        opp.eligibleSchools.some(s => s.toLowerCase().includes(query)) ||
        opp.eligibleProgrammes.some(p => p.toLowerCase().includes(query)) ||
        opp.requiredSkills.some(sk => sk.toLowerCase().includes(query));

      // 2. Type Filter
      let matchesType = true;
      if (selectedType !== 'all') {
        const oppTypeNormalized = opp.type.toLowerCase();
        if (selectedType === 'placement') {
          matchesType = oppTypeNormalized.includes('placement');
        } else if (selectedType === 'internship') {
          matchesType = oppTypeNormalized.includes('internship');
        } else if (selectedType === 'live-project') {
          matchesType = oppTypeNormalized.includes('live project');
        } else if (selectedType === 'industry-mentoring') {
          matchesType = oppTypeNormalized.includes('mentoring');
        } else if (selectedType === 'capstone') {
          matchesType = oppTypeNormalized.includes('capstone');
        } else if (selectedType === 'international-internship') {
          matchesType = oppTypeNormalized.includes('international');
        } else {
          matchesType = oppTypeNormalized === selectedType;
        }
      }

      // 3. School Filter
      let matchesSchool = true;
      if (selectedSchool !== 'all') {
        matchesSchool = opp.eligibleSchools.some(s => s.toLowerCase().includes(selectedSchool.toLowerCase()));
      }

      return matchesSearch && matchesType && matchesSchool;
    });
  }, [store.opportunities, searchQuery, selectedType, selectedSchool]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedSchool('all');
  };

  const scrollToEcosystem = () => {
    const el = document.getElementById('ecosystem-panel');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-navy-dark text-rvu-text selection:bg-gold selection:text-navy-dark pb-24">
      
      {/* 1. TOP BREADCRUMB BAR */}
      <div className="sticky top-0 z-40 bg-navy-dark/95 backdrop-blur-md border-b border-gold-border/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBackToHub}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-rvu-muted hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold rounded-lg px-2.5 py-1.5"
            aria-label="Back to Career Hub"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Back to Career Hub</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-rvu-subtle">
            <span>RVU Career Hub</span>
            <span>/</span>
            <span className="text-gold">Opportunities Discovery</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        
        {/* 2. SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Briefcase className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              CAREER DISCOVERY
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-rvu-text font-display tracking-tight mb-4">
            Find Your Opportunity
          </h1>
          
          <p className="text-sm sm:text-base text-rvu-muted leading-relaxed">
            Explore placement, internship and industry-connected opportunities across RV University. All published records reflect approved corporate and campus drives.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs font-mono text-rvu-subtle">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-surface border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {isStudent ? 'Personalized for you' : 'RVU Career Ecosystem'}
            </span>
          </div>
        </div>

        {/* 3. SEARCH & FILTER SUITE */}
        <div className="card-glass rounded-2xl p-5 sm:p-6 mb-8 space-y-4 border-gold-border/40">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-gold absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities, roles, skills or domains..."
              className="w-full bg-navy-surface border border-white/10 rounded-xl pl-12 pr-20 py-3 text-sm text-rvu-text placeholder-rvu-subtle focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-rvu-muted hover:text-gold transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {OPPORTUNITY_TYPES.map((t) => {
              const isSelected = selectedType === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-gold text-navy-dark font-bold shadow-gold-glow'
                      : 'bg-navy-surface text-rvu-muted hover:text-white border border-white/10 hover:border-gold/30'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* School Selector & Active Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gold-border/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-rvu-subtle font-mono uppercase text-[10px]">
                Filter by School:
              </span>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="bg-navy-surface border border-white/10 rounded-lg px-3 py-1.5 text-xs text-rvu-text focus:outline-none focus:border-gold"
              >
                <option value="all">All 9 Academic Schools</option>
                {RVU_OFFICIAL_SCHOOLS.map(s => (
                  <option key={s.id} value={s.name}>{s.shortName} – {s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-rvu-subtle">
                <strong className="text-gold font-bold">{filteredOpportunities.length}</strong> opportunities found
              </span>
              {(searchQuery || selectedType !== 'all' || selectedSchool !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-gold hover:underline font-mono"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

        </div>

        {/* 4. OPPORTUNITIES GRID */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredOpportunities.map((opp) => {
              const hasApplied = isStudent && store.applications.some(a => a.opportunityId === opp.id && a.studentId === store.student.id);

              return (
                <div
                  key={opp.id}
                  onClick={() => onSelectOpportunity(opp.id)}
                  className="group card-glass rounded-2xl p-6 transition-all duration-300 hover:border-gold hover:-translate-y-1.5 hover:shadow-gold-glow cursor-pointer flex flex-col justify-between border border-gold-border/40"
                >
                  <div>
                    {/* Top Row: Type & Status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-gold-faint text-gold border border-gold/30 font-semibold uppercase">
                        {opp.type}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted border border-white/10">
                        {opp.workMode}
                      </span>
                    </div>

                    {/* Role Title */}
                    <h2 className="text-base sm:text-lg font-bold text-rvu-text font-display group-hover:text-gold transition-colors mb-1 line-clamp-1">
                      {opp.role}
                    </h2>

                    {/* Company & Location */}
                    <div className="flex items-center gap-2 text-xs text-rvu-muted mb-3">
                      <Building className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="font-semibold text-rvu-text truncate">{opp.companyName}</span>
                      <span>•</span>
                      <span className="truncate">{opp.location}</span>
                    </div>

                    {/* Description snippet */}
                    <p className="text-xs text-rvu-muted line-clamp-2 leading-relaxed mb-4">
                      {opp.description}
                    </p>

                    {/* Compensation & CGPA */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono mb-4 text-rvu-subtle">
                      <span className="text-gold font-bold">{opp.ctcLpa}</span>
                      <span>•</span>
                      <span>Min CGPA: {opp.minCgpa}</span>
                    </div>

                    {/* Skills */}
                    {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {opp.requiredSkills.slice(0, 3).map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-navy-surface text-rvu-text border border-white/10"
                          >
                            {sk}
                          </span>
                        ))}
                        {opp.requiredSkills.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-rvu-muted">
                            +{opp.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer & CTA */}
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
                          <span>View Details</span>
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
          /* 5. STRUCTURED HONEST EMPTY STATE (No fake opportunities) */
          <div className="card-glass rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto mb-16 border-gold/30">
            <div className="w-12 h-12 rounded-full bg-gold-faint border border-gold/30 text-gold mx-auto flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold font-display text-rvu-text mb-2">
              No live opportunities match your current filters
            </h3>

            <p className="text-xs sm:text-sm text-rvu-muted leading-relaxed mb-6">
              New campus placement drives and approved internship listings will appear here when published through the RV University Placement Management System.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleClearFilters}
                className="btn-gold text-xs font-bold px-4 py-2.5 rounded-xl shadow-gold-sm"
              >
                Clear Filters
              </button>

              <button
                onClick={onOpenStudentLoginModal}
                className="btn-navy-outline text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-gold" />
                <span>Sign in as Student</span>
              </button>

              <button
                onClick={() => onNavigatePortal('/student/preparation')}
                className="px-4 py-2.5 rounded-xl bg-navy-surface text-xs font-medium text-rvu-text border border-white/10 hover:border-gold/40 transition-colors"
              >
                Explore Career Preparation
              </button>

              <button
                onClick={scrollToEcosystem}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-xs font-medium text-rvu-subtle hover:text-white transition-colors"
              >
                View Placement Ecosystem
              </button>
            </div>
          </div>
        )}

        {/* 6. RVU PLACEMENT ECOSYSTEM PANEL */}
        <div id="ecosystem-panel" className="mb-12">
          <RVUPlacementEcosystemPanel />
        </div>

      </div>

    </div>
  );
};
