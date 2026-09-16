import React from 'react';
import { 
  Compass, 
  BookOpen, 
  Users, 
  Send, 
  Award, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import type { Application, Offer, PlacementDrive } from '../../../data/platform/types';

interface CareerJourneyFlowProps {
  applications: Application[];
  offers: Offer[];
  drives: PlacementDrive[];
  onNavigate: (route: string) => void;
}

export const CareerJourneyFlow: React.FC<CareerJourneyFlowProps> = ({
  applications,
  offers,
  drives,
  onNavigate
}) => {
  // Determine current active stage based on real platform state
  const hasOffer = offers.length > 0;
  const hasApplications = applications.length > 0;
  const hasRegisteredDrive = drives.some(d => d.attendanceRoster?.length);

  let currentStageNumber = 2; // Default PREPARE
  if (hasOffer) currentStageNumber = 5;
  else if (hasApplications) currentStageNumber = 4;
  else if (hasRegisteredDrive) currentStageNumber = 3;

  const stages = [
    {
      step: '01',
      title: 'DISCOVER',
      subtitle: 'Explore opportunities',
      route: '/student/opportunities',
      icon: <Compass className="w-4 h-4" />
    },
    {
      step: '02',
      title: 'PREPARE',
      subtitle: 'Build skills & resume',
      route: '/student/preparation',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      step: '03',
      title: 'CONNECT',
      subtitle: 'Campus drives & mentors',
      route: '/student/drives',
      icon: <Users className="w-4 h-4" />
    },
    {
      step: '04',
      title: 'APPLY',
      subtitle: 'Submit & track pipeline',
      route: '/student/applications',
      icon: <Send className="w-4 h-4" />
    },
    {
      step: '05',
      title: 'SUCCEED',
      subtitle: 'Interview, offer & launch',
      route: '/student/offers',
      icon: <Award className="w-4 h-4" />
    }
  ];

  return (
    <div className="card-glass rounded-2xl p-6 border border-gold-border/40 bg-navy-surface relative overflow-hidden shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold block">
            THE CAREER OPERATING SYSTEM
          </span>
          <h2 className="text-lg font-bold text-white font-display">
            MY CAREER JOURNEY
          </h2>
        </div>
        <div className="text-xs font-mono text-rvu-subtle flex items-center gap-2">
          <span>Active Stage:</span>
          <span className="px-2 py-0.5 rounded bg-gold text-navy-dark font-bold">
            0{currentStageNumber} {stages[currentStageNumber - 1]?.title}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative">
        {stages.map((stage, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStageNumber;
          const isCurrent = stepNum === currentStageNumber;

          return (
            <div
              key={stage.step}
              onClick={() => onNavigate(stage.route)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                isCurrent
                  ? 'bg-navy-dark border-gold shadow-gold-sm -translate-y-0.5'
                  : isCompleted
                  ? 'bg-navy-dark/60 border-emerald-500/30 hover:border-emerald-500/60'
                  : 'bg-navy-dark/40 border-white/10 hover:border-gold/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? 'bg-gold text-navy-dark font-bold'
                      : isCompleted
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-rvu-subtle border border-white/10'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.icon}
                  </div>

                  <span className={`text-xs font-mono font-bold ${
                    isCurrent ? 'text-gold' : isCompleted ? 'text-emerald-400' : 'text-rvu-subtle'
                  }`}>
                    {stage.step}
                  </span>
                </div>

                <h3 className={`text-xs font-bold font-display tracking-wider mb-1 ${
                  isCurrent ? 'text-gold' : 'text-white'
                }`}>
                  {stage.title}
                </h3>

                <p className="text-[11px] text-rvu-muted leading-tight">
                  {stage.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-rvu-subtle font-mono group-hover:text-gold transition-colors">
                <span>{isCurrent ? 'In Progress' : isCompleted ? 'Completed' : 'Upcoming'}</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
