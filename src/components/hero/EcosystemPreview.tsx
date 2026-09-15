import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Award 
} from 'lucide-react';

export const EcosystemPreview: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Ambient background glow behind card */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-gold/20 via-gold-highlight/10 to-transparent rounded-2xl blur-xl opacity-75" />
      
      {/* Product Dashboard Card Container */}
      <div className="relative card-glass rounded-2xl p-5 sm:p-6 shadow-card-elevated border border-gold/30 overflow-hidden">
        
        {/* Console Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gold-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-gold/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-rvu-muted tracking-wider uppercase">
              RVU CAREER CONSOLE // v2.6
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-faint border border-gold/30">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[11px] font-medium text-gold">Live Campus Drive</span>
          </div>
        </div>

        {/* Milestone Path: Discover -> Prepare -> Apply -> Interview -> Success */}
        <div className="py-4">
          <div className="text-[11px] font-semibold text-rvu-muted uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Career Journey Pipeline</span>
            <span className="text-gold font-mono">Step 04 / 05</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
            {/* Step 1 */}
            <div className="p-2 rounded-lg bg-navy-surface/80 border border-gold/20">
              <div className="w-5 h-5 mx-auto mb-1 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-medium text-rvu-text block">Discover</span>
              <span className="text-[8px] text-emerald-400 font-mono">Matched</span>
            </div>

            {/* Step 2 */}
            <div className="p-2 rounded-lg bg-navy-surface/80 border border-gold/20">
              <div className="w-5 h-5 mx-auto mb-1 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-medium text-rvu-text block">Prepare</span>
              <span className="text-[8px] text-emerald-400 font-mono">ATS 94%</span>
            </div>

            {/* Step 3 */}
            <div className="p-2 rounded-lg bg-navy-surface/80 border border-gold/20">
              <div className="w-5 h-5 mx-auto mb-1 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-medium text-rvu-text block">Apply</span>
              <span className="text-[8px] text-emerald-400 font-mono">Verified</span>
            </div>

            {/* Step 4: Active */}
            <div className="p-2 rounded-lg bg-gold-faint border border-gold shadow-gold-sm">
              <div className="w-5 h-5 mx-auto mb-1 rounded-full bg-gold text-navy-dark flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-gold block">Interview</span>
              <span className="text-[8px] text-gold font-mono">Active</span>
            </div>

            {/* Step 5 */}
            <div className="p-2 rounded-lg bg-navy-surface/40 border border-white/5 opacity-70">
              <div className="w-5 h-5 mx-auto mb-1 rounded-full bg-white/5 text-rvu-muted flex items-center justify-center">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-medium text-rvu-muted block">Success</span>
              <span className="text-[8px] text-rvu-subtle font-mono">Offer</span>
            </div>
          </div>
        </div>

        {/* Live Matched Profile Card Highlight */}
        <div className="mt-2 p-4 rounded-xl bg-navy-surface/90 border border-gold/30">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gold-faint text-gold border border-gold/30 uppercase tracking-wide">
                  Top Profile Match
                </span>
                <span className="text-[11px] text-rvu-muted font-mono">School of CSE</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-rvu-text">
                Software Engineer — Distributed Systems
              </h4>
              <p className="text-xs text-rvu-muted">Tier 1 Cloud Technology Partner</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-extrabold text-gold font-mono">92%</span>
              <span className="block text-[9px] text-rvu-subtle uppercase tracking-wider">Fit Score</span>
            </div>
          </div>

          {/* Skill compatibility breakdown */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {['Go / Java', 'Distributed Systems', 'Kafka', 'Docker / K8s'].map((skill) => (
              <span key={skill} className="px-2 py-0.5 rounded-md text-[10px] bg-navy-card text-rvu-text border border-white/10">
                {skill}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-rvu-muted">Candidate Readiness Index</span>
              <span className="text-gold font-mono">94 / 100</span>
            </div>
            <div className="h-1.5 w-full bg-navy-dark rounded-full overflow-hidden">
              <div className="h-full bg-gold-gradient rounded-full w-[94%]" />
            </div>
          </div>
        </div>

        {/* Footer Metrics Row */}
        <div className="mt-4 pt-3 border-t border-gold-border/40 grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[10px] text-rvu-muted block uppercase tracking-wider">Recruiter Response</span>
            <span className="text-xs sm:text-sm font-bold text-rvu-text font-mono">&lt; 48 Hours</span>
          </div>
          <div className="border-x border-gold-border/40">
            <span className="text-[10px] text-rvu-muted block uppercase tracking-wider">Verified Skillsets</span>
            <span className="text-xs sm:text-sm font-bold text-gold font-mono">100% Proctored</span>
          </div>
          <div>
            <span className="text-[10px] text-rvu-muted block uppercase tracking-wider">Ecosystem Status</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
