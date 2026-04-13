import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '@/store';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Pages
import LandingPage from '@/pages/LandingPage';
import CollegeAdminDashboard from '@/pages/dashboard/CollegeAdminDashboard';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HackathonsPage from '@/pages/HackathonsPage';
import HackathonDetailPage from '@/pages/HackathonDetailPage';
import HackathonRegistrationPage from '@/pages/HackathonRegistrationPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import ResourcesPage from '@/pages/ResourcesPage';
import WebinarsPage from '@/pages/dashboard/WebinarsPage';
import AdminWebinarsPage from '@/pages/dashboard/AdminWebinarsPage';
import CreateWebinarPage from '@/pages/dashboard/CreateWebinarPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import CollegesPage from '@/pages/CollegesPage';

// Dashboard Pages
import StudentDashboard from '@/pages/dashboard/StudentDashboard';
import MyHackathonsPage from '@/pages/dashboard/MyHackathonsPage';
import StudentProfilePage from '@/pages/dashboard/StudentProfilePage';
import StudentHackathonDetailPage from '@/pages/dashboard/HackathonDetailPage';
import StudentEventsDashboard from '@/pages/dashboard/StudentEventsDashboard';
import TeamDetailsPage from '@/pages/dashboard/team/TeamDetailsPage';
import StudentAnalyticsDashboard from '@/pages/dashboard/StudentAnalyticsDashboard';
import FacultyDashboard from '@/pages/dashboard/FacultyDashboard';
import FacultyEventsDashboard from '@/pages/dashboard/FacultyEventsDashboard';
import FacultyEventDetailPage from '@/pages/dashboard/FacultyEventDetailPage';
import FacultyEventCreatePage from '@/pages/dashboard/FacultyEventCreatePage';
import FacultyHackathonsDashboard from '@/pages/dashboard/FacultyHackathonsDashboard';
import FacultyHackathonDetailPage from '@/pages/dashboard/FacultyHackathonDetailPage';
import FacultyHackathonCreatePage from '@/pages/dashboard/FacultyHackathonCreatePage';
import FacultyAnalyticsDashboard from '@/pages/dashboard/FacultyAnalyticsDashboard';
import FacultyStudentManagement from '@/pages/dashboard/FacultyStudentManagement';
import FacultyResourcesPage from '@/pages/dashboard/FacultyResourcesPage';
import TeamsPage from '@/pages/dashboard/TeamsPage';
import FacultyWebinarsPage from '@/pages/dashboard/FacultyWebinarsPage';
import FacultyClubsPage from '@/pages/dashboard/FacultyClubsPage';
import FacultyClubDashboard from '@/pages/dashboard/FacultyClubDashboard';
import FacultyCertificatesPage from '@/pages/dashboard/FacultyCertificatesPage';
import FacultyNotificationsPage from '@/pages/dashboard/FacultyNotificationsPage';
import FacultyStartEventPage from '@/pages/dashboard/FacultyStartEventPage';
import FacultyReportsPage from '@/pages/dashboard/FacultyReportsPage';
import FacultyHackathonTeamsPage from '@/pages/dashboard/FacultyHackathonTeamsPage';
import FacultyHackathonLeaderboardPage from '@/pages/dashboard/FacultyHackathonLeaderboardPage';

import AmbassadorDashboard from '@/pages/dashboard/ambassador/AmbassadorDashboard';
import Referrals from '@/pages/dashboard/ambassador/Referrals';
import Leaderboard from '@/pages/dashboard/ambassador/Leaderboard';
import Colleges from '@/pages/dashboard/ambassador/Colleges';
import Analytics from '@/pages/dashboard/ambassador/Analytics';
import PromotionToolkit from '@/pages/dashboard/ambassador/PromotionToolkit';
import ReferredStudents from '@/pages/dashboard/ambassador/ReferredStudents';
import NetworkMap from '@/pages/dashboard/ambassador/NetworkMap';
import AssignedEventsAmbassador from '@/pages/dashboard/ambassador/AssignedEvents';
import SuperAdminDashboard from '@/pages/dashboard/SuperAdminDashboard';
import HodDashboard from '@/pages/dashboard/HodDashboard';
import DeanDashboard from '@/pages/dashboard/DeanDashboard';
import FacultyCoordinatorDashboard from '@/pages/dashboard/FacultyCoordinatorDashboard';
import JudgeDashboard from '@/pages/dashboard/JudgeDashboard';
import ClubsPage from '@/pages/dashboard/ClubsPage';
import ClubDetailPage from '@/pages/dashboard/ClubDetailPage';
import ForumPage from '@/pages/dashboard/ForumPage';
import CommunityChatPage from '@/pages/dashboard/CommunityChatPage';
import AnalyticsDashboard from '@/pages/dashboard/AnalyticsDashboard';
import CertificationCenter from '@/pages/dashboard/CertificationCenter';
import CertificateDetailPage from '@/pages/dashboard/CertificateDetailPage';
import VerificationPage from '@/pages/VerificationPage';
import WebinarDetailPage from '@/pages/dashboard/WebinarDetailPage';
import EventCalendarPage from '@/pages/dashboard/EventCalendarPage';
import SupportCenter from '@/pages/dashboard/SupportCenter';
import TicketDetailPage from '@/pages/dashboard/TicketDetailPage';
import CertificateVerificationPage from '@/pages/CertificateVerificationPage';
import ClubMemberManagementPage from '@/pages/dashboard/ClubMemberManagementPage';

