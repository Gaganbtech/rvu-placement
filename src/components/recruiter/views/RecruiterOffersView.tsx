import React, { useState } from 'react';
import {
  Award,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface RecruiterOffersViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const RecruiterOffersView: React.FC<RecruiterOffersViewProps> = ({
  store,
  onNavigate
}) => {
  const offers = store.recruiterOffers;
  const candidates = store.recruiterCandidates;
  const opps = store.recruiterOpportunities;
  const apps = store.recruiterApplications;

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [candId, setCandId] = useState(candidates[0]?.id || 'RVU2023CSE042');
  const [role, setRole] = useState(opps[0]?.role || 'Software Engineer Intern');
  const [ctcLpa, setCtcLpa] = useState('₹16.0 LPA');
  const [baseSalary, setBaseSalary] = useState('₹14.0 LPA');
  const [joiningBonus, setJoiningBonus] = useState('₹1.0 Lakh');
  const [stockOptions, setStockOptions] = useState('₹1.0 Lakh RSUs');
  const [location, setLocation] = useState('Bengaluru (Outer Ring Road)');
  const [joiningDate, setJoiningDate] = useState('01 Jul 2027');
  const [acceptanceDeadline, setAcceptanceDeadline] = useState('30 Sep 2026');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const candApp = apps.find(a => a.studentId === candId) || apps[0];

    store.createRecruiterOffer({
      studentId: candId,
      applicationId: candApp?.id || 'DEMO-APP-0001',
      role,
      ctcLpa,
      baseSalary,
      joiningBonus,
      stockOptions,
      location,
      joiningDate,
      acceptanceDeadline,
      termsSummary: [
        'Full-time placement offer submitted by partner employer.',
        'Subject to statutory CAR verification and university transcript audit.'
      ]
    });

    setIsOfferModalOpen(false);
    setSuccessMsg(`Offer of ${ctcLpa} created and submitted to CAR Office for verification.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Offers & Final Selection Desk
          </h1>
          <p className="text-xs text-gray-400">
            Issue formal placement offers to selected RVU students and track institutional CAR verification
          </p>
        </div>

        <button
          onClick={() => setIsOfferModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors self-start sm:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Extend Formal Offer</span>
        </button>
      </div>

      {/* CAR Verification Notice */}
      <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#CCAA68] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-white">Dual Verification Governance Gate</div>
          <p className="text-gray-300 leading-relaxed">
            All offers extended by corporate recruiters enter status <strong>PENDING VERIFICATION</strong>. The CAR Placement Office verifies statutory compensation clauses, multi-offer compliance rules, and academic records before authorising the offer on the student's dashboard.
          </p>
        </div>
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

      {/* Offers List */}
      {offers.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
          <Award className="w-10 h-10 text-gray-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No Offers Extended Yet</div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Once you complete technical interviews, extend placement offers to selected candidates here.
          </p>
          <button
            onClick={() => setIsOfferModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Extend First Offer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {offers.map(offer => {
            const isVerified = offer.placementOfficeVerified;

            return (
              <div
                key={offer.id}
                className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 transition-all space-y-4 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CCAA68]/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{offer.studentName}</h3>
                      <span className="text-[10px] bg-[#20303A] text-gray-300 px-2 py-0.5 rounded font-mono border border-white/10">
                        {offer.studentId}
                      </span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        isVerified
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isVerified ? 'CAR Verified' : 'Pending CAR Audit'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-300 mt-1">
                      Role Offered: <strong className="text-white">{offer.role}</strong> • Package: <strong className="text-[#CCAA68]">{offer.ctcLpa}</strong> ({offer.location})
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(`/recruiter/offers/${offer.id}`)}
                    className="px-4 py-2 rounded-lg bg-[#20303A] hover:bg-[#CCAA68] text-white hover:text-[#101A22] text-xs font-semibold border border-[#CCAA68]/20 transition-all flex items-center gap-1.5 self-start md:self-auto"
                  >
                    <span>View Offer Terms</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Offer Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">CTC Package</div>
                    <div className="font-bold text-[#CCAA68] text-sm mt-0.5">{offer.ctcLpa}</div>
                    <div className="text-gray-400 text-[10px]">Base: {offer.baseSalary || '₹12.0 LPA'}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Joining Bonus</div>
                    <div className="font-bold text-white text-xs mt-0.5">{offer.joiningBonus || 'N/A'}</div>
                    <div className="text-gray-400 text-[10px]">Sign-on component</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Acceptance Deadline</div>
                    <div className="font-bold text-white text-xs mt-0.5">{offer.acceptanceDeadline}</div>
                    <div className="text-gray-400 text-[10px]">3 days standard window</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Candidate Status</div>
                    <div className="font-bold text-emerald-400 text-xs mt-0.5 font-mono">{offer.status}</div>
                    <div className="text-gray-400 text-[10px]">Joining: {offer.joiningDate}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating Formal Offer */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101A22] border border-[#CCAA68]/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#CCAA68]/20 pb-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#CCAA68]" />
                <span>Extend Placement Offer</span>
              </h2>
              <button onClick={() => setIsOfferModalOpen(false)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Select Candidate *</label>
                <select
                  value={candId}
                  onChange={e => setCandId(e.target.value)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                >
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id}) - {c.programme} (CGPA: {c.cgpa})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Job Role Designation *</label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Total CTC (LPA) *</label>
                  <input
                    type="text"
                    value={ctcLpa}
                    onChange={e => setCtcLpa(e.target.value)}
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Fixed Base Component *</label>
                  <input
                    type="text"
                    value={baseSalary}
                    onChange={e => setBaseSalary(e.target.value)}
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Joining Bonus</label>
                  <input
                    type="text"
                    value={joiningBonus}
                    onChange={e => setJoiningBonus(e.target.value)}
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Stock Options / RSUs</label>
                  <input
                    type="text"
                    value={stockOptions}
                    onChange={e => setStockOptions(e.target.value)}
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Location *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Joining Date *</label>
                  <input
                    type="text"
                    value={joiningDate}
                    onChange={e => setJoiningDate(e.target.value)}
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Acceptance Deadline *</label>
                  <input
                    type="text"
                    value={acceptanceDeadline}
                    onChange={e => setAcceptanceDeadline(e.target.value)}
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#20303A] border border-[#CCAA68]/20 text-[11px] text-gray-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#CCAA68] flex-shrink-0 mt-0.5" />
                <span>
                  The offer will be logged and submitted to the CAR Placement Office for formal statutory audit before appearing as accepted on the student portal.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#CCAA68]/15">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#20303A] text-white text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs hover:bg-[#D8B978]"
                >
                  Submit Offer to CAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
