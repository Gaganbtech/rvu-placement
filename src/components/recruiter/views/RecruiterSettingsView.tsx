import React, { useState } from 'react';
import {
  Settings,
  Bell,
  CheckCircle2,
  Lock,
  Building2,
  User,
  Users,
  Laptop,
  LifeBuoy,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import { useAuth } from '../../../context/AuthContext';

export type RecruiterSettingsTab = 
  | 'company'
  | 'profile'
  | 'security'
  | 'notifications'
  | 'preferences'
  | 'team'
  | 'sessions'
  | 'support';

interface RecruiterSettingsViewProps {
  store: PlatformStoreState;
  initialTab?: string;
  onNavigate?: (route: string) => void;
}

export const RecruiterSettingsView: React.FC<RecruiterSettingsViewProps> = ({
  store,
  initialTab = 'security',
  onNavigate
}) => {
  const { user, sessions, terminateOtherSessions, changePassword } = useAuth();
  const activeRecruiter = store.activeRecruiter;

  const validTabs: RecruiterSettingsTab[] = [
    'company', 'profile', 'security', 'notifications', 'preferences', 'team', 'sessions', 'support'
  ];
  const [activeTab, setActiveTab] = useState<RecruiterSettingsTab>(
    validTabs.includes(initialTab as RecruiterSettingsTab) ? (initialTab as RecruiterSettingsTab) : 'security'
  );

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPasswordMsg({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setPasswordUpdating(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Password updated successfully.');
      } else {
        setPasswordMsg({ type: 'error', text: res.message || 'Failed to update password.' });
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Failed to update password.' });
    } finally {
      setPasswordUpdating(false);
    }
  };

  // 1. Notifications State
  const [notifyApplications, setNotifyApplications] = useState(true);
  const [notifyCarApprovals, setNotifyCarApprovals] = useState(true);
  const [notifyAssessmentScores, setNotifyAssessmentScores] = useState(true);
  const [notifyInterviewReminders, setNotifyInterviewReminders] = useState(true);

  // 2. Preferences State
  const [defaultPlatform, setDefaultPlatform] = useState('HackerRank Proctored');
  const [defaultInterviewMode, setDefaultInterviewMode] = useState('In-person');

  const tabs: { id: RecruiterSettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'security', label: 'Login & Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'company', label: 'Company Account', icon: <Building2 className="w-4 h-4" /> },
    { id: 'profile', label: 'Recruiter Profile', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'preferences', label: 'Recruitment Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'team', label: 'Team & Permissions', icon: <Users className="w-4 h-4" /> },
    { id: 'sessions', label: 'Active Sessions', icon: <Laptop className="w-4 h-4" /> },
    { id: 'support', label: 'CAR Support Liaison', icon: <LifeBuoy className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
          <span>Recruiter Workspace</span>
          <span>•</span>
          <span className="text-[#CCAA68] font-bold">Settings & Security</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Recruitment Workspace Settings
        </h1>
        <p className="text-xs text-gray-400">
          Configure security credentials, notification channels, default test platforms, and team access.
        </p>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 custom-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#CCAA68] text-[#101A22] font-bold shadow-md'
                  : 'bg-[#19252F] text-gray-300 hover:text-white border border-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel Content */}
      <div className="bg-[#19252F] rounded-2xl border border-[#CCAA68]/20 p-6 shadow-xl space-y-6 text-xs">
        
        {/* ==================== 1. LOGIN & SECURITY ==================== */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#CCAA68]" />
                <span>LOGIN & SECURITY</span>
              </h2>
              <p className="text-gray-400 text-[11px] mt-0.5">
                Manage your recruiter corporate account credentials and active device sessions.
              </p>
            </div>

            {/* ACCOUNT SECTION */}
            <div className="p-5 rounded-2xl bg-[#20303A] border border-[#CCAA68]/30 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    ACCOUNT IDENTIFIER
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Your authorized recruiter login and communication identifier.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#CCAA68]/20 text-[#D8B978] text-[10px] font-mono font-bold">
                  RECRUITER ACCOUNT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#101A22] border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase">User ID / Email</span>
                  <div className="text-sm font-bold text-white break-all">
                    {user?.email || activeRecruiter?.email || 'recruiter@company.com'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#101A22] border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase">Company Entity</span>
                  <div className="text-sm font-bold text-[#D8B978]">
                    {activeRecruiter?.companyName || 'Corporate Partner'}
                  </div>
                </div>
              </div>
            </div>

            {/* SECURITY SECTION: CHANGE PASSWORD */}
            <div className="p-5 rounded-2xl bg-[#20303A] border border-white/5 space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  SECURITY • CHANGE PASSWORD
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Update your recruiter login password. Passwords are never stored in plaintext.
                </p>
              </div>

              {passwordMsg && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}>
                  {passwordMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-3.5 text-xs max-w-lg">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase font-bold mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101A22] border border-white/10 focus:border-[#CCAA68] text-white text-xs placeholder:text-gray-500 outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase font-bold mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#101A22] border border-white/10 focus:border-[#CCAA68] text-white text-xs placeholder:text-gray-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase font-bold mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#101A22] border border-white/10 focus:border-[#CCAA68] text-white text-xs placeholder:text-gray-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordUpdating}
                    className="px-5 py-2.5 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] active:bg-[#B8924E] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {passwordUpdating ? 'UPDATING...' : 'UPDATE PASSWORD'}
                  </button>
                </div>
              </form>
            </div>

            {/* Active Session Card */}
            <div className="p-5 rounded-2xl bg-[#20303A] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Active Session & Security
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Your active recruiter workstation session.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold">
                  ACTIVE NOW
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101A22] border border-white/5 space-y-1 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-white font-semibold">Web Browser Session</span>
                  <span className="text-[11px] text-[#D8B978]">Current Session</span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono">
                  Account: {user?.email || activeRecruiter?.email} • Authenticated
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    terminateOtherSessions();
                    showToast('Signed out of other active sessions.');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#101A22] hover:bg-[#14202a] text-gray-300 hover:text-white border border-white/10 text-xs font-mono transition-colors"
                >
                  Sign Out Other Sessions
                </button>
              </div>
            </div>

            {/* Login Activity */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Current Session & Security Activity
              </h3>
              <div className="p-4 rounded-xl bg-[#101A22] border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">Recruiter Workstation</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#D8B978]">Verified</span>
                </div>
                <div className="text-gray-400 text-[11px] font-mono">
                  Session Type: Real-time Single Sign-on • Bengaluru, Karnataka
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. COMPANY ACCOUNT ==================== */}
        {activeTab === 'company' && (
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#CCAA68]" />
                <span>Company Account Details</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#20303A] space-y-1">
                <span className="text-[10px] text-gray-400 uppercase">Registered Corporate Entity</span>
                <div className="font-bold text-white text-sm">{activeRecruiter?.companyName || user?.companyName || 'Corporate Partner'}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#20303A] space-y-1">
                <span className="text-[10px] text-gray-400 uppercase">CAR Partnership Status</span>
                <div className="font-bold text-emerald-400 text-sm">Tier-1 Strategic Corporate Partner</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate?.('/recruiter/company')}
              className="px-4 py-2 rounded-xl bg-[#20303A] hover:bg-[#101A22] text-[#D8B978] border border-[#CCAA68]/30 text-xs font-mono"
            >
              Open Full Company Profile →
            </button>
          </div>
        )}

        {/* ==================== 3. PROFILE ==================== */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#CCAA68]" />
                <span>Lead Recruiter Identity</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#20303A] space-y-1">
                <span className="text-[10px] text-gray-400 uppercase">Recruiter Full Name</span>
                <div className="font-bold text-white">{activeRecruiter?.name || 'Rohit Deshmukh'}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#20303A] space-y-1">
                <span className="text-[10px] text-gray-400 uppercase">Official Email</span>
                <div className="font-bold text-[#D8B978] font-mono">{activeRecruiter?.email}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate?.('/recruiter/profile')}
              className="px-4 py-2 rounded-xl bg-[#20303A] hover:bg-[#101A22] text-[#D8B978] border border-[#CCAA68]/30 text-xs font-mono"
            >
              Edit Recruiter Profile Dossier →
            </button>
          </div>
        )}

        {/* ==================== 4. NOTIFICATIONS ==================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#CCAA68]" />
                <span>Real-Time Alert Channels</span>
              </h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg bg-[#20303A] cursor-pointer">
                <div>
                  <div className="font-semibold text-white">New Candidate Applications</div>
                  <div className="text-[11px] text-gray-400">Receive alerts when pre-screened RVU students apply</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyApplications}
                  onChange={e => setNotifyApplications(e.target.checked)}
                  className="w-4 h-4 accent-[#CCAA68]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[#20303A] cursor-pointer">
                <div>
                  <div className="font-semibold text-white">CAR Institutional Approval Updates</div>
                  <div className="text-[11px] text-gray-400">Notifications when opportunities or drive venues are verified by CAR</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyCarApprovals}
                  onChange={e => setNotifyCarApprovals(e.target.checked)}
                  className="w-4 h-4 accent-[#CCAA68]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[#20303A] cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Assessment Submission Alerts</div>
                  <div className="text-[11px] text-gray-400">Alerts when candidates complete proctored coding challenges</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyAssessmentScores}
                  onChange={e => setNotifyAssessmentScores(e.target.checked)}
                  className="w-4 h-4 accent-[#CCAA68]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[#20303A] cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Interview Schedule Reminders</div>
                  <div className="text-[11px] text-gray-400">1-hour reminders before candidate interview slots commence</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyInterviewReminders}
                  onChange={e => setNotifyInterviewReminders(e.target.checked)}
                  className="w-4 h-4 accent-[#CCAA68]"
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => showToast('Notification preferences saved.')}
                className="px-4 py-2 rounded-xl bg-[#CCAA68] text-[#101A22] font-bold text-xs uppercase"
              >
                SAVE NOTIFICATIONS
              </button>
            </div>
          </div>
        )}

        {/* ==================== 5. RECRUITMENT PREFERENCES ==================== */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#CCAA68]" />
                <span>Technical Assessment & Interview Norms</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Default Coding Assessment Platform</label>
                <select
                  value={defaultPlatform}
                  onChange={e => setDefaultPlatform(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#20303A] text-white border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                >
                  <option value="HackerRank Proctored">HackerRank Proctored</option>
                  <option value="LeetCode Assessment">LeetCode Assessment</option>
                  <option value="Codility Screen">Codility Screen</option>
                  <option value="Internal Company Platform">Internal Company Platform</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Default Interview Venue Format</label>
                <select
                  value={defaultInterviewMode}
                  onChange={e => setDefaultInterviewMode(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#20303A] text-white border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                >
                  <option value="In-person">In-person (RVU Campus CAR Suites)</option>
                  <option value="Virtual">Virtual (Microsoft Teams / Zoom)</option>
                  <option value="Hybrid">Hybrid Assessment</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => showToast('Recruitment defaults saved.')}
                className="px-4 py-2 rounded-xl bg-[#CCAA68] text-[#101A22] font-bold text-xs uppercase"
              >
                SAVE DEFAULTS
              </button>
            </div>
          </div>
        )}

        {/* ==================== 6. TEAM & PERMISSIONS ==================== */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#CCAA68]" />
                <span>Recruiter Team & Permissions</span>
              </h2>
            </div>
            <p className="text-gray-400">
              Manage hiring managers, technical interview panelists, and role delegation for this corporate account.
            </p>
            <button
              type="button"
              onClick={() => onNavigate?.('/recruiter/team')}
              className="px-4 py-2 rounded-xl bg-[#20303A] text-[#D8B978] border border-[#CCAA68]/30 text-xs font-mono"
            >
              Open Team Management Panel →
            </button>
          </div>
        )}

        {/* ==================== 7. SESSIONS ==================== */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#CCAA68]" />
                <span>Active Recruiter Sessions</span>
              </h2>
            </div>

            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl bg-[#20303A] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{s.device}</div>
                    <div className="text-[11px] text-gray-400">{s.browser} • {s.location}</div>
                  </div>
                  {s.current ? (
                    <span className="text-emerald-400 text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                      Current Session
                    </span>
                  ) : (
                    <span className="text-gray-400 text-[10px] font-mono">Last: {s.lastActive}</span>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                terminateOtherSessions();
                showToast('Terminated other active sessions.');
              }}
              className="px-4 py-2 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase"
            >
              SIGN OUT ALL OTHER SESSIONS
            </button>
          </div>
        )}

        {/* ==================== 8. SUPPORT ==================== */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-[#CCAA68]" />
                <span>CAR Placement Support Liaison</span>
              </h2>
            </div>
            <p className="text-gray-400">
              Need assistance with campus auditorium bookings, catering, or interview suites? Contact the dedicated CAR corporate relationship desk.
            </p>
            <div className="p-4 rounded-xl bg-[#20303A] text-gray-300 space-y-1">
              <div className="font-semibold text-white">Central Placement Office (CAR)</div>
              <div>Email: <a href="mailto:car.placement@rvu.edu.in" className="text-[#D8B978] underline">car.placement@rvu.edu.in</a></div>
              <div>Direct Phone: +91 80 6717 8000 (Ext. 204)</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
