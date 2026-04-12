import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, Play, Users, Clock } from 'lucide-react';
import { facultyApi } from '@/lib/api';
import { toast } from 'sonner';

const FacultyStartEventPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const response = await facultyApi.getEvents(0, 100); // Fetch all for now
            const eventsList = Array.isArray(response) ? response : (response?.content || []);
            // Filter for events that are approved and not yet completed (optional logic)
            setEvents(eventsList);
        } catch (error: any) {
            console.error('Failed to load events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleStartEvent = (eventId: string) => {
        // Navigate to the event detail page where they can manage/start it
        // Or navigate to a specific "Live Mode" page if it existed
        navigate(`/dashboard/faculty/events/${eventId}`);
        toast.success('Opening event management console...');
    };

    if (loading) {
        return <div className="p-8">Loading events...</div>;
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold tracking-tight">Start an Event</h1>
                <p className="text-muted-foreground mt-2">Select an event to launch its live management console (Attendance, Q&A, etc.)</p>
            </motion.div>

            {events.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No active events found</h3>
                        <p className="text-slate-500 mb-4">You don't have any events scheduled to start right now.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge>{event.eventType?.replace('_', ' ')}</Badge>
                                        <Badge variant="outline" className={event.status === 'APPROVED' ? 'text-green-600 border-green-600' : ''}>
                                            {event.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="mt-2 line-clamp-1">{event.title}</CardTitle>
                                    <CardDescription>
                                        {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Date TBD'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{event.registeredCount || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{event.startTime || 'TBD'}</span>
                                            </div>
                                        </div>
                                        <Button className="w-full" size="lg" onClick={() => handleStartEvent(event.id)}>
                                            <Play className="mr-2 h-4 w-4" /> Start Event
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyStartEventPage;
