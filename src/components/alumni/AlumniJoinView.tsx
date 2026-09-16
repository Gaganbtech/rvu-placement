import React, { useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Send,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface AlumniJoinViewProps {
  onBackToAlumni: () => void;
  onNavigatePortal: (route: string) => void;
}

export const AlumniJoinView: React.FC<AlumniJoinViewProps> = ({
  onBackToAlumni,
  onNavigatePortal
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    programme: '',
    graduationYear: '2025',
    currentOrganisation: '',
    role: '',
    city: '',
    mentorshipInterest: true,
    campusHiringInterest: false,
    guestLecturesInterest: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-navy-dark text-rvu-text selection:bg-gold selection:text-navy-dark pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-navy-dark/95 backdrop-blur-md border-b border-gold-border/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBackToAlumni}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-rvu-muted hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold rounded-lg px-2.5 py-1.5"
            aria-label="Back to Alumni Portal"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Back to Alumni Portal</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-rvu-subtle">
            <span>RVU Career Hub</span>
            <span>/</span>
            <span>Alumni</span>
            <span>/</span>
            <span className="text-gold">Join Network</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <GraduationCap className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              ALUMNI REGISTRATION
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-rvu-text font-display tracking-tight mb-3">
            Join the RVU Alumni Community
          </h1>

          <p className="text-sm sm:text-base text-rvu-muted leading-relaxed">
            Stay connected with RV University, mentor students, explore professional opportunities, and participate in institutional chapters.
          </p>
        </div>

        {submitted ? (
          <div className="card-glass rounded-2xl p-8 border border-gold/50 bg-navy-surface text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold-faint border border-gold/40 text-gold flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-rvu-text font-display mb-2">
              Registration Received
            </h2>
            <p className="text-sm text-rvu-muted max-w-md mx-auto mb-6">
              Thank you, {formData.fullName}. Your registration has been submitted to the Corporate & Alumni Relations (CAR) office for profile verification.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onBackToAlumni}
                className="px-5 py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
              >
                Return to Alumni Hub
              </button>
              <button
                onClick={() => onNavigatePortal('/')}
                className="px-5 py-2.5 rounded-xl bg-navy-dark border border-gold/30 text-xs font-semibold text-rvu-text hover:text-gold transition-all"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="card-glass rounded-2xl p-6 sm:p-8 border border-gold-border/40 bg-navy-surface space-y-6"
          >
            <div className="border-b border-gold-border/20 pb-4">
              <h2 className="text-base font-bold text-rvu-text font-display">
                Graduate Information
              </h2>
              <p className="text-xs text-rvu-muted">
                Fields are maintained in accordance with RVU Institutional Privacy Guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono text-rvu-subtle uppercase mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Arjun Sharma"
                  className="w-full px-3.5 py-2 rounded-xl bg-navy-dark border border-gold-border/30 text-rvu-text text-sm focus:outline-none focus:border-gold"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono text-rvu-subtle uppercase mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. arjun@alumni.rvu.edu.in"
                  className="w-full px-3.5 py-2 rounded-xl bg-navy-dark border border-gold-border/30 text-rvu-text text-sm focus:outline-none focus:border-gold"
                />
              </div>

              {/* Programme */}
              <div>
                <label className="block text-xs font-mono text-rvu-subtle uppercase mb-1.5">
                  RVU Programme *
                </label>
                <input
                  type="text"
                  required
                  value={formData.programme}
                  onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full px-3.5 py-2 rounded-xl bg-navy-dark border border-gold-border/30 text-rvu-text text-sm focus:outline-none focus:border-gold"
                />
              </div>

              {/* Year of Graduation */}
              <div>
                <label className="block text-xs font-mono text-rvu-subtle uppercase mb-1.5">
                  Year of Graduation *
                </label>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-navy-dark border border-gold-border/30 text-rvu-text text-sm focus:outline-none focus:border-gold"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>

              {/* Current Organisation */}
              <div>
                <label className="block text-xs font-mono text-rvu-subtle uppercase mb-1.5">
                  Current Organisation
                </label>
                <input
                  type="text"
                  value={formData.currentOrganisation}
                  onChange={(e) => setFormData({ ...formData, currentOrganisation: e.target.value })}
                  placeholder="e.g. Technology Global Inc."
                  className="w-full px-3.5 py-2 rounded-xl bg-navy-dark border border-gold-border/30 text-rvu-text text-sm focus:outline-none focus:border-gold"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-mono text-rvu-subtle uppercase mb-1.5">
                  Current Role / Title
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Cloud Software Engineer"
                  className="w-full px-3.5 py-2 rounded-xl bg-navy-dark border border-gold-border/30 text-rvu-text text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Engagement Preferences */}
            <div className="pt-2">
              <label className="block text-xs font-mono text-rvu-subtle uppercase mb-3">
                Engagement Interests
              </label>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 text-xs text-rvu-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.mentorshipInterest}
                    onChange={(e) => setFormData({ ...formData, mentorshipInterest: e.target.checked })}
                    className="rounded border-gold-border/40 text-gold focus:ring-gold"
                  />
                  <span>Participate in student mentoring and portfolio / interview reviews</span>
                </label>
                <label className="flex items-center gap-3 text-xs text-rvu-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.campusHiringInterest}
                    onChange={(e) => setFormData({ ...formData, campusHiringInterest: e.target.checked })}
                    className="rounded border-gold-border/40 text-gold focus:ring-gold"
                  />
                  <span>Connect company talent acquisition teams with RVU placement drives</span>
                </label>
                <label className="flex items-center gap-3 text-xs text-rvu-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.guestLecturesInterest}
                    onChange={(e) => setFormData({ ...formData, guestLecturesInterest: e.target.checked })}
                    className="rounded border-gold-border/40 text-gold focus:ring-gold"
                  />
                  <span>Deliver guest lectures, workshops, or industry masterclasses</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gold-border/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] text-rvu-subtle font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Verified through RVU Corporate & Alumni Relations</span>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
              >
                <span>Submit Registration</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
