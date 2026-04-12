import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventApi } from '@/lib/api';
import { toast } from 'sonner';
import { ShieldCheck, Zap, Target, Box, Terminal, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (data: any) => Promise<void>;
}

export function CreateCampaignModal({ isOpen, onClose, onCreated }: CreateCampaignModalProps) {
  const [name, setName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [eventId, setEventId] = useState<string>('none');
  const [events, setEvents] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadEvents = async () => {
        try {
          const fetchedEvents = await eventApi.getAll();
          setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
        } catch (error) {
          console.error("Failed to fetch events:", error);
        }
      };
      loadEvents();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Protocol entry requires a valid campaign identity.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreated({
        name,
        targetAudience,
        eventId: eventId === 'none' ? null : eventId
      });
      toast.success("Intelligence signature successfully deployed to the matrix.");
      onClose();
      // Reset
      setName('');
      setTargetAudience('');
      setEventId('none');
    } catch (error) {
      toast.error("Uplink failed. Monitoring system anomalies.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-slate-800 text-white max-w-xl rounded-[4rem] p-0 overflow-hidden shadow-3xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[120px] -mr-32 -mt-32" />
        
        <DialogHeader className="p-12 pb-8 border-b border-slate-800 bg-slate-950/40 relative z-10">
          <div className="flex items-center gap-5 mb-4">
             <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-600/10">
                <Target className="h-6 w-6 text-indigo-400 animate-pulse" />
             </div>
             <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Initialize <span className="text-indigo-400">Protocol.</span></DialogTitle>
          </div>
          <DialogDescription className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 italic max-w-sm">
             Deploy a unique intelligence signature across the campus matrix to track secondary node expansion.
          </DialogDescription>
        </DialogHeader>

        <div className="p-12 space-y-10 relative z-10 bg-slate-900/40">
           <div className="space-y-8">
              <div className="space-y-3">
                 <Label htmlFor="target-name" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4 italic">Campaign Identity</Label>
                 <Input 
                   id="target-name"
                   placeholder="e.g. ALPHA-RECRUIT-SRM" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="h-18 px-10 rounded-[2rem] bg-slate-950/80 border border-slate-800/80 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-500/50 placeholder:text-slate-700 font-black italic tracking-tight transition-all text-lg text-white shadow-inner"
                 />
              </div>

              <div className="space-y-3">
                 <Label htmlFor="event-select" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4 italic">Target Sector (Event)</Label>
                 <Select value={eventId} onValueChange={setEventId}>
                   <SelectTrigger className="h-18 px-10 rounded-[2rem] bg-slate-950/80 border border-slate-800/80 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-500/50 font-black italic tracking-tight text-lg text-white shadow-inner">
                     <SelectValue placeholder="Select target node" />
                   </SelectTrigger>
                   <SelectContent className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden text-white backdrop-blur-xl">
                     <SelectItem value="none" className="focus:bg-indigo-600 focus:text-white py-4 font-black">Global Platform Matrix</SelectItem>
                     {events.map((event) => (
                       <SelectItem key={event.id} value={event.id} className="focus:bg-indigo-600 focus:text-white py-4 font-black">
                         {event.title.toUpperCase()}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
              </div>

              <div className="space-y-3">
                 <Label htmlFor="audience-target" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4 italic">Audience Topology</Label>
                 <Input 
                   id="audience-target"
                   placeholder="e.g. 2nd Year BioTech Nodes" 
                   value={targetAudience}
                   onChange={(e) => setTargetAudience(e.target.value)}
                   className="h-18 px-10 rounded-[2rem] bg-slate-950/80 border border-slate-800/80 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-500/50 placeholder:text-slate-700 font-black italic tracking-tight transition-all text-lg text-white shadow-inner"
                 />
              </div>
           </div>

           <div className="flex gap-4 pt-4 border-t border-slate-800">
              <Button 
                variant="ghost" 
                onClick={onClose} 
                disabled={isSubmitting}
                className="flex-1 h-20 rounded-[2.5rem] bg-slate-950 border border-slate-800 text-slate-500 hover:text-white font-black uppercase tracking-widest text-xs transition-all"
              >
                 Abort Cycle
              </Button>
              <Button 
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="flex-[2] h-20 rounded-[2.5rem] bg-white text-slate-900 hover:bg-indigo-600 hover:text-white font-black uppercase tracking-[0.2em] text-xs shadow-3xl shadow-indigo-900/40 transition-all border-0 gap-4 group/btn overflow-hidden relative"
              >
                 <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                 {isSubmitting ? (
                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                       Uplinking...
                    </div>
                 ) : (
                    <>
                       Authorize Deployment <ArrowUpRight className="h-5 w-5 group-hover/btn:-translate-y-1 transition-transform" />
                    </>
                 )}
              </Button>
           </div>
           
           <div className="flex items-center justify-center gap-3 opacity-30 mt-4">
              <Box className="h-3 w-3" />
              <span className="text-[7px] font-black uppercase tracking-[0.5em]">Sector Verified • Protocol Alpha</span>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
