import React from 'react';
import { FOOTER_SECTIONS } from '../../data/navigation';
import { RVU_BRAND } from '../../data/rvu';
import { 
  MapPin, 
  Mail, 
  ShieldCheck, 
  ArrowUp,
  Building2,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onOpenRecruiterModal: () => void;
  onNavigatePortal: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRecruiterModal,
  onNavigatePortal
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-navy-dark border-t border-gold-border text-rvu-text pt-16 pb-12 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-tech-circuit opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Top Institutional Branding Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-gold-border/40">
          
          {/* Brand & Address Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <a href="#home" className="inline-flex items-center gap-3">
              <img 
                src="/src/assets/rvu-logo-gold.svg" 
                alt="RV University Crest" 
                className="h-12 w-auto object-contain"
              />
              <div className="flex flex-col border-l border-gold/40 pl-3">
                <span className="text-sm font-bold tracking-widest text-rvu-text font-display uppercase">
                  {RVU_BRAND.name}
                </span>
                <span className="text-xs font-serif italic text-gold font-medium">
                  "{RVU_BRAND.tagline}"
                </span>
              </div>
            </a>

            <p className="text-xs text-rvu-muted leading-relaxed max-w-md">
              RV University is established under the Rashtreeya Sikshana Samithi Trust (RSST), carrying {RVU_BRAND.legacyYears} to deliver liberal education, interdisciplinary excellence, and future-calibrated career pathways.
            </p>

            <div className="space-y-2 pt-2 text-xs text-rvu-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{RVU_BRAND.location.fullAddress}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium text-rvu-text">{RVU_BRAND.contact.office}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${RVU_BRAND.contact.email}`} className="text-gold hover:underline">
                  {RVU_BRAND.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Nav Columns (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            
            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gold uppercase tracking-wider font-mono">
                Explore Hub
              </h4>
              <ul className="space-y-2 text-xs">
                {FOOTER_SECTIONS.quickLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-rvu-muted hover:text-gold transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Students */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gold uppercase tracking-wider font-mono">
                Students
              </h4>
              <ul className="space-y-2 text-xs">
                {FOOTER_SECTIONS.students.map((item) => (
                  <li key={item.label}>
                    {item.isPortal ? (
                      <button
                        onClick={() => onNavigatePortal(item.href)}
                        className="text-left text-rvu-muted hover:text-gold transition-colors flex items-center gap-1"
                      >
                        <span>{item.label}</span>
                        <ExternalLink className="w-3 h-3 text-gold/60" />
                      </button>
                    ) : (
                      <a href={item.href} className="text-rvu-muted hover:text-gold transition-colors">
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recruiters */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gold uppercase tracking-wider font-mono">
                Recruiters
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button 
                    onClick={onOpenRecruiterModal} 
                    className="text-left text-rvu-muted hover:text-gold transition-colors"
                  >
                    Recruit at RVU
                  </button>
                </li>
                {FOOTER_SECTIONS.recruiters.map((item) => (
                  <li key={item.label}>
                    {item.isPortal ? (
                      <button
                        onClick={() => onNavigatePortal(item.href)}
                        className="text-left text-rvu-muted hover:text-gold transition-colors flex items-center gap-1"
                      >
                        <span>{item.label}</span>
                        <ExternalLink className="w-3 h-3 text-gold/60" />
                      </button>
                    ) : (
                      <a href={item.href} className="text-rvu-muted hover:text-gold transition-colors">
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Parents & Administration */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gold uppercase tracking-wider font-mono">
                Portals & Links
              </h4>
              <ul className="space-y-2 text-xs">
                {FOOTER_SECTIONS.parents.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-rvu-muted hover:text-gold transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
                {FOOTER_SECTIONS.management.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => onNavigatePortal(item.href)}
                      className="text-left text-rvu-muted hover:text-gold transition-colors flex items-center gap-1"
                    >
                      <span>{item.label}</span>
                      <ExternalLink className="w-3 h-3 text-gold/60" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Legal & Accreditation Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rvu-subtle">
          <div className="flex flex-wrap items-center gap-4 text-center sm:text-left">
            <span>© 2026 RV University. All rights reserved.</span>
            <span>•</span>
            <span className="font-serif italic text-gold">"{RVU_BRAND.tagline}"</span>
            <span>•</span>
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] text-rvu-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>{RVU_BRAND.foundedBy}</span>
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-navy-surface border border-gold/30 text-rvu-muted hover:text-gold hover:border-gold transition-all"
              aria-label="Scroll to top of page"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
