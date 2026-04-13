import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  FolderOpen,
  BarChart3,
  Plus,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store';
import { facultyApi } from '@/lib/api';
import { toast } from 'sonner';
import { facultyDashboardMock } from '@/mock/facultyData';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [myHackathons, setMyHackathons] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [statsData, eventsData, hackathonsData, activityData] = await Promise.all([
        facultyApi.getDashboardStats(),
        facultyApi.getEvents(0, 5),
        facultyApi.getHackathons(0, 5),
        facultyApi.getRecentActivity(5),
      ]);

      setStats(statsData);
      setMyEvents(eventsData.content || []);
      setMyHackathons(hackathonsData.content || []);
      setRecentActivity(activityData || []);
    } catch (error: any) {
      console.warn('API sync failed, implementing mock fallback protocols:', error);
      
      // Inject high-fidelity mock data
      setStats(facultyDashboardMock.stats);
      setMyEvents(facultyDashboardMock.events);
      setMyHackathons(facultyDashboardMock.hackathons);
      setRecentActivity(facultyDashboardMock.recentActivity);
      
      toast.info('Viewing dashboard in evaluation mode');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = stats ? [
    { label: 'My Hackathons', value: stats.myHackathonsCount, icon: Trophy, color: 'text-[hsl(var(--orange))]', bgColor: 'bg-[hsl(var(--orange))]/10' },
    { label: 'My Events', value: stats.myEventsCount, icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Active Registrations', value: stats.activeRegistrationsCount, icon: Users, color: 'text-[hsl(var(--teal))]', bgColor: 'bg-[hsl(var(--teal))]/10' },
    { label: 'Certificates Issued', value: stats.certificatesIssuedCount, icon: Eye, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.firstName}! 👋
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Manage your events, content, and track student engagement.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard/faculty/events/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
          <Button onClick={() => navigate('/dashboard/faculty/hackathons/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Hackathon
          </Button>
        </div>
      </motion.div>

      {/* Club Head Controls - Only for Faculty with isClubHead=true */}
      {user?.isClubHead && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-lg mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 hover:bg-white/30 border-0">Club Head Access</Badge>
              </div>
              <h2 className="text-2xl font-bold">Manage Your Club</h2>
              <p className="text-white/80 mt-1 max-w-2xl">
                You have special privileges to manage club activities, coordinators, and announcements.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="whitespace-nowrap" onClick={() => navigate('/dashboard/faculty/clubs')}>
                <Users className="mr-2 h-4 w-4" />
                Manage Members
              </Button>
              <Button variant="secondary" className="whitespace-nowrap" onClick={() => navigate('/dashboard/faculty/clubs')}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Club Settings
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="hackathons">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="hackathons">My Hackathons</TabsTrigger>
              <TabsTrigger value="events">My Events</TabsTrigger>
            </TabsList>

            <TabsContent value="hackathons" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Hackathons</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/faculty/hackathons')}>
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myHackathons.map((hackathon) => (
                      <div
                        key={hackathon.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => navigate(`/dashboard/faculty/hackathons/${hackathon.id}`)}
                      >
                        <img
                          src={hackathon.bannerImage || '/placeholder-hackathon.jpg'}
                          alt={hackathon.title}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{hackathon.title}</h4>
                          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{hackathon.registeredCount || 0} registered</span>
                            <span>•</span>
                            <span>{hackathon.maxSpots || 0} spots</span>
                          </div>
                        </div>
                        <Badge>{hackathon.status?.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                    {myHackathons.length === 0 && (
                      <div className="py-8 text-center text-slate-500">
                        No hackathons yet. Create your first one!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Events</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/faculty/events')}>
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => navigate(`/dashboard/faculty/events/${event.id}`)}
                      >
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-blue-500/10">
                          <span className="text-xs font-medium text-blue-500">
                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-xl font-bold text-blue-500">
                            {new Date(event.startDate).getDate()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{event.title}</h4>
                          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{event.registeredCount || 0} registered</span>
                            <span>•</span>
                            <span className="capitalize">{event.eventType?.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{event.status?.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                    {myEvents.length === 0 && (
                      <div className="py-8 text-center text-slate-500">
                        No events yet. Create your first one!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/faculty/events/create')}>
                <Calendar className="mr-2 h-4 w-4" />
                Create Event
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/faculty/hackathons/create')}>
                <Trophy className="mr-2 h-4 w-4" />
                Create Hackathon
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/faculty/students')}>
                <Users className="mr-2 h-4 w-4" />
                View Students
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/faculty/analytics')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Engagement Stats */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Engagement This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Event Registrations</span>
                    <span className="font-semibold">+{stats.eventRegistrationGrowth}%</span>
                  </div>
                  <Progress value={stats.eventRegistrationGrowth} className="mt-2 h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Content Downloads</span>
                    <span className="font-semibold">+{stats.contentDownloadGrowth}%</span>
                  </div>
                  <Progress value={stats.contentDownloadGrowth} className="mt-2 h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Hackathon Teams</span>
                    <span className="font-semibold">+{stats.hackathonTeamGrowth}%</span>
                  </div>
                  <Progress value={stats.hackathonTeamGrowth} className="mt-2 h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm">{activity.message || 'New activity'}</p>
                      <p className="text-xs text-slate-500">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="py-4 text-center text-sm text-slate-500">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
