# 🎨 Tailwind + shadcn + Framer Motion Components Guide

## 🚀 What's Been Added

Your project now has **elite, production-ready UI components** with:
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **Framer Motion** - Smooth animations
- ✅ **shadcn/ui-inspired** - Beautiful, accessible components
- ✅ **Frankenstein Theme** - Halloween laboratory aesthetic

---

## 📦 Installed Packages

```json
{
  "tailwindcss": "^3.x",
  "postcss": "^8.x",
  "autoprefixer": "^10.x",
  "framer-motion": "^11.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "class-variance-authority": "^0.7.x",
  "lucide-react": "^0.x"
}
```

---

## 🎨 Custom Tailwind Theme

### Colors
```js
// Toxic Green (Life/Energy)
toxic-400: '#39ff14'  // Main
toxic-500: '#2ecc11'  // Dark

// Blood Red (Danger/Error)
blood-400: '#ff0040'  // Bright
blood-600: '#8b0000'  // Dark

// Copper (Laboratory Equipment)
copper-400: '#b8860b' // Bright
copper-500: '#8b6321' // Base
copper-600: '#5a3910' // Dark

// Laboratory (Backgrounds)
laboratory-950: '#000000'
laboratory-900: '#0a0a0a'
laboratory-850: '#0d0d0d'
laboratory-800: '#0f0f0f'
laboratory-700: '#1a1a1a'
```

### Custom Animations
- `animate-electric-pulse` - Electric pulsing effect
- `animate-glow-pulse` - Glowing animation
- `animate-flicker` - Flickering light effect
- `animate-spark` - Electric spark
- `animate-float` - Floating animation
- `animate-shimmer` - Text shimmer
- `animate-blood-drip` - Blood drip effect

### Custom Utilities
- `.stitched` - Frankenstein stitching effect
- `.electric-glow` - Green electric glow
- `.blood-glow` - Red blood glow
- `.copper-metal` - Copper gradient
- `.lab-container` - Laboratory container style
- `.terminal-text` - Terminal-style text
- `.text-gradient-toxic` - Toxic green gradient text
- `.text-gradient-blood` - Blood red gradient text

---

## 🧩 Components

### 1. Button Component

```jsx
import { Button, ElectricButton } from './components/ui/Button';
import { Zap } from 'lucide-react';

// Basic Button
<Button variant="default">
  <Zap className="h-5 w-5" />
  Analyze Code
</Button>

// Destructive Button
<Button variant="destructive">
  Delete
</Button>

// Outline Button
<Button variant="outline">
  Cancel
</Button>

// Loading State
<Button loading>
  Processing...
</Button>

// Electric Button (with spark effect on click)
<ElectricButton variant="default">
  ⚡ Analyze
</ElectricButton>
```

**Variants:**
- `default` - Toxic green gradient
- `destructive` - Blood red gradient
- `outline` - Copper border
- `ghost` - Transparent

**Sizes:**
- `sm` - Small
- `default` - Medium
- `lg` - Large
- `icon` - Square icon button

---

### 2. Card Component

```jsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent, 
  CardFooter,
  ElectricCard 
} from './components/ui/Card';

// Basic Card
<Card>
  <CardHeader>
    <CardTitle>Quality Score</CardTitle>
    <CardDescription>Your code analysis results</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Score: 85/100</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>

// Electric Card (with animated border)
<ElectricCard>
  <CardContent>
    <h3>Special Feature</h3>
  </CardContent>
</ElectricCard>
```

**Features:**
- Stitched borders (Frankenstein theme)
- Hover lift effect
- Fade-in animation
- Electric border variant

---

### 3. Badge Component

```jsx
import { Badge, PulsingBadge } from './components/ui/Badge';
import { Zap } from 'lucide-react';

// Basic Badge
<Badge variant="success">
  <Zap className="h-4 w-4" />
  Active
</Badge>

// Pulsing Badge (for active states)
<PulsingBadge variant="success">
  ⚡ LIVE
</PulsingBadge>
```

**Variants:**
- `default` - Gray
- `success` - Toxic green
- `danger` - Blood red
- `warning` - Copper
- `outline` - Copper border

---

### 4. CircularScore Component

```jsx
import { CircularScore, ProgressBar } from './components/ui/CircularScore';

// Circular Score Gauge
<CircularScore score={85} size={160} strokeWidth={12} />

// Progress Bar
<ProgressBar value={12} max={15} showLabel />
```

**Features:**
- Animated counting from 0 to score
- Color changes based on score (green/orange/red)
- Glowing effect
- Copper rivets in corners
- Smooth SVG animation

---

### 5. Input Components

```jsx
import { Input, Textarea, ElectricInput } from './components/ui/Input';

// Basic Input
<Input 
  type="text" 
  placeholder="Enter repository URL..." 
/>

// Textarea (for code)
<Textarea 
  placeholder="// Paste your code here..."
  className="min-h-[450px]"
/>

// Electric Input (with animated border on focus)
<ElectricInput 
  placeholder="GitHub URL"
/>
```

