import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Layers,
    Play,
    Lock,
    ChevronRight,
    Users,
    CheckSquare,
    Trophy,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { judgeScoringService, type HackathonRound } from '@/services/judgeScoringService';
import { Progress } from '@/components/ui/progress';

const RoundManagement = () => {
    const { hackathonId } = useParams();
    const navigate = useNavigate();
    const [rounds, setRounds] = useState<HackathonRound[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRounds = async () => {
            if (!hackathonId) return;
            try {
                const data = await judgeScoringService.getHackathonRounds(hackathonId);
                setRounds(data);
            } catch (error) {
                console.error("Failed to fetch rounds", error);
                toast.error("Failed to load rounds");
            } finally {
                setLoading(false);
            }
        };
        fetchRounds();
    }, [hackathonId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ONGOING': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'COMPLETED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    if (loading) return <div className="p-8">Loading round management...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Layers className="w-8 h-8 text-primary" />
                        Hackathon Rounds
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage evaluation stages and shortlisting for your hackathon.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate(`/dashboard/judge/hackathon/${hackathonId}/leaderboard`)}>
                        <Trophy className="w-4 h-4 mr-2" /> View Leaderboard
                    </Button>
                    {/* Add Round Button (Admin only) */}
                    {/* <Button><Plus className="w-4 h-4 mr-2" /> Add Round</Button> */}
                </div>
            </div>

            <div className="grid gap-6">
                {rounds.length === 0 ? (
                    <Card className="border-dashed flex flex-col items-center justify-center p-12 space-y-4">
                        <Layers className="w-12 h-12 text-muted-foreground/30" />
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">No rounds configured</h3>
                            <p className="text-sm text-muted-foreground">This hackathon doesn't have any evaluation rounds set up yet.</p>
                        </div>
                    </Card>
                ) : (
                    rounds.map((round, index) => (
                        <motion.div
                            key={round.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`overflow-hidden transition-all hover:border-primary/30 ${round.status === 'ONGOING' ? 'ring-2 ring-primary/20 border-primary/50 shadow-lg' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between py-5 bg-muted/30">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center font-bold text-lg border border-border/50">
                                            {round.roundNumber}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">{round.name}</CardTitle>
                                            <Badge variant="outline" className={getStatusColor(round.status)}>
                                                {round.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {round.status === 'UPCOMING' && (
                                            <Button size="sm" className="gap-2">
                                                <Play className="w-4 h-4" /> Start Round
                                            </Button>
                                        )}
                                        {round.status === 'ONGOING' && (
                                            <Button size="sm" variant="secondary" className="gap-2">
                                                <Lock className="w-4 h-4" /> Lock & Finalize
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="gap-2"
                                            onClick={() => navigate(`/dashboard/judge/hackathon/${hackathonId}/round/${round.id}/submissions`)}
                                        >
                                            View Submissions <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <CheckSquare className="w-4 h-4" /> Rubric Highlights
                                            </h4>
                                            <div className="space-y-2">
                                                {round.criteria && JSON.parse(round.criteria).slice(0, 3).map((c: any) => (
                                                    <div key={c.name} className="flex justify-between text-sm">
                                                        <span>{c.name}</span>
                                                        <span className="font-medium">{c.maxMarks} pts</span>
                                                    </div>
                                                ))}
                                                {round.criteria && JSON.parse(round.criteria).length > 3 && (
                                                    <p className="text-xs text-muted-foreground italic">+ {JSON.parse(round.criteria).length - 3} more criteria...</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4 md:border-l md:pl-8">
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <Users className="w-4 h-4" /> Evaluation Progress
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Submissions Evaluated</span>
                                                    <span className="font-medium">12 / 15</span>
                                                </div>
                                                <Progress value={80} className="h-2" />
                                            </div>
                                        </div>

                                        <div className="space-y-4 md:border-l md:pl-8 flex flex-col justify-center">
                                            <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                                <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Top Score</p>
                                                <p className="text-3xl font-bold">94.5 <span className="text-sm text-muted-foreground">/ 100</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RoundManagement;
