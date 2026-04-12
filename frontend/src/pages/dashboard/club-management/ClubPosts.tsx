import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { facultyClubApi } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ClubPosts = ({ clubId }: { clubId: string }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [isNewPostOpen, setIsNewPostOpen] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPosts();
    }, [clubId]);

    const loadPosts = () => {
        facultyClubApi.getPosts(clubId).then(res => setPosts(res || [])).catch(console.error);
    };

    const handleCreatePost = async () => {
        if (!newPostTitle || !newPostContent) {
            toast.error('Please fill in all fields');
            return;
        }
        try {
            setLoading(true);
            await facultyClubApi.createPost(clubId, { title: newPostTitle, content: newPostContent });
            toast.success('Post created successfully');
            setIsNewPostOpen(false);
            setNewPostTitle('');
            setNewPostContent('');
            loadPosts();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Announcements & Posts</h3>
                <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" /> New Post</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Post</DialogTitle>
                            <DialogDescription>Share updates with club members</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} placeholder="Post title" />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="Write your post content..." rows={4} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreatePost} disabled={loading}>Create Post</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            {posts.length === 0 ? <Card><CardContent className="p-8 text-center text-slate-500">No posts yet.</CardContent></Card> : (
                <div className="space-y-4">
                    {posts.map((p: any) => (
                        <Card key={p.id}>
                            <CardHeader>
                                <CardTitle>{p.title}</CardTitle>
                                <CardDescription>By {p.authorName} • {new Date(p.createdAt).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 whitespace-pre-wrap">{p.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClubPosts;
