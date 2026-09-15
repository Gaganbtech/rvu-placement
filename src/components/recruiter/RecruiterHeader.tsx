import React, { useState } from 'react';
import {
  Menu,
  ChevronRight,
  Bell,
  Search,
  PlusCircle,
  Building2,
  ShieldCheck,
  User,
  ChevronDown,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import type { RecruiterAccount, RecruiterNotification, RecruiterRole } from '../../data/platform/types';

interface RecruiterHeaderProps {
  currentSubroute: string;
  activeRecruiter: RecruiterAccount | undefined;
  recruiterRole: RecruiterRole;
  notifications: RecruiterNotification[];
  unreadNotificationsCount: number;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onOpenMobileMenu: () => void;
  onNavigate: (route: string) => void;
}

export const RecruiterHeader: React.FC<RecruiterHeaderProps> = ({
  currentSubroute,
  activeRecruiter,
  recruiterRole,
  notifications,
  unreadNotificationsCount,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onOpenMobileMenu,
  onNavigate
}) => {
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Compute breadcrumb title based on subroute
  const getRouteLabel = () => {
    if (currentSubroute === '/recruiter' || currentSubroute === '/recruiter/') return 'Recruitment Dashboard';
    if (currentSubroute === '/recruiter/opportunities/new') return 'Create Opportunity Wizard';
    if (currentSubroute.startsWith('/recruiter/opportunities/')) return 'Opportunity Details & Timeline';
    if (currentSubroute.startsWith('/recruiter/opportunities')) return 'Job Postings & Campus Drives';
    if (currentSubroute.startsWith('/recruiter/applications/')) return 'Application Detail & Pipeline Stage';
    if (currentSubroute.startsWith('/recruiter/applications')) return 'Candidate Applications Desk';
    if (currentSubroute.startsWith('/recruiter/candidates/')) return 'Candidate Talent Dossier';
    if (currentSubroute.startsWith('/recruiter/candidates')) return 'Pre-Screened RVU Candidates';
    if (currentSubroute.startsWith('/recruiter/shortlist')) return 'Shortlist Management & Bulk Actions';
    if (currentSubroute.startsWith('/recruiter/assessments/')) return 'Assessment Scores & Proctoring Audit';
    if (currentSubroute.startsWith('/recruiter/assessments')) return 'Online Coding & Aptitude Assessments';
    if (currentSubroute.startsWith('/recruiter/interviews/')) return 'Interview Evaluation & Feedback Form';
    if (currentSubroute.startsWith('/recruiter/interviews')) return 'Technical & HR Interview Schedule';
    if (currentSubroute.startsWith('/recruiter/drives/')) return 'Campus Drive Logistics & Funnel';
    if (currentSubroute.startsWith('/recruiter/drives')) return 'Institutional Campus Drives';
    if (currentSubroute.startsWith('/recruiter/offers/')) return 'Offer Verification & Terms Summary';
    if (currentSubroute.startsWith('/recruiter/offers')) return 'Offers & Final Selection';
    if (currentSubroute.startsWith('/recruiter/messages')) return 'CAR & Candidate Communications';
    if (currentSubroute.startsWith('/recruiter/notifications')) return 'Recruitment Activity Notifications';
    if (currentSubroute.startsWith('/recruiter/resources')) return 'University Placement Policy & Guides';
    if (currentSubroute.startsWith('/recruiter/company')) return 'Corporate Profile & Employer Branding';
    if (currentSubroute.startsWith('/recruiter/team')) return 'Recruiter Team Members & Permissions';
    if (currentSubroute.startsWith('/recruiter/analytics')) return 'Talent Pipeline & Conversion Analytics';
    if (currentSubroute.startsWith('/recruiter/profile')) return 'Recruiter Personal Profile';
    if (currentSubroute.startsWith('/recruiter/settings')) return 'Workspace & Notification Preferences';
    return 'Recruiter Workspace';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#101A22]/95 backdrop-blur-md border-b border-[#CCAA68]/20 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#20303A] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 font-medium hidden sm:inline">RVU Corporate Connect</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#CCAA68]/60 hidden sm:inline" />
          <span className="text-white font-semibold flex items-center gap-1.5 truncate">
            {getRouteLabel()}
          </span>
        </div>
      </div>

      {/* Right: Quick Search, Quick Action, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Search Bar (desktop) */}
        <div className="relative hidden md:block w-56 lg:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates, roles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#19252F] text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none placeholder-gray-400"
          />
        </div>

        {/* Quick Action: Post Opportunity */}
        <button
          onClick={() => onNavigate('/recruiter/opportunities/new')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post Opportunity</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#20303A] relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#CCAA68] text-[#101A22] font-bold text-[9px] flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#101A22] border border-[#CCAA68]/30 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-[#CCAA68]/20 flex items-center justify-between bg-[#19252F]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">Recruitment Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] bg-[#CCAA68]/20 text-[#D8B978] px-1.5 py-0.5 rounded font-mono">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={() => onMarkAllNotificationsRead()}
                    className="text-[10px] text-[#CCAA68] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#CCAA68]/10 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        if (notif.actionRoute) onNavigate(notif.actionRoute);
                        setIsNotifDropdownOpen(false);
                      }}
                      className={`p-3 text-xs cursor-pointer hover:bg-[#20303A] transition-colors ${
                        !notif.isRead ? 'bg-[#CCAA68]/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-white text-xs">{notif.title}</div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{notif.timestamp}</span>
                      </div>
                      <div className="text-gray-300 text-[11px] mt-1 line-clamp-2">
                        {notif.message}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-[#CCAA68]">
                        <span className="uppercase font-mono">{notif.type.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>Click to view details</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-[#CCAA68]/20 bg-[#19252F] text-center">
                <button
                  onClick={() => {
                    onNavigate('/recruiter/notifications');
                    setIsNotifDropdownOpen(false);
                  }}
                  className="text-xs text-[#CCAA68] hover:underline font-medium"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#20303A] transition-colors border border-transparent hover:border-[#CCAA68]/20"
          >
            <div className="w-8 h-8 rounded-full bg-[#CCAA68]/20 border border-[#CCAA68]/40 flex items-center justify-center text-[#D8B978] font-bold text-xs">
              {activeRecruiter?.name?.slice(0, 2).toUpperCase() || 'RD'}
            </div>
            <div className="text-left hidden xl:block min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {activeRecruiter?.name || 'Rohit Deshmukh'}
              </div>
              <div className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                <span>{recruiterRole.replace('_', ' ')}</span>
                <span className="text-[#CCAA68]">•</span>
                <span className="text-emerald-400">Verified</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#101A22] border border-[#CCAA68]/30 rounded-xl shadow-2xl overflow-hidden z-50 p-2 space-y-1">
              <div className="p-2 bg-[#20303A] rounded-lg border border-[#CCAA68]/20">
                <div className="text-xs font-semibold text-white">{activeRecruiter?.name}</div>
                <div className="text-[11px] text-gray-300">{activeRecruiter?.email}</div>
                <div className="text-[10px] text-[#CCAA68] mt-0.5">{activeRecruiter?.companyName}</div>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>CAR Authorized Recruiter</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('/recruiter/profile');
                  setIsProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-[#20303A] hover:text-white rounded-lg flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-[#CCAA68]" />
                <span>My Recruiter Profile</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('/recruiter/company');
                  setIsProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-[#20303A] hover:text-white rounded-lg flex items-center gap-2"
              >
                <Building2 className="w-3.5 h-3.5 text-[#CCAA68]" />
                <span>Company Overview</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('/recruiter/team');
                  setIsProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-[#20303A] hover:text-white rounded-lg flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CCAA68]" />
                <span>Recruiter Team & Permissions</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('/recruiter/messages');
                  setIsProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-[#20303A] hover:text-white rounded-lg flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#CCAA68]" />
                <span>Direct Contact CAR Office</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
