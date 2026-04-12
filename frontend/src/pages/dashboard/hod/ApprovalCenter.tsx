import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowLeft, MessageSquare, ExternalLink, Calendar, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { hodService } from '@/services/hodService';
import type { ApprovalRequest } from '@/services/hodService';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const ApprovalCenter = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRemarks, setSelectedRemarks] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadApprovals = async () => {
            try {
                if (!user?.id) return;
                const data = await hodService.getPendingApprovals(user.id);
                setRequests(data);
            } catch (error) {
                toast.error("Failed to load approval center");
            } finally {
                setLoading(false);
            }
        };
        loadApprovals();
    }, [user]);

    const handleProcess = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            const remarks = selectedRemarks[id] || "";
            await hodService.processApproval(id, status, remarks);
            toast.success(`Request ${status.toLowerCase()} successfully`);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            toast.error("Failed to process approval");
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'EVENT': return <Calendar className="w-5 h-5 text-blue-400" />;
            case 'HACKATHON': return <Zap className="w-5 h-5 text-purple-400" />;
            case 'CLUB': return <Trophy className="w-5 h-5 text-orange-400" />;
            default: return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    if (loading) return <div className="p-8">Syncing Approval Queue...</div>;

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/hod')} className="text-gray-400">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Suite
                </Button>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Departmental Decision Hub</h1>
                    <p className="text-gray-500 mt-1">Reviewing and validating departmental activity requests.</p>
                </div>
                <Badge className="bg-blue-500 text-white border-0 px-4 py-1">
                    {requests.length} Requests Pending
                </Badge>
            </div>

            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {requests.map((req, index) => (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="bg-gray-900/60 border-gray-800 overflow-hidden border-l-4 border-l-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all">
                                <CardContent className="p-0">
                                    <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center border border-gray-700">
                                                {getTypeIcon(req.type)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xl font-bold text-white leading-none">{req.type} Authorization</h3>
                                                    <Badge variant="outline" className="text-[10px] border-gray-700 text-gray-400 uppercase tracking-tighter">
                                                        Ref: {req.referenceId.substring(0, 8)}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-400 text-sm mt-2 font-medium">
                                                    Submitted by <span className="text-blue-400 font-bold">{req.submittedBy?.name}</span>
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1 italic">
                                                    Wait-time: {new Date(req.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button variant="outline" className="border-gray-800 hover:bg-gray-800 text-gray-400 h-12">
                                                <ExternalLink className="w-4 h-4 mr-2" /> View Details
                                            </Button>
                                            <Button
                                                className="bg-green-600 hover:bg-green-700 text-white h-12 px-6 font-bold shadow-lg shadow-green-900/20"
                                                onClick={() => handleProcess(req.id, 'APPROVED')}
                                            >
                                                <CheckCircle className="w-5 h-5 mr-2" /> Approve
                                            </Button>
                                            <Button
                                                className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-900/30 h-12 px-6 font-bold transition-all"
                                                onClick={() => handleProcess(req.id, 'REJECTED')}
                                            >
                                                <XCircle className="w-5 h-5 mr-2" /> Reject
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800/20 p-6">
                                        <div className="flex items-start gap-3">
                                            <MessageSquare className="w-5 h-5 text-gray-600 mt-2" />
                                            <Textarea
                                                placeholder="Executive remarks or feedback for the submitter..."
                                                className="bg-gray-900/60 border-gray-800 text-gray-300 focus:border-blue-500/50 transition-all min-h-[80px]"
                                                value={selectedRemarks[req.id] || ""}
                                                onChange={(e) => setSelectedRemarks(prev => ({ ...prev, [req.id]: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {requests.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 text-center bg-gray-900/40 rounded-3xl border border-dashed border-gray-800"
                    >
                        <Zap className="w-16 h-16 text-gray-800 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-600">No Pending Authorizations</h2>
                        <p className="text-gray-700 mt-2">All departmental requests have been processed.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ApprovalCenter;
