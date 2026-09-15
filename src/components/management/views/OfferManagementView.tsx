import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Building2,
  ShieldCheck,
  AlertTriangle,
  X
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { Offer } from '../../../data/platform/types';

interface OfferManagementViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const OfferManagementView: React.FC<OfferManagementViewProps> = ({
  store,
  onNavigate
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [verificationRemarks, setVerificationRemarks] = useState('');

  const filteredOffers = store.offers.filter(offer => {
    const isVerified = offer.placementOfficeVerified;
    if (selectedStatus === 'VERIFIED' && !isVerified) return false;
    if (selectedStatus === 'PENDING' && isVerified) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const studentName = offer.studentName || store.students.find(s => s.id === offer.studentId)?.name || '';
      const matchCandidate = studentName.toLowerCase().includes(q) || offer.studentId.toLowerCase().includes(q);
      const matchComp = offer.companyName.toLowerCase().includes(q);
      const matchRole = offer.role.toLowerCase().includes(q);
      if (!matchCandidate && !matchComp && !matchRole) return false;
    }
    return true;
  });

  const pendingCount = store.offers.filter(o => !o.placementOfficeVerified).length;
  const verifiedCount = store.offers.filter(o => o.placementOfficeVerified).length;

  const handleVerify = (status: 'VERIFIED' | 'REJECTED') => {
    if (!selectedOffer) return;
    store.verifyOffer(
      selectedOffer.id,
      status,
      verificationRemarks || (status === 'VERIFIED' ? 'Verified against official corporate offer letter.' : 'Discrepancy in CTC/designation.')
    );
    setSelectedOffer(null);
    setVerificationRemarks('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              COMPLIANCE & ATTESTATION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Official CAR Verification Desk
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Offer Verification & Compliance Desk
          </h1>
          <p className="text-xs text-rvu-muted">
            Attest corporate job letters, reconcile compensation details, and maintain statutory placement records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-[#111C26] border border-gold-border/40 text-xs">
            <span className="text-rvu-muted">Pending Review: </span>
            <strong className="text-amber-400 font-mono">{pendingCount}</strong>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#111C26] border border-gold-border/40 text-xs">
            <span className="text-rvu-muted">Verified: </span>
            <strong className="text-emerald-400 font-mono">{verifiedCount}</strong>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-xl bg-[#111C26] border border-gold-border/40 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rvu-subtle" />
          <input
            type="text"
            placeholder="Search candidate, company, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white placeholder-rvu-subtle focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['ALL', 'PENDING', 'VERIFIED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                selectedStatus === tab
                  ? 'bg-gold text-navy-dark font-bold'
                  : 'bg-white/5 text-rvu-muted hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'All Offers' : tab === 'PENDING' ? `Pending (${pendingCount})` : `Verified (${verifiedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Table */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold-border/30 bg-[#142330]/80 font-mono text-[11px] text-rvu-subtle uppercase">
                <th className="p-3">Candidate / USN</th>
                <th className="p-3">Role & Company</th>
                <th className="p-3">Compensation (CTC)</th>
                <th className="p-3">Offer Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-rvu-muted font-sans">
                    No offers found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredOffers.map((offer) => {
                  const studentName = offer.studentName || store.students.find(s => s.id === offer.studentId)?.name || 'Candidate';
                  return (
                    <tr key={offer.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-sans">
                        <button
                          onClick={() => onNavigate(`/management/students/${offer.studentId}`)}
                          className="font-semibold text-white hover:text-gold text-left block"
                        >
                          {studentName}
                        </button>
                        <span className="text-[10px] text-rvu-subtle font-mono">ID: {offer.studentId}</span>
                      </td>

                      <td className="p-3 font-sans">
                        <div className="text-white font-medium">{offer.role}</div>
                        <div className="text-[10px] text-gold flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{offer.companyName}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-gold text-xs">{offer.ctcLpa}</span>
                        <span className="text-[10px] text-rvu-subtle block font-sans">Base: {offer.baseSalary}</span>
                      </td>

                      <td className="p-3 text-rvu-subtle">
                        {new Date(offer.offerDate).toLocaleDateString()}
                      </td>

                      <td className="p-3 text-center">
                        {offer.placementOfficeVerified ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>VERIFIED</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>PENDING REVIEW</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right font-sans">
                        <button
                          onClick={() => {
                            setSelectedOffer(offer);
                            setVerificationRemarks(offer.termsSummary.join(', '));
                          }}
                          className="px-3 py-1 rounded-lg bg-navy-card hover:bg-gold/20 text-rvu-muted hover:text-gold border border-gold-border/30 text-xs transition-colors"
                        >
                          Inspect & Verify
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offer Attestation Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#111C26] border border-gold-border/60 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <h3 className="text-base font-bold text-white font-display">
                  Attest & Verify Placement Offer
                </h3>
              </div>
              <button
                onClick={() => setSelectedOffer(null)}
                className="p-1 rounded-lg text-rvu-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#142330] border border-gold-border/30 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-rvu-muted">Candidate:</span>
                <span className="text-white font-bold font-sans">
                  {selectedOffer.studentName || store.students.find(s => s.id === selectedOffer.studentId)?.name || 'Candidate'} ({selectedOffer.studentId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-rvu-muted">Organization:</span>
                <span className="text-gold font-semibold font-sans">{selectedOffer.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rvu-muted">Offered Designation:</span>
                <span className="text-white font-sans">{selectedOffer.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rvu-muted">Offered CTC:</span>
                <span className="font-mono text-gold font-bold text-sm">{selectedOffer.ctcLpa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rvu-muted">Base Salary / Location:</span>
                <span className="text-white font-sans">{selectedOffer.baseSalary} &bull; {selectedOffer.location}</span>
              </div>
            </div>

            <div>
              <label className="block text-rvu-muted text-xs mb-1">
                Verification Remarks / Attestation Notes
              </label>
              <textarea
                rows={3}
                placeholder="Confirm offer letter authenticity, joining terms, and bond conditions..."
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleVerify('REJECTED')}
                className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs border border-rose-800 transition-colors"
              >
                Flag Discrepancy
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleVerify('VERIFIED')}
                  className="px-4 py-1.5 rounded-lg bg-gold text-navy-dark font-bold text-xs hover:bg-gold-light transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Certify & Verify Offer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
