import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface FunnelData {
  clicks: number;
  registrations: number;
  participations: number;
  completions: number;
}

export const FunnelChart: React.FC<{ data: FunnelData | null }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const stages = [
      { label: 'Network Hits', value: Number(data.clicks) || 0, color: '#818cf8', icon: '📡' },
      { label: 'Protocol Entry', value: Number(data.registrations) || 0, color: '#c084fc', icon: '🔑' },
      { label: 'Active Signals', value: Number(data.participations) || 0, color: '#fb7185', icon: '⚡' },
      { label: 'Closed Loops', value: Number(data.completions) || 0, color: '#34d399', icon: '🏁' }
    ];

    const width = 600;
    const height = 450;
    const margin = { top: 40, right: 100, bottom: 40, left: 160 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Definitions for gradients and filters
    const defs = svg.append('defs');
    
    stages.forEach((s, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `funnel-gradient-${i}`)
        .attr('x1', '0%').attr('x2', '100%')
        .attr('y1', '0%').attr('y2', '0%');
      
      gradient.append('stop').attr('offset', '0%').attr('stop-color', s.color).attr('stop-opacity', 0.1);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', s.color).attr('stop-opacity', 0.6);

      const glow = defs.append('filter')
        .attr('id', `glow-${i}`)
        .attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
      
      glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
      const feMerge = glow.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    const stageHeight = chartHeight / stages.length;

    const getX = (val: number, isBottom: boolean, i: number) => {
      const maxVal = stages[0].value || 1;
      const prevVal = i > 0 ? stages[i-1].value : stages[0].value;
      const currentVal = isBottom ? val : prevVal;
      const w = (currentVal / maxVal) * chartWidth;
      return (chartWidth - Math.max(20, w)) / 2;
    };

    const funnelStages = g.selectAll('.stage')
      .data(stages)
      .enter()
      .append('g')
      .attr('class', 'stage');

    // Draw paths with elastic entrance
    funnelStages.append('path')
      .attr('d', (d, i) => {
        const y0 = i * stageHeight;
        const x0_top = getX(d.value, false, i);
        const x1_top = chartWidth - x0_top;
        return `M${x0_top},${y0} L${x1_top},${y0} L${x1_top},${y0} L${x0_top},${y0} Z`;
      })
      .attr('fill', (d, i) => `url(#funnel-gradient-${i})`)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.9)
      .style('cursor', 'pointer')
      .transition()
      .duration(1500)
      .delay((d, i) => i * 150)
      .ease(d3.easeElasticOut.amplitude(1.1))
      .attr('d', (d, i) => {
        const y0 = i * stageHeight;
        const y1 = (i + 1) * stageHeight - 4; // Gap between segments
        const x0_top = getX(d.value, false, i);
        const x1_top = chartWidth - x0_top;
        const x0_bottom = getX(d.value, true, i);
        const x1_bottom = chartWidth - x0_bottom;
        return `M${x0_top},${y0} L${x1_top},${y0} L${x1_bottom},${y1} L${x0_bottom},${y1} Z`;
      });

    // Label Text
    funnelStages.append('text')
      .attr('x', -30)
      .attr('y', (d, i) => (i + 0.5) * stageHeight)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('font-weight', '900')
      .attr('text-transform', 'uppercase')
      .attr('letter-spacing', '0.25em')
      .style('font-family', 'Space Grotesk, sans-serif')
      .text(d => d.label)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .delay((d, i) => 1000 + i * 100)
      .attr('opacity', 1);

    // Value Text
    funnelStages.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', (d, i) => (i + 0.5) * stageHeight)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', '900')
      .attr('font-style', 'italic')
      .style('font-family', 'Space Grotesk, sans-serif')
      .text(d => d.value.toLocaleString())
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .delay((d, i) => 1200 + i * 100)
      .attr('opacity', 1);

    // Drop-off Annotations
    stages.forEach((s, i) => {
      if (i === 0) return;
      const prev = stages[i-1];
      const dropOff = prev.value > 0 
        ? ((prev.value - s.value) / prev.value * 100).toFixed(1)
        : "0.0";
      
      const g_drop = g.append('g')
        .attr('opacity', 0)
        .attr('transform', `translate(${chartWidth + 20}, ${i * stageHeight})`);

      g_drop.append('text')
        .attr('fill', '#ef4444')
        .attr('font-size', '9px')
        .attr('font-weight', '900')
        .attr('letter-spacing', '0.1em')
        .text(`▼ ${dropOff}% DROPOFF`);

      g_drop.transition()
        .duration(1000)
        .delay(2000 + i * 150)
        .attr('opacity', 1);
    });

  }, [data]);

  return (
    <div className="flex flex-col items-center w-full">
      <svg 
        ref={svgRef} 
        viewBox="0 0 600 450" 
        className="w-full max-w-[600px] h-auto overflow-visible drop-shadow-[0_0_30px_rgba(129,140,248,0.1)]" 
      />
    </div>
  );
};
