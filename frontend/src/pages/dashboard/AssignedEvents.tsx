import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { judgeService } from '@/services/judgeService';

interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    location: string;
    status: string;
    bannerImage?: string;
}

const mockAssignedEvents: Event[] = [
    {
        id: "event1",
        title: "AI Innovation Challenge",
        description: "Develop cutting-edge AI solutions for healthcare and finance industries.",
        startDate: "2024-05-15T09:00:00Z",
        location: "Virtual Hub",
        status: "ONGOING",
        bannerImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "event2",
        title: "Web3 Builders Hack",
        description: "Create decentralized applications and governance layers for the future of the web.",
        startDate: "2024-06-10T10:00:00Z",
        location: "Main Auditorium",
        status: "UPCOMING",
        bannerImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "event3",
        title: "Smart India Hackathon",
        description: "National level innovation challenge tackling real-world problems facing the citizens.",
        startDate: "2024-07-20T09:00:00Z",
        location: "Hall 7, Convention Center",
        status: "UPCOMING",
        bannerImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"
    }
];

const AssignedEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await judgeService.getAssignedEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch assigned events", error);
            } finally {
                setLoading(false);
            }
        };

        // Persist mock events to localStorage for dashboard stats
        localStorage.setItem("assigned_events", JSON.stringify(mockAssignedEvents));

        fetchEvents();
    }, []);

    const eventsToShow = events && events.length > 0 ? events : mockAssignedEvents;

    if (loading) {
        return <div className="p-8 text-center font-bold uppercase tracking-widest text-slate-400">Loading assigned events...</div>;
    }

    const cleanTitle = (title: string) => {
        return title.replace(/\b20\d{2}\b/g, "").replace(/\s+/g, " ").trim();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Assigned Events</h1>
                    <p className="text-muted-foreground mt-2">
                        Events you have been selected to judge.
                    </p>
                </div>
            </div>

            {eventsToShow.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No events assigned yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventsToShow.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Event Image */}
                            <div className="aspect-video bg-muted relative overflow-hidden">
                                {event.bannerImage ? (
                                    <img
                                        src={event.bannerImage}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                        <Calendar className="w-12 h-12 text-primary/20" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <Badge variant="secondary" className="backdrop-blur-md bg-background/80">
                                        {event.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                        {cleanTitle(event.title)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full group/btn"
                                    onClick={() => navigate(`/dashboard/judge/events/${event.id}`)}
                                >
                                    Evaluate Submissions
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignedEvents;
