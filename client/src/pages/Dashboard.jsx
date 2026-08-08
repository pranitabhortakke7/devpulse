import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
BarChart3, Cpu, FileCode, FolderTree, HeartPulse, Layers, MessageSquare,
  RefreshCw, Search, Shield, Sparkles, Terminal, Zap
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';

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

const Dashboard = ({ navigateTo }) => {
  const {
    repos,
    githubStats,
  } = useAppContext();

  const totalRepos = repos.length || githubStats?.public_repos || 0;
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks || 0), 0);
  const followers = githubStats?.followers || 0;
  const following = githubStats?.following || 0;
  const productivityScore = Math.min(100, Math.round(((totalStars + totalForks) / Math.max(1, totalRepos)) + (followers / Math.max(1, totalRepos)) * 5));
  const streakDays = Math.min(90, Math.max(0, Math.floor(totalRepos * 2)));

  return (
    <Layout currentPath="/dashboard" navigateTo={navigateTo}>
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
          {!githubStats && (
            <div className="glass" style={{
              gridColumn: '1 / -1',
              padding: '30px',
              textAlign: 'center',
              background: 'rgba(5, 8, 22, 0.55)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔗</div>
              <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '8px' }}>
                GitHub Not Connected
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Connect your GitHub account to see your real repositories, commits, and stats.
              </p>
              <button
                onClick={() => window.location.href = 'http://localhost:5000/api/auth/github'}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Connect GitHub Account
              </button>
            </div>
          )}

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
{String.fromCharCode(62)} API core synopses: stable (Groq LLaMA 3.3)
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
            <span>ACTIVE MODEL: GROQ LLAMA 3.3 (LOW)</span>
            <span>SYNC CAP: 100% SECURE</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
