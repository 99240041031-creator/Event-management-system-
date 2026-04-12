import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { facultyClubApi } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const ClubAmbassadors = ({ clubId }: { clubId: string }) => {
    const [ambassadors, setAmbassadors] = useState<any[]>([]);
    const [isAddAmbassadorOpen, setIsAddAmbassadorOpen] = useState(false);
    const [newAmbassadorId, setNewAmbassadorId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAmbassadors();
    }, [clubId]);

    const loadAmbassadors = () => {
        facultyClubApi.getAmbassadors(clubId).then(res => setAmbassadors(res || [])).catch(console.error);
    };

    const handleAddAmbassador = async () => {
        if (!newAmbassadorId) {
            toast.error('Please enter User ID');
            return;
        }
        try {
            setLoading(true);
            await facultyClubApi.addAmbassador(clubId, newAmbassadorId);
            toast.success('Ambassador added successfully');
            setIsAddAmbassadorOpen(false);
            setNewAmbassadorId('');
            loadAmbassadors();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add ambassador');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Campus Ambassadors</CardTitle>
                    <CardDescription>Students promoting the club</CardDescription>
                </div>
                <Dialog open={isAddAmbassadorOpen} onOpenChange={setIsAddAmbassadorOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" /> Add Ambassador</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Ambassador</DialogTitle>
                            <DialogDescription>Enter User ID to assign as ambassador</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label>User ID</Label>
                            <Input value={newAmbassadorId} onChange={(e) => setNewAmbassadorId(e.target.value)} placeholder="User ID" className="mt-2" />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddAmbassadorOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddAmbassador} disabled={loading}>Add Ambassador</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {ambassadors.length === 0 ? <p className="text-slate-500">No ambassadors assigned.</p> : (
                        ambassadors.map((a: any) => (
                            <div key={a.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{a.studentName?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{a.studentName}</p>
                                        <p className="text-xs text-slate-500">{a.referrals} Referrals</p>
                                    </div>
                                </div>
                                <Badge>{a.status}</Badge>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ClubAmbassadors;
