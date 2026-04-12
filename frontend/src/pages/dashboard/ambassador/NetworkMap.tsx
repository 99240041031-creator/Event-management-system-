import React, { useEffect } from 'react';
import { useAmbassadorStore } from '@/store/useAmbassadorStore';
import { NetworkGraph } from '@/components/ambassador/NetworkGraph';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe, Zap, Users, ShieldCheck, Activity, Terminal, Radio, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const NetworkMap: React.FC = () => {
  const { networkGraph, fetchNetworkGraph } = useAmbassadorStore();

  useEffect(() => {
    fetchNetworkGraph();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none flex items-center gap-4">
             <Globe className="h-10 w-10 text-indigo-400 group-hover:rotate-12 transition-transform duration-700" />
             Geospatial <span className="text-indigo-400">Reach.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3 max-w-lg">Global campus connectivity and influence matrix visualization feed.</p>
        </motion.div>
        
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-6 py-4 rounded-3xl shadow-2xl">
           <Activity className="h-5 w-5 text-indigo-400 animate-pulse" />
           <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Signal Integrity</span>
              <span className="text-sm font-black text-white italic tracking-widest">STABLE PROTOCOL</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3">
          <Card className="border border-slate-800/60 shadow-3xl rounded-[3.5rem] bg-slate-900/40 backdrop-blur-xl overflow-hidden p-2 relative group min-h-[600px]">
             <div className="absolute top-6 left-10 z-20 flex items-center gap-3 py-2 px-5 bg-slate-950/80 backdrop-blur-md rounded-full border border-slate-800">
                <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Coordinate Feed Alpha</span>
             </div>
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
             <NetworkGraph data={networkGraph} />
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border border-slate-800 shadow-2xl rounded-[3rem] bg-slate-900 overflow-hidden group">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Reach Distribution HUD</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-8">
              <div className="space-y-6">
                {[
                  { label: 'Tier 1 Hubs', val: '4', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                  { label: 'Active Nodes', val: '12', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                  { label: 'Secure Zones', val: '8', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center group/item hover:translate-x-1 transition-transform cursor-default">
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-xl ${item.bg} border border-white/5`}>
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                       </div>
                       <span className="text-xs font-black uppercase tracking-widest text-slate-300 group-hover/item:text-white transition-colors">{item.label}</span>
                    </div>
                    <span className="text-xl font-black italic tracking-tighter text-white">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-800">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">
                    <span>Mapping Coverage</span>
                    <span className="text-indigo-400">82.4%</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '82.4%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-sky-400"
                    />
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-indigo-500/20 shadow-3xl rounded-[3rem] bg-indigo-600/5 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <Terminal className="h-16 w-16 text-indigo-400" />
            </div>
            <CardContent className="p-10 space-y-4">
              <div className="flex items-center gap-3">
                 <Info className="h-5 w-5 text-indigo-400 animate-pulse" />
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em]">Network Logic Matrix</h4>
              </div>
              <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest text-[10px]">
                Nodes represent campus clusters. Edges represent real-time referral flow and shared interest nodes. 
                <span className="text-indigo-300 font-bold ml-1">High-density conversion zones (Level 3) are marked in Pink.</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NetworkMap;
