import { useEffect, useRef, useState, memo, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import './CobwebGraph.css';

/**
 * Cobweb of Dependencies Viewer
 * Haunted, thematic dependency visualization
 * Optimized for performance with memo and limited nodes
 */
const CobwebGraph = memo(function CobwebGraph({ dependencies = [], onNodeClick }) {
  // Limit nodes for performance (max 50)
  const limitedDeps = useMemo(() => 
    dependencies.slice(0, 50), 
    [dependencies]
  );
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [callChain, setCallChain] = useState([]);

  useEffect(() => {
    if (!svgRef.current || limitedDeps.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Add cobweb texture filter
    const defs = svg.append('defs');
    
    // Cobweb pattern
    const pattern = defs.append('pattern')
      .attr('id', 'cobweb')
      .attr('width', 20)
      .attr('height', 20)
      .attr('patternUnits', 'userSpaceOnUse');
    
    pattern.append('path')
      .attr('d', 'M0,10 L20,10 M10,0 L10,20')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-width', 0.5);

    // Glow filter for nodes
    const filter = defs.append('filter')
      .attr('id', 'glow');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', 3)
      .attr('result', 'coloredBlur');
    
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create force simulation
    const simulation = d3.forceSimulation(limitedDeps)
      .force('link', d3.forceLink().id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create links from dependencies
    const links = [];
    limitedDeps.forEach(node => {
      if (node.dependencies) {
        node.dependencies.forEach(depId => {
          links.push({
            source: node.id,
            target: depId,
            broken: node.smells > 5 // Torn strands for smelly files
          });
        });
      }
    });

    // Draw cobweb background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#cobweb)')
      .attr('opacity', 0.3);

    // Draw links (cobweb strands)
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('class', d => `cobweb-strand ${d.broken ? 'broken' : ''}`)
      .attr('stroke', d => d.broken ? '#8b0000' : '#39ff14')
      .attr('stroke-width', d => d.broken ? 1 : 2)
      .attr('stroke-opacity', d => d.broken ? 0.3 : 0.5)
      .attr('stroke-dasharray', d => d.broken ? '5,5' : 'none')
      .style('filter', 'url(#glow)');

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(limitedDeps)
      .join('g')
      .attr('class', 'cobweb-node')
      .call(drag(simulation));

    // Node circles
    node.append('circle')
      .attr('r', d => 15 + (d.smells || 0))
      .attr('fill', d => {
        if (d.smells > 10) return '#8b0000'; // Blood red for very smelly
        if (d.smells > 5) return '#ffb86b'; // Orange for smelly
        return '#39ff14'; // Green for clean
      })
      .attr('stroke', '#8b6321')
      .attr('stroke-width', 2)
      .style('filter', 'url(#glow)')
      .style('cursor', 'pointer');

    // Node labels
    node.append('text')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e4e4e4')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

    // Smell indicator
    node.filter(d => d.smells > 0)
      .append('text')
      .text(d => `💀 ${d.smells}`)
      .attr('x', 0)
      .attr('y', -25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ff0040')
      .attr('font-size', '12px')
      .style('pointer-events', 'none');

    // Hover effects
    node.on('mouseenter', function(event, d) {
      setHoveredNode(d);
      
      // Highlight connected nodes
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', 25 + (d.smells || 0))
        .attr('stroke-width', 4);

      // Highlight connected links
      link.attr('stroke-opacity', l => 
        (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1
      );

      // Animate tension on connected strands
      link.filter(l => l.source.id === d.id || l.target.id === d.id)
        .transition()
        .duration(200)
        .attr('stroke-width', 4);
    });

    node.on('mouseleave', function(event, d) {
      setHoveredNode(null);
      
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', 15 + (d.smells || 0))
        .attr('stroke-width', 2);

      link.attr('stroke-opacity', l => l.broken ? 0.3 : 0.5)
        .transition()
        .duration(200)
        .attr('stroke-width', l => l.broken ? 1 : 2);
    });

    // Click to highlight call chain
    node.on('click', function(event, d) {
      setSelectedNode(d);
      onNodeClick?.(d);

      // Find call chain
      const chain = findCallChain(d, dependencies);
      setCallChain(chain);

      // Highlight chain
      link.attr('stroke', l => {
        const inChain = chain.some(c => 
          (c.source === l.source.id && c.target === l.target.id) ||
          (c.source === l.target.id && c.target === l.source.id)
        );
        return inChain ? '#39ff14' : (l.broken ? '#8b0000' : '#39ff14');
      })
      .attr('stroke-width', l => {
        const inChain = chain.some(c => 
          (c.source === l.source.id && c.target === l.target.id) ||
          (c.source === l.target.id && c.target === l.source.id)
        );
        return inChain ? 5 : (l.broken ? 1 : 2);
      })
      .attr('stroke-opacity', l => {
        const inChain = chain.some(c => 
          (c.source === l.source.id && c.target === l.target.id) ||
          (c.source === l.target.id && c.target === l.source.id)
        );
        return inChain ? 1 : 0.2;
      });
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag behavior
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [limitedDeps, onNodeClick]);

  // Find call chain from a node
  const findCallChain = (node, allNodes) => {
    const chain = [];
    const visited = new Set();

    const traverse = (current) => {
      if (visited.has(current.id)) return;
      visited.add(current.id);

      if (current.dependencies) {
        current.dependencies.forEach(depId => {
          chain.push({ source: current.id, target: depId });
          const depNode = allNodes.find(n => n.id === depId);
          if (depNode) traverse(depNode);
        });
      }
    };

    traverse(node);
    return chain;
  };

  return (
    <div className="cobweb-graph-container">
      {/* Header */}
      <div className="cobweb-header">
        <div className="cobweb-title">
          <span className="title-icon">🕸️</span>
          <span className="title-text">COBWEB OF DEPENDENCIES</span>
          <span className="title-subtitle">Forgotten Laboratory Archives</span>
        </div>
        <div className="cobweb-legend">
          <div className="legend-item">
            <div className="legend-dot clean"></div>
            <span>Clean</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot smelly"></div>
            <span>Smelly</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot toxic"></div>
            <span>Toxic</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="cobweb-canvas">
        <svg ref={svgRef}></svg>
        
        {/* Dust particles overlay - reduced for performance */}
        <div className="dust-overlay">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="dust-particle"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Node Info Panel */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            className="node-info-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="panel-header">
              <span className="panel-icon">📜</span>
              <span className="panel-title">{hoveredNode.name}</span>
            </div>
            <div className="panel-content">
              <div className="info-row">
                <span className="info-label">Type:</span>
                <span className="info-value">{hoveredNode.type || 'Function'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Smells:</span>
                <span className={`info-value ${hoveredNode.smells > 5 ? 'danger' : ''}`}>
                  {hoveredNode.smells || 0}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Dependencies:</span>
                <span className="info-value">{hoveredNode.dependencies?.length || 0}</span>
              </div>
              {hoveredNode.description && (
                <div className="info-description">{hoveredNode.description}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Chain Display */}
      <AnimatePresence>
        {selectedNode && callChain.length > 0 && (
          <motion.div
            className="call-chain-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="chain-header">
              <span className="chain-icon">🔗</span>
              <span className="chain-title">Call Chain from {selectedNode.name}</span>
              <button 
                className="chain-close"
                onClick={() => {
                  setSelectedNode(null);
                  setCallChain([]);
                }}
              >
                ✕
              </button>
            </div>
            <div className="chain-content">
              {callChain.map((link, i) => (
                <div key={i} className="chain-link">
                  <span className="chain-source">{link.source}</span>
                  <span className="chain-arrow">→</span>
                  <span className="chain-target">{link.target}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {limitedDeps.length === 0 && (
        <div className="cobweb-empty">
          <div className="empty-icon">🕷️</div>
          <div className="empty-text">No dependencies to visualize</div>
          <div className="empty-hint">Analyze code to see the cobweb</div>
        </div>
      )}
    </div>
  );
});

export default CobwebGraph;
