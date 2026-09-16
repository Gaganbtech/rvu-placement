import React, { useState } from 'react';
import {
  Search,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { SchoolDataService } from '../../services/schoolDataService';
import type { SchoolInfo } from '../../data/schools';

interface SchoolsDirectoryViewProps {
  onSelectSchool: (schoolSlug: string) => void;
  onBackToHub: () => void;
}

const CATEGORIES = [
  'All',
  'Engineering & Technology',
  'Design',
  'Business',
  'Economics & Public Policy',
  'Liberal Arts & Sciences',
  'Law',
  'Film & Media',
  'Continuing Education',
  'Healthcare'
];

export const SchoolsDirectoryView: React.FC<SchoolsDirectoryViewProps> = ({
  onSelectSchool,
  onBackToHub
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSchools: SchoolInfo[] = SchoolDataService.searchSchools(
    searchQuery,
    selectedCategory === 'All' ? undefined : selectedCategory
  );

  return (
    <div className="min-h-screen bg-navy-dark text-rvu-text selection:bg-gold selection:text-navy-dark pb-24">
      
      {/* Top Bar */}
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
            <span className="text-gold">Academic Schools</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <GraduationCap className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              9 ACADEMIC SCHOOLS
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-rvu-text font-display tracking-tight mb-4">
            Multidisciplinary Talent Ecosystem
          </h1>
          
          <p className="text-sm sm:text-base text-rvu-muted leading-relaxed">
            Explore RV University's 9 academic schools. Discover official degree programmes, research centres, academic leadership, and dedicated career recruitment tracks.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="max-w-4xl mx-auto mb-12 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-rvu-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schools by name, discipline, programme, or career domain..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-navy-surface border border-white/10 text-rvu-text placeholder-rvu-subtle focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-gold text-navy-dark font-bold shadow-gold-glow'
                      : 'bg-navy-surface text-rvu-muted hover:text-white border border-white/10 hover:border-gold/30'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map(school => (
            <button
              key={school.id}
              onClick={() => onSelectSchool(school.slug)}
              className="group text-left card-glass rounded-2xl p-6 transition-all duration-300 hover:border-gold/60 hover:-translate-y-1 hover:shadow-gold-glow flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label={`Explore ${school.name}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30 uppercase tracking-wide">
                    {school.shortName}
                  </span>
                  <div className="p-1 rounded-lg bg-navy-surface text-rvu-muted group-hover:text-gold group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <h2 className="text-lg font-bold text-rvu-text font-display group-hover:text-gold transition-colors mb-2 line-clamp-2">
                  {school.name}
                </h2>

                <p className="text-xs text-rvu-muted leading-relaxed mb-5 line-clamp-3">
                  {school.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-rvu-subtle mb-4">
                  <span className="flex items-center gap-1 font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-gold" />
                    {school.programmes.length} Programmes
                  </span>
                  {school.research && school.research.length > 0 && (
                    <span className="font-mono">
                      • {school.research.length} Research Centres
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gold-border/40">
                <span className="text-[10px] text-rvu-subtle uppercase tracking-wider block mb-2 font-mono">
                  Relevant Career Domains
                </span>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {school.careerDomains.slice(0, 3).map((domain, dIdx) => (
                    <span
                      key={dIdx}
                      className="text-[10px] px-2 py-0.5 rounded bg-navy-surface text-rvu-text border border-white/10"
                    >
                      {domain}
                    </span>
                  ))}
                  {school.careerDomains.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-rvu-muted">
                      +{school.careerDomains.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-gold font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore School Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-16 card-glass rounded-2xl max-w-lg mx-auto">
            <p className="text-base text-rvu-muted mb-4">
              No schools matched your search criteria "{searchQuery}".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="btn-gold text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
