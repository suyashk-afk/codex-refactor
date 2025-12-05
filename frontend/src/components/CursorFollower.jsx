import { useState, useEffect } from 'react';
import './CursorFollower.css';

/**
 * Creepy Cursor Follower
 * Spooky emoji that follows the mouse with a delay
 */
export default function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Array of creepy emojis to randomly choose from
  const creepyEmojis = ['👁️', '💀', '👻', '🕷️', '🦇', '🧟'];
  const [emoji, setEmoji] = useState(creepyEmojis[0]);

  useEffect(() => {
    let animationFrameId;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastMoveTime = Date.now();

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      lastMoveTime = Date.now();
      
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth following animation with easing
    const animate = () => {
      // Stop animating if mouse hasn't moved in 2 seconds
      if (Date.now() - lastMoveTime > 2000) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      // Only update if movement is significant
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        currentX += dx * 0.1;
        currentY += dy * 0.1;
        setPosition({ x: currentX, y: currentY });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Change emoji randomly every 5 seconds (less frequent)
    const emojiInterval = setInterval(() => {
      const randomEmoji = creepyEmojis[Math.floor(Math.random() * creepyEmojis.length)];
      setEmoji(randomEmoji);
    }, 5000);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      clearInterval(emojiInterval);
    };
  }, [isVisible]);

  return (
    <div
      className={`cursor-follower ${isVisible ? 'visible' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <span className="follower-emoji">{emoji}</span>
    </div>
  );
}
