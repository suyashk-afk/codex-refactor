import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Zap, Skull, FlaskConical, Clock, Github, Code2, Trash2, Clipboard } from 'lucide-react';

// New Tailwind Components
import { Button, ElectricButton } from './components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, ElectricCard } from './components/ui/Card';
import { Badge, PulsingBadge } from './components/ui/Badge';
import { CircularScore, ProgressBar } from './components/ui/CircularScore';
import { Alert, AlertTitle, AlertDescription } from './components/ui/Alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs';
import { Input, Textarea } from './components/ui/Input';
import LiveWires from './components/LiveWires';

export default function App() {
  const [code, setCode] = useState("");
  const [originalCode, setOriginalCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [language, setLanguage] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('code');
  
  // Repository state
  const [repoUrl, setRepoUrl] = useState("");
  const [repoAnalysis, setRepoAnalysis] = useState(null);
  const [repoLoading, setRepoLoading] = useState(false);
  
  // Time machine state
  const [historyRepoUrl, setHistoryRepoUrl] = useState("");
  const [historyFilePath, setHistoryFilePath] = useState("");
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Determine activity level for live wires
  const getActivityLevel = () => {
    if (loading || repoLoading || historyLoading) return 'high';
    if (analysis || suggestions.length > 0 || repoAnalysis || historyData) return 'medium';
    return 'idle';
  };

  const isAppActive = loading || repoLoading || historyLoading || 
                      analysis !== null || suggestions.length > 0 || 
                      repoAnalysis !== null || historyData !== null;

  const analyze = async () => {
    if (!code.trim()) {
      setError("Please paste some code first!");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const isPython = code.includes('def ') || code.includes('import ') || 
                       code.includes('class ') || code.includes('self.');
      const filename = isPython ? 'code.py' : 'code.js';
      
      const res = await axios.post("http://localhost:4000/analyze", { 
        code: code,
        filename: filename
      });
      
      if (res.data.analysis) {
        setAnalysis(res.data.analysis);
        setLanguage(res.data.language || 'javascript');
      } else if (res.data.ok && res.data) {
        setAnalysis(res.data);
        setLanguage(res.data.language || 'javascript');
      } else {
        setAnalysis(res.data);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze code: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const suggest = async () => {
    if (!code.trim()) {
      setError("Please paste some code first!");
      return;
    }

    setLoading(true);
    setError(null);
    setOriginalCode(code);
    
    try {
      const isPython = code.includes('def ') || code.includes('import ') || 
                       code.includes('class ') || code.includes('self.');
      const filename = isPython ? 'code.py' : 'code.js';
      
      const res = await axios.post("http://localhost:4000/suggest", { 
        code: code,
        filename: filename
      });
      
      if (res.data.message) {
        setError(res.data.message);
      }
      
      let suggs = [];
      if (res.data.suggestions) {
        suggs = res.data.suggestions;
      } else if (Array.isArray(res.data)) {
        suggs = res.data;
      }
      
      setSuggestions(suggs);
      
      if (suggs.length === 0 && !res.data.message) {
        setError("No refactoring suggestions found. Try a longer or more complex function!");
      }
    } catch (err) {
      console.error("Suggestion error:", err);
      setError("Failed to get suggestions: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const analyzeRepository = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL!");
      return;
    }

    setRepoLoading(true);
    setError(null);
    setRepoAnalysis(null);
    
    try {
      const res = await axios.post("http://localhost:4000/analyze-repo", { 
        repoUrl: repoUrl,
        maxFiles: 30
      });
      
      if (res.data.ok) {
        setRepoAnalysis(res.data);
      } else {
        setError(res.data.error || "Failed to analyze repository");
      }
    } catch (err) {
      console.error("Repository analysis error:", err);
      setError("Failed to analyze repository: " + (err.response?.data?.error || err.message));
    } finally {
      setRepoLoading(false);
    }
  };

  const analyzeHistory = async () => {
    if (!historyRepoUrl.trim() || !historyFilePath.trim()) {
      setError("Please enter both repository URL and file path!");
      return;
    }

    setHistoryLoading(true);
    setError(null);
    setHistoryData(null);
    
    try {
      const res = await axios.post("http://localhost:4000/analyze-history", { 
        repoUrl: historyRepoUrl,
        filePath: historyFilePath,
        maxCommits: 10
      });
      
      if (res.data.ok) {
        setHistoryData(res.data);
      } else {
        setError(res.data.error || "Failed to analyze history");
      }
    } catch (err) {
      console.error("History analysis error:", err);
      const errorData = err.response?.data;
      if (errorData?.suggestions && errorData.suggestions.length > 0) {
        setError(
          `${errorData.error}\n\n💡 Try one of these files:\n${errorData.suggestions.slice(0, 5).join('\n')}`
        );
      } else if (errorData?.hint) {
        setError(`${errorData.error}\n\n💡 ${errorData.hint}`);
      } else {
        setError("Failed to analyze history: " + (errorData?.error || err.message));
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <>
      {/* Live Wires Background */}
      <LiveWires 
        isActive={isAppActive}
        hasError={error !== null}
        activityLevel={getActivityLevel()}
      />

      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-laboratory-950"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-6">
              <motion.div
                className="text-8xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                🧟
              </motion.div>
              <h1 className="text-6xl font-black text-gradient-toxic">
                CODE FRANKENSTEIN
              </h1>
              <p className="text-xl text-copper-400 animate-pulse">
                Initializing AST Engine...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block text-7xl"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              🧟
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-black">
              <span className="text-gradient-toxic">CODE</span>{' '}
              <span className="text-gradient-blood">FRANKENSTEIN</span>
            </h1>
            
            <p className="text-lg md:text-xl text-copper-400 font-bold uppercase tracking-widest">
              Stitching Together Perfect Code
            </p>
            
            {language && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Badge variant="success" className="text-base">
                  {language === 'python' ? '🐍' : '⚡'} {language === 'python' ? 'Python' : 'JavaScript/TypeScript'}
                </Badge>
              </motion.div>
            )}
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger 
                value="code" 
                active={activeTab === 'code'}
                onClick={setActiveTab}
                icon={<Code2 className="h-5 w-5" />}
              >
                Code Snippet
              </TabsTrigger>
              <TabsTrigger 
                value="repo" 
                active={activeTab === 'repo'}
                onClick={setActiveTab}
                icon={<Github className="h-5 w-5" />}
              >
                Repository
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                active={activeTab === 'history'}
                onClick={setActiveTab}
                icon={<Clock className="h-5 w-5" />}
              >
                Time Machine
              </TabsTrigger>
            </TabsList>

            {/* Code Snippet Tab */}
            <TabsContent value="code" activeValue={activeTab}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <Code2 className="h-6 w-6 text-toxic-400" />
                      Code Input
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setCode('')}
                        title="Clear"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigator.clipboard.readText().then(setCode)}
                        title="Paste"
                      >
                        <Clipboard className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="// Paste your JavaScript, TypeScript, or Python code here...
// The Codex will analyze structure, detect smells, and suggest improvements

function example() {
  // Your code here
}"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <ElectricButton 
                  variant="default" 
                  className="flex-1"
                  onClick={analyze}
                  loading={loading}
                >
                  <Zap className="h-5 w-5" />
                  {loading ? 'Analyzing...' : 'Analyze Code'}
                </ElectricButton>
                
                <ElectricButton 
                  variant="destructive" 
                  className="flex-1"
                  onClick={suggest}
                  loading={loading}
                >
                  <FlaskConical className="h-5 w-5" />
                  {loading ? 'Thinking...' : 'Suggest Refactors'}
                </ElectricButton>
              </div>
            </TabsContent>

            {/* Repository Tab */}
            <TabsContent value="repo" activeValue={activeTab}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Github className="h-6 w-6 text-toxic-400" />
                    GitHub Repository URL
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="text"
                    placeholder="https://github.com/username/repository"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                  <p className="text-sm text-gray-400">
                    💡 Enter any public GitHub repository URL. We'll analyze up to 30 files.
                  </p>
                </CardContent>
              </Card>

              <div className="mt-6">
                <ElectricButton 
                  variant="default" 
                  className="w-full"
                  onClick={analyzeRepository}
                  loading={repoLoading}
                >
                  <Github className="h-5 w-5" />
                  {repoLoading ? 'Scanning Repository...' : 'Analyze Repository'}
                </ElectricButton>
              </div>
            </TabsContent>

            {/* Time Machine Tab */}
            <TabsContent value="history" activeValue={activeTab}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-toxic-400" />
                    Code Quality Time Machine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Repository URL: https://github.com/username/repository"
                    value={historyRepoUrl}
                    onChange={(e) => setHistoryRepoUrl(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="File path: src/index.js"
                    value={historyFilePath}
                    onChange={(e) => setHistoryFilePath(e.target.value)}
                  />
                  <p className="text-sm text-gray-400">
                    ⏰ See how code quality evolved over time. Track improvements, find regressions, view your coding journey.
                  </p>
                </CardContent>
              </Card>

              <div className="mt-6">
                <ElectricButton 
                  variant="default" 
                  className="w-full"
                  onClick={analyzeHistory}
                  loading={historyLoading}
                >
                  <Clock className="h-5 w-5" />
                  {historyLoading ? 'Traveling Through Time...' : 'Analyze History'}
                </ElectricButton>
              </div>
            </TabsContent>
          </Tabs>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <Alert variant="error">
                <AlertTitle>Error Detected</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </AnimatePresence>

          {/* Analysis Results */}
          <AnimatePresence>
            {analysis && (
              <ElectricCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-toxic-400" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center gap-6">
                      <CircularScore score={analysis.qualityScore || analysis.score || 0} />
                      <div className="text-center">
                        <p className="text-2xl font-black text-toxic-400">
                          {analysis.healthStatus === 'healthy' && '✅ Healthy'}
                          {analysis.healthStatus === 'needs_improvement' && '⚠️ Needs Improvement'}
                          {analysis.healthStatus === 'critical' && '🔴 Critical'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-laboratory-850 border border-laboratory-700">
                        <span className="font-medium">Functions</span>
                        <Badge variant="default">{analysis.totalFunctions || 0}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-laboratory-850 border border-laboratory-700">
                        <span className="font-medium">Code Smells</span>
                        <Badge variant="danger">{analysis.totalSmells || 0}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-laboratory-850 border border-laboratory-700">
                        <span className="font-medium">Avg Complexity</span>
                        <Badge variant="warning">{analysis.avgComplexity || 'N/A'}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </ElectricCard>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}
