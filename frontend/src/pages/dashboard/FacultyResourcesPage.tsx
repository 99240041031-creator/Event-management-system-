import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Upload,
    Download,
    Eye,
    Trash2,
    Plus,
    Filter,
    Search,
} from 'lucide-react';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api, facultyApi } from '@/lib/api';

const FacultyResourcesPage = () => {
    const [resources, setResources] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        category: 'NOTES',
        visibility: 'PUBLIC',
        url: '',
    });

    const cleanInput = (value: string) => {
        return value.trim().replace(/^"|"$/g, "");
    };

    const normalizeUrl = (url: string) => {
        let cleaned = url.trim().replace(/^"|"$/g, "");

        // If no protocol → add https
        if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
            if (cleaned.startsWith("www.")) {
                cleaned = "https://" + cleaned;
            }
        }

        return cleaned;
    };

    const isValidInput = (value: string) => {
        const input = cleanInput(value);
        if (!input) return false;

        // Allow URLs
        try {
            new URL(input);
            return true;
        } catch { }

        // Allow local paths (Windows)
        const windowsPathRegex = /^[a-zA-Z]:\\.*$/;
        if (windowsPathRegex.test(input)) {
            return true;
        }

        return false;
    };

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = () => {
        try {
            const data = JSON.parse(localStorage.getItem("resources") || "[]");
            setResources(data || []);
        } catch (error) {
            console.error('Failed to load resources:', error);
        }
    };

    const handleUpload = () => {
        const cleanedUrl = cleanInput(uploadForm.url);

        if (!uploadForm.title || !cleanedUrl) {
            toast.error('Please enter a title and URL/Path');
            return;
        }

        if (!isValidInput(cleanedUrl)) {
            toast.error("Please enter a valid URL or local file path (e.g., C:\\path\\to\\file)");
            return;
        }

        try {
            const newResource = {
                id: Date.now(),
                ...uploadForm,
                url: cleanedUrl,
                downloads: 0,
                views: 0
            };

            const existing = JSON.parse(localStorage.getItem("resources") || "[]");
            const updated = [...existing, newResource];
            localStorage.setItem("resources", JSON.stringify(updated));

            toast.success('Resource uploaded successfully');
            setIsUploadOpen(false);
            setUploadForm({
                title: '',
                description: '',
                category: 'NOTES',
                visibility: 'PUBLIC',
                url: '',
            });
            loadResources();
        } catch (error: any) {
            console.error('Upload failed:', error);
            toast.error('Upload failed');
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        try {
            const data = JSON.parse(localStorage.getItem("resources") || "[]");
            const updated = data.filter((r: any) => r.id !== id);
            localStorage.setItem("resources", JSON.stringify(updated));
            toast.success('Resource deleted successfully');
            loadResources();
        } catch (error: any) {
            console.error('Failed to delete resource:', error);
            toast.error('Failed to delete resource');
        }
    };

    const handleView = (url: string) => {
        if (!url) {
            alert("Invalid resource link");
            return;
        }

        const cleaned = url.trim().replace(/^"|"$/g, "");
        console.log("Viewing resource:", cleaned);

        // LOCAL FILE (CANNOT OPEN DIRECTLY)
        if (/^[a-zA-Z]:\\/.test(cleaned)) {
            alert("Local files cannot be opened directly due to browser security. Please upload the file to Google Drive/YouTube and use that link instead.");
            return;
        }

        // NORMAL URL (Normalize if needed)
        const normalized = normalizeUrl(cleaned);
        const newWindow = window.open(normalized, "_blank");

        if (!newWindow) {
            alert("Popup blocked or invalid URL");
        }
    };

    const filteredResources = resources.filter(resource => {
        const matchesSearch =
            searchQuery === '' ||
            resource.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            categoryFilter === 'all' ||
            resource.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">Resources Management</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Upload and manage educational resources for students
                    </p>
                </div>
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Upload Resource
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Upload New Resource</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    placeholder="Enter resource title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                    placeholder="Describe the resource"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={uploadForm.category}
                                    onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NOTES">Notes</SelectItem>
                                        <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                                        <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                                        <SelectItem value="REFERENCE">Reference Material</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="visibility">Visibility *</Label>
                                <Select
                                    value={uploadForm.visibility}
                                    onValueChange={(value) => setUploadForm({ ...uploadForm, visibility: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PUBLIC">Public</SelectItem>
                                        <SelectItem value="STUDENTS_ONLY">Students Only</SelectItem>
                                        <SelectItem value="PRIVATE">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                              <div className="space-y-2">
                                <Label htmlFor="url">Online Resource Link *</Label>
                                <Input
                                    id="url"
                                    value={uploadForm.url}
                                    onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                                    placeholder="https://... (Drive, YouTube, etc.)"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Local file paths (C:\) are blocked by browsers. Use online links only for reliable access.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsUploadOpen(false)} className="flex-1">
                                    Cancel
                                </Button>
                                 <Button onClick={handleUpload} className="flex-1">
                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <Input
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="NOTES">Notes</SelectItem>
                                <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                                <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                                <SelectItem value="REFERENCE">Reference</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
                        <p className="text-slate-500 mb-4">Upload your first resource to get started</p>
                        <Button onClick={() => setIsUploadOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Upload Resource
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredResources.map((resource) => (
                        <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                                        <Badge variant="outline" className="mt-2">
                                            {resource.category}
                                        </Badge>
                                    </div>
                                    <FileText className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                                    {resource.description || 'No description'}
                                </p>
                                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                                    <span>{resource.downloads || 0} downloads</span>
                                    <span>{resource.views || 0} views</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(resource.url)}>
                                        <Eye className="mr-1 h-4 w-4" /> View
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(resource.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyResourcesPage;
