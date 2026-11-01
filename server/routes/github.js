const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const GITHUB_API = 'https://api.github.com';

// Helper to get headers with user's own GitHub token
const getUserHeaders = async (userId) => {
  const user = await User.findById(userId);
  if (!user?.githubAccessToken) return null;

  return {
    Authorization: `token ${user.githubAccessToken}`,
    Accept: 'application/vnd.github.v3+json'
  };
};

const resolveOwner = async (req, headers) => {
  if (req.query.owner) return req.query.owner;

  const response = await axios.get(`${GITHUB_API}/user`, { headers });
  return response.data.login;
};

const getDefaultBranch = async (owner, repo, headers) => {
  const response = await axios.get(
    `${GITHUB_API}/repos/${owner}/${repo}`,
    { headers }
  );
  return response.data.default_branch || 'main';
};

// GET all repos
router.get('/repos', authMiddleware, async (req, res) => {
  try {
    const headers = await getUserHeaders(req.user.id);
    if (!headers) {
      return res.status(401).json({ message: 'GitHub not connected', notConnected: true });
    }

    const response = await axios.get(
      `${GITHUB_API}/user/repos?sort=updated&per_page=20`,
      { headers }
    );

    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      private: repo.private
    }));

    res.json(repos);
  } catch (err) {
    res.status(500).json({ message: 'GitHub API error', error: err.message });
  }
});

// GET commits for a repo
router.get('/repos/:repoName/commits', authMiddleware, async (req, res) => {
  try {
    const { repoName } = req.params;
    const headers = await getUserHeaders(req.user.id);
    if (!headers) {
      return res.status(401).json({ message: 'GitHub not connected', notConnected: true });
    }
    const owner = await resolveOwner(req, headers);
    const branch = await getDefaultBranch(owner, repoName, headers);

    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repoName}/commits?sha=${encodeURIComponent(branch)}&per_page=10`,
      { headers }
    );

    const commits = response.data.map(commit => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message,
      date: commit.commit.author.date,
      author: commit.commit.author.name,
      url: commit.html_url
    }));

    res.json(commits);
  } catch (err) {
    res.status(500).json({ message: 'GitHub API error', error: err.message });
  }
});

// GET user github profile stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const headers = await getUserHeaders(req.user.id);
    if (!headers) {
      return res.status(401).json({ message: 'GitHub not connected', notConnected: true });
    }
    const response = await axios.get(
      `${GITHUB_API}/user`,
      { headers }
    );

    const stats = {
      username: response.data.login,
      avatar: response.data.avatar_url,
      name: response.data.name,
      bio: response.data.bio,
      public_repos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following
    };

    res.json(stats);
  } catch (err) {
    console.error('Failed to fetch GitHub stats:', err);
    res.status(500).json({ message: 'GitHub API error', error: err.message });
  }
});

// GET file content from repo
router.get('/repos/:repoName/file', authMiddleware, async (req, res) => {
  try {
    const { repoName } = req.params;
    const { path } = req.query;
    const headers = await getUserHeaders(req.user.id);
    if (!headers) {
      return res.status(401).json({ message: 'GitHub not connected', notConnected: true });
    }
    const owner = await resolveOwner(req, headers);
    const branch = await getDefaultBranch(owner, repoName, headers);

    // First get file tree
    const treeRes = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repoName}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
      { headers }
    );

    // Find first JS/JSX file if no path specified
    const filePath = path || treeRes.data.tree
      .find(f => f.type === 'blob' &&
        (f.path.endsWith('.js') || f.path.endsWith('.jsx')))?.path;

    if (!filePath) {
      return res.json({ content: '// No files found', path: '' });
    }

    // Get file content
    const contentRes = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repoName}/contents/${filePath}`,
      { headers, params: { ref: branch } }
    );

    // Decode base64 content
    const content = Buffer.from(contentRes.data.content, 'base64').toString('utf-8');

    res.json({ content, path: filePath });
  } catch (err) {
    res.status(500).json({ message: 'GitHub API error', error: err.message });
  }
});

