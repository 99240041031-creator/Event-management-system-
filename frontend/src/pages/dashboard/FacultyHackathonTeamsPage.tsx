import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { facultyClubApi } from '@/lib/api';
import { ChevronLeft, Save, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FacultyHackathonTeamsPage = () => {
    const { hackathonId } = useParams<{ hackathonId: string }>();
    const navigate = useNavigate();
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);

    useEffect(() => {
        if (hackathonId) {
            loadTeams();
        }
    }, [hackathonId]);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const response = await facultyClubApi.getHackathonTeams(hackathonId!);
            setTeams(response || []);
        } catch (error) {
            console.error('Failed to load teams:', error);
            toast.error('Failed to load teams');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenScoreDialog = (team: any) => {
        setSelectedTeam(team);
        setScore(team.totalScore?.toString() || '');
        setFeedback(team.feedback || '');
        setIsScoreDialogOpen(true);
    };

    const handleSaveScore = async () => {
        if (!selectedTeam || !score) return;

        try {
            await facultyClubApi.scoreTeam(selectedTeam.id, parseFloat(score), feedback);
            toast.success('Score updated successfully');
            setIsScoreDialogOpen(false);
            loadTeams();
        } catch (error) {
            console.error('Failed to update score:', error);
            toast.error('Failed to update score');
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <h1 className="text-2xl font-bold">Hackathon Teams</h1>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading teams...</div>
            ) : teams.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center text-slate-500">
                        No teams registered yet.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {teams.map((team) => (
                        <Card key={team.id}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>{team.teamName}</span>
                                    {team.totalScore > 0 && <Badge variant="secondary"><Trophy className="h-3 w-3 mr-1" /> {team.totalScore}</Badge>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Project</p>
                                        <p className="font-semibold">{team.projectTitle || 'No Title'}</p>
                                        <p className="text-sm text-slate-600 line-clamp-2">{team.projectDescription}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Members</p>
                                        <ul className="text-sm list-disc list-inside">
                                            {team.members?.map((m: any) => (
                                                <li key={m.id}>{m.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    {team.submissionUrl && (
                                        <a href={team.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block">
                                            View Submission
                                        </a>
                                    )}
                                    <Button className="w-full" onClick={() => handleOpenScoreDialog(team)}>
                                        Manage Score
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isScoreDialogOpen} onOpenChange={setIsScoreDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Score Team: {selectedTeam?.teamName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Total Score</Label>
                            <Input type="number" value={score} onChange={(e) => setScore(e.target.value)} placeholder="0.0" />
                        </div>
                        <div>
                            <Label>Feedback</Label>
                            <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Provide feedback for the team..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsScoreDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveScore} disabled={!score}><Save className="h-4 w-4 mr-2" /> Save Score</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FacultyHackathonTeamsPage;
