import React, { useEffect, useState } from 'react';
import { useAmbassadorStore } from '@/store/useAmbassadorStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Trophy, Award, CheckCircle, Zap, 
  TrendingUp, TrendingDown, QrCode, Share2, Filter, ShieldCheck, 
  Copy, Coins, Clock, Target, Building2, Terminal,
  Activity, Globe, Lock, LayoutGrid, Box, ArrowUpRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FunnelChart } from '@/components/ambassador/FunnelChart';
import { toast } from 'react-hot-toast';

export default function AmbassadorDashboard() {
  const { 
    metrics, 
    funnelData, 
    linkInfo, 
    qrCode, 
    rewardBreakdown, 
    fraudStatus, 
    rankingInsights,
    fetchMetrics, 
    fetchFunnel, 
    fetchLinkInfo, 
    fetchRewardBreakdown, 
    fetchFraudStatus, 
    fetchRankingInsights,
    connectWebSocket,
    disconnectWebSocket,
    isLoading 
  } = useAmbassadorStore();

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        fetchMetrics(),
        fetchFunnel(),
        fetchLinkInfo(),
        fetchRewardBreakdown(),
        fetchFraudStatus(),
        fetchRankingInsights()
      ]);
    };
    init();
    connectWebSocket();
    return () => disconnectWebSocket();
  }, []);

  if (isLoading && !metrics) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-500 rounded-full animate-spin" />
           <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-400" />
        </div>
        <div className="space-y-1 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white animate-pulse">Initializing Command Center...</p>
           <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Decrypting system protocols and uplink signals.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Referrals', value: metrics?.totalReferrals || 0, icon: <Users />, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Growth Velocity', value: rankingInsights?.movement === 'UP' ? '+12.4%' : '0%', icon: <TrendingUp />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Credit Balance', value: metrics?.rewardPoints || 0, icon: <Coins />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Yield Rate', value: `${metrics?.conversionRate || 0}%`, icon: <CheckCircle />, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <section className="relative h-72 rounded-[3.5rem] bg-slate-900 overflow-hidden shadow-3xl border border-slate-800 group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[130px] rounded-full -mr-40 -mt-40 group-hover:bg-indigo-600/20 transition-colors duration-1000" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        
        <div className="relative z-10 h-full flex items-center px-16 justify-between">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 mb-4">
                 <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-black uppercase tracking-[0.25em] text-[10px] px-4 py-1 rounded-full italic shadow-lg shadow-indigo-600/5">
                   Rank #{metrics?.ambassadorRank || '--'} SECURED
                 </Badge>
                 <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Activity className="h-4 w-4 mr-2 text-emerald-500 animate-pulse" /> Live Telemetry Feed
                 </div>
              </div>
              <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                Ambassador <span className="text-indigo-400 underline decoration-indigo-400/30 underline-offset-[12px] decoration-8">Headquarters.</span>
              </h1>
              <p className="text-slate-400 font-medium max-w-lg mt-6 text-sm leading-relaxed uppercase tracking-widest text-[10px]">
                Central hub for geospatial network expansion and conversion logistics.
              </p>
            </motion.div>
          </div>

          <div className="flex gap-4 relative z-10 shrink-0">
            <Button 
              className="bg-white text-slate-900 hover:bg-indigo-600 hover:text-white h-16 px-10 rounded-[1.8rem] font-black uppercase tracking-widest text-xs gap-3 shadow-3xl shadow-indigo-900/40 transition-all border-0"
              onClick={() => setIsQRModalOpen(true)}
            >
              <QrCode className="h-5 w-5" /> Deployment Init
            </Button>
            <Button variant="outline" className="h-16 px-10 rounded-[1.8rem] border-slate-800 bg-slate-950/50 hover:bg-slate-900 hover:border-indigo-500/30 text-slate-500 hover:text-white font-black uppercase tracking-widest text-xs gap-3 transition-all">
              <Share2 className="h-5 w-5" /> Acquire Sync Link
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl hover:bg-slate-900 hover:border-indigo-500/30 transition-all duration-500 rounded-[3rem] overflow-hidden group shadow-2xl relative">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity">
                 {React.cloneElement(stat.icon as any, { className: 'h-20 w-20' })}
              </div>
              <CardContent className="p-10 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-400 transition-colors italic">{stat.label}</p>
                    <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase group-hover:scale-110 transition-transform origin-left">{stat.value}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bg} border border-white/5 shadow-inner group-hover:rotate-12 transition-transform`}>
                    {React.cloneElement(stat.icon as any, { className: 'h-6 w-6' })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
        {/* Funnel Section */}
        <Card className="lg:col-span-4 bg-slate-900/30 border border-slate-800/60 backdrop-blur-2xl rounded-[4rem] overflow-hidden shadow-3xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
          <CardHeader className="p-12 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-white leading-none">Intelligence Funnel</CardTitle>
                <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[9px] italic">Strategic node conversion logistics tracking.</CardDescription>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                 <Terminal className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-12 pt-0">
            <div className="p-8 rounded-[3.5rem] bg-slate-950/40 border border-slate-800 shadow-inner">
               <FunnelChart data={funnelData} />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-12 text-center">
              {['Hits', 'Entry', 'Signal', 'Yield'].map((l, i) => (
                <div key={l} className="space-y-2 group cursor-default">
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.3em] group-hover:text-indigo-400 transition-colors">{l}</p>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden w-1/2 mx-auto">
                     <div className="h-full bg-indigo-500 w-full opacity-30 group-hover:opacity-100 transition-opacity" style={{ transitionDelay: `${i * 100}ms` }} />
                  </div>
                  <p className="text-[9px] text-slate-800 font-black italic uppercase tracking-widest transition-colors group-hover:text-slate-600">Protocol Node-0{i+1}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Logic */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="bg-slate-900 border border-slate-800 shadow-3xl rounded-[3.5rem] overflow-hidden group relative">
            <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Reward Vectors Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950/80 p-6 rounded-[1.8rem] border border-slate-800/80 group/row hover:border-indigo-500/40 hover:bg-slate-950 transition-all shadow-inner">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-widest group-hover/row:text-white">Direct Intake</span>
                  <span className="text-xl font-black text-emerald-400 italic tracking-tighter uppercase">+{rewardBreakdown?.registrationPoints || 0} PTS</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/80 p-6 rounded-[1.8rem] border border-slate-800/80 group/row hover:border-indigo-500/40 hover:bg-slate-950 transition-all shadow-inner">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-widest group-hover/row:text-white">Signal Participation</span>
                  <span className="text-xl font-black text-indigo-400 italic tracking-tighter uppercase">+{rewardBreakdown?.participationPoints || 0} PTS</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/80 p-6 rounded-[1.8rem] border border-slate-800/80 group/row hover:border-indigo-500/40 hover:bg-slate-950 transition-all shadow-inner">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-widest group-hover/row:text-white">Coordinate Hits</span>
                  <span className="text-xl font-black text-rose-400 italic tracking-tighter uppercase">+{rewardBreakdown?.clickPoints || 0} PTS</span>
                </div>
              </div>
              <div className="pt-8 mt-4 border-t border-slate-800 flex justify-between items-center px-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Aggregate Credibility</span>
                <div className="text-right">
                   <div className="text-4xl font-black text-white italic tracking-tighter">{rewardBreakdown?.total || 0}</div>
                   <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Global Matrix Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-slate-900/60 backdrop-blur-3xl border border-slate-800 shadow-3xl rounded-[3.5rem] relative overflow-hidden group`}>
             <div className={`absolute top-0 right-0 w-48 h-48 ${fraudStatus?.status === 'VALID' ? 'bg-emerald-500/10' : 'bg-rose-500/10'} blur-[80px] rounded-full -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-all`} />
            <CardContent className="p-10 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-[1.8rem] ${fraudStatus?.status === 'VALID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'} border shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Neural Security Guard</h4>
                    <p className="text-xl font-black text-white italic tracking-tighter uppercase mt-1">PROTOCOL: <span className={fraudStatus?.status === 'VALID' ? 'text-emerald-400' : 'text-rose-400'}>{fraudStatus?.status || 'SCANNING...'}</span></p>
                  </div>
                </div>
                {fraudStatus?.status === 'VALID' && (
                   <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                )}
              </div>
              <div className="mt-10 bg-slate-950/80 rounded-[2rem] p-8 border border-slate-800 shadow-inner">
                <div className="flex justify-between text-[11px] text-slate-500 mb-4 font-black uppercase tracking-widest italic">
                  <span>Anomalous Signal Index</span>
                  <span className={fraudStatus?.fraudScore > 0.3 ? 'text-rose-500' : 'text-emerald-400 animate-pulse'}>
                    {Math.round((fraudStatus?.fraudScore || 0) * 100)}.00%
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(fraudStatus?.fraudScore || 0) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full transition-all duration-1000 ${fraudStatus?.fraudScore > 0.3 ? 'bg-gradient-to-r from-rose-600 to-amber-600' : 'bg-gradient-to-r from-emerald-600 to-teal-400'}`} 
                  />
                </div>
                <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-4 text-center">Threat Mapping Cycle Complete.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deployment Modal - COMMAND CENTER STYLE */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="bg-slate-900 border border-slate-800 text-white max-w-lg rounded-[4rem] p-0 overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32" />
          <DialogHeader className="p-12 pb-6 border-b border-slate-800 bg-slate-950/40 relative z-10">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-2 bg-indigo-400/10 rounded-xl border border-indigo-400/20">
                  <Radio className="h-5 w-5 text-indigo-400 animate-pulse" />
               </div>
               <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic text-white leading-none">Diplomatic Toolkit</DialogTitle>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Encrypted coordinate deployment assets.</p>
          </DialogHeader>
          
          <div className="p-12 space-y-10 relative z-10 bg-slate-900/40">
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[3.5rem] shadow-3xl group cursor-pointer overflow-hidden relative active:scale-95 transition-transform duration-500">
               <div className="absolute inset-0 bg-indigo-500 shadow-inner opacity-5 group-hover:opacity-10 transition-opacity" />
              {qrCode ? (
                <img src={qrCode} alt="Referral QR" className="w-64 h-64 relative z-10 drop-shadow-2xl" />
              ) : (
                <div className="w-64 h-64 bg-slate-50 animate-pulse flex items-center justify-center rounded-[2.5rem] border-2 border-slate-100">
                  <Box className="h-16 w-16 text-slate-200" />
                </div>
              )}
              <div className="mt-8 flex flex-col items-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-1">Encrypted Code</p>
                 <p className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-indigo-500/30 underline-offset-8 decoration-4">{linkInfo?.code || 'X7-HQ-Z7'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-4 italic">Protocol Deployment String</label>
              <div className="flex gap-3">
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-[1.8rem] px-8 py-5 text-sm font-mono text-indigo-400 shadow-inner overflow-hidden truncate">
                   {linkInfo?.link || 'https://university.edu/ref/x7-hq-z7'}
                </div>
                <Button 
                  className="w-18 h-18 rounded-[1.8rem] bg-indigo-600 hover:bg-white hover:text-indigo-600 transition-all shadow-2xl border-0" 
                  onClick={() => {
                    navigator.clipboard.writeText(linkInfo?.link || '');
                    toast.success('Protocol link copied to buffer');
                  }}
                >
                  <Copy className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <Button className="w-full h-20 rounded-[2.5rem] bg-white text-slate-900 hover:bg-emerald-500 hover:text-white font-black uppercase tracking-[0.25em] text-xs shadow-3xl transition-all border-0 gap-4 group/btn">
              <Download className="h-6 w-6 group-hover/btn:-translate-y-1 transition-transform" /> Archive Matrix Assets
              <ArrowUpRight className="h-4 w-4 opacity-30" />
            </Button>
            
            <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest text-center mt-6">
               AUTHENTICATED FOR SECTOR-Z4 DEPLOYMENT ONLY.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
