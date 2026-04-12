import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, CheckCircle, XCircle, Award, RefreshCw, Calendar, MapPin, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { facultyClubApi } from '@/lib/api';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ClubEventRegistration } from '@/types';

const ClubEvents = ({ clubId }: { clubId: string }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [participants, setParticipants] = useState<ClubEventRegistration[]>([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadEvents();
    }, [clubId]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const res = await facultyClubApi.getEvents(clubId);
            setEvents(res || []);
        } catch (error) {
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const loadParticipants = async (eventId: string) => {
        try {
            setLoadingParticipants(true);
            const data = await facultyClubApi.getEventParticipants(eventId);
            setParticipants(data || []);
        } catch (error) {
            toast.error('Failed to load participants');
        } finally {
            setLoadingParticipants(false);
        }
    };

    const handleMarkAttendance = async (eventId: string, studentId: string, status: string) => {
        try {
            await facultyClubApi.markAttendance(eventId, studentId, status);
            toast.success(`Attendance marked as ${status.toLowerCase()}`);
            loadParticipants(eventId);
        } catch (error) {
            toast.error('Failed to update attendance');
        }
    };

    const handleGenerateCertificates = async (eventId: string) => {
        try {
            toast.promise(facultyClubApi.generateCertificates(clubId, eventId), {
                loading: 'Generating certificates...',
                success: 'Certificates generation started',
                error: 'Failed to generate certificates'
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold font-display">Event Portfolio</h3>
                    <p className="text-sm text-slate-500">Manage registrations, attendance, and certificates for your events.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={loadEvents} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => navigate(`/dashboard/faculty/events/create?clubId=${clubId}`)} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none">
                        <Plus className="h-4 w-4 mr-2" /> Create Event
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : events.length === 0 ? (
                <Card className="border-dashed border-2 bg-slate-50/50">
                    <CardContent className="p-12 text-center flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <Calendar className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-slate-700 dark:text-slate-300">No events found</p>
                            <p className="text-sm text-slate-500 max-w-xs">Schedule your first club event to start tracking engagement and issuing certificates.</p>
                        </div>
                        <Button variant="outline" onClick={() => navigate(`/dashboard/faculty/events/create?clubId=${clubId}`)}>Organize New Event</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((e: any) => (
                        <Card key={e.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-white dark:bg-slate-900 shadow-sm relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={e.status === 'ACTIVE' || e.status === 'registration_open' ? 'default' : 'secondary'} className="rounded-md uppercase text-[10px] font-bold tracking-wider">
                                        {e.status?.replace('_', ' ')}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                                        <Users className="h-3 w-3" />
                                        <span>{e.registeredCount || 0}</span>
                                    </div>
                                </div>
                                <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-blue-600 transition-colors">{e.title}</CardTitle>
                                <div className="space-y-1.5 mt-3">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Calendar className="h-3 w-3 text-blue-500" />
                                        <span>{new Date(e.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <MapPin className="h-3 w-3 text-blue-500" />
                                        <span>{e.location || 'Online'}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter className="p-5 pt-0 flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 text-xs font-bold rounded-lg border-slate-200"
                                    onClick={() => {
                                        setSelectedEvent(e);
                                        loadParticipants(e.id);
                                    }}
                                >
                                    <Users className="h-3 w-3 mr-1.5" /> Participants
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="px-2 border-slate-200"
                                    onClick={() => handleGenerateCertificates(e.id)}
                                    title="Issue Certificates"
                                >
                                    <Award className="h-3 w-3" />
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="icon" 
                                    className="h-9 w-9 bg-blue-50 text-blue-600 hover:bg-blue-100 border-none rounded-lg"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Participants Dialog */}
            <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-slate-900 text-white">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <DialogTitle className="text-xl font-bold">{selectedEvent?.title}</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Attendance and participation record
                                </DialogDescription>
                            </div>
                            <Badge className="bg-blue-600">{participants.length} Registered</Badge>
                        </div>
                    </DialogHeader>
                    
                    <div className="max-h-[60vh] overflow-y-auto p-6 bg-white dark:bg-slate-900">
                        {loadingParticipants ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-xl" />
                                ))}
                            </div>
                        ) : participants.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 italic">No registrations for this event yet.</div>
                        ) : (
                            <div className="space-y-3">
                                {participants.map((reg) => (
                                    <div key={reg.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                                                    {reg.studentName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-sm">{reg.studentName}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Badge variant="outline" className={`text-[10px] h-4 leading-none ${
                                                        reg.attendanceStatus === 'ATTENDED' ? 'border-green-200 text-green-600 bg-green-50' : 
                                                        reg.attendanceStatus === 'ABSENT' ? 'border-red-200 text-red-600 bg-red-50' : ''
                                                    }`}>
                                                        {reg.attendanceStatus}
                                                    </Badge>
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <Clock className="h-2 w-2" />
                                                        {new Date(reg.registeredAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className={`h-8 w-8 p-0 rounded-full hover:bg-green-100 hover:text-green-600 ${reg.attendanceStatus === 'ATTENDED' ? 'text-green-600 bg-green-50' : 'text-slate-300'}`}
                                                onClick={() => handleMarkAttendance(selectedEvent.id, reg.studentId, 'ATTENDED')}
                                            >
                                                <CheckCircle className="h-5 w-5" />
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className={`h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-600 ${reg.attendanceStatus === 'ABSENT' ? 'text-red-600 bg-red-50' : 'text-slate-300'}`}
                                                onClick={() => handleMarkAttendance(selectedEvent.id, reg.studentId, 'ABSENT')}
                                            >
                                                <XCircle className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ClubEvents;
