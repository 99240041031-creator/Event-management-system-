import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award,
    Download,
    Share2,
    ShieldCheck,
    Globe,
    QrCode,
    ArrowLeft,
    ExternalLink,
    Calendar,
    User as UserIcon,
    RefreshCw,
    Medal,
    Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { certificateApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Certificate } from '@/types';

const CertificateDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!id || !user) return;
            try {
                const data = await certificateApi.getById(id, user.id);
                setCertificate(data);
            } catch (error) {
                console.error('Failed to fetch certificate detail:', error);
                toast.error('Unable to fetch certificate details');
                navigate('/dashboard/student/certificates');
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [id, user, navigate]);

    const handleDownload = async () => {
        if (!certificate || !user) return;
        const toastId = toast.loading('Preparing PDF...');
        try {
            const blob = await certificateApi.download(certificate.id, user.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Certificate_${certificate.eventTitle?.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success('Downloaded successfully', { id: toastId });
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download document', { id: toastId });
        }
    };

    const shareToLinkedIn = () => {
        const url = `${window.location.origin}/verify/${certificate?.certificateId || ''}`;
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedinUrl, '_blank');
        toast.info('Opening LinkedIn share dialog');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
                <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm animate-pulse">Loading Certificate...</p>
            </div>
        );
    }

    if (!certificate) return null;

    return (
        <div className="min-h-screen bg-background pb-20 pt-10 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header & Back Navigation */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/dashboard/student/certificates')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors pl-0"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-semibold">Back to Archive</span>
                    </Button>

                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleDownload}
                            className="bg-card text-card-foreground hover:bg-muted shadow-sm border border-border"
                        >
                            <Download className="h-4 w-4 mr-2" /> Download PDF
                        </Button>
                        <Button
                            onClick={shareToLinkedIn}
                            className="bg-[#0A66C2] hover:bg-[#004182] text-white shadow-sm"
                        >
                            <Share2 className="h-4 w-4 mr-2" /> Share to LinkedIn
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
                    {/* Visual Preview Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="aspect-[1.414/1] bg-white rounded-3xl overflow-hidden shadow-xl border-none relative flex flex-col justify-between p-8 md:p-16">
                            {/* Decorative Border */}
                            <div className="absolute inset-8 border-[12px] border-slate-50 rounded-2xl pointer-events-none" />

                            <div className="text-center relative z-10 space-y-6 mt-8">
                                <div className={cn(
                                    "h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-slate-50",
                                    (certificate.role || '').toUpperCase().includes('WINNER') ? 'text-amber-500' : 'text-teal-600'
                                )}>
                                    {(certificate.role || '').toUpperCase().includes('WINNER') ? <Trophy className="h-10 w-10" /> : <Award className="h-10 w-10" />}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Certificate of Achievement</h2>
                                <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">is proudly presented to</p>
                            </div>

                            <div className="text-center relative z-10 space-y-8">
                                <p className="text-5xl md:text-6xl font-black text-slate-900 italic capitalize">{certificate.studentName}</p>
                                <div className="space-y-4">
                                    <p className="text-slate-600 font-medium text-lg">for outstanding performance and participation as</p>
                                    <p className="text-teal-700 font-black uppercase text-2xl tracking-wide">{certificate.role}</p>
                                </div>
                                <p className="text-2xl font-bold text-slate-800 uppercase">{certificate.eventTitle}</p>
                            </div>

                            <div className="w-full flex justify-between items-end relative z-10 mb-8 px-12">
                                <div className="text-left space-y-2">
                                    <div className="h-px w-40 bg-slate-300" />
                                    <p className="text-xs font-bold text-slate-500 uppercase">Authorized Signature</p>
                                </div>

                                <div className="h-24 w-24 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                                    {certificate.qrCodeUrl ? (
                                        <img src={certificate.qrCodeUrl} alt="QR Code Verification" className="h-full w-full opacity-90 hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <QrCode className="h-12 w-12 text-slate-300" />
                                    )}
                                </div>

                                <div className="text-right space-y-2">
                                    <div className="h-px w-40 bg-slate-300" />
                                    <p className="text-xs font-bold text-slate-500 uppercase">Date of Issue</p>
                                    <p className="text-sm font-bold text-slate-800">{format(new Date(certificate.issuedAt || new Date()), 'MMMM dd, yyyy')}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Meta Data Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <Card className="p-8 bg-card border-border rounded-3xl shadow-sm">
                            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <ShieldCheck className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Verification Status</h3>
                                    <p className="text-sm text-primary font-medium flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                        </span>
                                        Authentic & Verified
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-muted rounded-lg"><Calendar className="h-5 w-5 text-muted-foreground" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Issue Date</p>
                                        <p className="text-sm font-semibold text-foreground">{format(new Date(certificate.issuedAt || new Date()), 'MMMM dd, yyyy')}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-muted rounded-lg"><Globe className="h-5 w-5 text-muted-foreground" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Category</p>
                                        <p className="text-sm font-semibold text-foreground">{certificate.category}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-muted rounded-lg"><UserIcon className="h-5 w-5 text-muted-foreground" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Recipient ID</p>
                                        <p className="text-sm font-semibold text-foreground line-clamp-1">{certificate.userId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-border space-y-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Credential ID</p>
                                <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border/50">
                                    <span className="font-mono text-sm font-semibold text-primary">{certificate.certificateId}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                                        onClick={() => {
                                            navigator.clipboard.writeText(certificate.certificateId || '');
                                            toast.success('Credential ID copied to clipboard');
                                        }}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button 
                                    variant="outline" 
                                    className="w-full mt-4 font-semibold text-primary border-primary/20 hover:bg-primary/10"
                                    onClick={() => navigate(`/verify/${certificate.certificateId}`)}
                                >
                                    Open Standard Verification Page
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CertificateDetailPage;
