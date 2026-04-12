import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText,
    Users,
    ArrowRight,
    CheckCircle,
    Clock,
    ChevronLeft,
    Search,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { judgeService } from '@/services/judgeService';
import { judgeScoringService, type HackathonRound } from '@/services/judgeScoringService';
import { Input } from '@/components/ui/input';

interface Submission {
    id: string;
    projectTitle: string;
    description: string;
    status: string;
    team?: {
        name: string;
    };
    score?: number;
}

const RoundSubmissionsPage = () => {
    const { hackathonId, roundId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [round, setRound] = useState<HackathonRound | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!hackathonId || !roundId) return;
            try {
                // Fetch round details
                const roundData = await judgeScoringService.getRoundDetails(roundId);
                setRound(roundData);

                // Fetch submissions for this hackathon
                // (In a real app, this should probably filter by those who passed previous rounds)
                const data = await judgeService.getEventSubmissions(hackathonId);
                setSubmissions(data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [hackathonId, roundId]);

    const filteredSubmissions = submissions.filter(sub =>
        sub.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.team?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8">Loading round submissions...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-8 gap-1 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Rounds
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {round?.name} Evaluation
                    </h1>
                    <p className="text-muted-foreground">Select a team to begin scoring.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search teams or projects..."
                            className="pl-9 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredSubmissions.length === 0 ? (
                    <div className="p-12 text-center border border-dashed rounded-2xl bg-muted/20">
                        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg">No submissions found</h3>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    filteredSubmissions.map((sub, index) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group p-5 bg-card border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-all shadow-sm"
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                            {sub.projectTitle || "Untitled Project"}
                                        </h3>
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight px-1.5 h-5">
                                            {sub.team?.name || "Solo Body"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl leading-relaxed">
                                        {sub.description || "No description available for this project."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-border/50">
                                <div className="text-right flex-shrink-0 min-w-[80px]">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                                    {sub.status === 'EVALUATED' ? (
                                        <div className="flex items-center gap-1.5 text-green-500 font-bold text-sm">
                                            <CheckCircle className="w-4 h-4" /> Evaluated
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-orange-500 font-bold text-sm">
                                            <Clock className="w-4 h-4" /> Pending
                                        </div>
                                    )}
                                </div>

                                <Button
                                    className="gap-2 h-11 px-6 font-semibold"
                                    onClick={() => navigate(`/dashboard/judge/hackathon/${hackathonId}/round/${roundId}/evaluate/${sub.id}`)}
                                >
                                    Score Team <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RoundSubmissionsPage;
