import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/hero/Hero';
import { PlacementImpact } from './components/placement/PlacementImpact';
import { BeyondPlacements } from './components/placement/BeyondPlacements';
import { PlacementPerformance } from './components/placement/PlacementPerformance';
import { EligibleTalent } from './components/talent/EligibleTalent';
import { SchoolsTalent } from './components/schools/SchoolsTalent';
import { WhyRecruit } from './components/recruiters/WhyRecruit';
import { CareerJourney } from './components/journey/CareerJourney';
import { OpportunityExplorer } from './components/opportunities/OpportunityExplorer';
import { StakeholderCards } from './components/stakeholders/StakeholderCards';
import { PlacementInsights } from './components/placement/PlacementInsights';
import { IndustryPartners } from './components/partners/IndustryPartners';
import { SuccessStories } from './components/stories/SuccessStories';
import { CareerResources } from './components/resources/CareerResources';
import { AICareerAssistant } from './components/ai/AICareerAssistant';
import { SignatureBrandMoment } from './components/brand/SignatureBrandMoment';
import { FinalCTA } from './components/cta/FinalCTA';
import { Footer } from './components/layout/Footer';
import { RecruiterModal } from './components/stakeholders/RecruiterModal';
import { StudentLoginModal } from './components/stakeholders/StudentLoginModal';
import { StudentLayout } from './components/student/StudentLayout';
import { ManagementLayout } from './components/management/ManagementLayout';
import { RecruiterLayout } from './components/recruiter/RecruiterLayout';

// Helper to determine the initial route synchronously to prevent blank screen
const getInitialRoute = (): string => {
  if (typeof window === 'undefined') return '/';
  
  // 1. Check Hash routing first (e.g., #/student, #/management, #/recruiter)
  const hash = window.location.hash;
  if (hash.startsWith('#/student') || hash.startsWith('#/recruiter') || hash.startsWith('#/management')) {
    return hash.slice(1);
  }

  // 2. Check Pathname routing (e.g., /student, /management, /recruiter)
  const path = window.location.pathname;
  if (path.startsWith('/student') || path.startsWith('/management') || path.startsWith('/recruiter')) {
    return path;
  }

  return '/';
};

export const App: React.FC = () => {
  const [recruiterModalOpen, setRecruiterModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      const detected = getInitialRoute();
      setCurrentRoute(detected);
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const handleNavigatePortal = (route: string) => {
    try {
      window.history.pushState({}, '', route);
    } catch {
      window.location.hash = route;
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPublic = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      window.location.hash = '';
    }
    setCurrentRoute('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. STUDENT PORTAL (All /student and /student/* routes)
  if (currentRoute.startsWith('/student')) {
    return (
      <StudentLayout
        currentPath={currentRoute}
        onNavigate={handleNavigatePortal}
        onBackToPublic={handleBackToPublic}
      />
    );
  }

  // 2. MANAGEMENT PORTAL (All /management and /management/* routes)
  if (currentRoute.startsWith('/management')) {
    return (
      <ManagementLayout
        currentPath={currentRoute}
        onNavigate={handleNavigatePortal}
        onBackToPublic={handleBackToPublic}
      />
    );
  }

  // 3. RECRUITER PORTAL (All /recruiter and /recruiter/* routes)
  if (currentRoute.startsWith('/recruiter')) {
    return (
      <RecruiterLayout
        currentPath={currentRoute}
        onNavigate={handleNavigatePortal}
        onBackToPublic={handleBackToPublic}
      />
    );
  }

  // 4. PUBLIC PORTAL (Root '/' route, completely untouched and intact)
  return (
    <div className="relative min-h-screen bg-navy-dark text-rvu-text selection:bg-gold selection:text-navy-dark overflow-x-hidden">
      
      {/* 1. STICKY HEADER */}
      <Header
        onOpenRecruiterModal={() => setRecruiterModalOpen(true)}
        onNavigatePortal={handleNavigatePortal}
      />

      <main>
        {/* 2. PUBLIC PORTAL HERO */}
        <Hero
          onOpenRecruiterModal={() => setRecruiterModalOpen(true)}
          onExploreOpportunities={() => scrollToSection('opportunities')}
        />

        {/* 3. PLACEMENT IMPACT (Verified 2025–26 Data) */}
        <PlacementImpact />

        {/* 4. PLACEMENT STORY: BEYOND PLACEMENTS */}
        <BeyondPlacements />

        {/* 5. PLACEMENT PERFORMANCE (Aviatrix ₹43.5 LPA, Salary Distribution, Multi-offers) */}
        <PlacementPerformance />

        {/* 6. ELIGIBLE TALENT POOL (1,608 Students Breakdown) */}
        <EligibleTalent />

        {/* 7. 9 ACADEMIC SCHOOLS & TALENT ECOSYSTEM */}
        <SchoolsTalent />

        {/* 8. WHY RECRUIT AT RV UNIVERSITY (6 Official Value Propositions) */}
        <WhyRecruit />

        {/* 9. CAREER JOURNEY ROADMAP */}
        <CareerJourney />

        {/* 10. OPPORTUNITY DISCOVERY */}
        <OpportunityExplorer />

        {/* 11. THREE STAKEHOLDER PATHWAYS & CTAs */}
        <StakeholderCards
          onExploreStudentHub={() => handleNavigatePortal('/student')}
          onOpenRecruiterModal={() => setRecruiterModalOpen(true)}
          onNavigatePortal={handleNavigatePortal}
        />

        {/* 12. PLACEMENT INSIGHTS ANALYTICS */}
        <PlacementInsights />

        {/* 13. INDUSTRY PARTNERS NETWORK */}
        <IndustryPartners
          onOpenRecruiterModal={() => setRecruiterModalOpen(true)}
        />

        {/* 14. STUDENT SUCCESS STORIES */}
        <SuccessStories />

        {/* 15. CAREER RESOURCES TOOLKIT */}
        <CareerResources />

        {/* 16. AI CAREER ASSISTANT PREVIEW */}
        <AICareerAssistant />

        {/* 17. SIGNATURE BRAND MOMENT: "GO, CHANGE THE WORLD." */}
        <SignatureBrandMoment />

        {/* 18. FINAL CALL TO ACTION */}
        <FinalCTA
          onExploreOpportunities={() => scrollToSection('opportunities')}
          onOpenRecruiterModal={() => setRecruiterModalOpen(true)}
        />
      </main>

      {/* 19. INSTITUTIONAL FOOTER */}
      <Footer
        onOpenRecruiterModal={() => setRecruiterModalOpen(true)}
        onNavigatePortal={handleNavigatePortal}
      />

      {/* Global Modals */}
      <RecruiterModal
        isOpen={recruiterModalOpen}
        onClose={() => setRecruiterModalOpen(false)}
      />

      <StudentLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={() => handleNavigatePortal('/student')}
      />

    </div>
  );
};

export default App;
