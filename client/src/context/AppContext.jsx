import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // ===== Routing State =====
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token'));

  // ===== GitHub / Repo State =====
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubChecked, setGithubChecked] = useState(false);
  const [githubStats, setGithubStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [activeRepo, setActiveRepo] = useState('pranitabhortakke7/devpulse');
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
  const [workspaceMessages, setWorkspaceMessages] = useState([
    { id: 1, text: "👋 Welcome to the DevPulse AI OS Cockpit. I have mapped your codebase layout.", sender: 'bot' },
    { id: 2, text: "You can click on files in the repository explorer, view analytics, run security audits, or trigger a command using the Cmd+K Omnibar.", sender: 'bot' }
  ]);

  // ===== Immersive AI Chat State =====
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "🤖 DevBot AI Chat Core initialized. Secure connection established.", sender: "bot" },
    { id: 2, text: "I have access to your active repository context files. Ask me to explain code, check performance, scan security packages, or write documentation templates.", sender: "bot" }
  ]);

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
    let cancelled = false;
    setGithubChecked(false);

    if (!authToken) {
      setGithubConnected(false);
      setGithubChecked(true);
      return () => {
        cancelled = true;
      };
    }

    axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(response => {
        if (!cancelled) setGithubConnected(!!response.data.githubConnected);
      })
      .catch(err => {
        if (!cancelled) {
          console.error('Failed to check GitHub connection:', err);
          setGithubConnected(false);
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
    if (!githubChecked || !githubConnected || !authToken) {
      setRepos([]);
      setGithubStats(null);
      setRepoLoading(false);
      return;
    }

    const fetchRepos = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setRepoLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/github/repos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRepos(response.data);
        if (response.data.length > 0) {
          setActiveRepo(response.data[0].full_name);
        }
      } catch (err) {
        console.error('Failed to fetch repos:', err);
      } finally {
        setRepoLoading(false);
      }
    };

    fetchRepos();

    const fetchGithubStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/github/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGithubStats(response.data);
      } catch (err) {
        console.error('Failed to fetch GitHub stats:', err);
      }
    };

    fetchGithubStats();

  }, [githubChecked, githubConnected, authToken]);

  // ===== Fetch commits for the selected repository =====
  useEffect(() => {
    const fetchCommits = async () => {
      const token = localStorage.getItem('token');
      if (!githubChecked || !githubConnected || !token || !activeRepo) {
        setCommits([]);
        return;
      }

      try {
        setCommitsLoading(true);
        const [owner, repoName] = activeRepo.split('/');
        const response = await axios.get(`${API_BASE_URL}/api/github/repos/${repoName}/commits?owner=${encodeURIComponent(owner)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCommits(response.data || []);
      } catch (err) {
        console.error('Failed to fetch commits:', err);
        setCommits([]);
      } finally {
        setCommitsLoading(false);
      }
    };

    fetchCommits();
  }, [activeRepo, githubChecked, githubConnected, authToken]);

  // ===== Sync code view / files / security audit / analytics when repository changes =====
  useEffect(() => {
    const fetchFileContent = async () => {
      const token = localStorage.getItem('token');
      if (!githubChecked || !githubConnected || !token || !activeRepo) return;

      try {
        const [owner, repoName] = activeRepo.split('/');
        const response = await axios.get(
          `${API_BASE_URL}/api/github/repos/${repoName}/file?owner=${encodeURIComponent(owner)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCodeContent(response.data.content);
        setActiveFile(response.data.path);
      } catch (err) {
        console.error('Failed to fetch file:', err);
        setCodeContent('// Could not load file content');
      }
    };

    const fetchFilesList = async () => {
      const token = localStorage.getItem('token');
      if (!githubChecked || !githubConnected || !token || !activeRepo) return;
      try {
        const [owner, repoName] = activeRepo.split('/');
        const response = await axios.get(
          `${API_BASE_URL}/api/github/repos/${repoName}/files?owner=${encodeURIComponent(owner)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRepoFilesList(response.data.files);
      } catch (err) {
        console.error('Failed to fetch files list:', err);
      }
    };

    const fetchSecurityAudit = async () => {
      const token = localStorage.getItem('token');
      if (!githubChecked || !githubConnected || !token || !activeRepo) return;
      try {
        setAuditLoading(true);
        const [owner, repoName] = activeRepo.split('/');
        const params = new URLSearchParams({ repo: repoName, owner });
        const response = await axios.get(
          `${API_BASE_URL}/api/github/security/audit?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAuditData(response.data);
      } catch (err) {
        console.error('Security audit failed:', err);
      } finally {
        setAuditLoading(false);
      }
    };

    // Fetch analytics data
    const fetchAnalytics = async () => {
      const token = localStorage.getItem('token');
      if (!githubChecked || !githubConnected || !token || !activeRepo) {
        setAnalyticsData(null);
        return;
      }

      try {
        const [owner, repoName] = activeRepo.split('/');

        // Fetch commits for analytics
        const commitsRes = await axios.get(
          `${API_BASE_URL}/api/github/repos/${repoName}/commits?owner=${encodeURIComponent(owner)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

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
        console.error('Analytics fetch failed:', err);
        setAnalyticsData(null);
      }
    };

    fetchFileContent();
    fetchFilesList();
    fetchSecurityAudit();
    fetchAnalytics();
  }, [activeRepo, githubChecked, githubConnected, authToken]);

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
