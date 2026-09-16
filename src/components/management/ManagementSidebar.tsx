import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Layers,
  FileCheck,
  CalendarCheck,
  Award,
  Megaphone,
  BarChart3,
  FileSpreadsheet,
  BookOpen,
  HelpCircle,
  History,
  Settings,
  Sparkles,
  ArrowLeft,
  X,
  LogOut
} from 'lucide-react';
import { RVU_BRAND } from '../../data/rvu';
import { useAuth } from '../../context/AuthContext';
import { SignOutConfirmDialog } from '../auth/SignOutConfirmDialog';

interface ManagementSidebarProps {
  currentSubroute: string;
  currentRole?: string;
  pendingOffersCount?: number;
  pendingApprovalsCount?: number;
  openTicketsCount?: number;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ManagementSidebar: React.FC<ManagementSidebarProps> = ({
  currentSubroute,
  pendingOffersCount = 0,
  pendingApprovalsCount = 0,
  openTicketsCount = 0,
  onNavigate,
  onBackToPublic,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', route: '/management', icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
    { label: 'Students', route: '/management/students', icon: <Users className="w-4 h-4" /> },
    { 
      label: 'Recruiters', 
      route: '/management/recruiters', 
      icon: <Building2 className="w-4 h-4" />,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined
    },
    { label: 'Companies', route: '/management/companies', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Drives', route: '/management/drives', icon: <Layers className="w-4 h-4" /> },
    { label: 'Opportunities', route: '/management/opportunities', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Applications', route: '/management/applications', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Interviews', route: '/management/interviews', icon: <CalendarCheck className="w-4 h-4" /> },
    { 
      label: 'Offers', 
      route: '/management/offers', 
      icon: <Award className="w-4 h-4" />,
      badge: pendingOffersCount > 0 ? pendingOffersCount : undefined
    },
    { label: 'Communications', route: '/management/announcements', icon: <Megaphone className="w-4 h-4" /> },
    { label: 'Analytics', route: '/management/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Reports', route: '/management/reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { label: 'Resources', route: '/management/resources', icon: <BookOpen className="w-4 h-4" /> },
    { 
      label: 'Support', 
      route: '/management/support', 
      icon: <HelpCircle className="w-4 h-4" />,
      badge: openTicketsCount > 0 ? openTicketsCount : undefined
    },
    { label: 'Audit Log', route: '/management/audit-log', icon: <History className="w-4 h-4" /> },
    { label: 'Settings', route: '/management/settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'AI Knowledge & Pvt Docs', route: '/management/rag-docs', icon: <Sparkles className="w-4 h-4 text-[#CCAA68]" /> }
  ];

  const isActive = (itemRoute: string, exact: boolean = false) => {
    if (exact || itemRoute === '/management') {
      return currentSubroute === '/management' || currentSubroute === '/management/';
    }
    return currentSubroute.startsWith(itemRoute);
  };

  const handleItemClick = (route: string) => {
    onNavigate(route);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111A22] border-r border-gold-border/40 text-rvu-text select-none">
      
      {/* Brand Header with Official RV University Logo */}
      <div className="p-4 border-b border-gold-border/30 bg-[#0C141B]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src="/src/assets/rvu-logo-gold.svg" 
              alt="RV University Logo" 
              className="h-9 w-auto object-contain shrink-0" 
            />
            <div className="border-l border-[#CCAA68]/40 pl-2.5">
              <div className="text-[10px] font-mono tracking-widest text-gold uppercase font-bold">
                RV UNIVERSITY
              </div>
              <div className="text-xs font-bold text-white font-display tracking-tight flex items-center gap-1.5">
                <span>CAREER HUB</span>
                <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-gold/20 text-gold border border-gold/30">
                  PLACEMENT CELL
                </span>
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-rvu-muted hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-rvu-subtle font-mono">
          <span className="italic font-serif text-gold-light">"{RVU_BRAND.tagline}"</span>
          <span className="text-emerald-400 font-medium">Placement Governance</span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        <div className="px-3 pb-1 text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
          Placement Cell
        </div>

        {navItems.map((item) => {
          const active = isActive(item.route, item.exact);
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
              <div className="flex items-center gap-2.5 truncate">
                <span className={active ? 'text-gold' : 'text-rvu-subtle'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-gold text-navy-dark shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* User Identity Info */}
        <div className="mt-4 p-3 rounded-xl bg-[#0F1822] border border-gold-border/30 text-[11px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-rvu-subtle uppercase">Authenticated As</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-gold/20 text-gold border border-gold/40">
              PLACEMENT CELL
            </span>
          </div>
          <div className="font-semibold text-white truncate">{user?.displayName || 'Placement Team Member'}</div>
          <div className="text-[10px] font-mono text-gold truncate">{user?.email || 'placement@rvu.edu.in'}</div>
        </div>
      </div>

      {/* Footer Nav / Actions */}
      <div className="p-3 border-t border-gold-border/30 bg-[#0C141B] space-y-1">
        <button
          onClick={onBackToPublic}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rvu-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-gold" />
          <span>Back to Public Portal</span>
        </button>

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
        userEmail={user?.email || 'placement@rvu.edu.in'}
        onCancel={() => setShowSignOutModal(false)}
        onConfirm={async () => {
          setShowSignOutModal(false);
          await logout();
          onNavigate('/login?role=placement');
        }}
      />
    </>
  );
};

export default ManagementSidebar;
