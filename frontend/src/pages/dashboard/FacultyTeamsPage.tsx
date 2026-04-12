import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { facultyApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowRight, Activity, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const FacultyTeamsPage = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const data = await facultyApi.getTeams();
            setTeams(data);
        } catch (error) {
            console.error("Failed to fetch faculty teams", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 rounded-[2rem] bg-gradient-to-br from-[hsl(var(--navy))] to-slate-900 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--teal))]/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10 w-full mb-6 md:mb-0">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Teams in My Events</h1>
                    <p className="text-slate-300 font-medium max-w-lg">
                        Monitor and review student teams participating across all your hackathons and events.
                    </p>
                </div>
                <div className="relative z-10 shrink-0 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/20">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-[hsl(var(--teal))]/20 rounded-xl flex items-center justify-center">
                            <Users className="h-6 w-6 text-[hsl(var(--teal))]" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-300 font-bold uppercase tracking-wider">Total Teams</p>
                            <p className="text-3xl font-black">{teams.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                    ))
                ) : teams.length > 0 ? (
                    teams.map((team) => (
                        <Card key={team.id} className="group rounded-[2.5rem] border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 pb-6 pt-8 px-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--navy))]/10 flex items-center justify-center text-[hsl(var(--navy))] dark:bg-white/10 dark:text-white">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <Badge variant="outline" className="rounded-full bg-slate-100 dark:bg-slate-800 font-bold">
                                        {team.memberCount} Members
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-black line-clamp-1">{team.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-2 font-medium">
                                    <Calendar className="h-4 w-4" />
                                    <span className="line-clamp-1">{team.eventName}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Team Status</span>
                                    <Badge className="bg-[hsl(var(--teal))] text-white font-bold px-3 py-1 text-xs">
                                        {team.status || 'Active'}
                                    </Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                                <Button
                                    variant="outline"
                                    className="w-full rounded-2xl py-6 font-bold hover:bg-[hsl(var(--navy))] hover:text-white dark:hover:bg-[hsl(var(--teal))] transition-colors"
                                    onClick={() => navigate(`/dashboard/student/team/${team.id}`)}
                                >
                                    VIEW DETAILS <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50">
                        <div className="h-24 w-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-slate-800 dark:text-white">No teams created for your events yet</h3>
                        <p className="text-slate-500 max-w-md mx-auto font-medium">
                            Once students start joining teams in your hackathons or events, they will automatically appear here for you to review.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default FacultyTeamsPage;
