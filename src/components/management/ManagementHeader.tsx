import React, { useState } from 'react';
import { 
  Menu, 
  ChevronRight, 
  ShieldCheck, 
  ExternalLink, 
  ChevronDown,
  GraduationCap,
  Settings,
  Lock,
  LogOut
} from 'lucide-react';
import type { UserRole } from '../../data/platform/types';
import { useAuth } from '../../context/AuthContext';
import { deriveInitialsFromEmail } from '../../services/authService';
import { SignOutConfirmDialog } from '../auth/SignOutConfirmDialog';

interface ManagementHeaderProps {
  currentSubroute: string;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenMobileMenu: () => void;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
}

export const ManagementHeader: React.FC<ManagementHeaderProps> = ({
  currentSubroute,
  currentRole,
  onRoleChange,
  onOpenMobileMenu,
  onNavigate,
  onBackToPublic
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { user, logout } = useAuth();

  // Compute breadcrumb title
  const getRouteLabel = () => {
    if (currentSubroute === '/management' || currentSubroute === '/management/') return 'Command Dashboard';
    if (currentSubroute === '/management/students/import') return 'Student Excel Import';
    if (currentSubroute === '/management/students/import-history') return 'Import History';
    if (currentSubroute === '/management/students/new') return 'Enroll Student';
    if (currentSubroute.startsWith('/management/students/')) return 'Student 360 Profile';
    if (currentSubroute.startsWith('/management/students')) return 'Student Master Cohort';
    if (currentSubroute.startsWith('/management/companies')) return 'Corporate Partners Directory';
    if (currentSubroute.startsWith('/management/recruiters')) return 'Recruiter Accounts';
    if (currentSubroute.startsWith('/management/drives')) return 'Placement Drives';
    if (currentSubroute.startsWith('/management/opportunities')) return 'Opportunities Desk';
    if (currentSubroute.startsWith('/management/applications')) return 'Applications Pipeline';
    if (currentSubroute.startsWith('/management/interviews')) return 'Interviews Schedule';
    if (currentSubroute.startsWith('/management/offers')) return 'Offer Verification Desk';
    if (currentSubroute.startsWith('/management/announcements')) return 'Institutional Announcements';
    if (currentSubroute.startsWith('/management/communications')) return 'Broadcasts & Alerts';
    if (currentSubroute.startsWith('/management/support')) return 'CAR Helpdesk Tickets';
    if (currentSubroute.startsWith('/management/analytics')) return 'Placement Intelligence';
    if (currentSubroute.startsWith('/management/reports')) return 'Institutional Reports';
    if (currentSubroute.startsWith('/management/resources')) return 'Policy & Master Documents';
    if (currentSubroute.startsWith('/management/audit-log')) return 'Institutional Audit Trail';
    if (currentSubroute.startsWith('/management/settings')) return 'Placement Policy Settings';
    return 'Placement Command';
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin (Dean / Provost)';
      case 'CAR_ADMIN':
        return 'Placement Admin (Director CAR)';
      case 'COORDINATOR':
        return 'School Placement Coordinator';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#101A22]/95 backdrop-blur-md border-b border-gold-border/40 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-rvu-muted hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-gold"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-gold" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-rvu-muted">
            <span className="text-rvu-subtle hidden sm:inline">CAR Command</span>
            <ChevronRight className="w-3 h-3 text-gold/40 hidden sm:inline" />
            <span className="text-white font-semibold">{getRouteLabel()}</span>
          </div>
        </div>

        {/* Center / Right: Role Switcher, Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Institutional Cycle Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-dark/90 border border-gold-border/40 text-[11px] text-rvu-muted font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span>Cycle: <strong className="text-white">AY 2026–27</strong></span>
          </div>

          {/* Direct Switch to Student Portal */}
          <button
            onClick={() => onNavigate('/student')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-gold bg-gold/10 hover:bg-gold/20 border border-gold/30 transition-all"
            title="Preview Student Experience"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student View</span>
          </button>

          {/* Quick Public Portal Link */}
          <button
            onClick={onBackToPublic}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-rvu-muted hover:text-gold hover:bg-white/5 border border-transparent hover:border-gold-border/40 transition-all"
            title="View public career landing page"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-navy-card/90 border border-gold-border/50 text-xs font-mono text-rvu-text hover:border-gold transition-all"
              aria-expanded={isRoleMenuOpen}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <div className="text-left hidden sm:block">
                <span className="text-[9px] text-rvu-subtle uppercase block leading-none">Role Access</span>
                <span className="text-[11px] font-bold text-white leading-tight">
                  {currentRole === 'SUPER_ADMIN' ? 'Super Admin' : currentRole === 'COORDINATOR' ? 'Coordinator' : 'Placement Admin'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-rvu-subtle" />
            </button>

            {isRoleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl bg-[#131E28] border border-gold-border/60 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setIsRoleMenuOpen(false)}
              >
                <div className="px-2 py-1.5 text-[10px] font-mono text-rvu-subtle uppercase border-b border-white/5 mb-1">
                  Switch Simulated Role
                </div>
                {(['CAR_ADMIN', 'SUPER_ADMIN', 'COORDINATOR'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentRole === role
                        ? 'bg-gold/15 text-gold font-semibold border border-gold/30'
                        : 'text-rvu-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{getRoleDisplayName(role)}</span>
                    {currentRole === role && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin Identity Avatar with Dropdown */}
          <div className="relative pl-2 border-l border-white/10">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Open CAR admin menu"
              aria-expanded={isProfileMenuOpen}
            >
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold font-bold text-xs font-mono">
                {deriveInitialsFromEmail(user?.email || 'car.placement@rvu.edu.in', user?.displayName || 'Office of CAR')}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-white leading-none truncate max-w-[130px]">
                  {user?.displayName || 'Office of CAR'}
                </div>
                <div className="text-[10px] text-rvu-muted font-mono leading-tight mt-0.5 truncate max-w-[130px]">
                  {user?.email || 'car.placement@rvu.edu.in'}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-rvu-muted" />
            </button>

            {isProfileMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl bg-[#131E28] border border-gold-border/60 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <div className="p-2.5 bg-[#19252F] rounded-lg border border-white/5 space-y-0.5">
                  <div className="text-xs font-bold text-white">{user?.displayName || 'Placement Cell Admin'}</div>
                  <div className="text-[10px] font-mono text-rvu-subtle truncate">{user?.email || 'car.placement@rvu.edu.in'}</div>
                  <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>DEMO MODE SESSION</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('/management/settings')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-rvu-muted hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-gold" />
                  <span>Placement Operations Settings</span>
                </button>

                <button
                  onClick={() => onNavigate('/management/settings/security')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-rvu-muted hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-gold" />
                  <span>Admin Password & Security</span>
                </button>

                <button
                  onClick={() => onNavigate('/management/audit-log')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-rvu-muted hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  <span>Statutory Audit Logs</span>
                </button>

                <div className="border-t border-white/10 pt-1 mt-1">
                  <button
                    onClick={() => setShowSignOutModal(true)}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmDialog
        isOpen={showSignOutModal}
        userEmail={user?.email || 'car.placement@rvu.edu.in'}
        onCancel={() => setShowSignOutModal(false)}
        onConfirm={() => {
          setShowSignOutModal(false);
          logout();
          onNavigate('/');
        }}
      />
    </header>
  );
};
