import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Award,
    ShieldAlert,
    ExternalLink,
    Calendar,
    Globe,
    CheckCircle2,
    Loader2,
    ArrowRight,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { certificateApi } from '@/lib/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Certificate } from '@/types';

const VerificationPage = () => {
    const { certificateId } = useParams<{ certificateId: string }>();
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');

    useEffect(() => {
        const verify = async () => {
            if (!certificateId) {
                setStatus('invalid');
                return;
            }
            try {
                const data = await certificateApi.verify(certificateId);
                if (data && data.status === 'VERIFIED') {
                    setCertificate(data);
                    setStatus('valid');
                } else {
                    setStatus('invalid');
                }
            } catch (error) {
                console.error('Verification failed:', error);
                setStatus('invalid');
            }
        };

        verify();
    }, [certificateId]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Top Navigation */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-center">
                <div className="flex items-center gap-2 cursor-pointer transition-colors" onClick={() => navigate('/')}>
                    <div className="h-10 w-10 bg-teal-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-black text-xl leading-none">C</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-3xl mx-auto mt-12">
                <AnimatePresence mode="wait">
                    {status === 'loading' ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-[2rem] p-16 text-center shadow-xl border border-slate-100 dark:border-slate-800"
                        >
                            <Loader2 className="h-16 w-16 text-teal-600 animate-spin mx-auto mb-8" />
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Verifying Credential</h1>
                            <p className="text-slate-500 font-medium">Please wait while we check our cryptographic registry...</p>
                        </motion.div>
                    ) : status === 'valid' && certificate ? (
                        <motion.div
                            key="valid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-4 mb-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring" }}
                                    className="h-24 w-24 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"
                                >
                                    <CheckCircle2 className="h-12 w-12" />
                                </motion.div>
                                <h1 className="text-4xl text-slate-900 dark:text-white font-black tracking-tight">Verified Credential</h1>
                                <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-sm">Successfully Authenticated</p>
                            </div>

                            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-900 dark:bg-emerald-950/50 uppercase font-bold text-xs tracking-wider">
                                        Valid
                                    </Badge>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Credential Holder</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white">{certificate.studentName}</p>
                                    </div>
                                    
                                    <div className="h-px bg-slate-100 dark:bg-slate-800" />

                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Achievement Focus</p>
                                        <p className="text-xl font-bold text-teal-700 dark:text-teal-400">{certificate.eventTitle}</p>
                                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-2">Designation: <span className="uppercase text-slate-900 dark:text-slate-200">{certificate.role}</span></p>
                                    </div>

                                    <div className="h-px bg-slate-100 dark:bg-slate-800" />

                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Date</p>
                                            <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-400" /> 
                                                {format(new Date(certificate.issuedAt || new Date()), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Credential ID</p>
                                            <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                                                {certificate.certificateId}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="h-8 w-8 text-emerald-500" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Issuer</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">CollegeHub Network <Globe className="h-3 w-3 text-blue-500" /></p>
                                            </div>
                                        </div>
                                        <Button onClick={() => window.print()} variant="outline" className="shadow-sm font-semibold gap-2 border-slate-200 dark:border-slate-700">
                                            <Download className="h-4 w-4" /> Print
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="invalid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-[2rem] p-16 text-center shadow-xl border border-slate-100 dark:border-slate-800"
                        >
                            <motion.div
                                animate={{ x: [-5, 5, -5, 5, 0] }}
                                transition={{ duration: 0.5 }}
                                className="mx-auto"
                            >
                                <div className="h-24 w-24 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldAlert className="h-12 w-12" />
                                </div>
                            </motion.div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Verification Failed</h1>
                            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">We could not find a valid certificate matching this identifier. It may have been revoked or the ID is incorrect.</p>
                            <Button
                                onClick={() => navigate('/')}
                                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 w-full md:w-auto px-10 h-12 rounded-xl font-bold gap-2"
                            >
                                Valid Credentials Hub <ArrowRight className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VerificationPage;
