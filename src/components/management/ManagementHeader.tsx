import React, { useState } from 'react';
import { 
  Menu, 
  ChevronRight, 
  ShieldCheck, 
  ExternalLink, 
  ChevronDown,
  Settings,
  Lock,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { deriveInitialsFromEmail } from '../../services/authService';
import { SignOutConfirmDialog } from '../auth/SignOutConfirmDialog';

interface ManagementHeaderProps {
  currentSubroute: string;
  currentRole?: string;
  onRoleChange?: (role: any) => void;
  onOpenMobileMenu: () => void;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
}

export const ManagementHeader: React.FC<ManagementHeaderProps> = ({
  currentSubroute,
  onOpenMobileMenu,
  onNavigate,
  onBackToPublic
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { user, logout } = useAuth();

  // Compute breadcrumb title
  const getRouteLabel = () => {
    if (currentSubroute === '/management' || currentSubroute === '/management/') return 'Dashboard';
    if (currentSubroute === '/management/students/import') return 'Student Excel Import';
    if (currentSubroute === '/management/students/import-history') return 'Import History';
    if (currentSubroute === '/management/students/new') return 'Enroll Student';
    if (currentSubroute.startsWith('/management/students/')) return 'Student 360 Profile';
    if (currentSubroute.startsWith('/management/students')) return 'Students Directory';
    if (currentSubroute.startsWith('/management/companies')) return 'Companies Directory';
    if (currentSubroute.startsWith('/management/recruiters')) return 'Recruiters';
    if (currentSubroute.startsWith('/management/drives')) return 'Placement Drives';
    if (currentSubroute.startsWith('/management/opportunities')) return 'Opportunities';
    if (currentSubroute.startsWith('/management/applications')) return 'Applications';
    if (currentSubroute.startsWith('/management/interviews')) return 'Interviews';
    if (currentSubroute.startsWith('/management/offers')) return 'Offers';
    if (currentSubroute.startsWith('/management/announcements')) return 'Communications';
    if (currentSubroute.startsWith('/management/communications')) return 'Communications';
    if (currentSubroute.startsWith('/management/support')) return 'Support Tickets';
    if (currentSubroute.startsWith('/management/analytics')) return 'Analytics';
    if (currentSubroute.startsWith('/management/reports')) return 'Reports';
    if (currentSubroute.startsWith('/management/resources')) return 'Resources';
    if (currentSubroute.startsWith('/management/audit-log')) return 'Audit Log';
    if (currentSubroute.startsWith('/management/settings')) return 'Settings';
    if (currentSubroute.startsWith('/management/rag-docs')) return 'AI Knowledge & Pvt Docs';
    return 'Placement Operations';
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0E1720]/95 backdrop-blur-md border-b border-gold-border/40 px-4 lg:px-6">
      <div className="h-full flex items-center justify-between gap-4">
        
        {/* Left: Mobile Sidebar Trigger & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-rvu-muted hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-rvu-muted">
            <span className="text-[#CCAA68] font-bold tracking-wider hidden sm:inline">PLACEMENT CELL</span>
            <ChevronRight className="w-3 h-3 text-gold/40 hidden sm:inline" />
            <span className="text-white font-semibold">{getRouteLabel()}</span>
          </div>
        </div>

        {/* Center / Right: Role Badge & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Official Role Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-[11px] font-mono font-bold text-gold">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>PLACEMENT CELL</span>
          </div>

          {/* Quick Public Portal Link */}
          <button
            onClick={onBackToPublic}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-rvu-muted hover:text-gold hover:bg-white/5 border border-transparent hover:border-gold-border/40 transition-all"
            title="View public career landing page"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {/* Admin Identity Avatar with Dropdown */}
          <div className="relative pl-2 border-l border-white/10">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Open CAR admin menu"
              aria-expanded={isProfileMenuOpen}
            >
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold font-bold text-xs font-mono">
                {deriveInitialsFromEmail(user?.email || 'placement@rvu.edu.in', user?.displayName || 'Placement Team Member')}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-white leading-none truncate max-w-[130px]">
                  {user?.displayName || 'Placement Team Member'}
                </div>
                <div className="text-[10px] text-rvu-muted font-mono leading-tight mt-0.5 truncate max-w-[130px]">
                  {user?.email || 'placement@rvu.edu.in'}
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
                  <div className="text-xs font-bold text-white">{user?.displayName || 'Placement Team Member'}</div>
                  <div className="text-[10px] font-mono text-rvu-subtle truncate">{user?.email || 'placement@rvu.edu.in'}</div>
                  <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-gold font-semibold">
                    <ShieldCheck className="w-3 h-3 text-gold" />
                    <span>PLACEMENT CELL AUTHORIZED</span>
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
        userEmail={user?.email || 'placement@rvu.edu.in'}
        onCancel={() => setShowSignOutModal(false)}
        onConfirm={async () => {
          setShowSignOutModal(false);
          await logout();
          onNavigate('/login?role=placement');
        }}
      />
    </header>
  );
};

export default ManagementHeader;
