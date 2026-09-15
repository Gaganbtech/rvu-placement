import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Building2, Mail, Phone, User, CheckCircle2, Send } from 'lucide-react';

interface RecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecruiterModal: React.FC<RecruiterModalProps> = ({
  isOpen,
  onClose
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    workEmail: '',
    phoneNumber: '',
    hiringDomains: [] as string[],
    targetBatch: '2026 Graduating Batch',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const domainOptions = [
    'Software & Distributed Systems',
    'AI, ML & Data Science',
    'Product Design & UX',
    'Corporate Law & Compliance',
    'Business Analytics & Finance'
  ];

  const toggleDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      hiringDomains: prev.hiringDomains.includes(domain)
        ? prev.hiringDomains.filter(d => d !== domain)
        : [...prev.hiringDomains, domain]
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSubmitted(false);
        onClose();
      }}
      title="Partner with RV University"
      subtitle="Connect with our Placement Cell to schedule campus recruitment drives and internship pipelines."
      maxWidth="xl"
    >
      {submitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-rvu-text font-display">
            Recruitment Inquiry Received
          </h3>
          <p className="text-sm text-rvu-muted max-w-md mx-auto leading-relaxed">
            Thank you for your interest in hiring RV University talent. Our Central Placement Cell will review your requirements and reach out within 24 business hours with the placement brochure and hiring slots.
          </p>
          <div className="pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-rvu-text uppercase tracking-wider mb-1">
                Company / Organization *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-navy-surface border border-gold/30 rounded-xl pl-9 pr-3 py-2 text-xs text-rvu-text focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-xs font-semibold text-rvu-text uppercase tracking-wider mb-1">
                Hiring Lead / Contact Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-navy-surface border border-gold/30 rounded-xl pl-9 pr-3 py-2 text-xs text-rvu-text focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold text-rvu-text uppercase tracking-wider mb-1">
                Official Corporate Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={formData.workEmail}
                  onChange={e => setFormData({ ...formData, workEmail: e.target.value })}
                  placeholder="jane.doe@company.com"
                  className="w-full bg-navy-surface border border-gold/30 rounded-xl pl-9 pr-3 py-2 text-xs text-rvu-text focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-rvu-text uppercase tracking-wider mb-1">
                Contact Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-navy-surface border border-gold/30 rounded-xl pl-9 pr-3 py-2 text-xs text-rvu-text focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Hiring Domains */}
          <div>
            <label className="block text-xs font-semibold text-rvu-text uppercase tracking-wider mb-2">
              Select Talent Streams of Interest
            </label>
            <div className="flex flex-wrap gap-2">
              {domainOptions.map(domain => {
                const selected = formData.hiringDomains.includes(domain);
                return (
                  <button
                    type="button"
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                      selected
                        ? 'bg-gold-faint border-gold text-gold font-medium'
                        : 'bg-navy-surface border-white/10 text-rvu-muted hover:border-gold/40'
                    }`}
                  >
                    {domain}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Notes / Requisition Details */}
          <div>
            <label className="block text-xs font-semibold text-rvu-text uppercase tracking-wider mb-1">
              Tentative Hiring Dates or Specific Requirements
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              placeholder="Provide anticipated hiring numbers, job roles, or preferred drive dates..."
              className="w-full bg-navy-surface border border-gold/30 rounded-xl p-3 text-xs text-rvu-text focus:border-gold focus:outline-none"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-gold-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Send className="w-4 h-4" />}
            >
              Submit Recruiter Registration
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
