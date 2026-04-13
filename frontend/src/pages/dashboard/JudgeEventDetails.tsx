import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Users, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { judgeService } from '@/services/judgeService';

interface Submission {
    id: string;
    title: string;
    abstract: string;
    status: string;
    teamName?: string;
    members?: string[];
    files?: { type: string; name: string; url: string }[];
    github?: string;
    demo?: string;
}

const mockSubmissions: Submission[] = [
    {
        id: "sub1",
        title: "AI Healthcare Navigator",
        abstract: "An LLM-powered diagnostic assistant for rural clinics with offline support.",
        status: "SUBMITTED",
        teamName: "CodeCrafters",
        members: ["Aarav Sharma", "Rohan Gupta", "Ananya Iyer"],
        github: "https://github.com/codecrafters/healthcare-ai",
        demo: "https://healthcare-navigator.io",
        files: [
            { type: "ppt", name: "Project_Presentation.pptx", url: "https://example.com/sample.pptx" },
            { type: "video", name: "Demo_Video", url: "https://youtube.com/watch?v=dQw4w9WgXcQ" }
        ]
    },
    {
        id: "sub2",
        title: "Decentralized Energy Grid",
        abstract: "A peer-to-peer energy trading platform using smart contracts on Polygon.",
        status: "EVALUATED",
        teamName: "DesignMinds",
        members: ["Ishita Verma", "Rahul Kumar"],
        github: "https://github.com/designminds/energy-grid",
        demo: "https://energy-grid.vercel.app",
        files: [
            { type: "pdf", name: "Technical_Specification.pdf", url: "https://example.com/sample.pdf" }
        ]
    },
    {
        id: "sub_nexus",
        title: "Smart Traffic System",
        abstract: "AI-powered urban mobility platform optimizing traffic flow through real-time edge processing.",
        status: "SUBMITTED",
        teamName: "Nexus Builders",
        members: ["Ananya Singh", "Rahul Kumar"],
        github: "https://github.com/nexusbuilders/smart-city",
        demo: "https://nexus-traffic.io",
        files: [
            { type: "pdf", name: "System Architecture.pdf", url: "https://example.com/sample.pdf" },
            { type: "video", name: "Demo_Video", url: "https://youtube.com/" }
        ]
    }
];

const JudgeEventDetails = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!eventId) return;
            try {
                const data = await judgeService.getEventSubmissions(eventId);
                setSubmissions(data);
            } catch (error) {
                console.error("Failed to fetch submissions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, [eventId]);

    const submissionsToShow = submissions && submissions.length > 0 ? submissions : mockSubmissions;

    if (loading) return <div className="p-8 text-center font-bold uppercase tracking-widest text-slate-400">Loading submissions...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Event Submissions</h1>
                    <p className="text-muted-foreground mt-2">
                        Select a submission and review deliverables to evaluate.
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/dashboard/judge/events')}>
                    Back to Events
                </Button>
            </div>

            <div className="grid gap-4">
                {submissionsToShow.length === 0 ? (
                    <div className="p-8 text-center border border-dashed rounded-xl">
                        No submissions found for this event.
                    </div>
                ) : (
                    submissionsToShow.map((sub, index) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 bg-card border rounded-2xl border-border/50 hover:border-primary/50 transition-all group"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-3 flex-1">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{sub.title}</h3>
                                            {sub.status === 'EVALUATED' && (
                                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                                    Evaluated
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                            {sub.abstract}
                                        </p>
                                    </div>

                                    {sub.members && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                            <Users className="w-3 h-3 text-primary" />
                                            Roster: {sub.members.join(", ")}
                                        </div>
                                    )}

                                    {sub.files && (
                                        <div className="flex gap-2 pt-1">
                                            {sub.files.map((file, fIdx) => (
                                                <Button
                                                    key={fIdx}
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-7 text-[10px] font-black uppercase tracking-tighter px-3 rounded-lg"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(file.url, "_blank");
                                                    }}
                                                >
                                                    <FileText className="w-3 h-3 mr-1.5" />
                                                    {file.type}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Button 
                                    className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10"
                                    onClick={() => navigate(`/dashboard/judge/evaluate/${sub.id}`, { 
                                        state: { submission: sub, eventId: eventId } 
                                    })}
                                >
                                    Assess Work
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JudgeEventDetails;
