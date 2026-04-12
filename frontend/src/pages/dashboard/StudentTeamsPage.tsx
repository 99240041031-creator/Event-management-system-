import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { studentTeamApi, hackathonApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Users,
    Plus,
    ArrowRight,
    Mail,
    Check,
    X,
    Trophy,
    Calendar,
    Briefcase,
    Zap
} from 'lucide-react';

const StudentTeamsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [teams, setTeams] = useState<any[]>([]);
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my-teams');

    // Create Team Form
    const [createOpen, setCreateOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamDesc, setNewTeamDesc] = useState('');
    const [selectedHackathon, setSelectedHackathon] = useState('');
    const [hackathons, setHackathons] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    // Fetch hackathons for dropdown
    useEffect(() => {
        if (createOpen) {
            hackathonApi.getAll().then(setHackathons).catch(console.error);
        }
    }, [createOpen]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [myTeams, myInvites] = await Promise.all([
                studentTeamApi.getMyTeams(user!.id),
                studentTeamApi.getInvites(user!.id)
            ]);
            setTeams(myTeams);
            setInvites(myInvites);
        } catch (error) {
            console.error("Failed to fetch teams data", error);
            // toast.error("Failed to load teams");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeamName || !selectedHackathon) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const res = await studentTeamApi.createTeam(user!.id, {
                name: newTeamName,
                hackathonId: selectedHackathon,
                maxMembers: 4,
                requiredSkills: "General",
                description: newTeamDesc
            });
            toast.success("Team created successfully!");
            setCreateOpen(false);
            fetchData(); // Refresh list
            navigate(`/dashboard/student/team/${res.id}`);
        } catch (error) {
            toast.error("Failed to create team");
        }
    };

    const handleAcceptInvite = async (teamId: string) => {
        try {
            await studentTeamApi.acceptInvite(teamId, user!.id);
            toast.success("Invite accepted!");
            fetchData();
        } catch (error) {
            toast.error("Failed to accept invite");
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--teal))]/10 rounded-full blur-3xl -mr-32 -mt-32" />

                <div className="relative z-10">
                    <h1 className="text-4xl font-black tracking-tight mb-2">My Teams</h1>
                    <p className="text-slate-400 font-medium max-w-md">
                        Collaborate, innovate, and ship projects with your squad.
                    </p>
                </div>

                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="relative z-10 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-lg h-14 px-8">
                            <Plus className="mr-2 h-5 w-5" /> CREATE NEW TEAM
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl">
                        <div className="p-8 space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Create Team</DialogTitle>
                                <DialogDescription>Build your dream team for the next big hackathon.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Hackathon</Label>
                                    <Select value={selectedHackathon} onValueChange={setSelectedHackathon}>
                                        <SelectTrigger className="rounded-xl h-12">
                                            <SelectValue placeholder="Select Hackathon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hackathons.map(h => (
                                                <SelectItem key={h.id} value={h.id}>{h.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Team Name</Label>
                                    <Input
                                        placeholder="e.g. Neural Navigators"
                                        className="rounded-xl h-12"
                                        value={newTeamName}
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description / Idea</Label>
                                    <Input
                                        placeholder="What are you building?"
                                        className="rounded-xl h-12"
                                        value={newTeamDesc}
                                        onChange={(e) => setNewTeamDesc(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateTeam} className="w-full h-12 rounded-xl bg-[hsl(var(--teal))] font-bold text-lg">
                                    Create Team
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 w-full sm:w-auto h-auto flex gap-2">
                    <TabsTrigger value="my-teams" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg font-bold">
                        My Teams <Badge className="ml-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900">{teams.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="invites" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg font-bold">
                        Invites <Badge className="ml-2 bg-[hsl(var(--teal))] text-white">{invites.length}</Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="my-teams">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                            ))
                        ) : teams.length > 0 ? (
                            teams.map((team) => (
                                <Card key={team.id} className="group rounded-[2.5rem] border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden hover:shadow-2xl transition-all duration-300">
                                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 pb-6 pt-8 px-8">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--teal))]/10 flex items-center justify-center text-[hsl(var(--teal))]">
                                                <Zap className="h-6 w-6" />
                                            </div>
                                            <Badge variant="outline" className="rounded-full">{team.members?.length} Members</Badge>
                                        </div>
                                        <CardTitle className="text-xl font-black line-clamp-1">{team.name}</CardTitle>
                                        <CardDescription className="line-clamp-1">{team.hackathonName || team.eventName || 'Unnamed Event'}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 font-bold">Your Role</span>
                                                <span className="font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                                                    {team.members?.find((m: any) => m.userId === user?.id)?.role}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 font-bold">Status</span>
                                                <span className="text-[hsl(var(--teal))] font-bold">{team.status}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            className="w-full rounded-2xl py-6 font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[hsl(var(--teal))] dark:hover:bg-[hsl(var(--teal))] transition-all group-hover:scale-[1.02]"
                                            onClick={() => navigate(`/dashboard/student/team/${team.id}`)}
                                        >
                                            OPEN DASHBOARD <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="h-24 w-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="h-10 w-10 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-black mb-2">No Teams Found</h3>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't joined any teams yet. Create one or ask for an invite!</p>
                                <Button onClick={() => setCreateOpen(true)} className="rounded-xl px-8 h-12 bg-[hsl(var(--teal))] font-bold">
                                    Create Your First Team
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="invites">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {invites.length > 0 ? (
                            invites.map((team) => (
                                <Card key={team.id} className="rounded-[2.5rem] border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
                                    <CardHeader className="bg-yellow-50 dark:bg-yellow-900/10 border-b border-yellow-100 dark:border-yellow-900/20">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-yellow-600" />
                                            <span className="font-bold text-yellow-700 text-sm uppercase tracking-wide">Pending Invite</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-4">
                                        <div>
                                            <h3 className="font-black text-2xl">{team.name}</h3>
                                            <p className="text-slate-500 font-medium text-sm">{team.hackathonName}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <span className="font-bold text-xs">{team.leaderName?.[0]}</span>
                                            </div>
                                            <span className="text-sm text-slate-600">Invited by <span className="font-bold text-slate-900 dark:text-white">{team.leaderName}</span></span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 grid grid-cols-2 gap-4">
                                        <Button variant="outline" className="rounded-xl h-12 font-bold border-slate-200">Decline</Button>
                                        <Button
                                            className="rounded-xl h-12 font-bold bg-[hsl(var(--teal))]"
                                            onClick={() => handleAcceptInvite(team.id)}
                                        >
                                            Accept
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-slate-400 font-medium">
                                No pending invites.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
};

export default StudentTeamsPage;
