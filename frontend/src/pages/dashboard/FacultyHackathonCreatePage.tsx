import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';
import { hackathonApi, facultyApi, facultyClubApi } from '@/lib/api';
import { toast } from 'sonner';

const FacultyHackathonCreatePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clubId = searchParams.get('clubId');
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        theme: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        maxTeams: '',
        minTeamSize: '1',
        maxTeamSize: '4',
        prizePool: '',
        rules: '',
        eligibility: '',
        tags: '',
        bannerImage: '',
        status: 'DRAFT',
    });

    useEffect(() => {
        if (isEditMode) {
            loadHackathon();
        }
    }, [id]);

    const loadHackathon = async () => {
        try {
            setLoading(true);
            const data = await facultyApi.getHackathon(id!);
            setFormData({
                title: data.title || '',
                description: data.description || '',
                theme: data.theme || '',
                startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '',
                endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '',
                registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString().slice(0, 16) : '',
                maxTeams: data.maxTeams?.toString() || '',
                minTeamSize: data.minTeamSize?.toString() || '1',
                maxTeamSize: data.maxTeamSize?.toString() || '4',
                prizePool: data.prizePool || '',
                rules: data.rules || '',
                eligibility: data.eligibility || '',
                tags: data.tags?.join(', ') || '',
                bannerImage: data.bannerImage || '',
                status: data.status || 'DRAFT',
            });
        } catch (error: any) {
            console.error('Failed to load hackathon:', error);
            toast.error('Failed to load hackathon');
            navigate('/dashboard/faculty/hackathons');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Please enter hackathon title');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Please enter hackathon description');
            return;
        }
        if (!formData.startDate) {
            toast.error('Please select start date');
            return;
        }
        if (!formData.endDate) {
            toast.error('Please select end date');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...formData,
                maxTeams: formData.maxTeams ? parseInt(formData.maxTeams) : null,
                minTeamSize: parseInt(formData.minTeamSize),
                maxTeamSize: parseInt(formData.maxTeamSize),
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
            };

            if (isEditMode) {
                await facultyApi.updateHackathon(id!, payload);
                toast.success('Hackathon updated successfully');
            } else {
                if (clubId) {
                    await facultyClubApi.createHackathon(clubId, payload);
                } else {
                    await facultyApi.createHackathon(payload);
                }
                toast.success('Hackathon created successfully');
            }

            if (clubId) {
                navigate(`/dashboard/faculty/clubs/${clubId}`);
            } else {
                navigate('/dashboard/faculty/hackathons');
            }
        } catch (error: any) {
            console.error('Failed to save hackathon:', error);
            toast.error(isEditMode ? 'Failed to update hackathon' : 'Failed to create hackathon');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/dashboard/faculty/hackathons')}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">
                        {isEditMode ? 'Edit Hackathon' : 'Create New Hackathon'}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {isEditMode ? 'Update hackathon details' : 'Fill in the details to create a new hackathon'}
                    </p>
                </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Hackathon Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Hackathon Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Enter hackathon title"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Describe your hackathon"
                                rows={4}
                                required
                            />
                        </div>

                        {/* Theme */}
                        <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Input
                                id="theme"
                                value={formData.theme}
                                onChange={(e) => handleChange('theme', e.target.value)}
                                placeholder="e.g., AI/ML, Web Development, Sustainability"
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date & Time *</Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => handleChange('startDate', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date & Time *</Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => handleChange('endDate', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                                <Input
                                    id="registrationDeadline"
                                    type="datetime-local"
                                    value={formData.registrationDeadline}
                                    onChange={(e) => handleChange('registrationDeadline', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Team Configuration */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="maxTeams">Maximum Teams</Label>
                                <Input
                                    id="maxTeams"
                                    type="number"
                                    value={formData.maxTeams}
                                    onChange={(e) => handleChange('maxTeams', e.target.value)}
                                    placeholder="Leave empty for unlimited"
                                    min="1"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="minTeamSize">Min Team Size *</Label>
                                <Input
                                    id="minTeamSize"
                                    type="number"
                                    value={formData.minTeamSize}
                                    onChange={(e) => handleChange('minTeamSize', e.target.value)}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxTeamSize">Max Team Size *</Label>
                                <Input
                                    id="maxTeamSize"
                                    type="number"
                                    value={formData.maxTeamSize}
                                    onChange={(e) => handleChange('maxTeamSize', e.target.value)}
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        {/* Prize Pool */}
                        <div className="space-y-2">
                            <Label htmlFor="prizePool">Prize Pool</Label>
                            <Input
                                id="prizePool"
                                value={formData.prizePool}
                                onChange={(e) => handleChange('prizePool', e.target.value)}
                                placeholder="e.g., ₹50,000 in prizes"
                            />
                        </div>

                        {/* Rules */}
                        <div className="space-y-2">
                            <Label htmlFor="rules">Rules & Guidelines</Label>
                            <Textarea
                                id="rules"
                                value={formData.rules}
                                onChange={(e) => handleChange('rules', e.target.value)}
                                placeholder="Enter hackathon rules and guidelines"
                                rows={4}
                            />
                        </div>

                        {/* Eligibility */}
                        <div className="space-y-2">
                            <Label htmlFor="eligibility">Eligibility Criteria</Label>
                            <Textarea
                                id="eligibility"
                                value={formData.eligibility}
                                onChange={(e) => handleChange('eligibility', e.target.value)}
                                placeholder="Who can participate?"
                                rows={3}
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => handleChange('tags', e.target.value)}
                                placeholder="Enter tags separated by commas (e.g., AI, Blockchain, IoT)"
                            />
                        </div>

                        {/* Banner Image */}
                        <div className="space-y-2">
                            <Label htmlFor="bannerImage">Banner Image URL</Label>
                            <Input
                                id="bannerImage"
                                value={formData.bannerImage}
                                onChange={(e) => handleChange('bannerImage', e.target.value)}
                                placeholder="https://example.com/banner.jpg"
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/dashboard/faculty/hackathons')}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isEditMode ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {isEditMode ? 'Update Hackathon' : 'Create Hackathon'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default FacultyHackathonCreatePage;
