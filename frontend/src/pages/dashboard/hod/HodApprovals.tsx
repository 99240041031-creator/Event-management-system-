import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { hodService } from '@/services/hodService';
import { toast } from 'sonner';

export default function HodApprovals() {
  const [approvals, setApprovals] = useState<{events: any[], hackathons: any[]}>({events: [], hackathons: []});
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchApprovals = async (silent = false) => {
    if (!silent) setLoading(true);
    setIsSyncing(true);
    try {
      const data = await hodService.getApprovals();
      setApprovals({
          events: data?.events || [],
          hackathons: data?.hackathons || []
      });
    } catch (err) {
      toast.error('Failed to load approvals');
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => { fetchApprovals(); }, []);

  const handleAction = async (id: string, type: string, action: string) => {
    setProcessingId(id);
    console.log(`[HOD_TRACE] Initiating ${action} for ${type} ID: ${id}`);
    
    try {
      const response = await hodService.handleApproval(id, type, action);
      console.log(`[HOD_TRACE] Success response:`, response);
      
      toast.success(`${type} ${action}d successfully!`);
      
      // Instant UI update: filter out the approved/rejected item
      setApprovals(prev => ({
        events: type === 'event' ? prev.events.filter(e => e.id !== id) : prev.events,
        hackathons: type === 'hackathon' ? prev.hackathons.filter(h => h.id !== id) : prev.hackathons
      }));
    } catch (err: any) {
      console.error(`[HOD_TRACE] Error during ${action}:`, err);
      const errorMsg = err.message || 'Action failed';
      toast.error(errorMsg);
      
      // If the error indicates a state mismatch (e.g., "Not pending"),
      // we force a re-fetch to sync the UI with the backend reality.
      if (errorMsg.toLowerCase().includes('not pending') || errorMsg.toLowerCase().includes('status')) {
          console.log('[HOD_TRACE] State mismatch detected. Synchronizing...');
          fetchApprovals(true);
      }
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-slate-500 animate-pulse">Loading approval center...</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Approval Center</h1>
          <p className="text-sm text-slate-500">Review and moderate pending event and hackathon submissions.</p>
        </div>
        <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchApprovals(false)} 
            disabled={isSyncing}
            className="flex gap-2"
        >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Status
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Events Card */}
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                Pending Events
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {approvals.events.length === 0 && (
                    <div className="p-8 text-center text-slate-500 italic">No pending events.</div>
                )}
                {approvals.events.map(event => (
                    <div key={event.id} className="flex justify-between items-center p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                        <div className="space-y-1">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{event.title}</p>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm font-bold uppercase">{event.status}</span>
                                <p className="text-xs text-slate-500">ID: ...{event.id.slice(-6)}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                        <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 border-green-200 hover:bg-green-50 hover:text-green-700" 
                            disabled={processingId === event.id}
                            onClick={() => handleAction(event.id, 'event', 'approve')}
                        >
                            {processingId === event.id ? <Loader2 className="h-3 w-3 animate-spin"/> : <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                            Approve
                        </Button>
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            disabled={processingId === event.id}
                            onClick={() => handleAction(event.id, 'event', 'reject')}
                        >
                            <XCircle className="w-3.5 h-3.5 mr-1.5" />
                            Reject
                        </Button>
                        </div>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Hackathons Card */}
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-indigo-500" />
                Pending Hackathons
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {approvals.hackathons.length === 0 && (
                    <div className="p-8 text-center text-slate-500 italic">No pending hackathons.</div>
                )}
                {approvals.hackathons.map(hack => (
                    <div key={hack.id} className="flex justify-between items-center p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                        <div className="space-y-1">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{hack.title}</p>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-sm font-bold uppercase">{hack.approvalStatus}</span>
                                <p className="text-xs text-slate-500">ID: ...{hack.id.slice(-6)}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 border-green-200 hover:bg-green-50 hover:text-green-700" 
                                disabled={processingId === hack.id}
                                onClick={() => handleAction(hack.id, 'hackathon', 'approve')}
                            >
                                {processingId === hack.id ? <Loader2 className="h-3 w-3 animate-spin"/> : <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                                Approve
                            </Button>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                disabled={processingId === hack.id}
                                onClick={() => handleAction(hack.id, 'hackathon', 'reject')}
                            >
                                <XCircle className="w-3.5 h-3.5 mr-1.5" />
                                Reject
                            </Button>
                        </div>
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
