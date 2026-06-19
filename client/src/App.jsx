import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import GlassCard from './components/GlassCard';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import DevBot, { HoloDevBot } from './components/DevBot';
import { 
  BarChart3, Database, HeartPulse, MessageSquare, Search, Zap, Code, Shield, 
  ArrowRight, Lock, Terminal, LogOut, Compass, HelpCircle, Activity, FileText, CheckCircle2,
  FolderTree, ChevronRight, Play, Cpu, RefreshCw, Layers, Check, FileCode, Sparkles, User, Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom GitHub SVG Icon
const Github = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block' }}
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// REPO_FILE_SYSTEM removed — replaced with runtime-safe fallbacks where needed.

// Simple code formatting highligher
const syntaxHighlight = (code) => {
  if (!code) return '';
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .split('\n')
    .map(line => {
      let formatted = line;
      
      // Keywords
      formatted = formatted.replace(/\b(const|let|var|function|return|import|from|export|default|if|else|for|while|class|extends|new|try|catch|async|await)\b/g, '<span class="code-keyword">$1</span>');
      
      // Strings (double quotes)
      formatted = formatted.replace(/(["'])(.*?)\1/g, '<span class="code-string">$1$2$1</span>');
      
      // Functions
      formatted = formatted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\()/g, '<span class="code-function">$1</span>');
      
      // Comments
      if (formatted.trim().startsWith('//') || formatted.trim().startsWith('*') || formatted.trim().startsWith('/*')) {
        formatted = `<span class="code-comment">${formatted}</span>`;
      }
      
      // Numbers
      formatted = formatted.replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');

      return formatted;
    })
    .join('\n');
};

// Neural Network synapse-firing node background
const NeuralNetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const nodes = [];
    const nodeCount = 45;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI,
        pulseSpeed: Math.random() * 0.03 + 0.01
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const size = node.radius + Math.sin(node.pulse) * 0.8;
        ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = ((100 - dist) / 100) * 0.15;
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        // Draw connections to mouse cursor
        if (mouse.x !== -1000 && mouse.y !== -1000) {
          const dx = nodes[i].x - mouse.x;
          const dy = nodes[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = ((130 - dist) / 130) * 0.25;
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

// Cybernetic spinning dials core
const ProductivityReactor = ({ score = 94, status = 'boosting' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '220px', height: '220px', margin: '0 auto' }}>
      
      {/* Dynamic tech SVG rings */}
      <svg width="220" height="220" viewBox="0 0 220 220" style={{ position: 'absolute', zIndex: 2 }}>
        {/* Outer dash */}
        <circle cx="110" cy="110" r="95" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1.5" fill="none" />
        <circle cx="110" cy="110" r="95" stroke="var(--primary-cyan)" strokeWidth="2.5" strokeDasharray="30 180" fill="none" className="reactor-ring-outer" />

        {/* Inner reverse dash */}
        <circle cx="110" cy="110" r="75" stroke="rgba(124, 58, 237, 0.15)" strokeWidth="1.5" fill="none" />
        <circle cx="110" cy="110" r="75" stroke="var(--primary-purple)" strokeWidth="3" strokeDasharray="60 120" fill="none" className="reactor-ring-inner" />

        {/* Gradient percentage ring */}
        <circle cx="110" cy="110" r="55" stroke="rgba(255,255,255,0.03)" strokeWidth="5" fill="none" />
        <circle cx="110" cy="110" r="55" stroke="url(#reactor-grad)" strokeWidth="5" strokeDasharray="290" strokeDashoffset={290 - (290 * score) / 100} strokeLinecap="round" fill="none" transform="rotate(-90 110 110)" />

        <defs>
          <linearGradient id="reactor-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary-cyan)" />
            <stop offset="100%" stopColor="var(--primary-purple)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central glowing core pulse */}
      <motion.div
        animate={{
          scale: status === 'boosting' ? [0.95, 1.05, 0.95] : [0.98, 1.02, 0.98],
          boxShadow: status === 'boosting' 
            ? '0 0 25px rgba(34, 211, 238, 0.5)'
            : '0 0 15px rgba(124, 58, 237, 0.3)'
        }}
        transition={{ duration: status === 'boosting' ? 1.5 : 3, repeat: Infinity }}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, rgba(124, 58, 237, 0.15) 60%, rgba(5,8,22,0.95) 100%)',
          border: '2px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3
        }}
      >
        <span style={{ fontSize: '24px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{score}%</span>
        <span style={{ fontSize: '8px', color: 'var(--primary-cyan)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>REACTOR</span>
      </motion.div>
      
      {/* Core status badge overlay */}
      <div style={{ position: 'absolute', bottom: '-20px', textAlign: 'center', zIndex: 4 }}>
        <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--primary-cyan)', background: 'rgba(34, 211, 238, 0.08)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(34, 211, 238, 0.15)' }}>
          CORE STATE: {status === 'boosting' ? 'BOOSTING_OVERDRIVE' : 'STABLE_CORE'}
        </span>
      </div>
    </div>
  );
};

// Simulated rolling code events feed
const LiveActivityFeed = () => {
  const [events, setEvents] = useState([
    { id: 1, time: '15:20:11', desc: 'Sync complete: 12 repository files vectorised.', type: 'info' },
    { id: 2, time: '15:22:45', desc: 'AI refactor patch applied inside Layout.jsx.', type: 'success' },
    { id: 3, time: '15:25:02', desc: 'Commit #ef435a pushed by pranitabhortakke7.', type: 'cmd' },
    { id: 4, time: '15:28:14', desc: 'Vulnerability scan complete: 0 critical alerts.', type: 'success' },
    { id: 5, time: '15:30:01', desc: 'API handshake request: 84ms latency score.', type: 'info' }
  ]);

  useEffect(() => {
    const logPool = [
      { desc: 'Synchronising local repo embeddings...', type: 'info' },
      { desc: 'PR #14 branch merged: release-v1.1.0.', type: 'success' },
      { desc: 'DevBot completed code optimization scan.', type: 'info' },
      { desc: 'Commit #db521a pushed to main branch.', type: 'cmd' },
      { desc: 'GPU neural mapping: load at 34%.', type: 'info' },
      { desc: 'Dependency audit: checked 1,842 files.', type: 'success' },
      { desc: 'AI suggests memoizing rendering layout loops.', type: 'warn' }
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const newLog = {
        id: Date.now(),
        time: timeStr,
        desc: randomLog.desc,
        type: randomLog.type
      };
      setEvents(prev => [newLog, ...prev.slice(0, 5)]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="activity-ticker-container">
      <div className="activity-ticker-list">
        {events.map((evt) => (
          <div 
            key={evt.id} 
            className="ticker-item-new"
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px', 
              fontSize: '12px', 
              fontFamily: 'var(--font-mono)', 
              padding: '10px 14px', 
              background: 'rgba(255,255,255,0.01)', 
              border: '1px solid rgba(255,255,255,0.03)', 
              borderRadius: '8px' 
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>[{evt.time}]</span>
            <span style={{ 
              color: evt.type === 'success' 
                ? '#10b981' 
                : evt.type === 'warn' 
                  ? '#F59E0B' 
                  : evt.type === 'cmd' 
                    ? 'var(--primary-cyan)' 
                    : '#ffffff',
              flex: 1
            }}>
              {evt.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Project Planet Interactive Canvas Visualization
const ProjectPlanet = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const primaryCyan = '#22d3ee';
    const primaryPurple = '#7c3aed';
    const primaryBlue = '#3b82f6';
    let width = canvas.width = 300;
    let height = canvas.height = 300;
    let animationFrameId;
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width || 300;
      height = canvas.height = rect.height || 300;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const particles = [
      { radius: 55, speed: 0.008, size: 4, color: primaryCyan, label: 'commit: #ef435a' },
      { radius: 80, speed: -0.006, size: 5, color: primaryPurple, label: 'author: pranitabhortakke7' },
      { radius: 110, speed: 0.004, size: 4.5, color: primaryBlue, label: 'action: merge release-v1.1.0' },
      { radius: 70, speed: 0.009, size: 3, color: '#10b981', label: 'scan: vulnerability safe' }
    ];

    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw Orbit Paths
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      [55, 70, 80, 110].forEach(r => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Volumetric back glow
      const glowGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 60);
      glowGrad.addColorStop(0, 'rgba(34, 211, 238, 0.22)');
      glowGrad.addColorStop(0.5, 'rgba(124, 58, 237, 0.12)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fill();

      // Main core
      const coreGrad = ctx.createRadialGradient(cx - 8, cy - 8, 1, cx, cy, 24);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, primaryCyan);
      coreGrad.addColorStop(0.7, primaryPurple);
      coreGrad.addColorStop(1, '#050816');

      ctx.fillStyle = coreGrad;
      ctx.shadowColor = primaryCyan;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Update orbital nodes
      particles.forEach((p, idx) => {
        const angle = time * p.speed + (idx * Math.PI / 2);
        const px = cx + Math.cos(angle) * p.radius;
        const py = cy + Math.sin(angle) * p.radius;

        // Draw connections
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw hover tags
        const dx = mouse.x - px;
        const dy = mouse.y - py;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 35) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.font = '9px monospace';
          ctx.fillText(p.label, px + 8, py + 3);

          // Line highlight
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', borderRadius: '20px' }} />
    </div>
  );
};

function App() {
  // Simple Popstate Router
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [githubStats, setGithubStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const loggedInUsername = storedUser?.username || 'Operator';
  const loggedInEmail = storedUser?.email || '';
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handleLocationChange);

    const fetchRepos = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        setRepoLoading(true);
        const response = await axios.get('http://localhost:5000/api/github/repos', {
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
        const response = await axios.get('http://localhost:5000/api/github/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGithubStats(response.data);
      } catch (err) {
        console.error('Failed to fetch GitHub stats:', err);
      }
    };

    fetchGithubStats();

    fetchGithubStats();

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Main UI States
  const [activeRepo, setActiveRepo] = useState('pranitabhortakke7/devpulse');
  
  const [activeTab, setActiveTab] = useState('chat'); // chat, code, search, security, analytics
  const [botStatus, setBotStatus] = useState('online'); // online, busy
  const [botTyping, setBotTyping] = useState(false);
  const [activeFile, setActiveFile] = useState('src/App.jsx');
  const [codeContent, setCodeContent] = useState('');
  const [repoFilesList, setRepoFilesList] = useState([]);
  const [commits, setCommits] = useState([]);
  const [commitsLoading, setCommitsLoading] = useState(false);

  // Fetch commits for the selected repository
  useEffect(() => {
    const fetchCommits = async () => {
      const token = localStorage.getItem('token');
      if (!token || !activeRepo) {
        setCommits([]);
        return;
      }

      try {
        setCommitsLoading(true);
        const parts = activeRepo.split('/');
        const repoName = parts.length > 1 ? parts[1] : parts[0];
        const response = await axios.get(`http://localhost:5000/api/github/repos/${repoName}/commits`, {
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
  }, [activeRepo]);
  const [hasRefactored, setHasRefactored] = useState(false);
  const [refactorAnimation, setRefactorAnimation] = useState(false);

  // Search tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Login page loading simulator
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginLogs, setLoginLogs] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register page states
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regLogs, setRegLogs] = useState([]);
  const [focusField, setFocusField] = useState(null);

  // Project Page simulation states
  const [changelogLogs, setChangelogLogs] = useState([]);
  const [changelogLoading, setChangelogLoading] = useState(false);
  const [changelogContent, setChangelogContent] = useState('');

  const [readmeLogs, setReadmeLogs] = useState([]);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeContent, setReadmeContent] = useState('');
  
  const [healthHoverField, setHealthHoverField] = useState(null);

  // Immersive AI Chat Page states
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "🤖 DevBot AI Chat Core initialized. Secure connection established.", sender: "bot" },
    { id: 2, text: "I have access to your active repository context files. Ask me to explain code, check performance, scan security packages, or write documentation templates.", sender: "bot" }
  ]);
  const [chatInputText, setChatInputText] = useState('');
  const [chatSelectedFile, setChatSelectedFile] = useState('src/App.jsx');
  const [chatExplanationMode, setChatExplanationMode] = useState(false);
  const [chatTypingState, setChatTypingState] = useState(false);

  // Landing page simulated terminal typing
  const [heroTerminalLines, setHeroTerminalLines] = useState([
    { text: 'root@devpulse:~$ devpulse sync --repo pranitabhortakke7/devpulse', type: 'cmd' }
  ]);

  // Sync code view when repository changes
  useEffect(() => {
  const fetchFileContent = async () => {
    const token = localStorage.getItem('token');
    if (!token || !activeRepo) return;

    try {
      const repoName = activeRepo.split('/')[1];
      const response = await axios.get(
        `http://localhost:5000/api/github/repos/${repoName}/file`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCodeContent(response.data.content);
      setActiveFile(response.data.path);
      setHasRefactored(false);
    } catch (err) {
      console.error('Failed to fetch file:', err);
      setCodeContent('// Could not load file content');
    }
  };

  fetchFileContent();

    // Fetch file list for sidebar
    const fetchFilesList = async () => {
      const token = localStorage.getItem('token');
      if (!token || !activeRepo) return;
      try {
        const repoName = activeRepo.split('/')[1];
        const response = await axios.get(
          `http://localhost:5000/api/github/repos/${repoName}/files`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRepoFilesList(response.data.files);
      } catch (err) {
        console.error('Failed to fetch files list:', err);
      }
    };
    fetchFilesList();
}, [activeRepo]);

  // Typing simulator on landing page hero terminal
  useEffect(() => {
    if (currentPath !== '/') return;
    
    let isMounted = true;
    const scripts = [
      { delay: 1000, text: '🔍 Scanning codebase structures...', type: 'info' },
      { delay: 1800, text: '✓ 142 internal file modules mapped.', type: 'success' },
      { delay: 2500, text: '🧠 Generating vector index embeddings...', type: 'info' },
      { delay: 3500, text: '✓ AI Index Synced. DevBot helper ONLINE (Gemini Flash).', type: 'success' },
      { delay: 4200, text: 'root@devpulse:~$ devpulse audit --security', type: 'cmd' },
      { delay: 5000, text: '🛡️ Scanning dependency lockfiles...', type: 'info' },
      { delay: 5800, text: '✓ 0 Critical / 0 High vulnerabilities found.', type: 'success' },
      { delay: 6500, text: 'root@devpulse:~$ devpulse ready --interactive', type: 'cmd' },
      { delay: 7200, text: '🚀 Launching Developer Operating Core Panel...', type: 'success' }
    ];

    const timers = [];
    scripts.forEach(script => {
      const t = setTimeout(() => {
        if (isMounted) {
          setHeroTerminalLines(prev => [...prev, { text: script.text, type: script.type }]);
        }
      }, script.delay);
      timers.push(t);
    });

    // Reset loop after 18 seconds
    const resetTimer = setTimeout(() => {
      if (isMounted) {
        setHeroTerminalLines([{ text: 'root@devpulse:~$ devpulse sync --repo pranitabhortakke7/devpulse', type: 'cmd' }]);
      }
    }, 18000);
    timers.push(resetTimer);

    return () => {
      isMounted = false;
      timers.forEach(t => clearTimeout(t));
    };
  }, [currentPath, heroTerminalLines.length === 1]);

  // Chat State
  const [workspaceMessages, setWorkspaceMessages] = useState([
    { id: 1, text: "👋 Welcome to the DevPulse AI OS Cockpit. I have mapped your codebase layout.", sender: 'bot' },
    { id: 2, text: "You can click on files in the repository explorer, view analytics, run security audits, or trigger a command using the Cmd+K Omnibar.", sender: 'bot' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const workspaceChatEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (workspaceChatEndRef.current) {
      workspaceChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [workspaceMessages, activeTab]);

  // Handle URL action parameters on routing into workspace
  useEffect(() => {
    const cleanPath = currentPath.split('?')[0];
    if (cleanPath === '/devbot') {
      const params = new URLSearchParams(currentPath.split('?')[1] || '');
      const action = params.get('action');
      if (action) {
        window.history.replaceState({}, '', '/devbot');
        setCurrentPath('/devbot');
        setTimeout(() => {
          triggerWorkspaceAction(action);
        }, 500);
      }
    }
  }, [currentPath]);

  const handleSendWorkspaceMsg = (textToSend = chatInput) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), text: textToSend, sender: 'user' };
    setWorkspaceMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setBotStatus('busy');
    setBotTyping(true);

    // AI thinking latency simulation
    setTimeout(() => {
      let replyText = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes('optimize') || lower.includes('optimization')) {
        replyText = `⚡ **AI Optimization Scan Completed for \`${activeRepo}\`:**\n\n- **Render Loop Patch**: Inside \`Layout.jsx\`, we detected an un-memoized canvas coordinate loop. Suggest caching math functions.\n- **Bundle Overhead**: Package size reduced by **18KB** after shifting unused layouts to lazy chunks.\n- **Diagnostic Speed**: Rendering latency fell from **16ms** to **3ms** (Velocity boosted!).`;
        setActiveTab('analytics');
      } else if (lower.includes('security') || lower.includes('scan') || lower.includes('audit')) {
        replyText = `🛡️ **Vulnerability Security Scan Complete:**\n\n- **Target**: Lockfiles on branch \`main\`\n- **Scan scope**: 352 nested directories audited\n- **Summary**: 0 Critical warnings, 1 Low warning (Package \`minimist\` deep in devDependencies).\n\nCheck the **Security Tab** in your center deck for the detailed scan logs!`;
        setActiveTab('security');
      } else if (lower.includes('search') || lower.includes('semantic')) {
        replyText = `🔎 **Semantic Code Index Search Results:**\n\nMatches found for key logic in \`${activeRepo}\`:\n1. \`components/DevBot.jsx\` (Score: 98% match)\n2. \`components/Layout.jsx\` (Score: 84% match)\n\nOpen the **Search Tab** to run granular semantic matches on your functions.`;
        setActiveTab('search');
      } else if (lower.includes('readme')) {
        replyText = `📝 **Automated README.md Generated:**\n\n\`\`\`markdown\n# DevPulse AI Dashboard\nAI-powered operating hub for automated dependency sweeps and inline editor diagnostics.\n\`\`\`\n\nI have loaded this generated markdown directly into your **Code Studio** tab for you to inspect!`;
        const files = {};
        setActiveFile('README.md');
        setCodeContent('# README.md');
        setActiveTab('code');
      } else if (lower.includes('changelog')) {
        replyText = `📋 **Automated Release Notes (v1.1.0):**\n\n### Added\n- **Omnibar Command Palette**: Globally accessible keyboard deck (Cmd+K).\n- **Volumetric Lighting system**: Canvas particles repelling cursor movements.\n- **Diagnostics Monitor**: Bottom hardware console integration.`;
      } else {
        replyText = `🤖 **DevPulse AI Engine Response:**\n\nI can analyze \`${activeRepo}\` structures. Trigger tools in the top dashboard panel or command palette:\n- **Optimize code performance**\n- **Run a Security Audit**\n- **Generate a README file**\n- **Audit search embeddings**\n\nWhat would you like to run next?`;
      }

      setWorkspaceMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, sender: 'bot' }]);
      setBotStatus('online');
      setBotTyping(false);
    }, 1200);
  };

  const triggerWorkspaceAction = (actionName) => {
    handleSendWorkspaceMsg(`Run ${actionName}`);
  };

  // Perform mock semantic search
  const handleSemanticSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    // Filter mock files matching query
    setTimeout(() => {
      const results = [
        { file: 'src/components/DevBot.jsx', score: 98, matchText: 'Floating movement loops, SVG digital eyes, cursor repulsion vector mathematics.' },
        { file: 'src/components/Layout.jsx', score: 86, matchText: 'Canvas particles tracking, global cursor document root coordinate listener.' },
        { file: 'src/App.jsx', score: 72, matchText: 'Popstate router handles URL parameters, active tab selection controls.' }
      ].filter(r => r.file.toLowerCase().includes(query.toLowerCase()) || r.matchText.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(results);
    }, 100);
  };

  // Accept Code Studio Refactor recommendation
  const handleApplyRefactor = async () => {
  setRefactorAnimation(true);
  setBotStatus('busy');
  setBotTyping(true);

  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      'http://localhost:5000/api/ai/refactor',
      {
        code: codeContent,
        filename: activeFile
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setCodeContent(response.data.refactoredCode);
    setHasRefactored(true);

    // Post success notification to chat
    setWorkspaceMessages(prev => [...prev, {
      id: Date.now(),
      text: `⚡ **AI Refactor Complete for \`${activeFile}\`:**\n\n${response.data.refactoredCode.substring(0, 200)}...`,
      sender: 'bot'
    }]);

  } catch (err) {
    setWorkspaceMessages(prev => [...prev, {
      id: Date.now(),
      text: `❌ Refactor failed. Please try again.`,
      sender: 'bot'
    }]);
  } finally {
    setRefactorAnimation(false);
    setBotStatus('online');
    setBotTyping(false);
  }
};

  // Login form handler
  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) return;

    setLoginLoading(true);
    setLoginLogs([]);

    // Show animated logs as before
    const logs = [
      { text: 'Opening AI Gateway credentials gateway...', delay: 350 },
      { text: `Locating operator record for: "${loginEmail}"...`, delay: 750 },
      { text: 'Resolving cryptographic access key verification...', delay: 1150 },
      { text: 'Syncing localized workspace settings...', delay: 1550 },
      { text: 'Verifying network port isolation metrics...', delay: 1950 },
    ];

    logs.forEach(log => {
      setTimeout(() => {
        setLoginLogs(prev => [...prev, log.text]);
      }, log.delay);
    });

    // Real API call
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginEmail,
        password: loginPassword
      });

      const { token, user } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setTimeout(() => {
        setLoginLogs(prev => [...prev, '✓ HANDSHAKE ACCEPTED. Redirecting to cockpit...']);
      }, 2450);

      setTimeout(() => {
        navigateTo('/devbot');
        setLoginLoading(false);
      }, 3200);

    } catch (error) {
      setLoginLoading(false);
      setLoginLogs([]);
      const message = error.response?.data?.message || 'Connection failed. Check credentials.';
      alert(`❌ ${message}`);
    }
  };
  const handleGithubConnect = () => {
    setLoginLoading(true);
    setLoginLogs([]);
    
    const logs = [
      { text: 'Connecting secure channel to auth.github.com...', delay: 400 },
      { text: 'Exchanging SSH handshake signatures...', delay: 900 },
      { text: 'Verifying OAuth Token and Scope permissions...', delay: 1400 },
      { text: 'Loading DevPulse global config state mapping...', delay: 1900 },
      { text: 'Connection SECURE. Decrypting workspaces...', delay: 2400 },
      { text: 'Redirecting to Core Operating Command Palette...', delay: 2800 }
    ];

    logs.forEach(log => {
      setTimeout(() => {
        setLoginLogs(prev => [...prev, log.text]);
      }, log.delay);
    });

    setTimeout(() => {
      navigateTo('/devbot');
      setLoginLoading(false);
    }, 3200);
  };

  // Register identity onboarding sequencer
  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) return;

    setRegLoading(true);
    setRegLogs([]);

    const logs = [
      { text: 'Establishing secure cryptographic handshake...', delay: 350 },
      { text: `Creating unique node identifier: "${regUsername}"...`, delay: 750 },
      { text: `Configuring sync gateway protocols: ${regEmail}...`, delay: 1150 },
      { text: 'Generating standard vector index context structures...', delay: 1550 },
      { text: 'Binding security passwords key closure...', delay: 1950 },
    ];

    logs.forEach(log => {
      setTimeout(() => {
        setRegLogs(prev => [...prev, log.text]);
      }, log.delay);
    });

    // Real API call
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: regUsername,
        email: regEmail,
        password: regPassword
      });

      const { token, user } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setTimeout(() => {
        setRegLogs(prev => [...prev, '✓ ONBOARDING SUCCESSFUL. Decrypting global cores...']);
        setRegLogs(prev => [...prev, 'Redirecting to DevPulse interactive cockpit...']);
      }, 2450);

      setTimeout(() => {
        navigateTo('/devbot');
        setRegLoading(false);
      }, 3200);

    } catch (error) {
      setRegLoading(false);
      setRegLogs([]);
      const message = error.response?.data?.message || 'Registration failed. Try again.';
      alert(`❌ ${message}`);
    }
  };
  const cleanPath = currentPath.split('?')[0];

  // RENDER WORKSPACE PAGE (/devbot)
  const privateRoutes = ['/devbot', '/chat', '/dashboard', '/profile', '/project'];
  const isPrivateRoute = privateRoutes.some(route => cleanPath.startsWith(route));
  const token = localStorage.getItem('token');

  if (isPrivateRoute && !token) {
    window.history.pushState({}, '', '/login');
    setCurrentPath('/login');
    return null;
  }
  if (cleanPath === '/devbot') {

    return (
      <Layout currentPath={cleanPath} navigateTo={navigateTo}>
        <div style={{
          maxWidth: '1440px',
          margin: '-30px auto 30px',
          padding: '0 20px',
          display: 'flex',
          gap: '20px',
          height: 'calc(100vh - 170px)',
          minHeight: '660px'
        }}>
          {/* LEFT SIDEBAR: File Tree & Holographic DevBot Dock */}
          <div className="glass" style={{
            width: '300px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'rgba(5, 8, 22, 0.6)',
            borderColor: 'rgba(255,255,255,0.06)',
            overflow: 'hidden'
          }}>
            {/* Repositories Select */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Active Context
              </div>
              <select 
                value={activeRepo}
                onChange={(e) => setActiveRepo(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {repoLoading ? (
                  <option disabled>Loading repos...</option>
                ) : (
                  repos.map(repo => (
                    <option key={repo.full_name} value={repo.full_name} style={{ background: '#050816' }}>
                      {repo.full_name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Folder / File Explorer tree */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <FolderTree size={13} color="var(--primary-cyan)" />
                Workspace Files
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '4px', marginTop: '6px' }}>
                {repoFilesList.map((filename) => {
                  const isSelected = activeFile === filename;
                  return (
                    <div
                      key={filename}
                      onClick={() => {
                        setActiveFile(filename);
                        // Fetch file content when clicked
const fetchFile = async () => {
  const token = localStorage.getItem('token');
  const repoName = activeRepo.split('/')[1];
  const res = await axios.get(
    `http://localhost:5000/api/github/repos/${repoName}/file?path=${filename}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  setCodeContent(res.data.content);
};
fetchFile();
                        setHasRefactored(false);
                        setActiveTab('code'); // Switch to Code Studio
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
                        color: isSelected ? 'white' : 'var(--text-secondary)',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        border: isSelected ? '1px solid rgba(34, 211, 238, 0.2)' : '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <FileCode size={13} color={isSelected ? 'var(--primary-cyan)' : 'var(--text-muted)'} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                        {filename.split('/').pop()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Holographic Containment Docking bay */}
            <HoloDevBot status={botStatus} isTyping={botTyping} />
          </div>

          {/* CENTRAL STAGE: Tabs & Main Tools Dashboard */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            
            {/* Header Deck Panel Controls */}
            <div className="glass" style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(5, 8, 22, 0.4)',
              borderColor: 'rgba(255,255,255,0.06)'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={16} color="var(--primary-cyan)" />
                  {activeRepo}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  Branch: main • vector-cache: synced
                </p>
              </div>

              {/* Action shortcuts */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => triggerWorkspaceAction('README')}
                  className="glass" 
                  style={{ padding: '8px 12px', fontSize: '11px', color: 'white', border: '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={12} color="var(--primary-cyan)" />
                  README
                </button>
                <button 
                  onClick={() => triggerWorkspaceAction('Changelog')}
                  className="glass" 
                  style={{ padding: '8px 12px', fontSize: '11px', color: 'white', border: '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Activity size={12} color="var(--primary-purple)" />
                  Changelog
                </button>
                <button 
                  onClick={() => triggerWorkspaceAction('Security Scan')}
                  className="glass" 
                  style={{ padding: '8px 12px', fontSize: '11px', color: 'white', border: '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Shield size={12} color="#10b981" />
                  Security
                </button>
                <button 
                  onClick={() => triggerWorkspaceAction('Optimization')}
                  className="glass" 
                  style={{ padding: '8px 12px', fontSize: '11px', color: 'white', border: '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Zap size={12} color="#F59E0B" />
                  Optimize
                </button>
              </div>
            </div>

            {/* View Tabs Selector */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '2px' }}>
              {[
                { id: 'chat', label: 'DevBot AI Chat', icon: MessageSquare },
                { id: 'code', label: 'Code Studio', icon: Code },
                { id: 'search', label: 'Semantic Index Search', icon: Search },
                { id: 'security', label: 'Security Audit', icon: Shield },
                { id: 'analytics', label: 'Diagnostics & Metrics', icon: BarChart3 }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                      border: 'none',
                      borderBottom: isActive ? '2px solid var(--primary-purple)' : '2px solid transparent',
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                      borderRadius: '6px 6px 0 0'
                    }}
                  >
                    <tab.icon size={13} color={isActive ? 'var(--primary-cyan)' : 'var(--text-muted)'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS VIEWPORT */}
            <div className="glass" style={{
              flex: 1,
              background: 'rgba(6, 10, 26, 0.45)',
              borderColor: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              
              {/* TAB 1: AI CHAT COMPONENT */}
              {activeTab === 'chat' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                  <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {workspaceMessages.map(msg => (
                      <div 
                        key={msg.id} 
                        style={{ 
                          alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                          padding: '14px 18px',
                          fontSize: '13px',
                          maxWidth: '75%',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          background: msg.sender === 'user' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(11, 15, 39, 0.65)',
                          border: msg.sender === 'user' ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                          borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          color: 'white',
                          boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(124, 58, 237, 0.1)' : 'none'
                        }}
                      >
                        {/* If bot message has code blocks, format nicely */}
                        {msg.text.includes('```') ? (
                          <div>
                            {msg.text.split('```').map((part, index) => {
                              if (index % 2 === 1) {
                                // Extract language and clean up
                                const lines = part.trim().split('\n');
                                const lang = lines[0].match(/^[a-zA-Z0-9]+$/) ? lines[0] : '';
                                const codeBody = lang ? lines.slice(1).join('\n') : lines.join('\n');
                                return (
                                  <pre key={index} style={{
                                    background: '#02040a',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    overflowX: 'auto',
                                    marginTop: '8px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    color: '#e2e8f0'
                                  }}>
                                    <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(codeBody) }} />
                                  </pre>
                                );
                              }
                              return <span key={index}>{part}</span>;
                            })}
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    ))}
                    {botTyping && (
                      <div style={{
                        alignSelf: 'flex-start',
                        background: 'rgba(11, 15, 39, 0.65)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '12px 16px',
                        borderRadius: '16px 16px 16px 2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '6px', height: '6px', background: 'var(--primary-cyan)', borderRadius: '50%' }} />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '6px', height: '6px', background: 'var(--primary-cyan)', borderRadius: '50%' }} />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '6px', height: '6px', background: 'var(--primary-cyan)', borderRadius: '50%' }} />
                      </div>
                    )}
                    <div ref={workspaceChatEndRef} />
                  </div>

                  {/* Chat input console */}
                  <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px', background: 'rgba(5, 8, 22, 0.3)' }}>
                    <input
                      placeholder={`Ask DevBot regarding files in ${activeRepo}...`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendWorkspaceMsg();
                      }}
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(124, 58, 237, 0.4)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <button
                      onClick={() => handleSendWorkspaceMsg()}
                      style={{
                        background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))',
                        border: 'none',
                        color: 'white',
                        fontWeight: 600,
                        padding: '0 20px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 0 10px rgba(124, 58, 237, 0.3)'
                      }}
                    >
                      <Play size={12} fill="white" />
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: CODE STUDIO (syntax highlighed mock text editor) */}
              {activeTab === 'code' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                  {/* File title bar */}
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5, 8, 22, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary-cyan)' }}>
                      <FileCode size={12} />
                      {activeFile}
                    </div>
                    {hasRefactored && (
                      <div style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 600 }}>
                        Patched & Optimised
                      </div>
                    )}
                  </div>

                  {/* Code viewport container */}
                  <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    {refactorAnimation && (
                      <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'rgba(2, 4, 10, 0.8)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px'
                      }}>
                        <RefreshCw className="animate-spin" size={24} color="var(--primary-cyan)" style={{ animation: 'spin 2s linear infinite' }} />
                        <div style={{ fontSize: '12px', color: 'var(--primary-cyan)', fontFamily: 'var(--font-mono)' }}>Applying inline AI refactor optimizations...</div>
                      </div>
                    )}

                    <pre style={{
                      height: '100%',
                      overflowY: 'auto',
                      padding: '20px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      lineHeight: '1.7',
                      background: '#02040a',
                      margin: 0
                    }}>
                      <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(codeContent) }} />
                    </pre>
                  </div>

                  {/* Code Inline Suggestions Overlay Bar */}
                  {!hasRefactored && codeContent && (
                    <motion.div 
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(90deg, rgba(124, 58, 237, 0.1), rgba(34, 211, 238, 0.05))',
                        borderTop: '1px solid rgba(124, 58, 237, 0.25)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: 'rgba(124, 58, 237, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(124, 58, 237, 0.3)'
                        }}>
                          <Zap size={14} color="var(--primary-cyan)" />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>AI Suggestion: Cache component loop metrics</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Move particle loops to a React.useMemo hook to prevent layout draw delays.</div>
                        </div>
                      </div>

                      <button
                        onClick={handleApplyRefactor}
                        style={{
                          background: 'white',
                          border: 'none',
                          color: 'black',
                          fontWeight: 700,
                          fontSize: '11px',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 10px rgba(255,255,255,0.1)'
                        }}
                      >
                        Apply Patch
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* TAB 3: SEMANTIC INDEX SEARCH */}
              {activeTab === 'search' && (
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '6px' }}>Semantic Code Search</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Search files using natural queries instead of raw regex matches. Employs vector distance mapping.</p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="e.g. Where is particle velocity math computed?"
                        value={searchQuery}
                        onChange={(e) => handleSemanticSearch(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '12px 12px 12px 44px',
                          color: 'white',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {searchResults.length > 0 ? (
                      searchResults.map((result, i) => (
                        <div key={i} className="glass" style={{
                          padding: '16px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          background: 'rgba(11, 15, 39, 0.4)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'white' }}>
                              <FileCode size={12} color="var(--primary-cyan)" />
                              {result.file}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Match score:</span>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-cyan)' }}>{result.score}%</span>
                            </div>
                          </div>
                          
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '6px', borderLeft: '2px solid var(--primary-purple)', fontFamily: 'var(--font-mono)' }}>
                            {result.matchText}
                          </p>
                        </div>
                      ))
                    ) : searchQuery.trim() ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                        No vector mappings found for "{searchQuery}".
                      </div>
                    ) : (
                      <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Search size={28} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 12px' }} />
                        <div style={{ fontSize: '13px' }}>Search results will appear here...</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: SECURITY AUDIT */}
              {activeTab === 'security' && (
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '6px' }}>Security Audit Log</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Scans branch vulnerabilities, dependency keys, and package lock logs.</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {[
                      { title: 'Secured Lockfiles', value: '100% Signed', color: '#10B981' },
                      { title: 'Ports Containerized', value: 'Isolated', color: 'var(--primary-cyan)' },
                      { title: 'Vulnerabilities Found', value: '0 Critical', color: '#10B981' }
                    ].map((stat, i) => (
                      <div key={i} className="glass" style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.title}</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: stat.color, marginTop: '8px' }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="glass" style={{ padding: '20px', background: '#02040a', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'white', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <Terminal size={14} color="#10B981" />
                      Security scan stdout logs
                    </div>
                    
                    <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8892b0', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                      {`[INFO] Starting audit scan for: ${activeRepo}
[INFO] Resolving dependency graph lock file tree...
[INFO] Auditing 1,842 nested dependency nodes...
[SUCCESS] Lockfiles signed by secure registries.
[WARN] Low vulnerability warning: minimist@1.2.5 deep dependency nesting.
[INFO] Checking listening ports closure state...
[SUCCESS] Port config container isolated. No public exposure vector.
[SUCCESS] Security Scan complete. 0 critical, 0 high, 1 low severity warnings.`}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 5: ANALYTICS & DIAGNOSTICS */}
              {activeTab === 'analytics' && (
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '6px' }}>AI Operating Diagnostics</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tracks local vector builds, token computations, and CPU metrics.</p>
                  </div>

                  {/* Gauge rows */}
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {/* SVG Velocity Graph */}
                    <div className="glass" style={{ flex: 2, minWidth: '320px', padding: '20px', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Development Velocity Score</span>
                        <span style={{ color: 'var(--primary-cyan)' }}>+38% vs baseline</span>
                      </div>
                      
                      <svg viewBox="0 0 500 200" width="100%" height="150">
                        <defs>
                          <linearGradient id="chart-glow-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary-purple)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--primary-purple)" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        {/* Wave path */}
                        <path d="M 0 150 Q 80 80 150 120 T 300 40 T 450 90 L 500 90 L 500 200 L 0 200 Z" fill="url(#chart-glow-area)" />
                        <path d="M 0 150 Q 80 80 150 120 T 300 40 T 450 90 M 450 90 L 500 90" fill="none" stroke="var(--primary-purple)" strokeWidth="3" />
                        {/* Highlights */}
                        <circle cx="150" cy="120" r="4" fill="var(--primary-cyan)" />
                        <circle cx="300" cy="40" r="4" fill="var(--primary-cyan)" />
                      </svg>
                    </div>

                    {/* Gauges column */}
                    <div style={{ flex: 1.2, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                          <svg width="50" height="50" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary-cyan)" strokeDasharray="85, 100" strokeWidth="2.5" />
                          </svg>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '10px', color: 'white', fontWeight: 700 }}>85%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Index Embeddings Sync</div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginTop: '2px' }}>Fully Synced</div>
                        </div>
                      </div>

                      <div className="glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                          <svg width="50" height="50" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary-purple)" strokeDasharray="34, 100" strokeWidth="2.5" />
                          </svg>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '10px', color: 'white', fontWeight: 700 }}>34%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CPU/Memory Burden</div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginTop: '2px' }}>Cold Load</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SYSTEM STATUS FOOTER */}
            <div className="glass" style={{
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              background: 'rgba(5, 8, 22, 0.4)',
              borderColor: 'rgba(255,255,255,0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                  display: 'inline-block'
                }} />
                <span>DEV-OPERATIVE STATUS: ONLINE</span>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <span>API LATENCY: 84ms (Gemini Flash)</span>
                <span>SYNC CAP: 100% SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // RENDER LOGIN PAGE (/login)
  if (cleanPath === '/login') {
    return (
      <Layout currentPath={cleanPath} navigateTo={navigateTo}>
        <div style={{ maxWidth: '960px', margin: '40px auto 100px', padding: '0 20px', position: 'relative', zIndex: 5 }}>
          <div style={{
            display: 'flex',
            gap: '40px',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            justifyContent: 'center'
          }}>
            
            {/* LEFT SIDE: AI Portal Gateway Visual & Floating Holograms */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
              <div 
                className="glass glass-glow-purple" 
                style={{ 
                  padding: '36px', 
                  flex: 1, 
                  background: 'rgba(5, 8, 22, 0.65)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '20px',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '440px'
                }}
              >
                {/* Tech grid overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'radial-gradient(rgba(124, 58, 237, 0.08) 1.5px, transparent 1.5px)',
                  backgroundSize: '20px 20px',
                  opacity: 0.6,
                  pointerEvents: 'none'
                }} />
                
                {/* Scan line */}
                <div className="holo-scanline" />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--primary-purple)" className="animate-pulse" />
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary-purple)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      AI Gateway Node
                    </span>
                  </div>
                  <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    GATE_PORT: 8080
                  </span>
                </div>

                {/* Centered Glowing Circular Portal */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '30px 0', zIndex: 2, position: 'relative' }}>
                  
                  {/* Volumetric background glow */}
                  <div style={{
                    position: 'absolute',
                    width: '180px',
                    height: '180px',
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(34, 211, 238, 0.08) 50%, transparent 70%)',
                    filter: 'blur(20px)',
                    pointerEvents: 'none'
                  }} />

                  {/* Concentric rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      width: '150px',
                      height: '150px',
                      border: '1.5px dashed rgba(34, 211, 238, 0.35)',
                      borderRadius: '50%'
                    }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      width: '130px',
                      height: '130px',
                      border: '2px solid rgba(124, 58, 237, 0.25)',
                      borderRadius: '50%',
                      borderTopColor: 'var(--primary-purple)',
                      borderBottomColor: 'var(--primary-cyan)'
                    }}
                  />

                  {/* Inner active portal core */}
                  <motion.div
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #7c3aed 0%, #22d3ee 50%, #050816 100%)',
                      boxShadow: '0 0 35px rgba(124, 58, 237, 0.6), inset 0 0 15px rgba(255,255,255,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Terminal size={32} color="white" />
                  </motion.div>

                  {/* Floating Holographic widgets */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '-20px',
                      padding: '6px 12px',
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(5,8,22,0.8)',
                      borderRadius: '6px',
                      border: '1px solid rgba(34, 211, 238, 0.3)',
                      color: 'var(--primary-cyan)',
                      boxShadow: '0 5px 15px rgba(34, 211, 238, 0.1)'
                    }}
                  >
                    SYSTEM: AWAITING_KEY
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    style={{
                      position: 'absolute',
                      bottom: '-15px',
                      right: '-20px',
                      padding: '6px 12px',
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(5,8,22,0.8)',
                      borderRadius: '6px',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                      color: 'var(--primary-purple)',
                      boxShadow: '0 5px 15px rgba(124, 58, 237, 0.1)'
                    }}
                  >
                    SYNC_DECK: STANDBY
                  </motion.div>
                </div>

                {/* Footer specs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2 }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Diagnostics Console
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <div>SEC_GATE: auth.devpulse.io</div>
                    <div style={{ marginTop: '3px' }}>STATUS: awaiting security handshake key</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Interactive Glassmorphic Form */}
            <div style={{ flex: '1.2 1 450px' }}>
              <div className="glass" style={{ padding: '40px 32px', border: '1px solid rgba(124, 58, 237, 0.25)', boxShadow: '0 10px 40px rgba(124, 58, 237, 0.1), 0 0 30px rgba(0,0,0,0.6)', background: 'rgba(8, 12, 32, 0.65)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <AnimatePresence>
                  {!loginLoading ? (
                    <motion.form 
                      onSubmit={handleLoginSubmit}
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                    >
                      <div>
                        <h2 style={{ fontSize: '26px', color: 'white', marginBottom: '8px', fontWeight: 800 }}>Initialize Access</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                          Enter security handshake keys to connect with the operating core.
                        </p>
                      </div>

                      {/* Inputs */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Email */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                            Operator Email
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="operator@domain.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            onFocus={() => setFocusField('loginEmail')}
                            onBlur={() => setFocusField(null)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: `1px solid ${focusField === 'loginEmail' ? 'var(--primary-purple)' : 'var(--glass-border)'}`,
                              boxShadow: focusField === 'loginEmail' ? '0 0 12px rgba(124, 58, 237, 0.25)' : 'none',
                              borderRadius: '10px',
                              padding: '12px 16px',
                              color: 'white',
                              fontSize: '13px',
                              outline: 'none',
                              transition: 'all 0.3s'
                            }}
                          />
                        </div>

                        {/* Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                            Security Access Key
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            onFocus={() => setFocusField('loginPassword')}
                            onBlur={() => setFocusField(null)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: `1px solid ${focusField === 'loginPassword' ? 'var(--primary-purple)' : 'var(--glass-border)'}`,
                              boxShadow: focusField === 'loginPassword' ? '0 0 12px rgba(124, 58, 237, 0.25)' : 'none',
                              borderRadius: '10px',
                              padding: '12px 16px',
                              color: 'white',
                              fontSize: '13px',
                              outline: 'none',
                              transition: 'all 0.3s'
                            }}
                          />
                        </div>
                      </div>

                      {/* Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                        <button
                          type="submit"
                          style={{
                            width: '100%',
                            padding: '13px',
                            background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))',
                            border: 'none',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(124, 58, 237, 0.45)',
                            transition: 'transform 0.15s, box-shadow 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.01)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.65)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.45)';
                          }}
                        >
                          Initialize Connection
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>OR</span>
                          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                        </div>

                        <button 
                          type="button"
                          onClick={handleGithubConnect}
                          className="glass"
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '13px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Github fill="white" stroke="none" width={16} height={16} />
                          Authenticate via GitHub
                        </button>
                      </div>

                      {/* Onboarding links */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                        <button 
                          type="button"
                          onClick={() => navigateTo('/register')}
                          style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'var(--primary-cyan)', 
                            fontSize: '12px', 
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Request Operator Clearance (Register)
                        </button>
                        
                        <button 
                          type="button"
                          onClick={() => navigateTo('/')}
                          style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'var(--text-muted)', 
                            fontSize: '11px', 
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Cancel and return to landing cockpit
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <RefreshCw className="animate-spin" size={28} color="var(--primary-purple)" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 12px' }} />
                        <h3 style={{ fontSize: '18px', color: 'white' }}>Establishing Handshake...</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Decrypting active developer commands...</p>
                      </div>

                      {/* Console logs simulator */}
                      <div style={{
                        background: '#02040a',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        minHeight: '160px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        gap: '8px'
                      }}>
                        {loginLogs.map((log, index) => (
                          <div key={index} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--primary-cyan)' }}>
                            &gt; {log}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    );
  }

  // RENDER REGISTER PAGE (/register)
  if (cleanPath === '/register') {
    return (
      <Layout currentPath={cleanPath} navigateTo={navigateTo}>
        <div style={{ maxWidth: '960px', margin: '40px auto 100px', padding: '0 20px', position: 'relative', zIndex: 5 }}>
          <div style={{
            display: 'flex',
            gap: '40px',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            justifyContent: 'center'
          }}>
            
            {/* LEFT SIDE: Holographic Identity Creation Card */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
              <div 
                className="glass glass-glow-cyan" 
                style={{ 
                  padding: '36px', 
                  flex: 1, 
                  background: 'rgba(5, 8, 22, 0.6)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '24px',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Tech lines background grid overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'radial-gradient(rgba(34, 211, 238, 0.08) 1.5px, transparent 1.5px)',
                  backgroundSize: '20px 20px',
                  opacity: 0.5,
                  pointerEvents: 'none'
                }} />
                
                {/* Scan line */}
                <div className="holo-scanline" />

                {/* Badge Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16} color="var(--primary-cyan)" className="animate-pulse" />
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary-cyan)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      ID Security Matrix
                    </span>
                  </div>
                  <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    SEC-CLASS 01
                  </span>
                </div>

                {/* Center avatar scanner */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: '20px 0', zIndex: 2 }}>
                  <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                    {/* Ring animations */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: '2px dashed var(--primary-purple)',
                        borderRadius: '50%'
                      }}
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        left: '5px',
                        width: '80px',
                        height: '80px',
                        border: '1.5px solid var(--primary-cyan)',
                        borderRadius: '50%',
                        borderTopColor: 'transparent',
                        borderBottomColor: 'transparent'
                      }}
                    />
                    
                    {/* Centered code icon */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'rgba(8, 12, 32, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)'
                    }}>
                      <Code size={28} color="white" />
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
                      {regUsername || 'OPERATOR_PENDING'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      HOST: {regEmail ? regEmail.split('@')[1] || 'DNS_STANDBY' : 'DNS_STANDBY'}
                    </div>
                  </div>
                </div>

                {/* Identity Metadata List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', zIndex: 2 }}>
                  {[
                    { label: 'Security Level', value: 'TIER-01 CORE', color: 'var(--primary-cyan)' },
                    { label: 'Encryption Core', value: 'SHA-256 (ACTIVE)', color: 'var(--primary-purple)' },
                    { label: 'Handshake Status', value: regUsername ? 'SYNCED & SECURED' : 'AWAITING HANDSHAKE', color: regUsername ? '#10b981' : '#F59E0B' }
                  ].map((field, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{field.label}</span>
                      <span style={{ color: field.color, fontWeight: 700 }}>{field.value}</span>
                    </div>
                  ))}
                </div>
                
                {/* Oscillating technical grid mark */}
                <div style={{ display: 'flex', gap: '3px', height: '14px', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [2, Math.random() * 12 + 2, 2] }}
                      transition={{ duration: 0.6 + i * 0.05, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: '2px',
                        background: 'rgba(34, 211, 238, 0.4)',
                        borderRadius: '1px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Onboarding Registration Form */}
            <div style={{ flex: '1.2 1 450px' }}>
              <div className="glass" style={{ padding: '40px 32px', border: '1px solid rgba(124, 58, 237, 0.25)', boxShadow: '0 10px 40px rgba(124, 58, 237, 0.1), 0 0 30px rgba(0,0,0,0.6)', background: 'rgba(8, 12, 32, 0.65)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <AnimatePresence>
                  {!regLoading ? (
                    <motion.form 
                      onSubmit={handleRegisterSubmit}
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                    >
                      <div>
                        <h2 style={{ fontSize: '26px', color: 'white', marginBottom: '8px', fontWeight: 800 }}>Create Identity</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                          Register your cryptographic profile to enter the cockpit.
                        </p>
                      </div>

                      {/* Inputs wrapper */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Username */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                            Operator Username
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. neophyte_coder"
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value)}
                            onFocus={() => setFocusField('username')}
                            onBlur={() => setFocusField(null)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: `1px solid ${focusField === 'username' ? 'var(--primary-cyan)' : 'var(--glass-border)'}`,
                              boxShadow: focusField === 'username' ? '0 0 12px rgba(34, 211, 238, 0.25)' : 'none',
                              borderRadius: '10px',
                              padding: '12px 16px',
                              color: 'white',
                              fontSize: '13px',
                              outline: 'none',
                              transition: 'all 0.3s'
                            }}
                          />
                        </div>

                        {/* Email */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                            Gateway Email Address
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. operator@domain.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            onFocus={() => setFocusField('email')}
                            onBlur={() => setFocusField(null)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: `1px solid ${focusField === 'email' ? 'var(--primary-cyan)' : 'var(--glass-border)'}`,
                              boxShadow: focusField === 'email' ? '0 0 12px rgba(34, 211, 238, 0.25)' : 'none',
                              borderRadius: '10px',
                              padding: '12px 16px',
                              color: 'white',
                              fontSize: '13px',
                              outline: 'none',
                              transition: 'all 0.3s'
                            }}
                          />
                        </div>

                        {/* Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                            Security Access Key (Password)
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            onFocus={() => setFocusField('password')}
                            onBlur={() => setFocusField(null)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: `1px solid ${focusField === 'password' ? 'var(--primary-cyan)' : 'var(--glass-border)'}`,
                              boxShadow: focusField === 'password' ? '0 0 12px rgba(34, 211, 238, 0.25)' : 'none',
                              borderRadius: '10px',
                              padding: '12px 16px',
                              color: 'white',
                              fontSize: '13px',
                              outline: 'none',
                              transition: 'all 0.3s'
                            }}
                          />
                        </div>
                      </div>

                      {/* Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                        <button
                          type="submit"
                          style={{
                            width: '100%',
                            padding: '13px',
                            background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))',
                            border: 'none',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(124, 58, 237, 0.45)',
                            transition: 'transform 0.15s, box-shadow 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.01)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.65)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.45)';
                          }}
                        >
                          Create Account
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>OR</span>
                          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                        </div>

                        <button 
                          type="button"
                          onClick={handleGithubConnect}
                          className="glass"
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '13px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Github fill="white" stroke="none" width={16} height={16} />
                          Sign Up with GitHub
                        </button>
                      </div>

                      {/* Footer links */}
                      <button 
                        type="button"
                        onClick={() => navigateTo('/login')}
                        style={{ 
                          background: 'transparent', 
                          border: 'none', 
                          color: 'var(--primary-cyan)', 
                          fontSize: '12px', 
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          textAlign: 'center',
                          marginTop: '6px'
                        }}
                      >
                        Already registered? Access cockpit
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <RefreshCw className="animate-spin" size={28} color="var(--primary-cyan)" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 12px' }} />
                        <h3 style={{ fontSize: '18px', color: 'white' }}>Onboarding Profile...</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Registering credentials to the DevPulse global index.</p>
                      </div>

                      {/* Console logs simulator */}
                      <div style={{
                        background: '#02040a',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        minHeight: '160px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        gap: '8px'
                      }}>
                        {regLogs.map((log, index) => (
                          <div key={index} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--primary-cyan)' }}>
                            &gt; {log}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    );
  }

  // RENDER COMMAND CENTER DASHBOARD (/dashboard)
  if (cleanPath === '/dashboard') {
    const totalRepos = repos.length || githubStats?.public_repos || 0;
    const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
    const totalForks = repos.reduce((sum, r) => sum + (r.forks || 0), 0);
    const followers = githubStats?.followers || 0;
    const following = githubStats?.following || 0;
    const productivityScore = Math.min(100, Math.round(((totalStars + totalForks) / Math.max(1, totalRepos)) + (followers / Math.max(1, totalRepos)) * 5));
    const streakDays = Math.min(90, Math.max(0, Math.floor(totalRepos * 2)));

    return (
      <Layout currentPath={cleanPath} navigateTo={navigateTo}>
        {/* Dynamic canvas-based neural network background */}
        <NeuralNetworkBackground />
        
        <div style={{ maxWidth: '1240px', margin: '-20px auto 40px', padding: '0 20px', position: 'relative', zIndex: 5 }}>
          
          {/* Dashboard Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '28px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
                <Cpu size={24} color="var(--primary-cyan)" />
                Operating Deck Dashboard
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Real-time synchronized developer intelligence, security logs, and AI score indexes.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                className="glass" 
                style={{ padding: '10px 18px', fontSize: '12px', color: 'white', border: '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
              >
                <Search size={14} color="var(--primary-cyan)" />
                Search Deck (Cmd+K)
              </button>
              <button 
                onClick={() => navigateTo('/devbot')}
                style={{ 
                  padding: '10px 20px', 
                  fontSize: '12px', 
                  color: 'white', 
                  background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))', 
                  border: 'none', 
                  borderRadius: '10px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontWeight: 700,
                  boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)'
                }}
              >
                <Terminal size={14} />
                Open DevBot Chat
              </button>
            </div>
          </div>

          {/* METRICS DECK: 6 Column grid of glass summary cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            {[
              { title: 'Total Repositories', value: totalRepos, subtitle: 'Synced context files', icon: FolderTree, color: 'var(--primary-cyan)' },
              { title: 'Total Stars', value: totalStars, subtitle: 'Across synced repositories', icon: FileCode, color: 'var(--primary-purple)' },
              { title: 'Total Forks', value: totalForks, subtitle: 'Repository forks', icon: Layers, color: 'var(--primary-blue)' },
              { title: 'Followers', value: followers, subtitle: 'People watching you', icon: Zap, color: '#F59E0B' },
              { title: 'Following', value: following, subtitle: 'Accounts you follow', icon: Sparkles, color: '#10B981' },
              { title: 'Public Repos', value: githubStats?.public_repos || 0, subtitle: 'Visible on GitHub', icon: HeartPulse, color: '#10B981' }
            ].map((metric, i) => (
              <div 
                key={i} 
                className="glass" 
                style={{ 
                  padding: '20px', 
                  background: 'rgba(5, 8, 22, 0.55)', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '135px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{metric.title}</span>
                  <metric.icon size={16} color={metric.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>{metric.value}</h3>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>{metric.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* DECK GRID: Split dashboard core visual */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            
            {/* LEFT COLUMN: Reactor, Holograph, & Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Productivity Reactor Centpiece */}
              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)', border: '1px solid rgba(124, 58, 237, 0.15)', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', minHeight: '260px' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <ProductivityReactor score={productivityScore} status="boosting" />
                </div>
                <div style={{ flex: '1.2 1 200px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '18px', color: 'white', fontWeight: 800 }}>Productivity Reactor</h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Centralized cybernetic tracker monitoring active workspace outputs. System currently running in **BOOSTING_OVERDRIVE** due to {streakDays} consecutive streak days.
                  </p>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary-cyan)' }}>
                    &gt; API core synopses: stable (Gemini Flash)
                  </div>
                </div>
              </div>

              {/* Holographic Graph commits density */}
              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', color: 'white', fontWeight: 700 }}>Concentric Commits Matrix</h3>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>7 Days Cycle</span>
                </div>
                
                {/* SVG Graph commits */}
                <svg viewBox="0 0 500 180" width="100%" height="150">
                  <defs>
                    <linearGradient id="glow-wave-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary-cyan)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--primary-cyan)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid layout */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  
                  {/* Glowing graph fill */}
                  <path d="M 0 140 Q 60 70 120 110 T 240 30 T 360 80 T 500 45 L 500 180 L 0 180 Z" fill="url(#glow-wave-grad)" />
                  <path d="M 0 140 Q 60 70 120 110 T 240 30 T 360 80 T 500 45" fill="none" stroke="var(--primary-cyan)" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 6px var(--primary-cyan))' }} />
                  
                  {/* Glowing grid coordinates */}
                  <circle cx="120" cy="110" r="4.5" fill="white" stroke="var(--primary-purple)" strokeWidth="2.5" />
                  <circle cx="240" cy="30" r="4.5" fill="white" stroke="var(--primary-purple)" strokeWidth="2.5" />
                  <circle cx="360" cy="80" r="4.5" fill="white" stroke="var(--primary-purple)" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Quick actions button deck */}
              <div className="glass" style={{ padding: '20px', background: 'rgba(5, 8, 22, 0.55)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '14px', color: 'white', marginBottom: '14px', fontWeight: 700, letterSpacing: '0.5px' }}>Command Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {[
                    { label: 'Sync Repository', action: () => navigateTo('/devbot'), icon: RefreshCw },
                    { label: 'Optimize Loops', action: () => navigateTo('/devbot?action=Optimization'), icon: Zap },
                    { label: 'Inspect Security', action: () => navigateTo('/devbot?action=Security%20Scan'), icon: Shield },
                    { label: 'Search Semantics', action: () => navigateTo('/devbot?action=Semantic%20Search'), icon: Search }
                  ].map((btn, i) => (
                    <button
                      key={i}
                      onClick={btn.action}
                      className="glass"
                      style={{
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.35)';
                        e.currentTarget.style.background = 'rgba(124, 58, 237, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      }}
                    >
                      <btn.icon size={13} color="var(--primary-cyan)" />
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Scrolling Live Feed & AI Insights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Scrolling Live Ticker Feed */}
              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse-glow 2s infinite ease-in-out' }} />
                    Live Activity Stream
                  </h3>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>active ticks: online</span>
                </div>
                
                {/* Scrolling ticker */}
                <LiveActivityFeed />
              </div>

              {/* AI Insights Board */}
              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '16px', fontWeight: 700 }}>AI Core Insights</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { text: 'Peak coding efficiency mapped between 10:00 - 12:00. Recommend scheduling complex tasks in this frame.', icon: Sparkles, color: 'var(--primary-cyan)' },
                    { text: 'Active repository structures show high modular index score. Keep component files loaded lazily.', icon: FileCode, color: 'var(--primary-purple)' },
                    { text: 'Burnout notice: 4.5 consecutive hours coding loops detected. Suggest taking a 15-minute rest interval.', icon: HeartPulse, color: '#EF4444' }
                  ].map((insight, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        fontSize: '12px', 
                        lineHeight: '1.6', 
                        padding: '12px 14px', 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.04)', 
                        borderRadius: '8px',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <insight.icon size={16} color={insight.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{insight.text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* SYSTEM STATUS FOOTER */}
        <div style={{ maxWidth: '1240px', margin: '0 auto 40px', padding: '0 20px', zIndex: 5, position: 'relative' }}>
          <div className="glass" style={{
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            background: 'rgba(5, 8, 22, 0.4)',
            borderColor: 'rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
                display: 'inline-block'
              }} />
              <span>DASHBOARD METRICS CONSOLE: ONLINE</span>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <span>ACTIVE MODEL: GEMINI 3.5 FLASH (LOW)</span>
              <span>SYNC CAP: 100% SECURE</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // AI Changelog generator simulation
  const handleGenerateChangelog = async () => {
    console.log('Changelog button clicked!');
    setChangelogLoading(true);
    setChangelogLogs([]);
    setChangelogContent('');

    const logs = [
      'Locating active context repositories...',
      'Mapping Git commit history on branch "main"...',
      'Identifying feature entries & structural changes...',
      'Synthesizing logs via DevBot AI model...',
      'Writing secure output release notes...'
    ];

    logs.forEach((logText, idx) => {
      setTimeout(() => {
        setChangelogLogs(prev => [...prev, logText]);
      }, (idx + 1) * 550);
    });

    try {
      const token = localStorage.getItem('token');
      const repoName = activeRepo.split('/')[1];
      console.log('Token:', token);
      console.log('Repo name:', repoName);
      console.log('Active repo:', activeRepo);

      // Fetch real commits first
      const commitsRes = await axios.get(
        `http://localhost:5000/api/github/repos/${repoName}/commits`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Commits:', commitsRes.data);

      // Send commits to Groq AI
      const aiRes = await axios.post(
        'http://localhost:5000/api/ai/changelog',
        {
          commits: commitsRes.data,
          repoName: activeRepo
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('AI Response:', aiRes.data);

      setTimeout(() => {
        setChangelogContent(aiRes.data.changelog);
        setChangelogLoading(false);
      }, 3100);

    } catch (err) {
      console.log('Error:', err);
      setTimeout(() => {
        setChangelogContent('❌ Failed to generate changelog. Please try again.');
        setChangelogLoading(false);
      }, 3100);
    }
  };

  // AI README generator simulation
  const handleGenerateReadme = async () => {
    setReadmeLoading(true);
    setReadmeLogs([]);
    setReadmeContent('');

    const logs = [
      'Scanning files in root workspace...',
      'Reading structural routes inside App.jsx...',
      'Analyzing component exports for DevBot & Layout...',
      'Drafting overview descriptions & settings guides...',
      'Compiling complete output documentation...'
    ];

    logs.forEach((logText, idx) => {
      setTimeout(() => {
        setReadmeLogs(prev => [...prev, logText]);
      }, (idx + 1) * 550);
    });

    try {
      const token = localStorage.getItem('token');
      const repoName = activeRepo.split('/')[1];

      // Fetch repo details from GitHub
      const reposRes = await axios.get(
        `http://localhost:5000/api/github/repos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Find current active repo details
      const repoDetails = reposRes.data.find(r => r.name === repoName) || {};

      // Send to Groq AI
      const aiRes = await axios.post(
        'http://localhost:5000/api/ai/readme',
        {
          repoName: activeRepo,
          description: repoDetails.description,
          language: repoDetails.language
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTimeout(() => {
        setReadmeContent(aiRes.data.readme);
        setReadmeLoading(false);
      }, 3100);

    } catch (err) {
      setTimeout(() => {
        setReadmeContent('❌ Failed to generate README. Please try again.');
        setReadmeLoading(false);
      }, 3100);
    }
  };

  // Immersive Chat submit handler
  const handleChatSubmit = async (e) => {
    e?.preventDefault();
    if (!chatInputText.trim()) return;

    const userMessage = { id: Date.now(), text: chatInputText, sender: 'user' };
    setChatMessages(prev => [...prev, userMessage]);
    const input = chatInputText;
    setChatInputText('');
    setChatTypingState(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/chat',
        {
          message: input,
          repoContext: activeRepo
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot'
      }]);

    } catch (err) {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '❌ DevBot connection failed. Please try again.',
        sender: 'bot'
      }]);
    } finally {
      setChatTypingState(false);
    }
  };

  // RENDER PROFILE PAGE (/profile)
  if (cleanPath === '/profile') {
    return (
      <Layout currentPath={cleanPath} navigateTo={navigateTo}>
        <NeuralNetworkBackground />



        <div style={{ maxWidth: '1240px', margin: '-20px auto 40px', padding: '0 20px', position: 'relative', zIndex: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '18px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '32px', color: 'white', fontWeight: 800, margin: 0 }}>Profile Command Center</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '10px', maxWidth: '680px', lineHeight: 1.7 }}>
                Premium developer profile experience with connected GitHub status, repo intelligence, productivity analytics, and DevBot performance insights.
              </p>
            </div>
            <button
              onClick={() => navigateTo('/dashboard')}
              className="glass"
              style={{
                padding: '12px 22px',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.18), rgba(34, 211, 238, 0.18))',
                borderRadius: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Back to Dashboard
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.95fr', gap: '24px', minHeight: 'calc(100vh - 190px)' }}>
            <div style={{ display: 'grid', gap: '24px' }}>
              <div className="glass" style={{ padding: '28px', background: 'rgba(5, 8, 22, 0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: '98px',
                      height: '98px',
                      borderRadius: '26px',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(124, 58, 237, 0.15))',
                      border: '1px solid rgba(255,255,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={36} color="var(--primary-cyan)" />
                    </div>
                  </motion.div>

                  <div style={{ minWidth: '260px' }}>
                    {githubStats?.avatar && (
                      <img
                        src={githubStats.avatar}
                        alt={`${loggedInUsername}'s avatar`}
                        style={{ width: '72px', height: '72px', borderRadius: '12px', marginBottom: '12px', objectFit: 'cover' }}
                      />
                    )}
                    <h3 style={{ fontSize: '22px', color: 'white', margin: 0, fontWeight: 800 }}>{loggedInUsername}</h3>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {loggedInEmail}
                    </div>
                    <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ padding: '8px 12px', fontSize: '11px', color: 'white', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)' }}>Premium Plan</span>
                      <span style={{ padding: '8px 12px', fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        Joined {new Date().getFullYear()}
                      </span>
                  </div>
                </div>
              </div>  

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', marginTop: '28px' }}>
                  <div className="glass" style={{ padding: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>GitHub</span>
                      <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700 }}>Connected</span>
                    </div>
                    <div style={{ fontSize: '23px', color: 'white', fontWeight: 800 }}>{githubStats ? 'yes' : 'no'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>Managed via OAuth with repo sync, pull request scoring, and security insights.</div>
                  </div>

                  <div className="glass" style={{ padding: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Repos Indexed</span>
                      <Key size={16} color="var(--primary-cyan)" />
                    </div>
                    <div style={{ fontSize: '23px', color: 'white', fontWeight: 800 }}>{repos.length || 0}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>Repositories synced and indexed for DevBot analysis.</div>
                  </div>
                </div>
              </div>

              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', color: 'white', margin: 0 }}>DevBot Usage Statistics</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.06)' }}>Weekly</span>
                </div>
                <div style={{ display: 'grid', gap: '14px' }}>
                  {[
                    { label: 'Public Repos', value: githubStats?.public_repos || '0', icon: MessageSquare },
                    { label: 'Followers', value: githubStats?.followers || '0', icon: FileText },
                    { label: 'Following', value: githubStats?.following || '0', icon: FileCode }
                  ].map((metric, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{metric.label}</div>
                        <div style={{ fontSize: '20px', color: 'white', fontWeight: 800 }}>{metric.value}</div>
                      </div>
                      <metric.icon size={18} color="var(--primary-cyan)" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', color: 'white', margin: 0 }}>Repositories Managed</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>Sync status across your active repo portfolio.</p>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--primary-purple)', fontWeight: 700 }}>{repos.length || 0} repos</span>
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {repos.length > 0 ? repos.slice(0, 4).map((repo) => (
                    <div key={repo.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                      <span style={{ color: 'white', fontSize: '13px' }}>{repo.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Synced</span>
                    </div>
                  )) : (
                    <div style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center' }}>No repositories found</div>
                  )}
                </div>
              </div>

              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', color: 'white', margin: 0 }}>GitHub Statistics</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>Your GitHub profile metrics at a glance.</p>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--primary-cyan)', fontWeight: 700 }}>Live</span>
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    { title: 'Public Repositories', value: githubStats?.public_repos || 0 },
                    { title: 'Followers', value: githubStats?.followers || 0 },
                    { title: 'Following', value: githubStats?.following || 0 }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.title}</span>
                      <span style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', minHeight: '720px', display: 'grid', gap: '24px' }}>
              <div className="glass" style={{ padding: '28px', background: 'rgba(5, 8, 22, 0.72)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '360px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '18px', color: 'white', margin: 0 }}>Floating Stack Orbit</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tech pulse</span>
                </div>

                <div style={{ position: 'relative', width: '100%', height: '340px' }}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      inset: '0',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 0 40px rgba(34, 211, 238, 0.08)'
                    }}
                  />

                  {[
                    { icon: Code, label: 'React', x: '16%', y: '25%', delay: 0 },
                    { icon: FileText, label: 'Docs', x: '74%', y: '18%', delay: 0.6 },
                    { icon: Shield, label: 'Security', x: '82%', y: '68%', delay: 1.2 },
                    { icon: Zap, label: 'Automation', x: '44%', y: '80%', delay: 1.8 },
                    { icon: Activity, label: 'AI', x: '12%', y: '66%', delay: 2.4 }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: [0.96, 1.05, 0.96] }}
                      transition={{ delay: item.delay, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        top: item.y,
                        left: item.x,
                        transform: 'translate(-50%, -50%)',
                        width: '72px',
                        height: '72px',
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(0,0,0,0.2)'
                      }}
                    >
                      <item.icon size={24} color="var(--primary-cyan)" />
                    </motion.div>
                  ))}

                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '170px',
                      height: '170px',
                      transform: 'translate(-50%, -50%)',
                      borderRadius: '30px',
                      background: 'rgba(6, 10, 26, 0.8)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 30px rgba(34, 211, 238, 0.18)'
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(34, 211, 238, 0.2))' }}>
                        <User size={24} color="white" />
                      </div>
                      <h4 style={{ color: 'white', fontSize: '16px', margin: 0 }}>Core Profile</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '6px' }}>Secure identity and cloud connection layer.</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '18px', color: 'white', margin: 0 }}>Productivity Trends</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trend score</span>
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    { label: 'Velocity Index', value: '92%', accent: 'var(--primary-cyan)' },
                    { label: 'Review Efficiency', value: '87%', accent: 'var(--primary-purple)' },
                    { label: 'AI Collaboration', value: '74%', accent: 'var(--primary-blue)' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'grid', gap: '6px', padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.label}</span>
                        <span style={{ color: item.accent, fontWeight: 700, fontSize: '13px' }}>{item.value}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                        <div style={{ width: item.value, height: '100%', background: item.accent, borderRadius: '999px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', color: 'white', margin: 0 }}>Secure Keys</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>Manage API keys and authentication tokens for DevBot integrations.</p>
                  </div>
                  <Key size={18} color="var(--primary-cyan)" />
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    { label: 'devpulse-ci', status: 'active' },
                    { label: 'devbot-api', status: 'active' },
                    { label: 'analytics-read', status: 'revoked' }
                  ].map((key, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <div style={{ color: 'white', fontSize: '13px' }}>{key.label}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{key.status === 'active' ? 'Active key' : 'Revoked'}</div>
                      </div>
                      <span style={{ fontSize: '11px', color: { active: '#34d399', revoked: '#f97316' }[key.status], fontWeight: 700, textTransform: 'uppercase' }}>{key.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigateTo('/login');
                }}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // RENDER PROJECT DETAIL PAGE (/project)
  if (cleanPath === '/project') {
    return (
      <Layout currentPath={cleanPath} navigateTo={navigateTo}>
        <NeuralNetworkBackground />

        <div style={{ maxWidth: '1240px', margin: '-20px auto 40px', padding: '0 20px', position: 'relative', zIndex: 5 }}>
          
          {/* Header Dashboard Grid */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '28px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
                <Layers size={24} color="var(--primary-cyan)" />
                Project Detail Deck
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Granular repository health indexing, orbital commit vectors, and document synthesis.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <select 
                value={activeRepo}
                onChange={(e) => setActiveRepo(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: 'white',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="pranitabhortakke7/devpulse" style={{ background: '#050816' }}>pranitabhortakke7/devpulse</option>
                <option value="vercel/next.js" style={{ background: '#050816' }}>vercel/next.js</option>
              </select>
            </div>
          </div>

          {/* Centerpiece planet & health ring columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            
            {/* LEFT: Project Planet Canvas */}
            <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '340px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', alignSelf: 'flex-start' }}>
                Commit Vectors Core
              </div>
              <ProjectPlanet />
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '12px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                Hover orbit particles to scan commit metadata
              </div>
            </div>

            {/* RIGHT: Concentric Health Ring */}
            <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '340px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Repository Health Ring
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: '180px' }}>
                  
                  {/* Neon pulsing circles */}
                  <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Ring 1: Documentation (92%) */}
                    <circle cx="90" cy="90" r="70" stroke="rgba(124, 58, 237, 0.08)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="90" cy="90" r="70" 
                      stroke="var(--primary-purple)" 
                      strokeWidth="8" 
                      strokeDasharray="440" 
                      strokeDashoffset={440 - (440 * 92) / 100}
                      strokeLinecap="round" 
                      fill="none" 
                      className="health-ring-segment"
                      onMouseEnter={() => setHealthHoverField({ name: 'Documentation Density', val: '92%', desc: 'Coverage of functions documented with inline specs.' })}
                      onMouseLeave={() => setHealthHoverField(null)}
                    />

                    {/* Ring 2: Code Coverage (88%) */}
                    <circle cx="90" cy="90" r="50" stroke="rgba(34, 211, 238, 0.08)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="90" cy="90" r="50" 
                      stroke="var(--primary-cyan)" 
                      strokeWidth="8" 
                      strokeDasharray="314" 
                      strokeDashoffset={314 - (314 * 88) / 100}
                      strokeLinecap="round" 
                      fill="none" 
                      className="health-ring-segment"
                      onMouseEnter={() => setHealthHoverField({ name: 'Unit Test Coverage', val: '88%', desc: 'Calculated test statement checkpoints executed.' })}
                      onMouseLeave={() => setHealthHoverField(null)}
                    />

                    {/* Ring 3: Code Quality (85%) */}
                    <circle cx="90" cy="90" r="30" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="90" cy="90" r="30" 
                      stroke="#10b981" 
                      strokeWidth="8" 
                      strokeDasharray="188" 
                      strokeDashoffset={188 - (188 * 85) / 100}
                      strokeLinecap="round" 
                      fill="none" 
                      className="health-ring-segment"
                      onMouseEnter={() => setHealthHoverField({ name: 'Code Quality Score', val: '85%', desc: 'Syntactic rule compliance and complexity ceiling.' })}
                      onMouseLeave={() => setHealthHoverField(null)}
                    />
                  </svg>

                  {/* Center metrics overlay */}
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>88.3%</div>
                    <div style={{ fontSize: '9px', color: 'var(--primary-cyan)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>AVG SCORE</div>
                  </div>
                </div>
              </div>

              {/* Dynamic tooltip box */}
              <div style={{ minHeight: '60px', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', marginTop: '10px' }}>
                {healthHoverField ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>{healthHoverField.name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-cyan)' }}>{healthHoverField.val}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '3px' }}>{healthHoverField.desc}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', paddingTop: '10px' }}>
                    Hover health ring rings to inspect granular metrics
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Description & timeline deck columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            
            {/* Overview & Description Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Project Description */}
              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)' }}>
                <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '10px', fontWeight: 700 }}>Project Profile</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Unified AI operating cockpit linked to repository contexts. This deck allows operators to run semantic matches, compile release notes, scan dependency configurations, and inspect structural file logs.
                </p>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', background: 'rgba(124, 58, 237, 0.08)', color: 'var(--primary-purple)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
                    LANGUAGE: JavaScript (94%)
                  </span>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', background: 'rgba(34, 211, 238, 0.08)', color: 'var(--primary-cyan)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(34, 211, 238, 0.15)' }}>
                    STARS: 1.2k
                  </span>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                    FORKS: 340
                  </span>
                </div>
              </div>

              {/* Contributors Grid */}
              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)' }}>
                <h3 style={{ fontSize: '14px', color: 'white', marginBottom: '14px', fontWeight: 700 }}>Active Node Operators</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {[
                    { name: 'pranitabhortakke7', role: 'Owner', color: 'var(--primary-cyan)' },
                    { name: 'dependabot[bot]', role: 'Security Node', color: '#10b981' },
                    { name: 'vercel-integration', role: 'Deployment Deploy', color: 'var(--primary-purple)' },
                    { name: 'alex_coder', role: 'Collaborator', color: 'var(--primary-blue)' }
                  ].map((usr, i) => (
                    <div 
                      key={i} 
                      className="glass" 
                      style={{ 
                        padding: '10px 14px', 
                        background: 'rgba(255,255,255,0.01)', 
                        border: '1px solid rgba(255,255,255,0.04)', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px' 
                      }}
                    >
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: usr.color, opacity: 0.8 }} />
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>{usr.name}</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{usr.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Recent commits timeline */}
            <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', color: 'white', fontWeight: 700 }}>Recent Commits Core</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1.5px dashed rgba(255,255,255,0.08)', paddingLeft: '16px', marginLeft: '6px' }}>
                {commitsLoading ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '8px 0' }}>Loading commits...</div>
                ) : commits.length > 0 ? (
                  commits.map((cmt, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      {/* Ring timeline indicator */}
                      <div style={{
                        position: 'absolute',
                        left: '-24px',
                        top: '3px',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#050816',
                        border: `2px solid var(--primary-cyan)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />
                      </div>

                      <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary-cyan)', fontWeight: 700 }}>
                        {cmt.sha} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>• {new Date(cmt.date).toLocaleString()}</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'white', marginTop: '4px' }}>
                        {cmt.message}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                        Author: {cmt.author}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '8px 0' }}>No commits found for this repository.</div>
                )}
              </div>
            </div>

          </div>

          {/* AI Generator components */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            {/* AI Changelog Generator */}
            <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--primary-purple)" />
                  AI Changelog Generator
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Compiles recent commits and release details into a formatted release notes markdown.
                </p>
              </div>

              {!changelogContent && !changelogLoading && (
                <button 
                  onClick={handleGenerateChangelog}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '12px',
                    boxShadow: '0 0 12px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  Generate Release Notes
                </button>
              )}

              {changelogLoading && (
                <div style={{ background: '#02040a', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '6px' }}>
                  <div style={{ alignSelf: 'center', margin: 'auto 0' }}>
                    <RefreshCw className="animate-spin" size={20} color="var(--primary-purple)" style={{ animation: 'spin 2s linear infinite' }} />
                  </div>
                  {changelogLogs.map((log, i) => (
                    <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--primary-cyan)' }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              )}

              {changelogContent && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <pre style={{
                    background: '#02040a',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    color: '#e2e8f0',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '220px',
                    overflowY: 'auto'
                  }}>
                    {changelogContent}
                  </pre>
                  <button 
                    onClick={handleGenerateChangelog}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '6px', color: 'white', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Re-generate Changelog
                  </button>
                </div>
              )}
            </div>

            {/* AI README Generator */}
            <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.55)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--primary-cyan)" />
                  AI README Generator
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Scans workspace directories to compile interactive setup and usage instructions.
                </p>
              </div>

              {!readmeContent && !readmeLoading && (
                <button 
                  onClick={handleGenerateReadme}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-blue))',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '12px',
                    boxShadow: '0 0 12px rgba(34, 211, 238, 0.3)'
                  }}
                >
                  Generate README.md
                </button>
              )}

              {readmeLoading && (
                <div style={{ background: '#02040a', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '6px' }}>
                  <div style={{ alignSelf: 'center', margin: 'auto 0' }}>
                    <RefreshCw className="animate-spin" size={20} color="var(--primary-cyan)" style={{ animation: 'spin 2s linear infinite' }} />
                  </div>
                  {readmeLogs.map((log, i) => (
                    <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: '#10b981' }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              )}

              {readmeContent && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <pre style={{
                    background: '#02040a',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    color: '#e2e8f0',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '220px',
                    overflowY: 'auto'
                  }}>
                    {readmeContent}
                  </pre>
                  <button 
                    onClick={handleGenerateReadme}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '6px', color: 'white', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Re-generate README
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </Layout>
    );
  }

  // RENDER DEDICATED DEVOBOT CHAT PAGE (/chat)
  if (cleanPath === '/chat') {
    return (
      <Layout currentPath={cleanPath} navigateTo={navigateTo}>
        <NeuralNetworkBackground />

        <div style={{ maxWidth: '1140px', margin: '-20px auto 40px', padding: '0 20px', position: 'relative', zIndex: 5, minHeight: 'calc(100vh - 160px)' }}>
          <div style={{ position: 'absolute', top: '40px', right: '30px', width: '220px', height: '220px', background: 'rgba(34, 211, 238, 0.08)', borderRadius: '30px', filter: 'blur(70px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '280px', left: '-30px', width: '180px', height: '180px', background: 'rgba(124, 58, 237, 0.12)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 0.95fr', gap: '24px', minHeight: '600px', position: 'relative', zIndex: 2 }}>

            <div className="glass" style={{ padding: '28px', background: 'rgba(4, 8, 20, 0.72)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <MessageSquare size={22} color="var(--primary-cyan)" />
                    <h2 style={{ fontSize: '28px', color: 'white', margin: 0, lineHeight: 1.05 }}>DevBot AI Chat</h2>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.8 }}>
                    Ask questions about your repository, explain code files, generate changelogs and README content, and interact with a futuristic AI command cockpit.
                  </p>
                </div>

                <div style={{ display: 'grid', gap: '10px', minWidth: '220px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Repo</span>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '12px' }}>
                    {activeRepo}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current File</span>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '12px' }}>
                    {chatSelectedFile}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {[
                  { label: 'Explain current file', prompt: `Explain ${chatSelectedFile} in detail.` },
                  { label: 'Summarize selected file', prompt: `Summarize the purpose of ${chatSelectedFile}.` },
                  { label: 'Find bugs', prompt: `Review ${chatSelectedFile} for potential bugs.` },
                  { label: 'Rewrite docs', prompt: `Generate documentation for ${chatSelectedFile}.` }
                ].map((quick) => (
                  <button
                    key={quick.label}
                    onClick={() => handleChatSubmit(quick.prompt)}
                    className="glass"
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    {quick.label}
                  </button>
                ))}
              </div>

              <div className="glass chat-messages-container" style={{ flex: 1, padding: '24px', background: 'rgba(4, 8, 20, 0.85)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      display: 'flex',
                      gap: '12px',
                      maxWidth: '78%',
                      alignItems: 'flex-start'
                    }}
                  >
                    {msg.sender === 'bot' && (
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.16)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Cpu size={14} color="var(--primary-cyan)" />
                      </div>
                    )}

                    <div 
                      className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
                      style={{
                        padding: '16px 20px',
                        fontSize: '13px',
                        lineHeight: '1.7',
                        color: 'white',
                        whiteSpace: 'pre-wrap',
                        boxShadow: msg.sender === 'user' ? '0 12px 32px rgba(34, 211, 238, 0.12)' : '0 12px 32px rgba(124, 58, 237, 0.12)'
                      }}
                    >
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}

                {chatTypingState && (
                  <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.16)', border: '1px solid rgba(59, 130, 246, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Cpu size={14} color="var(--primary-cyan)" />
                    </div>
                    <div style={{ background: 'rgba(11, 15, 39, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px 18px', borderRadius: '20px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '7px', height: '7px', background: 'var(--primary-cyan)', borderRadius: '50%' }} />
                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '7px', height: '7px', background: 'var(--primary-cyan)', borderRadius: '50%' }} />
                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '7px', height: '7px', background: 'var(--primary-cyan)', borderRadius: '50%' }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DevBot is typing…</span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleChatSubmit} className="glass" style={{ padding: '16px', background: 'rgba(5, 8, 22, 0.35)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text"
                  placeholder={`Ask DevBot about ${chatSelectedFile} or your repository...`}
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    padding: '14px 18px',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(124, 58, 237, 0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button 
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))',
                    border: 'none',
                    color: 'white',
                    fontWeight: 700,
                    padding: '14px 26px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 18px rgba(124, 58, 237, 0.35)'
                  }}
                >
                  <Play size={14} fill="white" />
                  Send
                </button>
              </form>
            </div>

            <div style={{ display: 'grid', gap: '24px', alignItems: 'start' }}>
              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.58)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Sparkles size={18} color="var(--primary-purple)" />
                  <h3 style={{ fontSize: '16px', color: 'white', margin: 0 }}>Repository Q&A</h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Use ready-made prompts to get instant answers from the repository context.
                </p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {[
                    { label: 'What does the current file do?', prompt: `What does ${chatSelectedFile} do?` },
                    { label: 'Show me the repo entrypoint', prompt: 'What is the entrypoint of this repository?' },
                    { label: 'List potential issues', prompt: 'List potential issues in the current repository.' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleChatSubmit(item.prompt)}
                      className="glass"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        textAlign: 'left',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: 'white',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.58)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <FileText size={18} color="var(--primary-cyan)" />
                  <h3 style={{ fontSize: '16px', color: 'white', margin: 0 }}>AI Generators</h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Generate release notes or project documentation directly from DevBot.
                </p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <button
                    onClick={handleGenerateChangelog}
                    className="glass"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.16), rgba(59, 130, 246, 0.16))',
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Generate Changelog
                  </button>
                  <button
                    onClick={handleGenerateReadme}
                    className="glass"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.16), rgba(59, 130, 246, 0.16))',
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Generate README
                  </button>
                </div>
              </div>

              {/* Changelog Output */}
              {changelogLoading && (
                <div style={{ background: 'rgba(5, 8, 22, 0.58)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary-purple)', fontSize: '12px', fontWeight: 600 }}>
                    <RefreshCw size={14} className="animate-spin" />
                    Generating...
                  </div>
                  {changelogLogs.map((log, i) => (
                    <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--primary-cyan)', marginBottom: '4px' }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              )}
              {changelogContent && !changelogLoading && (
                <div style={{ background: 'rgba(5, 8, 22, 0.58)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--primary-purple)', fontSize: '12px', fontWeight: 600 }}>📋 Changelog</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(changelogContent)}
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', color: 'var(--primary-cyan)', fontSize: '10px', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre style={{ background: '#02040a', padding: '12px', borderRadius: '6px', fontSize: '11px', color: '#e2e8f0', overflow: 'auto', maxHeight: '150px', margin: 0 }}>
                    {changelogContent}
                  </pre>
                </div>
              )}

              {/* README Output */}
              {readmeLoading && (
                <div style={{ background: 'rgba(5, 8, 22, 0.58)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary-cyan)', fontSize: '12px', fontWeight: 600 }}>
                    <RefreshCw size={14} className="animate-spin" />
                    Generating README...
                  </div>
                  {readmeLogs.map((log, i) => (
                    <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#10b981', marginBottom: '4px' }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              )}
              {readmeContent && !readmeLoading && (
                <div style={{ background: 'rgba(5, 8, 22, 0.58)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--primary-cyan)', fontSize: '12px', fontWeight: 600 }}>📝 README</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(readmeContent)}
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', color: 'var(--primary-cyan)', fontSize: '10px', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre style={{ background: '#02040a', padding: '12px', borderRadius: '6px', fontSize: '11px', color: '#e2e8f0', overflow: 'auto', maxHeight: '150px', margin: 0 }}>
                    {readmeContent}
                  </pre>
                </div>
              )}

              <div className="glass" style={{ padding: '24px', background: 'rgba(5, 8, 22, 0.58)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Activity size={18} color="var(--primary-cyan)" />
                  <h3 style={{ fontSize: '16px', color: 'white', margin: 0 }}>Live Assistant</h3>
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ask DevBot anything about the current repository or selected file.</div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'white' }}><span>Model</span><span>Gemini 3.5 Flash</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'white' }}><span>Response time</span><span>~1.2s</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'white' }}><span>Status</span><span style={{ color: '#10b981' }}>Online</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // RENDER LANDING PAGE (/)
  return (
    <Layout currentPath={cleanPath} navigateTo={navigateTo}>
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        
        {/* Background Perspective Grid */}
        <div className="perspective-grid" />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
          
          {/* Animated Holographic AI Core behind hero */}
          <div style={{ 
            position: 'absolute', 
            top: '250px', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '600px', 
            height: '600px', 
            zIndex: -1, 
            pointerEvents: 'none',
            opacity: 0.8
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '450px',
              height: '450px',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.28) 0%, rgba(34, 211, 238, 0.1) 45%, transparent 70%)',
              filter: 'blur(60px)',
            }} />
            
            {/* Outer Rotating Dashed Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '80%',
                height: '80%',
                border: '1.5px dashed rgba(34, 211, 238, 0.25)',
                borderRadius: '50%',
              }}
            />

            {/* Inner Rotating Segmented Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '60%',
                height: '60%',
                border: '1px solid rgba(124, 58, 237, 0.35)',
                borderRadius: '50%',
                borderTopColor: 'var(--primary-purple)',
                borderBottomColor: 'var(--primary-cyan)',
              }}
            />
            
            {/* Central Holographic Core */}
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.75, 0.95, 0.75] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '38%',
                left: '38%',
                width: '24%',
                height: '24%',
                background: 'radial-gradient(circle, #22d3ee 0%, #7c3aed 65%, #050816 100%)',
                borderRadius: '50%',
                boxShadow: '0 0 50px rgba(34, 211, 238, 0.5), inset 0 0 20px rgba(255,255,255,0.4)',
              }}
            />
          </div>

          {/* Hero Section */}
          <header style={{ marginBottom: '90px', textAlign: 'center', paddingTop: '40px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 style={{ 
                fontSize: '80px', 
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: '20px', 
                background: 'linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.5) 95%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-2px',
                fontFamily: 'var(--font-heading)'
              }}>
                Developer Life,<br />Powered by AI
              </h1>
              
              <p style={{ 
                fontSize: '18px', 
                color: 'var(--text-secondary)', 
                maxWidth: '700px', 
                margin: '0 auto', 
                lineHeight: 1.6 
              }}>
                Connect GitHub, chat with your vector-indexed codebase using DevBot AI, execute automated optimizations, audit vulnerabilities, and track velocity.
              </p>
              
              <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button 
                  onClick={() => navigateTo('/devbot')}
                  style={{
                    padding: '14px 32px',
                    fontSize: '16px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))',
                    border: 'none',
                    color: 'white',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(124, 58, 237, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.target.style.transform = 'none'}
                >
                  Get Started Free
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => navigateTo('/login')}
                  className="glass" 
                  style={{
                    padding: '14px 32px',
                    fontSize: '16px',
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    color: 'white',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'}
                >
                  Sync Console
                </button>
              </div>
            </motion.div>
          </header>

          {/* SIMULATED TYPING TERMINAL INSIDE HERO SECTION */}
          <section style={{ maxWidth: '800px', margin: '0 auto 120px' }}>
            <div className="glass" style={{
              background: 'rgba(3, 6, 20, 0.8)',
              border: '1px solid rgba(124, 58, 237, 0.25)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.7), 0 0 25px rgba(124, 58, 237, 0.1)',
              borderRadius: '14px',
              overflow: 'hidden'
            }}>
              {/* Terminal Title Bar */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>devpulse-core-terminal</div>
                <div style={{ width: '38px' }} />
              </div>

              {/* Terminal Logs Body */}
              <div style={{
                padding: '20px',
                minHeight: '230px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                lineHeight: '1.7',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {heroTerminalLines.map((line, i) => (
                  <div 
                    key={i} 
                    style={{
                      color: line.type === 'cmd' 
                        ? '#ffffff' 
                        : line.type === 'success' 
                          ? 'var(--primary-cyan)' 
                          : 'var(--text-secondary)'
                    }}
                  >
                    {line.text}
                  </div>
                ))}
                
                {/* Simulated cursor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>&gt;</span>
                  <motion.span 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 1 }} 
                    style={{ width: '8px', height: '14px', background: 'var(--primary-cyan)', display: 'inline-block' }} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" style={{ marginBottom: '130px', scrollMarginTop: '100px' }}>
            <h2 style={{ 
              fontSize: '38px', 
              textAlign: 'center', 
              marginBottom: '12px', 
              background: 'linear-gradient(to right, #ffffff, rgba(255,255,255,0.75))', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontFamily: 'var(--font-heading)'
            }}>
              AI-Driven Core Capabilities
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px', fontSize: '15px' }}>
              Remove friction points from developer cycles with automated indexing.
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '24px' 
            }}>
              <GlassCard 
                title="DevBot AI Assistant" 
                subtitle="Contextual codebase companion" 
                icon={MessageSquare}
                glowColor="var(--primary-purple)"
              >
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Sync and query active code folders. Ask questions, construct patch changes, and apply refactors in real-time.
                </p>
              </GlassCard>

              <GlassCard 
                title="Diagnostics & Metrics" 
                subtitle="Velocity tracking dashboards" 
                icon={BarChart3}
                glowColor="var(--primary-blue)"
              >
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Visualize development velocity, model latency metrics, vector tokens density, and sync schedules on custom SVG line graphs.
                </p>
              </GlassCard>

              <GlassCard 
                title="Automated Documentation" 
                subtitle="Changelogs & README files" 
                icon={FileText}
                glowColor="var(--primary-cyan)"
              >
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Let models inspect directory structures and write release note summaries or markdown documentation files in seconds.
                </p>
              </GlassCard>

              <GlassCard 
                title="Security Vulnerability Audits" 
                subtitle="Dependency threat inspection" 
                icon={Shield}
                glowColor="#10B981"
              >
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Check package lock files, dependencies registers, and port containment configurations to guarantee threat-free deployments.
                </p>
              </GlassCard>

              <GlassCard 
                title="Semantic Code Indexing" 
                subtitle="Intent-based vector queries" 
                icon={Search}
                glowColor="#F59E0B"
              >
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Find specific file implementations by query intent. No strict regex rules required to scan your variables or methods.
                </p>
              </GlassCard>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" style={{ marginBottom: '130px', padding: '20px 0', scrollMarginTop: '100px' }}>
            <h2 style={{ 
              fontSize: '38px', 
              textAlign: 'center', 
              marginBottom: '12px', 
              background: 'linear-gradient(to right, #ffffff, rgba(255,255,255,0.75))', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontFamily: 'var(--font-heading)'
            }}>
              Unified Three-Step Sync
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px', fontSize: '15px' }}>
              Sync active folders and let AI handle code inspection.
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {[
                { step: '01', title: 'Connect Account', desc: 'Securely authenticate with GitHub in a click to sync access tokens.' },
                { step: '02', title: 'Index Codebase', desc: 'AI models construct high-fidelity vector mappings of folders and files.' },
                { step: '03', title: 'Trigger Optimization', desc: 'Accept inline patches, run security threat scans, and draft changelogs.' }
              ].map((s, index) => (
                <div 
                  key={index}
                  className="glass"
                  style={{ 
                    flex: '1 1 300px', 
                    maxWidth: '360px', 
                    padding: '30px 24px', 
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'rgba(5, 8, 22, 0.45)',
                    borderColor: 'rgba(255,255,255,0.06)'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '-10px',
                    fontSize: '100px',
                    fontWeight: 900,
                    color: 'rgba(255,255,255,0.01)',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1,
                    pointerEvents: 'none'
                  }}>{s.step}</div>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-cyan))', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '12px', 
                    fontWeight: 800, 
                    color: 'white',
                    marginBottom: '20px',
                    boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)'
                  }}>
                    {s.step}
                  </div>
                  <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '10px' }}>{s.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section style={{ marginBottom: '130px' }}>
            <div className="glass" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '24px', 
              padding: '50px 30px',
              borderColor: 'rgba(255,255,255,0.06)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              borderRadius: '20px',
              background: 'rgba(5, 8, 22, 0.5)'
            }}>
              {[
                { label: 'Active Vector Nodes', value: '142,580', color: 'var(--primary-cyan)' },
                { label: 'Refactor Patches Applied', value: '92,410', color: 'var(--primary-purple)' },
                { label: 'Vulnerabilities Prevented', value: '2,056', color: '#10b981' },
                { label: 'Developer Velocity Score', value: '+38% Speed', color: '#10b981' }
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <h3 style={{ 
                    fontSize: '38px', 
                    fontWeight: 800, 
                    color: 'white', 
                    marginBottom: '8px',
                    fontFamily: 'var(--font-heading)',
                    textShadow: `0 0 15px ${stat.color}22`
                  }}>{stat.value}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section style={{ 
            padding: '70px 30px', 
            borderRadius: '30px', 
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(59, 130, 246, 0.05))',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            textAlign: 'center',
            marginBottom: '80px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <h2 style={{ fontSize: '36px', marginBottom: '12px', fontFamily: 'var(--font-heading)', color: 'white', fontWeight: 800 }}>Sync your first repository</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '15px' }}>Sync dependencies and let AI audit performance loops.</p>
            <button 
              onClick={() => navigateTo('/devbot')}
              style={{ 
                padding: '14px 44px', 
                fontSize: '16px', 
                fontWeight: 700, 
                background: 'white', 
                color: 'black',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(255,255,255,0.25)',
                transition: 'transform 0.15s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'none'}
            >
              Get Started Now
            </button>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default App;
