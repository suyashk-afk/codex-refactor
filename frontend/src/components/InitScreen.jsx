import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './InitScreen.css';

/**
 * Spooky Initialization Screen
 * Shows before the main app loads
 */
export default function InitScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    { text: 'Awakening the Time Machine...', icon: '🕰️', duration: 800 },
    { text: 'Summoning AST Spirits...', icon: '👻', duration: 700 },
    { text: 'Charging Refactor Engine...', icon: '⚡', duration: 600 },
    { text: 'Opening Git Portal...', icon: '🌀', duration: 700 },
    { text: 'Initializing Code Analysis...', icon: '🔬', duration: 600 },
  ];

  useEffect(() => {
    let currentProgress = 0;
    let phaseIndex = 0;

    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);

      // Update phase based on progress
      const newPhaseIndex = Math.floor((currentProgress / 100) * phases.length);
      if (newPhaseIndex !== phaseIndex && newPhaseIndex < phases.length) {
        phaseIndex = newPhaseIndex;
        setCurrentPhase(phaseIndex);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="init-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background */}
        <div className="init-background">
          <div className="init-particles"></div>
          <div className="init-glow"></div>
        </div>

        {/* Main Content */}
        <div className="init-content">
          {/* Logo/Icon */}
          <motion.div
            className="init-logo"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🕰️
          </motion.div>

          {/* Title */}
          <motion.h1
            className="init-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Time Machine Codex
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="init-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Preparing your journey through code history...
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            className="init-progress-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="init-progress-bar">
              <motion.div
                className="init-progress-fill"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
              <div className="init-progress-glow" style={{ left: `${progress}%` }} />
            </div>
            <div className="init-progress-text">{progress}%</div>
          </motion.div>

          {/* Current Phase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              className="init-phase"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="init-phase-icon">{phases[currentPhase]?.icon}</span>
              <span className="init-phase-text">{phases[currentPhase]?.text}</span>
            </motion.div>
          </AnimatePresence>

          {/* Loading Dots */}
          <div className="init-dots">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="init-dot"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Spooky Elements */}
        <motion.div
          className="init-ghost"
          animate={{
            x: ['-100%', '100%'],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          👻
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
