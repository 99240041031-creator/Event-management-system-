import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  GraduationCap,
  Gavel,
  Crown,
  FolderOpen,
  Bell,
  Award,
  MessageSquare,
  Globe,
  Video,
  Activity,
  TrendingUp,
  Shield,
  CheckCircle,
  Lock,
  ClipboardList,
  PlayCircle
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { Monitor, BarChart } from 'lucide-react';

const getMenuItems = (role: string) => {
  switch (role) {
    case 'ambassador':
      return [
        { name: 'Headquarters', href: '/dashboard/ambassador', icon: LayoutDashboard },
        { name: 'Tracked Students', href: '/dashboard/ambassador/students', icon: GraduationCap },
        { name: 'Network Map', href: '/dashboard/ambassador/network', icon: Globe },
        { name: 'Promotion Deck', href: '/dashboard/ambassador/events', icon: Calendar },
        { name: 'Referrals & Links', href: '/dashboard/ambassador/referrals', icon: Users },
        { name: 'Leaderboard', href: '/dashboard/ambassador/leaderboard', icon: Trophy },
        { name: 'Ambassador Connect', href: '/dashboard/ambassador/chat', icon: MessageSquare },
        { name: 'Mapped Colleges', href: '/dashboard/ambassador/colleges', icon: Building2 },
        { name: 'Deep Analytics', href: '/dashboard/ambassador/analytics', icon: BarChart3 },
        { name: 'Promotion Toolkit', href: '/dashboard/ambassador/toolkit', icon: FolderOpen },
      ];

    case 'dean_of_campus':
      return [
        { name: 'Campus Analytics', href: '/dashboard/dean', icon: BarChart3 },
        { name: 'Dept. Performance', href: '/dashboard/dean/performance', icon: TrendingUp },
        { name: 'Governance Reports', href: '/dashboard/dean/reports', icon: FileText },
        { name: 'Audit Logs', href: '/dashboard/dean/audits', icon: Shield },
        { name: 'System Health', href: '/dashboard/dean/health', icon: Activity },
      ];
    case 'college_admin':
      return [
        { name: 'College Overview', href: '/dashboard/college-admin', icon: LayoutDashboard },
        { name: 'Club Management', href: '/dashboard/college-admin/clubs', icon: Users },
        { name: 'Dept. Monitoring', href: '/dashboard/college-admin/departments', icon: Building2 },
        { name: 'Event Audits', href: '/dashboard/college-admin/audits', icon: FileText },
      ];
    case 'hod':
      return [
        { name: 'Dept. Overview', href: '/dashboard/hod', icon: LayoutDashboard },
        { name: 'Approve Scores', href: '/dashboard/hod/scores', icon: CheckCircle },
        { name: 'Lock Results', href: '/dashboard/hod/lock', icon: Lock },
        { name: 'Faculty Oversight', href: '/dashboard/hod/faculty', icon: Users },
        { name: 'Judge Management', href: '/dashboard/hod/judges', icon: Gavel },
      ];
    case 'faculty_coordinator':
      return [
        { name: 'Registrations', href: '/dashboard/coordinator', icon: Users },
        { name: 'Attendance', href: '/dashboard/coordinator/attendance', icon: ClipboardList },
        { name: 'Event Chat', href: '/dashboard/coordinator/chat', icon: MessageSquare },
        { name: 'Analytics', href: '/dashboard/coordinator/analytics', icon: BarChart3 },
      ];
    case 'faculty':
      return [
        { name: 'Overview', href: '/dashboard/faculty', icon: LayoutDashboard },
        { name: 'My Events', href: '/dashboard/faculty/events', icon: Calendar },
        { name: 'My Hackathons', href: '/dashboard/faculty/hackathons', icon: Trophy },
        { name: 'Assigned Clubs', href: '/dashboard/faculty/clubs', icon: Users },
        { name: 'Start Event', href: '/dashboard/faculty/start', icon: PlayCircle },
        { name: 'Resources', href: '/dashboard/faculty/resources', icon: FolderOpen },
        { name: 'Students', href: '/dashboard/faculty/students', icon: GraduationCap },
        { name: 'Analytics', href: '/dashboard/faculty/analytics', icon: BarChart3 },
        { name: 'Reports', href: '/dashboard/faculty/reports', icon: FileText },
      ];
    case 'judge':
      return [
        { name: 'Dashboard', href: '/dashboard/judge', icon: LayoutDashboard },
        { name: 'My Events', href: '/dashboard/judge/events', icon: Calendar },
      ];
    case 'student':
    default:
      return [
        { name: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
        { name: 'Hackathons', href: '/dashboard/student/hackathons', icon: Trophy },
        { name: 'Events', href: '/dashboard/student/events', icon: Calendar },
        { name: 'Teams', href: '/dashboard/student/teams', icon: Users },
        { name: 'Clubs', href: '/dashboard/student/clubs', icon: Globe },
        { name: 'Webinars', href: '/dashboard/student/webinars', icon: Video },
        { name: 'Certificates', href: '/dashboard/student/certificates', icon: Award },
        { name: 'Calendar', href: '/dashboard/student/calendar', icon: BookOpen },
        { name: 'Community', href: '/dashboard/student/community', icon: MessageSquare },
        { name: 'Analytics', href: '/dashboard/student/analytics', icon: BarChart3 },
        { name: 'Notifications', href: '/dashboard/student/notifications', icon: Bell },
        { name: 'Support', href: '/dashboard/student/support', icon: HelpCircle },
        { name: 'Profile', href: '/dashboard/student/profile', icon: GraduationCap },
      ];
  }
};

const DashboardSidebar = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  if (!user) return null;

  const menuItems = getMenuItems(user.role);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 lg:block",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-4 h-6 w-6 rounded-full border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>

        <div className="flex h-full flex-col">
          {/* User Info */}
          <div className={cn(
            "border-b border-slate-200 p-4 dark:border-slate-700",
            !sidebarOpen && "px-2"
          )}>
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                alt={user.firstName}
                className="h-10 w-10 rounded-full"
              />
              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{user.firstName} {user.lastName}</p>
                  <p className="truncate text-xs text-slate-500 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-[hsl(var(--navy))] text-white dark:bg-[hsl(var(--teal))]"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                      !sidebarOpen && "justify-center px-2"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className={cn(
            "border-t border-slate-200 p-3 dark:border-slate-700",
            !sidebarOpen && "px-2"
          )}>
            <Link
              to="/help"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                !sidebarOpen && "justify-center px-2"
              )}
            >
              <HelpCircle className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Help & Support</span>}
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile sidebar implementation would go here */}
      </div>
    </>
  );
};

export default DashboardSidebar;
