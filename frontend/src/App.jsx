import { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import './codex.css';
import './ui-fixes.css';
import './ui-polish.css';
import { diffLines } from "diff";
import LiveWires from './components/LiveWires';
import ThreeBackground from './components/ThreeBackground';
import LabConsole from './components/LabConsole';
import SurgicalToolkit from './components/SurgicalToolkit';
import BloodInkConsole, { createLog } from './components/BloodInkConsole';
import OccultLoader from './components/OccultLoader';
import EyeOfRepository from './components/EyeOfRepository';

// Lazy load CobwebGraph for better performance
const CobwebGraph = lazy(() => import('./components/CobwebGraph'));

function SideBySideDiff({ before, after }) {
  const diff = diffLines(before, after, {
    ignoreWhitespace: false,
    newlineIsToken: true,
  });

  return (
    <div className="diff-container">
      <div className="diff-column">
        <div className="diff-header">
          <h3>🔴 Before</h3>
          <span className="diff-label">Original Code</span>
        </div>
        <div className="diff-content">
          {diff.map((part, i) => (
            <pre
              key={`before-${i}`}
              className={`diff-line ${part.removed ? 'removed' : ''} ${!part.added && !part.removed ? 'unchanged' : ''}`}
            >
              {part.removed || !part.added ? part.value : ""}
            </pre>
          ))}
        </div>
      </div>

      <div className="diff-column">
        <div className="diff-header">
          <h3>🟢 After</h3>
          <span className="diff-label">Refactored Code</span>
        </div>
        <div className="diff-content">
          {diff.map((part, i) => (
            <pre
              key={`after-${i}`}
              className={`diff-line ${part.added ? 'added' : ''} ${!part.added && !part.removed ? 'unchanged' : ''}`}
            >
              {part.added || !part.removed ? part.value : ""}
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
}

function CircularProgress({ score }) {
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (displayScore / 100) * circumference;
  const color = score > 80 ? '#39ff14' : score > 50 ? '#ffb86b' : '#ff0040';

  return (
    <div className="circular-progress">
      <svg width="160" height="160">
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          className="progress-ring"
        />
      </svg>
      <div className="score-text">
        <span className="score-number">{displayScore}</span>
        <span className="score-label">/100</span>
      </div>
    </div>
  );
}

export default function App() {
  const [code, setCode] = useState("");
  const [originalCode, setOriginalCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [language, setLanguage] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // AI Assistant state
  const [aiExplanations, setAiExplanations] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  
  // Repository analysis state
  const [activeTab, setActiveTab] = useState('code'); // 'code', 'repo', or 'history'
  const [repoUrl, setRepoUrl] = useState("");
  const [repoAnalysis, setRepoAnalysis] = useState(null);
  const [repoLoading, setRepoLoading] = useState(false);
  
  // Time machine state
  const [historyRepoUrl, setHistoryRepoUrl] = useState("");
  const [historyFilePath, setHistoryFilePath] = useState("");
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Console logs state
  const [consoleLogs, setConsoleLogs] = useState([
    createLog('Laboratory initialized. Ready for experiments.', 'success'),
    createLog('Awaiting code specimen...', 'info'),
  ]);
  
  // Occult loader state
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderStatus, setLoaderStatus] = useState('idle');

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const analyze = async () => {
    if (!code.trim()) {
      setError("Please paste some code first!");
      setConsoleLogs(prev => [...prev, createLog('No code provided for analysis', 'warning')]);
      return;
    }

    setLoading(true);
    setError(null);
    setLoaderStatus('loading');
    setLoaderProgress(0);
    setConsoleLogs(prev => [...prev, createLog('Initiating code analysis...', 'info')]);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setLoaderProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    try {
      const isPython = code.includes('def ') || code.includes('import ') || 
                       code.includes('class ') || code.includes('self.');
      const filename = isPython ? 'code.py' : 'code.js';
      
      const res = await axios.post("http://localhost:4000/analyze", { 
        code: code,
        filename: filename
      });
      
      clearInterval(progressInterval);
      setLoaderProgress(100);
      
      if (res.data.analysis) {
        setAnalysis(res.data.analysis);
        setLanguage(res.data.language || 'javascript');
        setLoaderStatus('success');
        setConsoleLogs(prev => [...prev, createLog(
          `Analysis complete! Quality score: ${res.data.analysis.qualityScore}/100`, 
          'success'
        )]);
      } else if (res.data.ok && res.data) {
        setAnalysis(res.data);
        setLanguage(res.data.language || 'javascript');
        setLoaderStatus('success');
        setConsoleLogs(prev => [...prev, createLog('Code analysis successful', 'success')]);
      } else {
        setAnalysis(res.data);
        setLoaderStatus('success');
        setConsoleLogs(prev => [...prev, createLog('Analysis completed with warnings', 'warning')]);
      }
      
      setTimeout(() => setLoaderStatus('idle'), 1000);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Analysis error:", err);
      const errorMsg = "Failed to analyze code: " + (err.response?.data?.error || err.message);
      setError(errorMsg);
      setLoaderStatus('error');
      setConsoleLogs(prev => [...prev, createLog(errorMsg, 'error', err.stack)]);
      setTimeout(() => setLoaderStatus('idle'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const suggest = async () => {
    if (!code.trim()) {
      setError("Please paste some code first!");
      setConsoleLogs(prev => [...prev, createLog('No code provided for suggestions', 'warning')]);
      return;
    }

    setLoading(true);
    setError(null);
    setOriginalCode(code);
    setConsoleLogs(prev => [...prev, createLog('Generating refactoring suggestions...', 'info')]);
    
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
      setSelectedDiff(null);
      
      if (suggs.length === 0 && !res.data.message) {
        const msg = "No refactoring suggestions found. Try a longer or more complex function!";
        setError(msg);
        setConsoleLogs(prev => [...prev, createLog(msg, 'warning')]);
      } else if (suggs.length > 0) {
        setConsoleLogs(prev => [...prev, createLog(
          `Found ${suggs.length} refactoring suggestion${suggs.length > 1 ? 's' : ''}`, 
          'success'
        )]);
      }
    } catch (err) {
      console.error("Suggestion error:", err);
      const errorMsg = "Failed to get suggestions: " + (err.response?.data?.error || err.message);
      setError(errorMsg);
      setConsoleLogs(prev => [...prev, createLog(errorMsg, 'error')]);
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

  const getAIExplanation = async (smell, functionName, smellKey) => {
    setAiLoading(prev => ({ ...prev, [smellKey]: true }));
    
    try {
      const res = await axios.post("http://localhost:4000/ai-explain", {
        smell,
        code,
        functionName
      });
      
      if (res.data.ok) {
        setAiExplanations(prev => ({ 
          ...prev, 
          [smellKey]: {
            text: res.data.explanation,
            isFallback: res.data.fallback
          }
        }));
      }
    } catch (err) {
      console.error("AI explanation error:", err);
      setAiExplanations(prev => ({ 
        ...prev, 
        [smellKey]: {
          text: smell.suggestion || "Unable to get AI explanation.",
          isFallback: true
        }
      }));
    } finally {
      setAiLoading(prev => ({ ...prev, [smellKey]: false }));
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
      
      // Show suggestions if available
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

  // Determine activity level for live wires
  const getActivityLevel = () => {
    if (loading || repoLoading || historyLoading) return 'high';
    if (analysis || suggestions.length > 0 || repoAnalysis || historyData) return 'medium';
    return 'idle';
  };

  const isAppActive = loading || repoLoading || historyLoading || 
                      analysis !== null || suggestions.length > 0 || 
                      repoAnalysis !== null || historyData !== null;

  return (
    <>
      {/* Occult Summoning Loader - Magical Ritual Circle */}
      <OccultLoader
        isActive={loaderStatus !== 'idle'}
        progress={loaderProgress}
        status={loaderStatus}
        message={
          loaderStatus === 'loading' ? 'Summoning the refactor spirits...' :
          loaderStatus === 'success' ? 'Ritual complete! The spirits have spoken.' :
          loaderStatus === 'error' ? 'The ritual has failed... darkness consumes all.' :
          ''
        }
      />

      {/* 3D Background - DNA Helix, Energy Orbs, Electric Arcs */}
      {/* Disabled by default for performance - uncomment to enable */}
      {/* <ThreeBackground 
        isActive={isAppActive}
        hasError={error !== null}
      /> */}

      {/* Electro-Neural Live Wires - Reactive Energy System */}
      <LiveWires 
        isActive={isAppActive}
        hasError={error !== null}
        activityLevel={getActivityLevel()}
      />

      {/* Surgical Toolkit - Mad Scientist's Quick-Access Tools */}
      <SurgicalToolkit 
        onToolSelect={(toolId) => {
          console.log('Tool selected:', toolId);
          // Handle tool actions
          if (toolId === 'scalpel') suggest();
          if (toolId === 'microscope') analyze();
          if (toolId === 'defibrillator' && suggestions.length > 0) {
            // Apply first suggestion
            setCode(suggestions[0]?.after || code);
          }
        }}
        isActive={loading || repoLoading || historyLoading}
      />

      {/* Frankenstein Laboratory Decorative Elements */}
      <div className="copper-pipe pipe-top-left"></div>
      <div className="copper-pipe pipe-top-right"></div>
      <div className="copper-pipe pipe-bottom-left"></div>
      <div className="copper-pipe pipe-bottom-right"></div>

      <div className="copper-joint joint-top-left"></div>
      <div className="copper-joint joint-top-right"></div>
      <div className="copper-joint joint-bottom-left"></div>
      <div className="copper-joint joint-bottom-right"></div>

      {/* Electrical sparks with random positions */}
      <div className="electrical-spark" style={{top: '20%', left: '10%', '--spark-x': '100px', '--spark-y': '100px'}}></div>
      <div className="electrical-spark" style={{top: '70%', left: '80%', '--spark-x': '-100px', '--spark-y': '-100px'}}></div>
      <div className="electrical-spark" style={{top: '40%', left: '60%', '--spark-x': '50px', '--spark-y': '-150px'}}></div>
      <div className="electrical-spark" style={{top: '60%', left: '30%', '--spark-x': '-80px', '--spark-y': '120px'}}></div>
      <div className="electrical-spark" style={{top: '30%', left: '70%', '--spark-x': '120px', '--spark-y': '-50px'}}></div>

      {/* Flickering lights */}
      <div className="flickering-light" style={{top: '10%', left: '30%'}}></div>
      <div className="flickering-light" style={{top: '60%', left: '70%'}}></div>
      <div className="flickering-light" style={{top: '80%', left: '20%'}}></div>

      {/* Laboratory equipment shadows */}
      <div className="lab-shadow" style={{top: '20%', left: '10%', transform: 'scale(1.5)'}}></div>
      <div className="lab-shadow" style={{bottom: '30%', right: '15%', transform: 'scale(1.2)'}}></div>
      <div className="lab-shadow" style={{top: '60%', left: '80%', transform: 'scale(0.8)'}}></div>

      <div className="codex-container">
        {showWelcome && (
          <div className="welcome-overlay">
            <div className="welcome-content">
              <h1 className="welcome-title">⚗️ Refactor Codex</h1>
              <p className="welcome-subtitle">Initializing AST Engine...</p>
            </div>
          </div>
        )}

        <div className="hero-section">
          <div className="hero-icon">⚗️</div>
          <h1 className="codex-title">
            <span className="title-text">The Refactor</span>
            <span className="title-accent">Codex</span>
          </h1>
          <p className="codex-subtitle">
            Decode the hidden architecture within your code
          </p>
          {language && (
            <div className="language-badge">
              <span className="badge-icon">{language === 'python' ? '🐍' : '⚡'}</span>
              <span className="badge-text">
                {language === 'python' ? 'Python' : 'JavaScript/TypeScript'}
              </span>
            </div>
          )}
        </div>

        {/* Laboratory Control Console */}
        <LabConsole 
          complexity={
            analysis?.avgComplexity 
              ? Math.min(analysis.avgComplexity * 10, 100) // Scale complexity to 0-100
              : 0
          }
          toxicity={
            analysis?.totalSmells 
              ? Math.min((analysis.totalSmells / (analysis.totalFunctions || 1)) * 100, 100) // Smells per function ratio
              : 0
          }
          smellDensity={
            analysis?.functions?.length > 0
              ? analysis.functions.map(f => Math.min((f.issues?.length || 0) / 10, 1)) // Normalize to 0-1
              : repoAnalysis?.worstFiles?.map(f => (100 - f.score) / 100) || []
          }
          repoHealth={analysis?.qualityScore || repoAnalysis?.summary?.averageQualityScore || 0}
          pythonEnabled={language === 'python'}
          jsEnabled={language === 'javascript' || !language}
          onTogglePython={() => setLanguage(language === 'python' ? null : 'python')}
          onToggleJS={() => setLanguage(language === 'javascript' ? null : 'javascript')}
          isActive={loading || repoLoading || historyLoading}
        />

        {/* Tab Switcher */}
        <div className="tab-switcher">
          <button 
            className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <span className="tab-icon">📝</span>
            <span>Code Snippet</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'repo' ? 'active' : ''}`}
            onClick={() => setActiveTab('repo')}
          >
            <span className="tab-icon">🔗</span>
            <span>Repository</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="tab-icon">⏰</span>
            <span>Time Machine</span>
          </button>
        </div>

        {activeTab === 'code' ? (
          <div className="editor-section">
            <div className="editor-header">
              <span className="editor-label">Code Input</span>
              <div className="editor-controls">
                <button className="control-btn" onClick={() => setCode('')} title="Clear">
                  🗑️
                </button>
                <button className="control-btn" onClick={() => navigator.clipboard.readText().then(setCode)} title="Paste">
                  📋
                </button>
              </div>
            </div>
            <textarea
              className="codex-input"
              placeholder="// Paste your JavaScript, TypeScript, or Python code here...
// The Codex will analyze structure, detect smells, and suggest improvements

function example() {
  // Your code here
}"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        ) : activeTab === 'repo' ? (
          <div className="editor-section">
            <div className="editor-header">
              <span className="editor-label">GitHub Repository URL</span>
            </div>
            <input
              type="text"
              className="repo-input"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <p className="repo-hint">
              💡 Enter any public GitHub repository URL. We'll analyze up to 30 files.
            </p>
          </div>
        ) : (
          <div className="editor-section">
            <div className="editor-header">
              <span className="editor-label">⏰ Code Quality Time Machine</span>
            </div>
            <input
              type="text"
              className="repo-input"
              placeholder="Repository URL: https://github.com/username/repository"
              value={historyRepoUrl}
              onChange={(e) => setHistoryRepoUrl(e.target.value)}
              style={{marginBottom: '15px'}}
            />
            <input
              type="text"
              className="repo-input"
              placeholder="File path: src/index.js"
              value={historyFilePath}
              onChange={(e) => setHistoryFilePath(e.target.value)}
            />
            <p className="repo-hint">
              ⏰ See how code quality evolved over time. Track improvements, find regressions, view your coding journey.
            </p>
          </div>
        )}

        <div className="action-section">
          {activeTab === 'code' ? (
            <>
              <button className="primary-btn" onClick={analyze} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🔍</span>
                    <span>Analyze Code</span>
                  </>
                )}
              </button>
              <button className="secondary-btn" onClick={suggest} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✨</span>
                    <span>Suggest Refactors</span>
                  </>
                )}
              </button>
            </>
          ) : activeTab === 'repo' ? (
            <button className="primary-btn repo-analyze-btn" onClick={analyzeRepository} disabled={repoLoading}>
              {repoLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Scanning Repository...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🔬</span>
                  <span>Analyze Repository</span>
                </>
              )}
            </button>
          ) : (
            <button className="primary-btn repo-analyze-btn" onClick={analyzeHistory} disabled={historyLoading}>
              {historyLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Traveling Through Time...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">⏰</span>
                  <span>Analyze History</span>
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text">{error}</span>
          </div>
        )}

        {/* Time Machine Results */}
        {historyData && (
          <div className="results-container time-machine-results">
            <div className="results-header">
              <h2 className="results-title">
                <span className="title-icon">⏰</span>
                Code Quality Time Machine
              </h2>
              <p className="time-machine-subtitle">
                {historyData.owner}/{historyData.repo} → {historyData.filePath}
              </p>
            </div>

            {/* Overall Insights */}
            {historyData.insights && (
              <div className="time-machine-insights">
                <div className={`trend-card trend-${historyData.insights.overallTrend}`}>
                  <div className="trend-icon">
                    {historyData.insights.overallTrend === 'improving' && '📈'}
                    {historyData.insights.overallTrend === 'declining' && '📉'}
                    {historyData.insights.overallTrend === 'stable' && '➡️'}
                  </div>
                  <div className="trend-content">
                    <div className="trend-label">Overall Trend</div>
                    <div className="trend-value">
                      {historyData.insights.overallTrend === 'improving' && 'Improving'}
                      {historyData.insights.overallTrend === 'declining' && 'Declining'}
                      {historyData.insights.overallTrend === 'stable' && 'Stable'}
                    </div>
                    <div className="trend-change">
                      {historyData.insights.overallChange > 0 ? '+' : ''}
                      {historyData.insights.overallChange} points
                    </div>
                  </div>
                </div>

                <div className="insight-card">
                  <div className="insight-icon">📊</div>
                  <div className="insight-content">
                    <div className="insight-label">Average Quality</div>
                    <div className="insight-value">{historyData.insights.avgScore}/100</div>
                    <div className="insight-detail">Across {historyData.insights.totalCommits} commits</div>
                  </div>
                </div>

                {historyData.insights.biggestImprovement && (
                  <div className="insight-card improvement">
                    <div className="insight-icon">✨</div>
                    <div className="insight-content">
                      <div className="insight-label">Best Commit</div>
                      <div className="insight-value">+{historyData.insights.biggestImprovement.gain}</div>
                      <div className="insight-detail">{historyData.insights.biggestImprovement.commit.sha}</div>
                    </div>
                  </div>
                )}

                {historyData.insights.biggestRegression && (
                  <div className="insight-card regression">
                    <div className="insight-icon">🔥</div>
                    <div className="insight-content">
                      <div className="insight-label">Worst Commit</div>
                      <div className="insight-value">-{historyData.insights.biggestRegression.drop}</div>
                      <div className="insight-detail">{historyData.insights.biggestRegression.commit.sha}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timeline Graph */}
            <div className="timeline-section">
              <h3 className="section-title">
                <span className="title-icon">📈</span>
                Quality Score Over Time
              </h3>
              <div className="timeline-graph">
                {historyData.timeline.map((point, i) => {
                  const maxScore = 100;
                  const height = (point.score / maxScore) * 100;
                  const isFirst = i === 0;
                  const isLast = i === historyData.timeline.length - 1;
                  
                  return (
                    <div key={i} className="timeline-point">
                      <div 
                        className={`point-bar ${point.score > 70 ? 'good' : point.score > 50 ? 'medium' : 'bad'}`}
                        style={{height: `${height}%`}}
                        title={`Score: ${point.score}`}
                      >
                        <span className="point-score">{point.score}</span>
                      </div>
                      <div className="point-info">
                        <div className="point-commit">{point.sha}</div>
                        <div className="point-date">{new Date(point.date).toLocaleDateString()}</div>
                        {(isFirst || isLast) && (
                          <div className="point-badge">
                            {isFirst && '🏁 Latest'}
                            {isLast && '🕰️ Oldest'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commit Details */}
            <div className="commits-section">
              <h3 className="section-title">
                <span className="title-icon">📝</span>
                Commit History
              </h3>
              <div className="commits-list">
                {historyData.timeline.map((commit, i) => {
                  const prevScore = i < historyData.timeline.length - 1 ? historyData.timeline[i + 1].score : commit.score;
                  const change = commit.score - prevScore;
                  
                  return (
                    <div key={i} className="commit-card">
                      <div className="commit-header">
                        <div className="commit-sha">{commit.sha}</div>
                        <div className={`commit-score score-${commit.score > 70 ? 'good' : commit.score > 50 ? 'medium' : 'bad'}`}>
                          {commit.score}
                        </div>
                      </div>
                      <div className="commit-message">{commit.message}</div>
                      <div className="commit-meta">
                        <span className="commit-author">👤 {commit.author}</span>
                        <span className="commit-date">📅 {new Date(commit.date).toLocaleDateString()}</span>
                        <span className="commit-smells">⚠️ {commit.smells} smells</span>
                        {change !== 0 && (
                          <span className={`commit-change ${change > 0 ? 'positive' : 'negative'}`}>
                            {change > 0 ? '📈' : '📉'} {change > 0 ? '+' : ''}{change}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regressions Alert */}
            {historyData.insights?.regressions && historyData.insights.regressions.length > 0 && (
              <div className="regressions-section">
                <h3 className="section-title">
                  <span className="title-icon">⚠️</span>
                  Quality Regressions Detected
                </h3>
                <div className="alert alert-warning">
                  <span className="alert-icon">🔥</span>
                  <div className="alert-content">
                    <strong>Found {historyData.insights.regressions.length} commit(s) that significantly decreased code quality:</strong>
                    <ul className="regression-list">
                      {historyData.insights.regressions.map((reg, i) => (
                        <li key={i}>
                          <strong>{reg.commit}</strong>: "{reg.message}" (dropped {reg.drop} points)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="repo-actions">
              <button className="export-btn" onClick={() => {
                const json = JSON.stringify(historyData, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${historyData.owner}-${historyData.repo}-${historyData.filePath.replace(/\//g, '-')}-history.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                <span>📥</span>
                <span>Download Timeline (JSON)</span>
              </button>
            </div>
          </div>
        )}

        {/* Repository Analysis Results */}
        {repoAnalysis && (
          <div className="results-container repo-results">
            <div className="results-header">
              <h2 className="results-title">
                <span className="title-icon">📦</span>
                Repository Analysis: {repoAnalysis.repository.owner}/{repoAnalysis.repository.repo}
              </h2>
            </div>

            <div className="repo-summary">
              <div className="repo-stat-card">
                <div className="repo-stat-icon">📊</div>
                <div className="repo-stat-content">
                  <div className="repo-stat-value">{repoAnalysis.summary.averageQualityScore}/100</div>
                  <div className="repo-stat-label">Average Quality Score</div>
                </div>
              </div>

              <div className="repo-stat-card">
                <div className="repo-stat-icon">📁</div>
                <div className="repo-stat-content">
                  <div className="repo-stat-value">{repoAnalysis.repository.analyzedFiles}</div>
                  <div className="repo-stat-label">Files Analyzed</div>
                </div>
              </div>

              <div className="repo-stat-card">
                <div className="repo-stat-icon">⚠️</div>
                <div className="repo-stat-content">
                  <div className="repo-stat-value">{repoAnalysis.summary.totalSmells}</div>
                  <div className="repo-stat-label">Code Smells</div>
                </div>
              </div>

              <div className="repo-stat-card">
                <div className="repo-stat-icon">⏱️</div>
                <div className="repo-stat-content">
                  <div className="repo-stat-value">{repoAnalysis.summary.technicalDebtHours}h</div>
                  <div className="repo-stat-label">Technical Debt</div>
                </div>
              </div>
            </div>

            <div className="repo-health">
              <h3 className="section-title">
                <span className="title-icon">💊</span>
                Repository Health
              </h3>
              <div className={`health-indicator health-${repoAnalysis.summary.healthStatus}`}>
                {repoAnalysis.summary.healthStatus === 'healthy' && '✅ Healthy - Code quality is good'}
                {repoAnalysis.summary.healthStatus === 'needs_improvement' && '⚠️ Needs Improvement - Some issues detected'}
                {repoAnalysis.summary.healthStatus === 'critical' && '🔴 Critical - Significant refactoring needed'}
              </div>
            </div>

            <div className="worst-files">
              <h3 className="section-title">
                <span className="title-icon">🔥</span>
                Files Needing Attention (Worst First)
              </h3>
              <div className="file-list">
                {repoAnalysis.worstFiles.map((file, i) => (
                  <div key={i} className="file-item">
                    <div className="file-rank">#{i + 1}</div>
                    <div className="file-info">
                      <div className="file-path">{file.path}</div>
                      <div className="file-meta">
                        <span className="file-language">{file.language}</span>
                        <span className="file-functions">{file.functions} functions</span>
                        <span className="file-smells">{file.totalSmells} smells</span>
                      </div>
                    </div>
                    <div className={`file-score score-${file.qualityScore > 70 ? 'good' : file.qualityScore > 50 ? 'medium' : 'bad'}`}>
                      {file.qualityScore}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="repo-actions">
              <button className="export-btn" onClick={() => {
                const json = JSON.stringify(repoAnalysis, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${repoAnalysis.repository.owner}-${repoAnalysis.repository.repo}-analysis.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                <span>📥</span>
                <span>Download Report (JSON)</span>
              </button>
            </div>
          </div>
        )}

        {analysis && (
          <div className="results-container">
            <div className="results-header">
              <h2 className="results-title">
                <span className="title-icon">📊</span>
                Structural Analysis
              </h2>
            </div>

            {analysis.qualityScore !== undefined && (
              <div className="score-showcase">
                <CircularProgress score={analysis.qualityScore} />
                <div className="score-details">
                  <h3>Code Quality</h3>
                  <p className={`health-status status-${analysis.summary?.healthStatus || 'unknown'}`}>
                    {analysis.summary?.healthStatus === 'healthy' && '✅ Healthy'}
                    {analysis.summary?.healthStatus === 'needs_improvement' && '⚠️ Needs Improvement'}
                    {analysis.summary?.healthStatus === 'critical' && '🔴 Critical'}
                  </p>
                  <div className="score-stats">
                    <div className="stat-item">
                      <span className="stat-value">{analysis.summary?.totalFunctions || 0}</span>
                      <span className="stat-label">Functions</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{analysis.summary?.averageLength || 0}</span>
                      <span className="stat-label">Avg Lines</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{analysis.totalSmells || 0}</span>
                      <span className="stat-label">Issues</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {analysis.totalSmells > 0 && (
              <div className="smells-container">
                <h3 className="section-title">
                  <span className="title-icon">🔍</span>
                  Code Smells Detected
                </h3>
                <div className="smells-grid">
                  {Object.entries(analysis.smellsByType || {}).map(([type, count]) => (
                    <div key={type} className="smell-card">
                      <div className="smell-icon">⚠️</div>
                      <div className="smell-info">
                        <span className="smell-name">{type.replace(/_/g, ' ')}</span>
                        <span className="smell-count">{count} found</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.totalSmells === 0 && analysis.qualityScore === 100 && (
              <div className="perfect-code">
                <div className="perfect-icon">✨</div>
                <h3>Perfect Code!</h3>
                <p>No code smells detected. Your code is clean and well-structured.</p>
              </div>
            )}

            {analysis.functions && analysis.functions.length > 0 && (
              <div className="functions-container">
                <h3 className="section-title">
                  <span className="title-icon">⚙️</span>
                  Function Analysis
                </h3>
                {analysis.functions.map((fn, i) => (
                  <div key={i} className="function-card">
                    <div className="function-header">
                      <h4 className="function-name">{fn.name}</h4>
                      <div className="function-metrics">
                        <span className="metric">📏 {fn.length}L</span>
                        <span className="metric">🌀 {fn.nesting}N</span>
                        <span className="metric">🔀 {fn.branchCount}C</span>
                      </div>
                    </div>
                    
                    {fn.smells && fn.smells.length > 0 ? (
                      <div className="function-issues">
                        {fn.smells.map((smell, j) => {
                          const smellKey = `${i}-${j}`;
                          const aiExplanation = aiExplanations[smellKey];
                          const isAiLoading = aiLoading[smellKey];
                          
                          return (
                            <div key={j} className={`issue-card severity-${smell.severity}`}>
                              <div className="issue-header">
                                <span className="issue-type">{smell.type.replace(/_/g, ' ')}</span>
                                <span className={`severity-badge ${smell.severity}`}>
                                  {smell.severity}
                                </span>
                              </div>
                              <p className="issue-message">{smell.message}</p>
                              <div className="issue-suggestion">
                                <span className="suggestion-icon">💡</span>
                                <span>{smell.suggestion}</span>
                              </div>
                              
                              {/* AI Assistant Button */}
                              {!aiExplanation && (
                                <button 
                                  className="ai-explain-btn"
                                  onClick={() => getAIExplanation(smell, fn.name, smellKey)}
                                  disabled={isAiLoading}
                                >
                                  {isAiLoading ? (
                                    <>
                                      <span className="spinner-small"></span>
                                      <span>AI thinking...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>🤖</span>
                                      <span>Ask AI Assistant</span>
                                    </>
                                  )}
                                </button>
                              )}
                              
                              {/* AI Explanation */}
                              {aiExplanation && (
                                <div className={`ai-explanation ${aiExplanation.isFallback ? 'fallback' : ''}`}>
                                  <div className="ai-header">
                                    <span className="ai-icon">🤖</span>
                                    <span className="ai-label">AI Assistant</span>
                                    {!aiExplanation.isFallback && <span className="ai-badge">Powered by Gemini</span>}
                                  </div>
                                  <p className="ai-text">{aiExplanation.text}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="no-issues">
                        <span className="check-icon">✅</span>
                        <span>No issues found</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="repo-actions">
              <button className="export-btn" onClick={() => {
                const json = JSON.stringify(analysis, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `code-analysis-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                <span>📥</span>
                <span>Download Analysis (JSON)</span>
              </button>
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="suggestions-container">
            <div className="suggestions-header">
              <h2 className="results-title">
                <span className="title-icon">✨</span>
                Refactoring Suggestions
              </h2>
            </div>

            {suggestions.map((s, i) => (
              <div key={i} className="suggestion-card">
                <div className="suggestion-header">
                  <div>
                    <h3 className="suggestion-title">{s.extractedName}</h3>
                    <p className="suggestion-type">{s.type.replace(/_/g, ' ')}</p>
                  </div>
                  <span className={`risk-badge risk-${s.risk}`}>{s.risk} risk</span>
                </div>

                <div className="suggestion-details">
                  <div className="detail-row">
                    {s.parameters && s.parameters.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">Parameters:</span>
                        <span className="detail-value">{s.parameters.join(', ')}</span>
                      </div>
                    )}
                    {s.returns && s.returns.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">Returns:</span>
                        <span className="detail-value">{s.returns.join(', ')}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Lines:</span>
                      <span className="detail-value">{s.linesExtracted}</span>
                    </div>
                  </div>
                </div>

                <div className="code-preview">
                  <div className="preview-header">Extracted Function</div>
                  <pre className="code-block">{s.extractedCode}</pre>
                </div>

                <div className="suggestion-benefit">
                  <p><strong>{s.description}</strong></p>
                  <p>{s.benefit}</p>
                </div>

                <div className="suggestion-actions">
                  <button
                    className="apply-btn"
                    onClick={() => {
                      setCode(s.patchedCode);
                      setSuggestions([]);
                      setSelectedDiff(null);
                    }}
                  >
                    <span>✓</span> Apply Refactoring
                  </button>
                  <button
                    className="diff-btn"
                    onClick={() => setSelectedDiff(s)}
                  >
                    <span>👁️</span> View Changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cobweb of Dependencies - Only shows when analysis has function data */}
        {analysis && analysis.functions && analysis.functions.length > 0 && (
          <Suspense fallback={<div className="loading-cobweb">Loading dependency graph...</div>}>
            <CobwebGraph 
              dependencies={analysis.functions.map((fn, idx) => ({
                id: fn.name || `func_${idx}`,
                name: fn.name || `Function ${idx + 1}`,
                smells: fn.issues?.length || 0,
                type: 'function',
                dependencies: [], // Will be populated if backend provides call graph
                description: `${fn.length || 0} lines, complexity: ${fn.complexity || 0}`
              }))}
              onNodeClick={(node) => console.log('Node clicked:', node)}
            />
          </Suspense>
        )}

        {selectedDiff && (
          <div className="diff-panel">
            <div className="diff-panel-header">
              <h2 className="results-title">
                <span className="title-icon">🔄</span>
                Code Comparison
              </h2>
              <button className="close-btn" onClick={() => setSelectedDiff(null)}>
                ✕
              </button>
            </div>
            <SideBySideDiff
              before={originalCode}
              after={selectedDiff.patchedCode}
            />
          </div>
        )}

        {/* The Eye of the Repository - Living File Tree */}
        <EyeOfRepository
          files={analysis && analysis.functions && analysis.functions.length > 0 
            ? analysis.functions.map((fn, idx) => ({
                name: fn.name || `Function ${idx + 1}`,
                type: 'file',
                score: Math.max(0, 100 - (fn.issues?.length || 0) * 10),
                smells: fn.issues?.length || 0,
                path: `function_${idx}`
              }))
            : [
                { name: 'App.jsx', type: 'file', score: 85, smells: 2, path: 'src/App.jsx' },
                { name: 'utils.js', type: 'file', score: 45, smells: 8, path: 'src/utils.js' },
                { name: 'api.js', type: 'file', score: 92, smells: 1, path: 'src/api.js' },
                { name: 'helpers.js', type: 'file', score: 38, smells: 12, path: 'src/helpers.js' },
                { name: 'config.js', type: 'file', score: 78, smells: 3, path: 'src/config.js' }
              ]
          }
          onFileClick={(file) => {
            console.log('File clicked:', file);
            setConsoleLogs(prev => [...prev, createLog(`Opened file: ${file.name}`, 'info')]);
          }}
          audioEnabled={false}
        />

        {/* Blood-Ink Console - Gothic Horror Output Panel */}
        <BloodInkConsole 
          logs={consoleLogs}
          maxLogs={50}
          autoScroll={true}
        />

        <footer className="footer">
          <p>Powered by AST Analysis • Built for Kiroween 2024</p>
        </footer>
      </div>
    </>
  );
}