import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Check,
  School,
  Lock,
  Building2,
  Bell,
  Laptop,
  FileCheck2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import { useAuth } from '../../../context/AuthContext';

export type ManagementSettingsTab = 
  | 'policy'
  | 'security'
  | 'account'
  | 'notifications'
  | 'sessions'
  | 'audit';

interface SettingsViewProps {
  store: PlatformStoreState;
  initialTab?: string;
  onNavigate: (route: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  store,
  initialTab = 'policy',
  onNavigate: _onNavigate
}) => {
  const { user, sessions, terminateOtherSessions, changePassword } = useAuth();
  
  const validTabs: ManagementSettingsTab[] = ['policy', 'security', 'account', 'notifications', 'sessions', 'audit'];
  const [activeTab, setActiveTab] = useState<ManagementSettingsTab>(
    validTabs.includes(initialTab as ManagementSettingsTab) ? (initialTab as ManagementSettingsTab) : 'policy'
  );

  const [settings, setSettings] = useState({ ...store.policySettings });
  const [isSaved, setIsSaved] = useState(false);
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

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    store.updatePolicySettings(settings);
    setIsSaved(true);
    showToast('Placement policy rules saved and applied to active student pool.');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs: { id: ManagementSettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'policy', label: 'Policy & Eligibility', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'security', label: 'Login & Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'account', label: 'CAR Cell Account', icon: <Building2 className="w-4 h-4" /> },
    { id: 'notifications', label: 'Dispatches & Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'sessions', label: 'Active Sessions', icon: <Laptop className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit & Governance', icon: <FileCheck2 className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              CAR PLACEMENT GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Placement Cell Operations & Settings
          </h1>
          <p className="text-xs text-rvu-muted">
            Configure system-wide placement eligibility thresholds, dream offer multipliers, security credentials, and academic constraints.
          </p>
        </div>

        {isSaved && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Settings Saved & Applied</span>
          </div>
        )}
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
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
                  : 'bg-[#19252F] text-rvu-muted hover:text-white border border-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================= */}
      {/* 1. POLICY & ELIGIBILITY (Original Form Preserved) */}
      {/* ======================================================= */}
      {activeTab === 'policy' && (
        <form onSubmit={handleSavePolicy} className="space-y-6">
          {/* Core Eligibility Thresholds */}
          <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Academic Eligibility Baseline Rules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-rvu-muted mb-1">
                  Minimum CGPA for Placement Drive Registration
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={settings.minCgpaDefault}
                  onChange={(e) => setSettings({ ...settings, minCgpaDefault: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white font-mono focus:outline-none focus:border-gold"
                />
                <span className="text-[10px] text-rvu-subtle mt-1 block">
                  Students below this threshold are automatically flagged as INELIGIBLE.
                </span>
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">
                  Maximum Active Backlogs Permitted
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.maxBacklogsDefault}
                  onChange={(e) => setSettings({ ...settings, maxBacklogsDefault: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white font-mono focus:outline-none focus:border-gold"
                />
                <span className="text-[10px] text-rvu-subtle mt-1 block">
                  Standard RVU norm is 0 active backlogs at time of drive appearance.
                </span>
              </div>
            </div>
          </div>

          {/* One-Student-One-Job & Dream Multiplier */}
          <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
              <Settings className="w-4 h-4 text-gold" />
              <span>Placement Offer Rules & Restrictions</span>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-start gap-3 p-3 rounded-lg bg-[#142330] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.oneStudentOneJobRule}
                  onChange={(e) => setSettings({ ...settings, oneStudentOneJobRule: e.target.checked })}
                  className="mt-0.5 rounded text-gold focus:ring-gold bg-[#111C26] border-gold-border/40"
                />
                <div>
                  <span className="font-semibold text-white block">
                    Enforce One-Student-One-Job Policy
                  </span>
                  <span className="text-rvu-subtle text-[11px]">
                    Once a candidate has accepted a verified placement offer, they are excluded from applying to standard recruitment drives, unless the opportunity qualifies as a Dream Offer.
                  </span>
                </div>
              </label>

              {settings.oneStudentOneJobRule && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-rvu-muted mb-1">
                      Dream Job Multiplier (Minimum CTC ratio over existing offer)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="1.0"
                        max="5.0"
                        value={settings.dreamJobMultiplier}
                        onChange={(e) => setSettings({ ...settings, dreamJobMultiplier: parseFloat(e.target.value) || 1.5 })}
                        className="w-24 px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white font-mono focus:outline-none focus:border-gold"
                      />
                      <span className="text-xs font-mono text-gold font-bold">x Current CTC</span>
                    </div>
                    <span className="text-[10px] text-rvu-subtle mt-1 block">
                      Students may apply to a dream opportunity only if the offered CTC is &ge; {settings.dreamJobMultiplier}x their current verified offer.
                    </span>
                  </div>

                  <div>
                    <label className="block text-rvu-muted mb-1">
                      Offer Acceptance Window (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={settings.offerAcceptanceWindowDays}
                      onChange={(e) => setSettings({ ...settings, offerAcceptanceWindowDays: parseInt(e.target.value) || 3 })}
                      className="w-24 px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white font-mono focus:outline-none focus:border-gold"
                    />
                    <span className="text-[10px] text-rvu-subtle mt-1 block">
                      Default window provided to a selected student to accept or decline an offer before statutory forfeiture.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Official Schools Recognized */}
          <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
              <School className="w-4 h-4 text-gold" />
              <span>Official Academic Schools Enrolled in Career Hub ({settings.officialSchools.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
              {settings.officialSchools.map((school, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#142330] border border-white/5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="text-rvu-text truncate">{school}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-highlight text-navy-dark font-bold text-xs font-mono uppercase tracking-wider shadow-lg hover:shadow-gold/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply Policy Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================= */}
      {/* 2. LOGIN & SECURITY */}
      {/* ======================================================= */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-6 shadow-lg text-xs">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#CCAA68]" />
              <span>LOGIN & SECURITY</span>
            </h2>
            <p className="text-rvu-muted text-[11px] mt-0.5">
              Manage your placement cell administrator credentials and active console sessions.
            </p>
          </div>

          {/* ACCOUNT SECTION */}
          <div className="p-5 rounded-2xl bg-[#142330] border border-[#CCAA68]/30 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  ACCOUNT IDENTIFIER
                </h3>
                <p className="text-[11px] text-rvu-muted mt-0.5">
                  Your authorized placement administrator login identifier.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#CCAA68]/20 text-[#D8B978] text-[10px] font-mono font-bold">
                MANAGEMENT ACCOUNT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#111C26] border border-white/5 space-y-1">
                <span className="text-[10px] text-rvu-muted uppercase">User ID / Email</span>
                <div className="text-sm font-bold text-white break-all">
                  {user?.email || 'car.placement@rvu.edu.in'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#111C26] border border-white/5 space-y-1">
                <span className="text-[10px] text-rvu-muted uppercase">Administrative Role</span>
                <div className="text-sm font-bold text-[#D8B978]">
                  Central Placement Cell (CAR)
                </div>
              </div>
            </div>
          </div>

          {/* SECURITY SECTION: CHANGE PASSWORD */}
          <div className="p-5 rounded-2xl bg-[#142330] border border-white/5 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                SECURITY • CHANGE PASSWORD
              </h3>
              <p className="text-[11px] text-rvu-muted mt-0.5">
                Update your administrative login password. Passwords are never stored in plaintext.
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
                <label className="block text-[11px] font-mono text-rvu-muted uppercase font-bold mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111C26] border border-white/10 focus:border-[#CCAA68] text-white text-xs placeholder:text-gray-500 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-rvu-muted uppercase font-bold mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111C26] border border-white/10 focus:border-[#CCAA68] text-white text-xs placeholder:text-gray-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-rvu-muted uppercase font-bold mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111C26] border border-white/10 focus:border-[#CCAA68] text-white text-xs placeholder:text-gray-500 outline-none font-mono"
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
          <div className="p-5 rounded-2xl bg-[#142330] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Active Session & Security
                </h3>
                <p className="text-[11px] text-rvu-muted mt-0.5">
                  Your active placement console session.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold">
                ACTIVE NOW
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111C26] border border-white/5 space-y-1 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-white font-semibold">Administrator Console Session</span>
                <span className="text-[11px] text-[#D8B978]">Current Session</span>
              </div>
              <div className="text-[11px] text-rvu-muted font-mono">
                Account: {user?.email || 'car.placement@rvu.edu.in'} • Authenticated
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  terminateOtherSessions();
                  showToast('Signed out of other active sessions.');
                }}
                className="px-4 py-2 rounded-xl bg-[#111C26] hover:bg-[#182633] text-rvu-muted hover:text-white border border-white/10 text-xs font-mono transition-colors"
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
            <div className="p-4 rounded-xl bg-[#111C26] border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">Placement Cell Central Console</span>
                </div>
                <span className="text-[10px] font-mono text-[#D8B978]">Verified</span>
              </div>
              <div className="text-rvu-muted text-[11px] font-mono">
                Supervisory Clearance: Level-1 Admin • Bengaluru Campus, Karnataka
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 3. CAR CELL ACCOUNT */}
      {/* ======================================================= */}
      {activeTab === 'account' && (
        <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-4 shadow-lg text-xs">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#CCAA68]" />
              <span>Office of Corporate & Alumni Relations (CAR)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#142330] space-y-1">
              <span className="text-[10px] text-rvu-muted uppercase">Institutional Department</span>
              <div className="font-bold text-white">Central Placement & Career Advancement Cell</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#142330] space-y-1">
              <span className="text-[10px] text-rvu-muted uppercase">Statutory Authority</span>
              <div className="font-bold text-[#D8B978]">RV University Board of Career Services</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 4. DISPATCHES & ALERTS */}
      {/* ======================================================= */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-4 shadow-lg text-xs">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#CCAA68]" />
              <span>Central Administrative Dispatches</span>
            </h2>
          </div>
          <p className="text-rvu-muted">
            Configure automated broadcast alerts sent to eligible student cohorts and verified corporate recruiters.
          </p>
          <div className="p-4 rounded-xl bg-[#142330] text-rvu-muted">
            Automated notifications are enabled for: Placement Drive Windows, Eligibility Status Overrides, Offer Letter Verifications, and Statutary Audit Logs.
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 5. ACTIVE SESSIONS */}
      {/* ======================================================= */}
      {activeTab === 'sessions' && (
        <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-4 shadow-lg text-xs">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#CCAA68]" />
              <span>Active Supervisory Sessions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="p-3.5 rounded-xl bg-[#142330] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{s.device}</div>
                  <div className="text-[11px] text-rvu-muted">{s.browser} • {s.location}</div>
                </div>
                {s.current ? (
                  <span className="text-emerald-400 text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                    Current Device
                  </span>
                ) : (
                  <span className="text-rvu-muted text-[10px] font-mono">Last: {s.lastActive}</span>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              terminateOtherSessions();
              showToast('All other administrator sessions terminated.');
            }}
            className="px-4 py-2 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase font-mono"
          >
            TERMINATE OTHER SESSIONS
          </button>
        </div>
      )}

      {/* ======================================================= */}
      {/* 6. AUDIT & GOVERNANCE */}
      {/* ======================================================= */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-4 shadow-lg text-xs">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#CCAA68]" />
              <span>Statutory Placement Compliance & Audit</span>
            </h2>
          </div>
          <p className="text-rvu-muted">
            All administrative actions, policy overrides, and offer acceptances are timestamped and logged in accordance with the RV University Placement Regulatory Framework.
          </p>
          <div className="p-4 rounded-xl bg-[#142330] border border-white/5 font-mono text-[11px] space-y-1">
            <div>Compliance Standard: <span className="text-white">RVU Statutory CAR-2026</span></div>
            <div>Retention Period: <span className="text-white">7 Academic Years</span></div>
            <div>Audit Trail: <span className="text-emerald-400">Immutable Cryptographic Log Active</span></div>
          </div>
        </div>
      )}

    </div>
  );
};
