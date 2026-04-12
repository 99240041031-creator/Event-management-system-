import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { facultyClubApi } from '@/lib/api';
import { ChevronLeft, Medal } from 'lucide-react';
import RealTimeLeaderboard from '@/components/dashboard/RealTimeLeaderboard';
import { judgeScoringService } from '@/services/judgeScoringService';

const FacultyHackathonLeaderboardPage = () => {
    const { hackathonId } = useParams<{ hackathonId: string }>();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (hackathonId) {
            loadLeaderboard();
        }
    }, [hackathonId]);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await judgeScoringService.getLeaderboard(hackathonId!);
            setLeaderboard(response || []);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            toast.error('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return <Medal className="h-6 w-6 text-yellow-500" />;
        if (index === 1) return <Medal className="h-6 w-6 text-slate-400" />;
        if (index === 2) return <Medal className="h-6 w-6 text-amber-700" />;
        return <span className="font-bold text-slate-500">#{index + 1}</span>;
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <h1 className="text-2xl font-bold">Hackathon Leaderboard</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Standings</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-10">Loading standings...</div>
                    ) : (
                        <RealTimeLeaderboard hackathonId={hackathonId!} initialData={leaderboard} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FacultyHackathonLeaderboardPage;
