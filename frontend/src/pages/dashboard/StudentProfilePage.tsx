import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Mail, BookOpen, Award, Edit3, Save, X,
  Upload, Link, Github, Linkedin, Globe, Zap,
  Star, Trophy, Calendar, Camera, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { studentService } from '@/services/studentService';
import type { StudentProfile } from '@/services/studentService';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
  skills: z.string().optional(),
  avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProfileForm = z.infer<typeof profileSchema>;

const SKILL_COLORS = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
];

const portfolioLinks = [
  { label: 'GitHub', icon: Github, placeholder: 'https://github.com/username', key: 'github' },
  { label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username', key: 'linkedin' },
  { label: 'Portfolio', icon: Globe, placeholder: 'https://yourportfolio.com', key: 'website' },
];

const StudentProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const data = await studentService.getProfile(user.id);
        setProfile(data);
        const skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
        setSkillsList(skills);
        reset({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          bio: data.bio || '',
          skills: data.skills || '',
          avatar: data.avatar || '',
        });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await studentService.updateProfile(user.id, {
        ...data,
        skills: skillsList.join(', '),
      });
      setProfile(updated);
      updateUser({
        firstName: updated.firstName,
        lastName: updated.lastName,
        avatar: updated.avatar,
      });
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skillsList.includes(s)) {
      setSkillsList(prev => [...prev, s]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkillsList(prev => prev.filter(s => s !== skill));
  };

  const profileCompletion = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.firstName) score += 20;
    if (profile.avatar) score += 15;
    if (profile.bio) score += 25;
    if (skillsList.length > 0) score += 20;
    if (profile.department) score += 20;
    return score;
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const completion = profileCompletion();

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your academic identity and portfolio
          </p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)} className="gap-2">
            <Edit3 className="h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)} className="gap-2">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Profile Completion Banner */}
      {completion < 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-amber-800 dark:text-amber-400">
              Profile Completion
            </span>
            <span className="text-sm font-bold text-amber-600">{completion}%</span>
          </div>
          <Progress value={completion} className="h-2" />
          <p className="text-xs text-amber-700 dark:text-amber-500 mt-2">
            Complete your profile to stand out to recruiters and clubs.
          </p>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Avatar + Stats */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.firstName}`}
                      alt={profile?.firstName}
                    />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {editing && (
                    <button className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-1.5 text-white shadow-md hover:bg-blue-600">
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <Badge className="mt-2 capitalize" variant="secondary">
                  {profile?.role?.replace('_', ' ')}
                </Badge>
                {profile?.collegeName && (
                  <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {profile.collegeName}
                  </p>
                )}

                <Separator className="my-4" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3">
                    <div className="flex items-center gap-1 text-amber-500 justify-center">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-bold text-amber-600 mt-1">{profile?.points ?? 0}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">Points</p>
                  </div>
                  <div className="rounded-xl bg-orange-50 dark:bg-orange-900/20 p-3">
                    <div className="flex items-center gap-1 text-orange-500 justify-center">
                      <Zap className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600 mt-1">{profile?.streak ?? 0}</p>
                    <p className="text-xs text-orange-700 dark:text-orange-400">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Portfolio Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Link className="h-4 w-4" /> Portfolio Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {portfolioLinks.map(({ label, icon: Icon, placeholder }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  {editing ? (
                    <Input placeholder={placeholder} className="h-8 text-xs" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{placeholder}</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Edit form */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    {editing ? (
                      <>
                        <Input {...register('firstName')} />
                        {errors.firstName && (
                          <p className="text-xs text-destructive">{errors.firstName.message}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm py-2">{profile?.firstName || '—'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    {editing ? (
                      <>
                        <Input {...register('lastName')} />
                        {errors.lastName && (
                          <p className="text-xs text-destructive">{errors.lastName.message}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm py-2">{profile?.lastName || '—'}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </Label>
                  <p className="text-sm py-2 text-muted-foreground">{profile?.email}</p>
                </div>

                <div className="space-y-2">
                  <Label>Department</Label>
                  <p className="text-sm py-2">{profile?.departmentName || profile?.department || '—'}</p>
                </div>

                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <p className="text-sm py-2">
                    {profile?.academicYear ? `Year ${profile.academicYear}` : '—'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Avatar URL</Label>
                  {editing ? (
                    <>
                      <Input {...register('avatar')} placeholder="https://..." />
                      {errors.avatar && (
                        <p className="text-xs text-destructive">{errors.avatar.message}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm py-2 text-muted-foreground truncate">
                      {profile?.avatar || 'Not set'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" /> About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <>
                    <Textarea
                      {...register('bio')}
                      placeholder="Tell us about yourself, your goals, and interests..."
                      className="min-h-[100px] resize-none"
                      maxLength={300}
                    />
                    {errors.bio && (
                      <p className="text-xs text-destructive mt-1">{errors.bio.message}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {profile?.bio || 'No bio added yet. Click Edit Profile to add one.'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" /> Skills & Interests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {skillsList.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No skills added yet.</p>
                  ) : (
                    skillsList.map((skill, i) => (
                      <span
                        key={skill}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${SKILL_COLORS[i % SKILL_COLORS.length]}`}
                      >
                        {skill}
                        {editing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:opacity-70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))
                  )}
                </div>
                {editing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill (press Enter)"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addSkill} size="sm" variant="outline">
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resume Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" /> Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Upload your Resume</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOC up to 5MB</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" /> Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Trophy, label: 'Hackathon Winner', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
                    { icon: Star, label: 'Top Contributor', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                    { icon: CheckCircle, label: 'Consistent', color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
                    { icon: Zap, label: 'Fast Learner', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
                    { icon: Calendar, label: '30-Day Streak', color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' },
                    { icon: Globe, label: 'Global Rank', color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className={`flex flex-col items-center gap-2 p-3 rounded-xl ${color}`}>
                      <Icon className="h-6 w-6" />
                      <span className="text-[10px] font-bold text-center leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
