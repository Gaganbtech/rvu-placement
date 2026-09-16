import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  MapPin, 
  XCircle,
  FileCheck
} from 'lucide-react';
import type { Offer, Student } from '../../../data/platform/types';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface StudentOffersViewProps {
  student: Student;
  offers: Offer[];
  onAcceptOffer: (offerId: string) => void;
  onDeclineOffer: (offerId: string) => void;
}

export const StudentOffersView: React.FC<StudentOffersViewProps> = ({
  student,
  offers,
  onAcceptOffer,
  onDeclineOffer
}) => {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'ACCEPT' | 'DECLINE';
    offerId: string;
    companyName: string;
  }>({
    isOpen: false,
    type: 'ACCEPT',
    offerId: '',
    companyName: ''
  });

  const handleConfirmAction = () => {
    if (confirmModal.type === 'ACCEPT') {
      onAcceptOffer(confirmModal.offerId);
    } else {
      onDeclineOffer(confirmModal.offerId);
    }
    setConfirmModal({ isOpen: false, type: 'ACCEPT', offerId: '', companyName: '' });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                OFFER MANAGEMENT DESK
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Audited & Regulated
              </span>
              <span className="text-[10px] font-mono text-rvu-muted bg-white/5 px-2 py-0.5 rounded border border-white/10">
                SRN: {student.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-2">
              Formal Placement & Internship Offers
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Binding employment letters issued by participating industry recruiters and validated by the RV University Corporate & Alumni Relations (CAR) Directorate.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 shrink-0">
            <span className="text-[10px] font-mono text-rvu-subtle uppercase block">
              University Placement Status
            </span>
            <div className="text-lg font-mono font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{student.placementStatus}</span>
            </div>
            <span className="text-[10px] font-mono text-rvu-subtle">
              Authority: Central CAR Registry
            </span>
          </div>
        </div>

        {/* Note on Placement Status */}
        <div className="pt-3 border-t border-white/5 text-xs text-rvu-subtle font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-gold font-bold">Policy Stage:</span>
            <span>Not Started &rarr; Eligible &rarr; Participating &rarr; Selected &rarr; <strong className="text-emerald-400">Placed</strong></span>
          </div>
          <span className="text-amber-400/90 italic">
            * Per RVU One-Offer policy, accepting an offer locks subsequent placement applications.
          </span>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-6">
        {offers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-navy-card border border-white/10 text-rvu-muted space-y-3">
            <Award className="w-10 h-10 text-rvu-subtle mx-auto" />
            <h3 className="text-base font-bold text-white">No Offers Pending Selection</h3>
            <p className="text-xs text-rvu-subtle max-w-sm mx-auto">
              Formal offer letters will appear here once selection decisions are issued by recruiters and validated by the Corporate & Alumni Relations office.
            </p>
          </div>
        ) : (
          offers.map((offer) => {
            const isPending = offer.status === 'OFFER_RECEIVED';
            const isAccepted = offer.status === 'OFFER_ACCEPTED';
            const isDeclined = offer.status === 'OFFER_DECLINED';

            return (
              <div
                key={offer.id}
                className="p-6 sm:p-8 rounded-2xl bg-navy-card border border-gold-border/60 hover:border-gold transition-all space-y-6 shadow-card"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gold/15 border-2 border-gold/40 flex items-center justify-center text-gold font-bold text-xl shadow-gold-glow shrink-0">
                      {offer.companyName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-rvu-muted font-medium">
                          {offer.companyName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          CAR Verified Letter
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-white font-display mt-1">
                        {offer.role}
                      </h2>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-rvu-subtle pt-2">
                        <span className="flex items-center gap-1.5 text-white">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          {offer.location}
                        </span>
                        <span>•</span>
                        <span>Offer Issued: <strong className="text-white">{offer.offerDate}</strong></span>
                        <span>•</span>
                        <span>Decision Deadline: <strong className="text-amber-300">{offer.acceptanceDeadline}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Compensation & Status */}
                  <div className="text-right shrink-0 space-y-1">
                    <span className="text-[10px] font-mono text-rvu-subtle uppercase block">
                      Annual CTC Package
                    </span>
                    <div className="text-2xl font-mono font-bold text-emerald-400">
                      {offer.ctcLpa}
                    </div>
                    <div className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded inline-block ${
                      isAccepted 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : isDeclined 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-gold/15 text-gold border border-gold/30'
                    }`}>
                      {offer.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Salary Breakdown Structure */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono p-4 rounded-xl bg-[#0E1720] border border-white/5">
                  <div>
                    <span className="text-[10px] text-rvu-subtle block">Base Remuneration</span>
                    <strong className="text-white">{offer.baseSalary}</strong>
                  </div>
                  {offer.joiningBonus && (
                    <div>
                      <span className="text-[10px] text-rvu-subtle block">Joining Bonus</span>
                      <strong className="text-white">{offer.joiningBonus}</strong>
                    </div>
                  )}
                  {offer.stockOptions && (
                    <div>
                      <span className="text-[10px] text-rvu-subtle block">Stock / Retention Incentives</span>
                      <strong className="text-white">{offer.stockOptions}</strong>
                    </div>
                  )}
                </div>

                {/* Key Terms */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase text-gold font-bold flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4" />
                    <span>Offer Terms & CAR Validation Notes:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-rvu-muted">
                    {offer.termsSummary.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[11px] font-mono text-rvu-subtle">
                    * Official acceptance notifies CAR and initiates onboarding documentation formalities.
                  </div>

                  {isPending && (
                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setConfirmModal({
                          isOpen: true,
                          type: 'DECLINE',
                          offerId: offer.id,
                          companyName: offer.companyName
                        })}
                        className="text-xs text-rose-300 hover:text-rose-200 border-rose-500/20 hover:bg-rose-500/10"
                      >
                        Decline Offer
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setConfirmModal({
                          isOpen: true,
                          type: 'ACCEPT',
                          offerId: offer.id,
                          companyName: offer.companyName
                        })}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Accept Formal Offer
                      </Button>
                    </div>
                  )}

                  {isAccepted && (
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Offer Accepted • CAR Placement Record Locked</span>
                    </div>
                  )}

                  {isDeclined && (
                    <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                      <XCircle className="w-4 h-4" />
                      <span>Offer Declined</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'ACCEPT' ? 'Accept Placement Offer?' : 'Decline Placement Offer?'}
        message={
          confirmModal.type === 'ACCEPT'
            ? `You are about to accept the formal offer from ${confirmModal.companyName}. In accordance with RV University placement regulations, this acceptance is binding and will transition your official university placement status to "Placed".`
            : `Are you sure you want to decline the offer from ${confirmModal.companyName}? CAR will record your decision and make this opportunity available for other eligible RV University candidates.`
        }
        confirmText={confirmModal.type === 'ACCEPT' ? 'Yes, Accept Offer' : 'Yes, Decline Offer'}
        cancelText="Cancel"
        isDestructive={confirmModal.type === 'DECLINE'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'ACCEPT', offerId: '', companyName: '' })}
      />

    </div>
  );
};
