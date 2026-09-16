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
import { PlacementAIChatbot } from './components/ai/PlacementAIChatbot';
import type { UserRoleContext } from './services/placementRagEngine';

// Schools Experience Views & Service
import { SchoolDataService } from './services/schoolDataService';
import { SchoolDetailView } from './components/schools/SchoolDetailView';
import { ProgrammeDetailView } from './components/schools/ProgrammeDetailView';
import { SchoolsDirectoryView } from './components/schools/SchoolsDirectoryView';

// Opportunities Experience Views
import { OpportunitiesDirectoryView } from './components/opportunities/OpportunitiesDirectoryView';
import { OpportunityDetailPublicView } from './components/opportunities/OpportunityDetailPublicView';

// Global Network & Alumni Experience Views
import { GlobalNetworkView } from './components/network/GlobalNetworkView';
import { AlumniLandingView } from './components/alumni/AlumniLandingView';
import { AlumniJoinView } from './components/alumni/AlumniJoinView';

// Authentication Architecture
import { AuthProvider } from './context/AuthContext';
import { PortalSelector } from './components/auth/PortalSelector';
import { LoginPage } from './components/auth/LoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { RouteGuard } from './components/auth/RouteGuard';
import { DevAuthStatusPage } from './components/dev/DevAuthStatusPage';
import type { AuthRole } from './types/auth';

// Helper to determine the initial route synchronously to prevent blank screen
const getInitialRoute = (): string => {
  if (typeof window === 'undefined') return '/';
  
  // 1. Check Hash routing first
  const hash = window.location.hash;
  if (
    hash.startsWith('#/auth/callback') ||
    hash.startsWith('#/dev/auth-status') ||
    hash.startsWith('#/login') ||
    hash.startsWith('#/portals') ||
    hash.startsWith('#/forgot-password') ||
    hash.startsWith('#/student') ||
    hash.startsWith('#/recruiter') ||
    hash.startsWith('#/management') ||
    hash.startsWith('#/schools') ||
    hash.startsWith('#/opportunities') ||
    hash.startsWith('#/network') ||
    hash.startsWith('#/alumni')
  ) {
    return hash.slice(1);
  }

  // 2. Check Pathname routing
  const path = window.location.pathname;
  if (
    path.startsWith('/auth/callback') ||
    path.startsWith('/dev/auth-status') ||
    path.startsWith('/login') ||
    path.startsWith('/portals') ||
    path.startsWith('/forgot-password') ||
    path.startsWith('/student') ||
    path.startsWith('/management') ||
    path.startsWith('/recruiter') ||
    path.startsWith('/schools') ||
    path.startsWith('/opportunities') ||
    path.startsWith('/network') ||
    path.startsWith('/alumni')
  ) {
    // Preserve query parameters if present
    const search = window.location.search || '';
    return `${path}${search}`;
  }

  return '/';
};

