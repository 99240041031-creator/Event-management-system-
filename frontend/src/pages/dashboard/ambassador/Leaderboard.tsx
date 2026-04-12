import { useState, useEffect } from 'react';
import { useAmbassadorStore } from '@/store/useAmbassadorStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Crown, TrendingUp, Sparkles, Download, ShieldCheck, Flag, Star, Zap, Globe, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Leaderboard() {
  const { downloadCertificate, metrics, isLoading } = useAmbassadorStore();
  const [downloading, setDownloading] = useState(false);

  const safeMetrics = metrics || {
    rewardPoints: 0,
    ambassadorRank: 0
  };

  if (isLoading || !metrics) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          <Trophy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-400" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white animate-pulse">Syncing Global Matrix...</p>
          <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Awaiting encrypted feed from protocol nodes.</p>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    toast.info("Generating encrypted credential...");
    await downloadCertificate();
    setDownloading(false);
    toast.success("Certificate successfully archived locally");
  };

  const getTierInfo = (rank: number) => {
    if (rank === 1) return { name: 'Grand Commander', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Crown, border: 'border-amber-400/30' };
    if (rank <= 3) return { name: 'Elite Diplomat', color: 'text-slate-300', bg: 'bg-slate-300/10', icon: Medal, border: 'border-slate-300/30' };
    return { name: 'Field Agent', color: 'text-indigo-400', bg: 'bg-indigo-400/10', icon: ShieldCheck, border: 'border-indigo-400/30' };
  };

  const tier = getTierInfo(safeMetrics.ambassadorRank || 100);

  return (
    <div className="space-y-10 pb-20">
      {/* Top Hero Section */}
      <section className="relative h-72 rounded-[3.5rem] bg-indigo-600 overflow-hidden shadow-2xl shadow-indigo-600/40 group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-20 blur-[140px] rounded-full -mr-80 -mt-80 group-hover:opacity-30 transition-opacity duration-1000" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-950/40 to-transparent" />
        
        <div className="relative z-10 h-full flex items-center px-16 justify-between">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                 <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2">
                    <Activity className="h-3 w-3 text-emerald-300 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-100">Live Telemetry Active</span>
                 </div>
              </div>
              <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                Hall of <span className="text-indigo-200 underline decoration-indigo-400 decoration-8 underline-offset-8">Fame.</span>
              </h1>
              <p className="text-indigo-100/70 font-medium max-w-lg mt-6 text-sm leading-relaxed">
                Celebrating the elite vanguards driving systemic growth and architectural excellence across our digital university matrix.
              </p>
            </motion.div>
          </div>
          
          <div className="hidden xl:flex flex-col items-end gap-4">
             <div className="flex items-center gap-4 bg-slate-950/30 backdrop-blur-xl p-6 px-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Global Coverage</p>
                   <p className="text-3xl font-black text-white italic tracking-tighter">84.2%</p>
                </div>
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                   <Globe className="h-6 w-6 text-white" />
                </div>
             </div>
             <div className="flex items-center gap-2 px-6 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">+2.4k Interactions/hr</span>
             </div>
          </div>
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Prestige Standings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4 mb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Global Standings Matrix</h2>
            <div className="flex items-center gap-3 py-2 px-4 bg-slate-900 rounded-2xl border border-slate-800">
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol V3.2 Stable</span>
            </div>
          </div>

          <AnimatePresence>
            {[
              { id: '1', name: 'Emma Wilson', college: 'Tech University', points: safeMetrics.rewardPoints, rank: safeMetrics.ambassadorRank, isMe: true },
              { id: '2', name: 'Arjun Kumar', college: 'National Institute', points: Math.floor(safeMetrics.rewardPoints * 0.9), rank: safeMetrics.ambassadorRank + 1 },
              { id: '3', name: 'Sarah Chen', college: 'Engineering Tech', points: Math.floor(safeMetrics.rewardPoints * 0.8), rank: safeMetrics.ambassadorRank + 2 },
              { id: '4', name: 'David Park', college: 'Global Academy', points: Math.floor(safeMetrics.rewardPoints * 0.7), rank: safeMetrics.ambassadorRank + 3 },
              { id: '5', name: 'Li Wei', college: 'Central College', points: Math.floor(safeMetrics.rewardPoints * 0.6), rank: safeMetrics.ambassadorRank + 4 },
            ].sort((a, b) => a.rank - b.rank).map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 ${
                  user.isMe 
                    ? 'bg-slate-900 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-600/30' 
                    : 'bg-slate-900/40 border border-slate-800/50 hover:border-indigo-500/30 hover:bg-slate-900 transition-colors shadow-xl'
                }`}
              >
                <div className="flex items-center gap-8 relative z-10">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black italic tracking-tighter ${
                    user.isMe ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110' : 'bg-slate-800 text-slate-500 group-hover:bg-indigo-900/50 group-hover:text-indigo-400 transition-all'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                       <h4 className={`text-xl font-black truncate uppercase tracking-tight ${user.isMe ? 'text-white italic' : 'text-slate-200'}`}>{user.name} {user.isMe && '(You)'}</h4>
                       {user.rank <= 3 && <Medal className={`h-5 w-5 ${user.rank === 1 ? 'text-amber-400' : 'text-slate-400'}`} />}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mt-1">{user.college}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-black italic tracking-tighter ${user.isMe ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}`}>
                      {user.points.toLocaleString()}
                    </div>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${user.isMe ? 'text-indigo-300' : 'text-slate-600'}`}>Cumulative Pts</p>
                  </div>
                </div>
                {user.isMe && (
                   <div className="absolute right-0 top-0 bottom-0 w-1 bg-indigo-500" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* My Performance Summary */}
        <div className="space-y-8">
          <Card className="border border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-[3rem] overflow-hidden group">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Tier Authenticator</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-10">
              <div className="text-center py-8 relative">
                <div className="absolute inset-0 bg-indigo-500/5 blur-[60px] rounded-full" />
                <div className={`w-32 h-32 ${tier.bg} ${tier.border} border rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 group-hover:rotate-[15deg] transition-transform duration-700 shadow-2xl shadow-indigo-600/10`}>
                  <tier.icon className={`h-16 w-16 ${tier.color}`} />
                </div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{tier.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-3">Verified Rank Credential</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-[2rem] bg-slate-950 border border-slate-800 space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Next Node Lock</span>
                      <span className="text-xs font-black text-indigo-400">850 Pts Remaining</span>
                   </div>
                   <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-sky-400"
                      />
                   </div>
                   <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center">Sync Progress: 65%</p>
                </div>
              </div>

              <Button 
                onClick={handleDownload}
                disabled={downloading}
                className="w-full h-20 rounded-[2rem] bg-white text-slate-900 hover:bg-indigo-600 hover:text-white font-black uppercase tracking-widest text-xs gap-4 shadow-2xl shadow-indigo-600/20 transition-all border-0 disabled:opacity-50 group/btn"
              >
                {downloading ? (
                  <Activity className="h-6 w-6 animate-pulse" />
                ) : (
                  <>
                    <Download className="h-5 w-5 group-hover/btn:-translate-y-1 transition-transform" /> Export Bio-Credentials
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <Card className="border border-slate-800 bg-slate-900 shadow-2xl rounded-[3rem] overflow-hidden">
             <CardHeader className="p-10 pb-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Milestone Archives</CardTitle>
             </CardHeader>
             <CardContent className="p-10 pt-0 grid grid-cols-3 gap-4">
                {[
                  { icon: Star, label: 'Early Bird', active: true, color: 'text-amber-400' },
                  { icon: Flag, label: 'Campus Lead', active: true, color: 'text-indigo-400' },
                  { icon: Award, label: 'Centurion', active: false, color: 'text-slate-600' },
                ].map((badge, i) => (
                  <div key={i} className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all ${badge.active ? 'bg-indigo-500/10 border border-indigo-500/20 shadow-lg' : 'bg-slate-800/30 border border-slate-800 opacity-20 grayscale'}`}>
                    <badge.icon className={`h-6 w-6 ${badge.color}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight transition-colors">{badge.label}</span>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
