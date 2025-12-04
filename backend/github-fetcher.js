// GitHub Repository Fetcher
const axios = require('axios');

/**
 * Parse GitHub URL to extract owner and repo
 * @param {string} url - GitHub repository URL
 * @returns {object} - { owner, repo }
 */
function parseGitHubUrl(url) {
  // Handle various GitHub URL formats
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)/,  // https://github.com/owner/repo
    /github\.com\/([^\/]+)\/([^\/]+)\.git/,  // https://github.com/owner/repo.git
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace('.git', '')
      };
    }
  }
  
  throw new Error('Invalid GitHub URL format');
}

/**
 * Fetch repository tree from GitHub API
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Array>} - Array of file objects
 */
async function fetchRepoTree(owner, repo) {
  try {
    // Get default branch
    const repoInfo = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Refactor-Codex'
        }
      }
    );
    
    const defaultBranch = repoInfo.data.default_branch;
    
    // Get repository tree (recursive)
    const treeResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Refactor-Codex'
        }
      }
    );
    
    return treeResponse.data.tree;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Repository not found or is private');
    } else if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Try again later.');
    }
    throw new Error(`Failed to fetch repository: ${error.message}`);
  }
}

/**
 * Filter files by extension
 * @param {Array} tree - Repository tree
 * @param {Array} extensions - File extensions to include
 * @returns {Array} - Filtered files
 */
function filterFilesByExtension(tree, extensions = ['.js', '.jsx', '.ts', '.tsx', '.py']) {
  return tree.filter(item => {
    if (item.type !== 'blob') return false;
    return extensions.some(ext => item.path.endsWith(ext));
  });
}

/**
 * Fetch file content from GitHub
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path
 * @returns {Promise<string>} - File content
 */
async function fetchFileContent(owner, repo, path) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'Refactor-Codex'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error.message);
    return null;
  }
}

/**
 * Fetch multiple files with rate limiting
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {Array} files - Array of file objects
 * @param {number} maxFiles - Maximum files to fetch
 * @returns {Promise<Array>} - Array of { path, content }
 */
async function fetchMultipleFiles(owner, repo, files, maxFiles = 50) {
  const filesToFetch = files.slice(0, maxFiles);
  const results = [];
  
  // Fetch files with delay to avoid rate limiting
  for (let i = 0; i < filesToFetch.length; i++) {
    const file = filesToFetch[i];
    
    const content = await fetchFileContent(owner, repo, file.path);
    
    if (content) {
      results.push({
        path: file.path,
        content: content,
        size: file.size
      });
    }
    
    // Small delay to avoid rate limiting
    if (i < filesToFetch.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * Main function to fetch repository files
 * @param {string} repoUrl - GitHub repository URL
 * @param {object} options - Options { maxFiles, extensions }
 * @returns {Promise<object>} - { owner, repo, files }
 */
async function fetchRepository(repoUrl, options = {}) {
  const { maxFiles = 50, extensions = ['.js', '.jsx', '.ts', '.tsx', '.py'] } = options;
  
  // Parse URL
  const { owner, repo } = parseGitHubUrl(repoUrl);
  
  // Fetch repository tree
  const tree = await fetchRepoTree(owner, repo);
  
  // Filter files by extension
  const codeFiles = filterFilesByExtension(tree, extensions);
  
  // Fetch file contents
  const files = await fetchMultipleFiles(owner, repo, codeFiles, maxFiles);
  
  return {
    owner,
    repo,
    totalFiles: codeFiles.length,
    analyzedFiles: files.length,
    files
  };
}

module.exports = {
  fetchRepository,
  parseGitHubUrl
};
