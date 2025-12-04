# 🎨 Code Frankenstein - Design System

## 🧟 Theme: Frankenstein's Laboratory

### Core Concept
A mad scientist's laboratory where dead code is brought back to life through electrical energy and copper wiring. The UI feels alive, reactive, and slightly unstable - perfectly matching the Frankenstein theme.

---

## 🎨 Color Palette

### Primary Colors
```css
/* Toxic Green - Life/Energy */
--toxic-green: #39ff14;
--toxic-green-dark: #2ecc11;
--toxic-green-glow: rgba(57, 255, 20, 0.6);

/* Blood Red - Danger/Error */
--blood-red: #8b0000;
--blood-red-bright: #ff0040;
--blood-red-glow: rgba(139, 0, 0, 0.6);

/* Copper - Laboratory Equipment */
--copper-dark: #5a3910;
--copper-base: #8b6321;
--copper-bright: #b8860b;
--copper-glow: rgba(139, 99, 33, 0.4);
```

### Background Colors
```css
/* Dark Laboratory */
--bg-primary: #0a0a0a;
--bg-secondary: #0d0d0d;
--bg-tertiary: #0f0f0f;

/* Container Backgrounds */
--container-bg: rgba(15, 5, 5, 0.95);
--card-bg: rgba(10, 10, 10, 0.98);
```

### Text Colors
```css
--text-primary: #e4e4e4;
--text-secondary: #999;
--text-accent: #39ff14;
--text-danger: #ff0040;
```

---

## 🔤 Typography

### Font Stack
```css
--font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "Fira Code", "Courier New", monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.85rem;    /* 13.6px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.1rem;     /* 17.6px */
--text-xl: 1.5rem;     /* 24px */
--text-2xl: 2rem;      /* 32px */
--text-3xl: 3rem;      /* 48px */
--text-4xl: 4rem;      /* 64px */
```

### Font Weights
```css
--weight-normal: 400;
--weight-medium: 600;
--weight-bold: 700;
--weight-black: 900;
```

---

## 🎭 Visual Effects

### Shadows
```css
/* Glow Effects */
--glow-green: 0 0 20px rgba(57, 255, 20, 0.6);
--glow-red: 0 0 20px rgba(139, 0, 0, 0.6);
--glow-copper: 0 0 10px rgba(139, 99, 33, 0.3);

/* Depth Shadows */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.5);
--shadow-md: 0 10px 30px rgba(0, 0, 0, 0.5);
--shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.8);

/* Inset Shadows */
--shadow-inset: inset 0 2px 8px rgba(0, 0, 0, 0.8);
```

### Borders
```css
--border-thin: 1px solid #1a1a1a;
--border-medium: 2px solid #1a1a1a;
--border-accent: 2px solid rgba(57, 255, 20, 0.6);
--border-danger: 2px solid rgba(139, 0, 0, 0.6);
--border-dashed: 2px dashed rgba(139, 99, 33, 0.3);
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-full: 50%;
```

---

## 🎬 Animations

### Timing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Durations
```css
--duration-fast: 0.2s;
--duration-normal: 0.3s;
--duration-slow: 0.5s;
--duration-slower: 1s;
```

### Key Animations

#### Electric Pulse
```css
@keyframes electricPulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; filter: brightness(1.5); }
}
```

#### Glow Pulse
```css
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(57, 255, 20, 0.3); }
  50% { box-shadow: 0 0 40px rgba(57, 255, 20, 0.6); }
}
```

#### Flicker
```css
@keyframes flicker {
  0%, 100% { opacity: 1; }
  5% { opacity: 0.6; }
  10% { opacity: 1; }
  15% { opacity: 0.8; }
  20% { opacity: 1; }
}
```

---

## 🧩 Component Patterns

### Buttons

#### Primary Button (Toxic Green)
```css
.primary-btn {
  background: linear-gradient(135deg, #39ff14 0%, #2ecc11 100%);
  color: #000;
  font-weight: 900;
  padding: 16px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(57, 255, 20, 0.4);
  transition: all 0.3s ease;
}

.primary-btn:hover {
  box-shadow: 0 6px 20px rgba(57, 255, 20, 0.6);
  transform: translateY(-2px);
}
```

#### Secondary Button (Blood Red)
```css
.secondary-btn {
  background: linear-gradient(135deg, #8b0000 0%, #660000 100%);
  color: #fff;
  font-weight: 900;
  padding: 16px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(139, 0, 0, 0.4);
}
```

