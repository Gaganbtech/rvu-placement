import React from 'react';
import type { Opportunity } from '../../data/opportunities';
import { MapPin, Calendar, Building, Sparkles, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect
}) => {
  return (
    <div className="group relative card-glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between">
      
      {/* Top Header: Badge, Work Mode, Match Score */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={opportunity.category === 'Placement' ? 'gold' : 'navy'}>
              {opportunity.category}
            </Badge>
            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-rvu-muted border border-white/10">
              {opportunity.workMode}
            </span>
          </div>

          {/* Match Score Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-faint border border-gold/40 shadow-gold-sm shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-bold text-gold font-mono">
              {opportunity.matchScore}% Match
            </span>
          </div>
        </div>

        {/* Opportunity Title & Company */}
        <h3 className="text-lg font-bold text-rvu-text font-display group-hover:text-gold transition-colors line-clamp-1 mb-1">
          {opportunity.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-rvu-muted mb-3">
          <Building className="w-3.5 h-3.5 text-gold shrink-0" />
          <span className="font-medium text-rvu-text/90">{opportunity.company}</span>
          <span>•</span>
          <span className="truncate">{opportunity.school}</span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-rvu-muted line-clamp-2 leading-relaxed mb-4">
          {opportunity.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {opportunity.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-surface text-rvu-text border border-gold-border/60"
            >
              {tag}
            </span>
          ))}
          {opportunity.tags.length > 3 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-rvu-subtle">
              +{opportunity.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Metadata & Action CTA */}
      <div className="pt-4 border-t border-gold-border/40 space-y-3">
        <div className="flex items-center justify-between text-xs text-rvu-muted">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <span className="truncate">{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-gold font-medium">
            <Calendar className="w-3 h-3 text-gold" />
            <span>Due {opportunity.deadline}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <span className="text-[10px] text-rvu-subtle uppercase block tracking-wider">Package Slot</span>
            <span className="text-xs font-bold text-rvu-text font-mono">
              {opportunity.compensation}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
            onClick={() => onSelect(opportunity)}
            className="shrink-0"
          >
            View Details
          </Button>
        </div>
      </div>

    </div>
  );
};
