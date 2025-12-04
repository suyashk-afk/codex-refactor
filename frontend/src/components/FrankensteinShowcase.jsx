import { motion } from 'framer-motion';
import { Zap, Skull, FlaskConical, Activity } from 'lucide-react';
import { Button, ElectricButton } from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent, ElectricCard } from './ui/Card';
import { Badge, PulsingBadge } from './ui/Badge';
import { CircularScore, ProgressBar } from './ui/CircularScore';
import { Alert, AlertTitle, AlertDescription } from './ui/Alert';

/**
 * Frankenstein Laboratory Showcase
 * Demonstrates all the elite UI components with Halloween theme
 */
export function FrankensteinShowcase() {
  return (
    <div className="min-h-screen bg-laboratory-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block text-8xl"
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
          
          <h1 className="text-6xl font-black">
            <span className="text-gradient-toxic">CODE</span>{' '}
            <span className="text-gradient-blood">FRANKENSTEIN</span>
          </h1>
          
          <p className="text-xl text-copper-400 font-bold uppercase tracking-widest">
            Stitching Together Perfect Code
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <PulsingBadge variant="success">
              <Zap className="h-4 w-4" />
              ACTIVE
            </PulsingBadge>
            <Badge variant="warning">
              <FlaskConical className="h-4 w-4" />
              Python + JavaScript
            </Badge>
          </div>
        </motion.div>

        {/* Buttons Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Zap className="h-6 w-6 text-toxic-400" />
              Electric Buttons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <ElectricButton variant="default">
                <Activity className="h-5 w-5" />
                Analyze Code
              </ElectricButton>
              
              <ElectricButton variant="destructive">
                <Skull className="h-5 w-5" />
                Detect Smells
              </ElectricButton>
              
              <Button variant="outline">
                <FlaskConical className="h-5 w-5" />
                Suggest Refactors
              </Button>
              
              <Button variant="default" loading>
                Processing...
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Score Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ElectricCard>
            <CardHeader>
              <CardTitle>Quality Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <CircularScore score={85} />
              <div className="w-full space-y-4">
                <ProgressBar value={12} max={15} showLabel />
                <ProgressBar value={3} max={10} showLabel />
              </div>
            </CardContent>
          </ElectricCard>

          <Card>
            <CardHeader>
              <CardTitle>
                <Skull className="h-6 w-6 text-blood-400" />
                Code Smells
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-laboratory-850 border border-laboratory-700">
                  <span className="font-medium">Long Functions</span>
                  <Badge variant="danger">2 found</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-laboratory-850 border border-laboratory-700">
                  <span className="font-medium">Deep Nesting</span>
                  <Badge variant="warning">1 found</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-laboratory-850 border border-laboratory-700">
                  <span className="font-medium">Magic Numbers</span>
                  <Badge variant="success">0 found</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <Alert variant="success">
            <AlertTitle>Analysis Complete!</AlertTitle>
            <AlertDescription>
              Your code has been successfully analyzed. Quality score: 85/100
            </AlertDescription>
          </Alert>

          <Alert variant="error">
            <AlertTitle>Critical Issues Detected</AlertTitle>
            <AlertDescription>
              Found 3 code smells that need immediate attention.
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertTitle>Technical Debt Warning</AlertTitle>
            <AlertDescription>
              Estimated 12 hours of refactoring needed to reach optimal quality.
            </AlertDescription>
          </Alert>
        </div>

        {/* Electric Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: 'Fast Analysis', value: '< 2s' },
            { icon: '🧬', title: 'Multi-Language', value: 'JS/TS/PY' },
            { icon: '🔮', title: 'AI Powered', value: 'Gemini' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <ElectricCard>
                <CardContent className="text-center space-y-3 pt-6">
                  <div className="text-5xl">{item.icon}</div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-toxic-400 font-black text-2xl">{item.value}</p>
                </CardContent>
              </ElectricCard>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
