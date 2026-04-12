import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Users,
    Calendar,
    Trophy,
    MessageSquare,
    DollarSign,
    Award,
    Edit,
    Trash,
    ChevronLeft,
    TrendingUp,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { facultyClubApi } from '@/lib/api';
import type { Club } from '@/types';

// Import Sub-components
import ClubRecruitment from './club-management/ClubRecruitment';
import ClubMembers from './club-management/ClubMembers';
import ClubEvents from './club-management/ClubEvents';
import ClubHackathons from './club-management/ClubHackathons';
import ClubPosts from './club-management/ClubPosts';
import ClubBudget from './club-management/ClubBudget';
import ClubAmbassadors from './club-management/ClubAmbassadors';
import ClubAnalytics from './club-management/ClubAnalytics';
import ClubCertificates from './club-management/ClubCertificates';

const FacultyClubDashboard = () => {
    const { clubId } = useParams<{ clubId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [club, setClub] = useState<Club | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (clubId) {
            loadClubDetails();
        }
    }, [clubId]);

    const loadClubDetails = async () => {
        try {
            setLoading(true);
            const response = await facultyClubApi.getDetails(clubId!);
            setClub(response);
        } catch (error) {
            console.error('Failed to load club details:', error);
            toast.error('Failed to load club details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading club details...</div>;
    if (!club) return <div className="p-8 text-center">Club not found</div>;

    const handleRecruitmentToggle = (isOpen: boolean) => {
        setClub(prev => prev ? { ...prev, recruitmentOpen: isOpen } : null);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/dashboard/faculty/clubs')}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back to Clubs
                </Button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                    {club.bannerUrl && <img src={club.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-50" />}
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-12 flex items-end justify-between">
                        <div className="flex items-end gap-6">
                            <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-900 shadow-lg bg-white">
                                <AvatarImage src={club.logoUrl} />
                                <AvatarFallback className="text-2xl">{club.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="mb-2">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{club.name}</h1>
                                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                    <Badge variant="outline">{club.category}</Badge>
                                    <span>•</span>
                                    <span>{club.collegeName}</span>
                                </p>
                            </div>
                        </div>
                        <div className="mb-2 flex gap-2">
                            <Button variant="outline" onClick={() => toast.info('Edit details feature coming soon')}>
                                <Edit className="h-4 w-4 mr-2" /> Edit Details
                            </Button>
                        </div>
                    </div>

                    <p className="mt-6 text-slate-600 dark:text-slate-300 max-w-4xl">
                        {club.description}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 h-auto flex-wrap justify-start">
                    <TabsTrigger value="overview" className="gap-2"><TrendingUp className="h-4 w-4" /> Overview</TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-2"><TrendingUp className="h-4 w-4" /> Analytics</TabsTrigger>
                    <TabsTrigger value="recruitment" className="gap-2"><FileText className="h-4 w-4" /> Recruitment</TabsTrigger>
                    <TabsTrigger value="members" className="gap-2"><Users className="h-4 w-4" /> Members</TabsTrigger>
                    <TabsTrigger value="events" className="gap-2"><Calendar className="h-4 w-4" /> Events</TabsTrigger>
                    <TabsTrigger value="hackathons" className="gap-2"><Trophy className="h-4 w-4" /> Hackathons</TabsTrigger>
                    <TabsTrigger value="posts" className="gap-2"><MessageSquare className="h-4 w-4" /> Posts</TabsTrigger>
                    <TabsTrigger value="budget" className="gap-2"><DollarSign className="h-4 w-4" /> Budget</TabsTrigger>
                    <TabsTrigger value="certificates" className="gap-2"><Award className="h-4 w-4" /> Certificates</TabsTrigger>
                    <TabsTrigger value="ambassadors" className="gap-2"><Award className="h-4 w-4" /> Ambassadors</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500 uppercase">Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    {club.isActive ? <Badge className="bg-green-500">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500 uppercase">Recruitment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {club.recruitmentOpen ? <span className="text-green-600">Open</span> : <span className="text-slate-500">Closed</span>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analytics">
                    <ClubAnalytics clubId={clubId!} />
                </TabsContent>

                <TabsContent value="recruitment">
                    <ClubRecruitment clubId={clubId!} isRecruitmentOpen={club.recruitmentOpen || false} onToggle={handleRecruitmentToggle} />
                </TabsContent>

                <TabsContent value="members">
                    <ClubMembers clubId={clubId!} />
                </TabsContent>

                <TabsContent value="events">
                    <ClubEvents clubId={clubId!} />
                </TabsContent>

                <TabsContent value="hackathons">
                    <ClubHackathons clubId={clubId!} />
                </TabsContent>

                <TabsContent value="posts">
                    <ClubPosts clubId={clubId!} />
                </TabsContent>

                <TabsContent value="budget">
                    <ClubBudget clubId={clubId!} />
                </TabsContent>

                <TabsContent value="certificates">
                    <ClubCertificates clubId={clubId!} />
                </TabsContent>

                <TabsContent value="ambassadors">
                    <ClubAmbassadors clubId={clubId!} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FacultyClubDashboard;

