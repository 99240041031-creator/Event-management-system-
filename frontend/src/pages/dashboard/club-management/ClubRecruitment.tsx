import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { facultyClubApi } from '@/lib/api';
import type { ClubJoinRequest } from '@/types';
import { Check, X, FileText, Briefcase } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface ClubRecruitmentProps {
    clubId: string;
    isRecruitmentOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}

const ClubRecruitment = ({ clubId, isRecruitmentOpen, onToggle }: ClubRecruitmentProps) => {
    const [applications, setApplications] = useState<ClubJoinRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<ClubJoinRequest | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [interviewScore, setInterviewScore] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadApplications();
    }, [clubId]);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const data = await facultyClubApi.getApplications(clubId);
            setApplications(data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (checked: boolean) => {
        try {
            await facultyClubApi.toggleRecruitment(clubId, checked);
            onToggle(checked);
            toast.success(checked ? 'Recruitment opened' : 'Recruitment closed');
        } catch (error) {
            toast.error('Failed to update recruitment status');
        }
    };

    const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            setIsProcessing(true);
            await facultyClubApi.updateApplicationStatus(id, status);
            toast.success(`Application ${status.toLowerCase()}`);
            loadApplications();
            setSelectedApp(null);
        } catch (error) {
            toast.error('Failed to update application');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) return;
        try {
            setIsProcessing(true);
            await facultyClubApi.bulkApproveApplications(selectedIds);
            toast.success(`Successfully approved ${selectedIds.length} members`);
            setSelectedIds([]);
            loadApplications();
        } catch (error) {
            toast.error('Failed to approve applications');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateScore = async () => {
        if (!selectedApp) return;
        try {
            setIsProcessing(true);
            await facultyClubApi.updateJoinRequestScore(selectedApp.id, interviewScore);
            toast.success('Score updated');
            loadApplications();
            setSelectedApp(prev => prev ? { ...prev, interviewScore } : null);
        } catch (error) {
            toast.error('Failed to update score');
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold">Recruitment Status</h3>
                    <p className="text-sm text-slate-500">Enable or disable new membership requests for your club.</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 pr-4 rounded-full border shadow-sm">
                    <Badge variant={isRecruitmentOpen ? 'default' : 'secondary'} className="rounded-full px-4">
                        {isRecruitmentOpen ? 'Active' : 'Paused'}
                    </Badge>
                    <Switch checked={isRecruitmentOpen} onCheckedChange={handleToggle} />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        Applications
                        <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                            {applications.length}
                        </Badge>
                    </h3>
                    <div className="flex gap-2">
                        {selectedIds.length > 0 && (
                            <Button
                                onClick={handleBulkApprove}
                                className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 dark:shadow-none animate-in fade-in slide-in-from-right-2"
                                disabled={isProcessing}
                            >
                                <Check className="h-4 w-4 mr-2" /> Bulk Approve ({selectedIds.length})
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => loadApplications()} disabled={loading}>
                            Refresh
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : applications.length === 0 ? (
                    <Card className="border-dashed border-2 bg-slate-50/50">
                        <CardContent className="p-12 text-center flex flex-col items-center gap-4">
                            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-slate-700 dark:text-slate-300">No applications found</p>
                                <p className="text-sm text-slate-500 max-w-xs">When students apply to join your club, they will appear here for review.</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {applications.map((app) => (
                            <Card
                                key={app.id}
                                className={`group relative transition-all duration-300 hover:shadow-md ${selectedIds.includes(app.id) ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : ''
                                    }`}
                            >
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(app.id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleSelection(app.id);
                                            }}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            disabled={app.status !== 'PENDING'}
                                        />
                                    </div>
                                    <div className="flex-1 flex items-center justify-between cursor-pointer" onClick={() => {
                                        setSelectedApp(app);
                                        setInterviewScore(app.interviewScore || 0);
                                    }}>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-sm">
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                                    {app.userName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-slate-900 dark:text-white">{app.userName}</p>
                                                    {app.interviewScore !== undefined && app.interviewScore > 0 && (
                                                        <Badge variant="outline" className="h-5 py-0 bg-blue-50 text-blue-600 border-blue-100">
                                                            Score: {app.interviewScore}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    Applied {new Date(app.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs text-slate-400 mb-1">Status</p>
                                                <Badge variant={app.status === 'APPROVED' ? 'default' : app.status === 'REJECTED' ? 'destructive' : 'outline'} className="capitalize">
                                                    {app.status.toLowerCase()}
                                                </Badge>
                                            </div>
                                            <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                                <FileText className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Application Detail Dialog */}
            <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                    {selectedApp && (
                        <div className="flex flex-col">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-20 w-20 border-4 border-white/20">
                                        <AvatarFallback className="bg-white/10 text-2xl font-bold">
                                            {selectedApp.userName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-bold">{selectedApp.userName}</h2>
                                        <p className="text-blue-100 flex items-center gap-2">
                                            {selectedApp.userEmail}
                                        </p>
                                    </div>
                                    <div className="ml-auto flex flex-col items-end gap-2">
                                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1">
                                            {selectedApp.status}
                                        </Badge>
                                        <p className="text-xs text-blue-100/70">
                                            {new Date(selectedApp.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 bg-white dark:bg-slate-900">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Statement of Interest</h4>
                                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm leading-relaxed border italic text-slate-600 dark:text-slate-300">
                                                "{selectedApp.message}"
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills & Tech Stack</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedApp.skills?.split(',').map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary" className="px-3 py-1">
                                                        {skill.trim()}
                                                    </Badge>
                                                )) || <span className="text-sm text-slate-400 italic">No skills listed</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Application Links</h4>
                                            <div className="grid gap-3">
                                                {selectedApp.resumeUrl ? (
                                                    <Button variant="outline" className="justify-start h-12 bg-white hover:bg-slate-50 border-slate-200" asChild>
                                                        <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer">
                                                            <div className="bg-red-50 p-2 rounded mr-3">
                                                                <FileText className="h-4 w-4 text-red-500" />
                                                            </div>
                                                            <span className="flex-1 text-left">View Resume</span>
                                                            <Check className="h-4 w-4 text-green-500 ml-2" />
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <div className="h-12 border border-dashed rounded-xl flex items-center px-4 text-slate-400 text-sm">
                                                        No Resume provided
                                                    </div>
                                                )}
                                                {selectedApp.portfolioLink && (
                                                    <Button variant="outline" className="justify-start h-12 bg-white hover:bg-slate-50 border-slate-200" asChild>
                                                        <a href={selectedApp.portfolioLink} target="_blank" rel="noopener noreferrer">
                                                            <div className="bg-blue-50 p-2 rounded mr-3">
                                                                <Briefcase className="h-4 w-4 text-blue-500" />
                                                            </div>
                                                            <span className="flex-1 text-left">Portfolio / Projects</span>
                                                            <Check className="h-4 w-4 text-green-500 ml-2" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Interview Score</h4>
                                                <Badge className="bg-blue-600 font-mono">{interviewScore}/100</Badge>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="5"
                                                value={interviewScore}
                                                onChange={(e) => setInterviewScore(parseInt(e.target.value))}
                                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                                                <span>ENTRY LEVEL</span>
                                                <span>EXPERT</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full mt-2"
                                                onClick={handleUpdateScore}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? 'Updating...' : 'Update Score'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold rounded-xl"
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'REJECTED')}
                                        disabled={isProcessing}
                                    >
                                        <X className="h-4 w-4 mr-2" /> Reject Application
                                    </Button>
                                    <Button
                                        className="flex-1 h-12 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 dark:shadow-none font-bold rounded-xl"
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'APPROVED')}
                                        disabled={isProcessing}
                                    >
                                        <Check className="h-4 w-4 mr-2" /> Approve Membership
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ClubRecruitment;
