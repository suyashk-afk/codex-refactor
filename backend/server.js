// ==========================
// Imports
// ==========================
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");
const axios = require("axios");

const astAnalyzer = require("./refactor-engine/ast-analyzer");
const refactorSuggester = require("./refactor-engine/refactor-suggester/extract_function");
const githubFetcher = require("./github-fetcher");
const commitAnalyzer = require("./commit-analyzer");
const reportGenerator = require("./report-generator");

// Get Gemini API key from environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ==========================
// App Setup
// ==========================
const app = express();

// 🔥 MUST be VERY TOP — before any routes
// Dynamic CORS configuration for local dev and production
const allowedOrigins = [
  'http://localhost:5173',  // Local Vite dev server
  'http://localhost:3000',  // Alternative local port
  'https://codex-refactor-mkjd.vercel.app', // Production frontend
  process.env.FRONTEND_URL, // Environment variable (backup)
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or matches Vercel pattern
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "5mb" }));

// ==========================
// Helper: Detect Language
// ==========================
function detectLanguage(code, filename) {
  // Check filename first
  if (filename) {
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.js') || filename.endsWith('.jsx') || 
        filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'javascript';
  }
  
  // Heuristics based on code content
  const pythonKeywords = ['def ', 'import ', 'from ', 'class ', '__init__', 'self.'];
  const hasPythonSyntax = pythonKeywords.some(keyword => code.includes(keyword));
  
  if (hasPythonSyntax && code.includes(':') && !code.includes('{')) {
    return 'python';
  }
  
  return 'javascript'; // Default to JavaScript
}

// ==========================
// Helper: Analyze Python Code
// ==========================
function analyzePythonCode(code, filename) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'refactor-engine', 'python-analyzer', 'analyzer.py');
    
    // Use 'python' or 'python3' depending on your system
    const python = spawn('python', [pythonScript]);
    
    let output = '';
    let errorOutput = '';
    
    // Send code to Python script via stdin
    const input = JSON.stringify({ code, filename: filename || 'file.py' });
    python.stdin.write(input);
    python.stdin.end();
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    python.on('close', (exitCode) => {
      if (exitCode !== 0) {
        reject(new Error(`Python analyzer failed: ${errorOutput}`));
      } else {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (err) {
          reject(new Error(`Failed to parse Python output: ${output}`));
        }
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      python.kill();
      reject(new Error('Python analyzer timeout'));
    }, 30000);
  });
}

// ==========================
// Helper: Suggest Python Refactoring (NEW!)
// ==========================
function suggestPythonRefactoring(code, filename) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'refactor-engine', 'python-analyzer', 'refactor_suggester.py');
    
    // Use 'python' or 'python3' depending on your system
    const python = spawn('python', [pythonScript]);
    
    let output = '';
    let errorOutput = '';
    
    // Send code to Python script via stdin
    const input = JSON.stringify({ code, filename: filename || 'file.py' });
    python.stdin.write(input);
    python.stdin.end();
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    python.on('close', (exitCode) => {
      if (exitCode !== 0) {
        reject(new Error(`Python refactoring suggester failed: ${errorOutput}`));
      } else {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (err) {
          reject(new Error(`Failed to parse Python refactoring output: ${output}`));
        }
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      python.kill();
      reject(new Error('Python refactoring suggester timeout'));
    }, 30000);
  });
}

// ==========================
// Health Check
// ==========================
app.get("/", (req, res) => {
  res.send("Backend is working! Supports JavaScript/TypeScript and Python 🐍");
});

