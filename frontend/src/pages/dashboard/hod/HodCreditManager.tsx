import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hodService } from '@/services/hodService';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

export default function HodCreditManager() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    try {
      const data = await hodService.getCreditRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load credit requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCredits(); }, []);

  const handleApprove = async (id: string) => {
    try { await hodService.approveCreditRequest(id); toast.success('Approved'); fetchCredits(); } catch { toast.error('Error'); }
  }

  const handleReject = async (id: string) => {
    try { await hodService.rejectCreditRequest(id); toast.success('Rejected'); fetchCredits(); } catch { toast.error('Error'); }
  }

  if (loading) return <div className="p-8">Loading credit center...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Student Credits / Points Approval</h1>
      <Card>
        <CardHeader><CardTitle>Pending Override Applications</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length === 0 && <p className="text-sm text-slate-500">No pending requests.</p>}
            {requests.map(r => (
              <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="font-semibold">{r.student?.email} requested {r.pointsRequested} points</p>
                  <p className="text-sm text-slate-500">Reason: {r.reason}</p>
                </div>
                {r.status === 'PENDING' ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(r.id)}><Check className="w-4 h-4 mr-1"/> Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(r.id)}><X className="w-4 h-4 mr-1"/> Reject</Button>
                  </div>
                ) : (
                  <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
