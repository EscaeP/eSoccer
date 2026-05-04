import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ANALYSIS_DATA } from '../data/analysis';
import { Maximize } from 'lucide-react';

export function DataAnalysis() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous details if any
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", [0, 0, width, height]);

    const innerG = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        innerG.attr("transform", event.transform);
      });
    
    zoomRef.current = zoom;
    svg.call(zoom);

    // Setup defs for markers (arrows)
    svg.append("defs").selectAll("marker")
      .data(["win", "draw"])
      .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25) // push arrow away from node center
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
          .attr("fill", d => d === 'win' ? '#10b981' : '#94a3b8')
          .attr("d", "M0,-5L10,0L0,5");

    // Copy data to avoid mutating the original
    const nodes = ANALYSIS_DATA.nodes.map(d => Object.create(d));
    const links = ANALYSIS_DATA.links.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => (d as any).id).distance(150))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Links container
    const linkContainer = innerG.append("g")
      .attr("stroke-opacity", 0.6);

    const linkPaths = linkContainer.selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke", (d: any) => d.type === 'win' ? '#10b981' : d.type === 'future' ? '#334155' : '#94a3b8')
      .attr("stroke-width", (d: any) => d.type === 'future' ? 1 : 2)
      .attr("stroke-dasharray", (d: any) => d.type === 'future' ? '5,5' : 'none')
      .attr("fill", "none")
      .attr("marker-end", (d: any) => d.type === 'win' ? `url(#arrow-win)` : null);

    // Nodes container
    const nodeContainer = innerG.append("g");

    const nodeGroups = nodeContainer.selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Outer circles
    nodeGroups.append("circle")
      .attr("r", 25)
      .attr("fill", (d: any) => {
        if (d.group === 'win') return '#064e3b';
        if (d.group === 'loss') return '#4c0519';
        if (d.group === 'neutral') return '#0f172a';
        return '#1e293b';
      })
      .attr("stroke", (d: any) => {
        if (d.group === 'win') return '#34d399';
        if (d.group === 'loss') return '#fb7185';
        if (d.group === 'neutral') return '#475569';
        return '#94a3b8';
      })
      .attr("stroke-width", 3)
      .attr("class", "transition-colors duration-300");

    // Text (initials or full name depending on size)
    nodeGroups.append("text")
      .text((d: any) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("fill", "#f8fafc")
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .attr("class", "pointer-events-none select-none");

    const linkLabelBackgrounds = innerG.append("g")
      .selectAll("rect")
      .data(links.filter((d: any) => d.type !== 'future'))
      .join("rect")
      .attr("fill", "#0f172a")
      .attr("rx", 4)
      .attr("ry", 4);

    const linkLabelsText = innerG.append("g")
      .selectAll("text")
      .data(links.filter((d: any) => d.type !== 'future'))
      .join("text")
      .attr("font-size", 12)
      .attr("fill", "#cbd5e1")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("class", "pointer-events-none select-none")
      .text((d: any) => d.label);

    simulation.on("tick", () => {
      linkPaths.attr("d", d => {
        // Calculate curve or straight line, ensure source and target are on circumference, not center
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist === 0) return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
        
        // Push arrow outside of node radius (25) + some padding
        const targetPadding = d.type === 'win' ? 32 : 25; // larger padding if arrow
        const sourcePadding = 25;

        const nx = dx / dist;
        const ny = dy / dist;

        const startX = d.source.x + nx * sourcePadding;
        const startY = d.source.y + ny * sourcePadding;
        const endX = d.target.x - nx * targetPadding;
        const endY = d.target.y - ny * targetPadding;

        return `M${startX},${startY} L${endX},${endY}`;
      });

      linkLabelsText
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

      linkLabelBackgrounds
        .attr("x", d => (d.source.x + d.target.x) / 2 - 16)
        .attr("y", d => (d.source.y + d.target.y) / 2 - 10)
        .attr("width", 32)
        .attr("height", 20);

      nodeGroups.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, []);

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(750).call(zoomRef.current.transform, d3.zoomIdentity);
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 p-4 md:p-8 flex flex-col">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 flex items-center gap-2 md:gap-3">
            <span className="w-2 h-6 md:h-8 bg-indigo-500 rounded-full inline-block"></span>
            赛事数据分析
          </h2>
          <p className="text-xs md:text-base text-slate-400 mt-1 md:mt-2 ml-4 md:ml-5">近场次胜负关系图谱 (支持缩放与拖动节点)</p>
        </div>
      </div>
      
      <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative" ref={containerRef}>
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 bg-slate-950/80 backdrop-blur p-2 sm:p-3 rounded-lg border border-slate-800 pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#064e3b] border-2 border-[#34d399]"></span>
              <span className="text-xs font-bold text-slate-300">胜者</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#4c0519] border-2 border-[#fb7185]"></span>
              <span className="text-xs font-bold text-slate-300">败者</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1e293b] border-2 border-[#94a3b8]"></span>
              <span className="text-xs font-bold text-slate-300">平局</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0f172a] border-2 border-[#475569] border-dashed"></span>
              <span className="text-xs font-bold text-slate-400">未赛</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleResetZoom}
          className="absolute top-4 right-4 z-10 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 flex items-center gap-2 rounded-lg border border-slate-700 shadow-md transition-colors pointer-events-auto cursor-pointer"
          title="居中显示并还原大小"
        >
          <Maximize size={16} />
          <span className="text-xs font-bold">展现全图</span>
        </button>

        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" style={{ width: '100%', height: '100%' }}></svg>
      </div>
    </div>
  );
}
