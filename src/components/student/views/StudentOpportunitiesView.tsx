import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  ArrowRight,
  Bookmark,
  Sparkles,
  X,
  Clock,
  Check
} from 'lucide-react';
import type { Opportunity, Student, Application } from '../../../data/platform/types';
import { useStudentStore } from '../../../data/platform/studentStore';
import { StudentIntelligenceService } from '../../../services/studentIntelligenceService';
import { Button } from '../../ui/Button';

interface StudentOpportunitiesViewProps {
  student: Student;
  opportunities: Opportunity[];
  applications: Application[];
  onNavigate: (route: string) => void;
  onOpenApplyModal: (opp: Opportunity) => void;
}

export const StudentOpportunitiesView: React.FC<StudentOpportunitiesViewProps> = ({
  student,
  opportunities,
  applications,
  onNavigate,
  onOpenApplyModal
}) => {
  const store = useStudentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'Placement' | 'Internship' | 'Internship + PPO'>('ALL');
  const [selectedWorkMode, setSelectedWorkMode] = useState<'ALL' | 'On-site' | 'Hybrid' | 'Remote'>('ALL');
  const [onlySaved, setOnlySaved] = useState(false);
  const [onlyEligible, setOnlyEligible] = useState(false);

  // Compute matches using StudentIntelligenceService
  const opportunitiesWithMatch = useMemo(() => {
    return opportunities.map(opp => {
      const match = StudentIntelligenceService.calculateOpportunityMatch(student, opp);
      const isSaved = store.isOpportunitySaved(opp.id);
      const isEligible = 
        student.cgpa >= opp.minCgpa && 
        student.activeBacklogs <= opp.maxBacklogsAllowed &&
        opp.eligibleProgrammes.some(p => student.programme.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(student.programme.toLowerCase())) &&
        opp.eligibleGraduationYears.includes(student.graduationYear);

      return {
        ...opp,
        matchAnalysis: match,
        isEligible,
        isSaved
      };
    });
  }, [opportunities, student, store]);

  // Filter approved & published opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunitiesWithMatch.filter((opp) => {
      if (!opp.isPublished || !opp.approvedByAdmin) return false;

      // Saved filter
      if (onlySaved && !opp.isSaved) return false;

      // Eligibility filter
      if (onlyEligible && !opp.isEligible) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSearch = 
          opp.role.toLowerCase().includes(q) ||
          opp.companyName.toLowerCase().includes(q) ||
          opp.location.toLowerCase().includes(q) ||
          opp.requiredSkills.some(s => s.toLowerCase().includes(q));
        if (!matchSearch) return false;
      }

      // Filter by type
      if (selectedType !== 'ALL' && opp.type !== selectedType) return false;

      // Filter by mode
      if (selectedWorkMode !== 'ALL' && opp.workMode !== selectedWorkMode) return false;

      return true;
    });
  }, [opportunitiesWithMatch, onlySaved, onlyEligible, searchQuery, selectedType, selectedWorkMode]);

  const getApplicationForOpportunity = (opportunityId: string) => {
    return applications.find(a => a.opportunityId === opportunityId);
  };

  const savedCount = store.savedOpportunityIds.length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                SHARED CAMPUS PLACEMENT SYSTEM
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Verified & Published
              </span>
              <span className="text-[10px] font-mono text-rvu-muted bg-white/5 px-2 py-0.5 rounded border border-white/10">
                Graduation: {student.graduationYear} ({student.programme})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-2">
              Campus Placement & Internship Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Explore officially verified hiring drives, on-campus recruitments, and industry internship tracks curated for RV University students.
            </p>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-white/10 sm:pl-6 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-gold">
                {filteredOpportunities.length}
              </div>
              <div className="text-xs text-rvu-subtle font-mono">
                Matching Openings
              </div>
            </div>
            <div className="text-right border-l border-white/10 pl-4">
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {savedCount}
              </div>
              <div className="text-xs text-rvu-subtle font-mono">
                Saved / Watchlist
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity Lifecycle Explainer Box */}
        <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-rvu-subtle font-mono overflow-x-auto">
          <span className="text-gold font-bold">CAR Verified Pipeline:</span>
          <span className="text-rvu-muted">Recruiter Draft</span>
          <span>&rarr;</span>
          <span className="text-rvu-muted">CAR Verification</span>
          <span>&rarr;</span>
          <span className="text-emerald-400 font-semibold">✓ Approved for RVU</span>
          <span>&rarr;</span>
          <span className="text-gold font-semibold">Student Application</span>
          <span>&rarr;</span>
          <span className="text-white">Campus Interview</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-navy-card border border-gold-border/40 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rvu-subtle" />
            <input
              type="text"
              placeholder="Search role, company (e.g. Mercedes-Benz, Adobe), location or skill (React, Python)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0E1720] border border-white/10 text-white placeholder:text-rvu-subtle text-xs focus:outline-none focus:border-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-rvu-subtle hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Saved Toggle */}
            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                onlySaved
                  ? 'bg-gold text-navy-dark font-bold shadow-md'
                  : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
              }`}
              title="Show only saved opportunities"
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-current' : ''}`} />
              <span>Saved ({savedCount})</span>
            </button>

            {/* Eligible Toggle */}
            <button
              onClick={() => setOnlyEligible(!onlyEligible)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                onlyEligible
                  ? 'bg-emerald-500 text-navy-dark font-bold shadow-md'
                  : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
              }`}
              title="Show only roles you are strictly eligible for"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Eligible Only</span>
            </button>

            {/* Role Type Filter */}
            {(['ALL', 'Placement', 'Internship + PPO'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-gold/20 text-gold border border-gold/40 font-bold'
                    : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
                }`}
              >
                {type === 'ALL' ? 'All Roles' : type}
              </button>
            ))}

            {/* Work Mode Filter */}
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-[#0E1720] border border-white/10 text-xs font-mono text-rvu-muted focus:outline-none focus:border-gold"
            >
              <option value="ALL">All Modes</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-navy-card border border-white/10 text-rvu-muted space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-white">No opportunities match your current filter criteria.</p>
          <p className="text-xs text-rvu-subtle max-w-md mx-auto">
            {onlySaved ? 'You have not bookmarked any opportunities yet. Click the bookmark icon on any opportunity card to save it for quick access.' : 'Try adjusting your search query, clearing specific work mode filters, or disabling strict eligibility.'}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('ALL');
              setSelectedWorkMode('ALL');
              setOnlySaved(false);
              setOnlyEligible(false);
            }}
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOpportunities.map((opp) => {
            const existingApp = getApplicationForOpportunity(opp.id);
            const isApplied = !!existingApp;
            const isSaved = opp.isSaved;
            const match = opp.matchAnalysis;

            return (
              <div
                key={opp.id}
                className="rounded-2xl bg-navy-card border border-gold-border/60 hover:border-gold transition-all p-6 flex flex-col justify-between space-y-5 shadow-card group relative"
              >
                <div className="space-y-4">
                  {/* Top metadata */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-lg group-hover:scale-105 transition-transform shrink-0">
                        {opp.companyName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-rvu-muted">
                            {opp.companyName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-emerald-400 border border-emerald-500/20">
                            CAR Verified
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gold/10 text-gold border border-gold/20">
                            {opp.type}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-white font-display group-hover:text-gold transition-colors leading-tight truncate">
                          {opp.role}
                        </h2>
                      </div>
                    </div>

                    {/* Actions on top right: Bookmark & Match Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => store.toggleSaveOpportunity(opp.id)}
                        className={`p-2 rounded-xl border transition-all ${
                          isSaved 
                            ? 'bg-gold text-navy-dark border-gold shadow-sm' 
                            : 'bg-[#0E1720] border-white/10 text-rvu-subtle hover:text-gold hover:border-gold/40'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                        aria-label={isSaved ? 'Unsave opportunity' : 'Save opportunity'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>

                      <div 
                        className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center gap-1"
                        title={`Deterministic Readiness Match: ${match.score}% (${match.matchedSkills.length} matching skills)`}
                      >
                        <Sparkles className="w-3 h-3 text-gold" />
                        <span>{match.score}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Core Attributes */}
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono p-3 rounded-xl bg-[#0E1720] border border-white/5">
                    <div>
                      <span className="text-[10px] text-rvu-subtle block">Package / CTC</span>
                      <strong className="text-emerald-400 font-bold">{opp.ctcLpa}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-rvu-subtle block">Work Mode</span>
                      <span className="text-white">{opp.workMode}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-rvu-subtle block">Location</span>
                      <span className="text-white truncate block">{opp.location.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-rvu-muted line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Skills Match Breakdown */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-rvu-subtle uppercase">Skills Alignment:</span>
                      <span className="text-gold">{match.matchedSkills.length} / {opp.requiredSkills.length} skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {opp.requiredSkills.map((skill) => {
                        const isMatched = match.matchedSkills.some((s: string) => s.toLowerCase() === skill.toLowerCase());
                        return (
                          <span
                            key={skill}
                            className={`text-[10px] px-2 py-0.5 rounded font-mono transition-colors ${
                              isMatched
                                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold'
                                : 'bg-white/5 border border-white/10 text-rvu-muted'
                            }`}
                          >
                            {isMatched ? `✓ ${skill}` : skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Application Deadline & Drive Date */}
                  <div className="flex items-center justify-between text-xs font-mono text-rvu-subtle pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Deadline: <strong className="text-amber-300">{opp.applicationDeadline}</strong></span>
                    </span>
                    <span>Drive: <strong className="text-white">{opp.driveDate}</strong></span>
                  </div>
                </div>

                {/* Footer CTAs */}
                <div className="pt-3 border-t border-white/5 flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onNavigate(`/student/opportunities/${opp.id}`)}
                    className="flex-1 justify-center text-xs"
                  >
                    View Details
                  </Button>

                  {isApplied ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate(`/student/applications/${existingApp.id}`)}
                      className="flex-1 justify-center text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
                      icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    >
                      Applied ({existingApp.stage})
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onOpenApplyModal(opp)}
                      className="flex-1 justify-center text-xs"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Apply Now
                    </Button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
