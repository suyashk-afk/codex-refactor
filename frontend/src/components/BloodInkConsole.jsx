import { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BloodInkConsole.css';

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
                  
                  {/* Drip effect for errors */}
                  {log.type === 'error' && (
                    <motion.span
                      className="blood-drip"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: '20px', opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
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
