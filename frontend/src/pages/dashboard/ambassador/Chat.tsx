import { useState, useEffect, useRef } from 'react';
import { useAmbassadorStore } from '@/store/useAmbassadorStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare, Users, ShieldCheck, Zap, Activity, Globe, Lock, Radio, Terminal, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function Chat() {
  const { chatMessages = [], fetchChatHistory, sendChatMessage } = useAmbassadorStore();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatHistory('global').catch(console.error);
    const interval = setInterval(() => fetchChatHistory('global').catch(console.error), 3000);
    return () => clearInterval(interval);
  }, [fetchChatHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendChatMessage('global', message);
    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[600px] flex gap-10">
      {/* Sidebar Connections */}
      <div className="hidden lg:flex flex-col w-80 gap-8">
         <Card className="border border-slate-800 shadow-3xl rounded-[3.5rem] bg-slate-900 overflow-hidden group flex flex-col h-full relative">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <Radio className="h-32 w-32 text-indigo-500 animate-pulse" />
            </div>
            <CardContent className="p-10 space-y-10 flex-1 relative z-10">
               <div className="space-y-3">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white">Active <br/><span className="text-indigo-400">Node Hub.</span></h3>
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Global coordinator frequency active.</p>
               </div>

               <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between group/hub cursor-pointer hover:bg-indigo-500/20 transition-all duration-300">
                     <div className="flex items-center gap-4">
                        <Users className="h-5 w-5 text-indigo-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-white group-hover:italic transition-all">Global Comms</span>
                     </div>
                     <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse" />
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between opacity-30 grayscale cursor-not-allowed">
                     <div className="flex items-center gap-4">
                        <Globe className="h-5 w-5 text-slate-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Regional West</span>
                     </div>
                     <Lock className="h-4 w-4 text-slate-700" />
                  </div>
               </div>

               <div className="pt-10 border-t border-slate-800">
                  <div className="flex items-center gap-5 px-2">
                     <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner group-hover:border-indigo-500/30 transition-colors">
                        <ShieldCheck className="h-6 w-6 text-indigo-400" />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Encrypted Status</h4>
                        <p className="text-sm font-black italic text-white tracking-widest uppercase">STREAM SECURE</p>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Main Chat Deck */}
      <div className="flex-1 flex flex-col min-w-0">
        <Card className="flex-1 flex flex-col border border-slate-800 shadow-3xl rounded-[4rem] overflow-hidden bg-slate-900/40 backdrop-blur-xl relative group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20" />
          
          <CardHeader className="p-10 border-b border-slate-800 bg-slate-900/50 flex flex-row items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 border border-white/10 group-hover:rotate-12 transition-transform duration-700">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Ambassador <span className="text-indigo-400">Connect.</span></CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 flex items-center gap-3">
                  <span className="flex gap-1">
                     <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" />
                     <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce delay-100" />
                     <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce delay-200" />
                  </span>
                   Live COORDINATOR BROADCAST
                </CardDescription>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 bg-slate-950 border border-slate-800 px-6 py-3 rounded-full shadow-2xl overflow-hidden relative group/btn">
               <div className="absolute inset-0 bg-indigo-500/5 group-hover/btn:bg-indigo-500/10 transition-colors" />
               <Wifi className="h-4 w-4 text-indigo-400 relative z-10" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 relative z-10">Frequency: <span className="text-indigo-400 italic">424 MHZ</span></span>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden relative bg-slate-950/20">
            <ScrollArea className="h-full p-10 px-12">
              <div className="space-y-12 pb-6">
                {chatMessages.length === 0 && (
                  <div className="h-[300px] flex flex-col items-center justify-center space-y-6 opacity-30 group-hover:opacity-50 transition-opacity">
                    <div className="relative">
                       <Box className="h-16 w-16 text-indigo-400" />
                       <div className="absolute inset-0 bg-indigo-500/20 blur-[30px] rounded-full" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 text-center leading-relaxed italic">
                       Communication Protocol Handshake Successful.<br/>Awaiting incoming encrypted coordinate signals.
                    </p>
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {chatMessages.map((msg, i) => (
                    <motion.div 
                      key={msg.id || i}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`flex gap-6 ${msg.sender?.role === 'ADMIN' ? 'justify-start' : 'justify-end'}`}
                    >
                      {msg.sender?.role === 'ADMIN' && (
                        <div className="relative self-end mb-2">
                           <Avatar className="h-14 w-14 border-2 border-indigo-500/30 bg-slate-950 shadow-2xl">
                             <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender?.name || 'Admin'}`} />
                             <AvatarFallback className="font-black bg-slate-900 text-white uppercase italic">AD</AvatarFallback>
                           </Avatar>
                           <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg" />
                        </div>
                      )}
                      <div className={`flex flex-col ${msg.sender?.role === 'ADMIN' ? 'items-start' : 'items-end'} max-w-[75%] group/msg`}>
                        <div className="flex items-center gap-3 mb-2 px-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{msg.sender?.name || 'User'}</span>
                          <span className="text-[9px] font-black text-slate-600 font-mono italic tracking-tighter opacity-0 group-hover/msg:opacity-100 transition-opacity">{msg.createdAt ? format(new Date(msg.createdAt), 'HH:mm') : '--:--'}</span>
                        </div>
                        <div className={`p-6 px-8 rounded-[3rem] text-sm font-bold shadow-2xl leading-relaxed transition-all duration-300 ${
                          msg.sender?.role === 'ADMIN' 
                            ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none hover:border-indigo-500/30' 
                            : 'bg-indigo-600/90 text-white rounded-br-none shadow-indigo-600/20 border border-white/10 hover:bg-indigo-600'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                      {msg.sender?.role !== 'ADMIN' && (
                        <div className="self-end mb-2 p-3 bg-slate-950/80 border border-indigo-500/20 rounded-2xl shadow-2xl group-hover:border-indigo-500/50 transition-colors">
                           <ShieldCheck className="h-4 w-4 text-indigo-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <div className="p-10 pt-0 shrink-0 relative z-10 mt-6 md:mt-0">
            <form onSubmit={handleSend} className="relative group/input">
              <div className="absolute inset-0 bg-indigo-600/10 blur-[40px] opacity-0 group-hover/input:opacity-100 transition-opacity" />
              <Input
                placeholder="Secure transmission entry point..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-24 pl-10 pr-28 rounded-[3rem] bg-slate-950/80 border border-slate-800/80 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-500/50 placeholder:text-slate-600 font-black italic tracking-tight transition-all text-xl shadow-3xl text-white relative z-10"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!message.trim()}
                className="absolute right-4 top-4 h-16 w-16 rounded-[2.2rem] bg-white text-slate-900 hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-3xl shadow-indigo-900/40 group-hover/input:scale-105 z-20 border-0"
              >
                <Send className="h-6 w-6" />
              </Button>
            </form>
            <div className="flex items-center justify-between px-10 mt-4">
               <div className="flex items-center gap-2">
                  <Terminal className="h-3 w-3 text-slate-700" />
                  <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-700">Protocol: HTTPS/WSS READY</span>
               </div>
               <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3 text-emerald-900/50" />
                  <span className="text-[7px] font-black uppercase tracking-[0.3em] text-emerald-900/50">End-to-End Encryption Engaged</span>
               </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
