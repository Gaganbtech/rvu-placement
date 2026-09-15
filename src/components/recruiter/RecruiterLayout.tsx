import React, { useState } from 'react';
import { usePlatformStore } from '../../data/platform/studentStore';
import { RecruiterSidebar } from './RecruiterSidebar';
import { RecruiterHeader } from './RecruiterHeader';

// Views
import { RecruiterDashboardView } from './views/RecruiterDashboardView';
import { RecruiterOpportunitiesView } from './views/RecruiterOpportunitiesView';
import { CreateOpportunityWizardView } from './views/CreateOpportunityWizardView';
import { OpportunityDetailView } from './views/OpportunityDetailView';
import { RecruiterApplicationsView } from './views/RecruiterApplicationsView';
import { ApplicationDetailView } from './views/ApplicationDetailView';
import { CandidateDirectoryView } from './views/CandidateDirectoryView';
import { CandidateProfileView } from './views/CandidateProfileView';
import { ShortlistManagementView } from './views/ShortlistManagementView';
import { AssessmentsListView } from './views/AssessmentsListView';
import { AssessmentResultsView } from './views/AssessmentResultsView';
import { RecruiterInterviewsView } from './views/RecruiterInterviewsView';
import { InterviewDetailView } from './views/InterviewDetailView';
import { RecruiterDrivesView } from './views/RecruiterDrivesView';
import { DriveDetailView } from './views/DriveDetailView';
import { RecruiterOffersView } from './views/RecruiterOffersView';
import { OfferDetailView } from './views/OfferDetailView';
import { RecruiterMessagesView } from './views/RecruiterMessagesView';
import { RecruiterNotificationsView } from './views/RecruiterNotificationsView';
import { RecruiterResourcesView } from './views/RecruiterResourcesView';
import { CompanyProfileView } from './views/CompanyProfileView';
import { RecruiterTeamView } from './views/RecruiterTeamView';
import { RecruiterAnalyticsView } from './views/RecruiterAnalyticsView';
import { RecruiterProfileView } from './views/RecruiterProfileView';
import { RecruiterSettingsView } from './views/RecruiterSettingsView';

interface RecruiterLayoutProps {
  currentPath: string;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
}

