import React, { useState, useMemo } from 'react';
import { DEMO_OPPORTUNITIES, type Opportunity } from '../../data/opportunities';
import { SCHOOL_FILTERS } from '../../data/placementStats';
import { OpportunityCard } from './OpportunityCard';
import { OpportunityModal } from './OpportunityModal';
import { Search, Filter, RefreshCw, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';

export const OpportunityExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Job' | 'Internship' | 'Placement'>('All');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<'all' | 'On-site' | 'Hybrid' | 'Remote'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'deadline'>('match');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Filtered & Sorted Opportunities
  const filteredOpportunities = useMemo(() => {
    return DEMO_OPPORTUNITIES.filter((opp) => {
      // Search query
      const matchesSearch = 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        opp.school.toLowerCase().includes(searchQuery.toLowerCase());

      // Category tab
      const matchesCategory = 
        selectedCategory === 'All' || 
        opp.category.toLowerCase() === selectedCategory.toLowerCase();

      // School filter
      const matchesSchool = 
        selectedSchool === 'all' || 
        (selectedSchool === 'cse' && opp.school.includes('Computer Science')) ||
        (selectedSchool === 'business' && opp.school.includes('Business')) ||
        (selectedSchool === 'design' && opp.school.includes('Design')) ||
        (selectedSchool === 'law' && opp.school.includes('Law')) ||
        (selectedSchool === 'sciences' && opp.school.includes('Sciences'));

      // Work mode
      const matchesWorkMode = 
        selectedWorkMode === 'all' || 
        opp.workMode === selectedWorkMode;

      return matchesSearch && matchesCategory && matchesSchool && matchesWorkMode;
    }).sort((a, b) => {
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      return a.deadline.localeCompare(b.deadline);
    });
  }, [searchQuery, selectedCategory, selectedSchool, selectedWorkMode, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSchool('all');
    setSelectedWorkMode('all');
    setSortBy('match');
  };

  return (
    <section id="opportunities" className="relative py-24 bg-navy overflow-hidden border-b border-gold-border/40">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Briefcase className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold">
              CAMPUS HIRING PORTAL
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            FIND YOUR OPPORTUNITY
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Explore verified placements, summer internships, and corporate fellowships aligned with your academic specializations.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card-glass rounded-2xl p-5 mb-10 space-y-4">
          
          {/* Top Row: Search input + Category Tabs */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 justify-between">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, internships, companies, skills..."
                className="w-full bg-navy-surface border border-gold/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-rvu-text placeholder-rvu-subtle focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-rvu-muted hover:text-gold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Primary Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-navy-surface border border-gold/20 overflow-x-auto">
              {(['All', 'Placement', 'Internship', 'Job'] as const).map((tab) => {
                const isSelected = selectedCategory === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedCategory(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                      isSelected
                        ? 'bg-gold text-navy-dark font-bold shadow-sm'
                        : 'text-rvu-muted hover:text-rvu-text hover:bg-white/5'
                    }`}
                  >
                    {tab === 'All' ? 'All Records' : `${tab}s`}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Bottom Row: Dropdown Filters & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gold-border/40 text-xs">
            
            <div className="flex flex-wrap items-center gap-3">
              {/* School Filter Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-rvu-muted font-medium">School:</span>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="bg-navy-surface border border-gold/20 rounded-lg px-2.5 py-1.5 text-xs text-rvu-text focus:border-gold focus:outline-none"
                >
                  {SCHOOL_FILTERS.map((s) => (
                    <option key={s.id} value={s.id} className="bg-navy-dark text-rvu-text">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Mode Filter Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-rvu-muted font-medium">Mode:</span>
                <select
                  value={selectedWorkMode}
                  onChange={(e) => setSelectedWorkMode(e.target.value as any)}
                  className="bg-navy-surface border border-gold/20 rounded-lg px-2.5 py-1.5 text-xs text-rvu-text focus:border-gold focus:outline-none"
                >
                  <option value="all" className="bg-navy-dark text-rvu-text">All Modes</option>
                  <option value="On-site" className="bg-navy-dark text-rvu-text">On-site</option>
                  <option value="Hybrid" className="bg-navy-dark text-rvu-text">Hybrid</option>
                  <option value="Remote" className="bg-navy-dark text-rvu-text">Remote</option>
                </select>
              </div>
            </div>

            {/* Right: Active Count & Sort */}
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-rvu-muted font-mono">
                Showing <strong className="text-gold">{filteredOpportunities.length}</strong> Opportunities
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-rvu-muted">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-navy-surface border border-gold/20 rounded-lg px-2.5 py-1.5 text-xs text-rvu-text focus:border-gold focus:outline-none"
                >
                  <option value="match" className="bg-navy-dark text-rvu-text">Best Match %</option>
                  <option value="deadline" className="bg-navy-dark text-rvu-text">Deadline Approaching</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Opportunity Cards Grid */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.slice(0, visibleCount).map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onSelect={(opp) => setSelectedOpportunity(opp)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="card-glass rounded-2xl p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-gold-faint border border-gold/30 text-gold flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-rvu-text mb-2">No Matching Opportunities Found</h3>
            <p className="text-xs text-rvu-muted mb-6 leading-relaxed">
              No campus postings match your current filter parameters. Try broadening your query or resetting all filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleResetFilters}
            >
              Reset All Filters
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {filteredOpportunities.length > visibleCount && (
          <div className="mt-12 text-center">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setVisibleCount((prev) => prev + 3)}
            >
              Load More Opportunities
            </Button>
          </div>
        )}

        {/* Detail Modal Dialog */}
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />

      </div>
    </section>
  );
};
