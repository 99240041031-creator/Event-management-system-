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
import { eventApi, facultyApi, facultyClubApi } from '@/lib/api';
import { toast } from 'sonner';

const FacultyEventCreatePage = () => {
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
        eventType: 'WORKSHOP',
        mode: 'OFFLINE',
        location: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        maxParticipants: '',
        requirements: '',
        tags: '',
        bannerImage: '',
        status: 'DRAFT',
    });

    useEffect(() => {
        if (isEditMode) {
            loadEvent();
        }
    }, [id]);

    const loadEvent = async () => {
        try {
            setLoading(true);
            const data = await facultyApi.getEvent(id!);
            setFormData({
                title: data.title || '',
                description: data.description || '',
                eventType: data.eventType || 'WORKSHOP',
                mode: data.mode || 'OFFLINE',
                location: data.location || '',
                startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '',
                endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '',
                registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString().slice(0, 16) : '',
                maxParticipants: data.maxParticipants?.toString() || '',
                requirements: data.requirements || '',
                tags: data.tags?.join(', ') || '',
                bannerImage: data.bannerImage || '',
                status: data.status || 'DRAFT',
            });
        } catch (error: any) {
            console.error('Failed to load event:', error);
            toast.error('Failed to load event');
            navigate('/dashboard/faculty/events');
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
            toast.error('Please enter event title');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Please enter event description');
            return;
        }
        if (!formData.startDate) {
            toast.error('Please select start date');
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...formData,
                maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                startDate: new Date(formData.startDate).toISOString(),
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
            };

            if (isEditMode) {
                await facultyApi.updateEvent(id!, payload);
                toast.success('Event updated successfully');
            } else {
                if (clubId) {
                    await facultyClubApi.createEvent(clubId, payload);
                } else {
                    await facultyApi.createEvent(payload);
                }
                toast.success('Event created successfully');
            }

            if (clubId) {
                navigate(`/dashboard/faculty/clubs/${clubId}`);
            } else {
                navigate('/dashboard/faculty/events');
            }
        } catch (error: any) {
            console.error('Failed to save event:', error);
            toast.error(isEditMode ? 'Failed to update event' : 'Failed to create event');
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
                    onClick={() => navigate('/dashboard/faculty/events')}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">
                        {isEditMode ? 'Edit Event' : 'Create New Event'}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {isEditMode ? 'Update event details' : 'Fill in the details to create a new event'}
                    </p>
                </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Enter event title"
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
                                placeholder="Describe your event"
                                rows={4}
                                required
                            />
                        </div>

                        {/* Event Type & Mode */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="eventType">Event Type *</Label>
                                <Select
                                    value={formData.eventType}
                                    onValueChange={(value) => handleChange('eventType', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="WORKSHOP">Workshop</SelectItem>
                                        <SelectItem value="SEMINAR">Seminar</SelectItem>
                                        <SelectItem value="WEBINAR">Webinar</SelectItem>
                                        <SelectItem value="CONFERENCE">Conference</SelectItem>
                                        <SelectItem value="COMPETITION">Competition</SelectItem>
                                        <SelectItem value="CULTURAL">Cultural</SelectItem>
                                        <SelectItem value="SPORTS">Sports</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mode">Mode *</Label>
                                <Select
                                    value={formData.mode}
                                    onValueChange={(value) => handleChange('mode', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ONLINE">Online</SelectItem>
                                        <SelectItem value="OFFLINE">Offline</SelectItem>
                                        <SelectItem value="HYBRID">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                placeholder="Enter venue or meeting link"
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
                                <Label htmlFor="endDate">End Date & Time</Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => handleChange('endDate', e.target.value)}
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

                        {/* Max Participants */}
                        <div className="space-y-2">
                            <Label htmlFor="maxParticipants">Maximum Participants</Label>
                            <Input
                                id="maxParticipants"
                                type="number"
                                value={formData.maxParticipants}
                                onChange={(e) => handleChange('maxParticipants', e.target.value)}
                                placeholder="Leave empty for unlimited"
                                min="1"
                            />
                        </div>

                        {/* Requirements */}
                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements</Label>
                            <Textarea
                                id="requirements"
                                value={formData.requirements}
                                onChange={(e) => handleChange('requirements', e.target.value)}
                                placeholder="Any prerequisites or requirements for participants"
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
                                placeholder="Enter tags separated by commas (e.g., AI, ML, Workshop)"
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
                                    <SelectItem value="PENDING">Pending Approval</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/dashboard/faculty/events')}
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
                                        {isEditMode ? 'Update Event' : 'Create Event'}
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

export default FacultyEventCreatePage;
