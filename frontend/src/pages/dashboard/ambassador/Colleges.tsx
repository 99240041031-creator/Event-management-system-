import { motion } from 'framer-motion';
import { Building2, MapPin, Globe, Users, TrendingUp, Sparkles, ShieldCheck, Zap, Activity, Network, Radio, Server } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function Colleges() {
  const colleges = [
    { id: '1', name: 'MIT - Madras Institute of Technology', state: 'Tamil Nadu', students: 450, growth: '+12%', type: 'Flagship' },
    { id: '2', name: 'IIT Madras', state: 'Tamil Nadu', students: 890, growth: '+5%', type: 'Partner' },
    { id: '3', name: 'SRM Institute of Technology', state: 'Tamil Nadu', students: 1200, growth: '+18%', type: 'Flagship' },
    { id: '4', name: 'VIT Vellore', state: 'Tamil Nadu', students: 2400, growth: '+25%', type: 'Strategic' },
    { id: '5', name: 'Anna University', state: 'Tamil Nadu', students: 3100, growth: '+8%', type: 'Strategic' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
            Mapped <span className="text-indigo-400">Topologies.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3 max-w-lg">Active inter-college node mapping and geographic relay status feed.</p>
        </motion.div>
        
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-6 py-4 rounded-3xl shadow-2xl shadow-indigo-600/5 backdrop-blur-md">
           <Network className="h-5 w-5 text-indigo-400 animate-pulse" />
           <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Reach Index</span>
              <span className="text-sm font-black text-white italic tracking-widest">8.4 / 10.0</span>
           </div>
        </div>
      </header>

      {/* Network Stats Visualizer */}
      <div className="grid gap-8 lg:grid-cols-4">
        {[
          { label: 'Total Nodes', val: colleges.length, icon: Building2, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
          { label: 'Active Relay', val: '14.2k', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
          { label: 'Geosync', val: '99%', icon: Globe, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
          { label: 'Latency', val: '14ms', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
             <Card className={`border ${stat.border} shadow-2xl bg-slate-900/40 backdrop-blur-xl rounded-[3rem] group hover:bg-slate-900 transition-all duration-500 overflow-hidden relative`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <stat.icon className="h-20 w-20" />
                </div>
                <CardContent className="p-10 space-y-6 relative z-10">
                   <div className={`${stat.bg} w-14 h-14 rounded-2xl flex items-center justify-center border ${stat.border} group-hover:scale-110 transition-transform duration-500`}>
                      <stat.icon className={`h-7 w-7 ${stat.color}`} />
                   </div>
                   <div>
                      <span className="block text-3xl font-black italic tracking-tighter text-white uppercase">{stat.val}</span>
                      <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">{stat.label}</span>
                   </div>
                </CardContent>
             </Card>
          </motion.div>
        ))}
      </div>

      {/* Institution Matrix */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-6">
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">Institution Matrix Topology</h2>
           <div className="flex items-center gap-3 py-2 px-5 bg-slate-900 rounded-full border border-slate-800">
              <Radio className="h-4 w-4 text-indigo-400 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol V0.4 Active</span>
           </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {colleges.map((college, i) => (
            <motion.div 
              key={college.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group border border-slate-800/60 shadow-xl rounded-[3.5rem] overflow-hidden hover:border-indigo-500/30 hover:bg-slate-900 transition-all duration-700 bg-slate-900/30 backdrop-blur-xl relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-full" />
                <CardContent className="p-10 flex items-center justify-between">
                   <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-[2.5rem] bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-all duration-500 shadow-inner">
                         <Building2 className="h-10 w-10 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-2xl font-black tracking-tight text-white italic uppercase">{college.name}</h4>
                         <div className="flex items-center gap-5">
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                               <MapPin className="h-4 w-4 text-indigo-400/50" /> {college.state}
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">
                               <ShieldCheck className="h-3 w-3" /> {college.type}
                            </span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right space-y-2">
                      <div className="flex items-center justify-end gap-3">
                         <span className="text-3xl font-black italic tracking-tighter text-white">{college.students.toLocaleString()}</span>
                         <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                         </div>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Node Reach Flux</p>
                      <span className="inline-block text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">{college.growth} Yield Intensity</span>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Regional Status Hub */}
      <Card className="border border-slate-800 shadow-3xl rounded-[4rem] bg-slate-900 text-white p-16 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[180px] rounded-full -mr-40 -mt-40 group-hover:bg-indigo-600/20 transition-colors duration-1000" />
         <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
         
         <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-16">
            <div className="space-y-8 max-w-2xl text-center xl:text-left">
               <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)] animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-indigo-300 italic">Geospatial Relay Feed Alpha</span>
               </div>
               <h2 className="text-6xl font-black italic tracking-tighter leading-none uppercase">
                  Mapping the <br/> Next <span className="text-indigo-400 underline decoration-indigo-400/20 underline-offset-[12px] decoration-8 font-black">Generation.</span>
               </h2>
               <p className="text-slate-400 font-medium leading-relaxed text-lg max-w-xl">
                  Your influence matrix is currently the highest density node in the Southern Relay. Deploy subsequent tracking protocols to unlock Northern territories and escalate tier credentials.
               </p>
               <div className="flex flex-wrap justify-center xl:justify-start gap-6">
                  <div className="bg-slate-950/80 border border-white/5 px-8 py-6 rounded-[2.5rem] backdrop-blur-xl space-y-2 shadow-2xl">
                     <span className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Institution Nodes</span>
                     <span className="text-3xl font-black italic tracking-tighter text-white uppercase">{colleges.length} Flagship Nodes</span>
                  </div>
                  <div className="bg-slate-950/80 border border-white/5 px-8 py-6 rounded-[2.5rem] backdrop-blur-xl space-y-2 shadow-2xl">
                     <span className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Aggregate Node Flow</span>
                     <span className="text-3xl font-black italic tracking-tighter text-indigo-400 uppercase">8.5k Signals</span>
                  </div>
               </div>
            </div>
            
            <div className="shrink-0 relative">
               <div className="absolute inset-0 bg-indigo-500/30 blur-[100px] opacity-20" />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                 className="relative w-80 h-80 border-[0.5px] border-white/10 rounded-full flex items-center justify-center p-4 shadow-[0_0_50px_rgba(99,102,241,0.05)]"
               >
                  <div className="w-64 h-64 border border-indigo-400/20 rounded-full flex items-center justify-center shadow-inner">
                     <div className="w-44 h-44 border border-indigo-400/40 rounded-full flex items-center justify-center bg-indigo-500/5 backdrop-blur-3xl">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="relative"
                        >
                           <Zap className="h-16 w-16 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                        </motion.div>
                     </div>
                  </div>
                  {[0, 90, 180, 270].map((angle, i) => (
                    <div 
                      key={angle}
                      className="absolute w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_25px_rgba(129,140,248,1)] border-2 border-white/20"
                      style={{ 
                        transform: `rotate(${angle}deg) translateY(-161px)`
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 border-[4px] border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin duration-[10s]" />
               </motion.div>
            </div>
         </div>
      </Card>
    </div>
  );
}
