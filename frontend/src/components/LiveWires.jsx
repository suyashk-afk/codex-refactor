import { useEffect, useState } from 'react';
import './LiveWires.css';

/**
 * Electro-Neural Live Wires Component
 * Reactive animated pipelines that respond to app activity
 * Theme: Frankenstein laboratory wiring + unstable energy flow
 */
export default function LiveWires({ isActive, hasError, activityLevel = 'idle' }) {
  const [pulses, setPulses] = useState([]);
  const [sparkPositions, setSparkPositions] = useState([]);

  // OPTIMIZED: Reduced spark generation
  useEffect(() => {
    if (isActive && activityLevel === 'high') {
      const interval = setInterval(() => {
        const newSpark = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
        };
        setSparkPositions(prev => {
          // Limit to max 3 sparks at once
          if (prev.length >= 3) return prev;
          return [...prev, newSpark];
        });
        
        // Remove spark after animation
        setTimeout(() => {
          setSparkPositions(prev => prev.filter(s => s.id !== newSpark.id));
        }, 1500);
      }, hasError ? 800 : 2000); // Much less frequent

      return () => clearInterval(interval);
    } else {
      setSparkPositions([]);
    }
  }, [isActive, hasError, activityLevel]);

  // OPTIMIZED: Reduced pulse generation
  useEffect(() => {
    if (isActive) {
      const speed = activityLevel === 'high' ? 1500 : activityLevel === 'medium' ? 3000 : 5000;
      
      const interval = setInterval(() => {
        const newPulse = {
          id: Date.now(),
          path: Math.floor(Math.random() * 2), // Only 2 paths instead of 4
        };
        setPulses(prev => {
          // Limit to max 2 pulses at once
          if (prev.length >= 2) return prev;
          return [...prev, newPulse];
        });
        
        // Remove pulse after animation completes
        setTimeout(() => {
          setPulses(prev => prev.filter(p => p.id !== newPulse.id));
        }, 3000);
      }, speed);

      return () => clearInterval(interval);
    } else {
      setPulses([]);
    }
  }, [isActive, activityLevel]);

  return (
    <div className="live-wires-container">
      {/* SVG Wire Paths */}
      <svg className="wire-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {/* Gradient for copper wire */}
          <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5a3910" />
            <stop offset="25%" stopColor="#8b6321" />
            <stop offset="50%" stopColor="#b8860b" />
            <stop offset="75%" stopColor="#8b6321" />
            <stop offset="100%" stopColor="#5a3910" />
          </linearGradient>

          {/* Glow filter for active wires */}
          <filter id="wireGlow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Pulse gradient */}
          <radialGradient id="pulseGradient">
            <stop offset="0%" stopColor={hasError ? "#ff0040" : "#39ff14"} stopOpacity="1" />
            <stop offset="50%" stopColor={hasError ? "#ff0040" : "#39ff14"} stopOpacity="0.6" />
            <stop offset="100%" stopColor={hasError ? "#8b0000" : "#2ecc11"} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Wire Path 1: Top horizontal */}
        <path
          id="wire-path-1"
          d="M 0,10 L 30,10 Q 35,10 35,15 L 35,25 Q 35,30 40,30 L 100,30"
          fill="none"
          stroke="url(#copperGradient)"
          strokeWidth="0.4"
          className={`wire-path ${isActive ? 'active' : ''}`}
          filter="url(#wireGlow)"
        />

        {/* Wire Path 2: Right vertical */}
        <path
          id="wire-path-2"
          d="M 90,0 L 90,40 Q 90,45 85,45 L 75,45 Q 70,45 70,50 L 70,100"
          fill="none"
          stroke="url(#copperGradient)"
          strokeWidth="0.4"
          className={`wire-path ${isActive ? 'active' : ''}`}
          filter="url(#wireGlow)"
        />

        {/* Wire Path 3: Bottom horizontal */}
        <path
          id="wire-path-3"
          d="M 100,70 L 60,70 Q 55,70 55,75 L 55,85 Q 55,90 50,90 L 0,90"
          fill="none"
          stroke="url(#copperGradient)"
          strokeWidth="0.4"
          className={`wire-path ${isActive ? 'active' : ''}`}
          filter="url(#wireGlow)"
        />

        {/* Wire Path 4: Left vertical */}
        <path
          id="wire-path-4"
          d="M 10,100 L 10,60 Q 10,55 15,55 L 25,55 Q 30,55 30,50 L 30,0"
          fill="none"
          stroke="url(#copperGradient)"
          strokeWidth="0.4"
          className={`wire-path ${isActive ? 'active' : ''}`}
          filter="url(#wireGlow)"
        />

        {/* Animated Pulses */}
        {pulses.map(pulse => (
          <circle
            key={pulse.id}
            r="1.5"
            fill="url(#pulseGradient)"
            className={`energy-pulse path-${pulse.path} ${hasError ? 'error' : ''}`}
          >
            <animateMotion
              dur="3s"
              repeatCount="1"
              path={
                pulse.path === 0 ? "M 0,10 L 30,10 Q 35,10 35,15 L 35,25 Q 35,30 40,30 L 100,30" :
                pulse.path === 1 ? "M 90,0 L 90,40 Q 90,45 85,45 L 75,45 Q 70,45 70,50 L 70,100" :
                pulse.path === 2 ? "M 100,70 L 60,70 Q 55,70 55,75 L 55,85 Q 55,90 50,90 L 0,90" :
                "M 10,100 L 10,60 Q 10,55 15,55 L 25,55 Q 30,55 30,50 L 30,0"
              }
            />
          </circle>
        ))}
      </svg>

      {/* Junction Nodes (where wires connect) */}
      <div className={`junction-node top-left ${isActive ? 'active' : ''} ${hasError ? 'error' : ''}`}>
        <div className="node-core"></div>
        <div className="node-ring"></div>
        <div className="node-glow"></div>
      </div>

      <div className={`junction-node top-right ${isActive ? 'active' : ''} ${hasError ? 'error' : ''}`}>
        <div className="node-core"></div>
        <div className="node-ring"></div>
        <div className="node-glow"></div>
      </div>

      <div className={`junction-node bottom-left ${isActive ? 'active' : ''} ${hasError ? 'error' : ''}`}>
        <div className="node-core"></div>
        <div className="node-ring"></div>
        <div className="node-glow"></div>
      </div>

      <div className={`junction-node bottom-right ${isActive ? 'active' : ''} ${hasError ? 'error' : ''}`}>
        <div className="node-core"></div>
        <div className="node-ring"></div>
        <div className="node-glow"></div>
      </div>

      {/* Electric Sparks - OPTIMIZED: Simplified */}
      {sparkPositions.map(spark => (
        <div
          key={spark.id}
          className={`electric-spark ${hasError ? 'error' : ''}`}
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
          }}
        >
          <div className="spark-core"></div>
        </div>
      ))}

      {/* Voltage Indicators */}
      <div className={`voltage-indicator top ${isActive ? 'active' : ''} ${hasError ? 'error' : ''}`}>
        <div className="voltage-bar">
          <div className="voltage-fill" style={{
            width: activityLevel === 'high' ? '90%' : activityLevel === 'medium' ? '60%' : '30%'
          }}></div>
        </div>
        <div className="voltage-label">
          {hasError ? '⚠️ OVERLOAD' : isActive ? '⚡ ACTIVE' : '💤 IDLE'}
        </div>
      </div>
    </div>
  );
}
