import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Copy, Check, Image as ImageIcon, FileText, Video, Sparkles, ExternalLink, Zap, Target, Palette, ShieldCheck, Terminal, Box, Radio, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PromotionToolkit() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const assets = [
    { id: '1', name: 'Official Poster Kit 2026', type: 'IMAGE', size: '12.4 MB', icon: ImageIcon, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
    { id: '2', name: 'Social Media Banner Set', type: 'IMAGE', size: '8.1 MB', icon: Palette, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
    { id: '3', name: 'Ambassador Pitch Deck', type: 'DOCUMENT', size: '4.2 MB', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    { id: '4', name: 'Hackathon Promo Video', type: 'VIDEO', size: '45.0 MB', icon: Video, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  ];

  const handleCopySignature = () => {
    const signature = `[REGISTER NOW] - Verified Student Ambassador Link - ${window.location.origin}/ref/AMB-2026`;
    navigator.clipboard.writeText(signature);
    setCopiedId('signature');
    toast.success('Campaign signature successfully captured.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
            Promotion <span className="text-indigo-400">Toolkit.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3 max-w-lg">Verified digital assets and campaign signatures for rapid campus deployment protocols.</p>
        </motion.div>
        
        <div className="flex items-center gap-6 bg-slate-900 border border-slate-800 px-8 py-5 rounded-[2.5rem] shadow-3xl overflow-hidden relative group">
           <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
           <Terminal className="h-6 w-6 text-indigo-400 relative z-10" />
           <div className="flex flex-col relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Inventory Status</span>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">v4.2-STABLE • LIVE</span>
           </div>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Main Asset Library */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between px-6">
             <div className="flex items-center gap-4">
                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 italic">Digital Asset Repository</h2>
                <div className="h-px w-24 bg-slate-800" />
             </div>
             <div className="flex items-center gap-3 p-2 bg-slate-950 border border-slate-800 rounded-[1.5rem] shadow-inner">
                <Button variant="ghost" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-lg border border-white/5">All Nodes</Button>
                <Button variant="ghost" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Visuals</Button>
                <Button variant="ghost" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Docs</Button>
             </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {assets.map((asset, i) => (
              <motion.div 
                key={asset.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`group border ${asset.border} shadow-3xl rounded-[4rem] overflow-hidden hover:bg-slate-900 transition-all duration-700 bg-slate-900/40 backdrop-blur-2xl relative`}>
                   <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-10 transition-opacity">
                      <asset.icon className="h-32 w-32" />
                   </div>
                   <CardContent className="p-12 relative z-10">
                      <div className="flex items-center gap-6 mb-12">
                         <div className={`${asset.bg} w-24 h-24 rounded-[3rem] flex items-center justify-center border ${asset.border} group-hover:rotate-[15deg] transition-all duration-700 shadow-2xl relative`}>
                            <div className="absolute inset-0 bg-white/5 blur-xl group-hover:opacity-100 opacity-0 transition-opacity" />
                            <asset.icon className={`h-10 w-10 ${asset.color} relative z-10`} />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">{asset.name}</h4>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600 mt-1 block">{asset.type} • {asset.size}</span>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <Button className="flex-1 h-20 rounded-[2.5rem] bg-white text-slate-900 hover:bg-indigo-600 hover:text-white font-black uppercase tracking-[0.2em] text-xs gap-4 shadow-3xl transition-all border-0 group/btn">
                            <Download className="h-6 w-6 group-hover/btn:-translate-y-1 transition-transform" /> Archive Asset
                         </Button>
                         <Button variant="outline" className="w-20 h-20 rounded-[2.5rem] border-slate-800 bg-slate-950/50 hover:bg-slate-900 hover:border-indigo-500/30 transition-all text-slate-500 hover:text-white shadow-inner">
                            <ExternalLink className="h-6 w-6" />
                         </Button>
                      </div>
                   </CardContent>
                   <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Signature Hub */}
        <div className="space-y-10">
           <Card className="border border-indigo-500/30 shadow-3xl rounded-[4rem] bg-indigo-600 text-white p-14 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 blur-[120px] rounded-full -mr-32 -mt-32 group-hover:bg-white/30 transition-colors duration-1000" />
              <div className="relative z-10 space-y-12">
                 <div className="space-y-5">
                    <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                       <Radio className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">Campaign <br/><span className="text-indigo-200">Signature.</span></h3>
                       <p className="text-[11px] font-bold text-indigo-100/60 leading-relaxed uppercase tracking-[0.15em] mt-3">Verified coordinate signature for high-speed matrix deployment.</p>
                    </div>
                 </div>

                 <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] font-mono text-xs leading-relaxed break-all shadow-inner relative group/sig overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-20" />
                    <div className="absolute top-4 right-8 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Encrypted String</div>
                    <span className="text-indigo-300 font-bold">[SIGNAL_SYNC]</span> register?ref=AMB-2026-HQ-Z7
                 </div>

                 <Button 
                   onClick={handleCopySignature}
                   className="w-full h-24 rounded-[3rem] bg-white text-indigo-700 hover:bg-slate-100 font-black uppercase tracking-[0.25em] text-xs gap-5 shadow-3xl shadow-indigo-900/50 transition-all border-0 group/copy"
                 >
                    <AnimatePresence mode="wait">
                       {copiedId === 'signature' ? (
                          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-4">
                             <Check className="h-7 w-7" /> Protocol Synced
                          </motion.div>
                       ) : (
                          <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-4">
                             <Copy className="h-7 w-7 group-hover/copy:-translate-y-1 transition-transform" /> Sync Signature
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </Button>
              </div>
           </Card>

           <Card className="border border-slate-800 shadow-2xl rounded-[4rem] p-12 space-y-10 bg-slate-900/60 backdrop-blur-xl overflow-hidden relative group">
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="space-y-4 relative z-10">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 italic">Signal Intelligence</h3>
                 <p className="text-2xl font-black text-white leading-tight uppercase tracking-tighter italic">Referral throughput <span className="text-emerald-400">Escalated</span> across sector.</p>
              </div>
              <div className="flex items-center gap-6 py-8 border-y border-slate-800/60 relative z-10">
                 <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-xl">
                    <Zap className="h-8 w-8 text-emerald-400 animate-pulse" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Rapid Conversion Flow</h4>
                    <p className="text-2xl font-black italic text-white tracking-widest mt-1">98.2% COHERENCE</p>
                 </div>
              </div>
              <Button variant="ghost" className="w-full justify-between px-6 h-18 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:bg-slate-900 hover:text-white transition-all relative z-10 group/guide">
                 INITIATE DEPLOYMENT GUIDE <Target className="h-5 w-5 group-hover/guide:translate-x-1 transition-transform" />
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}
