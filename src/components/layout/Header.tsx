import React, { useState, useEffect } from 'react';
import { Menu, X, User, ArrowRight, Sparkles, ShieldCheck, Building2 } from 'lucide-react';
import { NAV_LINKS, PORTAL_ROUTES } from '../../data/navigation';
import { RVU_BRAND } from '../../data/rvu';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenRecruiterModal: () => void;
  onNavigatePortal: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRecruiterModal,
  onNavigatePortal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy-dark/95 backdrop-blur-md border-b border-gold-border shadow-card-dark py-3' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Official Brand Lockup: Logo + RV UNIVERSITY + "Go, change the world" */}
          <a 
            href="#home" 
            className="flex items-center gap-3 group focus-visible:outline-none"
            aria-label="RV University Career Hub Home"
          >
            <div className="relative flex items-center">
              <img 
                src="/src/assets/rvu-logo-gold.svg" 
                alt="RV University Logo" 
                className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col border-l border-gold/40 pl-3">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-rvu-text uppercase font-display leading-tight">
                {RVU_BRAND.name}
              </span>
              <span className="text-[11px] font-serif italic text-gold font-medium tracking-normal">
                "{RVU_BRAND.tagline}"
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-2.5 py-1.5 rounded-md text-xs xl:text-sm font-medium text-rvu-muted hover:text-gold hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => onNavigatePortal(PORTAL_ROUTES.student)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rvu-muted hover:text-gold hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-gold" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => onNavigatePortal(PORTAL_ROUTES.recruiter)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rvu-muted hover:text-gold hover:bg-white/5 transition-colors flex items-center gap-1.5"
              title="RVU Corporate Connect (Recruiter Portal)"
            >
              <Building2 className="w-3.5 h-3.5 text-gold" />
              <span>Recruiter Portal</span>
            </button>

            <button
              onClick={() => onNavigatePortal(PORTAL_ROUTES.management)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rvu-muted hover:text-gold hover:bg-white/5 transition-colors flex items-center gap-1.5"
              title="CAR Placement Cell Command Center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>Placement Cell</span>
            </button>
            
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={onOpenRecruiterModal}
            >
              Recruit at RVU
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-rvu-muted hover:text-gold hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-card/98 border-b border-gold-border px-4 pt-3 pb-6 space-y-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-rvu-text hover:text-gold hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Tagline highlight in mobile menu */}
          <div className="px-3 py-2 text-center rounded-lg bg-gold-faint/60 border border-gold/30">
            <span className="text-xs font-serif italic text-gold">
              "{RVU_BRAND.tagline}"
            </span>
          </div>

          <div className="pt-3 border-t border-gold-border/60 flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                icon={<User className="w-3.5 h-3.5" />}
                iconPosition="left"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigatePortal(PORTAL_ROUTES.student);
                }}
                className="justify-center text-[11px] px-1"
              >
                Student
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={<Building2 className="w-3.5 h-3.5 text-gold" />}
                iconPosition="left"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigatePortal(PORTAL_ROUTES.recruiter);
                }}
                className="justify-center text-[11px] px-1"
              >
                Recruiter
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={<ShieldCheck className="w-3.5 h-3.5 text-gold" />}
                iconPosition="left"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigatePortal(PORTAL_ROUTES.management);
                }}
                className="justify-center text-[11px] px-1"
              >
                CAR Cell
              </Button>
            </div>
            
            <Button
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRecruiterModal();
              }}
              className="w-full justify-center"
            >
              Recruit at RVU
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

