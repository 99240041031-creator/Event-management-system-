import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Trophy,
    Calendar,
    FileText,
    Award,
    Shield,
    BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store';
import { hodService } from '@/services/hodService';
import { toast } from 'sonner';

const HodDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [summary, setSummary] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await hodService.getSummary();
                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch HOD stats", error);
                toast.error("Failed to load dashboard summary");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="p-8 space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/4"></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                ))}
            </div>
        </div>
    );

    const safeData = summary || {};

    const stats = [
        { label: 'Total Faculty', value: safeData.totalFaculty || 0, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { label: 'Total Students', value: safeData.totalStudents || 0, icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
        { label: 'Active Clubs', value: safeData.activeClubs || 0, icon: Shield, color: 'text-green-500', bgColor: 'bg-green-500/10' },
        { label: 'Total Events', value: safeData.totalEvents || 0, icon: Calendar, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
        { label: 'Total Hackathons', value: safeData.totalHackathons || 0, icon: Trophy, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
        { label: 'Pending Approvals', value: safeData.pendingApprovals || 0, icon: FileText, color: 'text-red-500', bgColor: 'bg-red-500/10' },
        { label: 'Pending Credits', value: safeData.pendingCredits || 0, icon: Award, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
    ];

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold capitalize">
                        Welcome, {user?.role?.replace('_', ' ')} {user?.lastName}! 🏛️
                    </h1>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Overview of department activities, approvals, and performance.
                    </p>
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
                                        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
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

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/hod/approvals')}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-red-600">Action Required</h3>
                            <p className="text-sm text-slate-500">You have {safeData.pendingApprovals || 0} events/requests awaiting your approval.</p>
                        </div>
                        <Shield className="h-10 w-10 text-red-100 fill-red-500" />
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/hod/syllabus')}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-blue-600">Syllabus Tracking</h3>
                            <p className="text-sm text-slate-500">Monitor daily syllabus progress submitted by your faculty.</p>
                        </div>
                        <BookOpen className="h-10 w-10 text-blue-100 fill-blue-500" />
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Navigation</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                     <button onClick={() => navigate('/dashboard/hod/faculty')} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                         <h4 className="font-bold flex items-center"><Users className="w-4 h-4 mr-2"/> Faculty Performance</h4>
                         <p className="text-xs text-slate-500 mt-1">Check individual faculty stats</p>
                     </button>
                     <button onClick={() => navigate('/dashboard/hod/students')} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                         <h4 className="font-bold flex items-center"><Trophy className="w-4 h-4 mr-2"/> Student Exams</h4>
                         <p className="text-xs text-slate-500 mt-1">Review critical internal/external marks</p>
                     </button>
                     <button onClick={() => navigate('/dashboard/hod/credits')} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                         <h4 className="font-bold flex items-center"><Award className="w-4 h-4 mr-2"/> Credit Requests</h4>
                         <p className="text-xs text-slate-500 mt-1">Approve reward points for students</p>
                     </button>
                </CardContent>
            </Card>
        </div>
    );
};

export default HodDashboard;
