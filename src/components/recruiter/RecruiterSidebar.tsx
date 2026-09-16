import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Briefcase,
  FileText,
  Users,
  CheckSquare,
  FileCheck2,
  Calendar,
  Layers,
  Award,
  MessageSquare,
  Bell,
  Library,
  Settings,
  ArrowLeft,
  X,
  LogOut
} from 'lucide-react';
import { RVU_BRAND } from '../../data/rvu';
import type { RecruiterAccount, RecruiterRole } from '../../data/platform/types';
import { useAuth } from '../../context/AuthContext';
import { SignOutConfirmDialog } from '../auth/SignOutConfirmDialog';

interface RecruiterSidebarProps {
  currentSubroute: string;
  activeRecruiter: RecruiterAccount | undefined;
  allRecruiters: RecruiterAccount[];
  recruiterRole: RecruiterRole;
  onSelectRecruiter: (recruiterId: string) => void;
  onRoleChange: (role: RecruiterRole) => void;
  applicationsCount: number;
  candidatesCount: number;
  interviewsCount?: number;
  unreadMessagesCount?: number;
  unreadNotificationsCount?: number;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({
  currentSubroute,
  activeRecruiter,
  allRecruiters: _allRecruiters,
  recruiterRole: _recruiterRole,
  onSelectRecruiter: _onSelectRecruiter,
  onRoleChange: _onRoleChange,
  applicationsCount,
  candidatesCount: _candidatesCount,
  unreadNotificationsCount = 0,
  onNavigate,
  onBackToPublic,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', route: '/recruiter', icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
    { label: 'Company', route: '/recruiter/company', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Team', route: '/recruiter/team', icon: <Users2 className="w-4 h-4" /> },
    { label: 'Opportunities', route: '/recruiter/opportunities', icon: <Briefcase className="w-4 h-4" /> },
    { 
      label: 'Applications', 
      route: '/recruiter/applications', 
      icon: <FileText className="w-4 h-4" />,
      badge: applicationsCount > 0 ? applicationsCount : undefined
    },
    { label: 'Candidates', route: '/recruiter/candidates', icon: <Users className="w-4 h-4" /> },
    { label: 'Shortlist', route: '/recruiter/shortlist', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Assessments', route: '/recruiter/assessments', icon: <FileCheck2 className="w-4 h-4" /> },
    { label: 'Interviews', route: '/recruiter/interviews', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Drives', route: '/recruiter/drives', icon: <Layers className="w-4 h-4" /> },
    { label: 'Offers', route: '/recruiter/offers', icon: <Award className="w-4 h-4" /> },
    { label: 'Messages', route: '/recruiter/messages', icon: <MessageSquare className="w-4 h-4" /> },
    { 
      label: 'Notifications', 
      route: '/recruiter/notifications', 
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined
    },
    { label: 'Resources', route: '/recruiter/resources', icon: <Library className="w-4 h-4" /> },
    { label: 'Settings', route: '/recruiter/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const isItemActive = (route: string, exact: boolean = false) => {
    if (exact || route === '/recruiter') {
      return currentSubroute === '/recruiter' || currentSubroute === '/recruiter/';
    }
    return currentSubroute.startsWith(route);
  };

  const handleItemClick = (route: string) => {
    onNavigate(route);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#101A22] border-r border-[#CCAA68]/20 text-gray-200 select-none">
      
      {/* Brand Header with Official RV University Logo */}
      <div className="p-4 border-b border-[#CCAA68]/15 bg-[#19252F]/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src="/src/assets/rvu-logo-gold.svg" 
              alt="RV University Logo" 
              className="h-9 w-auto object-contain shrink-0" 
            />
            <div className="border-l border-[#CCAA68]/40 pl-2.5">
              <div className="text-[10px] font-mono tracking-widest text-[#CCAA68] uppercase font-bold">
                RV UNIVERSITY
              </div>
              <div className="text-xs font-bold text-white font-display tracking-tight flex items-center gap-1.5">
                <span>CAREER HUB</span>
                <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-[#CCAA68]/20 text-[#D8B978] border border-[#CCAA68]/30">
                  RECRUITER
                </span>
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span className="italic font-serif text-[#D8B978]">"{RVU_BRAND.tagline}"</span>
          <span className="text-emerald-400 font-medium">Verified Partner</span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        <div className="px-3 pb-1 text-[10px] font-mono text-[#CCAA68] uppercase tracking-wider font-semibold">
          Recruiter Workspace
        </div>

        {navItems.map((item) => {
          const active = isItemActive(item.route, item.exact);
          return (
            <button
              key={item.route}
              onClick={() => handleItemClick(item.route)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                active
                  ? 'bg-[#CCAA68] text-[#101A22] font-semibold shadow-md shadow-[#CCAA68]/15'
                  : 'text-gray-300 hover:bg-[#20303A] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={active ? 'text-[#101A22]' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    active ? 'bg-[#101A22] text-[#CCAA68]' : 'bg-[#20303A] text-gray-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* User Identity Info */}
        <div className="mt-4 p-3 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 text-[11px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Authenticated As</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#CCAA68]/20 text-[#D8B978] border border-[#CCAA68]/40">
              RECRUITER
            </span>
          </div>
          <div className="font-semibold text-white truncate">
            {user?.displayName || activeRecruiter?.name || 'Recruiter'}
          </div>
          <div className="text-[10px] text-gray-400 truncate">
            {user?.email || activeRecruiter?.email || 'recruiter@company.com'}
          </div>
          <div className="text-[10px] font-mono text-[#CCAA68] truncate">
            {activeRecruiter?.companyName || 'Corporate Hiring Partner'}
          </div>
        </div>
      </div>

      {/* Footer Nav / Actions */}
      <div className="p-3 border-t border-[#CCAA68]/20 bg-[#19252F] space-y-1">
        <button
          onClick={onBackToPublic}
          className="w-full flex items-center justify-center gap-2 p-1.5 rounded text-[11px] text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#CCAA68]" />
          <span>Public Placement Hub</span>
        </button>

        <button
          onClick={() => setShowSignOutModal(true)}
          className="w-full flex items-center justify-center gap-2 p-1.5 rounded text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
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
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmDialog
        isOpen={showSignOutModal}
        userEmail={user?.email || activeRecruiter?.email}
        onCancel={() => setShowSignOutModal(false)}
        onConfirm={async () => {
          setShowSignOutModal(false);
          await logout();
          onNavigate('/login?role=recruiter');
        }}
      />
    </>
  );
};

export default RecruiterSidebar;
