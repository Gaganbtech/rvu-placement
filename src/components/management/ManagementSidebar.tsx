import React from 'react';
import {
  LayoutDashboard,
  Users,
  Upload,
  History,
  UserPlus,
  Building2,
  Briefcase,
  Layers,
  FileCheck,
  CalendarCheck,
  Award,
  Megaphone,
  LifeBuoy,
  BarChart3,
  FileSpreadsheet,
  BookOpen,
  History as AuditIcon,
  Settings,
  ArrowLeft,
  GraduationCap,
  X,
  Building,
  LogOut
} from 'lucide-react';
import { RVU_BRAND } from '../../data/rvu';
import type { UserRole } from '../../data/platform/types';
import { useAuth } from '../../context/AuthContext';
import { SignOutConfirmDialog } from '../auth/SignOutConfirmDialog';

interface ManagementSidebarProps {
  currentSubroute: string;
  currentRole: UserRole;
  pendingOffersCount: number;
  pendingApprovalsCount: number;
  openTicketsCount: number;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  route: string;
  icon: React.ReactNode;
  exact?: boolean;
  badge?: number | string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const ManagementSidebar: React.FC<ManagementSidebarProps> = ({
  currentSubroute,
  currentRole,
  pendingOffersCount = 0,
  pendingApprovalsCount = 0,
  openTicketsCount = 0,
  onNavigate,
  onBackToPublic,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const [showSignOutModal, setShowSignOutModal] = React.useState(false);
  const { user, logout } = useAuth();
  const navSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        {
          label: 'Command Dashboard',
          route: '/management',
          icon: <LayoutDashboard className="w-4 h-4" />,
          exact: true
        }
      ]
    },
    {
      title: 'Student Cohort',
      items: [
        {
          label: 'Student Master',
          route: '/management/students',
          icon: <Users className="w-4 h-4" />,
          exact: true
        },
        {
          label: 'Excel Import',
          route: '/management/students/import',
          icon: <Upload className="w-4 h-4" />
        },
        {
          label: 'Import History',
          route: '/management/students/import-history',
          icon: <History className="w-4 h-4" />
        },
        {
          label: 'Enroll Student',
          route: '/management/students/new',
          icon: <UserPlus className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Corporate & Industry',
      items: [
        {
          label: 'Companies Directory',
          route: '/management/companies',
          icon: <Building2 className="w-4 h-4" />
        },
        {
          label: 'Recruiter Accounts',
          route: '/management/recruiters',
          icon: <Briefcase className="w-4 h-4" />,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }
      ]
    },
    {
      title: 'Placement Operations',
      items: [
        {
          label: 'Placement Drives',
          route: '/management/drives',
          icon: <Layers className="w-4 h-4" />
        },
        {
          label: 'Opportunities Desk',
          route: '/management/opportunities',
          icon: <Building className="w-4 h-4" />
        },
        {
          label: 'Applications Pipeline',
          route: '/management/applications',
          icon: <FileCheck className="w-4 h-4" />
        },
        {
          label: 'Interviews Schedule',
          route: '/management/interviews',
          icon: <CalendarCheck className="w-4 h-4" />
        },
        {
          label: 'Offer Verification',
          route: '/management/offers',
          icon: <Award className="w-4 h-4" />,
          badge: pendingOffersCount > 0 ? pendingOffersCount : undefined,
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        }
      ]
    },
    {
      title: 'Communications',
      items: [
        {
          label: 'Announcements',
          route: '/management/announcements',
          icon: <Megaphone className="w-4 h-4" />
        },
        {
          label: 'Helpdesk Tickets',
          route: '/management/support',
          icon: <LifeBuoy className="w-4 h-4" />,
          badge: openTicketsCount > 0 ? openTicketsCount : undefined,
          badgeColor: 'bg-gold/20 text-gold border-gold/30'
        }
      ]
    },
    {
      title: 'Intelligence & Audit',
      items: [
        {
          label: 'Placement Analytics',
          route: '/management/analytics',
          icon: <BarChart3 className="w-4 h-4" />
        },
        {
          label: 'Institutional Reports',
          route: '/management/reports',
          icon: <FileSpreadsheet className="w-4 h-4" />
        },
        {
          label: 'Policy & Resources',
          route: '/management/resources',
          icon: <BookOpen className="w-4 h-4" />
        },
        {
          label: 'Audit Trail',
          route: '/management/audit-log',
          icon: <AuditIcon className="w-4 h-4" />
        },
        {
          label: 'Policy Settings',
          route: '/management/settings',
          icon: <Settings className="w-4 h-4" />
        }
      ]
    }
  ];

  const isActive = (itemRoute: string, exact = false) => {
    if (exact) {
      return currentSubroute === itemRoute || currentSubroute === `${itemRoute}/`;
    }
    return currentSubroute.startsWith(itemRoute);
  };

  const handleItemClick = (route: string) => {
    onNavigate(route);
    if (onCloseMobile) onCloseMobile();
  };

  const getRoleLabel = () => {
    switch (currentRole) {
      case 'SUPER_ADMIN':
        return 'SUPER ADMIN';
      case 'COORDINATOR':
        return 'COORDINATOR';
      case 'CAR_ADMIN':
      default:
        return 'PLACEMENT ADMIN';
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111A22] border-r border-gold-border/40 text-rvu-text select-none">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-gold-border/30 bg-[#0C141B]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/60 flex items-center justify-center text-gold font-serif font-bold text-lg shadow-gold-glow">
              RV
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-gold uppercase font-bold">
                RV UNIVERSITY
              </div>
              <div className="text-sm font-bold text-white font-display tracking-tight flex items-center gap-1.5">
                <span>COMMAND CENTER</span>
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

        {/* Tagline & Sub-bar */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
          <span className="italic font-serif text-gold-light">"{RVU_BRAND.tagline}"</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-semibold bg-gold/15 text-gold border border-gold/30">
            {getRoleLabel()}
          </span>
        </div>
      </div>

      {/* Main Scrollable Nav Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-0.5">
            <div className="px-3 pb-1 text-[9px] font-mono text-rvu-subtle uppercase tracking-wider font-semibold">
              {section.title}
            </div>
            {section.items.map((item) => {
              const active = isActive(item.route, item.exact);
              return (
                <button
                  key={item.route}
                  onClick={() => handleItemClick(item.route)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-gold/15 text-gold border border-gold/40 shadow-sm font-semibold'
                      : 'text-rvu-muted hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={active ? 'text-gold' : 'text-rvu-subtle'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${item.badgeColor || 'bg-gold/20 text-gold border-gold/30'} font-bold`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Portal Switchers & Footer */}
      <div className="p-3 border-t border-gold-border/30 bg-[#0C141B] space-y-1.5">
        
        {/* Switch to Student Portal */}
        <button
          onClick={() => onNavigate('/student')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-rvu-text bg-navy-card/80 hover:bg-gold/10 hover:text-gold border border-gold-border/40 transition-colors"
          title="Switch to Student Portal view"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gold" />
            <span>Student Portal</span>
          </div>
          <span className="text-[10px] font-mono text-rvu-subtle">Preview</span>
        </button>

        {/* Back to Public Site */}
        <button
          onClick={onBackToPublic}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rvu-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-gold" />
          <span>Back to Public Portal</span>
        </button>

        {/* Sign Out */}
        <button
          onClick={() => setShowSignOutModal(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Container */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmDialog
        isOpen={showSignOutModal}
        userEmail={user?.email || 'car.placement@rvu.edu.in'}
        onCancel={() => setShowSignOutModal(false)}
        onConfirm={() => {
          setShowSignOutModal(false);
          logout();
          onBackToPublic();
        }}
      />
    </>
  );
};
