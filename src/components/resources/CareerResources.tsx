import React, { useState } from 'react';
import { CAREER_RESOURCES, type CareerResource } from '../../data/resources';
import { 
  FileText, 
  Video, 
  Brain, 
  Code, 
  Compass, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const CareerResources: React.FC = () => {
  const [activeResource, setActiveResource] = useState<CareerResource | null>(null);

  const getResourceIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-6 h-6 text-gold" />;
      case 'Video': return <Video className="w-6 h-6 text-gold" />;
      case 'Brain': return <Brain className="w-6 h-6 text-gold" />;
      case 'Code': return <Code className="w-6 h-6 text-gold" />;
      case 'Compass': return <Compass className="w-6 h-6 text-gold" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-gold" />;
      default: return <Sparkles className="w-6 h-6 text-gold" />;
    }
  };

  return (
    <section id="resources" className="relative py-24 bg-navy-dark overflow-hidden border-b border-gold-border/40">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold">
              CANDIDATE READINESS TOOLKIT
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            BUILD YOUR CAREER
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Holistic preparation resources to sharpen your problem solving, build an ATS-certified resume, and simulate high-stakes interviews.
          </p>
        </div>

        {/* 6 Actionable Career Preparation Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_RESOURCES.map((res) => (
            <div
              key={res.id}
              className="group card-glass rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60"
            >
              <div>
                {/* Header: Icon & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-navy-surface border border-gold/30 text-gold flex items-center justify-center group-hover:scale-105 transition-transform shadow-gold-sm">
                    {getResourceIcon(res.iconName)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30">
                    {res.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-rvu-text font-display group-hover:text-gold transition-colors mb-2">
                  {res.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-rvu-muted leading-relaxed mb-5">
                  {res.description}
                </p>

                {/* Feature Bullet Points */}
                <ul className="space-y-1.5 mb-6">
                  {res.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-rvu-text/85">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gold-border/40">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => setActiveResource(res)}
                  className="w-full justify-center group-hover:bg-gold-faint group-hover:border-gold"
                >
                  {res.actionText}
                </Button>
              </div>

            </div>
          ))}
        </div>

        {/* Resource Interactive Preview Modal */}
        {activeResource && (
          <Modal
            isOpen={!!activeResource}
            onClose={() => setActiveResource(null)}
            title={activeResource.title}
            subtitle={`RVU Career Toolkit • ${activeResource.badge}`}
            maxWidth="md"
          >
            <div className="space-y-4">
              <p className="text-sm text-rvu-muted leading-relaxed">
                {activeResource.description}
              </p>

              <div className="p-4 rounded-xl bg-navy-surface border border-gold/30 space-y-2">
                <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
                  Included Modules & Roadmaps
                </span>
                <ul className="space-y-2">
                  {activeResource.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-rvu-text">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gold-border flex items-center justify-between">
                <span className="text-[11px] text-rvu-subtle">
                  Free access for all registered RV University students.
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    alert(`Accessing ${activeResource.title}... Please sign in to your RVU student account to load your session.`);
                    setActiveResource(null);
                  }}
                >
                  Launch Module
                </Button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </section>
  );
};
