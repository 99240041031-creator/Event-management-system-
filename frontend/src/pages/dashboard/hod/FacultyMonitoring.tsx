import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, TrendingUp, AlertCircle, ArrowLeft, Mail, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { hodService } from '@/services/hodService';
import type { FacultySummary } from '@/services/hodService';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const FacultyMonitoring = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [faculty, setFaculty] = useState<FacultySummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFaculty = async () => {
            try {
                const depId = user?.departmentEntity?.id || user?.department;
                if (!depId) return;
                const data = await hodService.getFacultyMonitoring(depId);
                setFaculty(data);
            } catch (error) {
                toast.error("Failed to load faculty data");
            } finally {
                setLoading(false);
            }
        };
        loadFaculty();
    }, [user]);

    if (loading) return <div className="p-8">Loading Faculty Audit...</div>;

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/hod')} className="text-gray-400">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Suite
                </Button>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white">Faculty Performance Audit</h1>
                    <p className="text-gray-500 mt-1">Strategic oversight and workload distribution for {user?.department} faculty.</p>
                </div>
                <Badge variant="outline" className="text-blue-400 border-blue-400/20 px-4 py-1">
                    {faculty.length} Active Staff
                </Badge>
            </div>

            <div className="grid gap-6">
                {faculty.map((f, index) => (
                    <motion.div
                        key={f.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="bg-gray-900/60 border-gray-800 hover:border-blue-500/30 transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                            <Users className="w-7 h-7 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{f.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                <Mail className="w-3 h-3" />
                                                {f.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 max-w-md flex-col gap-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-medium tracking-tight uppercase text-xs">Performance Index</span>
                                            <span className="text-blue-400 font-bold">{f.performanceScore.toFixed(0)}%</span>
                                        </div>
                                        <Progress value={f.performanceScore} className="h-2 bg-gray-800" />
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Events</p>
                                            <p className="text-2xl font-black text-white">{f.eventsManaged}</p>
                                        </div>
                                        <div>
                                            <Badge
                                                className={f.status === 'STABLE'
                                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                    : "bg-red-500/10 text-red-500 border-red-500/20"}
                                            >
                                                {f.status}
                                            </Badge>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-400">
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {faculty.length === 0 && (
                    <div className="py-20 text-center bg-gray-900/40 rounded-3xl border border-dashed border-gray-800">
                        <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500">No faculty records found for this department.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultyMonitoring;
