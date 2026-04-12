import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, ArrowLeft, GraduationCap, Activity, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { hodService } from '@/services/hodService';
import type { StudentSummary } from '@/services/hodService';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const StudentMonitoring = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [students, setStudents] = useState<StudentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const loadStudents = async () => {
            try {
                const depId = user?.departmentEntity?.id || user?.department;
                if (!depId) return;
                const data = await hodService.getStudentMonitoring(depId);
                setStudents(data);
            } catch (error) {
                toast.error("Failed to load student tracking data");
            } finally {
                setLoading(false);
            }
        };
        loadStudents();
    }, [user]);

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8">Loading Student Analytics...</div>;

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/hod')} className="text-gray-400">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Suite
                </Button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Student engagement Intelligence</h1>
                    <p className="text-gray-500 mt-1">Monitoring participation and performance metrics for department students.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            placeholder="Search students..."
                            className="pl-10 bg-gray-900/50 border-gray-800 text-gray-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="border-gray-800"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                </div>
            </div>

            <div className="grid gap-4">
                <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-widest grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">Student Identity</div>
                    <div className="col-span-2 text-center">Academic Year</div>
                    <div className="col-span-2 text-center">Participation</div>
                    <div className="col-span-2 text-center">engagement</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>

                {filteredStudents.map((s, index) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl hover:border-purple-500/30 transition-all flex items-center grid grid-cols-12 gap-4"
                    >
                        <div className="col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-200">{s.name}</p>
                                <p className="text-xs text-gray-500 truncate">{s.email}</p>
                            </div>
                        </div>
                        <div className="col-span-2 text-center">
                            <Badge variant="outline" className="border-gray-800 text-gray-400">Year {s.year}</Badge>
                        </div>
                        <div className="col-span-2 text-center text-gray-300 font-mono">
                            {s.participationCount} Events
                        </div>
                        <div className="col-span-2 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs text-purple-400 font-bold">{s.engagementScore}%</span>
                                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500" style={{ width: `${s.engagementScore}%` }} />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2 text-right">
                            <Badge
                                className={s.status === 'ACTIVE'
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"}
                            >
                                {s.status.replace('_', ' ')}
                            </Badge>
                        </div>
                    </motion.div>
                ))}

                {filteredStudents.length === 0 && (
                    <div className="py-20 text-center text-gray-600">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No student data found matching your query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentMonitoring;
