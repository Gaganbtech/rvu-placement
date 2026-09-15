import React from 'react';
import { RVU_BRAND } from '../../data/rvu';
import { Button } from '../ui/Button';
import { 
  ArrowLeft, 
  Sparkles, 
  User, 
  Building2, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

interface PortalPrototypeViewProps {
  route: string;
  onBackToPublic: () => void;
}

export const PortalPrototypeView: React.FC<PortalPrototypeViewProps> = ({
  route,
  onBackToPublic
}) => {
  const getPortalDetails = () => {
    switch (route) {
      case '/student':
        return {
          title: 'Student Career Portal',
          badge: 'STUDENT WORKSPACE // PROTOTYPE',
          icon: <User className="w-6 h-6 text-gold" />,
          subtitle: 'Welcome to your candidate management dashboard. Track applications, schedule mock interviews, and build your verified portfolio.',
          modules: [
            { name: 'Active Campus Postings', desc: 'Browse and apply directly to 2025–26 verified recruitment drives', status: 'Live' },
            { name: 'ATS Resume Studio', desc: 'Pre-screen your resume against recruiter rubrics and ATS benchmarks', status: 'Active' },
            { name: 'Mock Technical Interviewer', desc: 'Schedule AI-evaluated and faculty-guided technical rounds', status: 'Ready' },
            { name: 'Offer & Acceptance Desk', desc: 'View verified employment contracts and coordinate with CAR', status: 'Protected' }
          ]
        };
      case '/recruiter':
        return {
          title: 'Corporate Recruiter Portal',
          badge: 'RECRUITER WORKSPACE // PROTOTYPE',
          icon: <Building2 className="w-6 h-6 text-gold" />,
          subtitle: 'Partner with RV University Corporate & Alumni Relations. Schedule campus drives, filter 1,608 eligible students, and coordinate evaluations.',
          modules: [
            { name: 'Eligible Candidate Directory', desc: 'Filter verified talent across 9 schools and 27+ academic programmes', status: '1,608 Candidates' },
            { name: 'Campus Drive Scheduler', desc: 'Book interview slots, presentation halls, and coding labs', status: 'Open' },
            { name: 'Shortlist & Assessment Console', desc: 'Review proctored test results, portfolios, and CGPA audit data', status: 'Ready' },
            { name: 'MoU & Corporate Advisory Hub', desc: 'Access joint curriculum and experiential learning partnership channels', status: 'Active' }
          ]
        };
      case '/management':
        return {
          title: 'Management & CAR Portal',
          badge: 'ADMINISTRATION WORKSPACE // PROTOTYPE',
          icon: <Layers className="w-6 h-6 text-gold" />,
          subtitle: 'Central administrative dashboard for the Corporate & Alumni Relations (CAR) office and University Leadership.',
          modules: [
            { name: 'Placement Audit & Compliance', desc: 'Real-time offer verification, highest package tracking (₹43.5 LPA), and statistics', status: 'Audited' },
            { name: 'School-wise Performance Matrix', desc: 'Comparative placement conversion metrics across all 9 schools', status: 'Active' },
            { name: 'Corporate Partner Registry', desc: 'Manage 250+ recruiting organizations and industrial MoU agreements', status: '250+ Orgs' },
            { name: 'Townhall & Parent Briefings', desc: 'Coordinate advisory briefings, townhalls, and statutory disclosures', status: 'Scheduled' }
          ]
        };
      default:
        return {
          title: 'RVU Portal Workspace',
          badge: 'PROTOTYPE ROUTE',
          icon: <Sparkles className="w-6 h-6 text-gold" />,
          subtitle: 'Prototype portal interface for RV University.',
          modules: []
        };
    }
  };

  const portal = getPortalDetails();

  return (
    <div className="min-h-screen bg-navy-dark text-rvu-text pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
            onClick={onBackToPublic}
          >
            Back to Public Portal
          </Button>

          <div className="flex items-center gap-2 text-xs font-mono text-rvu-muted">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span>Prototype Route: <strong className="text-gold">{route}</strong></span>
          </div>
        </div>

        {/* Portal Hero Card */}
        <div className="card-glass rounded-2xl p-8 border border-gold/40 shadow-card-elevated space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold-faint border border-gold/40 flex items-center justify-center">
              {portal.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gold border border-gold/20">
                {portal.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-rvu-text font-display mt-1">
                {portal.title}
              </h1>
            </div>
          </div>

          <p className="text-sm text-rvu-muted max-w-2xl leading-relaxed">
            {portal.subtitle}
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-rvu-subtle font-mono border-t border-gold-border/30">
            <span>{RVU_BRAND.name}</span>
            <span>•</span>
            <span className="font-serif italic text-gold">"{RVU_BRAND.tagline}"</span>
            <span>•</span>
            <span>{RVU_BRAND.contact.office}</span>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gold uppercase tracking-wider font-mono">
            Available Functional Workspaces
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portal.modules.map((m) => (
              <div
                key={m.name}
                className="p-5 rounded-xl bg-navy-card border border-gold-border/60 space-y-2 hover:border-gold/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-rvu-text">
                    {m.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-surface text-gold border border-white/10">
                    {m.status}
                  </span>
                </div>
                <p className="text-xs text-rvu-muted leading-relaxed">
                  {m.desc}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Module Configured (Prototype Preview)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice */}
        <div className="p-4 rounded-xl bg-navy-surface border border-white/10 text-center text-xs text-rvu-subtle">
          * Temporary prototype portal route. Full single sign-on (SSO) authentication and role-based access control will be integrated in future phases.
        </div>

      </div>
    </div>
  );
};