**Features:**
- Terminal-style text for textarea
- Electric glow on focus
- Dark laboratory background
- Stitched borders

---

### 6. Tabs Component

```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs';
import { useState } from 'react';

function MyTabs() {
  const [activeTab, setActiveTab] = useState('code');
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger 
          value="code" 
          active={activeTab === 'code'}
          onClick={setActiveTab}
          icon="📝"
        >
          Code Snippet
        </TabsTrigger>
        <TabsTrigger 
          value="repo" 
          active={activeTab === 'repo'}
          onClick={setActiveTab}
          icon="🔗"
        >
          Repository
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="code" activeValue={activeTab}>
        <p>Code content...</p>
      </TabsContent>
      
      <TabsContent value="repo" activeValue={activeTab}>
        <p>Repo content...</p>
      </TabsContent>
    </Tabs>
  );
}
```

**Features:**
- Smooth transitions
- Active state with toxic green
- Icon support
- Hover effects

---

### 7. Alert Component

```jsx
import { Alert, AlertTitle, AlertDescription } from './components/ui/Alert';

// Success Alert
<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your code has been analyzed successfully.
  </AlertDescription>
</Alert>

// Error Alert (with blood drip animation)
<Alert variant="error">
  <AlertTitle>Error Detected</AlertTitle>
  <AlertDescription>
    Failed to analyze code. Please try again.
  </AlertDescription>
</Alert>

// Warning Alert
<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    Technical debt detected.
  </AlertDescription>
</Alert>
```

**Variants:**
- `default` - Gray
- `success` - Toxic green
- `error` - Blood red (with drip animation!)
- `warning` - Copper

---

## 🎬 Animation Examples

### Framer Motion Basics

```jsx
import { motion } from 'framer-motion';

// Fade In
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Slide Up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Hover Scale
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>

// Continuous Animation
<motion.div
  animate={{
    y: [0, -10, 0],
    rotate: [0, 5, -5, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
  🧟
</motion.div>
```

---

## 🎨 Styling Patterns

### Using Tailwind Classes

```jsx
// Frankenstein Container
<div className="lab-container stitched p-6">
  Content
</div>

// Electric Glow Text
<h1 className="text-gradient-toxic text-4xl font-black">
  CODE FRANKENSTEIN
</h1>

// Terminal Style
<code className="terminal-text font-mono">
  function example() {}
</code>

// Copper Metal
<div className="copper-metal p-4 rounded-lg">
  Laboratory Equipment
</div>
```

### Combining with Custom Classes

```jsx
import { cn } from './lib/utils';

<div className={cn(
  'base-class',
  'another-class',
  condition && 'conditional-class',
  className // Allow prop override
)}>
  Content
</div>
```

---

## 🚀 Quick Start

### 1. View the Showcase

```jsx
import { FrankensteinShowcase } from './components/FrankensteinShowcase';

function App() {
  return <FrankensteinShowcase />;
}
```

### 2. Use in Your Existing App

```jsx
import { Button } from './components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { CircularScore } from './components/ui/CircularScore';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Score</CardTitle>
      </CardHeader>
      <CardContent>
        <CircularScore score={85} />
        <Button variant="default" className="mt-4">
          Analyze Again
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## 🎯 Best Practices

### 1. Use Semantic Colors
- `toxic` for success/active states
- `blood` for errors/danger
- `copper` for warnings/equipment
- `laboratory` for backgrounds

### 2. Animate Thoughtfully
- Use `initial` and `animate` for entrance animations
- Use `whileHover` and `whileTap` for interactions
- Keep durations between 0.2s - 0.5s for snappy feel
- Use `ease-in-out` for smooth transitions

### 3. Maintain Theme Consistency
- Always use the custom color palette
- Apply stitching effects to cards
- Use terminal text for code
- Add electric glows to active elements

### 4. Accessibility
- All components have focus states
- Proper ARIA labels
- Keyboard navigation support
- Color contrast meets WCAG AA

---

## 📸 Screenshots

To see all components in action, run:

```bash
cd frontend
npm run dev
```

Then navigate to the showcase component!

---

## 🏆 What Makes This Elite

1. **Production Ready** - All components are fully functional
2. **Themed Perfectly** - Every element matches Frankenstein laboratory
3. **Smooth Animations** - Framer Motion for buttery transitions
4. **Accessible** - WCAG compliant, keyboard navigable
5. **Customizable** - Easy to extend and modify
6. **Performance** - GPU-accelerated animations
7. **Type-Safe** - Works great with TypeScript (if you add it)

---

**Your project is now UNBELIEVABLY BETTER!** 🧟⚡🎃

Built for Kiroween 2024 - Frankenstein Category
