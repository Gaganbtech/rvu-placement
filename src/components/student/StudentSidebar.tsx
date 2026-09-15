import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Building, 
  Compass, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  FolderLock, 
  UserCheck, 
  Bell, 
  LifeBuoy, 
  ArrowLeft, 
  LogOut,
  Award,
  ShieldCheck,
  X
} from 'lucide-react';
import { RVU_BRAND } from '../../data/rvu';

interface StudentSidebarProps {
  currentSubroute: string;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
  unreadNotifications: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  currentSubroute,
  onNavigate,
  onBackToPublic,
  unreadNotifications,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const mainNavItems = [
    {
      label: 'Dashboard',
      route: '/student',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      label: 'Opportunities',
      route: '/student/opportunities',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      label: 'My Applications',
      route: '/student/applications',
      icon: <FileText className="w-4 h-4" />
    },
    {
      label: 'Placement Drives',
      route: '/student/drives',
      icon: <Building className="w-4 h-4" />
    },
    {
      label: 'My Offers',
      route: '/student/offers',
      icon: <Award className="w-4 h-4" />
    },
    {
      label: 'Career Preparation',
      route: '/student/preparation',
      icon: <Compass className="w-4 h-4" />
    },
    {
      label: 'Skills & Gaps',
      route: '/student/skills',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      label: 'Placement Calendar',
      route: '/student/calendar',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      label: 'Resources & Policy',
      route: '/student/resources',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      label: 'Documents',
      route: '/student/documents',
      icon: <FolderLock className="w-4 h-4" />
    },
    {
      label: 'Student Profile',
      route: '/student/profile',
      icon: <UserCheck className="w-4 h-4" />
    }
  ];

  const secondaryNavItems = [
    {
      label: 'Notifications',
      route: '/student/notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined
    },
    {
      label: 'Help & Support',
      route: '/student/support',
      icon: <LifeBuoy className="w-4 h-4" />
    }
  ];

  const isActive = (itemRoute: string) => {
    if (itemRoute === '/student') {
      return currentSubroute === '/student' || currentSubroute === '/student/';
    }
    return currentSubroute.startsWith(itemRoute);
  };

  const handleItemClick = (route: string) => {
    onNavigate(route);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#131F2A] border-r border-gold-border/40 text-rvu-text select-none">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-gold-border/30 bg-[#0E1720]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/50 flex items-center justify-center text-gold font-serif font-bold text-base shadow-gold-glow">
              RV
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest text-gold uppercase font-bold">
                RV UNIVERSITY
              </div>
              <div className="text-sm font-bold text-white font-display tracking-tight flex items-center gap-1.5">
                <span>CAREER HUB</span>
                <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-gold/20 text-gold border border-gold/30">
                  STUDENT
                </span>
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-rvu-muted hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-rvu-subtle font-mono">
          <span className="italic font-serif text-gold-light">"{RVU_BRAND.tagline}"</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Verified SIS
          </span>
        </div>
      </div>

      {/* Main Scrollable Nav Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        
        {/* Core Workspace */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-mono text-rvu-subtle uppercase tracking-wider">
            Workspace
          </div>
          {mainNavItems.map((item) => {
            const active = isActive(item.route);
            return (
              <button
                key={item.route}
                onClick={() => handleItemClick(item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-gold/15 text-gold border border-gold/40 shadow-sm font-semibold'
                    : 'text-rvu-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={active ? 'text-gold' : 'text-rvu-subtle'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Communications & Support */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-mono text-rvu-subtle uppercase tracking-wider">
            Communication & Desk
          </div>
          {secondaryNavItems.map((item) => {
            const active = isActive(item.route);
            return (
              <button
                key={item.route}
                onClick={() => handleItemClick(item.route)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-gold/15 text-gold border border-gold/40 shadow-sm font-semibold'
                    : 'text-rvu-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className={active ? 'text-gold' : 'text-rvu-subtle'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-gold text-navy-dark font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Placement Office Authority Badge */}
        <div className="p-3 rounded-xl bg-[#0F1822] border border-gold-border/30 text-[11px] space-y-1.5">
          <div className="flex items-center gap-1.5 text-gold font-semibold text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>CAR Authority Layer</span>
          </div>
          <p className="text-[11px] text-rvu-muted leading-relaxed">
            Data synced with Central Placement & SIS. Actions are auditable.
          </p>
        </div>
      </div>

      {/* Footer Nav / Actions */}
      <div className="p-3 border-t border-gold-border/30 bg-[#0E1720] space-y-1">
        <button
          onClick={onBackToPublic}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rvu-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gold" />
          <span>Back to Public Portal</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Demo Account: Reset your session and return to Public Portal?')) {
              onBackToPublic();
            }
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out (Demo Reset)</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Container */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
