import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Plus,
    Settings,
    MessageSquare,
    Calendar,
    TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

import { clubMockData } from '@/mock/clubData';

const FacultyClubsPage = () => {
    const navigate = useNavigate();
    const [apiClubs] = useState<any[]>([]);
    
    // Fallback logic: Use API data if available, otherwise use high-fidelity mock data
    const clubs = apiClubs.length > 0 ? apiClubs : clubMockData.clubs;

    const stats = {
        totalClubs: clubs.length,
        totalMembers: clubs.reduce((sum, c) => sum + (c.memberCount || 0), 0),
        activeClubs: clubs.filter(c => c.status === 'ACTIVE').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">Club Management</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Manage clubs you're assigned to as faculty advisor
                </p>
            </motion.div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Assigned Clubs</p>
                                <p className="text-3xl font-bold mt-1">{stats.totalClubs}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Members</p>
                                <p className="text-3xl font-bold mt-1">{stats.totalMembers}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Active Clubs</p>
                                <p className="text-3xl font-bold mt-1">{stats.activeClubs}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Clubs List */}
            {clubs.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No clubs assigned</h3>
                        <p className="text-slate-500">You haven't been assigned to any clubs yet</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clubs.map((club) => (
                        <Card key={club.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => navigate(`/dashboard/student/clubs/${club.id}`)}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={club.logo} />
                                            <AvatarFallback>{club.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="line-clamp-1">{club.name}</CardTitle>
                                            <Badge variant="outline" className="mt-1">
                                                {club.category}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                                    {club.description || 'No description'}
                                </p>
                                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{club.memberCount || 0} members</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{club.eventsCount || 0} events</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <MessageSquare className="mr-1 h-4 w-4" /> Announcements
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyClubsPage;