// GET file list from repo
router.get('/repos/:repoName/files', authMiddleware, async (req, res) => {
  try {
    const { repoName } = req.params;
    const headers = await getUserHeaders(req.user.id);
    if (!headers) {
      return res.status(401).json({ message: 'GitHub not connected', notConnected: true });
    }
    const owner = await resolveOwner(req, headers);
    const branch = await getDefaultBranch(owner, repoName, headers);

    let treeRes;
    try {
      treeRes = await axios.get(
        `${GITHUB_API}/repos/${owner}/${repoName}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
        { headers }
      );
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 409) {
        return res.json({ files: [] });
      }
      throw err;
    }

    const files = treeRes.data.tree
      .filter(f => f.type === 'blob' &&
        /\.(js|jsx|ts|tsx|py|java|c|cpp|cs|go|rb|php|html|css|scss|sql|md|json)$/i.test(f.path) &&
        !/(^|\/)(node_modules|dist|build|\.git)(\/|$)/i.test(f.path) &&
        !/(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$/i.test(f.path))
      .slice(0, 50)
      .map(f => f.path);

    res.json({ files });
  } catch (err) {
    res.status(500).json({ message: 'GitHub API error', error: err.message });
  }
});

// Security Audit — GitHub Vulnerability API
router.get('/security/audit', authMiddleware, async (req, res) => {
  try {
    const repoName = req.query.repo || 'devpulse';
    const headers = await getUserHeaders(req.user.id);
    if (!headers) {
      return res.status(401).json({ message: 'GitHub not connected', notConnected: true });
    }
    const owner = await resolveOwner(req, headers);
    const branch = await getDefaultBranch(owner, repoName, headers);

    // Get package.json from repo to extract dependencies
    let packageJson = { dependencies: {}, devDependencies: {} };

    try {
      // Try root package.json first
      const packageRes = await axios.get(
        `${GITHUB_API}/repos/${owner}/${repoName}/contents/package.json`,
        { headers, params: { ref: branch } }
      );
      packageJson = JSON.parse(
        Buffer.from(packageRes.data.content, 'base64').toString('utf-8')
      );
    } catch (pkgErr) {
      // Try client/package.json
      try {
        const packageRes = await axios.get(
          `${GITHUB_API}/repos/${owner}/${repoName}/contents/client/package.json`,
          { headers, params: { ref: branch } }
        );
        packageJson = JSON.parse(
          Buffer.from(packageRes.data.content, 'base64').toString('utf-8')
        );
      } catch (pkgErr2) {
        // Return empty audit if no package.json found
        return res.json({
          counts: { critical: 0, high: 0, moderate: 0, low: 0, info: 0 },
          vulnerabilities: [],
          totalDependencies: 0,
          scannedAt: new Date().toISOString(),
          repo: `${owner}/${repoName}`,
          message: 'No package.json found in this repo'
        });
      }
    }

    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    // Try GitHub vulnerability alerts API
    let vulnAlerts = [];
    try {
      const alertsRes = await axios.get(
        `${GITHUB_API}/repos/${owner}/${repoName}/vulnerability-alerts`,
        {
          headers: {
            ...headers,
            Accept: 'application/vnd.github.dorian-preview+json'
          }
        }
      );
      vulnAlerts = alertsRes.data || [];
    } catch (alertErr) {
      // Vulnerability alerts might not be enabled
      vulnAlerts = [];
    }

    // Use OSV API to check dependencies for vulnerabilities
    const osvResults = [];
    const packageNames = Object.keys(dependencies).slice(0, 20);

    for (const pkg of packageNames) {
      try {
        const osvRes = await axios.post(
          'https://api.osv.dev/v1/query',
          {
            package: {
              name: pkg,
              ecosystem: 'npm'
            }
          }
        );

        if (osvRes.data.vulns && osvRes.data.vulns.length > 0) {
          // Get severity score and convert to level
          const cvssScore = osvRes.data.vulns[0].severity?.[0]?.score || 0;
          const severityLevel = cvssScore >= 9 ? 'critical' :
            cvssScore >= 7 ? 'high' :
              cvssScore >= 4 ? 'moderate' : 'low';

          osvResults.push({
            name: pkg,
            version: dependencies[pkg],
            severity: severityLevel,
            via: osvRes.data.vulns.map(v => v.summary || v.id).slice(0, 2),
            fixAvailable: true,
            osvId: osvRes.data.vulns[0].id
          });
        }
      } catch (osvErr) {
        // Skip package if OSV check fails
      }
    }

    // Count by severity
    const counts = {
      critical: osvResults.filter(v => v.severity === 'CRITICAL').length,
      high: osvResults.filter(v => v.severity === 'HIGH').length,
      moderate: osvResults.filter(v => v.severity === 'MODERATE' || v.severity === 'moderate').length,
      low: osvResults.filter(v => v.severity === 'LOW' || v.severity === 'low').length,
      info: 0
    };

    res.json({
      counts,
      vulnerabilities: osvResults,
      totalDependencies: Object.keys(dependencies).length,
      scannedAt: new Date().toISOString(),
      repo: `${owner}/${repoName}`
    });

  } catch (err) {
    res.status(500).json({ message: 'Audit error', error: err.message });
  }
});

module.exports = router;