import JudgeEventDetails from '@/pages/dashboard/JudgeEventDetails';
import EvaluationPage from '@/pages/dashboard/EvaluationPage';
import AssignedEvents from '@/pages/dashboard/AssignedEvents';
import HodScoresPage from '@/pages/dashboard/HodScoresPage';
import FacultyMonitoring from '@/pages/dashboard/hod/FacultyMonitoring';
import StudentMonitoring from '@/pages/dashboard/hod/StudentMonitoring';
import ApprovalCenter from '@/pages/dashboard/hod/ApprovalCenter';
import RiskCompliance from '@/pages/dashboard/hod/RiskCompliance';
import BudgetManagement from '@/pages/dashboard/hod/BudgetManagement';

import HodApprovals from '@/pages/dashboard/hod/HodApprovals';
import HodFacultyStatus from '@/pages/dashboard/hod/HodFacultyStatus';
import HodStudentStatus from '@/pages/dashboard/hod/HodStudentStatus';
import HodSyllabusTracking from '@/pages/dashboard/hod/HodSyllabusTracking';
import HodCreditManager from '@/pages/dashboard/hod/HodCreditManager';

import JudgeManagement from '@/pages/dashboard/JudgeManagement';
<<<<<<< HEAD
import JudgeScoringPage from '@/pages/dashboard/JudgeScoringPage';
import RoundManagement from '@/pages/dashboard/RoundManagement';
import RoundSubmissionsPage from '@/pages/dashboard/RoundSubmissionsPage';
import JudgeAnalytics from '@/pages/dashboard/JudgeAnalytics';
import Shortlisting from '@/pages/dashboard/Shortlisting';
=======
import JudgeTeamDetails from '@/pages/dashboard/JudgeTeamDetails';
import JudgeEvaluationPage from '@/pages/dashboard/JudgeEvaluationPage';
>>>>>>> main

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Role-based Dashboard Redirect
const DashboardRedirect = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  // Prioritize Sub-Roles for specific dashboards
  if (user.subRole) {
    switch (user.subRole.toLowerCase()) {
      case 'hod':
      case 'director':
        return <Navigate to="/dashboard/hod" replace />;
      case 'college_admin':
        return <Navigate to="/dashboard/college-admin" replace />;
      case 'ambassador':
        return <Navigate to="/dashboard/ambassador" replace />;
      case 'judge':
        return <Navigate to="/dashboard/judge" replace />;
      case 'faculty_coordinator':
        return <Navigate to="/dashboard/coordinator" replace />;
      case 'dean_of_campus':
        return <Navigate to="/dashboard/dean" replace />;
      // Faculty Member & Club Head go to Faculty Dashboard
      case 'faculty_member':
      case 'club_head':
        return <Navigate to="/dashboard/faculty" replace />;
    }
  }

  // Fallback to Primary Role if subRole is missing or didn't match specific dashboard
<<<<<<< HEAD
  switch (user.role) {
    case 'ambassador':
      return <Navigate to="/dashboard/ambassador" replace />;
=======
  switch (user.role.toLowerCase()) {
    case 'super_admin':
      return <Navigate to="/dashboard/super-admin" replace />;
>>>>>>> main
    case 'dean_of_campus':
      return <Navigate to="/dashboard/dean" replace />;
    case 'college_admin':
      return <Navigate to="/dashboard/college-admin" replace />;
    case 'hod':
    case 'director':
      return <Navigate to="/dashboard/hod" replace />;
    case 'faculty_coordinator':
      return <Navigate to="/dashboard/coordinator" replace />;
    case 'faculty':
      return <Navigate to="/dashboard/faculty" replace />;
    case 'judge':
      return <Navigate to="/dashboard/judge" replace />;
    case 'student':
    default:
      return <Navigate to="/dashboard/student" replace />;
  }
};

