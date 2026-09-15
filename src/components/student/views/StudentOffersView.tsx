import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  MapPin, 
  XCircle
} from 'lucide-react';
import type { Offer, Student } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

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
  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                OFFER MANAGEMENT DESK
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Audited
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              My Offers & Placement Status
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Formal employment offers issued by participating recruiting organizations and registered with the Corporate & Alumni Relations (CAR) office.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 shrink-0">
            <span className="text-[10px] font-mono text-rvu-subtle uppercase block">
              Central Placement Status
            </span>
            <div className="text-lg font-mono font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{student.placementStatus}</span>
            </div>
            <span className="text-[10px] font-mono text-rvu-subtle">
              Authority: CAR Placement Directorate
            </span>
          </div>
        </div>

        {/* Note on Placement Status */}
        <div className="pt-3 border-t border-white/5 text-xs text-rvu-subtle font-mono flex items-center justify-between">
          <span>
            Placement Stages: Not Started &rarr; Eligible &rarr; Participating &rarr; Selected &rarr; <strong>Placed</strong>
          </span>
          <span className="text-amber-400/90 italic hidden sm:inline">
            * Placement status is centrally controlled by the university.
          </span>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-6">
        {offers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-navy-card border border-white/10 text-rvu-muted space-y-2">
            <Award className="w-10 h-10 text-rvu-subtle mx-auto" />
            <h3 className="text-base font-bold text-white">No Offers Pending</h3>
            <p className="text-xs text-rvu-subtle max-w-sm mx-auto">
              Formal offer letters will appear here once selection decisions are issued by recruiters and validated by CAR.
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gold/15 border-2 border-gold/40 flex items-center justify-center text-gold font-bold text-xl shadow-gold-glow shrink-0">
                      {offer.companyName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-rvu-muted font-medium">
                          {offer.companyName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          CAR Verified
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-white font-display mt-0.5">
                        {offer.role}
                      </h2>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-rvu-subtle pt-1">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          {offer.location}
                        </span>
                        <span>•</span>
                        <span>Offer Date: <strong className="text-white">{offer.offerDate}</strong></span>
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
                    <div className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded inline-block ${
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
                  <h4 className="text-xs font-mono uppercase text-gold font-bold">
                    Offer Terms & CAR Verification Notes:
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
                    * Acceptance triggers notification to CAR and initiates institutional formalities.
                  </div>

                  {isPending && (
                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          if (confirm('Decline this offer? CAR will be notified and your participation status updated.')) {
                            onDeclineOffer(offer.id);
                          }
                        }}
                        className="text-xs text-rose-300 hover:text-rose-200"
                      >
                        Decline Offer
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (confirm('Accept formal offer? This will register your placement acceptance with RV University CAR.')) {
                            onAcceptOffer(offer.id);
                          }
                        }}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Accept Offer
                      </Button>
                    </div>
                  )}

                  {isAccepted && (
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Offer Accepted • Formalities in Progress</span>
                    </div>
                  )}

                  {isDeclined && (
                    <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold">
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

    </div>
  );
};
