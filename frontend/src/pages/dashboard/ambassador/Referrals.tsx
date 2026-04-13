import { useState, useEffect } from 'react';
import { useAmbassadorStore } from '@/store/useAmbassadorStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Copy, Check, ExternalLink, Filter, Search, Zap, Target, MousePointer2, UserCheck, TrendingUp, Sparkles, X, Globe, Shield, Terminal, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Referrals() {
  const { campaigns, fetchCampaigns, createCampaign, isLoading } = useAmbassadorStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', targetAudience: '' });

  useEffect(() => {
    fetchCampaigns().catch(console.error);
  }, [fetchCampaigns]);

  const handleCopy = (code: string, id: string) => {
    const link = `${window.location.origin}/register?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success('Protocol URL successfully captured to buffer.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.title) return;
    await createCampaign(newCampaign);
    setShowCreate(false);
    setNewCampaign({ title: '', description: '', targetAudience: '' });
    toast.success('New tracking link successfully deployed.');
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
            Active <span className="text-indigo-400">Deployments.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3 max-w-lg">Manage your tracking signatures and monitor individual conversion flows across the campus topology.</p>
        </motion.div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 px-6 py-4 bg-slate-900 border border-slate-800 rounded-[1.8rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
             <Globe className="h-5 w-5 text-indigo-400 animate-pulse relative z-10" />
             <div className="flex flex-col relative z-10">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Node Reach Flux</span>
                <span className="text-xs font-black uppercase tracking-widest text-indigo-400">84.2% INTENSITY</span>
             </div>
          </div>
          <Button 
            onClick={() => setShowCreate(true)}
            className="h-20 px-10 rounded-[2.5rem] bg-white text-slate-900 hover:bg-indigo-600 hover:text-white transition-all shadow-3xl shadow-indigo-900/40 font-black uppercase tracking-[0.2em] text-xs gap-4 group/btn border-0"
          >
            <Plus className="h-6 w-6 group-hover/btn:rotate-90 transition-transform" /> Deploy New Protocol
          </Button>
        </div>
      </header>

      {/* Stats Summary Grid */}
      <div className="grid gap-8 md:grid-cols-4">
         {[
           { label: 'Verified Signatures', val: campaigns.length, icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
           { label: 'Signal Hits', val: campaigns.reduce((acc, c) => acc + (c.clickCount || 0), 0), icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
           { label: 'Node Conversions', val: campaigns.reduce((acc, c) => acc + (c.registrationCount || 0), 0), icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
           { label: 'Aggregate Yield', val: `${campaigns.length > 0 ? Math.floor(campaigns.reduce((acc, c) => {
             const rate = c.clickCount && c.clickCount > 0 ? (c.registrationCount / c.clickCount) * 100 : 0;
             return acc + rate;
           }, 0) / campaigns.length) : 0}%`, icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-400/10' }
         ].map((stat, i) => (
           <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-xl rounded-[3rem] overflow-hidden group hover:border-indigo-500/40 transition-all duration-500 relative shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                    <stat.icon className="h-16 w-16" />
                 </div>
                 <CardContent className="p-10 flex items-center justify-between relative z-10">
                    <div className="space-y-2">
                       <span className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{stat.val}</span>
                       <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{stat.label}</span>
                    </div>
                    <div className={`p-5 rounded-2xl ${stat.bg} border border-white/5 shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-all`}>
                       <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                 </CardContent>
              </Card>
           </motion.div>
         ))}
      </div>

      {/* Deploy Modal Overlay - ALIGNED WITH HEADQUARTERS STYLE */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-slate-900 w-full max-w-2xl rounded-[4rem] shadow-3xl border border-slate-800 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[150px] -mr-40 -mt-40" />
              
              <div className="p-12 space-y-12 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                          <Target className="h-6 w-6 text-indigo-400 animate-pulse" />
                       </div>
                       <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Initialize <span className="text-indigo-400">Protocol.</span></h2>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 italic ml-2">Configure a new tracking signature for real-time deployment.</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowCreate(false)} className="h-14 w-14 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white group">
                     <X className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
                
                <form onSubmit={handleCreate} className="space-y-10">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 ml-6 italic">Campaign Identity</label>
                      <Input 
                        placeholder="e.g. ALPHA-RECRUIT-CSE-01" 
                        value={newCampaign.title}
                        onChange={e => setNewCampaign({...newCampaign, title: e.target.value})}
                        className="h-20 rounded-[2.5rem] px-10 border-slate-800 bg-slate-950/80 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-500/50 text-white font-black italic tracking-tight text-xl shadow-inner placeholder:text-slate-700"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 ml-6 italic">Audience Topology</label>
                      <Input 
                        placeholder="e.g. 2nd Year Computer Science Nodes" 
                        value={newCampaign.targetAudience}
                        onChange={e => setNewCampaign({...newCampaign, targetAudience: e.target.value})}
                        className="h-20 rounded-[2.5rem] px-10 border-slate-800 bg-slate-950/80 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-500/50 text-white font-black italic tracking-tight text-xl shadow-inner placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-slate-800">
                    <Button 
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCreate(false)}
                      className="flex-1 h-20 rounded-[2.5rem] bg-slate-950 border border-slate-800 font-black uppercase tracking-widest text-xs text-slate-500 hover:text-white transition-all shadow-inner"
                    >
                      Abort cycle
                    </Button>
                    <Button 
                      className="flex-[2] h-20 rounded-[2.5rem] bg-white text-slate-900 hover:bg-indigo-600 hover:text-white transition-all font-black uppercase tracking-[0.2em] text-xs shadow-3xl shadow-indigo-900/40 gap-4 border-0 group/btn"
                    >
                      Authorize Deployment <ArrowUpRight className="h-5 w-5 group-hover/btn:-translate-y-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Grid */}
      <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((camp, i) => (
          <motion.div 
            key={camp.id} 
            initial={{ opacity: 0, scale: 0.95, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="group relative border border-slate-800/60 bg-slate-900/40 backdrop-blur-2xl shadow-3xl rounded-[3.5rem] overflow-hidden hover:border-indigo-500/40 hover:-translate-y-2 transition-all duration-700">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="p-12 pb-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-3xl font-black uppercase tracking-tighter text-white italic leading-none">{camp.name}</CardTitle>
                      <Badge className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 px-3 py-1 rounded-full italic shadow-lg shadow-emerald-500/5">Active</Badge>
                    </div>
                    <CardDescription className="text-[11px] font-bold text-slate-500 uppercase tracking-widest italic">{camp.targetAudience}</CardDescription>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-700 shadow-inner group-hover:rotate-12 group-hover:scale-110">
                    <Target className="h-6 w-6 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-12 pt-6 space-y-10 relative z-10">
                <div className="grid grid-cols-3 gap-4">
                   {[
                    { label: 'Signals', val: camp.clickCount || 0, icon: MousePointer2, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                    { label: 'Nodes', val: camp.registrationCount || 0, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: 'Yield', val: `${camp.clickCount && camp.clickCount > 0 ? Math.round((camp.registrationCount / camp.clickCount) * 100) : 0}%`, icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-400/10' }
                  ].map((metric, i) => (
                    <div key={i} className="p-6 rounded-[2.2rem] bg-slate-950/80 flex flex-col items-center justify-center border border-slate-800/80 group-hover:border-slate-700 transition-colors shadow-inner">
                      <metric.icon className={`h-6 w-6 mb-4 text-slate-700 group-hover:${metric.color} transition-colors`} />
                      <span className="text-3xl font-black tracking-tighter text-white italic leading-none">{metric.val}</span>
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mt-3 text-center">{metric.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => handleCopy(camp.referralToken || '', camp.id)}
                    className="flex-1 h-20 rounded-[2.5rem] bg-white text-slate-900 hover:bg-slate-100 transition-all font-black uppercase tracking-[0.2em] text-[10px] gap-4 shadow-3xl shadow-indigo-900/10 border-0 group/copy overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover/copy:opacity-5 transition-opacity" />
                    <AnimatePresence mode="wait">
                       {copiedId === camp.id ? (
                          <motion.div key="check" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3">
                             <Check className="h-5 w-5 text-emerald-600" /> Sig. Archived
                          </motion.div>
                       ) : (
                          <motion.div key="copy" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3">
                             <Copy className="h-5 w-5 text-indigo-600 group-hover/copy:-translate-y-1 transition-transform" /> Archive Link
                          </motion.div>
                       )}
                    </AnimatePresence>
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-20 h-20 rounded-[2.5rem] border-slate-800 bg-slate-950/50 hover:bg-slate-900 hover:border-indigo-500/30 transition-all shadow-inner"
                  >
                    <ExternalLink className="h-6 w-6 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </Button>
                </div>
              </CardContent>

              {/* Progress Index Accent */}
              <div className="h-3 w-full bg-slate-950/80 relative overflow-hidden border-t border-slate-800">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${camp.clickCount && camp.clickCount > 0 ? (camp.registrationCount / camp.clickCount) * 100 : 0}%` }}
                   transition={{ duration: 2, ease: "easeOut" }}
                   className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 via-sky-400 to-emerald-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                />
              </div>
            </Card>
          </motion.div>
        ))}

        {campaigns.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full py-48 text-center space-y-10"
          >
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-indigo-600 blur-[100px] opacity-20" />
               <div className="w-32 h-32 bg-slate-900 border border-slate-800 rounded-[4rem] flex items-center justify-center mx-auto relative z-10 shadow-3xl group">
                  <Sparkles className="h-14 w-14 text-indigo-100/20 group-hover:text-indigo-400 group-hover:scale-110 group-hover:rotate-180 transition-all duration-1000" />
               </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic leading-none uppercase">No Protocols Deployed.</h3>
              <p className="text-slate-600 font-medium max-w-sm mx-auto text-sm leading-relaxed uppercase tracking-[0.2em] italic ml-1">
                Initialize your first tracking signature to start archiving student nodes within your influence matrix.
              </p>
              <Button 
                onClick={() => setShowCreate(true)}
                className="mt-8 h-20 rounded-[2.5rem] bg-indigo-600 px-12 font-black uppercase tracking-[0.2em] text-[10px] shadow-3xl shadow-indigo-600/30 border-0 hover:bg-white hover:text-indigo-600 transition-all"
              >
                Initialize deployment Hub
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
