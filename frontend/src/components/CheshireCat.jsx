import { useState, useEffect } from 'react';
import './CheshireCat.css';

/**
 * Creepy Cheshire Cat Overlay
 * Appears and fades mysteriously in the background
 */
export default function CheshireCat() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Random appearance intervals
    const showCat = () => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000 + Math.random() * 2000); // Visible for 3-5 seconds
    };

    // First appearance after 10 seconds (longer delay)
    const initialTimer = setTimeout(showCat, 10000);

    // Random reappearances every 30-45 seconds (less frequent)
    const interval = setInterval(() => {
      showCat();
    }, 30000 + Math.random() * 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`cheshire-cat ${isVisible ? 'visible' : ''}`}>
      <img 
        src="/cheshire-cat.png" 
        alt="Cheshire Cat" 
        className="cheshire-image"
      />
    </div>
  );
}
