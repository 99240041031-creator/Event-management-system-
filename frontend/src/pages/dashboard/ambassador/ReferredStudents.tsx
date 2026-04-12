import React, { useEffect } from 'react';
import { useAmbassadorStore } from '@/store/useAmbassadorStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, CheckCircle2, Clock, Globe, ShieldCheck, Zap, Activity, Radio, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReferredStudents: React.FC = () => {
  const { students, fetchStudents, isLoading } = useAmbassadorStore();

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
            Tracked <span className="text-indigo-400">Personnel.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3 max-w-lg">Real-time status tracking of all referred student nodes within your influence matrix.</p>
        </motion.div>
        
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-6 py-4 rounded-3xl shadow-2xl">
           <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
           <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Live Intake</span>
              <span className="text-sm font-black text-white italic tracking-widest">{students.length} VERIFIED NODES</span>
           </div>
        </div>
      </header>

      <div className="flex items-center justify-between px-6 mb-2">
         <div className="flex items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">Global Personnel Log</h2>
            <div className="h-px w-20 bg-slate-800" />
         </div>
         <Button variant="ghost" className="h-10 rounded-xl bg-slate-900 border border-slate-800 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all gap-2">
            <Filter className="h-3 w-3" /> Tactical Filter
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {students.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 shadow-2xl rounded-[3rem] overflow-hidden hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-500 group relative">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                   <User className="h-20 w-20 text-indigo-400" />
                </div>
                
                <CardContent className="p-10 relative z-10">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="relative">
                       <div className="h-20 w-20 rounded-[2.5rem] bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-all duration-500 shadow-inner overflow-hidden">
                          <Avatar className="h-full w-full rounded-none">
                             <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${student.userEmail}`} className="object-cover" />
                             <AvatarFallback className="bg-slate-950 text-indigo-400 font-black text-xl italic">
                                {student.studentName?.charAt(0) || 'U'}
                             </AvatarFallback>
                          </Avatar>
                       </div>
                       <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-xl border-4 border-slate-900 flex items-center justify-center ${
                          student.status === 'PARTICIPATED' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700'
                       }`}>
                          {student.status === 'PARTICIPATED' ? <CheckCircle2 className="h-3 w-3 text-white" /> : <Clock className="h-3 w-3 text-white" />}
                       </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-white italic tracking-tighter uppercase truncate leading-tight group-hover:text-indigo-400 transition-colors">
                        {student.studentName || student.userEmail.split('@')[0]}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 truncate mt-1">{student.userEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-slate-800/50 mt-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-400/50" /> Initial Sync
                      </span>
                      <span className="text-slate-300">
                        {new Date(student.referredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span className="flex items-center gap-2">
                        <Radio className="h-4 w-4 text-emerald-400/50" /> Intake Status
                      </span>
                      <Badge className={`rounded-xl border-0 font-black italic tracking-widest uppercase text-[9px] px-3 py-1 ${
                        student.status === 'PARTICIPATED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                          : 'bg-slate-800/50 text-slate-500'
                      }`}>
                        {student.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.32em]">Campaign Origin</span>
                       <Zap className="h-3 w-3 text-indigo-400" />
                    </div>
                    <p className="text-sm font-black text-white italic tracking-tighter mt-1 uppercase">
                       {student.campaignName || "Global Outreach Node"}
                    </p>
                  </div>
                </CardContent>
                
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-50" />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {students.length === 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 space-y-8"
        >
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-20" />
             <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto relative z-10">
                <Users className="h-10 w-10 text-slate-700" />
             </div>
          </div>
          <div className="space-y-4">
             <p className="text-xl font-black text-white italic tracking-tighter uppercase italic-tracking-tight">Influence Matrix Empty.</p>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 max-w-sm mx-auto leading-relaxed">
                Deploy your encrypted referral link to start archiving student nodes within your command sector.
             </p>
          </div>
          <Button className="h-14 rounded-2xl bg-indigo-600 hover:bg-white hover:text-indigo-600 font-black uppercase tracking-widest text-[10px] px-10 shadow-2xl transition-all">
             INITIATE DEPLOYMENT
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ReferredStudents;
