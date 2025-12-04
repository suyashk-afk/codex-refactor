import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import './SurgicalToolkit.css';

/**
 * Surgical Toolkit - Mad Scientist's Quick-Access Tools
 * Circular radial menu with floating surgical instruments
 */

const tools = [
  {
    id: 'scalpel',
    name: 'Extract Function',
    icon: '🔪',
    description: 'Surgically extract code into functions',
    color: '#39ff14',
    angle: 0,
  },
  {
    id: 'bonesaw',
    name: 'Cut Dead Code',
    icon: '🪚',
    description: 'Remove unused and dead code',
    color: '#ff0040',
    angle: 72,
  },
  {
    id: 'electrode',
    name: 'Inject Refactor',
    icon: '⚡',
    description: 'Apply automated refactoring',
    color: '#ffb86b',
    angle: 144,
  },
  {
    id: 'microscope',
    name: 'Analyze AST',
    icon: '🔬',
    description: 'Deep dive into code structure',
    color: '#06b6d4',
    angle: 216,
  },
  {
    id: 'defibrillator',
    name: 'Apply Patch',
    icon: '💉',
    description: 'Revive code with fixes',
    color: '#8b6321',
    angle: 288,
  },
];

export default function SurgicalToolkit({ onToolSelect, isActive = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolClick = (tool) => {
    setSelectedTool(tool.id);
    onToolSelect?.(tool.id);
    
    // Visual feedback
    setTimeout(() => {
      setSelectedTool(null);
    }, 1000);
  };

  return (
    <div className="surgical-toolkit">
      {/* Center Button - Opens Radial Menu */}
      <motion.button
        className={`toolkit-center ${isOpen ? 'open' : ''} ${isActive ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isOpen ? 180 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="center-icon"
          animate={{
            rotate: isOpen ? 0 : 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ⚗️
        </motion.div>
        
        {/* Pulsing Ring */}
        <motion.div
          className="pulse-ring"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>

      {/* Radial Menu Tools */}
      <AnimatePresence>
        {isOpen && (
          <>
            {tools.map((tool, index) => {
              const radius = 120;
              const angleRad = (tool.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <motion.div
                  key={tool.id}
                  className={`tool-item ${hoveredTool === tool.id ? 'hovered' : ''} ${selectedTool === tool.id ? 'selected' : ''}`}
                  style={{
                    '--tool-color': tool.color,
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x,
                    y,
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.05,
                  }}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  onClick={() => handleToolClick(tool)}
                >
                  {/* Tool Icon */}
                  <motion.div
                    className="tool-icon"
                    animate={{
                      rotate: hoveredTool === tool.id ? [0, -10, 10, -10, 0] : 0,
                      y: hoveredTool === tool.id ? [0, -5, 0] : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                  >
                    {tool.icon}
                  </motion.div>

                  {/* Fluid Suspension Effect */}
                  <motion.div
                    className="fluid-bubble"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.2,
                    }}
                  />

                  {/* Connection Line to Center */}
                  <motion.div
                    className="connection-line"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      transformOrigin: 'right center',
                      rotate: `${-tool.angle}deg`,
                    }}
                  />

                  {/* Tool Label (appears on hover) */}
                  <AnimatePresence>
                    {hoveredTool === tool.id && (
                      <motion.div
                        className="tool-label"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="label-name">{tool.name}</div>
                        <div className="label-description">{tool.description}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Selection Pulse */}
                  {selectedTool === tool.id && (
                    <motion.div
                      className="selection-pulse"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Instruction Text */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="toolkit-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5 }}
          >
            Click to open toolkit
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Tool Display */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            className="active-tool-display"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="active-tool-icon">
              {tools.find(t => t.id === selectedTool)?.icon}
            </div>
            <div className="active-tool-text">
              {tools.find(t => t.id === selectedTool)?.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
