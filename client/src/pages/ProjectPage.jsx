import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, RefreshCw, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

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

const ProjectPage = ({ navigateTo }) => {
  const {
    activeRepo, setActiveRepo,
    commits, commitsLoading,
    changelogContent, setChangelogContent, changelogLoading, setChangelogLoading,
    readmeContent, setReadmeContent, readmeLoading, setReadmeLoading,
  } = useAppContext();

  // Local states not in AppContext
  const [changelogLogs, setChangelogLogs] = useState([]);
  const [readmeLogs, setReadmeLogs] = useState([]);
  const [healthHoverField, setHealthHoverField] = useState(null);

  // AI Changelog generator (project page version)
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
        `${API_BASE_URL}/api/github/repos/${repoName}/commits`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Commits:', commitsRes.data);

      // Send commits to Groq AI
      const aiRes = await axios.post(
        `${API_BASE_URL}/api/ai/changelog`,
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

  // AI README generator (project page version)
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
        `${API_BASE_URL}/api/github/repos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Find current active repo details
      const repoDetails = reposRes.data.find(r => r.name === repoName) || {};

      // Send to Groq AI
      const aiRes = await axios.post(
        `${API_BASE_URL}/api/ai/readme`,
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

  return (
    <Layout currentPath="/project" navigateTo={navigateTo}>
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
                    {'>'} {log}
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
                    {'>'} {log}
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
};

export default ProjectPage;
