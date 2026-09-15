import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface OfferDetailViewProps {
  offerId: string;
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const OfferDetailView: React.FC<OfferDetailViewProps> = ({
  offerId,
  store,
  onNavigate
}) => {
  const offer = store.recruiterOffers.find(o => o.id === offerId) || store.offers.find(o => o.id === offerId);

  if (!offer) {
    return (
      <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="text-sm font-semibold text-white">Offer Record Not Found</div>
        <button
          onClick={() => onNavigate('/recruiter/offers')}
          className="px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Offers</span>
        </button>
      </div>
    );
  }

  const isVerified = offer.placementOfficeVerified;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('/recruiter/offers')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Offers List</span>
        </button>

        <button
          onClick={() => onNavigate('/recruiter/messages')}
          className="px-3.5 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-[#CCAA68] text-xs border border-[#CCAA68]/30 font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Inquire with CAR Office</span>
        </button>
      </div>

      {/* Main Header */}
      <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CCAA68]/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Placement Offer: {offer.studentName}
              </h1>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                isVerified
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {isVerified ? 'CAR Verified' : 'Pending CAR Audit'}
              </span>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Role: <strong className="text-white">{offer.role}</strong> • Student USN: <strong className="text-gray-300 font-mono">{offer.studentId}</strong>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400">Total Compensation</div>
            <div className="text-2xl font-bold text-[#CCAA68]">{offer.ctcLpa}</div>
          </div>
        </div>

        {/* Verification Status Banner */}
        {isVerified ? (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <strong>CAR Institutional Clearance Approved:</strong> Verified by {offer.verifiedBy || 'CAR Placement Officer'} on {offer.verifiedAt || '06 Sep 2026'}. Candidate can formally sign and accept.
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-300">
            <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <strong>Pending CAR Statutory Audit:</strong> The university placement cell is auditing compensation clauses, one-student-one-job rules, and academic records.
            </div>
          </div>
        )}

        {/* Compensation Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Cost to Company (CTC)</div>
            <div className="text-base font-bold text-[#CCAA68] mt-0.5">{offer.ctcLpa}</div>
            <div className="text-[10px] text-gray-400">Annual Gross Package</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Fixed Base Salary</div>
            <div className="text-base font-bold text-white mt-0.5">{offer.baseSalary || '₹12.0 LPA'}</div>
            <div className="text-[10px] text-gray-400">Guaranteed compensation</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Joining Bonus</div>
            <div className="text-base font-bold text-white mt-0.5">{offer.joiningBonus || 'N/A'}</div>
            <div className="text-[10px] text-gray-400">Disbursed on joining</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Stock Options / RSUs</div>
            <div className="text-base font-bold text-white mt-0.5">{offer.stockOptions || 'N/A'}</div>
            <div className="text-[10px] text-gray-400">Vesting schedule applies</div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="p-6 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Offer Terms & Statutory Summary
        </h3>

        <ul className="space-y-2 text-xs text-gray-300 list-disc list-inside">
          {(offer.termsSummary || []).map((term, idx) => (
            <li key={idx} className="leading-relaxed">{term}</li>
          ))}
        </ul>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs text-gray-300">
          <div>
            <strong>Reporting Date:</strong> <span className="text-white">{offer.joiningDate}</span>
          </div>
          <div>
            <strong>Acceptance Window:</strong> <span className="text-white">{offer.acceptanceDeadline}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
