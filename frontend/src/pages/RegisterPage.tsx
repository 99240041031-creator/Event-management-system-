import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  GraduationCap,
  Building2,
  CheckCircle,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import type { UserRole } from '@/types';
import { mockColleges } from '@/data/mockData';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, name: 'Identity' },
  { id: 2, name: 'Credentials' },
  { id: 3, name: 'Security' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    role: '' as UserRole | '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    collegeId: '',
    department: '',
    year: '',
    directorRole: '',
  });

  const handleNext = () => {
    if (currentStep === 1 && !formData.role) {
      toast.error('Identity selection is mandatory');
      return;
    }
    if (currentStep === 2) {
      if (!formData.firstName || !formData.lastName) {
        toast.error('Identity details are incomplete');
        return;
      }
      if (formData.role === 'student' && (!formData.collegeId || !formData.year)) {
        toast.error('Institutional verification data missing');
        return;
      }
      if (formData.role === 'faculty' && !formData.collegeId) {
        toast.error('Institution verification data missing');
        return;
      }
      if (formData.role === 'director' && (!formData.collegeId || !formData.directorRole)) {
        toast.error('Director level assignment missing');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Access credentials missing');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role as UserRole,
        collegeId: formData.collegeId,
        department: formData.department,
        academicYear: formData.role === 'student' && formData.year ? parseInt(formData.year) : undefined,
        facultySubRole: undefined,
        directorRole: formData.role === 'director' ? formData.directorRole : undefined,
      });
      toast.success('Registration successful. Please login to continue.');
      navigate('/login');
    } catch (error: any) {
      console.error('[Registration Error]:', error);
      const message = error.response?.data?.message || error.message || 'Registration synthesis failed';
      toast.error(message);
    }
  };

  const roles = [
    { value: 'student', label: 'Competitor', icon: Rocket, description: 'Enter arenas, build teams, and win big' },
    { value: 'faculty', label: 'Architect', icon: Building2, description: 'Design challenges and mentor legends' },
    { value: 'director', label: 'Director', icon: ShieldCheck, description: 'Manage institutional nodes and access' },
  ];

  const directorSubRoles = [
    { value: 'hod', label: 'Head of Department' },
    { value: 'college_admin', label: 'College Admin' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'judge', label: 'Judge' }
  ];



  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Other',
  ];

  const years = ['1', '2', '3', '4', '5'];

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
      {/* Visual Workspace (Left) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[hsl(var(--teal))]/20 rounded-full blur-[120px] -mr-96 -mt-96" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between p-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl rotate-3 transition-transform hover:rotate-0">
              <Zap className="h-6 w-6 text-slate-950 fill-current" />
            </div>
            <span className="text-2xl font-black text-white italic tracking-tighter uppercase">Nexus</span>
          </Link>

          <div className="space-y-12">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-7xl font-black text-white leading-none tracking-tighter italic uppercase">
                The Next <br /> <span className="text-[hsl(var(--teal))]">Generation.</span>
              </h2>
              <p className="mt-8 text-xl text-slate-500 font-bold max-w-md leading-relaxed">
                Join the elite network of university innovators and architects building the decentralized future.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              {[
                { label: 'Active Arenas', val: '240+', icon: Globe },
                { label: 'Verified Minds', val: '80K+', icon: User },
                { label: 'Bounty Pool', val: '$2.4M', icon: Sparkles },
                { label: 'Certificates', val: 'Secure', icon: ShieldCheck },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <s.icon className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                  </div>
                  <p className="text-3xl font-black text-white uppercase italic">{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-12 border-t border-white/5">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Infiltrated by <span className="text-white">524</span> agents in the last hour
            </p>
          </div>
        </div>
      </div>

      {/* Registration Interface (Right) */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 relative bg-white dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto w-full max-w-[480px] space-y-12"
        >
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Join <span className="text-[hsl(var(--teal))]">Nexus</span></h1>
              <div className="flex gap-2">
                {steps.map(s => (
                  <div key={s.id} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${currentStep >= s.id ? 'bg-[hsl(var(--teal))]' : 'bg-slate-100 dark:bg-slate-800'}`} />
                ))}
              </div>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Phase {currentStep}: {steps[currentStep - 1].name}</p>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="grid gap-4">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setFormData({ ...formData, role: role.value as UserRole })}
                      className={cn(
                        "group flex items-center gap-6 rounded-[2rem] border-2 p-6 text-left transition-all relative overflow-hidden",
                        formData.role === role.value
                          ? "border-[hsl(var(--teal))] bg-[hsl(var(--teal))]/5 dark:bg-[hsl(var(--teal))]/10 shadow-xl shadow-[hsl(var(--teal))]/5"
                          : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                      )}
                    >
                      <div className={cn(
                        "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-500",
                        formData.role === role.value
                          ? "bg-[hsl(var(--teal))] text-white scale-110 shadow-lg"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:scale-105"
                      )}>
                        <role.icon className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-widest">{role.label}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase leading-snug">{role.description}</p>
                      </div>
                      {formData.role === role.value && (
                        <div className="absolute top-4 right-6">
                          <CheckCircle className="h-5 w-5 text-[hsl(var(--teal))]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <Button onClick={handleNext} className="h-16 w-full rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all mt-4">
                  CONTINUE TO ACCOUNT SYNTHESIS <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Legacy First Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black text-xs uppercase"
                          placeholder="JOHN"
                          value={formData.firstName}
                          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Legacy Last Name</label>
                      <Input
                        className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black text-xs uppercase"
                        placeholder="DOE"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Institutional Node (College)</label>
                    <Select value={formData.collegeId} onValueChange={val => setFormData({ ...formData, collegeId: val })}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black text-xs uppercase">
                        <SelectValue placeholder="SELECT INSTITUTION..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl">
                        {mockColleges.map((college) => (
                          <SelectItem key={college.id} value={college.id} className="font-black text-xs uppercase p-4 hover:bg-[hsl(var(--teal))]/10 transition-colors">
                            {college.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={cn("space-y-2", formData.role === 'faculty' ? "col-span-2" : "col-span-1")}>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Faculty / Dept</label>
                      <Select value={formData.department} onValueChange={val => setFormData({ ...formData, department: val })}>
                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black text-xs uppercase">
                          <SelectValue placeholder="DEPT..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl">
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept} className="font-black text-xs uppercase">
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Conditional Dropdown based on Role */}
                    <div className="space-y-2">
                      {formData.role === 'student' && (
                        <>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Current Cycle (Year)</label>
                          <Select value={formData.year} onValueChange={val => setFormData({ ...formData, year: val })}>
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black text-xs uppercase">
                              <SelectValue placeholder="YEAR..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl">
                              {years.map((y) => (
                                <SelectItem key={y} value={y} className="font-black text-xs uppercase">
                                  YEAR {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      )}



                      {formData.role === 'director' && (
                        <>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Director Role</label>
                          <Select value={formData.directorRole} onValueChange={val => setFormData({ ...formData, directorRole: val })}>
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black text-xs uppercase">
                              <SelectValue placeholder="SELECT ROLE..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl">
                              {directorSubRoles.map((role) => (
                                <SelectItem key={role.value} value={role.value} className="font-black text-xs uppercase">
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleBack} variant="outline" className="h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-black uppercase tracking-widest text-[10px] px-8">
                    <ChevronLeft className="h-4 w-4 mr-2" /> REVERT
                  </Button>
                  <Button onClick={handleNext} className="h-14 flex-1 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all">
                    AUTHORIZE INFORMATION <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.form key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Secure Communications (Email)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="email"
                        className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black text-xs uppercase tracking-widest"
                        placeholder="IDENTIFIER@NEXUS.ID"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Access Key (Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="h-14 pl-12 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black text-xs tracking-widest"
                        placeholder="••••••••••••"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[hsl(var(--teal))] transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2">Must exceed 8 characters with multi-tier entropy</p>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <input id="terms" type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-200 text-[hsl(var(--teal))] focus:ring-[hsl(var(--teal))]" required />
                    <label htmlFor="terms" className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-widest">
                      I accept the <Link to="/terms" className="text-slate-900 dark:text-white underline">Terms of Engagement</Link> and <Link to="/privacy" className="text-slate-900 dark:text-white underline">Protocol Privacy</Link>.
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" onClick={handleBack} variant="outline" className="h-16 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-black uppercase tracking-widest text-[10px] px-8">
                    <ChevronLeft className="h-4 w-4 mr-2" /> REVERT
                  </Button>
                  <Button type="submit" className="h-16 flex-1 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-2xl shadow-slate-200 dark:shadow-none" disabled={isLoading}>
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                    ) : (
                      <>INITIALIZE AGENT PROFILE <Zap className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Authorized Access Only? <Link to="/login" className="text-slate-900 dark:text-white underline decoration-[hsl(var(--teal))] decoration-2 underline-offset-4">Decrypt Session</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
