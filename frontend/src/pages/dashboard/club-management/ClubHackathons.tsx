import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trophy, Users, BarChart, Calendar, MapPin, Code, ChevronRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { facultyClubApi } from '@/lib/api';
import { toast } from 'sonner';

const ClubHackathons = ({ clubId }: { clubId: string }) => {
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadHackathons();
    }, [clubId]);

    const loadHackathons = async () => {
        try {
            setLoading(true);
            const res = await facultyClubApi.getHackathons(clubId);
            setHackathons(res || []);
        } catch (error) {
            toast.error('Failed to load hackathons');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold font-display">Hackathon Arena</h3>
                    <p className="text-sm text-slate-500">Scale innovation with competitive coding events.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={loadHackathons} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => navigate(`/dashboard/faculty/hackathons/create?clubId=${clubId}`)} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none">
                        <Plus className="h-4 w-4 mr-2" /> Launch Hackathon
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2].map(i => (
                        <div key={i} className="h-60 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : hackathons.length === 0 ? (
                <Card className="border-dashed border-2 bg-slate-50/50">
                    <CardContent className="p-12 text-center flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <Trophy className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-slate-700 dark:text-slate-300">No hackathons hosted</p>
                            <p className="text-sm text-slate-500 max-w-xs">Fuel competition and creativity by launching your first inter-college hackathon.</p>
                        </div>
                        <Button variant="outline" onClick={() => navigate(`/dashboard/faculty/hackathons/create?clubId=${clubId}`)}>Host a Hackathon</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {hackathons.map((h: any) => (
                        <Card key={h.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-white dark:bg-slate-900 shadow-sm relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <Badge variant="outline" className="rounded-md uppercase text-[10px] font-bold tracking-wider border-indigo-200 text-indigo-600 bg-indigo-50/30">
                                        {h.mode}
                                    </Badge>
                                    <Badge variant={h.status === 'ACTIVE' || h.status === 'registration_open' ? 'default' : 'secondary'} className="text-[10px] uppercase font-black">
                                        {h.status?.replace('_', ' ')}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-black line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">{h.title}</CardTitle>
                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                        <span>{new Date(h.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                                        <Code className="h-3.5 w-3.5 text-indigo-500" />
                                        <span>{h.theme || 'Open Innovation'}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter className="p-5 pt-2 grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="h-10 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50"
                                    onClick={() => navigate(`/dashboard/faculty/hackathons/${h.id}/teams`)}
                                >
                                    <Users className="h-3.5 w-3.5 mr-2 text-indigo-600" /> Manage Teams
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-10 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50"
                                    onClick={() => navigate(`/dashboard/faculty/hackathons/${h.id}/leaderboard`)}
                                >
                                    <BarChart className="h-3.5 w-3.5 mr-2 text-indigo-600" /> Results Hub
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="col-span-2 h-10 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none rounded-xl font-bold flex items-center justify-center gap-2"
                                    onClick={() => navigate(`/dashboard/faculty/hackathons/${h.id}`)}
                                >
                                    View Detailed Stats <ChevronRight className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClubHackathons;
