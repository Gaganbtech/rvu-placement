import React, { useState } from 'react';
import { usePlatformStore } from '../../data/platform/studentStore';
import { ManagementSidebar } from './ManagementSidebar';
import { ManagementHeader } from './ManagementHeader';
import type { UserRole } from '../../data/platform/types';

// Views
import { ManagementDashboardView } from './views/ManagementDashboardView';
import { StudentManagementView } from './views/StudentManagementView';
import { StudentImportView } from './views/StudentImportView';
import { StudentImportHistoryView } from './views/StudentImportHistoryView';
import { StudentDetail360View } from './views/StudentDetail360View';
import { StudentManualCreateView } from './views/StudentManualCreateView';
import { CompanyManagementView } from './views/CompanyManagementView';
import { RecruiterManagementView } from './views/RecruiterManagementView';
import { DriveManagementView } from './views/DriveManagementView';
import { OpportunityManagementView } from './views/OpportunityManagementView';
import { ApplicationManagementView } from './views/ApplicationManagementView';
import { InterviewManagementView } from './views/InterviewManagementView';
import { OfferManagementView } from './views/OfferManagementView';
import { AnnouncementsView } from './views/AnnouncementsView';
import { SupportTicketsView } from './views/SupportTicketsView';
import { AnalyticsView } from './views/AnalyticsView';
import { ReportsView } from './views/ReportsView';
import { ResourcesManagementView } from './views/ResourcesManagementView';
import { AuditLogView } from './views/AuditLogView';
import { SettingsView } from './views/SettingsView';

interface ManagementLayoutProps {
  currentPath: string;
  onNavigate: (route: string) => void;
  onBackToPublic: () => void;
}

export const ManagementLayout: React.FC<ManagementLayoutProps> = ({
  currentPath,
  onNavigate,
  onBackToPublic
}) => {
  const store = usePlatformStore();
  const [currentRole, setCurrentRole] = useState<UserRole>('CAR_ADMIN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Normalize subroute string
  const normalizedRoute = currentPath.startsWith('#') ? currentPath.slice(1) : currentPath;

  // Compute pending items for badges
  const pendingOffersCount = store.offers.filter(o => !o.placementOfficeVerified).length;
  const pendingApprovalsCount = store.recruiters.filter(r => r.verificationStatus === 'PENDING').length;
  const openTicketsCount = store.tickets.filter(t => t.status === 'OPEN').length;

  // View dispatcher
  const renderCurrentView = () => {
    // 1. Student Excel Import
    if (normalizedRoute === '/management/students/import' || normalizedRoute === '/management/students/import/') {
      return <StudentImportView store={store} onNavigate={onNavigate} />;
    }

    // 2. Student Import History
    if (normalizedRoute === '/management/students/import-history' || normalizedRoute === '/management/students/import-history/') {
      return <StudentImportHistoryView store={store} onNavigate={onNavigate} />;
    }

    // 3. Add Student Manually
    if (normalizedRoute === '/management/students/new' || normalizedRoute === '/management/students/new/') {
      return <StudentManualCreateView store={store} onNavigate={onNavigate} />;
    }

    // 4. Student 360 Profile
    if (normalizedRoute.startsWith('/management/students/')) {
      const studentId = normalizedRoute.replace('/management/students/', '').split('?')[0].split('#')[0];
      return <StudentDetail360View studentId={studentId} store={store} onNavigate={onNavigate} />;
    }

    // 5. Student Master Directory
    if (normalizedRoute === '/management/students' || normalizedRoute === '/management/students/') {
      return <StudentManagementView store={store} onNavigate={onNavigate} />;
    }

    // 6. Companies
    if (normalizedRoute.startsWith('/management/companies')) {
      return <CompanyManagementView store={store} onNavigate={onNavigate} />;
    }

    // 7. Recruiters
    if (normalizedRoute.startsWith('/management/recruiters')) {
      return <RecruiterManagementView store={store} onNavigate={onNavigate} />;
    }

    // 8. Placement Drives
    if (normalizedRoute.startsWith('/management/drives')) {
      return <DriveManagementView store={store} onNavigate={onNavigate} />;
    }

    // 9. Opportunities Desk
    if (normalizedRoute.startsWith('/management/opportunities')) {
      return <OpportunityManagementView store={store} onNavigate={onNavigate} />;
    }

    // 10. Applications Pipeline
    if (normalizedRoute.startsWith('/management/applications')) {
      return <ApplicationManagementView store={store} onNavigate={onNavigate} />;
    }

    // 11. Interviews Schedule
    if (normalizedRoute.startsWith('/management/interviews')) {
      return <InterviewManagementView store={store} onNavigate={onNavigate} />;
    }

    // 12. Offers & Verification
    if (normalizedRoute.startsWith('/management/offers')) {
      return <OfferManagementView store={store} onNavigate={onNavigate} />;
    }

    // 13. Announcements & Communications
    if (normalizedRoute.startsWith('/management/announcements') || normalizedRoute.startsWith('/management/communications')) {
      return <AnnouncementsView store={store} onNavigate={onNavigate} />;
    }

    // 14. Support Tickets
    if (normalizedRoute.startsWith('/management/support')) {
      return <SupportTicketsView store={store} onNavigate={onNavigate} />;
    }

    // 15. Analytics
    if (normalizedRoute.startsWith('/management/analytics')) {
      return <AnalyticsView store={store} onNavigate={onNavigate} />;
    }

    // 16. Reports
    if (normalizedRoute.startsWith('/management/reports')) {
      return <ReportsView store={store} onNavigate={onNavigate} />;
    }

    // 17. Resources & Policies
    if (normalizedRoute.startsWith('/management/resources')) {
      return <ResourcesManagementView store={store} onNavigate={onNavigate} />;
    }

    // 18. Audit Log
    if (normalizedRoute.startsWith('/management/audit-log')) {
      return <AuditLogView store={store} onNavigate={onNavigate} />;
    }

    // 19. Settings
    if (normalizedRoute.startsWith('/management/settings')) {
      return <SettingsView store={store} onNavigate={onNavigate} />;
    }

    // Default: Command Dashboard
    return <ManagementDashboardView store={store} onNavigate={onNavigate} />;
  };

  return (
    <div className="min-h-screen bg-[#0C1319] text-rvu-text flex">
      {/* Sidebar */}
      <ManagementSidebar
        currentSubroute={normalizedRoute}
        currentRole={currentRole}
        pendingOffersCount={pendingOffersCount}
        pendingApprovalsCount={pendingApprovalsCount}
        openTicketsCount={openTicketsCount}
        onNavigate={onNavigate}
        onBackToPublic={onBackToPublic}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ManagementHeader
          currentSubroute={normalizedRoute}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigate={onNavigate}
          onBackToPublic={onBackToPublic}
        />

        {/* Dynamic Sub-view */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};
