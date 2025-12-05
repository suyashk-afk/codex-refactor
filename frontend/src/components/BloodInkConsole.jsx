import { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BloodInkConsole.css';

/**
 * Realistic Blood Drip Animation using Canvas
 */
const BloodDripCanvas = memo(function BloodDripCanvas() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 60;
    const height = canvas.height = 100;
    
    // Blood drip particles with physics
    const drops = [];
    let animationId;
    
    class BloodDrop {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.gravity = 0.3;
        this.size = Math.random() * 3 + 2;
        this.opacity = 1;
        this.trail = [];
      }
      
      update() {
        this.vy += this.gravity;
        this.y += this.vy;
        
        // Add trail
        this.trail.push({ x: this.x, y: this.y, size: this.size });
        if (this.trail.length > 8) this.trail.shift();
        
        // Fade out at bottom
        if (this.y > height - 20) {
          this.opacity -= 0.05;
        }
      }
      
      draw(ctx) {
        // Draw trail
        this.trail.forEach((point, i) => {
          const alpha = (i / this.trail.length) * this.opacity;
          ctx.fillStyle = `rgba(139, 0, 0, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw main drop
        const gradient = ctx.createRadialGradient(
          this.x, this.y - this.size * 0.3, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(180, 0, 0, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(139, 0, 0, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(80, 0, 0, ${this.opacity * 0.8})`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add shine
        ctx.fillStyle = `rgba(255, 100, 100, ${this.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      isDead() {
        return this.opacity <= 0 || this.y > height;
      }
    }
    
    // Create initial drip source
    let dripTimer = 0;
    
    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      // Create new drops periodically
      dripTimer++;
      if (dripTimer > 20 && drops.length < 5) {
        drops.push(new BloodDrop(width / 2 + (Math.random() - 0.5) * 10, 0));
        dripTimer = 0;
      }
      
      // Update and draw drops
      for (let i = drops.length - 1; i >= 0; i--) {
        drops[i].update();
        drops[i].draw(ctx);
        
        if (drops[i].isDead()) {
          drops.splice(i, 1);
        }
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="blood-drip-canvas"
      style={{
        position: 'absolute',
        bottom: '-80px',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 10
      }}
    />
  );
});

/**
 * Blood-Ink Console Output Panel
 * Gothic horror console with dripping ink effects
 */
const BloodInkConsole = memo(function BloodInkConsole({ 
  logs = [],
  maxLogs = 100,
  autoScroll = true 
}) {
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const consoleRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Add logs with animation
  useEffect(() => {
    if (logs.length > displayedLogs.length) {
      const newLogs = logs.slice(displayedLogs.length);
      newLogs.forEach((log, index) => {
        setTimeout(() => {
          setDisplayedLogs(prev => [...prev.slice(-maxLogs), log]);
        }, index * 100); // Stagger animation
      });
    }
  }, [logs, displayedLogs.length, maxLogs]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [displayedLogs, autoScroll]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'error': return '💀';
      case 'warning': return '⚠️';
      case 'success': return '✨';
      case 'info': return '📜';
      default: return '•';
    }
  };

  const getLogClass = (type) => {
    switch (type) {
      case 'error': return 'log-error';
      case 'warning': return 'log-warning';
      case 'success': return 'log-success';
      case 'info': return 'log-info';
      default: return 'log-default';
    }
  };

  return (
    <motion.div 
      className={`blood-ink-console ${isExpanded ? 'expanded' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Console Header */}
      <div className="console-header">
        <div className="header-left">
          <span className="header-icon">📜</span>
          <span className="header-title">LABORATORY JOURNAL</span>
          <span className="header-subtitle">Experiment Log</span>
        </div>
        <div className="header-right">
          <button 
            className="header-btn"
            onClick={() => setDisplayedLogs([])}
            title="Clear logs"
          >
            🗑️
          </button>
          <button 
            className="header-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {/* Console Output */}
      <div className="console-output" ref={consoleRef}>
        {/* Ink stains background */}
        <div className="ink-stains">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="ink-stain"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${50 + Math.random() * 100}px`,
                height: `${50 + Math.random() * 100}px`,
              }}
            />
          ))}
        </div>

        {/* Ink particles */}
        <div className="ink-particles">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="ink-particle"
              animate={{
                y: [0, Math.random() * 50],
                x: [0, Math.random() * 20 - 10],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Log entries */}
        <AnimatePresence>
          {displayedLogs.length === 0 ? (
            <motion.div 
              className="console-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="empty-icon">🕯️</div>
              <div className="empty-text">The journal awaits your experiments...</div>
            </motion.div>
          ) : (
            displayedLogs.map((log, index) => (
              <motion.div
                key={`${log.timestamp}-${index}`}
                className={`console-log ${getLogClass(log.type)}`}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ 
                  duration: 0.3,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20
                }}
              >
                {/* Timestamp */}
                <span className="log-timestamp">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>

                {/* Icon */}
                <span className="log-icon">{getLogIcon(log.type)}</span>

                {/* Message */}
                <span className="log-message">
                  {log.message}
                  
                  {/* Realistic dripping blood animation for errors */}
                  {log.type === 'error' && (
                    <BloodDripCanvas />
                  )}

                  {/* Scratch marks for warnings */}
                  {log.type === 'warning' && (
                    <span className="scratch-marks">
                      <span className="scratch"></span>
                      <span className="scratch"></span>
                      <span className="scratch"></span>
                    </span>
                  )}

                  {/* Glow for success */}
                  {log.type === 'success' && (
                    <motion.span
                      className="success-glow"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </span>

                {/* Details (if any) */}
                {log.details && (
                  <div className="log-details">
                    {log.details}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Console Footer */}
      <div className="console-footer">
        <div className="footer-stats">
          <span className="stat">
            <span className="stat-icon">📝</span>
            <span className="stat-value">{displayedLogs.length}</span>
            <span className="stat-label">Entries</span>
          </span>
          <span className="stat">
            <span className="stat-icon">💀</span>
            <span className="stat-value">
              {displayedLogs.filter(l => l.type === 'error').length}
            </span>
            <span className="stat-label">Errors</span>
          </span>
          <span className="stat">
            <span className="stat-icon">⚠️</span>
            <span className="stat-value">
              {displayedLogs.filter(l => l.type === 'warning').length}
            </span>
            <span className="stat-label">Warnings</span>
          </span>
        </div>
        <div className="footer-signature">
          Dr. Frankenstein's Laboratory • Est. 1818
        </div>
      </div>
    </motion.div>
  );
});

export default BloodInkConsole;

// Helper function to add logs (export for use in App.jsx)
export const createLog = (message, type = 'info', details = null) => ({
  message,
  type, // 'info', 'success', 'warning', 'error'
  details,
  timestamp: Date.now(),
});
