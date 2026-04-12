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
import FacultyCertificatesPage from '@/pages/dashboard/FacultyCertificatesPage';
import FacultyNotificationsPage from '@/pages/dashboard/FacultyNotificationsPage';

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

import JudgeManagement from '@/pages/dashboard/JudgeManagement';
import JudgeTeamDetails from '@/pages/dashboard/JudgeTeamDetails';
import JudgeEvaluationPage from '@/pages/dashboard/JudgeEvaluationPage';

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
    switch (user.subRole) {
      case 'hod':
        return <Navigate to="/dashboard/hod" replace />;
      case 'college_admin':
        return <Navigate to="/dashboard/college-admin" replace />;
      case 'super_admin':
        return <Navigate to="/dashboard/super-admin" replace />;
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
  switch (user.role) {
    case 'super_admin':
      return <Navigate to="/dashboard/super-admin" replace />;
    case 'dean_of_campus':
      return <Navigate to="/dashboard/dean" replace />;
    case 'college_admin':
      return <Navigate to="/dashboard/college-admin" replace />;
    case 'hod':
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
            <Route path="/dashboard/student/my-hackathons" element={<MyHackathonsPage />} />
            <Route path="/dashboard/student/my-hackathons/:id" element={<StudentHackathonDetailPage />} />
            <Route path="/dashboard/student/events" element={<StudentEventsDashboard />} />
            <Route path="/dashboard/teams" element={<TeamsPage />} />
            <Route path="/dashboard/student/team/:id" element={<TeamDetailsPage />} />
            <Route path="/dashboard/student/analytics" element={<StudentAnalyticsDashboard />} />
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
            <Route path="/dashboard/faculty/analytics" element={<FacultyAnalyticsDashboard />} />
            <Route path="/dashboard/faculty/students" element={<FacultyStudentManagement />} />
            <Route path="/dashboard/faculty/resources" element={<FacultyResourcesPage />} />
            <Route path="/dashboard/faculty/webinars" element={<FacultyWebinarsPage />} />
            <Route path="/dashboard/faculty/clubs" element={<FacultyClubsPage />} />
            <Route path="/dashboard/faculty/certificates" element={<FacultyCertificatesPage />} />
            <Route path="/dashboard/faculty/notifications" element={<FacultyNotificationsPage />} />

            <Route path="/dashboard/coordinator" element={<FacultyCoordinatorDashboard />} />

            <Route path="/dashboard/college-admin" element={<CollegeAdminDashboard />} />
            <Route path="/dashboard/college-admin/webinars" element={<AdminWebinarsPage />} />
            <Route path="/dashboard/college-admin/webinars/create" element={<CreateWebinarPage />} />
            <Route path="/dashboard/college-admin/webinars/edit/:id" element={<CreateWebinarPage />} />
            <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/dashboard/hod" element={<HodDashboard />} />
            <Route path="/dashboard/hod/scores/:eventId" element={<HodScoresPage />} />
            <Route path="/dashboard/hod/judges" element={<JudgeManagement />} />
            <Route path="/dashboard/dean" element={<DeanDashboard />} />
            <Route path="/dashboard/judge" element={<JudgeDashboard />} />
            <Route path="/dashboard/judge/evaluate" element={<JudgeEvaluationPage />} />
            <Route path="/dashboard/judge/events" element={<AssignedEvents />} />
            <Route path="/dashboard/judge/events/:eventId" element={<JudgeEventDetails />} />
            <Route path="/judge/team/:teamId" element={<JudgeTeamDetails />} />
            <Route path="/dashboard/judge/evaluate/:submissionId" element={<EvaluationPage />} />

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
