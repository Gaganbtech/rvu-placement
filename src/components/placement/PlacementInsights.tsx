import React, { useState } from 'react';
import { ANNUAL_PLACEMENT_DATA, SCHOOL_FILTERS } from '../../data/placementStats';
import { BarChart3, TrendingUp, PieChart, Layers, Filter, Sparkles } from 'lucide-react';

export const PlacementInsights: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<'2025-26' | '2024-25' | '2023-24'>('2025-26');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [activeChartTab, setActiveChartTab] = useState<'offers' | 'recruiters' | 'industries' | 'salary'>('offers');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number } | null>(null);

  const currentData = ANNUAL_PLACEMENT_DATA[selectedYear];

  // Helper calculation for SVG line chart scaling
  const maxOfferValue = Math.max(...currentData.trendOffers.map(d => d.value), 260);

  return (
    <section id="insights" className="relative py-24 bg-navy overflow-hidden border-b border-gold-border/40">
      
      {/* Circuit background traces */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <BarChart3 className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold">
              DATA VISUALIZATION & ANALYTICS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            PLACEMENT INSIGHTS
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Explore RVU's placement ecosystem through meaningful data, annual recruitment growth, and industry sector distribution.
          </p>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="card-glass rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Academic Cohort Year Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-navy-surface border border-gold/20 overflow-x-auto">
            {(['2025-26', '2024-25', '2023-24'] as const).map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  selectedYear === yr
                    ? 'bg-gold text-navy-dark font-bold shadow-sm'
                    : 'text-rvu-muted hover:text-rvu-text hover:bg-white/5'
                }`}
              >
                {yr} {yr === '2025-26' && '(Current)'}
              </button>
            ))}
          </div>

          {/* School Selector Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gold shrink-0" />
            <span className="text-xs text-rvu-muted">Filter School:</span>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="bg-navy-surface border border-gold/20 rounded-lg px-3 py-1.5 text-xs text-rvu-text focus:border-gold focus:outline-none"
            >
              {SCHOOL_FILTERS.map((school) => (
                <option key={school.id} value={school.id} className="bg-navy-dark text-rvu-text">
                  {school.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Primary Stat Chips Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <div className="card-glass rounded-xl p-4 text-center">
            <span className="text-[10px] text-rvu-muted uppercase tracking-wider block mb-1">Highest Package</span>
            <span className="text-xl sm:text-2xl font-extrabold text-gold-gradient font-display block">
              {currentData.highestPackage}
            </span>
            <span className="text-[9px] text-rvu-subtle font-mono">Audited Slot</span>
          </div>

          <div className="card-glass rounded-xl p-4 text-center">
            <span className="text-[10px] text-rvu-muted uppercase tracking-wider block mb-1">Average Package</span>
            <span className="text-xl sm:text-2xl font-extrabold text-rvu-text font-display block">
              {currentData.averagePackage}
            </span>
            <span className="text-[9px] text-rvu-subtle font-mono">Audited Slot</span>
          </div>

          <div className="card-glass rounded-xl p-4 text-center">
            <span className="text-[10px] text-rvu-muted uppercase tracking-wider block mb-1">Median Package</span>
            <span className="text-xl sm:text-2xl font-extrabold text-rvu-text font-display block">
              {currentData.medianPackage}
            </span>
            <span className="text-[9px] text-rvu-subtle font-mono">Audited Slot</span>
          </div>

          <div className="card-glass rounded-xl p-4 text-center">
            <span className="text-[10px] text-rvu-muted uppercase tracking-wider block mb-1">Active Recruiters</span>
            <span className="text-xl sm:text-2xl font-extrabold text-rvu-text font-display block">
              {currentData.totalRecruiters}
            </span>
            <span className="text-[9px] text-emerald-400 font-mono">Verified Enterprise</span>
          </div>

          <div className="card-glass rounded-xl p-4 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-rvu-muted uppercase tracking-wider block mb-1">Total Offers</span>
            <span className="text-xl sm:text-2xl font-extrabold text-gold font-display block">
              {currentData.totalOffers}
            </span>
            <span className="text-[9px] text-rvu-subtle font-mono">Across Schools</span>
          </div>
        </div>

        {/* Main Chart Visualization Card */}
        <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold/40 shadow-card-elevated">
          
          {/* Chart View Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gold-border/40">
            <div>
              <h3 className="text-xl font-bold text-rvu-text font-display">
                {activeChartTab === 'offers' && 'Monthly Placement Offers Trajectory'}
                {activeChartTab === 'recruiters' && 'Year-on-Year Corporate Recruiter Growth'}
                {activeChartTab === 'industries' && 'Industry & Sectoral Hiring Distribution'}
                {activeChartTab === 'salary' && 'Compensation Band & Dream Track Breakdown'}
              </h3>
              <p className="text-xs text-rvu-muted mt-0.5">
                Cohort {currentData.year} • {SCHOOL_FILTERS.find(s => s.id === selectedSchool)?.label}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-navy-surface border border-gold/20">
              <button
                onClick={() => setActiveChartTab('offers')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeChartTab === 'offers' ? 'bg-gold text-navy-dark font-bold' : 'text-rvu-muted hover:text-rvu-text'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Offers Trend</span>
              </button>

              <button
                onClick={() => setActiveChartTab('recruiters')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeChartTab === 'recruiters' ? 'bg-gold text-navy-dark font-bold' : 'text-rvu-muted hover:text-rvu-text'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Recruiters</span>
              </button>

              <button
                onClick={() => setActiveChartTab('industries')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeChartTab === 'industries' ? 'bg-gold text-navy-dark font-bold' : 'text-rvu-muted hover:text-rvu-text'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Industries</span>
              </button>

              <button
                onClick={() => setActiveChartTab('salary')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeChartTab === 'salary' ? 'bg-gold text-navy-dark font-bold' : 'text-rvu-muted hover:text-rvu-text'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Salary Bands</span>
              </button>
            </div>
          </div>

          {/* Chart Content Area */}
          <div className="pt-8 min-h-[320px] flex items-center justify-center">
            
            {/* View 1: Offers Trajectory Area / Line Chart */}
            {activeChartTab === 'offers' && (
              <div className="w-full space-y-4">
                <div className="relative h-64 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#CCAA68" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#CCAA68" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 60, 120, 180, 240].map((y, i) => (
                      <line 
                        key={i} 
                        x1="0" 
                        y1={y} 
                        x2="700" 
                        y2={y} 
                        stroke="rgba(204,170,104,0.1)" 
                        strokeDasharray="4 4" 
                      />
                    ))}

                    {/* Area Polygon */}
                    {(() => {
                      const points = currentData.trendOffers.map((d, index) => {
                        const x = (index / (currentData.trendOffers.length - 1)) * 700;
                        const y = 240 - (d.value / maxOfferValue) * 200;
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <polygon
                          points={`0,240 ${points} 700,240`}
                          fill="url(#area-gradient)"
                        />
                      );
                    })()}

                    {/* Line Stroke */}
                    {(() => {
                      const points = currentData.trendOffers.map((d, index) => {
                        const x = (index / (currentData.trendOffers.length - 1)) * 700;
                        const y = 240 - (d.value / maxOfferValue) * 200;
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <polyline
                          points={points}
                          fill="none"
                          stroke="#CCAA68"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      );
                    })()}

                    {/* Data Points */}
                    {currentData.trendOffers.map((d, index) => {
                      const x = (index / (currentData.trendOffers.length - 1)) * 700;
                      const y = 240 - (d.value / maxOfferValue) * 200;
                      return (
                        <g 
                          key={d.label}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredPoint(d)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        >
                          <circle
                            cx={x}
                            cy={y}
                            r={d.highlight ? 6 : 4}
                            fill="#101A22"
                            stroke="#CCAA68"
                            strokeWidth="2.5"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* X-axis Labels */}
                <div className="flex justify-between pt-2 border-t border-gold-border/30 text-xs text-rvu-muted font-mono">
                  {currentData.trendOffers.map((d) => (
                    <span key={d.label} className={d.highlight ? 'text-gold font-bold' : ''}>
                      {d.label}
                    </span>
                  ))}
                </div>

                {/* Live Tooltip Indicator */}
                <div className="p-2.5 rounded-lg bg-navy-surface text-center text-xs text-rvu-muted border border-gold/20">
                  {hoveredPoint ? (
                    <span>
                      Milestone <strong className="text-gold font-mono">{hoveredPoint.label}</strong>: Projected Offer Volume Index <strong className="text-rvu-text font-mono">{hoveredPoint.value}</strong>
                    </span>
                  ) : (
                    <span>Hover over any milestone point to inspect cohort progression.</span>
                  )}
                </div>
              </div>
            )}

            {/* View 2: Recruiter Growth Bar Chart */}
            {activeChartTab === 'recruiters' && (
              <div className="w-full space-y-6">
                <div className="grid grid-cols-4 gap-4 sm:gap-6 h-64 items-end pt-8">
                  {currentData.recruiterGrowth.map((bar) => {
                    const heightPercent = (bar.value / 260) * 100;
                    return (
                      <div key={bar.label} className="flex flex-col items-center h-full justify-end group">
                        <span className="text-xs font-mono font-bold text-gold mb-2 transition-transform group-hover:-translate-y-1">
                          {bar.value}+
                        </span>
                        <div className="w-full max-w-[64px] bg-navy-surface rounded-t-xl overflow-hidden border border-gold/30">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t-xl transition-all duration-500 ${
                              bar.highlight
                                ? 'bg-gold-gradient shadow-gold-sm'
                                : 'bg-gold/40 group-hover:bg-gold/70'
                            }`}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-rvu-muted mt-3 text-center">
                          {bar.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-center text-xs text-rvu-muted">
                  Year-over-year enterprise recruitment engagements at RV University campus drives.
                </p>
              </div>
            )}

            {/* View 3: Industry Distribution */}
            {activeChartTab === 'industries' && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-3.5">
                  {currentData.industryDistribution.map((item) => (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-rvu-text">{item.name}</span>
                        <span className="text-gold font-mono font-bold">{item.percentage}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-navy-surface rounded-full overflow-hidden border border-white/5">
                        <div
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: item.color 
                          }}
                          className="h-full rounded-full transition-all duration-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-glass rounded-xl p-6 border border-gold-border space-y-3 text-center lg:text-left">
                  <div className="flex items-center gap-2 text-sm font-bold text-gold">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>Cross-Disciplinary Placement Strength</span>
                  </div>
                  <p className="text-xs text-rvu-muted leading-relaxed">
                    RVU's placement network spans core Technology, quantitative FinTech, strategic consultancies, human-centered Design houses, and corporate legal entities.
                  </p>
                  <div className="p-3 rounded-lg bg-navy-surface/80 border border-white/5 text-[11px] text-rvu-subtle">
                    * Sector allocations reflect historical composite hiring data across all academic schools.
                  </div>
                </div>
              </div>
            )}

            {/* View 4: Salary Bands Breakdown */}
            {activeChartTab === 'salary' && (
              <div className="w-full space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentData.salaryBands.map((band) => (
                    <div key={band.band} className="p-4 rounded-xl bg-navy-surface border border-gold/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-gold uppercase tracking-wide">
                          {band.band}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/20">
                          {band.percentage}% of cohort
                        </span>
                      </div>
                      <div className="text-lg font-bold text-rvu-text font-display">
                        {band.range}
                      </div>
                      <span className="text-xs text-rvu-muted block font-mono">
                        {band.count}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-center text-xs text-rvu-subtle pt-4">
                  * Placement tier definitions correspond to standard university career advisory classifications.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
