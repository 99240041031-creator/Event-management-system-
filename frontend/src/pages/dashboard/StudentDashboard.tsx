import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Users,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  Star,
  MessageSquare,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthStore } from '@/store';
import { mockTeams, mockLeaderboard } from '@/data/mockData';
import { api, activityApi, certificateApi, hackathonApi, eventApi, webinarApi } from '@/lib/api';
import type { Hackathon, Event, Certificate } from '@/types';

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Welcome Skeleton */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>

    {/* Stats Skeleton */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Main Content Skeleton */}
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((j) => (
                  <Skeleton key={j} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myHackathons, setMyHackathons] = useState<Hackathon[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [myCertificates, setMyCertificates] = useState<Certificate[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
        // Use Promise.allSettled to allow partial failures
        const results = await Promise.allSettled([
          hackathonApi.getRegistered(user.id),
          eventApi.getStudentEvents(user.id),
          webinarApi.getMyRegistrations(user.id),
          activityApi.getByUser(user.id),
          certificateApi.getUserCertificates(user.id)
        ]);

        // Process Hackathons
        if (results[0].status === 'fulfilled') setMyHackathons(results[0].value);
        else console.error("Failed to fetch hackathons", results[0].reason);

        // Process Events
        if (results[1].status === 'fulfilled') setMyEvents(results[1].value);
        else console.error("Failed to fetch events", results[1].reason);

        // Process Webinars
        if (results[2].status === 'fulfilled') setUpcomingWebinars(results[2].value);

        // Process Activities
        if (results[3].status === 'fulfilled') setActivities(results[3].value.slice(0, 5));

        // Process Certificates
        if (results[4].status === 'fulfilled') setMyCertificates(results[4].value.slice(0, 3));

      } else {
        // Fallback for demo/guest
        const hackathons = await api.get<Hackathon[]>('/hackathons');
        setMyHackathons(hackathons.slice(0, 2));

        const events = await api.get<any>('/events');
        if (events && typeof events === 'object' && 'content' in events && Array.isArray(events.content)) {
          setMyEvents(events.content.slice(0, 2));
        } else if (Array.isArray(events)) {
          setMyEvents(events.slice(0, 2));
        }

        const webinars = await api.get<any[]>('/webinars');
        setUpcomingWebinars(webinars.slice(0, 2));
      }
    } catch (err) {
      console.error("Critical dashboard fetch error:", err);
      setError("Failed to load some dashboard data. Please check your connection.");
    } finally {
      // Add a small artificial delay to prevent flickering on fast connections
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const myTeams = mockTeams;
  const myRank = mockLeaderboard.find(entry => entry.userId === user?.id);

  const stats = [
    { label: 'Points', value: user?.points || 0, icon: Trophy, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { label: 'Hackathons', value: myHackathons.length, icon: Zap, color: 'text-[hsl(var(--teal))]', bgColor: 'bg-[hsl(var(--teal))]/10' },
    { label: 'Events', value: myEvents.length, icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Certificates', value: myCertificates.length, icon: Award, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Error Banner */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={fetchData} className="ml-4">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName || 'Student'}! 👋
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Here's what's happening in your academic world today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {myRank && (
            <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 dark:bg-amber-900/20">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                Rank #{myRank.rank}
              </span>
            </div>
          )}
          <Button onClick={() => navigate('/hackathons')}>
            Explore Hackathons
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: 'Register Event', icon: Calendar, color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20', path: '/dashboard/student/events' },
            { label: 'Join Hackathon', icon: Zap, color: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20', path: '/dashboard/student/hackathons' },
            { label: 'Create Team', icon: Users, color: 'bg-teal-500/10 text-teal-600 hover:bg-teal-500/20', path: '/dashboard/student/teams' },
            { label: 'Browse Clubs', icon: Star, color: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20', path: '/dashboard/student/clubs' },
            { label: 'View Webinars', icon: MessageSquare, color: 'bg-pink-500/10 text-pink-600 hover:bg-pink-500/20', path: '/dashboard/student/webinars' },
            { label: 'Certificates', icon: Award, color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20', path: '/dashboard/student/certificates' },
          ].map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.path)}
              className={`flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-colors ${action.color}`}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs font-semibold leading-tight">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
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

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* My Hackathons */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[hsl(var(--orange))]" />
                My Hackathons
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/hackathons')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {myHackathons.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No hackathons registered yet.</p>
                  <Button variant="link" className="mt-2 text-[hsl(var(--teal))]" onClick={() => navigate('/hackathons')}>Browse Hackathons</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myHackathons.map((hackathon) => (
                    <div
                      key={hackathon.id}
                      className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <img
                        src={hackathon.bannerImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c'}
                        alt={hackathon.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate font-semibold">{hackathon.title}</h4>
                        <p className="text-sm text-slate-500">{hackathon.collegeName || 'Inter-College'}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString() : 'TBD'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            {hackathon.prizePool || 'TBA'}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline">{(hackathon.status || 'UPCOMING').replace('_', ' ')}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Teams */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[hsl(var(--teal))]" />
                My Teams
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/teams')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {myTeams.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>You haven't joined any teams.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--navy))]/10">
                        <Users className="h-6 w-6 text-[hsl(var(--navy))]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{team.name}</h4>
                        <p className="text-sm text-slate-500">{team.hackathonName}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {team.members.slice(0, 3).map((member, i) => (
                              <img
                                key={member.id}
                                src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`}
                                alt={member.name}
                                className="h-6 w-6 rounded-full border-2 border-white dark:border-slate-800"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-slate-500">{team.members.length} members</span>
                        </div>
                      </div>
                      <Badge className={team.submissionStatus === 'submitted' ? 'bg-green-500' : ''}>
                        {team.submissionStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Upcoming Events
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/events')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {myEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No upcoming events registered.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-blue-500/10">
                        <span className="text-xs font-medium text-blue-500 uppercase">
                          {event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' }) : 'TBD'}
                        </span>
                        <span className="text-xl font-bold text-blue-500">
                          {event.startDate ? new Date(event.startDate).getDate() : '--'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate font-semibold">{event.title}</h4>
                        <p className="text-sm text-slate-500">{event.collegeName || 'Unknown College'}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.startDate ? new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                          </span>
                          <span className="capitalize">{event.mode}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">{(event.eventType || 'EVENT').replace('_', ' ')}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Progress to Next Rank */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Progress to Next Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myRank ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Current Rank</span>
                    <span className="font-semibold">#{myRank.rank}</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={75} className="h-2" />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    250 more points to reach Rank #{myRank.rank - 1}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">Start participating to earn points!</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Certificates */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Certificates
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/certificates')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {myCertificates.length === 0 ? (
                <div className="text-center py-6 text-slate-500">
                  <p className="text-sm">No certificates yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myCertificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-700"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                        <Award className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{cert.eventTitle}</p>
                        <p className="text-xs text-slate-500 capitalize">{cert.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Forum Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pink-500" />
                Community Activity
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/forum')}>
                View Forum
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 1, title: 'How to optimize React performance?', author: 'John Doe', replies: 12 },
                  { id: 2, title: 'Upcoming hackathon in Austin!', author: 'Jane Smith', replies: 8 },
                  { id: 3, title: 'Best practices for REST APIs', author: 'Mike Ross', replies: 5 },
                ].map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                      <MessageSquare className="h-5 w-5 text-pink-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{post.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-slate-500">by {post.author}</p>
                        <span className="text-xs text-slate-500">{post.replies} replies</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Daily Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                    <span className="text-3xl font-bold text-amber-500">{user?.streak || 0}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">days streak</p>
                </div>
              </div>
              <div className="mt-4 flex justify-center gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div
                    key={day + i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${i < 5 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                      }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
