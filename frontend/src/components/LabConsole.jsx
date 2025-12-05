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
  codeQuality = 0,
  mrSmithAnalysis = "Awaiting input. The system stands ready for analysis.",
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

        {/* Center Panel - Code Health Summary */}
        <div className="console-panel oscilloscope-panel">
          <div className="panel-label">CODE HEALTH SUMMARY</div>
          <div className="health-summary">
            {smellDensity && smellDensity.length > 0 ? (
              <>
                <div className="health-stat">
                  <div className="stat-label">Functions Analyzed</div>
                  <div className="stat-value">{smellDensity.length}</div>
                </div>
                <div className="health-stat">
                  <div className="stat-label">Clean Functions</div>
                  <div className="stat-value green">
                    {smellDensity.filter(v => v < 0.2).length}
                  </div>
                </div>
                <div className="health-stat">
                  <div className="stat-label">Needs Attention</div>
                  <div className="stat-value orange">
                    {smellDensity.filter(v => v >= 0.2 && v < 0.6).length}
                  </div>
                </div>
                <div className="health-stat">
                  <div className="stat-label">Critical Issues</div>
                  <div className="stat-value red">
                    {smellDensity.filter(v => v >= 0.6).length}
                  </div>
                </div>
                <div className="health-bar">
                  <div className="health-bar-fill" style={{
                    width: `${Math.max(0, 100 - (smellDensity.reduce((a, b) => a + b, 0) / smellDensity.length * 100))}%`,
                    background: smellDensity.reduce((a, b) => a + b, 0) / smellDensity.length < 0.3 
                      ? '#39ff14' 
                      : smellDensity.reduce((a, b) => a + b, 0) / smellDensity.length < 0.6 
                        ? '#ffb86b' 
                        : '#ff0040'
                  }}></div>
                </div>
                <div className="health-label">
                  Overall Health: {Math.round(Math.max(0, 100 - (smellDensity.reduce((a, b) => a + b, 0) / smellDensity.length * 100)))}%
                </div>
              </>
            ) : (
              <div className="no-data">
                <div className="no-data-icon">📊</div>
                <div className="no-data-text">Analyze code to see health metrics</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Quick Stats */}
        <div className="console-panel controls-panel">
          <div className="panel-label">QUICK STATS</div>
          
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <div className="stat-title">Quality Score</div>
                <div className="stat-number">{Math.round(codeQuality)}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <div className="stat-title">Complexity</div>
                <div className="stat-number">{Math.round(complexity)}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <div className="stat-title">Toxicity</div>
                <div className="stat-number">{Math.round(toxicity)}</div>
              </div>
            </div>

            <div className="stat-card status-card">
              <div className="stat-icon">{isActive ? '⚡' : '💤'}</div>
              <div className="stat-info">
                <div className="stat-title">Status</div>
                <div className={`stat-status ${isActive ? 'active' : 'idle'}`}>
                  {isActive ? 'ANALYZING' : 'READY'}
                </div>
              </div>
            </div>

            {/* Mr. Smith AI Analysis */}
            <div className="agent-panel">
              <div className="agent-header">
                <span className="agent-icon">🕴️</span>
                <span className="agent-title">MR. SMITH</span>
              </div>
              <div className="agent-message">
                "{mrSmithAnalysis}"
              </div>
              <div className="agent-footer">
                <span className="matrix-text">CODEX://ANALYSIS_COMPLETE</span>
              </div>
            </div>
          </div>

          {/* Steam Gauge */}
          <div className="steam-gauge">
            <div className="gauge-label">CODE QUALITY</div>
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
                  stroke={codeQuality > 70 ? '#39ff14' : codeQuality > 40 ? '#ffb86b' : '#ff0040'}
                  strokeWidth="8"
                  strokeDasharray={283}
                  strokeDashoffset={283 - (codeQuality / 100) * 283}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (codeQuality / 100) * 283 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  filter="drop-shadow(0 0 5px currentColor)"
                />
                
                {/* Center Value */}
                <text x="60" y="65" fill="#e4e4e4" fontSize="24" fontWeight="bold" textAnchor="middle">
                  {Math.round(codeQuality)}
                </text>
                <text x="60" y="80" fill="#8b6321" fontSize="10" textAnchor="middle">
                  QUALITY
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
