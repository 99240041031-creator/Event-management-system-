import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award,
    Download,
    Search,
    ShieldCheck,
    Trophy,
    RefreshCw,
    Clock,
    Inbox
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { certificateApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import type { Certificate } from '@/types';

const CertificationCenter = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'hackathon' | 'workshop' | 'winner'>('all');
    const [error, setError] = useState(false);

    const fetchCertificates = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(false);
        try {
            const data = await certificateApi.getUserCertificates(user.id);
            setCertificates(data);
        } catch (error) {
            console.error('Failed to fetch certificates:', error);
            setError(true);
            toast.error('Failed to load certificates. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    const handleDownload = async (certId: string, certName: string) => {
        if (!user) return;
        const toastId = toast.loading('Generating secure PDF...');
        try {
            const blob = await certificateApi.download(certId, user.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Certificate_${certName.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success('Certificate downloaded successfully', { id: toastId });
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to safely download document', { id: toastId });
        }
    };

    const handleSeed = async () => {
        if (!user) return;
        const toastId = toast.loading('Syncing generic verified credentials...');
        try {
            await certificateApi.seed(user.id);
            await fetchCertificates();
            toast.success('Mock Certificates generated successfully!', { id: toastId });
        } catch (err) {
            toast.error('Failed to sync credentials', { id: toastId });
        }
    };

    const filteredCertificates = certificates.filter(cert => {
        const matchesSearch = (cert.eventTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cert.certificateId || '').toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'winner') return matchesSearch && (cert.role || '').toLowerCase().includes('winner');
        return matchesSearch && (cert.category || '').toLowerCase() === filter;
    });

    const categories = [
        { id: 'all', label: 'All Certificates' },
        { id: 'hackathon', label: 'Hackathons' },
        { id: 'workshop', label: 'Workshops' },
        { id: 'winner', label: 'Winner Titles' }
    ] as const;

    return (
        <div className="min-h-screen bg-background p-6 lg:p-10">
            {/* Dashboard Header */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Verified Credentials</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                            Digital Archive
                        </h1>
                        <p className="text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed">
                            View, verify, and download your cryptographically secure certificates earned from hackathons, webinars, and events.
                        </p>
                    </div>

                    {certificates.length === 0 && !loading && !error && (
                        <Button 
                            onClick={handleSeed}
                            variant="outline" 
                            className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-all gap-2"
                        >
                            <RefreshCw className="h-4 w-4" /> Generate Test Data
                        </Button>
                    )}
                </div>
            </div>

            {/* Filters and Search */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-card p-3 rounded-2xl shadow-sm border border-border">
                    <div className="flex overflow-x-auto w-full lg:w-auto hide-scrollbar gap-2 p-1">
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setFilter(c.id)}
                                className={cn(
                                    "whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                                    filter === c.id
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Find by ID or Event Name..."
                            className="w-full pl-11 pr-4 py-6 bg-muted border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary shadow-inner text-foreground placeholder:text-muted-foreground"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-72 rounded-3xl bg-muted animate-pulse border border-border" />
                            ))}
                        </motion.div>
                    ) : error ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-destructive/10 rounded-3xl border border-destructive/20 p-12 text-center">
                            <RefreshCw className="h-12 w-12 text-destructive mx-auto mb-4 animate-spin" />
                            <h3 className="text-xl font-bold text-destructive mb-2">Connection Interrupted</h3>
                            <p className="text-destructive/80 mb-6">Unable to securely fetch your credentials.</p>
                            <Button onClick={fetchCertificates} size="lg" variant="destructive" className="font-bold">
                                Try Again
                            </Button>
                        </motion.div>
                    ) : filteredCertificates.length > 0 ? (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {filteredCertificates.map((cert) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={cert.id}
                                    whileHover={{ y: -5 }}
                                    className="group"
                                >
                                    <div 
                                        className="h-full bg-card text-card-foreground rounded-3xl overflow-hidden border border-border/50 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col relative cursor-pointer"
                                        onClick={() => navigate(`/dashboard/student/certificates/${cert.id}`)}
                                    >
                                        { (cert.role || '').toUpperCase().includes('WINNER') && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none" />
                                        )}
                                        
                                        <div className="p-8 flex-1 flex flex-col relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={cn(
                                                    "p-3 rounded-2xl flex items-center justify-center",
                                                    (cert.role || '').toUpperCase().includes('WINNER') 
                                                        ? 'bg-primary/20 text-primary' 
                                                        : 'bg-muted text-muted-foreground'
                                                )}>
                                                    {(cert.role || '').toUpperCase().includes('WINNER') ? <Trophy className="h-6 w-6" /> : <Award className="h-6 w-6" />}
                                                </div>
                                                <Badge variant="outline" className="font-mono text-xs text-muted-foreground border-border bg-muted/50">
                                                    {cert.certificateId}
                                                </Badge>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                <div>
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{cert.category}</p>
                                                    <h3 className="text-xl font-black text-foreground leading-tight line-clamp-2">
                                                        {cert.eventTitle}
                                                    </h3>
                                                </div>
                                                <p className="text-sm font-semibold flex items-center gap-2">
                                                    <Badge className={cn(
                                                        "px-2 py-0.5 rounded-md text-[10px] uppercase font-bold text-primary-foreground",
                                                        (cert.role || '').toUpperCase().includes('WINNER') ? "bg-primary hover:bg-primary/90" : "bg-primary/80 hover:bg-primary/70"
                                                    )}>
                                                        {cert.role || 'Participant'}
                                                    </Badge>
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="font-medium">{format(new Date(cert.issuedAt || new Date()), 'MMM dd, yyyy')}</span>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    className="h-10 w-10 shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(cert.id, cert.eventTitle || 'Certificate');
                                                    }}
                                                >
                                                    <Download className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 lg:p-20 text-center max-w-4xl mx-auto shadow-sm"
                        >
                            <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Inbox className="h-10 w-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No Certificates Found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                You haven't earned any verified certificates yet, or none match your search criteria. Participate in upcoming events to build your profile!
                            </p>
                            <Button 
                                onClick={() => navigate('/dashboard/student/events')}
                                size="lg"
                                className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-14 px-8"
                            >
                                Browse Upcoming Events
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CertificationCenter;
