import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  CheckCircle2, 
  User, 
  ChevronRight,
  ExternalLink,
  Search,
  Zap,
  Briefcase,
  Upload,
  Calendar,
  Sparkles,
  ChevronDown,
  Settings,
  LogOut,
  Lock
} from 'lucide-react';
import type { Student } from '../../data/platform/types';
import { useAuth } from '../../context/AuthContext';
import { deriveInitialsFromEmail } from '../../services/authService';
import { SignOutConfirmDialog } from '../auth/SignOutConfirmDialog';

interface StudentHeaderProps {
  student: Student;
  currentSubroute: string;
  unreadCount: number;
  onOpenMobileMenu: () => void;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
  onOpenSearch?: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  student,
  currentSubroute,
  unreadCount,
  onOpenMobileMenu,
  onNavigate,
  onBackToPublic,
  onOpenSearch
}) => {
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setQuickActionsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    if (currentSubroute.startsWith('/student/skills')) return 'Skills Intelligence';
    if (currentSubroute.startsWith('/student/calendar')) return 'Placement Calendar';
    if (currentSubroute.startsWith('/student/resources')) return 'Career Resources';
    if (currentSubroute.startsWith('/student/documents')) return 'Document Vault';
    if (currentSubroute.startsWith('/student/profile')) return 'Student Profile';
    if (currentSubroute.startsWith('/student/notifications')) return 'Notifications';
    if (currentSubroute.startsWith('/student/support')) return 'Career Support Desk';
    return 'Career Hub';
  };

  const quickActions = [
    {
      label: 'Explore Opportunities',
      icon: <Briefcase className="w-3.5 h-3.5 text-gold" />,
      action: () => onNavigate('/student/opportunities')
    },
    {
      label: 'Upload New Resume',
      icon: <Upload className="w-3.5 h-3.5 text-emerald-400" />,
      action: () => onNavigate('/student/documents')
    },
    {
      label: 'Update Profile & SIS',
      icon: <User className="w-3.5 h-3.5 text-sky-400" />,
      action: () => onNavigate('/student/profile')
    },
    {
      label: 'Prepare for Interview',
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
      action: () => onNavigate('/student/preparation')
    },
    {
      label: 'Open Placement Calendar',
      icon: <Calendar className="w-3.5 h-3.5 text-indigo-400" />,
      action: () => onNavigate('/student/calendar')
    }
  ];

  return (
    <header className="sticky top-0 z-20 bg-[#101A22]/95 backdrop-blur-md border-b border-gold-border/40 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        
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
            <span className="text-[#CCAA68] font-bold tracking-wider hidden sm:inline">STUDENT PORTAL</span>
            <ChevronRight className="w-3 h-3 text-gold/40 hidden sm:inline" />
            <span className="text-white font-semibold">{getRouteLabel()}</span>
          </div>
        </div>

        {/* Official Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-[11px] font-mono font-bold text-gold">
          <span>STUDENT</span>
        </div>

        {/* Center: Global Search Trigger Button */}
        {onOpenSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-navy-dark border border-gold-border/30 hover:border-gold/60 text-xs text-rvu-muted transition-all shadow-inner group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                <span className="truncate">Search opportunities, drives, skills...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-rvu-subtle bg-white/5 border border-white/10 rounded">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Right: Quick Action, Badges, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile search icon button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 rounded-lg text-rvu-muted hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-gold" />
            </button>
          )}

          {/* Quick Actions Dropdown */}
          <div className="relative" ref={quickActionsRef}>
            <button
              onClick={() => setQuickActionsOpen(!quickActionsOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick Actions</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${quickActionsOpen ? 'rotate-180' : ''}`} />
            </button>

            {quickActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-navy-surface border border-gold-border/50 shadow-2xl p-1.5 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-mono text-rvu-subtle uppercase border-b border-white/5">
                  Frequently Used Actions
                </div>
                {quickActions.map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      qa.action();
                      setQuickActionsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rvu-muted hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    {qa.icon}
                    <span>{qa.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Placement Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono text-white font-semibold">Eligible (2026–27)</span>
          </div>

          {/* Public Site Link */}
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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold animate-pulse" />
            )}
          </button>

          {/* User / Profile Avatar with Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-navy-card border border-gold-border/60 hover:border-gold transition-all text-left group"
              aria-label="Open student account menu"
              aria-expanded={profileMenuOpen}
            >
              <div className="w-7 h-7 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-bold text-xs font-mono">
                {deriveInitialsFromEmail(user?.email || student.email || 'student@rvu.edu.in', user?.displayName || student.name)}
              </div>
              
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-bold text-white group-hover:text-gold transition-colors truncate max-w-[130px]">
                  {user?.displayName || student.name || 'Student'}
                </div>
                <div className="text-[10px] font-mono text-rvu-subtle truncate max-w-[130px]">
                  {user?.email || student.email}
                </div>
              </div>
              <ChevronDown className={`w-3 h-3 text-rvu-subtle transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#101A22] border border-gold-border/60 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                {/* User Header */}
                <div className="p-3 bg-[#19252F] rounded-xl border border-white/5 space-y-1">
                  <div className="font-bold text-white text-xs">{user?.displayName || student.name}</div>
                  <div className="text-[10px] font-mono text-rvu-subtle truncate">{user?.email || student.email}</div>
                  <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>DEMO MODE SESSION</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onNavigate('/student/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rvu-muted hover:text-white hover:bg-white/5 transition-all text-left"
                >
                  <User className="w-3.5 h-3.5 text-gold" />
                  <span>My Student Profile</span>
                </button>

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onNavigate('/student/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rvu-muted hover:text-white hover:bg-white/5 transition-all text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-gold" />
                  <span>Settings & Preferences</span>
                </button>

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onNavigate('/student/settings/security');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rvu-muted hover:text-white hover:bg-white/5 transition-all text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-gold" />
                  <span>Password & Security</span>
                </button>

                <div className="border-t border-white/5 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setShowSignOutModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left"
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
        userEmail={user?.email}
        onCancel={() => setShowSignOutModal(false)}
        onConfirm={async () => {
          setShowSignOutModal(false);
          await logout();
          onNavigate('/login?role=student');
        }}
      />
    </header>
  );
};
