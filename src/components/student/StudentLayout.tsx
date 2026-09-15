import React, { useState } from 'react';
import { useStudentStore } from '../../data/platform/studentStore';
import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';
import { ApplyModal } from './modals/ApplyModal';
import type { Opportunity } from '../../data/platform/types';

// Views
import { StudentDashboardView } from './views/StudentDashboardView';
import { StudentOpportunitiesView } from './views/StudentOpportunitiesView';
import { StudentOpportunityDetailView } from './views/StudentOpportunityDetailView';
import { StudentApplicationsView } from './views/StudentApplicationsView';
import { StudentApplicationDetailView } from './views/StudentApplicationDetailView';
import { StudentDrivesView } from './views/StudentDrivesView';
import { StudentOffersView } from './views/StudentOffersView';
import { StudentPreparationView } from './views/StudentPreparationView';
import { StudentSkillsView } from './views/StudentSkillsView';
import { StudentCalendarView } from './views/StudentCalendarView';
import { StudentResourcesView } from './views/StudentResourcesView';
import { StudentDocumentsView } from './views/StudentDocumentsView';
import { StudentProfileView } from './views/StudentProfileView';
import { StudentNotificationsView } from './views/StudentNotificationsView';
import { StudentHelpSupportView } from './views/StudentHelpSupportView';

