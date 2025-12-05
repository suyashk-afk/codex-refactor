import { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EyeOfRepository.css';

/**
 * The Eye of the Repository - Living File Tree
 * Creepy watchful presence that tracks mouse and shows file health
 */

// Individual Eye Component
const WatchfulEye = memo(function WatchfulEye({ mouseX, mouseY, containerRef }) {
  const eyeRef = useRef(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (!eyeRef.current || !containerRef.current) return;

    const eyeRect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
    const distance = Math.min(8, Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) / 20);

    setPupilPos({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    });
  }, [mouseX, mouseY, containerRef]);

  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div ref={eyeRef} className="watchful-eye">
      <div className={`eye-white ${isBlinking ? 'blinking' : ''}`}>
        <div 
          className="eye-pupil"
          style={{
            transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`
          }}
        >
          <div className="eye-glint" />
        </div>
      </div>
    </div>
  );
});

// File Item Component
const FileItem = memo(function FileItem({ file, onFileClick, mouseX, mouseY }) {
  const [isHovered, setIsHovered] = useState(false);
  const dangerLevel = file.smells || 0;
  const isDangerous = dangerLevel > 5;

  return (
    <motion.div
      className={`file-item ${isDangerous ? 'dangerous' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onFileClick(file)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        scale: isDangerous ? [1, 1.02, 1] : 1
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 2, repeat: isDangerous ? Infinity : 0 }
      }}
      whileHover={{ x: 5, backgroundColor: 'rgba(139, 69, 19, 0.1)' }}
    >
      <div className="file-icon">
        {file.type === 'folder' ? '📁' : '📄'}
      </div>
      
      <div className="file-name">{file.name}</div>
      
      {file.score !== undefined && (
        <div className={`file-score score-${file.score > 70 ? 'good' : file.score > 40 ? 'medium' : 'bad'}`}>
          {file.score}
        </div>
      )}

      {isDangerous && (
        <motion.div 
          className="danger-indicator"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ⚠️
        </motion.div>
      )}

      {/* Heartbeat Monitor on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="heartbeat-monitor"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <svg viewBox="0 0 100 40" className="heartbeat-svg">
              <motion.path
                d="M 0 20 L 20 20 L 25 10 L 30 30 L 35 15 L 40 20 L 100 20"
                stroke={isDangerous ? '#ff0040' : '#39ff14'}
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </svg>
            <div className="monitor-text">
              {dangerLevel} smells detected
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Main Component
export default function EyeOfRepository({ files = [], onFileClick, audioEnabled = false }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFileClick = (file) => {
    // Optional whisper audio
    if (audioEnabled && window.AudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 100;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    }

    if (onFileClick) onFileClick(file);
  };

  return (
    <div ref={containerRef} className="eye-of-repository">
      {/* Header with Eyes */}
      <div className="repository-header">
        <WatchfulEye mouseX={mousePos.x} mouseY={mousePos.y} containerRef={containerRef} />
        <h3 className="repository-title">THE EYE OF THE REPOSITORY</h3>
        <WatchfulEye mouseX={mousePos.x} mouseY={mousePos.y} containerRef={containerRef} />
      </div>

      {/* File List */}
      <div className="file-list">
        {files.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👁️</div>
            <div className="empty-text">The eye sees nothing... yet.</div>
          </div>
        ) : (
          files.map((file, index) => (
            <FileItem
              key={`${file.path}-${index}`}
              file={file}
              onFileClick={handleFileClick}
              mouseX={mousePos.x}
              mouseY={mousePos.y}
            />
          ))
        )}
      </div>
    </div>
  );
}
