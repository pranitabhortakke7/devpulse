import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AppContext = createContext();

const initialWorkspaceMessages = [
  { id: 1, text: "👋 Welcome to the DevPulse AI OS Cockpit. I have mapped your codebase layout.", sender: 'bot' },
  { id: 2, text: "You can click on files in the repository explorer, view analytics, run security audits, or trigger a command using the Cmd+K Omnibar.", sender: 'bot' }
];

const initialChatMessages = [
  { id: 1, text: "🤖 DevBot AI Chat Core initialized. Secure connection established.", sender: "bot" },
  { id: 2, text: "I have access to your active repository context files. Ask me to explain code, check performance, scan security packages, or write documentation templates.", sender: "bot" }
];

export const AppContextProvider = ({ children }) => {
  // ===== Routing State =====
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token'));
  const [verifiedAuthToken, setVerifiedAuthToken] = useState(null);

  // ===== GitHub / Repo State =====
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubChecked, setGithubChecked] = useState(false);
  const [githubStats, setGithubStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [activeRepo, setActiveRepo] = useState('');
  const [repoFilesList, setRepoFilesList] = useState([]);

  // ===== Commits State =====
  const [commits, setCommits] = useState([]);
  const [commitsLoading, setCommitsLoading] = useState(false);

  // ===== Security Audit State =====
  const [auditData, setAuditData] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);

  // ===== Analytics State =====
  const [analyticsData, setAnalyticsData] = useState(null);

  // ===== Code Studio State =====
  const [codeContent, setCodeContent] = useState('');
  const [activeFile, setActiveFile] = useState('src/App.jsx');

  // ===== Workspace / DevBot Chat State =====
  const [workspaceMessages, setWorkspaceMessages] = useState(initialWorkspaceMessages);

  // ===== Immersive AI Chat State =====
  const [chatMessages, setChatMessages] = useState(initialChatMessages);

  // ===== Changelog Generator State =====
  const [changelogContent, setChangelogContent] = useState('');
  const [changelogLoading, setChangelogLoading] = useState(false);

  // ===== README Generator State =====
  const [readmeContent, setReadmeContent] = useState('');
  const [readmeLoading, setReadmeLoading] = useState(false);

  // ===== Main useEffect: popstate router and authentication changes =====
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    const handleAuthTokenChange = () => {
      setAuthToken(localStorage.getItem('token'));
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('auth-token-changed', handleAuthTokenChange);
    window.addEventListener('storage', handleAuthTokenChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('auth-token-changed', handleAuthTokenChange);
      window.removeEventListener('storage', handleAuthTokenChange);
    };
  }, []);

  useEffect(() => {
    setGithubChecked(false);
    setGithubConnected(false);
    setVerifiedAuthToken(null);
    setGithubStats(null);
    setRepos([]);
    setRepoLoading(false);
    setActiveRepo('');
    setRepoFilesList([]);
    setCommits([]);
    setCommitsLoading(false);
    setAuditData(null);
    setAuditLoading(false);
    setAnalyticsData(null);
    setCodeContent('');
    setActiveFile('src/App.jsx');
    setWorkspaceMessages(initialWorkspaceMessages);
    setChatMessages(initialChatMessages);
    setChangelogContent('');
    setChangelogLoading(false);
    setReadmeContent('');
    setReadmeLoading(false);
  }, [authToken]);

  useEffect(() => {
    let cancelled = false;
    setGithubChecked(false);
    setGithubConnected(false);
    setVerifiedAuthToken(null);

    if (!authToken) {
      if (!cancelled) setGithubChecked(true);
      return () => {
        cancelled = true;
      };
    }

    axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(response => {
        if (!cancelled) {
          setGithubConnected(!!response.data.githubConnected);
          setVerifiedAuthToken(authToken);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('Failed to check GitHub connection:', err);
          setGithubConnected(false);
          setVerifiedAuthToken(authToken);
        }
      })
      .finally(() => {
        if (!cancelled) setGithubChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  useEffect(() => {
    if (!githubChecked || !githubConnected || !authToken || verifiedAuthToken !== authToken) {
      setRepos([]);
      setGithubStats(null);
      setRepoLoading(false);
      setActiveRepo('');
      return;
    }

    let cancelled = false;

    const fetchRepos = async () => {
      try {
        setRepoLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/github/repos`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (cancelled) return;
        const loadedRepos = response.data;
        setRepos(loadedRepos);
        setActiveRepo(currentRepo =>
          loadedRepos.some(repo => repo.full_name === currentRepo)
            ? currentRepo
            : loadedRepos[0]?.full_name || ''
        );
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch repos:', err);
      } finally {
        if (!cancelled) setRepoLoading(false);
      }
    };

    const fetchGithubStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/github/stats`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (!cancelled) setGithubStats(response.data);
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch GitHub stats:', err);
      }
    };

    fetchRepos();
    fetchGithubStats();

    return () => {
      cancelled = true;
    };
  }, [githubChecked, githubConnected, authToken, verifiedAuthToken]);

  // ===== Fetch commits for the selected repository =====
  useEffect(() => {
    let cancelled = false;

    const fetchCommits = async () => {
      if (!githubChecked || !githubConnected || verifiedAuthToken !== authToken || !authToken || !activeRepo) {
        setCommits([]);
        setCommitsLoading(false);
        return;
      }

      try {
        setCommitsLoading(true);
        const [owner, repoName] = activeRepo.split('/');
        const response = await axios.get(`${API_BASE_URL}/api/github/repos/${repoName}/commits?owner=${encodeURIComponent(owner)}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (!cancelled) setCommits(response.data || []);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch commits:', err);
          setCommits([]);
        }
      } finally {
        if (!cancelled) setCommitsLoading(false);
      }
    };

    fetchCommits();

    return () => {
      cancelled = true;
    };
  }, [activeRepo, githubChecked, githubConnected, authToken, verifiedAuthToken]);

  // ===== Sync code view / files / security audit / analytics when repository changes =====
  useEffect(() => {
    let cancelled = false;

    if (!githubChecked || !githubConnected || verifiedAuthToken !== authToken || !authToken || !activeRepo) {
      setRepoFilesList([]);
      setCodeContent('');
      setAuditData(null);
      setAuditLoading(false);
      setAnalyticsData(null);
      return () => {
        cancelled = true;
      };
    }

    setRepoFilesList([]);
    setCodeContent('');
    setAuditData(null);
    setAuditLoading(false);
    setAnalyticsData(null);

    const fetchFileContent = async () => {
      try {
        const [owner, repoName] = activeRepo.split('/');
        const response = await axios.get(
          `${API_BASE_URL}/api/github/repos/${repoName}/file?owner=${encodeURIComponent(owner)}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!cancelled) {
          setCodeContent(response.data.content);
          setActiveFile(response.data.path);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch file:', err);
          setCodeContent('// Could not load file content');
        }
      }
    };

    const fetchFilesList = async () => {
      try {
        const [owner, repoName] = activeRepo.split('/');
        const response = await axios.get(
          `${API_BASE_URL}/api/github/repos/${repoName}/files?owner=${encodeURIComponent(owner)}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!cancelled) setRepoFilesList(response.data.files);
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch files list:', err);
      }
    };

    const fetchSecurityAudit = async () => {
      try {
        setAuditLoading(true);
        const [owner, repoName] = activeRepo.split('/');
        const params = new URLSearchParams({ repo: repoName, owner });
        const response = await axios.get(
          `${API_BASE_URL}/api/github/security/audit?${params}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!cancelled) setAuditData(response.data);
      } catch (err) {
        if (!cancelled) console.error('Security audit failed:', err);
      } finally {
        if (!cancelled) setAuditLoading(false);
      }
    };

    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const [owner, repoName] = activeRepo.split('/');

        // Fetch commits for analytics
        const commitsRes = await axios.get(
          `${API_BASE_URL}/api/github/repos/${repoName}/commits?owner=${encodeURIComponent(owner)}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        if (cancelled) return;
        const commits = commitsRes.data || [];

        // Calculate real metrics
        const totalCommits = commits.length;
        const recentCommits = commits.filter(c => {
          const date = new Date(c.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date > weekAgo;
        }).length;

        const velocityScore = Math.min(100, recentCommits * 20);
        const syncScore = Math.min(100, totalCommits * 10);

        // Build chart points from commit dates
        const chartPoints = commits.slice(0, 6).map((c, i) => ({
          x: i * 90,
          y: Math.max(20, 180 - (i * 25))
        }));

        setAnalyticsData({
          totalCommits,
          recentCommits,
          velocityScore,
          syncScore,
          chartPoints,
          lastCommit: commits[0]?.date || null
        });
      } catch (err) {
        if (!cancelled) {
          console.error('Analytics fetch failed:', err);
          setAnalyticsData(null);
        }
      }
    };

    fetchFileContent();
    fetchFilesList();
    fetchSecurityAudit();
    fetchAnalytics();

    return () => {
      cancelled = true;
    };
  }, [activeRepo, githubChecked, githubConnected, authToken, verifiedAuthToken]);

  useEffect(() => {
    if (!githubChecked || !githubConnected) {
      setRepoFilesList([]);
      setCodeContent('');
      setAuditData(null);
      setAuditLoading(false);
      setAnalyticsData(null);
      setCommits([]);
      setCommitsLoading(false);
    }
  }, [githubChecked, githubConnected]);

  const value = {
    // Routing
    currentPath,
    setCurrentPath,

    // GitHub / Repo
    githubConnected,
    githubChecked,
    githubStats,
    setGithubStats,
    repos,
    setRepos,
    repoLoading,
    setRepoLoading,
    activeRepo,
    setActiveRepo,
    repoFilesList,
    setRepoFilesList,

    // Commits
    commits,
    setCommits,
    commitsLoading,
    setCommitsLoading,

    // Security Audit
    auditData,
    setAuditData,
    auditLoading,
    setAuditLoading,

    // Analytics
    analyticsData,
    setAnalyticsData,

    // Code Studio
    codeContent,
    setCodeContent,
    activeFile,
    setActiveFile,

    // Workspace Chat
    workspaceMessages,
    setWorkspaceMessages,

    // Immersive Chat
    chatMessages,
    setChatMessages,

    // Changelog
    changelogContent,
    setChangelogContent,
    changelogLoading,
    setChangelogLoading,

    // README
    readmeContent,
    setReadmeContent,
    readmeLoading,
    setReadmeLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
