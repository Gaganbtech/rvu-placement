import React, { useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  GraduationCap,
  Sparkles,
  BookOpen,
  Briefcase,
  Users,
  Cpu,
  CheckCircle2,
  Building,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import type { SchoolInfo, DegreeLevel } from '../../data/schools';
import { usePlatformStore } from '../../data/platform/studentStore';

interface SchoolDetailViewProps {
  school: SchoolInfo;
  onBack: () => void;
  onNavigateProgramme: (programmeSlug: string) => void;
  onNavigateOpportunity?: (opportunityId?: string) => void;
  onNavigatePortal?: (route: string) => void;
}

export const SchoolDetailView: React.FC<SchoolDetailViewProps> = ({
  school,
  onBack,
  onNavigateProgramme,
  onNavigateOpportunity,
  onNavigatePortal
}) => {
  const [activeProgrammeTab, setActiveProgrammeTab] = useState<DegreeLevel | 'ALL'>('ALL');
  const { opportunities } = usePlatformStore();

  // Filter programmes by degree level tab
  const filteredProgrammes = school.programmes.filter(p => {
    if (activeProgrammeTab === 'ALL') return true;
    return p.degreeLevel === activeProgrammeTab;
  });

  // Filter matching placement opportunities from Career Hub
  const matchedOpportunities = opportunities.filter(opp => {
    const oppSchools = opp.eligibleSchools || [];
    const matchesSchoolName =
      oppSchools.some(s =>
        s.toLowerCase().includes(school.name.toLowerCase()) ||
        s.toLowerCase().includes(school.shortName.toLowerCase()) ||
        school.name.toLowerCase().includes(s.toLowerCase())
      );

    const oppSkills = [...(opp.requiredSkills || []), ...(opp.niceToHaveSkills || [])];
    const matchesDomain = oppSkills.some((skill: string) =>
      school.careerDomains.some(d => d.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(d.toLowerCase()))
    );

    return matchesSchoolName || matchesDomain;
  });

  const availableDegreeLevels: DegreeLevel[] = [
    'UNDERGRADUATE',
    'POSTGRADUATE',
    'PH_D',
    'DIPLOMA_CERTIFICATE'
  ].filter(lvl => school.programmes.some(p => p.degreeLevel === lvl)) as DegreeLevel[];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-navy-dark text-rvu-text selection:bg-gold selection:text-navy-dark pb-24">
      
      {/* 1. TOP BREADCRUMB & BACK NAVIGATION BAR */}
      <div className="sticky top-0 z-40 bg-navy-dark/95 backdrop-blur-md border-b border-gold-border/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-rvu-muted hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold rounded-lg px-2.5 py-1.5"
            aria-label="Back to Multidisciplinary Talent Ecosystem"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Back to Schools</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-rvu-subtle">
            <span className="hidden sm:inline">RVU Career Hub</span>
            <span className="hidden sm:inline">/</span>
            <span>Schools</span>
            <span>/</span>
            <span className="text-gold truncate max-w-[180px] sm:max-w-[260px]">{school.shortName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* 2. HERO / SCHOOL HEADER */}
        <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 card-glass border-gold/40 shadow-2xl overflow-hidden mb-12">
          {/* Subtle Circuit Background */}
          <div className="absolute inset-0 bg-tech-circuit opacity-25 pointer-events-none" />

          <div className="relative z-10">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 text-gold text-xs font-mono font-semibold tracking-wider uppercase">
                <GraduationCap className="w-3.5 h-3.5" />
                {school.shortName}
              </span>
              <span className="px-3 py-1 rounded-full bg-navy-surface text-rvu-muted text-xs border border-white/10 font-mono">
                {school.category}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Official RVU School
              </span>
            </div>

            {/* School Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-rvu-text font-display tracking-tight leading-tight mb-5 max-w-4xl">
              {school.name}
            </h1>

            {/* Official Description */}
            <p className="text-sm sm:text-base lg:text-lg text-rvu-muted leading-relaxed max-w-3xl mb-8">
              {school.description}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => scrollToSection('programmes-section')}
                className="btn-gold text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <BookOpen className="w-4 h-4" />
                Explore Programmes ({school.programmes.length})
              </button>

              <a
                href={school.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-navy-outline text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:border-gold hover:text-gold transition-colors"
              >
                <span>Visit Official School Website</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => scrollToSection('career-connection-section')}
                className="px-4 py-2.5 rounded-xl bg-navy-surface/80 hover:bg-navy-surface text-xs sm:text-sm font-medium text-rvu-text border border-white/10 hover:border-gold/40 transition-colors flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-gold" />
                Placement Opportunities
              </button>
            </div>

            {/* Source Verification Banner */}
            <div className="mt-8 pt-6 border-t border-gold-border/30 flex flex-wrap items-center justify-between gap-3 text-xs text-rvu-subtle font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                <span>Information verified from RV University official sources</span>
              </div>
              <div>
                <span>Last verified: </span>
                <span className="text-rvu-muted">{school.lastVerified}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. GRID CONTENT SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* MAIN LEFT COLUMN: 2 SPANS */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* A. ABOUT THE SCHOOL */}
            <section className="card-glass rounded-2xl p-6 sm:p-8 border-gold-border/40">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-bold font-display text-rvu-text">
                  About the School
                </h2>
              </div>
              <p className="text-sm sm:text-base text-rvu-muted leading-relaxed mb-6">
                {school.description}
              </p>

              {school.keyStrengths && school.keyStrengths.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-gold mb-3">
                    Key Academic & Research Strengths
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {school.keyStrengths.map((strength, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-navy-surface border border-white/5 text-xs sm:text-sm text-rvu-text"
                      >
                        <Sparkles className="w-4 h-4 text-gold shrink-0" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 text-right">
                <a
                  href={school.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gold hover:underline"
                >
                  <span>Source: {school.sourceLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </section>

            {/* B. CURRENT PROGRAMMES */}
            <section id="programmes-section" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-gold tracking-wider mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    ACADEMIC OFFERINGS
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-rvu-text">
                    Current Programmes
                  </h2>
                </div>

                {/* Level Tabs */}
                {availableDegreeLevels.length > 1 && (
                  <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-navy-surface border border-white/10 text-xs">
                    <button
                      onClick={() => setActiveProgrammeTab('ALL')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        activeProgrammeTab === 'ALL'
                          ? 'bg-gold text-navy-dark font-bold'
                          : 'text-rvu-muted hover:text-white'
                      }`}
                    >
                      All ({school.programmes.length})
                    </button>
                    {availableDegreeLevels.map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setActiveProgrammeTab(lvl)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          activeProgrammeTab === lvl
                            ? 'bg-gold text-navy-dark font-bold'
                            : 'text-rvu-muted hover:text-white'
                        }`}
                      >
                        {lvl === 'UNDERGRADUATE'
                          ? 'UG'
                          : lvl === 'POSTGRADUATE'
                          ? 'PG'
                          : lvl === 'PH_D'
                          ? 'Ph.D.'
                          : 'Cert/Diploma'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Programme Cards Grid */}
              <div className="space-y-4">
                {filteredProgrammes.map(prog => (
                  <div
                    key={prog.id}
                    onClick={() => onNavigateProgramme(prog.slug)}
                    className="group card-glass rounded-2xl p-5 sm:p-6 border-gold-border/30 hover:border-gold transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30">
                            {prog.degreeType}
                          </span>
                          <span className="text-[11px] font-mono text-rvu-subtle">
                            {prog.duration}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-rvu-text group-hover:text-gold transition-colors">
                          {prog.name}
                        </h3>
                      </div>
                      <div className="p-2 rounded-xl bg-navy-surface text-rvu-muted group-hover:text-gold group-hover:bg-gold-faint transition-colors shrink-0">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    {prog.overview && (
                      <p className="text-xs sm:text-sm text-rvu-muted mb-4 line-clamp-2 leading-relaxed">
                        {prog.overview}
                      </p>
                    )}

                    {prog.specialisations && prog.specialisations.length > 0 && (
                      <div className="pt-3 border-t border-white/5">
                        <span className="text-[10px] font-mono uppercase text-rvu-subtle block mb-1.5">
                          Verified Tracks / Specialisations:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {prog.specialisations.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] px-2 py-0.5 rounded bg-navy-surface text-rvu-text border border-white/5"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                      <span className="text-gold font-semibold group-hover:underline inline-flex items-center gap-1">
                        View Programme Details
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      <a
                        href={prog.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-rvu-subtle hover:text-white hover:underline flex items-center gap-1"
                      >
                        Official RVU Page
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* C. RESEARCH & INNOVATION (Only when officially available) */}
            {school.research && school.research.length > 0 && (
              <section className="card-glass rounded-2xl p-6 sm:p-8 border-gold-border/40">
                <div className="flex items-center gap-2.5 mb-6">
                  <Cpu className="w-5 h-5 text-gold" />
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-rvu-text">
                    Research & Innovation Centres
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {school.research.map((centre, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-4 rounded-xl bg-navy-surface border border-white/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-gold mb-1">
                          {centre.focusArea}
                        </div>
                        <h4 className="text-sm font-bold text-rvu-text mb-2">
                          {centre.name}
                        </h4>
                        {centre.description && (
                          <p className="text-xs text-rvu-muted leading-relaxed mb-3">
                            {centre.description}
                          </p>
                        )}
                      </div>
                      {centre.officialUrl && (
                        <a
                          href={centre.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-gold font-medium hover:underline pt-2 border-t border-white/5"
                        >
                          <span>Explore Research</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* D. LEARNING EXPERIENCE */}
            {school.learningExperience && school.learningExperience.length > 0 && (
              <section className="card-glass rounded-2xl p-6 sm:p-8 border-gold-border/40">
                <div className="flex items-center gap-2.5 mb-6">
                  <Layers className="w-5 h-5 text-gold" />
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-rvu-text">
                    Learning Experience & Infrastructure
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {school.learningExperience.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-navy-surface/90 border border-white/5"
                    >
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-rvu-muted border border-white/10 mb-2 inline-block">
                        {item.type}
                      </span>
                      <h4 className="text-sm font-bold text-rvu-text mb-1.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-rvu-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* E. PLACEMENT & CAREER CONNECTION */}
            <section id="career-connection-section" className="card-glass rounded-2xl p-6 sm:p-8 border-gold/40 shadow-gold-glow/20">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-gold tracking-wider mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    CAREER CONNECTION
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-rvu-text">
                    RVU Career Hub Alignment
                  </h2>
                </div>

                {onNavigatePortal && (
                  <button
                    onClick={() => onNavigatePortal('/student/opportunities')}
                    className="btn-gold text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                  >
                    <span>Browse All Opportunities</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {matchedOpportunities.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs text-rvu-muted mb-4">
                    Relevant placement and internship tracks actively connected with this school's curriculum:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {matchedOpportunities.slice(0, 4).map(opp => (
                      <div
                        key={opp.id}
                        onClick={() => onNavigateOpportunity ? onNavigateOpportunity(opp.id) : (onNavigatePortal && onNavigatePortal('/student/opportunities'))}
                        className="p-4 rounded-xl bg-navy-surface hover:border-gold/50 border border-white/10 transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold">
                              {opp.type}
                            </span>
                            <span className="text-[10px] text-rvu-subtle font-mono">
                              {opp.ctcLpa}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-rvu-text mb-1 line-clamp-1">
                            {opp.role}
                          </h4>
                          <div className="text-xs text-rvu-muted mb-3 flex items-center gap-1">
                            <Building className="w-3 h-3 text-gold" />
                            <span>{opp.companyName}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[11px] text-gold font-medium">
                          <span>View Opportunity</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-navy-surface/50 border border-white/5 text-center">
                  <p className="text-xs sm:text-sm text-rvu-muted">
                    No current opportunities are available for this school right now. Check back soon as new campus drives open.
                  </p>
                </div>
              )}
            </section>

          </div>

          {/* SIDEBAR RIGHT COLUMN: 1 SPAN */}
          <div className="space-y-8">
            
            {/* A. RELEVANT CAREER DOMAINS */}
            <div className="card-glass rounded-2xl p-6 border-gold-border/40">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gold font-mono mb-2">
                Relevant Career Domains
              </h3>
              <p className="text-[11px] text-rvu-subtle leading-relaxed mb-4 italic">
                "Career domains shown here are relevant career areas for placement discovery and are not necessarily official programme titles."
              </p>
              <div className="flex flex-wrap gap-1.5">
                {school.careerDomains.map((domain, dIdx) => (
                  <span
                    key={dIdx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-navy-surface text-rvu-text border border-white/10"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            {/* B. ACADEMIC LEADERSHIP & FACULTY */}
            {(school.leadership.length > 0 || school.faculty.length > 0) && (
              <div className="card-glass rounded-2xl p-6 border-gold-border/40 space-y-5">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-rvu-text font-mono">
                    Leadership & Faculty
                  </h3>
                </div>

                {/* Leadership */}
                {school.leadership.length > 0 && (
                  <div className="space-y-3">
                    {school.leadership.map((leader, lIdx) => (
                      <div
                        key={lIdx}
                        className="p-3 rounded-xl bg-navy-surface border border-gold/30"
                      >
                        <div className="text-[10px] font-mono text-gold uppercase tracking-wider mb-0.5">
                          {leader.roleType === 'DEAN' ? 'Dean' : 'Associate Dean'}
                        </div>
                        <h4 className="text-sm font-bold text-rvu-text">
                          {leader.name}
                        </h4>
                        <div className="text-xs text-rvu-muted mb-2">
                          {leader.designation}
                        </div>
                        {leader.areasOfExpertise && leader.areasOfExpertise.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {leader.areasOfExpertise.map((exp, eIdx) => (
                              <span
                                key={eIdx}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-rvu-muted"
                              >
                                {exp}
                              </span>
                            ))}
                          </div>
                        )}
                        {leader.profileUrl && (
                          <a
                            href={leader.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-gold hover:underline"
                          >
                            <span>Official Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Faculty Sample */}
                {school.faculty.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-rvu-subtle block mb-1">
                      Faculty Members:
                    </span>
                    {school.faculty.map((fac, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-2.5 rounded-lg bg-navy-surface/60 border border-white/5 text-xs"
                      >
                        <div className="font-semibold text-rvu-text">{fac.name}</div>
                        <div className="text-[11px] text-rvu-muted">{fac.designation}</div>
                        {fac.areasOfExpertise && fac.areasOfExpertise.length > 0 && (
                          <div className="text-[10px] text-rvu-subtle mt-1 truncate">
                            {fac.areasOfExpertise.join(' • ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* C. COLLABORATIONS */}
            {school.collaborations && school.collaborations.length > 0 && (
              <div className="card-glass rounded-2xl p-6 border-gold-border/40">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gold font-mono mb-3">
                  Collaborations & Initiatives
                </h3>
                <ul className="space-y-2 text-xs text-rvu-muted">
                  {school.collaborations.map((collab, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span>{collab}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* D. OFFICIAL SCHOOL LINKS */}
            <div className="card-glass rounded-2xl p-6 border-gold-border/40 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rvu-text font-mono mb-2">
                Official RVU Links
              </h3>
              <div className="space-y-1.5 text-xs">
                {school.officialPages.overview && (
                  <a
                    href={school.officialPages.overview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-navy-surface hover:bg-white/10 text-rvu-muted hover:text-white transition-colors"
                  >
                    <span>School Overview</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold" />
                  </a>
                )}
                {school.officialPages.programmes && (
                  <a
                    href={school.officialPages.programmes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-navy-surface hover:bg-white/10 text-rvu-muted hover:text-white transition-colors"
                  >
                    <span>Official Programmes</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold" />
                  </a>
                )}
                {school.officialPages.faculty && (
                  <a
                    href={school.officialPages.faculty}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-navy-surface hover:bg-white/10 text-rvu-muted hover:text-white transition-colors"
                  >
                    <span>Faculty Directory</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold" />
                  </a>
                )}
                {school.officialPages.admissions && (
                  <a
                    href={school.officialPages.admissions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-navy-surface hover:bg-white/10 text-rvu-muted hover:text-white transition-colors"
                  >
                    <span>Admissions Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold" />
                  </a>
                )}
              </div>
            </div>

            {/* E. CONTACT */}
            {school.contact && (
              <div className="card-glass rounded-2xl p-6 border-white/10 text-xs space-y-2">
                <span className="text-[10px] font-mono uppercase text-rvu-subtle block">
                  Campus Address
                </span>
                <p className="text-rvu-muted leading-relaxed">
                  {school.contact.location}
                </p>
                {school.contact.email && (
                  <p className="text-gold font-mono pt-2 border-t border-white/5">
                    {school.contact.email}
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
