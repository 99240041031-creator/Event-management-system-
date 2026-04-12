import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LifeBuoy,
    MessageSquare,
    Send,
    Clock,
    CheckCircle2,
    AlertCircle,
    HelpCircle,
    Plus,
    ChevronRight,
    ShieldAlert,
    X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supportApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const SupportCenter = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [showCodeOfConduct, setShowCodeOfConduct] = useState(false);

    const [newTicket, setNewTicket] = useState({
        category: 'TECHNICAL',
        title: '',
        description: '',
        priority: 'MEDIUM'
    });

    useEffect(() => {
        if (user) {
            fetchTickets();
            fetchFAQs();
        }
    }, [user]);

    const fetchTickets = async () => {
        try {
            const isAdmin = user?.role === 'ambassador' || user?.role === 'college_admin';
            let data;

            if (isAdmin) {
                // @ts-ignore - getAllTickets exists in updated api
                data = await supportApi.getAllTickets();
            } else {
                data = await supportApi.getUserTickets(user!.id);
            }

            setTickets(data);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        }
    };

    const fetchFAQs = async () => {
        try {
            const data: any = await supportApi.getFAQs();
            if (Array.isArray(data)) {
                setFaqs(data);
            }
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
            // Fallback to static if API fails
            setFaqs([
                { question: "How long does it take to resolve a ticket?", answer: "Most tickets are reviewed and resolved within 24-48 hours." },
                { question: "Can I appeal a hackathon result?", answer: "Yes, select the 'HACKATHON_APPEAL' category when creating your ticket." },
                { question: "Is my identity protected?", answer: "Tickets are handled confidentially by authorized staff members." }
            ]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTicket.title || !newTicket.description) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await supportApi.create({
                userId: user!.id,
                ...newTicket
            });
            toast.success("Ticket created successfully.");
            setShowNewForm(false);
            setNewTicket({ category: 'TECHNICAL', title: '', description: '', priority: 'MEDIUM' });
            fetchTickets();
        } catch (error) {
            toast.error("Failed to create ticket");
        } finally {
            setLoading(false);
        }
    };

    const getStatusTheme = (status: string) => {
        switch (status) {
            case 'OPEN': return { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Clock };
            case 'UNDER_REVIEW': return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertCircle };
            case 'RESOLVED': return { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2 };
            case 'CLOSED': return { color: 'text-slate-500', bg: 'bg-slate-500/10', icon: CheckCircle2 };
            default: return { color: 'text-slate-500', bg: 'bg-slate-100', icon: HelpCircle };
        }
    };

    const filteredTickets = (status: string) => {
        if (status === 'all') return tickets;
        if (status === 'active') return tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED');
        if (status === 'resolved') return tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED');
        return tickets;
    };

    const TicketList = ({ filter }: { filter: string }) => {
        const list = filteredTickets(filter);

        if (list.length === 0) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/50 py-12 text-center rounded-[32px]">
                        <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">No tickets found</p>
                        <p className="text-slate-400 text-sm">Everything seems to be running smoothly!</p>
                    </Card>
                </motion.div>
            );
        }

        if (list.length === 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <MessageSquare className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tickets yet</h3>
                    <p className="text-slate-500 text-sm mb-6">Create your first support ticket to get started</p>
                    <Button
                        onClick={() => setShowNewForm(true)}
                        className="rounded-xl h-12 px-6 font-bold bg-[hsl(var(--navy))]"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        CREATE TICKET
                    </Button>
                </motion.div>
            );
        }

        return (
            <div className="space-y-4">
                {list.map((t, idx) => {
                    const theme = getStatusTheme(t.status);
                    const StatusIcon = theme.icon;
                    return (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card
                                onClick={() => navigate(`/dashboard/support/${t.id}`)}
                                className="border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "mt-1 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                                theme.bg
                                            )}>
                                                <StatusIcon className={cn("h-5 w-5", theme.color)} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-black text-lg text-slate-900 dark:text-white line-clamp-1">{t.title}</h3>
                                                    <Badge variant="outline" className={cn("capitalize font-bold border-0", theme.bg, theme.color)}>
                                                        {t.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-500 line-clamp-1">{t.description}</p>
                                                <div className="flex items-center gap-3 mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>{t.category}</span>
                                                    <span>•</span>
                                                    <span>{format(new Date(t.createdAt), 'MMM d, h:mm a')}</span>
                                                    {t.priority === 'CRITICAL' && (
                                                        <span className="text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" /> CRITICAL
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-[24px] bg-[hsl(var(--navy))] flex items-center justify-center shadow-xl shadow-blue-500/20">
                        <LifeBuoy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Support Center</h1>
                        <p className="text-slate-500 font-medium">Have an issue? We're here to help.</p>
                    </div>
                </div>

                <Button
                    size="lg"
                    onClick={() => setShowNewForm(true)}
                    className="rounded-2xl h-14 px-8 font-bold bg-[hsl(var(--navy))] hover:scale-105 transition-transform"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    NEW GRIEVANCE
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left: Ticket List */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="bg-transparent gap-2 p-0 h-auto">
                            <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all shadow-sm">
                                All Tickets
                            </TabsTrigger>
                            <TabsTrigger value="active" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all shadow-sm">
                                Active
                            </TabsTrigger>
                            <TabsTrigger value="resolved" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all shadow-sm">
                                Resolved
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-8">
                            <TicketList filter="all" />
                        </TabsContent>
                        <TabsContent value="active" className="mt-8">
                            <TicketList filter="active" />
                        </TabsContent>
                        <TabsContent value="resolved" className="mt-8">
                            <TicketList filter="resolved" />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right: FAQs & Stats */}
                <div className="space-y-6">
                    <Card className="border-none bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-[40px] p-8 overflow-hidden relative">
                        <ShieldAlert className="absolute -bottom-10 -right-10 h-40 w-40 text-white/10 rotate-12" />
                        <h3 className="text-2xl font-black mb-2">Safety Policy</h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Our ecosystem mandates a zero-tolerance policy towards misconduct. Report any violations here.
                        </p>
                        <Button
                            variant="secondary"
                            className="mt-6 rounded-xl font-bold w-full h-12"
                            onClick={() => setShowCodeOfConduct(true)}
                        >
                            READ CODE OF CONDUCT
                        </Button>
                    </Card>

                    <Card className="border-none rounded-[32px] overflow-hidden shadow-lg bg-white dark:bg-slate-900">
                        <CardHeader className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Quick Help</CardTitle>
                                    <CardDescription className="text-sm text-slate-500">Frequently asked questions</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {faqs.map((faq, i) => (
                                <div key={i} className="space-y-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0 last:mb-0">
                                    <div className="flex items-start gap-2">
                                        <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{faq.question || faq.q}</p>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">{faq.answer || faq.a}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* New Ticket Modal */}
            <AnimatePresence>
                {showNewForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowNewForm(false)}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg my-8"
                        >
                            <Card className="border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
                                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative border-b border-blue-700">
                                    <button
                                        onClick={() => setShowNewForm(false)}
                                        className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl font-black">New Ticket</CardTitle>
                                            <CardDescription className="text-blue-100 mt-1">Submit your issue for review</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 bg-white dark:bg-slate-900">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-slate-500 ml-1">Category</label>
                                                <Select
                                                    value={newTicket.category}
                                                    onValueChange={(val) => setNewTicket({ ...newTicket, category: val })}
                                                >
                                                    <SelectTrigger className="rounded-xl h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-medium">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="TECHNICAL">Technical Issue</SelectItem>
                                                        <SelectItem value="HACKATHON">Hackathon Related</SelectItem>
                                                        <SelectItem value="CERTIFICATE">Certificate Issue</SelectItem>
                                                        <SelectItem value="PAYMENT">Payment</SelectItem>
                                                        <SelectItem value="MISCONDUCT">Misconduct</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-slate-500 ml-1">Priority</label>
                                                <Select
                                                    value={newTicket.priority}
                                                    onValueChange={(val) => setNewTicket({ ...newTicket, priority: val })}
                                                >
                                                    <SelectTrigger className="rounded-xl h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-medium">
                                                        <SelectValue placeholder="Select priority" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="LOW">Low</SelectItem>
                                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                                        <SelectItem value="HIGH">High</SelectItem>
                                                        <SelectItem value="CRITICAL">Critical</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-500 ml-1">Subject</label>
                                            <Input
                                                placeholder="Brief summary of the issue"
                                                className="rounded-xl h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-medium"
                                                value={newTicket.title}
                                                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-500 ml-1">Description</label>
                                            <Textarea
                                                placeholder="Please describe your issue in detail..."
                                                className="rounded-xl min-h-[120px] border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-4 font-medium"
                                                value={newTicket.description}
                                                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 h-12 rounded-xl font-bold border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                onClick={() => setShowNewForm(false)}
                                            >
                                                CANCEL
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-1 h-12 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                                                disabled={loading}
                                            >
                                                {loading ? 'SUBMITTING...' : 'CREATE TICKET'}
                                                <Send className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Code of Conduct Modal */}
            <AnimatePresence>
                {showCodeOfConduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCodeOfConduct(false)}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl my-8"
                        >
                            <Card className="border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col bg-white dark:bg-slate-900">
                                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 shrink-0 relative border-b border-indigo-600">
                                    <button
                                        onClick={() => setShowCodeOfConduct(false)}
                                        className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl font-black flex items-center gap-2">
                                                <ShieldAlert className="h-6 w-6" />
                                                Code of Conduct
                                            </CardTitle>
                                            <CardDescription className="text-indigo-100 mt-1">
                                                Standards for a safe and inclusive community
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 overflow-y-auto bg-white dark:bg-slate-900">
                                    <div className="prose dark:prose-invert max-w-none space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Respect & Inclusivity</h3>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm">
                                                We are committed to providing a friendly, safe and welcoming environment for all, regardless of gender, sexual orientation, disability, ethnicity, or religion.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Zero Tolerance for Harassment</h3>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm">
                                                Harassment includes offensive verbal comments, deliberate intimidation, stalking, following, harassing photography or recording, sustained disruption of talks or other events, inappropriate physical contact, and unwelcome sexual attention.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Academic Integrity</h3>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm">
                                                Plagiarism, cheating, or misrepresentation of work in hackathons and competitions will result in immediate disqualification and potential account suspension.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Reporting Violations</h3>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm">
                                                If you notice a violation of the Code of Conduct, please report it immediately using the support ticket system under the "MISCONDUCT" category.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full mt-8 h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800"
                                        onClick={() => setShowCodeOfConduct(false)}
                                    >
                                        I UNDERSTAND
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SupportCenter;
