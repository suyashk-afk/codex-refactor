# 🔌 Electro-Neural Live Wires

## Overview
Ultra high-quality reactive animated pipeline system that makes the entire UI feel alive, reactive, and sentient.

## Theme Fit
- **Frankenstein Laboratory Wiring** - Copper pipes and electrical conduits
- **Unstable Energy Flow** - Pulses travel through wires based on app activity
- **Reactive System** - Responds to loading states, errors, and user actions

## Features

### 1. **SVG Wire Paths**
- 4 interconnected copper wire paths around the screen edges
- Realistic copper gradient with metallic sheen
- Glow effects when active
- Subtle humming animation

### 2. **Energy Pulses**
- Electric pulses travel through wires during activity
- Speed varies based on activity level:
  - **High**: 500ms (analyzing, loading)
  - **Medium**: 1000ms (results displayed)
  - **Idle**: 2000ms (no activity)
- Green pulses for normal operation
- Red pulses for errors

### 3. **Junction Nodes**
- 4 corner nodes where wires connect
- Animated core with pulsing glow
- Expanding rings during activity
- Error state with shake animation

### 4. **Electric Sparks**
- Random sparks appear during activity
- 3-bolt lightning effect
- Fade out animation
- More frequent during errors

### 5. **Voltage Indicator**
- Real-time activity monitor
- Progress bar shows current load
- Status labels:
  - 💤 IDLE - No activity
  - ⚡ ACTIVE - Processing
  - ⚠️ OVERLOAD - Error state

## Props

```jsx
<LiveWires 
  isActive={boolean}        // Whether app is processing
  hasError={boolean}        // Error state (red pulses)
  activityLevel={string}    // 'idle' | 'medium' | 'high'
/>
```

## Integration

```jsx
import LiveWires from './components/LiveWires';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const getActivityLevel = () => {
    if (loading) return 'high';
    if (hasResults) return 'medium';
    return 'idle';
  };

  return (
    <>
      <LiveWires 
        isActive={loading || hasResults}
        hasError={error !== null}
        activityLevel={getActivityLevel()}
      />
      {/* Rest of app */}
    </>
  );
}
```

## Why It's Elite

### 1. **Sentient Feel**
The entire UI feels alive - wires pulse, nodes glow, sparks fly. It's not just a static interface.

### 2. **Reactive Feedback**
Users instantly see when the app is working:
- Analyzing code? Wires pulse rapidly
- Error occurred? Everything turns red and shakes
- Idle? Gentle copper glow

### 3. **Immersive Theme**
Perfect Frankenstein laboratory aesthetic:
- Copper pipes like old electrical equipment
- Green electricity like classic horror movies
- Junction nodes like Tesla coils

### 4. **Performance Optimized**
- CSS animations (GPU accelerated)
- SVG paths (scalable, crisp)
- Minimal re-renders
- Cleanup on unmount

### 5. **Attention to Detail**
- Realistic copper gradient
- Multiple animation layers
- Synchronized timing
- Smooth transitions

## Technical Details

### Animation Strategy
- **CSS Keyframes**: For smooth, GPU-accelerated animations
- **SVG Paths**: For crisp, scalable wire rendering
- **React State**: For dynamic pulse generation
- **Cleanup**: Proper interval/timeout cleanup

### Performance
- Fixed positioning (no layout thrashing)
- Pointer-events: none (no interaction overhead)
- Transform animations (GPU layer)
- Conditional rendering (only when active)

### Accessibility
- Purely decorative (pointer-events: none)
- Doesn't interfere with screen readers
- No critical information conveyed
- Can be disabled via CSS if needed

## Customization

### Colors
Edit `LiveWires.css`:
```css
/* Change pulse color */
.energy-pulse {
  fill: #YOUR_COLOR;
}

/* Change wire color */
#copperGradient stop {
  stop-color: #YOUR_COLOR;
}
```

### Speed
Edit `LiveWires.jsx`:
```jsx
const speed = activityLevel === 'high' ? 500 : 1000; // Adjust timing
```

### Wire Paths
Edit SVG paths in `LiveWires.jsx`:
```jsx
<path d="M 0,10 L 100,30" /> // Modify coordinates
```

## Future Enhancements
- [ ] Sound effects (electrical hum)
- [ ] More wire paths (8 instead of 4)
- [ ] Particle effects at junctions
- [ ] Voltage meter with real metrics
- [ ] Customizable themes (blue, purple, etc.)

---

**Frankenstein Category** 🧟⚡
