import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  rank: number;
  students?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export const NetworkGraph: React.FC<{ data: GraphData | null }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 800;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Define Filters and Gradients
    const defs = svg.append('defs');

    // Glow Filter
    const filter = defs.append('filter')
      .attr('id', 'node-glow')
      .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    // Link Gradient
    const linkGradient = defs.append('linearGradient')
      .attr('id', 'link-gradient')
      .attr('gradientUnits', 'userSpaceOnUse');
    linkGradient.append('stop').attr('offset', '0%').attr('stop-color', '#6366f1').attr('stop-opacity', 0.2);
    linkGradient.append('stop').attr('offset', '100%').attr('stop-color', '#a855f7').attr('stop-opacity', 0.8);

    const nodes = data.nodes || [];
    const links = data.links || [];

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    // Links with directional glow
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', 'url(#link-gradient)')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', d => Math.max(1, Math.sqrt(d.value || 1) * 2))
      .attr('stroke-dasharray', '8,4');

    // Link Particle Effect (Animated)
    const particles = svg.append('g')
      .selectAll('circle')
      .data(links)
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('fill', '#fff')
      .attr('filter', 'url(#node-glow)');

    const node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // The Node Circle (Holographic Style)
    node.append('circle')
      .attr('r', d => 12 + (d.rank || 1) * 4)
      .attr('fill', d => d.rank > 2 ? '#f472b6' : '#6366f1')
      .attr('fill-opacity', 0.2)
      .attr('stroke', d => d.rank > 2 ? '#f472b6' : '#818cf8')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#node-glow)');

    node.append('circle')
      .attr('r', 4)
      .attr('fill', '#fff')
      .attr('filter', 'url(#node-glow)');

    // Labels
    node.append('text')
      .text(d => d.name)
      .attr('font-size', '10px')
      .attr('font-weight', '900')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('dy', d => -20 - (d.rank || 1) * 4)
      .attr('text-transform', 'uppercase')
      .attr('letter-spacing', '0.1em')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.5)');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);

      // Animate particles along links
      particles
        .attr('cx', (d, i) => {
          const t = (Date.now() / 2000 + i * 0.2) % 1;
          return (d.source as any).x + ((d.target as any).x - (d.source as any).x) * t;
        })
        .attr('cy', (d, i) => {
          const t = (Date.now() / 2000 + i * 0.2) % 1;
          return (d.source as any).y + ((d.target as any).y - (d.source as any).y) * t;
        });
    });

    // Handle Animation Loop for particles
    const t = d3.timer(() => {
        simulation.tick();
    });

    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => t.stop();
  }, [data]);

  return (
    <div className="bg-slate-950/20 rounded-[3rem] border border-slate-800/50 p-6 overflow-hidden relative shadow-inner">
      <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
      <svg ref={svgRef} width="100%" height="500" viewBox="0 0 800 500" className="relative z-10" />
    </div>
  );
};
