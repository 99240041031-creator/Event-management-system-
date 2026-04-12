import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    CheckCircle,
    AlertCircle,
    ExternalLink,
    ChevronLeft,
    GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { judgeScoringService, type HackathonRound } from '@/services/judgeScoringService';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Criterion {
    name: string;
    maxMarks: number;
}

const JudgeScoringPage = () => {
    const { hackathonId, roundId, submissionId } = useParams();
    const navigate = useNavigate();

    const [round, setRound] = useState<HackathonRound | null>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!roundId || !submissionId) return;
            try {
                const roundData = await judgeScoringService.getRoundDetails(roundId);
                setRound(roundData);

                // Initialize scores as per criteria
                if (roundData.criteria) {
                    const criteria: Criterion[] = JSON.parse(roundData.criteria);
                    const initialScores: Record<string, number> = {};
                    criteria.forEach(c => initialScores[c.name] = 0);
                    setScores(initialScores);
                }

                // Fetch submission details (Need an endpoint for this)
                const subData = await import('@/lib/api').then(m => m.api.get<any>(`/submissions/${submissionId}`));
                setSubmission(subData);

                // Check if already scored
                // const existingScore = await judgeScoringService.getExistingScore(submissionId, roundId);
                // if (existingScore) { ... }

            } catch (error) {
                console.error("Failed to fetch scoring data", error);
                toast.error("Failed to load evaluation data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [roundId, submissionId]);

    const handleScoreChange = (name: string, value: number, max: number) => {
        if (isLocked) return;
        const boundedValue = Math.min(Math.max(0, value), max);
        setScores(prev => ({ ...prev, [name]: boundedValue }));
    };

    const calculateTotal = () => {
        return Object.values(scores).reduce((a, b) => a + b, 0);
    };

    const calculateMax = () => {
        if (!round?.criteria) return 100;
        const criteria: Criterion[] = JSON.parse(round.criteria);
        return criteria.reduce((sum, c) => sum + c.maxMarks, 0);
    };

    const handleSave = async (isFinal: boolean) => {
        if (!submissionId || !roundId) return;
        setSubmitting(true);
        try {
            await judgeScoringService.submitScore({
                submissionId,
                roundId,
                criteriaScores: scores,
                feedback,
                isFinal
            });

            if (isFinal) {
                toast.success("Score submitted successfully!");
                setIsLocked(true);
                setTimeout(() => navigate(-1), 1500);
            } else {
                toast.success("Draft saved successfully");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to submit score");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]">Loading evaluation system...</div>;

    const criteria: Criterion[] = round?.criteria ? JSON.parse(round.criteria) : [];
    const totalScore = calculateTotal();
    const maxScore = calculateMax();
    const completionPercentage = (totalScore / maxScore) * 100;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-8 gap-1 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Submissions
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Evaluate: {submission?.projectTitle || "Project"}</h1>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Round {round?.roundNumber}: {round?.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Team: {submission?.team?.name || "Solo Participant"}</span>
                    </div>
                </div>

                <Card className="bg-primary/[0.03] border-primary/10">
                    <CardContent className="p-4 flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Current Score</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-primary">{totalScore}</span>
                                <span className="text-sm text-muted-foreground font-medium">/ {maxScore}</span>
                            </div>
                        </div>
                        <div className="w-1 bg-border/50 h-10" />
                        <div className="w-32">
                            <Progress value={completionPercentage} className="h-2" />
                            <p className="text-[10px] text-right mt-1 text-muted-foreground">Weight: {(completionPercentage).toFixed(1)}%</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Rubric */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            Scoring Rubric
                        </h2>

                        <AnimatePresence mode="popLayout">
                            {criteria.map((criterion, index) => (
                                <motion.div
                                    key={criterion.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className={`group transition-all hover:border-primary/30 ${isLocked ? 'opacity-80' : ''}`}>
                                        <CardHeader className="py-4 px-6 flex flex-row items-center justify-between bg-muted/30">
                                            <CardTitle className="text-base font-semibold">{criterion.name}</CardTitle>
                                            <Badge variant="outline">{scores[criterion.name] || 0} / {criterion.maxMarks}</Badge>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-6">
                                            <div className="flex items-center gap-6">
                                                <div className="flex-1 space-y-4">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max={criterion.maxMarks}
                                                        value={scores[criterion.name] || 0}
                                                        onChange={(e) => handleScoreChange(criterion.name, parseInt(e.target.value), criterion.maxMarks)}
                                                        disabled={isLocked}
                                                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                    />
                                                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                                        <span>Beginner (0)</span>
                                                        <span>Intermediate ({Math.floor(criterion.maxMarks / 2)})</span>
                                                        <span>Expert ({criterion.maxMarks})</span>
                                                    </div>
                                                </div>
                                                <div className="w-20">
                                                    <input
                                                        type="number"
                                                        value={scores[criterion.name] || 0}
                                                        onChange={(e) => handleScoreChange(criterion.name, parseInt(e.target.value), criterion.maxMarks)}
                                                        disabled={isLocked}
                                                        className="w-full text-center p-3 bg-secondary/50 border-none rounded-xl font-bold text-xl focus:ring-2 ring-primary/50 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Feedback Area */}
                    <Card className={isLocked ? 'opacity-80' : ''}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Constructive Feedback</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                disabled={isLocked}
                                placeholder="What did the team do well? Where can they improve?"
                                className="w-full h-32 p-4 bg-secondary/30 rounded-xl resize-none focus:ring-2 ring-primary/50 outline-none border-none transition-all"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Project Details & Actions */}
                <div className="space-y-6">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-base">Submission Review</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Project Description</label>
                                <p className="text-sm line-clamp-4 text-balanced italic leading-relaxed">
                                    {submission?.description || "No description provided."}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Links</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button variant="outline" className="justify-start h-10 gap-2 overflow-hidden" disabled={!submission?.githubUrl} onClick={() => window.open(submission.githubUrl, '_blank')}>
                                        <ExternalLink className="w-4 h-4 flex-shrink-0" /> <span className="truncate">GitHub Repo</span>
                                    </Button>
                                    <Button variant="outline" className="justify-start h-10 gap-2 overflow-hidden" disabled={!submission?.demoUrl} onClick={() => window.open(submission.demoUrl, '_blank')}>
                                        <ExternalLink className="w-4 h-4 flex-shrink-0" /> <span className="truncate">Live Demo</span>
                                    </Button>
                                    <Button variant="outline" className="justify-start h-10 gap-2 overflow-hidden" disabled={!submission?.videoUrl} onClick={() => window.open(submission.videoUrl, '_blank')}>
                                        <ExternalLink className="w-4 h-4 flex-shrink-0" /> <span className="truncate">Video Pitch</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 pt-6 border-t">
                            {!isLocked ? (
                                <>
                                    <Button
                                        className="w-full h-12 text-base gap-2 font-semibold shadow-lg shadow-primary/20"
                                        disabled={submitting}
                                        onClick={() => handleSave(true)}
                                    >
                                        <CheckCircle className="w-5 h-5" /> Submit Final Score
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full h-11"
                                        disabled={submitting}
                                        onClick={() => handleSave(false)}
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Save as Draft
                                    </Button>
                                </>
                            ) : (
                                <div className="w-full p-4 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center gap-2 font-bold border border-green-500/20">
                                    <CheckCircle className="w-5 h-5" /> EVALUATION SUBMITTED
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default JudgeScoringPage;
