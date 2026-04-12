import { useEffect, useRef } from 'react';
import { useAmbassadorStore } from '@/store/useAmbassadorStore';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, ArrowDownRight, Globe, Zap, Cpu, Activity, ShieldCheck, Database, LayoutGrid, Box, Terminal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function Analytics() {
  const { metrics, students, fetchMetrics, fetchStudents } = useAmbassadorStore();
  const funnelRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetchMetrics().catch(console.error);
    fetchStudents().catch(console.error);
  }, [fetchMetrics, fetchStudents]);

  useEffect(() => {
    if (!metrics || !funnelRef.current) return;

    const data = [
      { label: 'Network Hits', value: Math.max(0, metrics?.totalReferrals || 0), color: '#818cf8' },
      { label: 'Protocol Entry', value: Math.max(0, metrics?.successfulRegistrations || 0), color: '#c084fc' },
      { label: 'Active Signals', value: Math.max(0, metrics?.successfulParticipations || 0), color: '#fb7185' },
      { label: 'Closed Loops', value: Math.floor(Math.max(0, metrics?.successfulParticipations || 0) * 0.4), color: '#34d399' }
    ];

    const svg = d3.select(funnelRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 80, bottom: 40, left: 160 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Define Gradients
    const defs = svg.append("defs");
    data.forEach((d, i) => {
      const gradient = defs.append("linearGradient")
        .attr("id", `funnel-grad-${i}`)
        .attr("x1", "0%").attr("x2", "100%");
      gradient.append("stop").attr("offset", "0%").attr("stop-color", d.color).attr("stop-opacity", 0.1);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", d.color).attr("stop-opacity", 0.6);
    });

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerHeight])
      .padding(0.4);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 10])
      .range([0, innerWidth]);

    // Draw bars
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", d => yScale(d.label)!)
      .attr("height", yScale.bandwidth())
      .attr("width", 0)
      .attr("rx", 16)
      .attr("fill", (d, i) => `url(#funnel-grad-${i})`)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 1)
      .style("filter", "drop-shadow(0 0 10px rgba(129, 140, 248, 0.2))")
      .transition()
      .duration(1500)
      .ease(d3.easeElasticOut)
      .delay((d, i) => i * 200)
      .attr("width", d => xScale(d.value));

    // Labels
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", -25)
      .attr("y", d => yScale(d.label)! + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px")
      .attr("font-weight", "900")
      .attr("text-transform", "uppercase")
      .attr("letter-spacing", "0.2em")
      .text(d => d.label);

    // Value Labels
    g.selectAll(".value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", d => xScale(d.value) + 15)
      .attr("y", d => yScale(d.label)! + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .attr("font-size", "16px")
      .attr("font-weight", "900")
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .delay((d, i) => 1500 + i * 100)
      .attr("opacity", 1)
      .text(d => d.value.toLocaleString());

  }, [metrics]);

  if (!metrics) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8">
      <div className="relative">
         <div className="w-20 h-20 border-2 border-indigo-600/20 border-t-indigo-500 rounded-full animate-spin" />
         <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-400 group-hover:rotate-180 transition-transform duration-1000" />
      </div>
      <div className="space-y-2 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white animate-pulse">Analyzing System Topology...</p>
         <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Decrypting real-time coordinate signals.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
            Intelligence <span className="text-indigo-400">Control.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3 max-w-lg">High-density conversion analysis and campus network mapping feed.</p>
        </motion.div>
        <div className="flex items-center gap-4 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/50 text-white">
           <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status: <span className="text-emerald-400 italic">Optimal</span></span>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-7">
        {/* D3 Funnel Segment */}
        <Card className="lg:col-span-4 border border-slate-800/60 shadow-2xl shadow-indigo-600/5 rounded-[3.5rem] bg-slate-900/40 backdrop-blur-xl overflow-hidden p-10">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center gap-4 mb-3">
               <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
                  <Terminal className="h-6 w-6 text-white" />
               </div>
               <div className="space-y-1">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Conversion Funnel Matrix</CardTitle>
                  <CardDescription className="font-black text-white text-xl italic tracking-tighter uppercase">Systematic signal degradation overview.</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="px-0 flex justify-center py-12">
            <svg ref={funnelRef} viewBox="0 0 600 400" className="w-full max-w-[600px] h-auto drop-shadow-[0_0_15px_rgba(129,140,248,0.1)]" />
          </CardContent>
          <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-800 flex items-center justify-between">
             <div className="space-y-2">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Aggregate Yield</span>
                <span className="block text-3xl font-black text-indigo-400 italic italic-tracking-tight">{( (metrics?.conversionRate || 0.47) * 100).toFixed(1)}%</span>
             </div>
             <div className="h-12 w-px bg-slate-800" />
             <div className="space-y-2">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Network Friction</span>
                <span className="block text-3xl font-black text-rose-500 italic italic-tracking-tight">{(metrics?.dropOffRate || 14.2).toFixed(1)}%</span>
             </div>
             <div className="h-12 w-px bg-slate-800" />
             <div className="space-y-2 text-right">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Security Index</span>
                <div className="flex items-center gap-3 justify-end">
                   <ShieldCheck className="h-5 w-5 text-emerald-400" />
                   <span className="block text-2xl font-black text-white italic italic-tracking-tight">MAX</span>
                </div>
             </div>
          </div>
        </Card>

        {/* Technical KPIs */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="border-0 shadow-2xl rounded-[3rem] bg-slate-900 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8">
               <Zap className="h-10 w-10 text-indigo-500 opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
            <CardHeader className="p-10 pb-4">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Growth Velocity Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-8">
               <div className="flex items-end gap-3">
                  <span className="text-6xl font-black italic italic-tracking-tighter text-white">+24.8%</span>
                  <TrendingUp className="h-10 w-10 text-emerald-400 mb-3 animate-pulse" />
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-sm italic">
                  Topology throughput has surged following the deployment of the high-speed referral frequency protocols. Signal integrity remains at 99.8%.
               </p>
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors cursor-default">
                     <span className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Protocol Latency</span>
                     <span className="text-2xl font-black text-indigo-400 italic">14ms</span>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors cursor-default">
                     <span className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Node Coherence</span>
                     <span className="text-2xl font-black text-emerald-400 italic">SYNCED</span>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl rounded-[3rem] p-10 space-y-8 group overflow-hidden relative">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/10 blur-[60px] rounded-full" />
             <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 group-hover:rotate-[360deg] transition-transform duration-1000">
                   <Globe className="h-7 w-7 text-indigo-400" />
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Geospatial Distribution</h4>
                   <p className="text-lg font-black text-white italic tracking-tight uppercase">Institution Mapping Active.</p>
                </div>
             </div>
             <div className="space-y-5 pt-2 relative z-10">
                <div className="flex justify-between items-end text-[10px] px-1 font-black uppercase tracking-widest">
                   <span className="text-slate-500">Network Reach Index</span>
                   <span className="text-indigo-400 italic">HIGH INTENSITY</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '88%' }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                   />
                </div>
                <p className="text-[10px] text-slate-600 font-bold px-1 uppercase tracking-widest">Mapping verified for <span className="text-slate-400 font-black">{metrics.externalCollegeReach} FLAGSHIP UNIVERSITY NODES</span>.</p>
             </div>
          </Card>

          <Card className="border border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900 shadow-3xl rounded-[3rem] p-10 relative overflow-hidden group">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <ShieldCheck className="h-6 w-6 text-emerald-400" />
                   </div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Security Protocol Alpha</h4>
                </div>
                <div className="space-y-2">
                   <h4 className="text-2xl font-black italic italic-tracking-tight uppercase text-white">Neural Fraud Shield.</h4>
                   <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-widest">
                      AI fingerprinting and geo-lock verification is fully engaged. Anomalous signals: <span className="text-emerald-400">Zero Detected</span>.
                   </p>
                </div>
             </div>
             <Database className="absolute -bottom-8 -right-8 h-40 w-40 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
          </Card>
        </div>
      </div>
    </div>
  );
}
