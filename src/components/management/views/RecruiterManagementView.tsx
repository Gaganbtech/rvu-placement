import React, { useState } from 'react';
import {
  Search,
  Building2,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { RecruiterAccount } from '../../../data/platform/types';

interface RecruiterManagementViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const RecruiterManagementView: React.FC<RecruiterManagementViewProps> = ({
  store
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredRecruiters = store.recruiters.filter(rec => {
    if (selectedStatus !== 'ALL' && rec.verificationStatus !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = rec.name.toLowerCase().includes(q);
      const matchEmail = rec.email.toLowerCase().includes(q);
      const matchComp = rec.companyName.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchComp) return false;
    }
    return true;
  });

  const handleStatusAction = (recruiterId: string, status: RecruiterAccount['verificationStatus']) => {
    store.approveRecruiter(recruiterId, status);
  };

  const getStatusBadge = (status: RecruiterAccount['verificationStatus']) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">VERIFIED</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">PENDING REVIEW</span>;
      case 'SUSPENDED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">SUSPENDED</span>;
      case 'INACTIVE':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-500/20 text-gray-400">INACTIVE</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              ACCESS & IDENTITY CONTROL
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              {store.recruiters.length} Registered Accounts
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Recruiter Credentials & Identity Desk
          </h1>
          <p className="text-xs text-rvu-muted">
            Authorize corporate HR representatives, manage portal access keys, and prevent unauthorized campus postings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-rvu-subtle">
            {store.recruiters.filter(r => r.verificationStatus === 'VERIFIED').length} Verified Representatives
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-xl bg-[#111C26] border border-gold-border/40 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rvu-subtle" />
          <input
            type="text"
            placeholder="Search recruiter, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white placeholder-rvu-subtle focus:outline-none focus:border-gold"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white focus:outline-none focus:border-gold"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending Review ({store.recruiters.filter(r => r.verificationStatus === 'PENDING').length})</option>
          <option value="VERIFIED">Verified Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Recruiter Accounts Table */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 overflow-hidden shadow-lg">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0D161E] border-b border-gold-border/30 text-rvu-subtle font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3">Recruiter & Company</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Contact Email & Phone</th>
                <th className="p-3">Registered Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {filteredRecruiters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-rvu-muted">
                    No recruiter accounts match this filter.
                  </td>
                </tr>
              ) : (
                filteredRecruiters.map((recruiter) => (
                  <tr key={recruiter.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-xs shrink-0 font-sans">
                          {recruiter.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-sans font-semibold text-white">{recruiter.name}</div>
                          <div className="text-[10px] text-rvu-subtle flex items-center gap-1 font-sans">
                            <Building2 className="w-3 h-3 text-gold" />
                            <span>{recruiter.companyName}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-sans text-rvu-text">
                      {recruiter.designation}
                    </td>

                    <td className="p-3">
                      <div className="text-white">{recruiter.email}</div>
                      <div className="text-[10px] text-rvu-subtle">{recruiter.phone}</div>
                    </td>

                    <td className="p-3 text-rvu-subtle">
                      {recruiter.registeredDate ? new Date(recruiter.registeredDate).toLocaleDateString() : '10 Sep 2026'}
                    </td>

                    <td className="p-3 text-center">
                      {getStatusBadge(recruiter.verificationStatus)}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-sans">
                        {recruiter.verificationStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusAction(recruiter.id, 'VERIFIED')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Verify</span>
                            </button>
                            <button
                              onClick={() => handleStatusAction(recruiter.id, 'INACTIVE')}
                              className="px-2.5 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs border border-rose-800 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {recruiter.verificationStatus === 'VERIFIED' && (
                          <button
                            onClick={() => handleStatusAction(recruiter.id, 'SUSPENDED')}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rvu-muted hover:text-rose-400 border border-white/10 text-xs transition-colors flex items-center gap-1"
                            title="Suspend Recruiter Portal Access"
                          >
                            <ShieldAlert className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
                        )}

                        {recruiter.verificationStatus === 'SUSPENDED' && (
                          <button
                            onClick={() => handleStatusAction(recruiter.id, 'VERIFIED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
                          >
                            Re-activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
