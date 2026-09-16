import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2, 
  X
} from 'lucide-react';
import type { CareerReadinessResult } from '../../../services/studentIntelligenceService';

interface CareerReadinessHeroProps {
  readiness: CareerReadinessResult;
  onNavigate: (route: string) => void;
}

export const CareerReadinessHero: React.FC<CareerReadinessHeroProps> = ({
  readiness,
  onNavigate
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // SVG Circular progress math
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness.overallScore / 100) * circumference;

  return (
    <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold-border/50 bg-navy-surface relative overflow-hidden shadow-card">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-80 h-full opacity-10 pointer-events-none bg-[radial-gradient(#CCAA68_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Eyebrow & How Calculated Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2.5 py-1 rounded-full bg-gold-faint border border-gold/30">
              CAREER READINESS BENCHMARK
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Dynamic Evaluation
            </span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-rvu-subtle hover:text-gold transition-colors focus:outline-none"
          >
            <HelpCircle className="w-3.5 h-3.5 text-gold" />
            <span>How is this calculated?</span>
          </button>
        </div>

        {/* Main Grid: Score Ring + Diagnostics Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Overall Ring Visualization (4 cols) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-5 p-4 rounded-xl bg-navy-dark/80 border border-gold-border/20 text-center">
            
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="text-white/10"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="text-gold transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-mono text-gold leading-none">
                  {readiness.overallScore}%
                </span>
                <span className="text-[9px] font-mono text-rvu-subtle uppercase mt-0.5">
                  Readiness
                </span>
              </div>
            </div>

            <div className="space-y-1 sm:text-left lg:text-center">
              <div className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{readiness.deltaThisMonth}</span>
              </div>
              <p className="text-xs text-rvu-muted leading-tight">
                {readiness.summaryMessage}
              </p>
            </div>
          </div>

          {/* Right: Component Progress Bars (8 cols) */}
          <div className="lg:col-span-8 space-y-3.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-rvu-subtle">
              Diagnostic Pillar Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {readiness.components.slice(0, 4).map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => onNavigate(comp.actionRoute)}
                  className="p-3 rounded-xl bg-navy-dark border border-gold-border/20 hover:border-gold/50 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-gold transition-colors">
                        {comp.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-gold">
                        {comp.score}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-gold/80 to-gold rounded-full transition-all duration-500"
                        style={{ width: `${comp.score}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-rvu-subtle line-clamp-1">
                      {comp.details}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gold font-mono">
                    <span>{comp.actionLabel}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* "How is this calculated?" Transparent Methodology Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold/50 bg-navy-surface max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gold-border/30">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-bold text-white font-display">
                  Career Readiness Formula
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-rvu-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-rvu-muted leading-relaxed mb-4">
              Your Career Readiness Score is an institutional preparation index designed to measure your self-study progress, ATS compliance, verified skills, and academic benchmarks. It is completely deterministic and does not claim to predict placement selection probability.
            </p>

            <div className="space-y-3 mb-6">
              {readiness.calculationMethodology.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-navy-dark border border-gold-border/20 text-xs text-rvu-muted flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-gold-faint border border-gold/30 text-[11px] text-rvu-muted mb-6">
              <strong className="text-gold block mb-1">PROVENANCE & PRIVACY GUARANTEE:</strong>
              Data inputs are retrieved exclusively from your personal SIS records and verified submissions. No third-party data broker is ever consulted.
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
