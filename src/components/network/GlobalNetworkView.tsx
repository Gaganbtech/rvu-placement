import React, { useState } from 'react';
import {
  Globe,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Building,
  CheckCircle2,
  ChevronRight,
  Users
} from 'lucide-react';
import { IndustryNetworkService } from '../../services/industryNetworkService';
import type { GlobalRegionCollaboration } from '../../data/industryNetwork';

interface GlobalNetworkViewProps {
  onBackToHub: () => void;
  onNavigatePortal: (route: string) => void;
}

export const GlobalNetworkView: React.FC<GlobalNetworkViewProps> = ({
  onBackToHub,
  onNavigatePortal
}) => {
  const regions = IndustryNetworkService.getGlobalRegions();
  const collaborationTypes = IndustryNetworkService.getCollaborationTypes();
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id || 'reg-usa');

  const selectedRegion: GlobalRegionCollaboration =
    regions.find(r => r.id === selectedRegionId) || regions[0];

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
            <span>RVU</span>
            <span>/</span>
            <span>Industry Network</span>
            <span>/</span>
            <span className="text-gold">Global Network</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Globe className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              GLOBAL COLLABORATION
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            Global Academic & Institutional Network
          </h1>

          <p className="text-sm sm:text-base text-rvu-muted leading-relaxed mb-4">
            Connecting RV University with international universities, institutional consortia, and cross-border academic dialogues.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-navy-surface border border-gold-border/40 text-xs font-mono text-rvu-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>ECOSYSTEM INFORMATION • Verified RVU Institutional Partnerships</span>
          </div>
        </div>

        {/* Region Selector Grid & Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: Region Navigation Tabs */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-rvu-muted mb-3">
              Documented Global Regions ({regions.length})
            </h2>
            {regions.map((region) => {
              const isSelected = region.id === selectedRegion.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 border flex items-center justify-between ${
                    isSelected
                      ? 'bg-navy-surface border-gold shadow-gold-sm -translate-y-0.5'
                      : 'bg-navy-dark/80 border-gold-border/20 text-rvu-muted hover:border-gold/40 hover:text-rvu-text'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-bold font-display ${isSelected ? 'text-gold' : 'text-rvu-text'}`}>
                        {region.regionName}
                      </span>
                    </div>
                    <p className="text-xs text-rvu-muted">
                      {region.countries.join(', ')}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-gold translate-x-1' : 'text-rvu-subtle'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Region Detail Card */}
          <div className="lg:col-span-7">
            <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold-border/40 bg-navy-surface h-full flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-gold-border/30">
                  <div>
                    <span className="text-[11px] font-mono text-gold uppercase tracking-wider block">
                      Region Details
                    </span>
                    <h3 className="text-2xl font-bold text-rvu-text font-display">
                      {selectedRegion.regionName}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-gold-faint text-gold border border-gold/30">
                    {selectedRegion.collaborationNature}
                  </span>
                </div>

                {/* Countries List */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-rvu-subtle mb-2">
                    Collaborating Countries / Territories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegion.countries.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-rvu-text font-mono"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scope Description */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-rvu-subtle mb-2">
                    Scope of Engagement
                  </h4>
                  <p className="text-sm text-rvu-muted leading-relaxed">
                    {selectedRegion.scope}
                  </p>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-rvu-subtle mb-3">
                    Institutional Highlights & Verified Engagements
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedRegion.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-rvu-muted">
                        <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Source & Actions */}
              <div className="pt-4 border-t border-gold-border/30 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-rvu-subtle font-mono">
                  Source: <span className="text-rvu-muted">{selectedRegion.sourceLabel}</span>
                </div>
                <a
                  href={selectedRegion.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-highlight hover:underline"
                >
                  <span>Verify on Official RVU Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Four-Part Institutional Collaboration Structure */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-rvu-text font-display">
              RVU Collaboration Framework
            </h2>
            <p className="text-xs sm:text-sm text-rvu-muted mt-1">
              Structured across four academic, institutional, and research dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {collaborationTypes.map((type) => (
              <div
                key={type.id}
                className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface/90 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-gold-faint border border-gold/30 flex items-center justify-center text-gold mb-3">
                    <Building className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-rvu-text font-display mb-2">
                    {type.title}
                  </h3>
                  <p className="text-xs text-rvu-muted leading-relaxed mb-3">
                    {type.description}
                  </p>
                  <p className="text-[11px] text-rvu-subtle border-t border-white/5 pt-2 font-mono">
                    {type.scope}
                  </p>
                </div>
                <div className="mt-4 pt-2">
                  <span className="text-[10px] font-mono text-gold block">
                    {type.nature}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Collaboration Destination CTA */}
        <div className="card-glass rounded-2xl p-8 border border-gold/40 bg-gradient-to-r from-navy-surface via-navy to-navy-surface text-center max-w-3xl mx-auto mb-14">
          <h3 className="text-xl font-bold text-rvu-text font-display mb-2">
            Explore RVU's Complete Collaborations Directory
          </h3>
          <p className="text-xs sm:text-sm text-rvu-muted max-w-xl mx-auto mb-6">
            Detailed MoU agreements, partner university listings, and formal alliance charters are maintained on the official RV University institutional portal.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://rvu.edu.in/rvu-at-a-glance/collaborations/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
            >
              <span>Explore RVU Collaborations</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => onNavigatePortal('/recruiter')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-surface border border-gold/30 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
            >
              <span>Recruit at RVU</span>
              <Users className="w-3.5 h-3.5 text-gold" />
            </button>
          </div>
        </div>

        {/* Source Citation Footer */}
        <div className="pt-6 border-t border-gold-border/30 flex flex-wrap items-center justify-between text-xs text-rvu-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Verified from official RV University Collaborations Repository</span>
          </div>
          <a
            href="https://rvu.edu.in/rvu-at-a-glance/collaborations/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline flex items-center gap-1 font-mono text-[11px]"
          >
            <span>rvu.edu.in/rvu-at-a-glance/collaborations/</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
