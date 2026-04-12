import React, { useEffect } from 'react';
import { useAmbassadorStore } from '@/store/useAmbassadorStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Share2, ArrowUpRight, Target, Zap, Activity, Radio, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const AssignedEvents: React.FC = () => {
  const { assignedEvents, fetchAssignedEvents } = useAmbassadorStore();

  useEffect(() => {
    fetchAssignedEvents();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
            Promotion <span className="text-indigo-400">Deck.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3 max-w-lg">High-priority tactical campaigns assigned for targeted campus outreach and network Escalation.</p>
        </motion.div>
        
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-6 py-4 rounded-3xl shadow-2xl">
           <Target className="h-5 w-5 text-rose-400 animate-pulse" />
           <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Mission Queue</span>
              <span className="text-sm font-black text-white italic tracking-widest">{assignedEvents.length} ACTIVE CAMPAIGNS</span>
           </div>
        </div>
      </header>

      <div className="flex items-center justify-between px-6 mb-2">
         <div className="flex items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">Campaign Intelligence Feed</h2>
            <div className="h-px w-20 bg-slate-800" />
         </div>
         <div className="flex items-center gap-3 py-2 px-5 bg-slate-900 rounded-full border border-slate-800">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Signal Locked</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <AnimatePresence>
          {assignedEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 shadow-3xl rounded-[3.5rem] overflow-hidden group hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-700 relative">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-6 left-10 right-10 flex items-end justify-between">
                    <div className="space-y-3">
                      <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-1.5 rounded-full font-black italic tracking-[0.1em] text-[9px] uppercase shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                        Priority Level: Alpha
                      </Badge>
                      <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{event.title}</h3>
                    </div>
                  </div>
                  <div className="absolute top-6 right-8">
                     <div className="w-12 h-12 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl">
                        <Zap className="h-6 w-6 text-amber-400 animate-pulse" />
                     </div>
                  </div>
                </div>
                
                <CardContent className="p-10 space-y-8 relative z-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                          <Calendar className="h-4 w-4 text-indigo-400/50" /> Mission Start
                       </span>
                       <p className="text-xl font-black text-white italic tracking-tighter uppercase">
                          {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                       </p>
                    </div>
                    <div className="space-y-2">
                       <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                          <Users className="h-4 w-4 text-emerald-400/50" /> Node Threshold
                       </span>
                       <p className="text-xl font-black text-white italic tracking-tighter uppercase">
                          {event.maxParticipants || 500} SLOTS REMAINING
                       </p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-800/60">
                    <Button className="flex-1 h-18 rounded-[2rem] bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px] gap-4 shadow-3xl shadow-indigo-900/40 transition-all border-0 group/btn">
                      <Share2 className="h-5 w-5 group-hover/btn:scale-125 transition-transform" /> Acquire Referral Key
                    </Button>
                    <Button variant="outline" className="w-18 h-18 rounded-[2rem] border-slate-800 bg-slate-950/50 hover:bg-slate-900 hover:border-indigo-500/30 transition-all text-slate-500 hover:text-white">
                      <ArrowUpRight className="h-6 w-6" />
                    </Button>
                  </div>
                </CardContent>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {assignedEvents.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 space-y-8"
        >
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-10" />
             <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[3rem] flex items-center justify-center mx-auto relative z-10 shadow-3xl">
                <Box className="h-10 w-10 text-slate-700" />
             </div>
          </div>
          <div className="space-y-4">
             <p className="text-2xl font-black text-white italic tracking-tighter uppercase">Mission Queue Depleted.</p>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 max-w-sm mx-auto leading-relaxed">
                All assigned tactical campaigns have been cleared. Protocol awaiting fresh telemetry from high-command nodes.
             </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AssignedEvents;
