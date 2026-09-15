import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface AuditLogViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  store
}) => {
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const filteredLogs = store.auditLogs.filter(log => {
    if (selectedAction !== 'ALL' && log.action !== selectedAction) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchBy = log.actor.toLowerCase().includes(q);
      const matchTarget = log.targetEntity.toLowerCase().includes(q);
      if (!matchDetails && !matchBy && !matchTarget) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              INSTITUTIONAL ACCOUNTABILITY
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              Immutable Log Record
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Institutional Audit Trail
          </h1>
          <p className="text-xs text-rvu-muted">
            Chronological audit log tracking administrative eligibility overrides, offer verifications, recruiter approvals, and Excel imports.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-3.5 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-rvu-subtle absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail by actor, target ID, or action details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white placeholder-rvu-subtle focus:outline-none focus:border-gold"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white focus:outline-none focus:border-gold"
        >
          <option value="ALL">All Actions</option>
          <option value="IMPORT_COMMIT">Excel Imports</option>
          <option value="OFFER_VERIFY">Offer Verifications</option>
          <option value="RECRUITER_APPROVE">Recruiter Approvals</option>
          <option value="OPPORTUNITY_APPROVE">Opportunity Moderation</option>
          <option value="STATUS_CHANGE">Student Status Adjustments</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 overflow-hidden shadow-lg">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0D161E] border-b border-gold-border/30 text-rvu-subtle font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Performed By & Role</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-rvu-muted">
                    No audit records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 text-rvu-subtle whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-3 font-sans">
                      <div className="text-white font-medium">{log.actor}</div>
                      <div className="text-[10px] text-rvu-subtle font-mono">{log.actorRole}</div>
                    </td>

                    <td className="p-3 text-gold">
                      {log.targetEntity}
                    </td>

                    <td className="p-3 font-sans text-rvu-text max-w-md">
                      {log.details}
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