interface StudentLayoutProps {
  currentPath: string;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  currentPath,
  onNavigate,
  onBackToPublic
}) => {
  const store = useStudentStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applyModalOpp, setApplyModalOpp] = useState<Opportunity | null>(null);

  // Active resume for application
  const activeResume = store.documents.find(d => d.type === 'RESUME' && d.isActiveForApplications);

  // Normalize subroute string
  const normalizedRoute = currentPath.startsWith('#') ? currentPath.slice(1) : currentPath;

  // View dispatcher
  const renderCurrentView = () => {
    // 1. Opportunity Detail
    if (normalizedRoute.startsWith('/student/opportunities/')) {
      const oppId = normalizedRoute.replace('/student/opportunities/', '').split('?')[0].split('#')[0];
      return (
        <StudentOpportunityDetailView
          opportunityId={oppId}
          student={store.student}
          opportunities={store.opportunities}
          applications={store.applications}
          onNavigate={onNavigate}
          onOpenApplyModal={(opp) => setApplyModalOpp(opp)}
        />
      );
    }

    // 2. Opportunities List
    if (normalizedRoute === '/student/opportunities' || normalizedRoute === '/student/opportunities/') {
      return (
        <StudentOpportunitiesView
          student={store.student}
          opportunities={store.opportunities}
          applications={store.applications}
          onNavigate={onNavigate}
          onOpenApplyModal={(opp) => setApplyModalOpp(opp)}
        />
      );
    }

    // 3. Application Detail
    if (normalizedRoute.startsWith('/student/applications/')) {
      const appId = normalizedRoute.replace('/student/applications/', '').split('?')[0].split('#')[0];
      return (
        <StudentApplicationDetailView
          applicationId={appId}
          student={store.student}
          applications={store.applications}
          onNavigate={onNavigate}
        />
      );
    }

    // 4. Applications List
    if (normalizedRoute === '/student/applications' || normalizedRoute === '/student/applications/') {
      return (
        <StudentApplicationsView
          student={store.student}
          applications={store.applications}
          onNavigate={onNavigate}
        />
      );
    }

    // 5. Placement Drives
    if (normalizedRoute.startsWith('/student/drives')) {
      return (
        <StudentDrivesView
          student={store.student}
          placementDrives={store.placementDrives}
          opportunities={store.opportunities}
          applications={store.applications}
          onNavigate={onNavigate}
          onOpenApplyModal={(opp) => setApplyModalOpp(opp)}
        />
      );
    }

    // 6. Offers
    if (normalizedRoute.startsWith('/student/offers')) {
      return (
        <StudentOffersView
          student={store.student}
          offers={store.offers}
          onAcceptOffer={store.acceptOffer}
          onDeclineOffer={store.declineOffer}
        />
      );
    }

    // 7. Career Preparation
    if (normalizedRoute.startsWith('/student/preparation')) {
      return (
        <StudentPreparationView
          student={store.student}
          onNavigate={onNavigate}
        />
      );
    }

    // 8. Skills & Gaps
    if (normalizedRoute.startsWith('/student/skills')) {
      return (
        <StudentSkillsView
          student={store.student}
          onNavigate={onNavigate}
        />
      );
    }

    // 9. Calendar
    if (normalizedRoute.startsWith('/student/calendar')) {
      return (
        <StudentCalendarView
          student={store.student}
          calendarEvents={store.calendarEvents}
          onNavigate={onNavigate}
        />
      );
    }

    // 10. Resources & Policy
    if (normalizedRoute.startsWith('/student/resources')) {
      return (
        <StudentResourcesView />
      );
    }

    // 11. Documents
    if (normalizedRoute.startsWith('/student/documents')) {
      return (
        <StudentDocumentsView
          student={store.student}
          documents={store.documents}
          onUploadResume={store.uploadResume}
        />
      );
    }

    // 12. Student Profile
    if (normalizedRoute.startsWith('/student/profile')) {
      return (
        <StudentProfileView
          student={store.student}
          onNavigate={onNavigate}
        />
      );
    }

    // 13. Notifications Center
    if (normalizedRoute.startsWith('/student/notifications')) {
      return (
        <StudentNotificationsView
          student={store.student}
          notifications={store.notifications}
          onMarkRead={store.markNotificationRead}
          onMarkAllRead={store.markAllNotificationsRead}
          onNavigate={onNavigate}
        />
      );
    }

    // 14. Support Desk
    if (normalizedRoute.startsWith('/student/support') || normalizedRoute.startsWith('/student/help')) {
      return (
        <StudentHelpSupportView
          student={store.student}
          tickets={store.tickets}
          onCreateTicket={store.createSupportTicket}
        />
      );
    }

    // Default / Fallback: Student Dashboard
    return (
      <StudentDashboardView
        student={store.student}
        opportunities={store.opportunities}
        applications={store.applications}
        announcements={store.announcements}
        calendarEvents={store.calendarEvents}
        onNavigate={onNavigate}
        onOpenApplyModal={(opp) => setApplyModalOpp(opp)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#0E1720] text-rvu-text flex overflow-x-hidden selection:bg-gold selection:text-navy-dark">
      
      {/* 1. SIDEBAR */}
      <StudentSidebar
        currentSubroute={normalizedRoute}
        onNavigate={onNavigate}
        onBackToPublic={onBackToPublic}
        unreadNotifications={store.unreadNotificationsCount}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky Header */}
        <StudentHeader
          student={store.student}
          currentSubroute={normalizedRoute}
          unreadCount={store.unreadNotificationsCount}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigate={onNavigate}
          onBackToPublic={onBackToPublic}
        />

        {/* Scrollable View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>

        {/* Institutional Minimal Footer */}
        <footer className="p-4 border-t border-gold-border/20 bg-[#0A121A] text-center text-xs font-mono text-rvu-subtle">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>RV University Placement & Career Management Platform</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-gold italic font-serif">"Go, change the world"</span>
            <span className="hidden sm:inline">•</span>
            <span>Corporate & Alumni Relations (CAR) Directorate</span>
          </div>
        </footer>

      </div>

      {/* Apply Modal */}
      {applyModalOpp && (
        <ApplyModal
          isOpen={true}
          onClose={() => setApplyModalOpp(null)}
          opportunity={applyModalOpp}
          student={store.student}
          activeResume={activeResume}
          onConfirmApply={(oppId) => store.applyToOpportunity(oppId)}
          onViewApplication={(appId) => onNavigate(`/student/applications/${appId}`)}
        />
      )}

    </div>
  );
};
