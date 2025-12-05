import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OccultLoader.css';

/**
 * Occult Summoning Loader
 * Magical ritual circle that performs code refactoring ceremonies
 */
export default function OccultLoader({ 
  isActive = false, 
  progress = 0,
  status = 'idle', // 'idle', 'loading', 'success', 'error'
  message = 'Summoning the refactor spirits...'
}) {
  const [burnedRunes, setBurnedRunes] = useState(0);
  
  useEffect(() => {
    if (isActive && status === 'loading') {
      const runeCount = Math.floor((progress / 100) * 8);
      setBurnedRunes(runeCount);
    }
  }, [progress, isActive, status]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="occult-loader-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="occult-loader">
          {/* Outer rotating ring with symbols */}
          <motion.svg
            className="occult-ring outer-ring"
            viewBox="0 0 200 200"
            animate={{ rotate: status === 'loading' ? 360 : 0 }}
            transition={{ 
              duration: 8, 
              repeat: status === 'loading' ? Infinity : 0,
              ease: 'linear' 
            }}
          >
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              fill="none" 
              stroke="url(#outerGradient)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b4513" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#d4a574" stopOpacity="1" />
                <stop offset="100%" stopColor="#8b4513" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Middle ring with runes */}
          <motion.svg
            className="occult-ring middle-ring"
            viewBox="0 0 200 200"
            animate={{ rotate: status === 'loading' ? -360 : 0 }}
            transition={{ 
              duration: 12, 
              repeat: status === 'loading' ? Infinity : 0,
              ease: 'linear' 
            }}
          >
            {/* 8 Runes around the circle */}
            {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ'].map((rune, i) => {
              const angle = (i * 45) - 90;
              const x = 100 + 70 * Math.cos(angle * Math.PI / 180);
              const y = 100 + 70 * Math.sin(angle * Math.PI / 180);
              const isBurned = i < burnedRunes;
              
              return (
                <motion.text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`rune ${isBurned ? 'burned' : ''}`}
                  initial={{ opacity: 0.3, scale: 0.8 }}
                  animate={isBurned ? {
                    opacity: [0.3, 1, 1],
                    scale: [0.8, 1.2, 1],
                    fill: ['#8b4513', '#ff6b00', '#39ff14']
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {rune}
                </motion.text>
              );
            })}
          </motion.svg>

          {/* Central glyph */}
          <motion.div 
            className="central-glyph"
            animate={
              status === 'success' ? {
                scale: [1, 1.5, 0],
                opacity: [1, 1, 0],
                rotate: [0, 180, 360]
              } : status === 'error' ? {
                scale: [1, 0.8, 1.2, 0],
                opacity: [1, 0.5, 0.2, 0]
              } : status === 'loading' ? {
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              } : {}
            }
            transition={{
              duration: status === 'success' || status === 'error' ? 1 : 2,
              repeat: status === 'loading' ? Infinity : 0
            }}
          >
            <svg viewBox="0 0 100 100" className="glyph-svg">
              {/* Pentagram */}
              <path
                d="M50,10 L61,40 L92,40 L67,58 L78,88 L50,70 L22,88 L33,58 L8,40 L39,40 Z"
                fill="none"
                stroke={status === 'error' ? '#8b0000' : '#39ff14'}
                strokeWidth="2"
                className="pentagram"
              />
              {/* Inner circle */}
              <circle
                cx="50"
                cy="50"
                r="25"
                fill="none"
                stroke={status === 'error' ? '#8b0000' : '#d4a574'}
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {/* Center eye */}
              <circle cx="50" cy="50" r="8" fill={status === 'error' ? '#8b0000' : '#39ff14'} opacity="0.8" />
              <circle cx="50" cy="50" r="4" fill="#000" />
            </svg>
          </motion.div>

          {/* Success flash */}
          {status === 'success' && (
            <motion.div
              className="success-flash"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}

          {/* Error ash effect */}
          {status === 'error' && (
            <motion.div className="ash-particles">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="ash-particle"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: Math.random() * -150,
                    opacity: 0,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 2, delay: i * 0.05 }}
                />
              ))}
            </motion.div>
          )}

          {/* Status message */}
          <motion.div 
            className="loader-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </motion.div>

          {/* Progress indicator */}
          {status === 'loading' && (
            <div className="progress-bar">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
