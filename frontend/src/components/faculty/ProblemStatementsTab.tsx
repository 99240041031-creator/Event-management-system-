import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Star,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface ProblemStatementsProps {
    hackathonId: string;
}

const ProblemStatementsTab = ({ hackathonId }: ProblemStatementsProps) => {
    const [problems, setProblems] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'MEDIUM',
        tags: '',
    });

    const handleCreate = async () => {
        if (!formData.title || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            // TODO: Implement create API
            toast.success('Problem statement added successfully');
            setIsDialogOpen(false);
            setFormData({ title: '', description: '', difficulty: 'MEDIUM', tags: '' });
        } catch (error) {
            toast.error('Failed to add problem statement');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this problem statement?')) return;

        try {
            // TODO: Implement delete API
            toast.success('Problem statement deleted');
        } catch (error) {
            toast.error('Failed to delete problem statement');
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Problem Statements</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Problem
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl flex items-center justify-center">
                            <div className="w-full">
                                <DialogHeader>
                                    <DialogTitle>Add Problem Statement</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter problem title"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe the problem statement"
                                            rows={6}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="difficulty">Difficulty</Label>
                                        <Select
                                            value={formData.difficulty}
                                            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="EASY">Easy</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HARD">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tags">Tags (comma separated)</Label>
                                        <Input
                                            id="tags"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="AI, ML, Web Development"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleCreate} className="flex-1">
                                            Add Problem
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {problems.length === 0 ? (
                    <div className="py-8 text-center text-slate-500">
                        <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No problem statements yet</h3>
                        <p className="mb-4">Add problem statements for teams to work on</p>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add First Problem
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {problems.map((problem) => (
                            <Card key={problem.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-lg">{problem.title}</h3>
                                                <Badge variant={
                                                    problem.difficulty === 'EASY' ? 'default' :
                                                        problem.difficulty === 'MEDIUM' ? 'secondary' : 'destructive'
                                                }>
                                                    {problem.difficulty}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                                {problem.description}
                                            </p>
                                            {problem.tags && (
                                                <div className="flex gap-2 flex-wrap">
                                                    {problem.tags.split(',').map((tag: string, i: number) => (
                                                        <Badge key={i} variant="outline">{tag.trim()}</Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(problem.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ProblemStatementsTab;
