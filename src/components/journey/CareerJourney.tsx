import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  Cpu, 
  Send, 
  MessageSquareCode, 
  Trophy, 
  CheckCircle2 
} from 'lucide-react';

interface JourneyStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  icon: React.ReactNode;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    number: '01',
    title: 'DISCOVER',
    subtitle: 'Explore Pathways',
    description: 'Explore emerging career pathways, industry sectors, and organizational roles tailored to your academic discipline.',
    deliverables: ['Sector Landscape Briefings', 'Alumni Career Maps', 'Industry Orientation Days'],
    icon: <Compass className="w-5 h-5 text-gold" />
  },
  {
    number: '02',
    title: 'ASSESS',
    subtitle: 'Diagnostic Evaluation',
    description: 'Evaluate your quantitative, coding, and analytical baseline to identify growth areas before hiring seasons begin.',
    deliverables: ['Proctored Coding Diagnostic', 'Aptitude Benchmark Score', 'Skill Gap Roadmaps'],
    icon: <Target className="w-5 h-5 text-gold" />
  },
  {
    number: '03',
    title: 'PREPARE',
    subtitle: 'Industry Readiness',
    description: 'Build core technical competence, communication mastery, and an ATS-proof professional portfolio.',
    deliverables: ['System Design & DSA Labs', 'ATS Resume Fine-tuning', 'Executive Communication'],
    icon: <Cpu className="w-5 h-5 text-gold" />
  },
  {
    number: '04',
    title: 'APPLY',
    subtitle: 'Targeted Matching',
    description: 'Discover verified campus openings matched to your verified profile, CGPA, and career preferences.',
    deliverables: ['Smart Profile Shortlisting', 'One-Click Campus Portal', 'Direct Placement Cell Routing'],
    icon: <Send className="w-5 h-5 text-gold" />
  },
  {
    number: '05',
    title: 'INTERVIEW',
    subtitle: 'Rigorous Simulation',
    description: 'Undergo mock technical rounds, case study interviews, and HR fitment clinics with seasoned industry veterans.',
    deliverables: ['Mock Panel Evaluations', 'Real-time Video Critique', 'STAR Framework Drills'],
    icon: <MessageSquareCode className="w-5 h-5 text-gold" />
  },
  {
    number: '06',
    title: 'SUCCEED',
    subtitle: 'Career Launch',
    description: 'Secure competitive offers, negotiate transitions, and step confidently into your professional career.',
    deliverables: ['Offer Verification Support', 'Corporate Onboarding Briefings', 'Alumni Mentorship Network'],
    icon: <Trophy className="w-5 h-5 text-gold" />
  }
];

export const CareerJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2); // Step 3 active by default for demonstration

  return (
    <section id="journey" className="relative py-24 bg-navy-dark overflow-hidden border-b border-gold-border/40">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-gold-faint rounded-full blur-[140px] pointer-events-none opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-gold">
              THE 6-STAGE ROADMAP
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            YOUR CAREER JOURNEY
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            From discovering your potential to stepping into your future. A systematic ecosystem guiding you every step of the way.
          </p>
        </div>

        {/* Desktop Horizontal Connecting Line Layout */}
        <div className="hidden lg:block relative mb-12">
          {/* Continuous Connecting Gold Line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-gradient-to-r from-gold/20 via-gold to-gold/20 z-0" />

          {/* 6 Milestone Nodes */}
          <div className="relative grid grid-cols-6 gap-3 z-10">
            {JOURNEY_STEPS.map((step, index) => {
              const isSelected = activeStep === index;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(index)}
                  className={`group relative text-left p-4 rounded-xl transition-all duration-300 ${
                    isSelected 
                      ? 'bg-navy-card border border-gold shadow-gold-glow -translate-y-2' 
                      : 'bg-navy-surface/80 border border-gold/20 hover:border-gold/50 hover:bg-navy-card'
                  }`}
                >
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-gold">
                      {step.number}
                    </span>
                    <div className={`p-2 rounded-lg transition-colors ${
                      isSelected ? 'bg-gold-faint text-gold' : 'bg-navy-dark/80 text-rvu-muted group-hover:text-gold'
                    }`}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-sm font-extrabold text-rvu-text font-display tracking-wide mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-gold font-medium mb-2">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-rvu-muted line-clamp-3 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Active Indicator Dot */}
                  {isSelected && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-navy-card border-2 border-gold rotate-45" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet Vertical Journey Layout */}
        <div className="lg:hidden relative pl-6 border-l-2 border-gold/40 space-y-6 mb-12 ml-4">
          {JOURNEY_STEPS.map((step, index) => {
            const isSelected = activeStep === index;
            return (
              <div 
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={`relative p-5 rounded-xl transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-navy-card border border-gold shadow-gold-sm' 
                    : 'bg-navy-surface/80 border border-gold-border'
                }`}
              >
                {/* Node circle on vertical line */}
                <div className={`absolute -left-[31px] top-6 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold ${
                  isSelected ? 'bg-gold border-navy-dark text-navy-dark' : 'bg-navy-dark border-gold text-gold'
                }`}>
                  {step.number}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gold font-mono font-semibold uppercase tracking-wider">
                    {step.subtitle}
                  </span>
                  <div className="p-1.5 rounded-md bg-navy-dark text-gold">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-rvu-text mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-rvu-muted mb-3">
                  {step.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gold-border/40">
                  {step.deliverables.map((item) => (
                    <span key={item} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-rvu-muted border border-white/10">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlighted Step Drill-down Drawer / Detail Card */}
        <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold/40 shadow-card-elevated">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-gold-faint text-gold border border-gold/30">
                  STAGE {JOURNEY_STEPS[activeStep].number} IN DETAIL
                </span>
                <span className="text-sm font-medium text-rvu-muted">
                  {JOURNEY_STEPS[activeStep].subtitle}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-rvu-text font-display">
                {JOURNEY_STEPS[activeStep].title}: Deep Dive Support
              </h3>
              <p className="text-sm text-rvu-muted max-w-2xl leading-relaxed">
                {JOURNEY_STEPS[activeStep].description}
              </p>
            </div>

            {/* Structured Deliverables Pill Box */}
            <div className="w-full md:w-auto shrink-0 space-y-2 bg-navy-surface/80 p-4 rounded-xl border border-gold-border">
              <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
                Key RVU Outcomes
              </span>
              <ul className="space-y-1.5">
                {JOURNEY_STEPS[activeStep].deliverables.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-rvu-text">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
