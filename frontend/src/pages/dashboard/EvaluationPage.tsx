import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, CheckCircle, ShieldAlert, ExternalLink, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const mockSubmission = {
    id: "sub_demo",
    teamName: "Nexus Builders",
    project: "Intelligent Event Hub",
    github: "https://github.com/facebook/react",
    live: "https://react.dev",
    scores: {
        r1: 0,
        r2: 0,
        r3: 0
    }
};

const EvaluationPage = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // ISSUE 1 FIX: SAFE FALLBACK DATA & ISOLATION
    const eventId = location.state?.eventId || "default_event";
    const submission = location.state?.submission || { ...mockSubmission, id: submissionId || "sub_demo" };

    const [scores, setScores] = useState({
        r1: submission.scores?.r1 || 0,
        r2: submission.scores?.r2 || 0,
        r3: submission.scores?.r3 || 0
    });
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    // ISSUE 2 FIX: LOAD CORRECT DATA (PER EVENT ISOLATION)
    useEffect(() => {
        const storageKey = `evaluation_${eventId}_${submission.id}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setScores(parsed.scores);
                setFeedback(parsed.feedback || '');
                if (!parsed.isDraft) setIsLocked(true);
            } catch (e) {
                console.error("Failed to parse saved evaluation", e);
            }
        }
    }, [submission.id, eventId]);

    const handleScoreChange = (round: 'r1' | 'r2' | 'r3', value: string) => {
        if (isLocked) return;
        setScores(prev => ({
            ...prev,
            [round]: Math.min(Math.max(0, Number(value)), 100) // Assuming 100 max per round
        }));
    };

    const totalScore = Number(scores.r1) + Number(scores.r2) + Number(scores.r3);

    const handleDraft = () => {
        const payload = {
            id: submission.id,
            eventId,
            scores,
            feedback,
            isDraft: true,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(`evaluation_${eventId}_${submission.id}`, JSON.stringify(payload));
        toast.success("Progress cached for this event 💾");
    };

    const handleSubmit = () => {
        setLoading(true);
        try {
            const payload = {
                id: submission.id,
                eventId,
                teamName: submission.teamName,
                project: submission.project,
                scores,
                total: totalScore,
                feedback,
                isDraft: false,
                submittedAt: new Date().toISOString()
            };

            // ISOLATED STORAGE PER EVENT AND TEAM
            localStorage.setItem(`evaluation_${eventId}_${submission.id}`, JSON.stringify(payload));
            
            // Notify dashboard to update stats
            window.dispatchEvent(new Event("storage"));
            
            toast.success("Assessment Finalized for this Event ✅");
            setIsLocked(true);
            setTimeout(() => navigate(-1), 1500);
        } catch (error) {
            toast.error("Cloud-sync simulation failed");
        } finally {
            setLoading(false);
        }
    };

    const isValidGithub = (url: string) => {
        // Regex to match https://github.com/username/repository format
        return /^https:\/\/github.com\/[^/]+\/[^/]+/.test(url);
    };

    const handleGithubClick = () => {
        const url = submission.github;
        console.log("GitHub URL Debug:", url);

        if (!url || url.trim() === "") {
            toast.error("GitHub repository link not provided");
            return;
        }

        if (!isValidGithub(url)) {
            toast.error("Invalid GitHub repository link format");
            return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
    };

    const openLiveLink = () => {
        const url = submission.demo || submission.live;
        if (url && url.trim() !== "") {
            const targetUrl = url.startsWith("http") ? url : `https://${url}`;
            window.open(targetUrl, "_blank", "noopener,noreferrer");
        }
    };

    if (!submission) return <div className="p-8 text-center font-bold text-red-500">Submission Context Missing</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent uppercase tracking-tight">Assessment Studio</h1>
                    <p className="text-muted-foreground font-medium mt-1 uppercase tracking-widest text-[10px]">
                        Analyzing: <span className="text-foreground font-black">{submission.teamName}</span> — {submission.project}
                    </p>
                </div>
                <div className="text-right bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Total Aggregate</p>
                    <p className="text-4xl font-black text-primary">{totalScore} <span className="text-sm font-medium text-muted-foreground">/ 300</span></p>
                </div>
            </div>

            {/* Submission Assets */}
            <div className="p-6 bg-card border border-border/50 rounded-3xl space-y-4 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-primary" />
                    Project Deliverables
                </h3>
                <div className="flex gap-4">
                    <Button 
                        variant="secondary" 
                        className="gap-2 rounded-xl h-11 px-6 font-bold" 
                        onClick={handleGithubClick}
                        title="Open GitHub Repository"
                    >
                        GitHub Repo
                    </Button>
                    <Button 
                        variant="secondary" 
                        className="gap-2 rounded-xl h-11 px-6 font-bold" 
                        onClick={openLiveLink}
                        title="Open Live Intelligence"
                    >
                        Live Link
                    </Button>
                </div>
            </div>

            {/* Evaluation Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['r1', 'r2', 'r3'].map((round, idx) => (
                    <motion.div
                        key={round}
                        className="p-6 bg-card border border-border/50 rounded-3xl hover:border-primary/50 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Round {idx + 1}</label>
                            <Trophy className="w-4 h-4 text-primary/40" />
                        </div>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={scores[round as keyof typeof scores]}
                            onChange={(e) => handleScoreChange(round as any, e.target.value)}
                            disabled={isLocked}
                            className="w-full text-4xl font-black bg-transparent border-none focus:ring-0 text-center placeholder:text-slate-200"
                            placeholder="0"
                        />
                        <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary transition-all duration-500" 
                                style={{ width: `${scores[round as keyof typeof scores]}%` }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Feedback Matrix */}
            <div className="space-y-3">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Critical Feedback</label>
                <textarea
                    className="w-full h-40 p-6 bg-card border border-border/50 rounded-3xl resize-none focus:ring-2 ring-primary/20 outline-none font-medium transition-all"
                    placeholder="Provide actionable insights for the development team..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={isLocked}
                />
            </div>

            {/* Command Actions */}
            <div className="flex justify-end gap-4 pt-6">
                {!isLocked ? (
                    <>
                        <Button 
                            variant="ghost" 
                            className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px]" 
                            disabled={loading} 
                            onClick={handleDraft}
                        >
                            Save Progress
                        </Button>
                        <Button 
                            className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20" 
                            disabled={loading} 
                            onClick={handleSubmit}
                        >
                            Finalize Assessment
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center gap-3 text-green-500 font-black uppercase tracking-widest text-[10px] bg-green-500/5 px-8 h-14 rounded-2xl border border-green-500/20">
                        <CheckCircle className="w-5 h-5" />
                        Intelligence Sealed
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvaluationPage;
