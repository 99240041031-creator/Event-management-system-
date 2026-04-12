import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users, Trophy, Calendar, ArrowRight, TrendingUp, FileText, CheckCircle,
    XCircle, Lock, AlertCircle, BarChart3, PieChart, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store';
import { hodService } from '@/services/hodService';
import type { HodStats, ApprovalRequest } from '@/services/hodService';
import { toast } from 'sonner';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    BarChart, Bar, Cell
} from 'recharts';

const HodDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [stats, setStats] = useState<HodStats | null>(null);
    const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                if (!user?.departmentEntity?.id && !user?.department) return;
                const depId = user.departmentEntity?.id || user.department;

                const [statsRes, approvalsRes] = await Promise.all([
                    hodService.getDashboardStats(depId || ""),
                    hodService.getPendingApprovals(user.id)
                ]);

                setStats(statsRes);
                setApprovals(approvalsRes);
            } catch (error) {
                console.error("Failed to load HOD Dashboard", error);
                toast.error("Failed to load live data. Using departmental context.");
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, [user]);

    const summaryCards = [
        { label: 'Total Faculty', value: stats?.totalFaculty || 0, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
        { label: 'Active Clubs', value: stats?.activeClubs || 0, icon: Trophy, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
        { label: 'Running Events', value: stats?.runningEvents || 0, icon: Calendar, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    ];

    // Mock trend data for charts (to be replaced with live analytics endpoints later)
    const participationData = [
        { month: 'Jan', count: 45 }, { month: 'Feb', count: 52 },
        { month: 'Mar', count: 48 }, { month: 'Apr', count: 70 },
        { month: 'May', count: 85 }, { month: 'Jun', count: 92 },
    ];

    if (loading) return (
        <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-800 animate-pulse rounded-xl" />)}
            </div>
            <div className="h-96 bg-slate-800 animate-pulse rounded-xl" />
        </div>
    );

    return (
        <div className="space-y-8 p-6 bg-[#0a0c10] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 shadow-2xl">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                        Department Executive Suite
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        {user?.department || 'Department'} Governance & Strategic Oversight • HOD {user?.lastName}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-center">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Health Score</p>
                        <p className="text-3xl font-black text-green-400">{stats?.healthScore.toFixed(0)}%</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-gray-900/60 border-gray-800 hover:border-gray-700 transition-all group cursor-default">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                        <p className="mt-2 text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                                    </div>
                                    <div className={`p-4 rounded-2xl ${stat.bgColor} shadow-inner`}>
                                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Analytics Section */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Participation Trends */}
                <Card className="lg:col-span-2 bg-gray-900/60 border-gray-800 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Activity className="w-48 h-48 text-blue-500" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                            Participation Growth Model
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={participationData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="month" stroke="#525252" />
                                <YAxis stroke="#525252" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pending Tasks / Approvals */}
                <Card className="bg-gray-900/60 border-gray-800 overflow-hidden">
                    <CardHeader className="bg-gray-800/30">
                        <CardTitle className="text-white flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-amber-400" />
                            Pending Decisions
                            {approvals.length > 0 && (
                                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20 ml-auto">
                                    {approvals.length} ACTION
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-800 max-h-[350px] overflow-y-auto custom-scrollbar">
                            {approvals.map((req) => (
                                <div key={req.id} className="p-4 hover:bg-gray-800/40 transition-colors flex items-center justify-between group">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-200">{req.type} Approval</p>
                                        <p className="text-xs text-gray-500">From: {req.submittedBy?.name}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                        onClick={() => navigate('/dashboard/hod/approvals')}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {approvals.length === 0 && (
                                <div className="py-12 text-center">
                                    <Badge variant="outline" className="text-gray-500 border-gray-800">Queue Empty</Badge>
                                    <p className="text-xs text-gray-600 mt-2 italic">All governance tasks completed</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    {approvals.length > 0 && (
                        <div className="p-4 bg-gray-800/20 text-center">
                            <Button variant="link" size="sm" className="text-xs text-gray-400 hover:text-white" onClick={() => navigate('/dashboard/hod/approvals')}>
                                View All Governance Requests
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Quick Actions & Department Strategy */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Strategic Management */}
                <Card className="bg-gray-900/60 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Oversight & Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div
                            className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 hover:bg-gray-800 transition-all cursor-pointer group"
                            onClick={() => navigate('/dashboard/hod/faculty')}
                        >
                            <Users className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-bold text-gray-200">Faculty Audit</p>
                            <p className="text-xs text-gray-500">Performance & Workload</p>
                        </div>
                        <div
                            className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 hover:bg-gray-800 transition-all cursor-pointer group"
                            onClick={() => navigate('/dashboard/hod/students')}
                        >
                            <Activity className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-bold text-gray-200">Student Tracker</p>
                            <p className="text-xs text-gray-500">engagement Analytics</p>
                        </div>
                        <div
                            className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 hover:bg-gray-800 transition-all cursor-pointer group"
                            onClick={() => navigate('/dashboard/hod/budget')}
                        >
                            <PieChart className="w-8 h-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-bold text-gray-200">Budget Flow</p>
                            <p className="text-xs text-gray-500">Utilization & Allocation</p>
                        </div>
                        <div
                            className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 hover:bg-gray-800 transition-all cursor-pointer group"
                            onClick={() => navigate('/dashboard/hod/risk')}
                        >
                            <AlertCircle className="w-8 h-8 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-bold text-gray-200">Risk Profile</p>
                            <p className="text-xs text-gray-500">Compliance Detection</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Score Auditing (Legacy Support Modified) */}
                <Card className="bg-gray-900/60 border-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-indigo-400" />
                            Final Scoring Review
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-2xl mb-4">
                            <p className="text-sm text-indigo-300">
                                As HOD, you must finalize and lock event scores to trigger result publication and certificate generation.
                            </p>
                        </div>
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl font-bold shadow-lg shadow-blue-500/20"
                            onClick={() => navigate('/dashboard/hod/scores')}
                        >
                            Open Final Scoring Hub
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default HodDashboard;
