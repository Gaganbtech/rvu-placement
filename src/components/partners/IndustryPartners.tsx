import React, { useState } from 'react';
import {
  Building2,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Users,
  X
} from 'lucide-react';
import { IndustryNetworkService } from '../../services/industryNetworkService';
import type { GlobalRegionCollaboration } from '../../data/industryNetwork';

interface IndustryPartnersProps {
  onOpenRecruiterModal: () => void;
  onNavigatePortal?: (route: string) => void;
}

const NETWORK_TABS = [
  'ALL',
  'RECRUITMENT',
  'INDUSTRY',
  'ACADEMIC',
  'GLOBAL',
  'ALUMNI'
] as const;

export const IndustryPartners: React.FC<IndustryPartnersProps> = ({
  onOpenRecruiterModal,
  onNavigatePortal
}) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [activeRegionId, setActiveRegionId] = useState<string>('reg-usa');
  const [sourcesModalOpen, setSourcesModalOpen] = useState(false);

  const metrics = IndustryNetworkService.getMetrics();
  const categories = IndustryNetworkService.getCategoriesByTag(activeTab);
  const recruiterCategories = IndustryNetworkService.getRecruiterCategories();
  const collaborationTypes = IndustryNetworkService.getCollaborationTypes();
  const regions = IndustryNetworkService.getGlobalRegions();
  const sources = IndustryNetworkService.getOfficialSources();

  const selectedRegion: GlobalRegionCollaboration =
    regions.find(r => r.id === activeRegionId) || regions[0];

  const handleNavigate = (route: string, isExternal?: boolean) => {
    if (isExternal) {
      window.open(route, '_blank', 'noopener,noreferrer');
      return;
    }
    if (onNavigatePortal) {
      onNavigatePortal(route);
    } else {
      window.location.assign(route);
    }
  };

  // Node coordinates for desktop SVG World Network visualization
  // Hub: RVU Bengaluru (695, 245)
  const regionNodeMap: Record<string, { x: number; y: number; label: string }> = {
    'reg-usa': { x: 230, y: 165, label: 'United States' },
    'reg-uk': { x: 485, y: 135, label: 'United Kingdom' },
    'reg-europe': { x: 535, y: 165, label: 'Europe (Italy, Cyprus, etc.)' },
    'reg-asia': { x: 775, y: 255, label: 'Asia (Thailand, Indonesia, etc.)' },
    'reg-africa': { x: 555, y: 360, label: 'Africa (South Africa)' }
  };

  return (
    <section id="partners" className="relative py-24 bg-navy-dark overflow-hidden border-b border-gold-border/40">
      {/* Background Technology Circuit Grid */}
      <div className="absolute inset-0 bg-tech-circuit opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* ==================================================== */}
        {/* 1. SECTION HERO */}
        {/* ==================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Building2 className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              INDUSTRY CONNECT
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            OUR INDUSTRY NETWORK
          </h2>

          <p className="text-base sm:text-lg text-rvu-muted leading-relaxed mb-3">
            Connecting RVU’s multidisciplinary talent with industry, organisations, alumni and global academic networks.
          </p>

          <p className="text-xs sm:text-sm text-gold-highlight/80 font-medium">
            Industry engagement across recruitment, experiential learning, innovation and knowledge exchange.
          </p>
        </div>

        {/* ==================================================== */}
        {/* 2. VERIFIED ECOSYSTEM METRICS */}
        {/* ==================================================== */}
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div
                key={m.id}
                className="card-glass rounded-2xl p-6 border border-gold-border/30 bg-navy-surface hover:border-gold/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-rvu-subtle border border-white/10">
                      {m.category === 'REPORTING' ? 'Placement Reporting' : 'Collaborations'}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-gold mb-1">
                    {m.value}
                  </div>
                  <h3 className="text-sm font-bold text-rvu-text font-display mb-1">
                    {m.label}
                  </h3>
                  {m.sublabel && (
                    <p className="text-xs text-rvu-muted leading-relaxed">
                      {m.sublabel}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-rvu-subtle">
                  Source: {m.sourceLabel}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-center">
            <span className="text-[11px] font-mono text-rvu-subtle">
              * Placement statistics represent 2025–26 official reporting; institutional collaborations represent verified university MoUs.
            </span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 3 & 4. NETWORK EXPLORER & CATEGORIES */}
        {/* ==================================================== */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono text-gold uppercase tracking-wider block">
                EXPLORE THE NETWORK
              </span>
              <h3 className="text-2xl font-bold text-rvu-text font-display">
                Interactive Ecosystem Categories
              </h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-navy-surface border border-gold-border/30">
              {NETWORK_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gold text-navy-dark font-bold shadow-gold-sm'
                      : 'text-rvu-muted hover:text-rvu-text'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group card-glass rounded-2xl p-6 border border-gold-border/30 bg-navy-surface hover:border-gold hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30">
                      {cat.categoryTag}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  <h4 className="text-lg font-bold text-rvu-text group-hover:text-gold transition-colors font-display mb-2">
                    {cat.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-rvu-muted leading-relaxed">
                    “{cat.description}”
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gold-border/20">
                  <button
                    onClick={() => handleNavigate(cat.route, cat.isExternal)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-gold-border/30 text-xs font-semibold text-rvu-text group-hover:bg-gold group-hover:text-navy-dark group-hover:border-gold transition-all"
                  >
                    <span>{cat.ctaText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================== */}
        {/* 5. RECRUITER ECOSYSTEM (Categories from RVU Reporting) */}
        {/* ==================================================== */}
        <div className="mb-20">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
              RECRUITER ECOSYSTEM
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-rvu-text font-display">
              Documented Employer Ecosystems
            </h3>
            <p className="text-xs sm:text-sm text-rvu-muted mt-1">
              Organizations engaging with RVU multidisciplinary talent across established industry classifications documented in RVU placement reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recruiterCategories.map((rc) => (
              <div
                key={rc.id}
                className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface/90 hover:border-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-bold text-rvu-text font-display">
                      {rc.name}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-subtle border border-white/10">
                      Placement Scope
                    </span>
                  </div>

                  <p className="text-xs font-medium text-gold-highlight/90 mb-3">
                    {rc.description}
                  </p>

                  <p className="text-xs text-rvu-muted leading-relaxed mb-3">
                    {rc.nature}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 text-[11px] text-rvu-subtle font-mono">
                  Focus: {rc.focus}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================== */}
        {/* 6. RECRUITER INTERACTION ("ARE YOU AN EMPLOYER?") */}
        {/* ==================================================== */}
        <div className="card-glass rounded-2xl p-8 sm:p-10 border border-gold/40 bg-gradient-to-r from-navy-surface via-navy to-navy-surface mb-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
                CORPORATE ENGAGEMENT
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-rvu-text font-display mb-2">
                ARE YOU AN EMPLOYER?
              </h3>
              <p className="text-sm sm:text-base text-rvu-muted leading-relaxed">
                Connect with RV University’s multidisciplinary talent pool across engineering, design, business, law, liberal arts, and media.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={onOpenRecruiterModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
              >
                <span>Recruit at RVU</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleNavigate('/recruiter')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy-surface border border-gold/30 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
              >
                <span>Explore Recruitment Process</span>
                <Users className="w-4 h-4 text-gold" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 7. OFFICIAL COLLABORATION NETWORK */}
        {/* ==================================================== */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
              ACADEMIC + INDUSTRY + GLOBAL
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-rvu-text font-display">
              RVU Collaboration Ecosystem
            </h3>
            <p className="text-xs sm:text-sm text-rvu-muted mt-1">
              Official collaboration frameworks strengthening applied learning, policy research, and global alliances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {collaborationTypes.map((type) => (
              <div
                key={type.id}
                className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface/90 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-gold block uppercase mb-2">
                    {type.nature}
                  </span>
                  <h4 className="text-sm font-bold text-rvu-text font-display mb-2">
                    {type.title}
                  </h4>
                  <p className="text-xs text-rvu-muted leading-relaxed mb-3">
                    “{type.description}”
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 text-[11px] text-rvu-subtle font-mono">
                  {type.scope}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://rvu.edu.in/rvu-at-a-glance/collaborations/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-surface border border-gold/40 text-xs font-semibold text-gold hover:bg-gold-faint transition-all"
            >
              <span>Explore RVU Collaborations</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 8. GLOBAL NETWORK VISUALIZATION */}
        {/* ==================================================== */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-2">
                <Globe className="w-3.5 h-3.5 text-gold" />
                <span className="text-[11px] font-semibold uppercase text-gold font-mono">
                  GLOBAL NETWORK
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-rvu-text font-display">
                International Institutional Reach
              </h3>
              <p className="text-xs sm:text-sm text-rvu-muted mt-1">
                Documented university collaborations across Europe, Asia, Africa, United Kingdom, and the United States.
              </p>
            </div>

            <button
              onClick={() => handleNavigate('/network/global')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline shrink-0"
            >
              <span>View Global Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* DESKTOP: Sophisticated World Network SVG Map */}
          <div className="hidden md:block card-glass rounded-2xl p-6 border border-gold-border/40 bg-navy-surface overflow-hidden">
            <div className="grid grid-cols-12 gap-6 items-center">
              
              {/* Map Canvas (Col 8) */}
              <div className="col-span-8 relative bg-navy-dark rounded-xl p-4 border border-gold-border/20 overflow-hidden">
                <div className="text-[10px] font-mono text-rvu-subtle mb-2 flex items-center justify-between">
                  <span>WORLD NETWORK VISUALIZATION • HUB: RVU BENGALURU</span>
                  <span className="text-gold">Click any region node to view verified MoUs</span>
                </div>

                <svg
                  viewBox="0 0 1000 480"
                  className="w-full h-auto"
                  style={{ maxHeight: '380px' }}
                >
                  {/* Subtle Grid Lat/Long Lines */}
                  <defs>
                    <linearGradient id="goldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#CCAA68" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#D8B978" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>

                  <line x1="50" y1="120" x2="950" y2="120" stroke="rgba(204,170,104,0.08)" strokeDasharray="3,3" />
                  <line x1="50" y1="240" x2="950" y2="240" stroke="rgba(204,170,104,0.12)" strokeDasharray="4,4" />
                  <line x1="50" y1="360" x2="950" y2="360" stroke="rgba(204,170,104,0.08)" strokeDasharray="3,3" />

                  {/* Continent Landmass Stylized Outlines (Navy Contours) */}
                  {/* North America */}
                  <path
                    d="M 140 100 Q 220 80 280 120 T 260 210 T 190 230 Z"
                    fill="rgba(32,48,58,0.5)"
                    stroke="rgba(204,170,104,0.15)"
                    strokeWidth="1"
                  />
                  {/* South America */}
                  <path
                    d="M 270 260 Q 320 280 310 380 T 250 420 Z"
                    fill="rgba(32,48,58,0.4)"
                    stroke="rgba(204,170,104,0.12)"
                    strokeWidth="1"
                  />
                  {/* Europe & UK */}
                  <path
                    d="M 460 110 Q 560 90 570 180 T 470 200 Z"
                    fill="rgba(32,48,58,0.5)"
                    stroke="rgba(204,170,104,0.15)"
                    strokeWidth="1"
                  />
                  {/* Africa */}
                  <path
                    d="M 480 210 Q 580 220 570 380 T 490 320 Z"
                    fill="rgba(32,48,58,0.5)"
                    stroke="rgba(204,170,104,0.15)"
                    strokeWidth="1"
                  />
                  {/* Asia & India */}
                  <path
                    d="M 600 110 Q 820 100 850 240 T 670 300 Z"
                    fill="rgba(32,48,58,0.6)"
                    stroke="rgba(204,170,104,0.2)"
                    strokeWidth="1"
                  />
                  {/* Australia / Oceania */}
                  <path
                    d="M 780 340 Q 860 330 870 410 T 800 420 Z"
                    fill="rgba(32,48,58,0.4)"
                    stroke="rgba(204,170,104,0.12)"
                    strokeWidth="1"
                  />

                  {/* Arcs from RVU Hub (695, 245) to Verified Regional Nodes */}
                  {Object.entries(regionNodeMap).map(([id, node]) => (
                    <g key={id}>
                      {/* Connection Line */}
                      <path
                        d={`M 695 245 Q ${(695 + node.x) / 2} ${Math.min(245, node.y) - 40} ${node.x} ${node.y}`}
                        fill="none"
                        stroke={activeRegionId === id ? '#CCAA68' : 'rgba(204,170,104,0.35)'}
                        strokeWidth={activeRegionId === id ? 2 : 1}
                        strokeDasharray={activeRegionId === id ? 'none' : '4,4'}
                      />
                      {/* Clickable Node */}
                      <g
                        className="cursor-pointer group"
                        onClick={() => setActiveRegionId(id)}
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={activeRegionId === id ? 9 : 6}
                          fill={activeRegionId === id ? '#CCAA68' : '#20303A'}
                          stroke="#CCAA68"
                          strokeWidth="2"
                        />
                        {activeRegionId === id && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="14"
                            fill="none"
                            stroke="#D8B978"
                            strokeWidth="1"
                            opacity="0.6"
                          />
                        )}
                        <text
                          x={node.x}
                          y={node.y - 12}
                          textAnchor="middle"
                          fill={activeRegionId === id ? '#D8B978' : '#AEB7BC'}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {node.label}
                        </text>
                      </g>
                    </g>
                  ))}

                  {/* RVU Central Hub Marker */}
                  <g>
                    <circle cx="695" cy="245" r="10" fill="#CCAA68" />
                    <circle cx="695" cy="245" r="18" fill="none" stroke="#CCAA68" strokeWidth="1.5" opacity="0.5" />
                    <text
                      x="695"
                      y="275"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      RVU Bengaluru (Hub)
                    </text>
                  </g>
                </svg>
              </div>

              {/* Selected Region Info Panel (Col 4) */}
              <div className="col-span-4 flex flex-col justify-between h-full space-y-4">
                <div className="p-5 rounded-xl bg-navy-dark/90 border border-gold-border/30">
                  <span className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-1">
                    VERIFIED PARTNERSHIP REGION
                  </span>
                  <h4 className="text-lg font-bold text-rvu-text font-display mb-1">
                    {selectedRegion.regionName}
                  </h4>
                  <p className="text-xs text-gold-highlight/90 font-mono mb-3">
                    {selectedRegion.collaborationNature}
                  </p>
                  <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                    {selectedRegion.scope}
                  </p>

                  <div className="border-t border-white/5 pt-3">
                    <span className="text-[10px] font-mono text-rvu-subtle uppercase block mb-2">
                      Institutional Highlights
                    </span>
                    <ul className="space-y-1.5">
                      {selectedRegion.highlights.slice(0, 2).map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-rvu-muted">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleNavigate('/network/global')}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
                  >
                    <span>Explore RVU's Official Collaboration Network</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href="https://rvu.edu.in/rvu-at-a-glance/collaborations/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center text-[11px] font-mono text-rvu-muted hover:text-gold transition-colors inline-flex items-center justify-center gap-1"
                  >
                    <span>Verify at rvu.edu.in/collaborations</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* MOBILE: Explore Global Connections Region Cards */}
          <div className="block md:hidden space-y-3">
            <p className="text-xs font-mono text-gold uppercase tracking-wider mb-2">
              Explore Global Connections
            </p>
            {regions.map((r) => (
              <div
                key={r.id}
                onClick={() => handleNavigate('/network/global')}
                className="card-glass rounded-xl p-4 border border-gold-border/30 bg-navy-surface flex items-center justify-between cursor-pointer hover:border-gold"
              >
                <div>
                  <h4 className="text-sm font-bold text-rvu-text font-display">
                    {r.regionName}
                  </h4>
                  <p className="text-xs text-rvu-muted mt-0.5">
                    {r.countries.join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gold font-mono">
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================== */}
        {/* 9 & 28. SOURCE FOOTER */}
        {/* ==================================================== */}
        <div className="pt-6 border-t border-gold-border/30 flex flex-wrap items-center justify-between gap-4 text-xs text-rvu-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
            <span>Verified from official RV University sources (Placements, Admissions & Collaborations)</span>
          </div>

          <button
            onClick={() => setSourcesModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-highlight hover:underline font-mono"
          >
            <span>View Sources →</span>
          </button>
        </div>

      </div>

      {/* Sources Verification Modal */}
      {sourcesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold/50 bg-navy-surface max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gold-border/30">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-bold text-rvu-text font-display">
                  Verified Data Provenance
                </h3>
              </div>
              <button
                onClick={() => setSourcesModalOpen(false)}
                className="p-1 rounded-lg text-rvu-muted hover:text-rvu-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-rvu-muted mb-4">
              All statistics, categories, and institutional details displayed in this section are verified directly from official RV University published records. No synthetic or third-party datasets are used.
            </p>

            <div className="space-y-3 mb-6">
              {sources.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl bg-navy-dark border border-gold-border/20">
                  <h4 className="text-xs font-bold text-rvu-text mb-1">{s.title}</h4>
                  <p className="text-[11px] text-rvu-muted mb-2">{s.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-gold">Cycle: {s.lastVerified}</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Verify URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSourcesModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs"
            >
              Close Sources
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
