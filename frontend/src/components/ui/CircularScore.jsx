import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export function CircularScore({ score, size = 160, strokeWidth = 12, className }) {
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;
  
  const getColor = (score) => {
    if (score > 80) return '#39ff14'; // toxic-400
    if (score > 50) return '#ffb86b'; // orange
    return '#ff0040'; // blood-400
  };
  
  const color = getColor(displayScore);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 30px ${color}40`,
        }}
        animate={{
          boxShadow: [
            `0 0 30px ${color}40`,
            `0 0 50px ${color}60`,
            `0 0 30px ${color}40`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* SVG Circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>
      
      {/* Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-black"
          style={{ color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          {displayScore}
        </motion.span>
        <span className="text-sm text-gray-400 font-medium">/100</span>
      </div>
      
      {/* Corner Rivets */}
      <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-copper-500 shadow-inner" />
      <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-copper-500 shadow-inner" />
      <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-copper-500 shadow-inner" />
      <div className="absolute -bottom-2 -right-2 w-3 h-3 rounded-full bg-copper-500 shadow-inner" />
    </div>
  );
}

// Linear Progress Bar
export function ProgressBar({ value, max = 100, className, showLabel = true }) {
  const percentage = (value / max) * 100;
  const color = percentage > 70 ? 'toxic' : percentage > 40 ? 'copper' : 'blood';
  
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        {showLabel && (
          <span className="text-sm font-medium text-gray-400">
            {value} / {max}
          </span>
        )}
        <span className="text-sm font-bold text-gray-300">{Math.round(percentage)}%</span>
      </div>
      
      <div className="h-3 bg-laboratory-800 rounded-full overflow-hidden border border-laboratory-700">
        <motion.div
          className={cn(
            'h-full rounded-full',
            color === 'toxic' && 'bg-gradient-to-r from-toxic-500 to-toxic-400 shadow-glow-green',
            color === 'copper' && 'bg-gradient-to-r from-copper-500 to-copper-400',
            color === 'blood' && 'bg-gradient-to-r from-blood-600 to-blood-400 shadow-glow-red'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
