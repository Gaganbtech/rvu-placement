import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Sparkles, 
  Lock, 
  Palette, 
  Laptop, 
  Link2, 
  LifeBuoy, 
  AlertTriangle,
  CheckCircle2,
  Save,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import type { Student } from '../../../data/platform/types';
import { useAuth } from '../../../context/AuthContext';

export type StudentSettingsTab = 
  | 'account' 
  | 'profile' 
  | 'security' 
  | 'notifications' 
  | 'career' 
  | 'privacy' 
  | 'appearance' 
  | 'sessions' 
  | 'connections' 
  | 'danger'
  | 'support';

interface StudentSettingsViewProps {
  student: Student;
  currentTab?: StudentSettingsTab;
  onNavigateTab: (tab: StudentSettingsTab) => void;
  onUpdateStudentProfile: (updates: Partial<Student>) => void;
  onNavigate: (route: string) => void;
}

export const StudentSettingsView: React.FC<StudentSettingsViewProps> = ({
  student,
  currentTab = 'account',
  onNavigateTab,
  onUpdateStudentProfile,
  onNavigate
}) => {
  const { 
    user, 
    preferences, 
    updatePreferences, 
    sessions, 
    terminateOtherSessions, 
    logout,
    changePassword 
  } = useAuth();

  // Active Tab state
  const activeTab: StudentSettingsTab = currentTab || 'account';

  // Toast / feedback notifications
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Security / Password change state
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
        showToast('Password updated successfully.', 'success');
      } else {
        setPasswordMsg({ type: 'error', text: res.message || 'Failed to update password.' });
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Failed to update password.' });
    } finally {
      setPasswordUpdating(false);
    }
  };

  // --- 1. PROFILE STATE & DIRTY CHECK ---
  const [profileName, setProfileName] = useState(student.name || '');
  const [profilePhone, setProfilePhone] = useState(student.phone || '+91 98860 12345');
  const [profileBio, setProfileBio] = useState(student.specialization || 'Artificial Intelligence & Distributed Systems');
  const [profileSkills, setProfileSkills] = useState((student.skills?.map(s => s.name) || ['Python', 'TypeScript', 'Data Structures', 'Machine Learning']).join(', '));
  const [profileInterests, setProfileInterests] = useState((student.careerPreferences?.preferredRoles || ['AI/ML Engineer', 'Cloud Architect']).join(', '));
  const [profileLinkedIn, setProfileLinkedIn] = useState('https://linkedin.com/in/aarav-sharma-rvu');
  const [profileGitHub, setProfileGitHub] = useState('https://github.com/aarav-rvu');
  const [profilePortfolio, setProfilePortfolio] = useState('https://aarav-sharma.dev');
  const [profileDirty, setProfileDirty] = useState(false);

  // Unsaved changes modal state
  const [pendingTabSwitch, setPendingTabSwitch] = useState<StudentSettingsTab | null>(null);

  const handleTabClick = (tab: StudentSettingsTab) => {
    if (profileDirty && activeTab === 'profile' && tab !== 'profile') {
      setPendingTabSwitch(tab);
      return;
    }
    onNavigateTab(tab);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSkills = profileSkills.split(',').map((s: string, idx: number) => ({
      id: `sk-custom-${idx}`,
      name: s.trim(),
      level: 'Intermediate' as const,
      category: 'Core Technical' as const,
      isVerified: true
    })).filter(s => s.name);

    onUpdateStudentProfile({
      name: profileName,
      phone: profilePhone,
      specialization: profileBio,
      skills: updatedSkills,
      careerPreferences: {
        preferredRoles: profileInterests.split(',').map((s: string) => s.trim()).filter(Boolean),
        preferredLocations: student.careerPreferences?.preferredLocations || ['Bengaluru'],
        workMode: student.careerPreferences?.workMode || ['On-site', 'Hybrid'],
        expectedCTCMinLPA: student.careerPreferences?.expectedCTCMinLPA || 12
      }
    });
    setProfileDirty(false);
    showToast('Changes saved successfully.');
  };



  // --- 3. NOTIFICATIONS PREFERENCES STATE ---
  const [notifState, setNotifState] = useState(preferences.notifications);

  const handleSaveNotifications = () => {
    updatePreferences({ notifications: notifState });
    showToast('Your notification preferences have been saved.');
  };

  // --- 4. CAREER PREFERENCES STATE ---
  const [careerPrefs, setCareerPrefs] = useState(preferences.careerPreferences);
  const [newRoleInput, setNewRoleInput] = useState('');

  const handleSaveCareer = () => {
    updatePreferences({ careerPreferences: careerPrefs });
    showToast('Career preferences saved. Opportunity recommendations updated.');
  };

  // --- 5. PRIVACY PREFERENCES STATE ---
  const [privacyPrefs, setPrivacyPrefs] = useState(preferences.privacySettings);

  const handleSavePrivacy = () => {
    updatePreferences({ privacySettings: privacyPrefs });
    showToast('Privacy preferences updated successfully.');
  };

  // --- 6. APPEARANCE STATE ---
  const [appearanceTheme, setAppearanceTheme] = useState(preferences.theme);
  const [reducedMotion, setReducedMotion] = useState(preferences.reducedMotion);
  const [density, setDensity] = useState(preferences.density);

  const handleSaveAppearance = () => {
    updatePreferences({
      theme: appearanceTheme,
      reducedMotion,
      density
    });
    showToast('Appearance settings saved.');
  };

  // --- 7. DANGER ZONE CONFIRMATION ---
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  // Nav Groups definition for sidebar
  const navGroups: {
    groupName: string;
    items: { id: StudentSettingsTab; label: string; icon: React.ReactNode }[];
  }[] = [
    {
      groupName: 'ACCOUNT',
      items: [
        { id: 'account', label: 'Account Information', icon: <User className="w-4 h-4" /> },
        { id: 'profile', label: 'Profile Dossier', icon: <Sparkles className="w-4 h-4" /> }
      ]
    },
    {
      groupName: 'SECURITY',
      items: [
        { id: 'security', label: 'Password & Security', icon: <Lock className="w-4 h-4" /> },
        { id: 'sessions', label: 'Active Sessions', icon: <Laptop className="w-4 h-4" /> }
      ]
    },
    {
      groupName: 'PREFERENCES',
      items: [
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
        { id: 'career', label: 'Career Preferences', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> }
      ]
    },
    {
      groupName: 'PRIVACY',
      items: [
        { id: 'privacy', label: 'Privacy & Visibility', icon: <ShieldCheck className="w-4 h-4" /> },
        { id: 'connections', label: 'Connected Services', icon: <Link2 className="w-4 h-4" /> }
      ]
    },
    {
      groupName: 'SUPPORT & SAFETY',
      items: [
        { id: 'support', label: 'Help & Support', icon: <LifeBuoy className="w-4 h-4" /> },
        { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-border/30 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#AEB7BC] uppercase tracking-wider mb-1">
            <span>Career Hub</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#CCAA68]" />
            <span className="text-white font-bold">Settings</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#CCAA68]" />
            <span className="text-[#D8B978] font-bold capitalize">{activeTab}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            SETTINGS
          </h1>
          <p className="text-xs text-[#AEB7BC]">
            Manage your account, preferences and career workspace.
          </p>
        </div>

        {/* Quick Back to Profile CTA */}
        <button
          onClick={() => onNavigate('/student/profile')}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/30 hover:border-[#CCAA68] text-xs font-mono text-[#D8B978] hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-xl animate-in slide-in-from-top-2 duration-200 border ${
          toastMsg.type === 'success' 
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40' 
            : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg.text}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-white/60 hover:text-white text-[11px] ml-4 font-mono">
            Dismiss
          </button>
        </div>
      )}

      {/* Mobile Horizontal Tabs Switcher */}
      <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4 flex gap-1.5 border-b border-white/10 custom-scrollbar">
        {navGroups.flatMap(g => g.items).map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === item.id
                ? 'bg-[#CCAA68] text-[#101A22] font-bold shadow-md'
                : 'bg-[#19252F] text-[#AEB7BC] hover:text-white border border-white/5'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Settings Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: Settings Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 bg-[#19252F]/90 rounded-2xl border border-gold-border/30 p-4 space-y-5 shadow-xl backdrop-blur-md sticky top-24">
          {navGroups.map((group) => (
            <div key={group.groupName} className="space-y-1">
              <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#AEB7BC] font-semibold">
                {group.groupName}
              </div>
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-[#CCAA68]/20 text-[#D8B978] border border-[#CCAA68]/50 font-bold shadow-sm'
                        : 'text-[#AEB7BC] hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#CCAA68]' : 'text-[#AEB7BC]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#CCAA68]" />}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Quick Security Badge */}
          <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-[#AEB7BC] flex items-center gap-2 px-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>SIS Identity Verified</span>
          </div>
        </aside>

        {/* RIGHT COLUMN: Selected Settings Panel */}
        <section className="lg:col-span-8 bg-[#20303A]/90 rounded-2xl border border-gold-border/40 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-md">
          
          {/* ======================================================= */}
          {/* 1. ACCOUNT INFORMATION */}
          {/* ======================================================= */}
          {activeTab === 'account' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-display">
                  Account Information
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Official institutional identity managed by RV University Student Information System (SIS).
                </p>
              </div>

              {/* Institutional Email Banner */}
              <div className="p-4 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#CCAA68]/15 border border-[#CCAA68]/30 flex items-center justify-center text-[#CCAA68] shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">
                    RVU Institutional Email
                  </div>
                  <div className="text-xs font-mono text-[#D8B978]">
                    {student.email || user?.email}
                  </div>
                  <p className="text-[11px] text-[#AEB7BC] pt-1">
                    Your institutional email is managed by RV University. This address is used for verified campus placement drives and cannot be changed here.
                  </p>
                </div>
              </div>

              {/* Read-Only Academic Master Record */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#19252F] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#AEB7BC] uppercase">Student Full Name</span>
                  <div className="text-white font-bold text-sm">{student.name}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#19252F] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#AEB7BC] uppercase">Student ID / USN</span>
                  <div className="text-[#D8B978] font-bold text-sm">{student.id}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#19252F] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#AEB7BC] uppercase">Academic School</span>
                  <div className="text-white">{student.school}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#19252F] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#AEB7BC] uppercase">Enrolled Programme</span>
                  <div className="text-white">{student.programme}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#19252F] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#AEB7BC] uppercase">Academic Year / Semester</span>
                  <div className="text-white">{student.academicYear || '3rd Year (Semester VI)'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#19252F] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#AEB7BC] uppercase">Graduation Batch Year</span>
                  <div className="text-emerald-400 font-bold">{student.graduationYear || 2027}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101A22]/60 border border-white/5 text-[11px] text-[#AEB7BC] flex items-center justify-between">
                <span>To request corrections in academic records, submit a ticket to the Support Desk.</span>
                <button
                  onClick={() => onNavigate('/student/support')}
                  className="text-xs text-[#D8B978] hover:underline font-mono"
                >
                  Contact CAR Desk →
                </button>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 2. PROFILE DOSSIER (EDITABLE) */}
          {/* ======================================================= */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-150 text-xs">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">
                    Profile Dossier
                  </h2>
                  <p className="text-xs text-[#AEB7BC]">
                    Update personal and professional details visible to verified recruiters upon application.
                  </p>
                </div>
                {profileDirty && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Unsaved Changes
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-1 uppercase font-mono text-[11px]">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => {
                      setProfileName(e.target.value);
                      setProfileDirty(true);
                    }}
                    className="w-full bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-1 uppercase font-mono text-[11px]">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => {
                      setProfilePhone(e.target.value);
                      setProfileDirty(true);
                    }}
                    className="w-full bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-1 uppercase font-mono text-[11px]">
                  Specialization / Headline
                </label>
                <input
                  type="text"
                  value={profileBio}
                  onChange={(e) => {
                    setProfileBio(e.target.value);
                    setProfileDirty(true);
                  }}
                  className="w-full bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-1 uppercase font-mono text-[11px]">
                  Technical Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={profileSkills}
                  onChange={(e) => {
                    setProfileSkills(e.target.value);
                    setProfileDirty(true);
                  }}
                  className="w-full bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-1 uppercase font-mono text-[11px]">
                  Target Career Roles & Interests
                </label>
                <input
                  type="text"
                  value={profileInterests}
                  onChange={(e) => {
                    setProfileInterests(e.target.value);
                    setProfileDirty(true);
                  }}
                  className="w-full bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-[#D8B978]">
                  Verified Professional Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#AEB7BC] mb-1 text-[10px]">LinkedIn URL</label>
                    <input
                      type="url"
                      value={profileLinkedIn}
                      onChange={(e) => {
                        setProfileLinkedIn(e.target.value);
                        setProfileDirty(true);
                      }}
                      className="w-full bg-[#101A22] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#AEB7BC] mb-1 text-[10px]">GitHub URL</label>
                    <input
                      type="url"
                      value={profileGitHub}
                      onChange={(e) => {
                        setProfileGitHub(e.target.value);
                        setProfileDirty(true);
                      }}
                      className="w-full bg-[#101A22] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#AEB7BC] mb-1 text-[10px]">Portfolio / Site</label>
                    <input
                      type="url"
                      value={profilePortfolio}
                      onChange={(e) => {
                        setProfilePortfolio(e.target.value);
                        setProfileDirty(true);
                      }}
                      className="w-full bg-[#101A22] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CCAA68] to-[#D8B978] hover:from-[#D8B978] hover:to-[#CCAA68] text-[#101A22] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE CHANGES</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================= */}
          {/* 3. LOGIN & SECURITY */}
          {/* ======================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-display uppercase tracking-wider">
                  LOGIN & SECURITY
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Manage your institutional account credentials and active device sessions.
                </p>
              </div>

              {/* ACCOUNT SECTION */}
              <div className="p-5 rounded-2xl bg-[#19252F] border border-[#CCAA68]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      ACCOUNT IDENTIFIER
                    </h3>
                    <p className="text-[11px] text-[#AEB7BC] mt-0.5">
                      Your registered RVU student identity and credentials identifier.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#CCAA68]/20 text-[#D8B978] text-[10px] font-mono font-bold">
                    STUDENT ACCOUNT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#101A22] border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#AEB7BC] uppercase">User ID / Email</span>
                    <div className="text-sm font-bold text-white break-all">
                      {user?.email || student.email || 'student@rvu.edu.in'}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#101A22] border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#AEB7BC] uppercase">Student Register ID</span>
                    <div className="text-sm font-bold text-[#D8B978]">
                      {student.universityRegisterNumber || student.id || '2023BTECH001'}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECURITY SECTION: CHANGE PASSWORD */}
              <div className="p-5 rounded-2xl bg-[#19252F] border border-white/5 space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    SECURITY • CHANGE PASSWORD
                  </h3>
                  <p className="text-[11px] text-[#AEB7BC] mt-0.5">
                    Update your account login password. Passwords are never stored or displayed in plaintext.
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
                    <label className="block text-[11px] font-mono text-[#AEB7BC] uppercase font-bold mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#101A22] border border-white/10 focus:border-[#CCAA68] text-white text-xs placeholder:text-[#78848C] outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#AEB7BC] uppercase font-bold mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#101A22] border border-white/10 focus:border-[#CCAA68] text-white text-xs placeholder:text-[#78848C] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#AEB7BC] uppercase font-bold mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#101A22] border border-white/10 focus:border-[#CCAA68] text-white text-xs placeholder:text-[#78848C] outline-none font-mono"
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

              {/* Active Session & Devices */}
              <div className="p-5 rounded-2xl bg-[#19252F] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Active Session & Security
                    </h3>
                    <p className="text-[11px] text-[#AEB7BC] mt-0.5">
                      Your active local authenticated device session.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold">
                    ACTIVE NOW
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#101A22] border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-white font-semibold">Browser Session</span>
                    <span className="text-[11px] text-[#D8B978]">Current Device</span>
                  </div>
                  <div className="text-[11px] text-[#AEB7BC] font-mono">
                    Account: {user?.email || student.email} • Authenticated
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => terminateOtherSessions()}
                    className="px-4 py-2 rounded-xl bg-[#101A22] hover:bg-[#14202a] text-[#AEB7BC] hover:text-white border border-white/10 text-xs font-mono transition-colors"
                  >
                    Sign Out Other Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 4. NOTIFICATIONS */}
          {/* ======================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-display">
                  Notification Channels & Alerts
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Customize which placement alerts and communication dispatches you receive.
                </p>
              </div>

              {/* Category Toggles */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-[#D8B978]">
                  Alert Categories
                </h3>

                {[
                  { key: 'applicationUpdates', title: 'Application Updates', desc: 'Alerts when your candidate status advances through shortlist, assessment, or interview stages.' },
                  { key: 'interviewUpdates', title: 'Interview Updates & Calls', desc: 'Direct interview slot schedules and panel reminders.' },
                  { key: 'placementDrives', title: 'Campus Placement Drives', desc: 'New drive announcements and registration window deadlines.' },
                  { key: 'deadlines', title: 'Deadlines & Policy Reminders', desc: 'Time-critical alerts regarding mandatory registration and document submission.' },
                  { key: 'offers', title: 'Offer Letters & Selection Dispatches', desc: 'Instant notices upon verified job or internship offer releases.' },
                  { key: 'careerOpportunities', title: 'Curated Opportunity Matches', desc: 'Recommended requisitions aligned with your school and domain skills.' },
                  { key: 'preparationReminders', title: 'Preparation Track Reminders', desc: 'Mock diagnostic clinics and STAR interview practice prompts.' },
                  { key: 'systemNotifications', title: 'Central System & Security Notices', desc: 'Mandatory statutory and compliance communications from CAR.' }
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start justify-between p-3 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer hover:border-[#CCAA68]/30 transition-colors"
                  >
                    <div className="pr-4 space-y-0.5">
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-[11px] text-[#AEB7BC] leading-relaxed">{item.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifState[item.key as keyof typeof notifState] as boolean}
                      onChange={(e) => setNotifState({ ...notifState, [item.key]: e.target.checked })}
                      className="w-4 h-4 mt-0.5 rounded accent-[#CCAA68]"
                    />
                  </label>
                ))}
              </div>

              {/* Channels */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-[#D8B978]">
                  Delivery Channels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer">
                    <span className="font-semibold text-white">In-App Notification</span>
                    <input
                      type="checkbox"
                      checked={notifState.channels.inApp}
                      onChange={(e) => setNotifState({
                        ...notifState,
                        channels: { ...notifState.channels, inApp: e.target.checked }
                      })}
                      className="w-4 h-4 accent-[#CCAA68]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer">
                    <span className="font-semibold text-white">Institutional Email</span>
                    <input
                      type="checkbox"
                      checked={notifState.channels.email}
                      onChange={(e) => setNotifState({
                        ...notifState,
                        channels: { ...notifState.channels, email: e.target.checked }
                      })}
                      className="w-4 h-4 accent-[#CCAA68]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer">
                    <span className="font-semibold text-white">Browser Push</span>
                    <input
                      type="checkbox"
                      checked={notifState.channels.push}
                      onChange={(e) => setNotifState({
                        ...notifState,
                        channels: { ...notifState.channels, push: e.target.checked }
                      })}
                      className="w-4 h-4 accent-[#CCAA68]"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotifications}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CCAA68] to-[#D8B978] text-[#101A22] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE PREFERENCES</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 5. CAREER PREFERENCES */}
          {/* ======================================================= */}
          {activeTab === 'career' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-display">
                  Career Preferences
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Tailor your job role targets, preferred work locations, and employment formats to guide opportunity recommendations.
                </p>
              </div>

              {/* Target Job Roles */}
              <div className="space-y-2">
                <label className="block text-white font-semibold uppercase font-mono text-[11px]">
                  Preferred Job Roles
                </label>
                <div className="flex flex-wrap gap-2">
                  {careerPrefs.preferredJobRoles.map((role) => (
                    <span 
                      key={role}
                      className="px-3 py-1 rounded-full bg-[#101A22] border border-[#CCAA68]/40 text-[#D8B978] text-xs font-mono flex items-center gap-1.5"
                    >
                      <span>{role}</span>
                      <button
                        type="button"
                        onClick={() => setCareerPrefs({
                          ...careerPrefs,
                          preferredJobRoles: careerPrefs.preferredJobRoles.filter(r => r !== role)
                        })}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    placeholder="Add target role (e.g. Cloud Engineer)"
                    className="flex-1 bg-[#101A22] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newRoleInput.trim()) {
                        setCareerPrefs({
                          ...careerPrefs,
                          preferredJobRoles: [...careerPrefs.preferredJobRoles, newRoleInput.trim()]
                        });
                        setNewRoleInput('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/40 text-[#CCAA68] hover:text-white font-mono"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Work Mode Preferences */}
              <div className="space-y-2">
                <label className="block text-white font-semibold uppercase font-mono text-[11px]">
                  Work Mode Preferences
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['On-site', 'Hybrid', 'Remote'] as ('On-site' | 'Hybrid' | 'Remote')[]).map((mode) => {
                    const selected = careerPrefs.workModes.includes(mode);
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setCareerPrefs({
                            ...careerPrefs,
                            workModes: selected 
                              ? careerPrefs.workModes.filter(m => m !== mode)
                              : [...careerPrefs.workModes, mode]
                          });
                        }}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selected
                            ? 'bg-[#CCAA68]/20 border-[#CCAA68] text-white font-bold'
                            : 'bg-[#101A22] border-white/5 text-[#AEB7BC] hover:text-white'
                        }`}
                      >
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Internship vs Full-Time */}
              <div className="space-y-2">
                <label className="block text-white font-semibold uppercase font-mono text-[11px]">
                  Placement Track Preferences
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer">
                    <span className="text-white font-medium">Summer / Pre-Final Internship</span>
                    <input
                      type="checkbox"
                      checked={careerPrefs.internshipPreference}
                      onChange={(e) => setCareerPrefs({ ...careerPrefs, internshipPreference: e.target.checked })}
                      className="w-4 h-4 accent-[#CCAA68]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer">
                    <span className="text-white font-medium">Full-Time Campus Placement (FTE)</span>
                    <input
                      type="checkbox"
                      checked={careerPrefs.fullTimePreference}
                      onChange={(e) => setCareerPrefs({ ...careerPrefs, fullTimePreference: e.target.checked })}
                      className="w-4 h-4 accent-[#CCAA68]"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveCareer}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CCAA68] to-[#D8B978] text-[#101A22] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE PREFERENCES</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 6. PRIVACY & VISIBILITY */}
          {/* ======================================================= */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-display">
                  Privacy & Recruiter Visibility
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Control how your career profile and candidate dossiers are presented across RVU corporate partners.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start justify-between p-3.5 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer">
                  <div className="pr-4">
                    <div className="font-semibold text-white">Recruiter Dossier Visibility</div>
                    <div className="text-[11px] text-[#AEB7BC] leading-relaxed">
                      Allow verified recruiters to view your career profile when you apply to campus drives.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacyPrefs.recruiterVisibility}
                    onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, recruiterVisibility: e.target.checked })}
                    className="w-4 h-4 mt-0.5 accent-[#CCAA68]"
                  />
                </label>

                <label className="flex items-start justify-between p-3.5 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer">
                  <div className="pr-4">
                    <div className="font-semibold text-white">Show Verified Skills to Recruiters</div>
                    <div className="text-[11px] text-[#AEB7BC] leading-relaxed">
                      Permit verified corporate talent partners to view your benchmarked technical skills in candidate talent searches.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacyPrefs.showSkillsToRecruiters}
                    onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, showSkillsToRecruiters: e.target.checked })}
                    className="w-4 h-4 mt-0.5 accent-[#CCAA68]"
                  />
                </label>

                <label className="flex items-start justify-between p-3.5 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer">
                  <div className="pr-4">
                    <div className="font-semibold text-white">Resume Direct Download Permission</div>
                    <div className="text-[11px] text-[#AEB7BC] leading-relaxed">
                      Allow hiring managers to download your audited PDF resume once your application is shortlisted.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacyPrefs.showResumeToRecruiters}
                    onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, showResumeToRecruiters: e.target.checked })}
                    className="w-4 h-4 mt-0.5 accent-[#CCAA68]"
                  />
                </label>
              </div>

              <div className="p-3.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 text-[11px] text-[#AEB7BC]">
                <strong className="text-white">Institutional Privacy Guarantee:</strong> Student contact numbers and personal emails are never exposed publicly without active student consent and verified recruitment drive enrollment.
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePrivacy}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CCAA68] to-[#D8B978] text-[#101A22] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE PREFERENCES</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 7. APPEARANCE */}
          {/* ======================================================= */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-display">
                  Appearance Preferences
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Customize your viewing density and motion settings while retaining official RVU brand fidelity.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-white font-semibold uppercase font-mono text-[11px]">
                  Interface Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: 'Dark / RVU Theme (Default)' },
                    { id: 'system', label: 'Match System' },
                    { id: 'light', label: 'Light Theme' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAppearanceTheme(t.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        appearanceTheme === t.id
                          ? 'bg-[#CCAA68]/20 border-[#CCAA68] text-white font-bold'
                          : 'bg-[#101A22] border-white/5 text-[#AEB7BC] hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-[#AEB7BC] block">
                  Core RVU institutional palette (Deep Navy & Gold) is maintained across all themes for brand integrity.
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">Reduced Motion</div>
                    <div className="text-[11px] text-[#AEB7BC]">Minimize micro-animations and circuit motion transitions.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="w-4 h-4 accent-[#CCAA68]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#101A22] border border-white/5 cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">Compact Data Density</div>
                    <div className="text-[11px] text-[#AEB7BC]">Tighter table rows and opportunity cards for high-throughput review.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={density === 'compact'}
                    onChange={(e) => setDensity(e.target.checked ? 'compact' : 'comfortable')}
                    className="w-4 h-4 accent-[#CCAA68]"
                  />
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAppearance}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CCAA68] to-[#D8B978] text-[#101A22] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE APPEARANCE</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 8. SESSIONS */}
          {/* ======================================================= */}
          {activeTab === 'sessions' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-display">
                  Active Sessions
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Manage active browser sessions and terminate unrecognized devices.
                </p>
              </div>

              <div className="space-y-3">
                {sessions.map((sess) => (
                  <div 
                    key={sess.id}
                    className="p-4 rounded-xl bg-[#101A22] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{sess.device}</span>
                        {sess.current && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                            Current Device
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-[#AEB7BC]">
                        {sess.browser} • {sess.location} • IP: {sess.ipMasked}
                      </div>
                      <div className="text-[10px] text-[#AEB7BC]/70 font-mono">
                        Last Active: {sess.lastActive}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    terminateOtherSessions();
                    showToast('All other active sessions have been terminated.');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#19252F] hover:bg-rose-950/50 text-rose-300 hover:text-rose-200 border border-rose-500/30 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  SIGN OUT ALL OTHER SESSIONS
                </button>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 9. CONNECTED SERVICES */}
          {/* ======================================================= */}
          {activeTab === 'connections' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-display">
                  Connected Services
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Third-party platforms and developer integrations.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Google Workspace', desc: 'Institutional single sign-on & Google Drive portfolio sync.', status: 'Not connected' },
                  { name: 'LinkedIn', desc: 'Sync verified alumni profile and skill badges.', status: 'Not connected' },
                  { name: 'GitHub', desc: 'Verified code repositories and capstone pull requests.', status: 'Not connected' },
                  { name: 'Design Portfolio (Behance / Figma)', desc: 'Direct portfolio dossier embedding for design students.', status: 'Not connected' }
                ].map((svc) => (
                  <div
                    key={svc.name}
                    className="p-4 rounded-xl bg-[#101A22] border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-white">{svc.name}</div>
                      <div className="text-[11px] text-[#AEB7BC] mt-0.5">{svc.desc}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-mono text-[#AEB7BC] bg-white/5 px-2 py-0.5 rounded">
                        {svc.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => showToast(`${svc.name} OAuth integration is currently managed via Central IT.`, 'error')}
                        className="px-3 py-1.5 rounded-lg bg-[#19252F] hover:bg-[#CCAA68] text-[#CCAA68] hover:text-[#101A22] border border-[#CCAA68]/30 text-xs font-mono font-bold transition-all"
                      >
                        CONNECT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 10. SUPPORT & FAQ */}
          {/* ======================================================= */}
          {activeTab === 'support' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-display">
                  Help & Placement Desk Support
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Access university placement guidelines, dispute redressal, and dedicated help tickets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4 text-[#CCAA68]" />
                    <span>CAR Placement Helpdesk</span>
                  </div>
                  <p className="text-[11px] text-[#AEB7BC]">
                    Open support tickets for eligibility queries, dream offer exceptions, and attendance adjustments.
                  </p>
                  <button
                    onClick={() => onNavigate('/student/support')}
                    className="mt-2 text-xs font-mono text-[#D8B978] hover:underline block"
                  >
                    Open Support Desk →
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#CCAA68]" />
                    <span>Official Placement Policy (2026–27)</span>
                  </div>
                  <p className="text-[11px] text-[#AEB7BC]">
                    Review the One-Student-One-Job rule, minimum CGPA mandates, and attendance compliance.
                  </p>
                  <button
                    onClick={() => onNavigate('/student/resources')}
                    className="mt-2 text-xs font-mono text-[#D8B978] hover:underline block"
                  >
                    View Policy Handbook →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 11. DANGER ZONE */}
          {/* ======================================================= */}
          {activeTab === 'danger' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <div className="border-b border-rose-500/20 pb-4">
                <h2 className="text-xl font-bold text-rose-300 font-display flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>DANGER ZONE</span>
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  High-impact account operations. These actions require explicit confirmation.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-white">Sign Out All Devices</div>
                    <div className="text-[11px] text-[#AEB7BC]">
                      Immediately terminates all active sessions across all browsers and devices.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onNavigate('/');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 font-bold text-xs uppercase tracking-wider shrink-0"
                  >
                    SIGN OUT EVERYWHERE
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-white">Deactivate Placement Participation</div>
                    <div className="text-[11px] text-[#AEB7BC]">
                      Opt out of ongoing campus recruitment cycles. Requires central administrative approval from the CAR Dean.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeactivateConfirm(true)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shrink-0"
                  >
                    DEACTIVATE ACCOUNT
                  </button>
                </div>
              </div>
            </div>
          )}

        </section>

      </div>

      {/* Unsaved Changes Confirmation Modal */}
      {pendingTabSwitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#20303A] border border-[#CCAA68]/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Unsaved Changes</span>
            </h3>
            <p className="text-xs text-[#AEB7BC]">
              You have unsaved edits in your profile. Are you sure you want to navigate away?
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingTabSwitch(null)}
                className="py-2 px-3 rounded-xl bg-[#101A22] text-xs font-semibold text-white border border-white/10"
              >
                KEEP EDITING
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileDirty(false);
                  const target = pendingTabSwitch;
                  setPendingTabSwitch(null);
                  onNavigateTab(target);
                }}
                className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white"
              >
                DISCARD CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Strong Confirmation Modal */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#20303A] border border-rose-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-rose-300 font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Confirm Placement Deactivation</span>
            </h3>
            <p className="text-xs text-[#AEB7BC] leading-relaxed">
              Deactivating your career profile flags your status as <strong className="text-white">OPTED_OUT</strong> in the Central Placement Cell database. You will no longer receive drive notifications or interview shortlists.
            </p>
            <div className="p-3 rounded-xl bg-[#101A22] border border-white/5 text-[11px] font-mono text-amber-300">
              Student USN: {student.id} • {student.name}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeactivateConfirm(false)}
                className="py-2.5 px-3 rounded-xl bg-[#101A22] text-xs font-semibold text-white border border-white/10"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateStudentProfile({ placementStatus: 'OPTED_OUT' });
                  setShowDeactivateConfirm(false);
                  showToast('Placement account deactivated. Status updated to OPTED_OUT.');
                }}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white"
              >
                CONFIRM DEACTIVATE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
