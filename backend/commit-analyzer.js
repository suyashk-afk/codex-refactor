// Commit History Analyzer - The Time Machine
const axios = require('axios');
const { parseGitHubUrl } = require('./github-fetcher');

/**
 * Fetch file content at a specific commit
 */
async function fetchFileAtCommit(owner, repo, path, sha) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${sha}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'Refactor-Codex'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${path} at ${sha}:`, error.message);
    return null;
  }
}

/**
 * Fetch commit history for a specific file
 */
async function fetchCommitHistory(owner, repo, path, maxCommits = 10) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      {
        params: {
          path: path,
          per_page: maxCommits
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Refactor-Codex'
        }
      }
    );
    
    if (response.data.length === 0) {
      throw new Error(`No commits found for file: ${path}. The file might not exist or has no commit history. Common paths: src/index.js, lib/main.js, test/test.js`);
    }
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`File not found: ${path}. Make sure the path is correct and the file exists in the repository.`);
    } else if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Wait 1 hour or try fewer commits.');
    }
    throw new Error(`Failed to fetch commit history: ${error.message}`);
  }
}

/**
 * Analyze code quality over commit history
 */
async function analyzeCommitHistory(repoUrl, filePath, analyzeFunction, options = {}) {
  const { maxCommits = 10 } = options;
  
  // Parse repository URL
  const { owner, repo } = parseGitHubUrl(repoUrl);
  
  // Fetch commit history
  const commits = await fetchCommitHistory(owner, repo, filePath, maxCommits);
  
  const timeline = [];
  
  // Analyze each commit
  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i];
    
    // Fetch file content at this commit
    const content = await fetchFileAtCommit(owner, repo, filePath, commit.sha);
    
    if (!content) {
      continue;
    }
    
    // Analyze code
    try {
      const analysis = await analyzeFunction(content, filePath);
      
      // Only add to timeline if we got a valid quality score
      if (!analysis.error && analysis.qualityScore !== undefined && analysis.qualityScore !== null) {
        timeline.push({
          sha: commit.sha.substring(0, 7),
          fullSha: commit.sha,
          date: commit.commit.author.date,
          message: commit.commit.message.split('\n')[0], // First line only
          author: commit.commit.author.name,
          score: analysis.qualityScore,
          smells: analysis.totalSmells || 0,
          functions: analysis.functions?.length || 0
        });
      } else if (analysis.error) {
        // Skip commits with parse errors (old syntax, etc.)
        console.error(`Skipping commit ${commit.sha.substring(0, 7)}: ${analysis.error}`);
      }
    } catch (err) {
      console.error(`Error analyzing commit ${commit.sha.substring(0, 7)}:`, err.message);
    }
    
    // Small delay to avoid rate limiting
    if (i < commits.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  // Check if we have enough data
  if (timeline.length === 0) {
    throw new Error(`Could not analyze any commits for ${filePath}. The file might use syntax that's too old or incompatible.`);
  }
  
  // Calculate insights
  const insights = calculateInsights(timeline);
  
  return {
    owner,
    repo,
    filePath,
    timeline,
    insights
  };
}

/**
 * Calculate insights from timeline data
 */
function calculateInsights(timeline) {
  if (timeline.length === 0) {
    return null;
  }
  
  // Sort by date (oldest first)
  const sorted = [...timeline].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];
  
  // Overall trend
  const overallChange = newest.score - oldest.score;
  const overallTrend = overallChange > 5 ? 'improving' : overallChange < -5 ? 'declining' : 'stable';
  
  // Find biggest regression
  let biggestRegression = null;
  let maxDrop = 0;
  
  for (let i = 1; i < sorted.length; i++) {
    const drop = sorted[i - 1].score - sorted[i].score;
    if (drop > maxDrop) {
      maxDrop = drop;
      biggestRegression = {
        commit: sorted[i],
        previousScore: sorted[i - 1].score,
        drop: drop
      };
    }
  }
  
  // Find biggest improvement
  let biggestImprovement = null;
  let maxGain = 0;
  
  for (let i = 1; i < sorted.length; i++) {
    const gain = sorted[i].score - sorted[i - 1].score;
    if (gain > maxGain) {
      maxGain = gain;
      biggestImprovement = {
        commit: sorted[i],
        previousScore: sorted[i - 1].score,
        gain: gain
      };
    }
  }
  
  // Calculate average score
  const avgScore = Math.round(
    sorted.reduce((sum, point) => sum + point.score, 0) / sorted.length
  );
  
  // Find best and worst scores
  const scores = sorted.map(point => point.score);
  const bestScore = Math.max(...scores);
  const worstScore = Math.min(...scores);
  
  // Detect regressions (drops > 10 points)
  const regressions = [];
  for (let i = 1; i < sorted.length; i++) {
    const drop = sorted[i - 1].score - sorted[i].score;
    if (drop > 10) {
      regressions.push({
        commit: sorted[i].sha,
        message: sorted[i].message,
        drop: drop,
        date: sorted[i].date
      });
    }
  }
  
  return {
    overallChange,
    overallTrend,
    biggestRegression,
    biggestImprovement,
    avgScore,
    bestScore,
    worstScore,
    regressions,
    totalCommits: timeline.length,
    timespan: {
      start: oldest.date,
      end: newest.date
    }
  };
}

/**
 * List files in repository to help find correct path
 */
async function listRepositoryFiles(owner, repo, extension = '.js') {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Refactor-Codex'
        }
      }
    );
    
    // Filter for files with the extension
    const files = response.data.tree
      .filter(item => item.type === 'blob' && item.path.endsWith(extension))
      .map(item => item.path)
      .slice(0, 20); // Return first 20 files
    
    return files;
  } catch (error) {
    // Try 'master' branch if 'main' fails
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Refactor-Codex'
          }
        }
      );
      
      const files = response.data.tree
        .filter(item => item.type === 'blob' && item.path.endsWith(extension))
        .map(item => item.path)
        .slice(0, 20);
      
      return files;
    } catch (err) {
      return [];
    }
  }
}

module.exports = {
  analyzeCommitHistory,
  fetchCommitHistory,
  fetchFileAtCommit,
  listRepositoryFiles
};
