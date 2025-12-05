import { motion } from 'framer-motion';
import { useState, useEffect, memo } from 'react';
import SimpleMeter from './SimpleMeter';
import './LabConsole.css';

/**
 * Laboratory Control Console - Steampunk Command Center
 * Ultra high-quality analog gauges, switches, and oscilloscope
 */
const LabConsole = memo(function LabConsole({ 
  complexity = 0, 
  toxicity = 0, 
  smellDensity = [],
  repoHealth = 0,
  pythonEnabled = true,
  jsEnabled = true,
  onTogglePython,
  onToggleJS,
  isActive = false
}) {
  const [needleComplexity, setNeedleComplexity] = useState(0);
  const [needleToxicity, setNeedleToxicity] = useState(0);

  // Smooth needle animation - optimized to 100ms instead of 50ms
  useEffect(() => {
    const interval = setInterval(() => {
      setNeedleComplexity(prev => {
        const diff = complexity - prev;
        if (Math.abs(diff) < 0.5) return complexity; // Stop when close enough
        return prev + diff * 0.2; // Faster interpolation
      });
      setNeedleToxicity(prev => {
        const diff = toxicity - prev;
        if (Math.abs(diff) < 0.5) return toxicity; // Stop when close enough
        return prev + diff * 0.2; // Faster interpolation
      });
    }, 100); // Reduced frequency for better performance
    return () => clearInterval(interval);
  }, [complexity, toxicity]);

  return (
    <motion.div 
      className="lab-console"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Console Header */}
      <div className="console-header">
        <div className="console-title">
          <span className="title-icon">⚗️</span>
          <span className="title-text">LABORATORY CONTROL CONSOLE</span>
          <span className="title-serial">SN: FK-1818</span>
        </div>
        <div className="console-status">
          <div className={`status-light ${isActive ? 'active' : 'idle'}`}></div>
          <span className="status-text">{isActive ? 'ACTIVE' : 'STANDBY'}</span>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="console-grid">
        
        {/* Left Panel - Analog Meters */}
        <div className="console-panel meters-panel">
          <div className="panel-label">DIAGNOSTIC METERS</div>
          
          <SimpleMeter 
            value={needleComplexity} 
            label="COMPLEXITY VOLTAGE" 
            color="#ff0040" 
          />
          
          <SimpleMeter 
            value={needleToxicity} 
            label="CODE TOXICITY LEVEL" 
            color="#39ff14" 
          />
        </div>

        {/* Center Panel - Oscilloscope */}
        <div className="console-panel oscilloscope-panel">
          <div className="panel-label">CODE SMELL DENSITY WAVEFORM</div>
          <div className="oscilloscope">
            <svg viewBox="0 0 400 200" className="oscilloscope-svg">
              {/* Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(57, 255, 20, 0.1)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="400" height="200" fill="#000" stroke="#39ff14" strokeWidth="2"/>
              <rect width="400" height="200" fill="url(#grid)"/>
              
              {/* Waveform */}
              {smellDensity && smellDensity.length > 0 && (
                <motion.path
                  d={`M 0 100 ${smellDensity.map((val, i) => {
                    const x = smellDensity.length > 1 ? (i / (smellDensity.length - 1)) * 400 : 200;
                    const normalizedVal = Math.min(Math.max(val || 0, 0), 1);
                    const y = 100 - (normalizedVal * 80);
                    return `L ${x} ${y}`;
                  }).join(' ')}`}
                  fill="none"
                  stroke="#39ff14"
                  strokeWidth="2"
                  filter="drop-shadow(0 0 5px #39ff14)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              )}
              
              {/* Scan Line - Slowed down for performance */}
              <motion.line
                x1="0"
                y1="0"
                x2="0"
                y2="200"
                stroke="rgba(57, 255, 20, 0.3)"
                strokeWidth="1"
                animate={{ x1: [0, 400], x2: [0, 400] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
            <div className="oscilloscope-label">REAL-TIME ANALYSIS</div>
          </div>
        </div>

        {/* Right Panel - Controls */}
        <div className="console-panel controls-panel">
          <div className="panel-label">ENGINE CONTROLS</div>
          
          {/* Toggle Switches */}
          <div className="toggle-switch-group">
            <div className="toggle-switch">
              <div className="switch-label">
                <span className="switch-icon">🐍</span>
                <span>PYTHON ENGINE</span>
              </div>
              <motion.div 
                className={`switch-housing ${pythonEnabled ? 'on' : 'off'}`}
                onClick={onTogglePython}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="switch-lever"
                  animate={{ x: pythonEnabled ? 30 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
                <div className="switch-indicator">
                  <span className="indicator-off">OFF</span>
                  <span className="indicator-on">ON</span>
                </div>
              </motion.div>
            </div>

            <div className="toggle-switch">
              <div className="switch-label">
                <span className="switch-icon">⚡</span>
                <span>JAVASCRIPT ENGINE</span>
              </div>
              <motion.div 
                className={`switch-housing ${jsEnabled ? 'on' : 'off'}`}
                onClick={onToggleJS}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="switch-lever"
                  animate={{ x: jsEnabled ? 30 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
                <div className="switch-indicator">
                  <span className="indicator-off">OFF</span>
                  <span className="indicator-on">ON</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Steam Gauge */}
          <div className="steam-gauge">
            <div className="gauge-label">REPOSITORY HEALTH</div>
            <div className="gauge-container">
              <svg viewBox="0 0 120 120" className="gauge-svg">
                {/* Gauge Background */}
                <circle cx="60" cy="60" r="50" fill="#0a0a0a" stroke="#8b6321" strokeWidth="4"/>
                
                {/* Progress Ring */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke={repoHealth > 70 ? '#39ff14' : repoHealth > 40 ? '#ffb86b' : '#ff0040'}
                  strokeWidth="8"
                  strokeDasharray={283}
                  strokeDashoffset={283 - (repoHealth / 100) * 283}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (repoHealth / 100) * 283 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  filter="drop-shadow(0 0 5px currentColor)"
                />
                
                {/* Center Value */}
                <text x="60" y="65" fill="#e4e4e4" fontSize="24" fontWeight="bold" textAnchor="middle">
                  {Math.round(repoHealth)}
                </text>
                <text x="60" y="80" fill="#8b6321" fontSize="10" textAnchor="middle">
                  HEALTH
                </text>
              </svg>
              
              {/* Steam Vents */}
              <div className="steam-vents">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="steam-puff"
                    animate={{
                      y: [-10, -40],
                      opacity: [0.6, 0],
                      scale: [0.5, 1.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.7,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Console Footer - Rivets */}
      <div className="console-footer">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rivet" />
        ))}
      </div>
    </motion.div>
  );
});

export default LabConsole;
