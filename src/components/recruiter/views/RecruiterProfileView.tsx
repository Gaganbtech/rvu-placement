import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Save
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface RecruiterProfileViewProps {
  store: PlatformStoreState;
}

export const RecruiterProfileView: React.FC<RecruiterProfileViewProps> = ({
  store
}) => {
  const recruiter = store.activeRecruiter;
  const activeCompany = store.activeCompany;

  const [name, setName] = useState(recruiter?.name || '');
  const [email, setEmail] = useState(recruiter?.email || '');
  const [phone, setPhone] = useState(recruiter?.phone || '');
  const [designation, setDesignation] = useState(recruiter?.designation || '');
  const [department, setDepartment] = useState(recruiter?.department || '');
  const [linkedIn, setLinkedIn] = useState(recruiter?.linkedIn || '');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateRecruiterProfile({
      name,
      email,
      phone,
      designation,
      department,
      linkedIn
    });
    setSuccessMsg('Recruiter profile updated successfully.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Recruiter Personal Profile
        </h1>
        <p className="text-xs text-gray-400">
          Personal contact details and institutional identity authorized with RVU Placement Cell
        </p>
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

      {/* Profile Form Card */}
      <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-6 shadow-xl">
        <div className="flex items-center gap-4 border-b border-[#CCAA68]/15 pb-4">
          <div className="w-16 h-16 rounded-xl bg-[#CCAA68]/20 border border-[#CCAA68]/40 text-[#D8B978] flex items-center justify-center font-bold text-xl flex-shrink-0">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white truncate">{name}</h2>
              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CAR Authorized</span>
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {activeCompany?.name} • <strong className="text-[#CCAA68]">{recruiter?.role || 'COMPANY_ADMIN'}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Official Corporate Email *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Direct Phone / Mobile *</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Designation / Role Title *</label>
              <input
                type="text"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                required
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Department</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">LinkedIn Profile URL</label>
              <input
                type="url"
                value={linkedIn}
                onChange={e => setLinkedIn(e.target.value)}
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#CCAA68]/15">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
