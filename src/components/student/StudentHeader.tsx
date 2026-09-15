import React from 'react';
import { 
  Menu, 
  Bell, 
  CheckCircle2, 
  User, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import type { Student } from '../../data/platform/types';

interface StudentHeaderProps {
  student: Student;
  currentSubroute: string;
  unreadCount: number;
  onOpenMobileMenu: () => void;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  student,
  currentSubroute,
  unreadCount,
  onOpenMobileMenu,
  onNavigate,
  onBackToPublic
}) => {
  // Compute breadcrumb title
  const getRouteLabel = () => {
    if (currentSubroute === '/student' || currentSubroute === '/student/') return 'Dashboard';
    if (currentSubroute.startsWith('/student/opportunities/')) return 'Opportunity Details';
    if (currentSubroute.startsWith('/student/opportunities')) return 'Opportunities';
    if (currentSubroute.startsWith('/student/applications/')) return 'Application Tracking';
    if (currentSubroute.startsWith('/student/applications')) return 'My Applications';
    if (currentSubroute.startsWith('/student/drives')) return 'Placement Drives';
    if (currentSubroute.startsWith('/student/offers')) return 'My Offers';
    if (currentSubroute.startsWith('/student/preparation')) return 'Career Readiness';
    if (currentSubroute.startsWith('/student/skills')) return 'Skills & Gaps';
    if (currentSubroute.startsWith('/student/calendar')) return 'Placement Calendar';
    if (currentSubroute.startsWith('/student/resources')) return 'Resources & Policies';
    if (currentSubroute.startsWith('/student/documents')) return 'My Documents';
    if (currentSubroute.startsWith('/student/profile')) return 'Student Profile';
    if (currentSubroute.startsWith('/student/notifications')) return 'Notifications';
    if (currentSubroute.startsWith('/student/support')) return 'Help & Support Desk';
    return 'Career Hub';
  };

  return (
    <header className="sticky top-0 z-20 bg-[#101A22]/95 backdrop-blur-md border-b border-gold-border/40 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-rvu-muted hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-gold"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-gold" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-rvu-muted">
            <span className="text-rvu-subtle hidden sm:inline">RVU Career Hub</span>
            <ChevronRight className="w-3 h-3 text-gold/40 hidden sm:inline" />
            <span className="text-white font-semibold">{getRouteLabel()}</span>
          </div>
        </div>

        {/* Center / Right: Badges & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Placement Eligibility Badge (Prominent Authority Layer) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono">Placement Status:</span>
            <strong className="text-white">Eligible (2026–27 Drives)</strong>
          </div>

          {/* Quick Public Portal Link */}
          <button
            onClick={onBackToPublic}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-rvu-muted hover:text-gold hover:bg-white/5 border border-transparent hover:border-gold-border/40 transition-all"
            title="View public career landing page"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => onNavigate('/student/notifications')}
            className="relative p-2 rounded-lg text-rvu-muted hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-rvu-text hover:text-gold transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold" />
            )}
          </button>

          {/* User / Demo Identity Chip */}
          <button
            onClick={() => onNavigate('/student/profile')}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-navy-card border border-gold-border/60 hover:border-gold transition-all text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-xs font-bold text-white group-hover:text-gold transition-colors">
                  {student.name}
                </span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                  DEMO
                </span>
              </div>
              <div className="text-[10px] font-mono text-rvu-subtle">
                {student.id}
              </div>
            </div>
          </button>

        </div>

      </div>

      {/* Mobile Notice Bar if on smaller screen */}
      <div className="lg:hidden mt-2 pt-2 border-t border-gold-border/20 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
          <CheckCircle2 className="w-3 h-3" />
          <span>✓ Eligible for 2026–27 Drives</span>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
          DEMO STUDENT
        </span>
      </div>
    </header>
  );
};
