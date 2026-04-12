import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Mail, MoreVertical, Trash2, Shield, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { facultyClubApi } from '@/lib/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ClubMembers = ({ clubId }: { clubId: string }) => {
    const [members, setMembers] = useState<any[]>([]);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [newMemberId, setNewMemberId] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('MEMBER');
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        loadMembers();
    }, [clubId]);

    const loadMembers = async () => {
        try {
            const res = await facultyClubApi.getMembers(clubId);
            setMembers(res || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddMember = async () => {
        if (!newMemberId) {
            toast.error('Please enter User ID');
            return;
        }
        try {
            setLoading(true);
            await facultyClubApi.addMember(clubId, newMemberId, newMemberRole);
            toast.success('Member added successfully');
            setIsAddMemberOpen(false);
            setNewMemberId('');
            loadMembers();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add member');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            await facultyClubApi.removeMember(clubId, userId);
            toast.success('Member removed');
            loadMembers();
        } catch (error) {
            toast.error('Failed to remove member');
        }
    };

    const handleUpdateRole = async (userId: string, role: string) => {
        try {
            await facultyClubApi.updateMemberRole(clubId, userId, role);
            toast.success('Role updated');
            loadMembers();
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            const data = await facultyClubApi.exportMembers(clubId);

            // Convert to CSV and download
            const headers = ['Name', 'Email', 'Role', 'Status', 'Joined Date'];
            const csvContent = [
                headers.join(','),
                ...data.map((m: any) => [
                    m.user?.name,
                    m.user?.email,
                    m.role,
                    m.status,
                    new Date(m.joinedAt).toLocaleDateString()
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `club_members_${clubId}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Member list exported');
        } catch (error) {
            toast.error('Failed to export members');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold">Manage Membership</h3>
                    <p className="text-sm text-slate-500">You have {members.length} active members in this club.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExport} disabled={exporting}>
                        <Download className="h-4 w-4 mr-2" /> {exporting ? 'Exporting...' : 'Export CSV'}
                    </Button>
                    <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none">
                                <Plus className="h-4 w-4 mr-2" /> Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl">
                            <DialogHeader>
                                <DialogTitle>Add New Member</DialogTitle>
                                <DialogDescription>
                                    Manually add a student to the club roster.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-400">Student User ID</Label>
                                    <Input value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} placeholder="e.g. STU12345" className="h-12 bg-slate-50 border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-400">Assigned Role</Label>
                                    <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MEMBER">Member</SelectItem>
                                            <SelectItem value="ADMIN">Core Admin</SelectItem>
                                            <SelectItem value="PRESIDENT">Club President</SelectItem>
                                            <SelectItem value="TREASURER">Treasurer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button variant="ghost" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddMember} disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-8">Confirm Addition</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4">
                {members.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed text-slate-400 italic">
                        No members found. Use the "Add Member" button to start building your team.
                    </div>
                ) : (
                    members.map((m: any) => (
                        <div key={m.id} className="group bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-sm">
                                        <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                                            {m.user?.name?.[0] || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    {m.role === 'PRESIDENT' && (
                                        <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-lg">
                                            <Shield className="h-2 w-2" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 dark:text-white leading-none">{m.user?.name || 'Unknown User'}</p>
                                        <Badge variant="secondary" className="text-[10px] py-0 h-4 bg-slate-100 text-slate-600 border-none font-bold">
                                            {m.role}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 font-medium">{m.user?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Joined</p>
                                    <p className="text-xs font-semibold">{new Date(m.joinedAt).toLocaleDateString()}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Select defaultValue={m.role} onValueChange={(val) => handleUpdateRole(m.userId, val)}>
                                        <SelectTrigger className="w-[130px] h-9 rounded-xl text-xs font-bold border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="MEMBER">Member</SelectItem>
                                            <SelectItem value="ADMIN">Core Admin</SelectItem>
                                            <SelectItem value="PRESIDENT">Club President</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-50 text-slate-400">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-none">
                                            <DropdownMenuItem className="rounded-xl flex items-center gap-2 py-2.5">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                                <span>Send Email</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl flex items-center gap-2 py-2.5">
                                                <User className="h-4 w-4 text-slate-400" />
                                                <span>View Profile</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="rounded-xl flex items-center gap-2 py-2.5 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleRemoveMember(m.userId)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span>Remove Member</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClubMembers;