export const RecruiterLayout: React.FC<RecruiterLayoutProps> = ({
  currentPath,
  onNavigate,
  onBackToPublic
}) => {
  const store = usePlatformStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Normalize subroute string (strip any query params for view matching, but preserve for component params)
  const normalizedRoute = currentPath.startsWith('#') ? currentPath.slice(1) : currentPath;
  const pathWithoutQuery = normalizedRoute.split('?')[0];

  // Parse any query params
  const queryParams = new URLSearchParams(normalizedRoute.includes('?') ? normalizedRoute.split('?')[1] : '');
  const oppIdParam = queryParams.get('oppId') || undefined;
  const stageParam = queryParams.get('stage') || undefined;

  // View Dispatcher
  const renderCurrentView = () => {
    // 1. Create Opportunity Wizard
    if (pathWithoutQuery === '/recruiter/opportunities/new') {
      return <CreateOpportunityWizardView store={store} onNavigate={onNavigate} />;
    }

    // 2. Opportunity Detail
    if (pathWithoutQuery.startsWith('/recruiter/opportunities/')) {
      const oppId = pathWithoutQuery.replace('/recruiter/opportunities/', '');
      return <OpportunityDetailView opportunityId={oppId} store={store} onNavigate={onNavigate} />;
    }

    // 3. Opportunities List
    if (pathWithoutQuery === '/recruiter/opportunities' || pathWithoutQuery === '/recruiter/opportunities/') {
      return <RecruiterOpportunitiesView store={store} onNavigate={onNavigate} />;
    }

    // 4. Application Detail
    if (pathWithoutQuery.startsWith('/recruiter/applications/')) {
      const appId = pathWithoutQuery.replace('/recruiter/applications/', '');
      return <ApplicationDetailView applicationId={appId} store={store} onNavigate={onNavigate} />;
    }

    // 5. Applications List
    if (pathWithoutQuery === '/recruiter/applications' || pathWithoutQuery === '/recruiter/applications/') {
      return (
        <RecruiterApplicationsView
          store={store}
          onNavigate={onNavigate}
          initialOpportunityId={oppIdParam}
          initialStage={stageParam}
        />
      );
    }

    // 6. Candidate Profile Dossier
    if (pathWithoutQuery.startsWith('/recruiter/candidates/')) {
      const candId = pathWithoutQuery.replace('/recruiter/candidates/', '');
      return <CandidateProfileView candidateId={candId} store={store} onNavigate={onNavigate} />;
    }

    // 7. Candidate Directory
    if (pathWithoutQuery === '/recruiter/candidates' || pathWithoutQuery === '/recruiter/candidates/') {
      return <CandidateDirectoryView store={store} onNavigate={onNavigate} />;
    }

    // 8. Shortlist
    if (pathWithoutQuery === '/recruiter/shortlist' || pathWithoutQuery === '/recruiter/shortlist/') {
      return <ShortlistManagementView store={store} onNavigate={onNavigate} />;
    }

    // 9. Assessment Results
    if (pathWithoutQuery.startsWith('/recruiter/assessments/')) {
      const assessId = pathWithoutQuery.replace('/recruiter/assessments/', '');
      return <AssessmentResultsView assessmentId={assessId} store={store} onNavigate={onNavigate} />;
    }

    // 10. Assessments List
    if (pathWithoutQuery === '/recruiter/assessments' || pathWithoutQuery === '/recruiter/assessments/') {
      return <AssessmentsListView store={store} onNavigate={onNavigate} />;
    }

    // 11. Interview Detail Scorecard
    if (pathWithoutQuery.startsWith('/recruiter/interviews/')) {
      const intId = pathWithoutQuery.replace('/recruiter/interviews/', '');
      return <InterviewDetailView interviewId={intId} store={store} onNavigate={onNavigate} />;
    }

    // 12. Interviews List
    if (pathWithoutQuery === '/recruiter/interviews' || pathWithoutQuery === '/recruiter/interviews/') {
      return <RecruiterInterviewsView store={store} onNavigate={onNavigate} />;
    }

    // 13. Drive Detail
    if (pathWithoutQuery.startsWith('/recruiter/drives/')) {
      const driveId = pathWithoutQuery.replace('/recruiter/drives/', '');
      return <DriveDetailView driveId={driveId} store={store} onNavigate={onNavigate} />;
    }

    // 14. Drives List
    if (pathWithoutQuery === '/recruiter/drives' || pathWithoutQuery === '/recruiter/drives/') {
      return <RecruiterDrivesView store={store} onNavigate={onNavigate} />;
    }

    // 15. Offer Detail
    if (pathWithoutQuery.startsWith('/recruiter/offers/')) {
      const offerId = pathWithoutQuery.replace('/recruiter/offers/', '');
      return <OfferDetailView offerId={offerId} store={store} onNavigate={onNavigate} />;
    }

    // 16. Offers List
    if (pathWithoutQuery === '/recruiter/offers' || pathWithoutQuery === '/recruiter/offers/') {
      return <RecruiterOffersView store={store} onNavigate={onNavigate} />;
    }

    // 17. Messages
    if (pathWithoutQuery === '/recruiter/messages' || pathWithoutQuery === '/recruiter/messages/') {
      return <RecruiterMessagesView store={store} onNavigate={onNavigate} />;
    }

    // 18. Notifications
    if (pathWithoutQuery === '/recruiter/notifications' || pathWithoutQuery === '/recruiter/notifications/') {
      return <RecruiterNotificationsView store={store} onNavigate={onNavigate} />;
    }

    // 19. Policy & Resources
    if (pathWithoutQuery === '/recruiter/resources' || pathWithoutQuery === '/recruiter/resources/') {
      return <RecruiterResourcesView onNavigate={onNavigate} />;
    }

    // 20. Company Profile
    if (pathWithoutQuery === '/recruiter/company' || pathWithoutQuery === '/recruiter/company/') {
      return <CompanyProfileView store={store} onNavigate={onNavigate} />;
    }

    // 21. Team & Roles
    if (pathWithoutQuery === '/recruiter/team' || pathWithoutQuery === '/recruiter/team/') {
      return <RecruiterTeamView store={store} />;
    }

    // 22. Analytics
    if (pathWithoutQuery === '/recruiter/analytics' || pathWithoutQuery === '/recruiter/analytics/') {
      return <RecruiterAnalyticsView store={store} />;
    }

    // 23. Recruiter Profile
    if (pathWithoutQuery === '/recruiter/profile' || pathWithoutQuery === '/recruiter/profile/') {
      return <RecruiterProfileView store={store} />;
    }

    // 24. Settings
    if (pathWithoutQuery === '/recruiter/settings' || pathWithoutQuery === '/recruiter/settings/') {
      return <RecruiterSettingsView store={store} />;
    }

    // Default: Recruiter Dashboard
    return <RecruiterDashboardView store={store} onNavigate={onNavigate} />;
  };

  return (
    <div className="min-h-screen bg-[#101A22] text-white flex">
      {/* Sidebar */}
      <RecruiterSidebar
        currentSubroute={pathWithoutQuery}
        activeRecruiter={store.activeRecruiter}
        allRecruiters={store.recruiters}
        recruiterRole={store.recruiterRole}
        onSelectRecruiter={store.setActiveRecruiterId}
        onRoleChange={store.setRecruiterRole}
        applicationsCount={store.recruiterApplications.length}
        candidatesCount={store.recruiterCandidates.length}
        interviewsCount={store.recruiterInterviews.length}
        unreadMessagesCount={store.recruiterMessages.filter(m => !m.isRead).length}
        unreadNotificationsCount={store.unreadRecruiterNotificationsCount}
        onNavigate={onNavigate}
        onBackToPublic={onBackToPublic}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <RecruiterHeader
          currentSubroute={pathWithoutQuery}
          activeRecruiter={store.activeRecruiter}
          recruiterRole={store.recruiterRole}
          notifications={store.recruiterNotifications}
          unreadNotificationsCount={store.unreadRecruiterNotificationsCount}
          onMarkNotificationRead={store.markRecruiterNotificationRead}
          onMarkAllNotificationsRead={store.markAllRecruiterNotificationsRead}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigate={onNavigate}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};