const AppContent: React.FC = () => {
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

  const handleBackToSchoolsSection = () => {
    try {
      window.history.pushState({}, '', '/#schools');
    } catch {
      window.location.hash = 'schools';
    }
    setCurrentRoute('/');
    setTimeout(() => {
      scrollToSection('schools');
    }, 50);
  };

  const getChatbotRole = (): UserRoleContext => {
    if (currentRoute.startsWith('/student')) return 'student';
    if (currentRoute.startsWith('/recruiter')) return 'recruiter';
    if (currentRoute.startsWith('/management')) return 'management';
    return 'public';
  };

  const renderPageContent = () => {
    // 0. AUTHENTICATION & PORTAL SELECTOR ROUTES
    if (currentRoute.startsWith('/auth/callback')) {
      handleNavigatePortal('/login');
      return null;
    }

    if (currentRoute.startsWith('/dev/auth-status')) {
      return (
        <DevAuthStatusPage
          onNavigateHome={handleBackToPublic}
          onNavigateLogin={() => handleNavigatePortal('/login')}
        />
      );
    }

    if (currentRoute.startsWith('/portals')) {
      return (
        <PortalSelector
          onSelectPortal={(role) => handleNavigatePortal(`/login?role=${role}`)}
          onBackToPublic={handleBackToPublic}
        />
      );
    }

    if (currentRoute.startsWith('/login')) {
      const queryString = currentRoute.includes('?') ? currentRoute.split('?')[1] : '';
      const searchParams = new URLSearchParams(queryString);
      const roleParam = (searchParams.get('role') as AuthRole) || 'student';

      return (
        <LoginPage
          key={roleParam}
          initialRole={roleParam}
          onBackToPortals={() => handleNavigatePortal('/portals')}
          onLoginSuccess={(role) => {
            const target = role === 'student' ? '/student' : role === 'recruiter' ? '/recruiter' : '/management';
            handleNavigatePortal(target);
          }}
          onNavigateForgotPassword={() => handleNavigatePortal('/forgot-password')}
        />
      );
    }

    if (currentRoute.startsWith('/forgot-password')) {
      return (
        <ForgotPasswordPage
          onBackToLogin={() => handleNavigatePortal('/login')}
        />
      );
    }

    // 1. STUDENT PORTAL (All /student and /student/* routes)
    if (currentRoute.startsWith('/student')) {
      return (
        <RouteGuard
          requiredRole="student"
          currentPath={currentRoute}
          onNavigateLogin={(role) => handleNavigatePortal(`/login?role=${role}`)}
          onNavigatePortal={handleNavigatePortal}
        >
          <StudentLayout
            currentPath={currentRoute}
            onNavigate={handleNavigatePortal}
            onBackToPublic={handleBackToPublic}
          />
        </RouteGuard>
      );
    }

    // 2. MANAGEMENT PORTAL (All /management and /management/* routes)
    if (currentRoute.startsWith('/management')) {
      return (
        <RouteGuard
          requiredRole="placement-cell"
          currentPath={currentRoute}
          onNavigateLogin={(role) => handleNavigatePortal(`/login?role=${role}`)}
          onNavigatePortal={handleNavigatePortal}
        >
          <ManagementLayout
            currentPath={currentRoute}
            onNavigate={handleNavigatePortal}
            onBackToPublic={handleBackToPublic}
          />
        </RouteGuard>
      );
    }

    // 3. RECRUITER PORTAL (All /recruiter and /recruiter/* routes)
    if (currentRoute.startsWith('/recruiter')) {
      return (
        <RouteGuard
          requiredRole="recruiter"
          currentPath={currentRoute}
          onNavigateLogin={(role) => handleNavigatePortal(`/login?role=${role}`)}
          onNavigatePortal={handleNavigatePortal}
        >
          <RecruiterLayout
            currentPath={currentRoute}
            onNavigate={handleNavigatePortal}
            onBackToPublic={handleBackToPublic}
          />
        </RouteGuard>
      );
    }

    // 4. SCHOOLS EXPERIENCE (All /schools and /schools/* routes)
    if (currentRoute.startsWith('/schools')) {
      const cleanRoute = currentRoute.split('?')[0].split('#')[0];

      // Subroute: Programme Details (/schools/:schoolSlug/programmes/:programmeSlug)
      if (cleanRoute.includes('/programmes/')) {
        const parts = cleanRoute.replace('/schools/', '').split('/programmes/');
        const schoolSlug = parts[0];
        const programmeSlug = parts[1];
        const match = SchoolDataService.getProgrammeBySlug(schoolSlug, programmeSlug);
        if (match) {
          return (
            <ProgrammeDetailView
              school={match.school}
              programme={match.programme}
              onBackToSchool={() => handleNavigatePortal(`/schools/${schoolSlug}`)}
              onNavigatePortal={handleNavigatePortal}
            />
          );
        }
      }

      // Subroute: School Details (/schools/:schoolSlug)
      const schoolSlug = cleanRoute.replace('/schools', '').replace(/^\//, '');
      if (schoolSlug) {
        const school = SchoolDataService.getSchoolBySlug(schoolSlug);
        if (school) {
          return (
            <SchoolDetailView
              school={school}
              onBack={handleBackToSchoolsSection}
              onNavigateProgramme={(progSlug) => handleNavigatePortal(`/schools/${school.slug}/programmes/${progSlug}`)}
              onNavigateOpportunity={() => handleNavigatePortal('/opportunities')}
              onNavigatePortal={handleNavigatePortal}
            />
          );
        }
      }

      // Root of Schools Directory (/schools)
      return (
        <SchoolsDirectoryView
          onSelectSchool={(slug: string) => handleNavigatePortal(`/schools/${slug}`)}
          onBackToHub={handleBackToPublic}
        />
      );
    }

    // 5. OPPORTUNITIES EXPERIENCE (All /opportunities and /opportunities/* routes)
    if (currentRoute.startsWith('/opportunities')) {
      const cleanRoute = currentRoute.split('?')[0].split('#')[0];
      const oppId = cleanRoute.replace('/opportunities', '').replace(/^\//, '');

      if (oppId) {
        return (
          <OpportunityDetailPublicView
            opportunityId={oppId}
            onBack={() => handleNavigatePortal('/opportunities')}
            onNavigatePortal={handleNavigatePortal}
            onOpenStudentLoginModal={() => handleNavigatePortal('/login?role=student')}
          />
        );
      }

      return (
        <OpportunitiesDirectoryView
          onSelectOpportunity={(id: string) => handleNavigatePortal(`/opportunities/${id}`)}
          onBackToHub={handleBackToPublic}
          onNavigatePortal={handleNavigatePortal}
          onOpenStudentLoginModal={() => handleNavigatePortal('/login?role=student')}
        />
      );
    }

    // 6. GLOBAL NETWORK (All /network routes)
    if (currentRoute.startsWith('/network')) {
      return (
        <GlobalNetworkView
          onBackToHub={handleBackToPublic}
          onNavigatePortal={handleNavigatePortal}
        />
      );
    }

    // 7. ALUMNI HUB (All /alumni and /alumni/* routes)
    if (currentRoute.startsWith('/alumni')) {
      const cleanRoute = currentRoute.split('?')[0].split('#')[0];
      if (cleanRoute.startsWith('/alumni/join')) {
        return (
          <AlumniJoinView
            onBackToAlumni={() => handleNavigatePortal('/alumni')}
            onNavigatePortal={handleNavigatePortal}
          />
        );
      }
      return (
        <AlumniLandingView
          onBackToHub={handleBackToPublic}
          onNavigatePortal={handleNavigatePortal}
        />
      );
    }

    // 8. PUBLIC PORTAL (Root '/' route, completely untouched and intact)
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
            onNavigatePortal={handleNavigatePortal}
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
          <SchoolsTalent
            onNavigateSchool={(slug) => handleNavigatePortal(`/schools/${slug}`)}
            onNavigatePortal={handleNavigatePortal}
          />

          {/* 8. WHY RECRUIT AT RV UNIVERSITY (6 Official Value Propositions) */}
          <WhyRecruit />

          {/* 9. CAREER JOURNEY ROADMAP */}
          <CareerJourney />

          {/* 10. OPPORTUNITY DISCOVERY */}
          <OpportunityExplorer
            onNavigatePortal={handleNavigatePortal}
            onOpenStudentLoginModal={() => handleNavigatePortal('/login?role=student')}
          />

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
            onNavigatePortal={handleNavigatePortal}
          />

          {/* 14. STUDENT SUCCESS STORIES / ALUMNI & CANDIDATE EXCELLENCE */}
          <SuccessStories
            onNavigatePortal={handleNavigatePortal}
          />

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
          onNavigateLogin={() => handleNavigatePortal('/login?role=student')}
        />

      </div>
    );
  };

  return (
    <>
      {renderPageContent()}
      <PlacementAIChatbot
        currentRole={getChatbotRole()}
        onNavigate={handleNavigatePortal}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