function App() {
  const { theme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify/:certificateId" element={<VerificationPage />} />
            <Route path="/hackathons" element={<HackathonsPage />} />
            <Route path="/hackathons/:id" element={<HackathonDetailPage />} />
            <Route path="/hackathons/:id/register" element={<HackathonRegistrationPage />} />
            <Route path="admin/college" element={<CollegeAdminDashboard />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/colleges" element={<CollegesPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

          {/* Dashboard Routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/dashboard/student/hackathons" element={<MyHackathonsPage />} />
            <Route path="/dashboard/student/my-hackathons" element={<MyHackathonsPage />} />
            <Route path="/dashboard/student/my-hackathons/:id" element={<StudentHackathonDetailPage />} />
            <Route path="/dashboard/student/hackathons/:id" element={<StudentHackathonDetailPage />} />
            <Route path="/dashboard/student/events" element={<StudentEventsDashboard />} />
            <Route path="/dashboard/teams" element={<TeamsPage />} />
            <Route path="/dashboard/student/team/:id" element={<TeamDetailsPage />} />
            <Route path="/dashboard/student/clubs" element={<ClubsPage />} />
            <Route path="/dashboard/student/clubs/:clubId" element={<ClubDetailPage />} />
            <Route path="/dashboard/student/webinars" element={<WebinarsPage />} />
            <Route path="/dashboard/student/webinars/:id" element={<WebinarDetailPage />} />
            <Route path="/dashboard/student/calendar" element={<EventCalendarPage />} />
            <Route path="/dashboard/student/community" element={<ForumPage />} />
            <Route path="/dashboard/student/analytics" element={<StudentAnalyticsDashboard />} />
            <Route path="/dashboard/student/notifications" element={<FacultyNotificationsPage />} />
            <Route path="/dashboard/student/support" element={<SupportCenter />} />
            <Route path="/dashboard/student/support/:id" element={<TicketDetailPage />} />
            <Route path="/dashboard/student/profile" element={<StudentProfilePage />} />
            <Route path="/dashboard/student/resources" element={<ResourcesPage />} />
            <Route path="/dashboard/student/certificates" element={<CertificationCenter />} />
            <Route path="/dashboard/student/certificates/:id" element={<CertificateDetailPage />} />
            <Route path="/dashboard/student/leaderboard" element={<LeaderboardPage />} />

            <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
            <Route path="/dashboard/faculty/events" element={<FacultyEventsDashboard />} />
            <Route path="/dashboard/faculty/events/create" element={<FacultyEventCreatePage />} />
            <Route path="/dashboard/faculty/events/:id" element={<FacultyEventDetailPage />} />
            <Route path="/dashboard/faculty/events/:id/edit" element={<FacultyEventCreatePage />} />
            <Route path="/dashboard/faculty/hackathons" element={<FacultyHackathonsDashboard />} />
            <Route path="/dashboard/faculty/hackathons/create" element={<FacultyHackathonCreatePage />} />
            <Route path="/dashboard/faculty/hackathons/:id" element={<FacultyHackathonDetailPage />} />
            <Route path="/dashboard/faculty/hackathons/:id/edit" element={<FacultyHackathonCreatePage />} />
            <Route path="/dashboard/faculty/hackathons/:hackathonId/teams" element={<FacultyHackathonTeamsPage />} />
            <Route path="/dashboard/faculty/hackathons/:hackathonId/leaderboard" element={<FacultyHackathonLeaderboardPage />} />
            <Route path="/dashboard/faculty/analytics" element={<FacultyAnalyticsDashboard />} />
            <Route path="/dashboard/faculty/students" element={<FacultyStudentManagement />} />
            <Route path="/dashboard/faculty/resources" element={<FacultyResourcesPage />} />
            <Route path="/dashboard/faculty/webinars" element={<FacultyWebinarsPage />} />
            <Route path="/dashboard/faculty/clubs" element={<FacultyClubsPage />} />
            <Route path="/dashboard/faculty/clubs/:clubId" element={<FacultyClubDashboard />} />
            <Route path="/dashboard/faculty/certificates" element={<FacultyCertificatesPage />} />
            <Route path="/dashboard/faculty/notifications" element={<FacultyNotificationsPage />} />
            <Route path="/dashboard/faculty/start" element={<FacultyStartEventPage />} />
            <Route path="/dashboard/faculty/reports" element={<FacultyReportsPage />} />

            <Route path="/dashboard/coordinator" element={<FacultyCoordinatorDashboard />} />

            <Route path="/dashboard/college-admin" element={<CollegeAdminDashboard />} />
            <Route path="/dashboard/college-admin/webinars" element={<AdminWebinarsPage />} />
            <Route path="/dashboard/college-admin/webinars/create" element={<CreateWebinarPage />} />
            <Route path="/dashboard/college-admin/webinars/edit/:id" element={<CreateWebinarPage />} />
            
            <Route path="/dashboard/ambassador" element={<AmbassadorDashboard />} />
            <Route path="/dashboard/ambassador/referrals" element={<Referrals />} />
            <Route path="/dashboard/ambassador/leaderboard" element={<Leaderboard />} />
            <Route path="/dashboard/ambassador/colleges" element={<Colleges />} />
            <Route path="/dashboard/ambassador/analytics" element={<Analytics />} />
            <Route path="/dashboard/ambassador/toolkit" element={<PromotionToolkit />} />
            <Route path="/dashboard/ambassador/students" element={<ReferredStudents />} />
            <Route path="/dashboard/ambassador/network" element={<NetworkMap />} />
            <Route path="/dashboard/ambassador/events" element={<AssignedEventsAmbassador />} />

            <Route path="/dashboard/hod" element={<HodDashboard />} />
            <Route path="/dashboard/hod/faculty" element={<FacultyMonitoring />} />
            <Route path="/dashboard/hod/students" element={<StudentMonitoring />} />
            <Route path="/dashboard/hod/approvals" element={<ApprovalCenter />} />
            <Route path="/dashboard/hod/risk" element={<RiskCompliance />} />
            <Route path="/dashboard/hod/budget" element={<BudgetManagement />} />
            <Route path="/dashboard/hod/scores" element={<HodScoresPage />} />
            <Route path="/dashboard/hod/approvals-main" element={<HodApprovals />} />
            <Route path="/dashboard/hod/faculty-status" element={<HodFacultyStatus />} />
            <Route path="/dashboard/hod/student-status" element={<HodStudentStatus />} />
            <Route path="/dashboard/hod/syllabus" element={<HodSyllabusTracking />} />
            <Route path="/dashboard/hod/credits" element={<HodCreditManager />} />
            <Route path="/dashboard/hod/scores/:eventId" element={<HodScoresPage />} />
            <Route path="/dashboard/hod/judges" element={<JudgeManagement />} />
            <Route path="/dashboard/dean" element={<DeanDashboard />} />
            <Route path="/dashboard/judge" element={<JudgeDashboard />} />
            <Route path="/dashboard/judge/evaluate" element={<JudgeEvaluationPage />} />
            <Route path="/dashboard/judge/events" element={<AssignedEvents />} />
            <Route path="/dashboard/judge/events/:eventId" element={<JudgeEventDetails />} />
            <Route path="/judge/team/:teamId" element={<JudgeTeamDetails />} />
            <Route path="/dashboard/judge/evaluate/:submissionId" element={<EvaluationPage />} />
            <Route path="/dashboard/judge/hackathon/:hackathonId/rounds" element={<RoundManagement />} />
            <Route path="/dashboard/judge/hackathon/:hackathonId/round/:roundId/submissions" element={<RoundSubmissionsPage />} />
            <Route path="/dashboard/judge/hackathon/:hackathonId/round/:roundId/evaluate/:submissionId" element={<JudgeScoringPage />} />
            <Route path="/dashboard/judge/hackathon/:hackathonId/leaderboard" element={<FacultyHackathonLeaderboardPage />} />
            <Route path="/dashboard/judge/hackathon/:id/analytics" element={<JudgeAnalytics />} />
            <Route path="/dashboard/judge/hackathon/:id/shortlisting" element={<Shortlisting />} />

            {/* Club Routes */}
            <Route path="/dashboard/student/clubs" element={<ClubsPage />} />
            <Route path="/dashboard/student/clubs/:id/*" element={<ClubDetailPage />} />

            {/* New Ecosystem Routes */}
            <Route path="/dashboard/forum" element={<ForumPage />} />
            <Route path="/dashboard/community" element={<CommunityChatPage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsDashboard />} />

            {/* Webinar Routes */}
            <Route path="/dashboard/webinars" element={<WebinarsPage />} />
            <Route path="/dashboard/webinars/my-registrations" element={<WebinarsPage />} />
            <Route path="/dashboard/webinars/:id" element={<WebinarDetailPage />} />

            {/* Calendar & Support */}
            <Route path="/dashboard/calendar" element={<EventCalendarPage />} />
            <Route path="/dashboard/support" element={<SupportCenter />} />
            <Route path="/dashboard/support/:ticketId" element={<TicketDetailPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