### Cards

#### Standard Card
```css
.card {
  background: rgba(10, 10, 10, 0.98);
  border: 2px dashed rgba(139, 99, 33, 0.3);
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: rgba(57, 255, 20, 0.6);
  box-shadow: 0 5px 20px rgba(57, 255, 20, 0.2);
}
```

### Input Fields

#### Code Input
```css
.code-input {
  background: rgba(10, 5, 5, 0.95);
  border: 2px solid #1a1a1a;
  color: #39ff14;
  font-family: 'Fira Code', monospace;
  padding: 20px;
  border-radius: 8px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.8);
}

.code-input:focus {
  border-color: #39ff14;
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}
```

---

## 🎯 Layout Principles

### Spacing Scale
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1400px;
```

### Grid System
```css
/* 12-column grid */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

/* Auto-fit responsive grid */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

---

## 🔌 Interactive Elements

### Live Wires System
- **Copper pipes** run along screen edges
- **Electric pulses** travel through wires during activity
- **Junction nodes** glow at corners
- **Sparks** appear randomly during processing
- **Voltage indicator** shows current activity level

### States
1. **Idle** - Gentle copper glow, slow pulses
2. **Active** - Green pulses, rapid flow, glowing nodes
3. **Error** - Red pulses, shaking nodes, frequent sparks

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop */
@media (max-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1400px) { }
```

---

## ♿ Accessibility

### Focus States
```css
*:focus {
  outline: 2px solid #39ff14;
  outline-offset: 2px;
}
```

### Color Contrast
- All text meets WCAG AA standards
- Green (#39ff14) on black (#0a0a0a) = 12.5:1 ratio ✅
- Red (#ff0040) on black (#0a0a0a) = 5.8:1 ratio ✅

### Screen Reader Support
- Decorative elements use `aria-hidden="true"`
- Interactive elements have proper labels
- Semantic HTML structure

---

## 🎨 Design Inspiration

### References
1. **Frankenstein (1931)** - Classic laboratory aesthetic
2. **Blade Runner** - Neon lighting in dark environments
3. **Steampunk** - Copper pipes and industrial equipment
4. **Matrix** - Green terminal text
5. **Tesla Coils** - Electrical arcs and energy

### Mood Board
- Dark, moody laboratory
- Flickering lights
- Copper and brass equipment
- Green electrical energy
- Blood-stained surfaces (subtle)
- Stitching and rivets (Frankenstein's monster)

---

## 🏆 What Makes This Design Elite

1. **Thematic Consistency** - Every element reinforces the Frankenstein laboratory theme
2. **Reactive Feedback** - UI responds to user actions with animations
3. **Attention to Detail** - Copper gradients, realistic shadows, synchronized animations
4. **Performance** - GPU-accelerated animations, minimal repaints
5. **Accessibility** - Meets WCAG standards while maintaining theme
6. **Unique Identity** - Instantly recognizable, memorable design

---

## 📐 Component Hierarchy

```
App
├── LiveWires (Background energy system)
├── Container
│   ├── Hero Section
│   │   ├── Icon (with Tesla coil effect)
│   │   ├── Title (glowing text)
│   │   └── Subtitle
│   ├── Tab Switcher
│   │   ├── Code Snippet Tab
│   │   ├── Repository Tab
│   │   └── Time Machine Tab
│   ├── Input Section
│   │   ├── Code Textarea
│   │   └── Control Buttons
│   ├── Action Buttons
│   │   ├── Analyze Button (green)
│   │   └── Suggest Button (red)
│   └── Results Section
│       ├── Quality Score (circular gauge)
│       ├── Code Smells Grid
│       ├── Function Analysis Cards
│       └── Refactoring Suggestions
```

---

## 🎬 Animation Choreography

### Loading Sequence
1. Welcome overlay fades in (0s)
2. Title shimmers (0.5s)
3. Live wires activate (1s)
4. Junction nodes glow (1.5s)
5. Welcome overlay fades out (2s)

### Analysis Sequence
1. Button press triggers electric shock
2. Live wires pulse rapidly (green)
3. Voltage indicator shows "ACTIVE"
4. Sparks appear randomly
5. Results fade in with slide animation

### Error Sequence
1. Live wires turn red
2. Junction nodes shake
3. Voltage indicator shows "OVERLOAD"
4. Frequent red sparks
5. Error alert slides in

---

**Built for Kiroween 2024 - Frankenstein Category** 🧟⚡
