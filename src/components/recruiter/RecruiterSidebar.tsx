import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  Users,
  CheckSquare,
  Code2,
  Calendar,
  Building,
  Award,
  MessageSquare,
  Bell,
  BookOpen,
  Building2,
  UserCheck,
  BarChart3,
  User,
  Settings,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  X,
  ChevronDown,
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
  interviewsCount: number;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
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
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({
  currentSubroute,
  activeRecruiter,
  allRecruiters,
  recruiterRole,
  onSelectRecruiter,
  onRoleChange,
  applicationsCount,
  candidatesCount,
  interviewsCount,
  unreadMessagesCount,
  unreadNotificationsCount,
  onNavigate,
  onBackToPublic,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const [showSignOutModal, setShowSignOutModal] = React.useState(false);
  const { user, logout } = useAuth();
  const [isSwitcherOpen, setIsSwitcherOpen] = React.useState(false);

  const navSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        {
          label: 'Dashboard',
          route: '/recruiter',
          icon: <LayoutDashboard className="w-4 h-4" />,
          exact: true
        },
        {
          label: 'Opportunities',
          route: '/recruiter/opportunities',
          icon: <Briefcase className="w-4 h-4" />
        },
        {
          label: 'Post Opportunity',
          route: '/recruiter/opportunities/new',
          icon: <PlusCircle className="w-4 h-4" />,
          highlight: true
        }
      ]
    },
    {
      title: 'Hiring Pipeline',
      items: [
        {
          label: 'Applications',
          route: '/recruiter/applications',
          icon: <FileText className="w-4 h-4" />,
          badge: applicationsCount > 0 ? applicationsCount : undefined,
          badgeColor: 'bg-[#CCAA68]/20 text-[#D8B978] border border-[#CCAA68]/30'
        },
        {
          label: 'Candidate Directory',
          route: '/recruiter/candidates',
          icon: <Users className="w-4 h-4" />,
          badge: candidatesCount > 0 ? candidatesCount : undefined,
          badgeColor: 'bg-white/10 text-white border border-white/20'
        },
        {
          label: 'Shortlist',
          route: '/recruiter/shortlist',
          icon: <CheckSquare className="w-4 h-4" />
        },
        {
          label: 'Assessments',
          route: '/recruiter/assessments',
          icon: <Code2 className="w-4 h-4" />
        },
        {
          label: 'Interviews & Evals',
          route: '/recruiter/interviews',
          icon: <Calendar className="w-4 h-4" />,
          badge: interviewsCount > 0 ? interviewsCount : undefined,
          badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        },
        {
          label: 'Campus Drives',
          route: '/recruiter/drives',
          icon: <Building className="w-4 h-4" />
        },
        {
          label: 'Offers',
          route: '/recruiter/offers',
          icon: <Award className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Collaboration',
      items: [
        {
          label: 'Messages',
          route: '/recruiter/messages',
          icon: <MessageSquare className="w-4 h-4" />,
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        },
        {
          label: 'Notifications',
          route: '/recruiter/notifications',
          icon: <Bell className="w-4 h-4" />,
          badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
          badgeColor: 'bg-[#CCAA68] text-[#101A22] font-semibold'
        },
        {
          label: 'RVU Policy & Guides',
          route: '/recruiter/resources',
          icon: <BookOpen className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Company & Admin',
      items: [
        {
          label: 'Company Profile',
          route: '/recruiter/company',
          icon: <Building2 className="w-4 h-4" />
        },
        {
          label: 'Recruitment Team',
          route: '/recruiter/team',
          icon: <UserCheck className="w-4 h-4" />
        },
        {
          label: 'Talent Analytics',
          route: '/recruiter/analytics',
          icon: <BarChart3 className="w-4 h-4" />
        },
        {
          label: 'My Profile',
          route: '/recruiter/profile',
          icon: <User className="w-4 h-4" />
        },
        {
          label: 'Settings',
          route: '/recruiter/settings',
          icon: <Settings className="w-4 h-4" />
        }
      ]
    }
  ];

  const isItemActive = (item: NavItem) => {
    if (item.exact) {
      return currentSubroute === item.route;
    }
    return currentSubroute.startsWith(item.route);
  };

  const handleItemClick = (route: string) => {
    onNavigate(route);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#101A22] border-r border-[#CCAA68]/20 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#CCAA68]/15 bg-[#19252F]/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#CCAA68]/15 border border-[#CCAA68]/40 flex items-center justify-center text-[#CCAA68] font-serif font-bold text-lg shadow-sm">
                RV
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold tracking-wider text-white uppercase">
                    RV University
                  </span>
                  <span className="text-[10px] bg-[#CCAA68]/20 text-[#D8B978] px-1.5 py-0.2 rounded border border-[#CCAA68]/30 font-mono">
                    PORTAL
                  </span>
                </div>
                <div className="text-sm font-semibold tracking-tight text-[#CCAA68]">
                  CORPORATE CONNECT
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mt-2 text-[10px] text-gray-400 italic flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCAA68]"></span>
            <span>"{RVU_BRAND.tagline}"</span>
          </div>

          {/* Active Company & Verified Badge */}
          <div className="mt-3 p-2.5 rounded-lg bg-[#20303A]/90 border border-[#CCAA68]/20 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded bg-[#101A22] border border-[#CCAA68]/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                <Building2 className="w-4 h-4 text-[#CCAA68]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {activeRecruiter?.companyName || 'TechnoSphere Systems'}
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  {activeRecruiter?.name || 'Rohit Deshmukh'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>CAR Verified</span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 custom-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item, itemIdx) => {
                  const active = isItemActive(item);
                  return (
                    <button
                      key={itemIdx}
                      onClick={() => handleItemClick(item.route)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        active
                          ? 'bg-[#CCAA68] text-[#101A22] font-semibold shadow-md shadow-[#CCAA68]/15'
                          : item.highlight
                          ? 'text-[#D8B978] hover:bg-[#CCAA68]/10 hover:text-white border border-[#CCAA68]/30'
                          : 'text-gray-300 hover:bg-[#20303A] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={active ? 'text-[#101A22]' : item.highlight ? 'text-[#CCAA68]' : 'text-gray-400'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                            item.badgeColor || (active ? 'bg-[#101A22] text-[#CCAA68]' : 'bg-[#20303A] text-gray-300')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Recruiter Switcher & Quick Navigation */}
        <div className="p-3 border-t border-[#CCAA68]/20 bg-[#19252F] space-y-2">
          {/* Simulated Recruiter Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-[#20303A] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 text-left transition-all"
            >
              <div className="min-w-0">
                <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                  Active Recruiter
                </div>
                <div className="text-xs font-medium text-white truncate">
                  {activeRecruiter?.name || 'Recruiter'}
                </div>
                <div className="text-[10px] text-[#CCAA68] truncate">
                  {recruiterRole.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-1" />
            </button>

            {isSwitcherOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#101A22] border border-[#CCAA68]/30 rounded-lg shadow-xl overflow-hidden z-50 p-1.5 space-y-1">
                <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase">
                  Switch Recruiter Account
                </div>
                {allRecruiters.map(rec => (
                  <button
                    key={rec.id}
                    onClick={() => {
                      onSelectRecruiter(rec.id);
                      setIsSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      rec.id === activeRecruiter?.id
                        ? 'bg-[#CCAA68]/20 text-[#D8B978] font-semibold'
                        : 'text-gray-300 hover:bg-[#20303A] hover:text-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{rec.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{rec.companyName}</div>
                    </div>
                    <span className="text-[9px] px-1 rounded bg-[#20303A] text-gray-300 font-mono ml-1">
                      {rec.role || 'ADMIN'}
                    </span>
                  </button>
                ))}

                <div className="border-t border-[#CCAA68]/20 pt-1 mt-1">
                  <div className="px-2 py-0.5 text-[9px] text-gray-400">
                    Switch Active Role:
                  </div>
                  <div className="grid grid-cols-2 gap-1 px-1 pt-1">
                    {(['COMPANY_ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'INTERVIEWER'] as RecruiterRole[]).map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          onRoleChange(role);
                          setIsSwitcherOpen(false);
                        }}
                        className={`text-[9px] py-1 px-1.5 rounded font-mono truncate text-center ${
                          recruiterRole === role
                            ? 'bg-[#CCAA68] text-[#101A22] font-semibold'
                            : 'bg-[#20303A] text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {role.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Portal Switchers */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => onNavigate('/student')}
              className="flex items-center justify-center gap-1.5 p-1.5 rounded bg-[#20303A] hover:bg-[#20303A]/80 text-[10px] text-gray-300 hover:text-white border border-[#CCAA68]/15"
              title="Switch to Student Portal"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#CCAA68]" />
              <span>Student</span>
            </button>
            <button
              onClick={() => onNavigate('/management')}
              className="flex items-center justify-center gap-1.5 p-1.5 rounded bg-[#20303A] hover:bg-[#20303A]/80 text-[10px] text-gray-300 hover:text-white border border-[#CCAA68]/15"
              title="Switch to Placement Command Center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#CCAA68]" />
              <span>CAR Admin</span>
            </button>
          </div>

          <button
            onClick={onBackToPublic}
            className="w-full flex items-center justify-center gap-2 p-1.5 rounded text-[11px] text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
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
      </aside>

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmDialog
        isOpen={showSignOutModal}
        userEmail={user?.email || activeRecruiter?.email}
        onCancel={() => setShowSignOutModal(false)}
        onConfirm={() => {
          setShowSignOutModal(false);
          logout();
          onNavigate('/');
        }}
      />
    </>
  );
};
