import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { judgeScoringService } from '../../services/judgeScoringService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Trophy, ChevronRight, UserCheck, ArrowUpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TeamLeaderboardEntry {
    submissionId: string;
    teamName: string;
    projectTitle: string;
    score: number;
    status: string;
}

const Shortlisting: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [teams, setTeams] = useState<TeamLeaderboardEntry[]>([]);
    const [shortlisted, setShortlisted] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                if (!id) return;
                const result = await judgeScoringService.getLeaderboard(id);
                setTeams(result);
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [id]);

    const toggleShortlist = (submissionId: string) => {
        setShortlisted(prev =>
            prev.includes(submissionId)
                ? prev.filter(id => id !== submissionId)
                : [...prev, submissionId]
        );
    };

    const handlePromote = async () => {
        if (shortlisted.length === 0) {
            toast.error("Please select at least one team to promote.");
            return;
        }
        toast.success(`Promoted ${shortlisted.length} teams to the next round!`);
        // In a real implementation, this would call a backend endpoint to update currentRound
    };

    return (
        <div className="p-8 space-y-6 bg-[#0a0c10] min-h-screen text-white">
            <div className="flex justify-between items-center bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div>
                    <h1 className="text-3xl font-bold">Team Shortlisting</h1>
                    <p className="text-gray-400 mt-1">Select elite teams to move into the next evaluation round</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => id && judgeScoringService.downloadReport(id)}
                        variant="outline"
                        className="border-gray-700 text-gray-400 hover:bg-gray-800 gap-2"
                    >
                        <Trophy className="w-4 h-4" />
                        Export PDF
                    </Button>
                    <Badge variant="outline" className="text-blue-400 border-blue-400/30 px-4 py-1">
                        {shortlisted.length} Selected
                    </Badge>
                    <Button
                        onClick={handlePromote}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    >
                        <ArrowUpCircle className="w-4 h-4" />
                        Promote to Next Round
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {teams.map((team, index) => (
                    <Card
                        key={team.submissionId}
                        className={`bg-gray-900 border-gray-800 transition-all ${shortlisted.includes(team.submissionId) ? 'border-blue-500 bg-blue-500/5' : 'hover:border-gray-700'
                            }`}
                    >
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${index < 3 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-800 text-gray-400'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-100">{team.teamName}</h3>
                                    <p className="text-gray-400 text-sm">{team.projectTitle}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">Total Score</div>
                                    <div className="text-2xl font-bold text-blue-400">{team.score.toFixed(1)}</div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant={shortlisted.includes(team.submissionId) ? "default" : "outline"}
                                        className={shortlisted.includes(team.submissionId) ? "bg-blue-600" : "border-gray-700 text-gray-400"}
                                        onClick={() => toggleShortlist(team.submissionId)}
                                    >
                                        {shortlisted.includes(team.submissionId) ? (
                                            <><UserCheck className="w-4 h-4 mr-2" /> Shortlisted</>
                                        ) : (
                                            "Select"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {teams.length === 0 && !loading && (
                    <div className="text-center py-20 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                        <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No submissions found to shortlist.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shortlisting;
