import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Clock,
  Plus
} from 'lucide-react';
import type { SupportTicket, TicketCategory, Student } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

interface StudentHelpSupportViewProps {
  student: Student;
  tickets: SupportTicket[];
  onCreateTicket: (subject: string, category: TicketCategory, description: string) => SupportTicket;
}

export const StudentHelpSupportView: React.FC<StudentHelpSupportViewProps> = ({
  student,
  tickets,
  onCreateTicket
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('ELIGIBILITY');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onCreateTicket(subject, category, description);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setSubject('');
      setDescription('');
      alert('Support query submitted to the Placement Office. Your ticket reference has been generated.');
    }, 450);
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'OPEN':
        return { label: 'Open', style: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'UNDER_REVIEW':
        return { label: 'Under Review by CAR', style: 'bg-sky-500/15 text-sky-300 border-sky-500/30' };
      case 'RESOLVED':
        return { label: 'Resolved', style: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: status, style: 'bg-white/10 text-white border-white/20' };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                STUDENT ↔ PLACEMENT OFFICE DESK
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Direct CAR Channel
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Help & Support Desk
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Raise queries directly with the Corporate & Alumni Relations (CAR) office regarding placement eligibility, test conflicts, drive logistics, or documentation.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Raise Placement Query
          </Button>
        </div>
      </div>

      {/* Grid: Tickets List & Contact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Tickets History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gold uppercase tracking-wider font-mono">
              My Support Tickets ({tickets.length})
            </h2>
            <span className="text-xs font-mono text-rvu-subtle">
              Managed by CAR Command Center
            </span>
          </div>

          {tickets.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-navy-card border border-white/10 text-rvu-muted space-y-2">
              <LifeBuoy className="w-8 h-8 text-rvu-subtle mx-auto" />
              <p className="text-sm">You have not raised any support tickets.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((t) => {
                const statusBadge = getStatusBadge(t.status);

                return (
                  <div
                    key={t.id}
                    className="p-5 sm:p-6 rounded-2xl bg-navy-card border border-gold-border/40 hover:border-gold/60 transition-all space-y-3 shadow-card"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gold">
                          {t.id}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/5 text-rvu-muted border border-white/10 uppercase">
                          {t.category}
                        </span>
                      </div>

                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border font-bold uppercase ${statusBadge.style}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">
                      {t.subject}
                    </h3>

                    <p className="text-xs text-rvu-muted leading-relaxed">
                      {t.description}
                    </p>

                    {/* Admin Response if available */}
                    {t.adminResponse && (
                      <div className="p-3.5 rounded-xl bg-[#0E1720] border border-emerald-500/30 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                          <span className="font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Official Response from Placement Office:
                          </span>
                          <span>{t.respondedAt}</span>
                        </div>
                        <p className="text-[11px] text-rvu-text leading-relaxed">
                          {t.adminResponse}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-rvu-subtle">
                      <span>Created: {t.createdAt}</span>
                      {t.assignedOfficer && (
                        <span>Assigned Officer: <strong className="text-white">{t.assignedOfficer}</strong></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: CAR Office Contact Information */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-navy-card border border-gold-border/40 space-y-4 shadow-card">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                Institutional Contact
              </span>
              <h3 className="text-base font-bold text-white font-display">
                CAR Directorate Helpdesk
              </h3>
            </div>

            <p className="text-xs text-rvu-muted leading-relaxed">
              Visit the Corporate & Alumni Relations office during working hours for walk-in advisory and urgent drive inquiries.
            </p>

            <div className="space-y-3 text-xs font-mono text-rvu-muted pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">CAR Central Office:</strong>
                  <span>Ground Floor, Administrative Block, RV University, RV Vidyanikethan Post, Bengaluru 560059</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <strong className="text-white block">Placement Desk:</strong>
                  <a href="mailto:car.placements@rvu.edu.in" className="text-gold hover:underline">
                    car.placements@rvu.edu.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <strong className="text-white block">Office Hours:</strong>
                  <span>Monday – Friday: 09:00 AM – 05:30 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="p-5 rounded-2xl bg-[#0E1720] border border-white/5 space-y-2 text-xs text-rvu-subtle">
            <strong className="text-white block font-mono text-[11px]">Ticket SLA Guideline:</strong>
            <p className="text-[11px] leading-relaxed">
              Drive-related queries raised at least 24 hours prior to a campus drive are prioritized. Emergency queries can be escalated through your Faculty Placement Coordinator.
            </p>
          </div>

        </div>

      </div>

      {/* Modal: Raise Support Query */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#131F2A] border border-gold-border rounded-2xl shadow-2xl p-6 text-rvu-text space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-gold" />
                <h3 className="text-base font-bold text-white font-display">
                  Raise Placement Query
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-mono text-rvu-subtle hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-rvu-muted font-mono mb-1">
                  Query Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="w-full p-2.5 rounded-xl bg-[#0E1720] border border-white/10 text-white font-mono focus:outline-none focus:border-gold"
                >
                  <option value="ELIGIBILITY">Eligibility & CGPA Criteria</option>
                  <option value="APPLICATION">Application Status / Review</option>
                  <option value="PLACEMENT_DRIVE">Placement Drive Logistics</option>
                  <option value="INTERVIEW">Interview Slot / Conflict</option>
                  <option value="DOCUMENTS">Documents & Resume Verification</option>
                  <option value="TECHNICAL_ISSUE">Portal Technical Issue</option>
                  <option value="OTHER">Other Query</option>
                </select>
              </div>

              <div>
                <label className="block text-rvu-muted font-mono mb-1">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of your inquiry..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#0E1720] border border-white/10 text-white placeholder:text-rvu-subtle focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-rvu-muted font-mono mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your query with relevant drive details, date conflicts, or specific context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#0E1720] border border-white/10 text-white placeholder:text-rvu-subtle focus:outline-none focus:border-gold"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5 text-[11px] text-rvu-subtle flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  Query will be logged under student ID <strong>{student.id}</strong> and routed to the CAR officer.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  isLoading={isSubmitting}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Submit Query
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
