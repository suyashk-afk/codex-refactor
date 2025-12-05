import { motion } from 'framer-motion';
import './SkullGarland.css';

/**
 * High-Quality Skull Garland Border
 * SVG-based decorative frame
 */
export default function SkullGarland({ position = 'top' }) {
  const skullCount = 12;
  
  return (
    <div className={`skull-garland skull-garland-${position}`}>
      <svg viewBox="0 0 1400 60" className="garland-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* High-Detail Skull SVG */}
          <g id="skull">
            {/* Main skull shape with gradient */}
            <defs>
              <radialGradient id="skullGrad" cx="50%" cy="30%">
                <stop offset="0%" stopColor="#4a4a4a" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </radialGradient>
              <filter id="skullShadow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="0" dy="2" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.5"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Skull cranium */}
            <ellipse cx="20" cy="18" rx="16" ry="18" fill="url(#skullGrad)" stroke="#8b0000" strokeWidth="1.5" filter="url(#skullShadow)"/>
            
            {/* Forehead detail */}
            <path d="M 10 12 Q 20 8 30 12" stroke="#2a2a2a" strokeWidth="1" fill="none" opacity="0.5"/>
            
            {/* Eye sockets - larger and more dramatic */}
            <ellipse cx="13" cy="16" rx="4.5" ry="6" fill="#000" stroke="#8b0000" strokeWidth="0.5"/>
            <ellipse cx="27" cy="16" rx="4.5" ry="6" fill="#000" stroke="#8b0000" strokeWidth="0.5"/>
            
            {/* Eye highlights for depth */}
            <ellipse cx="14" cy="14" rx="1.5" ry="2" fill="#1a1a1a" opacity="0.6"/>
            <ellipse cx="28" cy="14" rx="1.5" ry="2" fill="#1a1a1a" opacity="0.6"/>
            
            {/* Nasal cavity - triangular */}
            <path d="M 20 22 L 17 28 L 23 28 Z" fill="#000" stroke="#8b0000" strokeWidth="0.5"/>
            
            {/* Cheekbones */}
            <path d="M 8 20 Q 6 22 8 24" stroke="#2a2a2a" strokeWidth="1" fill="none" opacity="0.4"/>
            <path d="M 32 20 Q 34 22 32 24" stroke="#2a2a2a" strokeWidth="1" fill="none" opacity="0.4"/>
            
            {/* Teeth - detailed jaw */}
            <rect x="14" y="30" width="3" height="4" fill="#e8e8e8" stroke="#1a1a1a" strokeWidth="0.3"/>
            <rect x="17" y="30" width="3" height="4" fill="#e8e8e8" stroke="#1a1a1a" strokeWidth="0.3"/>
            <rect x="20" y="30" width="3" height="4" fill="#e8e8e8" stroke="#1a1a1a" strokeWidth="0.3"/>
            <rect x="23" y="30" width="3" height="4" fill="#e8e8e8" stroke="#1a1a1a" strokeWidth="0.3"/>
            
            {/* Jaw line */}
            <path d="M 10 28 Q 20 36 30 28" stroke="#8b0000" strokeWidth="1" fill="none"/>
            
            {/* Cracks for aged look */}
            <path d="M 12 10 L 14 14" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.6"/>
            <path d="M 28 10 L 26 14" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.6"/>
          </g>
          
          {/* Decorative chain link */}
          <g id="chain">
            <ellipse cx="15" cy="5" rx="4" ry="6" fill="none" stroke="#5a3910" strokeWidth="2" opacity="0.7"/>
          </g>
        </defs>
        
        {/* Render skulls with chains */}
        {[...Array(skullCount)].map((_, i) => {
          const x = (i * (1400 / (skullCount - 1)));
          const delay = i * 0.1;
          
          return (
            <g key={i}>
              {/* Chain above skull */}
              {i < skullCount - 1 && (
                <motion.line
                  x1={x + 15}
                  y1={10}
                  x2={x + (1400 / (skullCount - 1)) - 15}
                  y2={10}
                  stroke="#5a3910"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay }}
                />
              )}
              
              {/* Skull */}
              <motion.g
                transform={`translate(${x}, 20)`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: [0.6, 0.8, 0.6],
                  y: [0, -3, 0]
                }}
                transition={{
                  opacity: { duration: 3, repeat: Infinity, delay },
                  y: { duration: 2, repeat: Infinity, delay, ease: 'easeInOut' }
                }}
              >
                <use href="#skull" />
              </motion.g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
