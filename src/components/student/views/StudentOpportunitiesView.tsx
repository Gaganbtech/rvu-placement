import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import type { Opportunity, Student, Application } from '../../../data/platform/types';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'Placement' | 'Internship' | 'Internship + PPO'>('ALL');
  const [selectedWorkMode, setSelectedWorkMode] = useState<'ALL' | 'On-site' | 'Hybrid' | 'Remote'>('ALL');

  // Filter only approved & published opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    if (!opp.isPublished || !opp.approvedByAdmin) return false;

    // Search query
    const matchSearch = 
      opp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by type
    const matchType = selectedType === 'ALL' || opp.type === selectedType;

    // Filter by mode
    const matchMode = selectedWorkMode === 'ALL' || opp.workMode === selectedWorkMode;

    return matchSearch && matchType && matchMode;
  });

  const getApplicationForOpportunity = (opportunityId: string) => {
    return applications.find(a => a.opportunityId === opportunityId);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                SHARED CAMPUS PLACEMENT SYSTEM
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Verified & Published
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Active Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Browse approved campus hiring drives and verified internship tracks for the {student.programme} 2027 cohort.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 shrink-0">
            <div className="text-2xl font-bold font-mono text-gold">
              {filteredOpportunities.length}
            </div>
            <div className="text-xs text-rvu-subtle font-mono">
              Open Positions
            </div>
          </div>
        </div>

        {/* Opportunity Lifecycle Explainer Box */}
        <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-rvu-subtle font-mono overflow-x-auto">
          <span className="text-gold font-bold">Lifecycle Gate:</span>
          <span className="text-rvu-muted">Recruiter Draft</span>
          <span>&rarr;</span>
          <span className="text-rvu-muted">CAR Review</span>
          <span>&rarr;</span>
          <span className="text-emerald-400 font-semibold">✓ Approved & Published</span>
          <span>&rarr;</span>
          <span className="text-white">Student Apply</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-navy-card border border-gold-border/40 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rvu-subtle" />
          <input
            type="text"
            placeholder="Search by role, company name, or tech skill (React, Python, etc.)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1720] border border-white/10 text-white placeholder:text-rvu-subtle text-xs focus:outline-none focus:border-gold"
          />
        </div>

        {/* Role Type Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {(['ALL', 'Placement', 'Internship + PPO'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-gold text-navy-dark font-bold'
                  : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
              }`}
            >
              {type === 'ALL' ? 'All Types' : type}
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

      {/* Opportunities List */}
      {filteredOpportunities.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-navy-card border border-white/10 text-rvu-muted space-y-2">
          <p className="text-sm">No opportunities match your filter criteria.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('ALL');
              setSelectedWorkMode('ALL');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOpportunities.map((opp) => {
            const existingApp = getApplicationForOpportunity(opp.id);
            const isApplied = !!existingApp;

            return (
              <div
                key={opp.id}
                className="rounded-2xl bg-navy-card border border-gold-border/60 hover:border-gold transition-all p-6 flex flex-col justify-between space-y-5 shadow-card group"
              >
                <div className="space-y-4">
                  {/* Top metadata */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-lg group-hover:scale-105 transition-transform">
                        {opp.companyName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-rvu-muted">
                            {opp.companyName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-emerald-400 border border-emerald-500/20">
                            CAR Approved
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-white font-display group-hover:text-gold transition-colors leading-tight">
                          {opp.role}
                        </h2>
                      </div>
                    </div>

                    {opp.matchScoreForDemoStudent && (
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 shrink-0">
                        {opp.matchScoreForDemoStudent}% Match
                      </span>
                    )}
                  </div>

                  {/* Core Attributes */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono p-3 rounded-xl bg-[#0E1720] border border-white/5">
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

                  {/* Eligible Programmes */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-rvu-subtle">
                      Eligible Programmes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {opp.eligibleProgrammes.map((prog) => (
                        <span key={prog} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-rvu-text font-mono">
                          {prog}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-rvu-subtle">
                      Skills Required:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {opp.requiredSkills.map((skill) => (
                        <span key={skill} className="text-[10px] px-2 py-0.5 rounded bg-gold/10 border border-gold/20 text-gold font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Application Deadline & Drive Date */}
                  <div className="flex items-center justify-between text-xs font-mono text-rvu-subtle pt-1">
                    <span>Deadline: <strong className="text-amber-300">{opp.applicationDeadline}</strong></span>
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
                    View Opportunity
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
