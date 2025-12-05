/**
 * Simple Analog Meter - CORRECT GEOMETRY
 * 0% = Left (180°), 100% = Right (0°)
 */
export default function SimpleMeter({ value = 0, label = "METER", color = "#39ff14" }) {
  // Clamp value between 0-100
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  // Calculate needle angle: starts at -180° (left), rotates clockwise to 0° (right)
  // At 0%: -180° (left), At 100%: 0° (right)
  // Negative angles rotate clockwise in SVG
  const needleAngle = -180 + (clampedValue * 1.8);
  
  // DEBUG
  console.log(`${label}: value=${value}, clamped=${clampedValue}, angle=${needleAngle}°`);
  
  return (
    <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid #8b6321', margin: '20px 0' }}>
      <div style={{ textAlign: 'center', color: '#8b6321', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '2px', textTransform: 'uppercase' }}>
        {label}
      </div>
      
      <svg viewBox="0 0 200 150" style={{ width: '100%', maxWidth: '280px', display: 'block', margin: '0 auto' }}>
        {/* Meter Arc */}
        <path
          d="M 30 110 A 70 70 0 0 1 170 110"
          fill="#0a0a0a"
          stroke="#8b6321"
          strokeWidth="3"
        />
        
        {/* Danger Zone (75-100) - right side of arc */}
        <path
          d="M 100 110 L 149 61 A 70 70 0 0 1 170 110 Z"
          fill="rgba(139, 0, 0, 0.15)"
        />
        
        {/* Tick Marks and Labels */}
        {[0, 25, 50, 75, 100].map((val) => {
          const angle = 180 - (val * 1.8);
          const rad = (angle * Math.PI) / 180;
          
          // Tick marks - inside the arc
          const x1 = 100 + Math.cos(rad) * 60;
          const y1 = 110 + Math.sin(rad) * 60;
          const x2 = 100 + Math.cos(rad) * 70;
          const y2 = 110 + Math.sin(rad) * 70;
          
          // Labels - OUTSIDE the arc
          const labelX = 100 + Math.cos(rad) * 85;
          const labelY = 110 + Math.sin(rad) * 85;
          
          return (
            <g key={val}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b6321" strokeWidth="2" />
              <text 
                x={labelX} 
                y={labelY} 
                fill="#8b6321" 
                fontSize="14" 
                fontWeight="bold" 
                textAnchor="middle" 
                dominantBaseline="middle"
              >
                {val}
              </text>
            </g>
          );
        })}
        
        {/* Needle - pointing RIGHT from center, then rotated */}
        <g transform={`rotate(${needleAngle} 100 110)`}>
          {/* Main needle line pointing RIGHT (positive X direction) */}
          <line
            x1="100"
            y1="110"
            x2="170"
            y2="110"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
          {/* Arrow tip */}
          <polygon points="170,110 160,105 160,115" fill={color} />
        </g>
        
        {/* Center Rivet - drawn LAST so it's on top */}
        <circle cx="100" cy="110" r="8" fill="#8b6321" stroke="#b8860b" strokeWidth="2"/>
        <circle cx="100" cy="110" r="4" fill="#5a3910"/>
        <circle cx="100" cy="110" r="2" fill="#b8860b"/>
      </svg>
      
      <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '2rem', fontWeight: '900', color, fontFamily: 'Courier New', letterSpacing: '3px', textShadow: `0 0 10px ${color}` }}>
        {Math.round(clampedValue)}%
      </div>
    </div>
  );
}