// ==========================
// ANALYZE ROUTE (Multi-language)
// ==========================
app.post("/analyze", async (req, res) => {
  const { code, filename } = req.body;

  if (!code) return res.status(400).json({ error: "No code given" });

  try {
    // Detect language
    const language = detectLanguage(code, filename || "file.js");
    
    let analysis;
    
    if (language === 'python') {
      // Use Python analyzer
      analysis = await analyzePythonCode(code, filename || "file.py");
    } else {
      // Use JavaScript analyzer
      analysis = astAnalyzer.analyzeCode(code, filename || "file.js");
    }
    
    // Check if there was a parse error
    if (analysis.error) {
      return res.status(400).json({ 
        ok: false, 
        error: analysis.error,
        details: analysis.details 
      });
    }
    
    res.json({ ok: true, analysis, language });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ==========================
// SUGGEST ROUTE (Multi-language!) (UPDATED!)
// ==========================
app.post("/suggest", async (req, res) => {
  const { code, filename } = req.body || {};

  if (!code) {
    return res.status(400).json({
      error: "No 'code' field in request body",
      receivedBody: req.body,
    });
  }

  try {
    // Detect language
    const language = detectLanguage(code, filename);
    
    let result;
    
    if (language === 'python') {
      // Use Python refactoring suggester
      result = await suggestPythonRefactoring(code, filename || "file.py");
    } else {
      // Use JavaScript refactoring suggester
      result = refactorSuggester.suggestExtractFunction(
        code,
        filename || "file.js"
      );
    }
    
    // Check if there was an error
    if (result.error) {
      return res.status(400).json(result);
    }
    
    // Return result directly (already has ok, suggestions, summary)
    res.json(result);
  } catch (err) {
    console.error("Refactoring error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ==========================
// ANALYZE REPOSITORY ROUTE (NEW!)
// ==========================
app.post("/analyze-repo", async (req, res) => {
  const { repoUrl, maxFiles = 30 } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: "No repository URL provided" });
  }

  try {
    // Fetch repository files
    const repoData = await githubFetcher.fetchRepository(repoUrl, { maxFiles });
    
    // Analyze each file
    const results = [];
    let totalScore = 0;
    let totalSmells = 0;
    let totalFunctions = 0;
    let totalComplexity = 0;
    let totalToxicity = 0;
    let totalLines = 0;
    let criticalFiles = 0;
    
    for (const file of repoData.files) {
      try {
        const language = detectLanguage(file.content, file.path);
        let analysis;
        
        if (language === 'python') {
          analysis = await analyzePythonCode(file.content, file.path);
        } else {
          analysis = astAnalyzer.analyzeCode(file.content, file.path);
        }
        
        if (!analysis.error) {
          const fileLines = file.content.split('\n').length;
          
          results.push({
            path: file.path,
            language,
            qualityScore: analysis.qualityScore || 0,
            complexity: analysis.avgComplexity || 0,
            toxicity: analysis.toxicityScore || 0,
            totalSmells: analysis.totalSmells || 0,
            functions: analysis.functions?.length || 0,
            lines: fileLines,
            size: file.size
          });
          
          totalScore += analysis.qualityScore || 0;
          totalSmells += analysis.totalSmells || 0;
          totalFunctions += analysis.functions?.length || 0;
          totalComplexity += (analysis.avgComplexity || 0) * (analysis.functions?.length || 0);
          totalToxicity += analysis.toxicityScore || 0;
          totalLines += fileLines;
          
          if (analysis.qualityScore < 50) criticalFiles++;
        }
      } catch (err) {
        console.error(`Error analyzing ${file.path}:`, err.message);
      }
    }
    
    // Calculate scientific repository metrics
    const fileCount = results.length;
    const avgScore = fileCount > 0 ? Math.round(totalScore / fileCount) : 0;
    const avgComplexity = totalFunctions > 0 ? Math.round((totalComplexity / totalFunctions) * 10) / 10 : 0;
    const avgToxicity = fileCount > 0 ? Math.round(totalToxicity / fileCount) : 0;
    
    // Code density: smells per 1000 lines of code (industry standard)
    const smellDensity = totalLines > 0 ? Math.round((totalSmells / totalLines) * 1000 * 10) / 10 : 0;
    
    // Maintainability Index (weighted score considering multiple factors)
    const maintainabilityIndex = Math.round(
      avgScore * 0.5 +                    // 50% quality score
      (100 - avgToxicity) * 0.3 +         // 30% inverse toxicity
      Math.max(0, 100 - avgComplexity * 5) * 0.2  // 20% complexity penalty
    );
    
    // Technical debt (scientific: severity-weighted remediation time)
    // Calculate based on actual severity distribution
    let debtMinutes = 0;
    results.forEach(file => {
      // Estimate severity distribution (since we don't track it per file yet)
      // Assume: 10% critical, 30% high, 40% medium, 20% low
      const smells = file.totalSmells || 0;
      debtMinutes += smells * 0.10 * 120; // Critical: 2h
      debtMinutes += smells * 0.30 * 60;  // High: 1h
      debtMinutes += smells * 0.40 * 30;  // Medium: 30min
      debtMinutes += smells * 0.20 * 15;  // Low: 15min
    });
    const technicalDebtHours = Math.round(debtMinutes / 60);
    
    // Sort by quality score (worst first)
    results.sort((a, b) => a.qualityScore - b.qualityScore);
    
    res.json({
      ok: true,
      repository: {
        owner: repoData.owner,
        repo: repoData.repo,
        totalFiles: repoData.totalFiles,
        analyzedFiles: repoData.analyzedFiles
      },
      summary: {
        averageQualityScore: avgScore,
        averageComplexity: avgComplexity,
        averageToxicity: avgToxicity,
        maintainabilityIndex,
        totalSmells,
        totalFunctions,
        totalLines,
        smellDensity, // Smells per 1000 lines (industry standard)
        technicalDebtHours,
        criticalFiles,
        healthStatus: maintainabilityIndex > 70 ? 'healthy' : maintainabilityIndex > 50 ? 'needs_improvement' : 'critical'
      },
      files: results,
      worstFiles: results.slice(0, 10) // Top 10 worst files
    });
    
  } catch (err) {
    console.error("Repository analysis error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ==========================
// LIST REPOSITORY FILES (HELPER)
// ==========================
app.post("/list-files", async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: "Repository URL required" });
  }

  try {
    const { owner, repo } = githubFetcher.parseGitHubUrl(repoUrl);
    const files = await commitAnalyzer.listRepositoryFiles(owner, repo);
    
    res.json({
      ok: true,
      files,
      suggestion: files.length > 0 ? `Try: ${files[0]}` : "No files found"
    });
  } catch (err) {
    console.error("List files error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ==========================
// ANALYZE FILE HISTORY ROUTE (TIME MACHINE!)
// ==========================
app.post("/analyze-history", async (req, res) => {
  const { repoUrl, filePath, maxCommits = 10 } = req.body;

  if (!repoUrl || !filePath) {
    return res.status(400).json({ error: "Repository URL and file path required" });
  }

  try {
    // Create analysis function that handles both JS and Python
    const analyzeFunction = async (code, filename) => {
      const language = detectLanguage(code, filename);
      
      if (language === 'python') {
        return await analyzePythonCode(code, filename);
      } else {
        return astAnalyzer.analyzeCode(code, filename);
      }
    };
    
    // Analyze commit history
    const result = await commitAnalyzer.analyzeCommitHistory(
      repoUrl,
      filePath,
      analyzeFunction,
      { maxCommits }
    );
    
    res.json({
      ok: true,
      ...result
    });
    
  } catch (err) {
    console.error("History analysis error:", err);
    
    // If file not found, suggest available files
    if (err.message.includes('not found') || err.message.includes('No commits')) {
      try {
        const { owner, repo } = githubFetcher.parseGitHubUrl(repoUrl);
        const files = await commitAnalyzer.listRepositoryFiles(owner, repo);
        
        return res.status(404).json({ 
          ok: false, 
          error: err.message,
          suggestions: files.slice(0, 5),
          hint: files.length > 0 ? `Try one of these: ${files.slice(0, 3).join(', ')}` : "No .js files found in repository"
        });
      } catch (listErr) {
        // If we can't list files, just return the original error
        return res.status(500).json({ ok: false, error: err.message });
      }
    }
    
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ==========================
// GENERATE MARKDOWN REPORT
// ==========================
app.post("/generate-report", (req, res) => {
  const { type, data, filename } = req.body;
  
  if (!type || !data) {
    return res.status(400).json({ error: "Type and data required" });
  }
  
  try {
    let markdown;
    
    switch (type) {
      case 'analysis':
        markdown = reportGenerator.generateAnalysisReport(data, filename || 'code.js');
        break;
      case 'repository':
        markdown = reportGenerator.generateRepositoryReport(data);
        break;
      case 'timeline':
        markdown = reportGenerator.generateTimelineReport(data);
        break;
      default:
        return res.status(400).json({ error: "Invalid report type" });
    }
    
    res.json({ ok: true, markdown });
  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ==========================
// AI ASSISTANT ENDPOINT (NEW!)
// ==========================
app.post("/ai-explain", async (req, res) => {
  const { smell, code, functionName } = req.body;
  
  if (!smell) {
    return res.status(400).json({ error: "Smell data required" });
  }
  
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    
    // Get more context - the actual function code if available
    const codeContext = code ? code.substring(0, 500) : 'N/A';
    
    const prompt = `You're a friendly code mentor helping a developer improve their code.

The code has this issue: ${smell.message}

Here's the actual code:
\`\`\`javascript
${codeContext}
\`\`\`

Explain in a friendly, conversational way:
1. What's wrong (in simple terms)
2. How to fix it (practical advice)
3. Show a quick example

Write like you're talking to a colleague, not writing a textbook. Keep it under 3 sentences plus a small code example. Be encouraging and specific to THIS code.`;
    
    // Direct API call to Gemini (try stable model first)
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    const explanation = response.data.candidates[0].content.parts[0].text;
    
    res.json({ 
      ok: true, 
      explanation: explanation.trim(),
      fallback: false
    });
  } catch (err) {
    console.error("AI explanation error:", err.response?.data || err.message);
    console.error("Full error:", JSON.stringify(err.response?.data, null, 2));
    // Graceful fallback to original suggestion
    res.json({ 
      ok: true, 
      explanation: smell.suggestion || "Consider refactoring this code to improve quality.",
      fallback: true,
      error: err.response?.data?.error?.message || err.message // Include error for debugging
    });
  }
});

// ==========================
// MR. SMITH AI ANALYSIS
// ==========================
app.post("/mr-smith", async (req, res) => {
  const { qualityScore, complexity, toxicity, totalSmells, functionCount } = req.body;
  
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    
    const prompt = `You are Mr. Smith, a technical code analyst. Analyze this code metrics and provide ONE concise technical insight (max 2 sentences):

Quality Score: ${qualityScore}/100
Complexity: ${complexity}%
Toxicity: ${toxicity}%
Total Issues: ${totalSmells}
Functions: ${functionCount}

Respond in Mr. Smith's style: professional, direct, technical. Focus on the MOST CRITICAL issue. Use terms like "exhibits", "requires", "demonstrates". Keep it under 25 words.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100
        }
      }
    );

    const analysis = response.data.candidates[0].content.parts[0].text.trim();
    res.json({ ok: true, analysis });
  } catch (err) {
    console.error("Mr. Smith AI error:", err.response?.data || err.message);
    console.error("Full error:", JSON.stringify(err.response?.data, null, 2));
    res.json({ 
      ok: true, 
      analysis: `Quality: ${qualityScore}. System requires optimization.`,
      fallback: true,
      error: err.response?.data?.error?.message || err.message // Include error for debugging
    });
  }
});

// ==========================
// Server Listen
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server listening on port ${PORT}`);
  console.log(`📦 Supporting JavaScript/TypeScript and Python refactoring!`);
  
  if (!GEMINI_API_KEY) {
    console.log(`\n⚠️  WARNING: GEMINI_API_KEY not configured!`);
    console.log(`   Mr. Smith AI analysis will not work.`);
    console.log(`   Get your FREE key: https://aistudio.google.com/app/apikey`);
    console.log(`   Add it to backend/.env file\n`);
  } else {
    console.log(`✅ Gemini AI enabled - Mr. Smith is ready!\n`);
  }
});