import React, { useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { RecruiterRole } from '../../../data/platform/types';

interface RecruiterTeamViewProps {
  store: PlatformStoreState;
}

export const RecruiterTeamView: React.FC<RecruiterTeamViewProps> = ({
  store
}) => {
  const activeCompany = store.activeCompany;
  const companyRecruiters = store.recruiters.filter(
    r => r.companyId === activeCompany?.id || r.companyName === activeCompany?.name
  );

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RecruiterRole>('RECRUITER');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Senior Technical Recruiter');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    store.inviteTeamMember({
      name: name.trim(),
      email: email.trim(),
      role,
      department,
      designation
    });

    setIsInviteModalOpen(false);
    setName('');
    setEmail('');
    setSuccessMsg(`Invitation dispatched to ${email}. Account will activate upon single-sign-on.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const rolePermissions: { role: RecruiterRole; title: string; desc: string }[] = [
    {
      role: 'COMPANY_ADMIN',
      title: 'Company Administrator',
      desc: 'Full corporate authority: post opportunities, issue formal offers, invite team members, edit company profile.'
    },
    {
      role: 'RECRUITER',
      title: 'Talent Acquisition Recruiter',
      desc: 'Submit job opportunities, screen candidate applications, manage shortlists, schedule assessments and drives.'
    },
    {
      role: 'HIRING_MANAGER',
      title: 'Hiring Manager',
      desc: 'Review candidate dossiers, participate in shortlisting decisions, review assessment scorecards, recommend offers.'
    },
    {
      role: 'INTERVIEWER',
      title: 'Technical / Panel Interviewer',
      desc: 'Access scheduled interview sessions, submit candidate scorecards, and provide qualitative hiring recommendations.'
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Recruitment Team & Access Roles
          </h1>
          <p className="text-xs text-gray-400">
            Manage authorized corporate team members and granular permissions for {activeCompany?.name || 'your company'}
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors self-start sm:self-auto shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Team Members List */}
      <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4 shadow-xl">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
          Active Team Members ({companyRecruiters.length})
        </h2>

        <div className="space-y-3">
          {companyRecruiters.map(rec => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-[#20303A] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#CCAA68]/20 border border-[#CCAA68]/40 text-[#D8B978] flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {rec.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm truncate">{rec.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#CCAA68] text-[#101A22]">
                      {rec.role || 'COMPANY_ADMIN'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono text-emerald-400 bg-emerald-500/10">
                      {rec.status || 'ACTIVE'}
                    </span>
                  </div>
                  <div className="text-gray-300 text-[11px] mt-0.5">
                    {rec.designation} • {rec.department || 'Talent Acquisition'}
                  </div>
                  <div className="text-gray-400 text-[10px] font-mono mt-0.5">{rec.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Recruiter</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Definitions Table */}
      <div className="p-6 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#CCAA68]" />
          <span>Role Permissions Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {rolePermissions.map((rp, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#20303A] border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{rp.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#101A22] text-[#CCAA68] font-mono">
                  {rp.role}
                </span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed pt-0.5">{rp.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101A22] border border-[#CCAA68]/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#CCAA68]/20 pb-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#CCAA68]" />
                <span>Invite Recruiter to Workspace</span>
              </h2>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Malhotra"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Corporate Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. recruiter@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Designation / Role Title *</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Department *</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Permission Tier *</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as RecruiterRole)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                >
                  <option value="COMPANY_ADMIN">Company Administrator (Full Privileges)</option>
                  <option value="RECRUITER">Recruiter (Post & Manage Applications)</option>
                  <option value="HIRING_MANAGER">Hiring Manager (Review & Offer Recommend)</option>
                  <option value="INTERVIEWER">Interviewer (Interview Scorecards Only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#CCAA68]/15">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#20303A] text-white text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs hover:bg-[#D8B978]"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
