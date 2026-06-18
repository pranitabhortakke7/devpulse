import React, { useState, useEffect, useRef } from 'react';
import DevBot from './DevBot';
import { 
  Search, Terminal, Shield, Zap, FileText, Home, Lock, 
  MessageSquare, Sparkles, Compass, X, ChevronRight, Settings, HelpCircle, Activity, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Holographic Particle System Component using HTML5 Canvas
const HolographicParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for particle repulsion
    const mouse = { x: -1000, y: -1000, radius: 150 };
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

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.density = (Math.random() * 30) + 15;
        
        // Pick primary color variations
        const colors = [
          'rgba(124, 58, 237, ', // Purple
          'rgba(59, 130, 246, ',  // Blue
          'rgba(34, 211, 238, '   // Cyan
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.4 + 0.2;
        this.alphaDirection = Math.random() > 0.5 ? 1 : -1;
        this.alphaSpeed = Math.random() * 0.005 + 0.002;
      }

      draw() {
        ctx.fillStyle = `${this.colorPrefix}${this.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Keep inside canvas bounds
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Repel from mouse cursor
        if (mouse.x !== -1000 && mouse.y !== -1000) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const forceX = (dx / distance) * force * this.density * 0.15;
            const forceY = (dy / distance) * force * this.density * 0.15;
            this.x -= forceX;
            this.y -= forceY;
          }
        }

        // Oscillate transparency (glowing dust effect)
        this.alpha += this.alphaSpeed * this.alphaDirection;
        if (this.alpha > 0.7) {
          this.alpha = 0.7;
          this.alphaDirection = -1;
        } else if (this.alpha < 0.15) {
          this.alpha = 0.15;
          this.alphaDirection = 1;
        }
      }
    }

    const init = () => {
      particles = [];
      const particleDensity = Math.min(Math.floor((width * height) / 12000), 120);
      for (let i = 0; i < particleDensity; i++) {
        particles.push(new Particle());
      }
    };

    init();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
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

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

const Layout = ({ children, currentPath = '/', navigateTo }) => {
  const [omnibarOpen, setOmnibarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const searchInputRef = useRef(null);

  // Monitor mouse movements globally and update layout spotlight custom properties
  useEffect(() => {
    const updateCursorGlow = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', updateCursorGlow);
    return () => window.removeEventListener('mousemove', updateCursorGlow);
  }, []);

  // Monitor keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOmnibarOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setOmnibarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when Omnibar is opened
  useEffect(() => {
    if (omnibarOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      setActiveIndex(0);
      setSearchQuery('');
    }
  }, [omnibarOpen]);

  // Omnibar Items definitions
  const items = [
    { type: 'action', icon: Zap, label: 'Run Code Optimization Scan', desc: 'Inspects active repository layout for bundle bloat and memoization bugs.', shortcut: '⌘OPT', color: '#F59E0B', action: 'Optimization' },
    { type: 'action', icon: Shield, label: 'Run Security Vulnerability Audit', desc: 'Performs container lock audits and deep-scans dependencies.', shortcut: '⌘SEC', color: '#10B981', action: 'Security Scan' },
    { type: 'action', icon: FileText, label: 'Generate Automated README.md', desc: 'Analyzes files structures to write full workspace documentation.', shortcut: '⌘DOC', color: 'var(--primary-cyan)', action: 'README' },
    { type: 'action', icon: Activity, label: 'Draft Release Changelog (v1.1.0)', desc: 'Summarizes latest commit cycles into markdown formatted changelogs.', shortcut: '⌘CHG', color: 'var(--primary-purple)', action: 'Changelog' },
    { type: 'nav', icon: BarChart3, label: 'Navigate to Command Dashboard', desc: 'Sync analytics, streak days, burnout dials, and activity feeds.', shortcut: 'G D', action: '/dashboard' },
    { type: 'nav', icon: Home, label: 'Navigate to Landing Dashboard', desc: 'Return to core landing gate and capabilities preview.', shortcut: 'G H', action: '/' },
    { type: 'nav', icon: Terminal, label: 'Open DevBot Command Center', desc: 'Sync files, chat with workspace index, view diagnostics.', shortcut: 'G W', action: '/devbot' },
    { type: 'nav', icon: Lock, label: 'Connect Developer Account', desc: 'Access secure workspaces through GitHub gates.', shortcut: 'G L', action: '/login' },
    { type: 'nav', icon: Zap, label: 'Inspect Project Detail Deck', desc: 'View commit vectors planet, health rings, and AI documentation generators.', shortcut: 'G P', action: '/project' },
    { type: 'nav', icon: MessageSquare, label: 'Open Immersive DevBot Chat', desc: 'Interact with DevBot Q&A core in a full-screen ChatGPT-style dashboard.', shortcut: 'G C', action: '/chat' }
  ];

  // Filter based on search query
  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item) => {
    setOmnibarOpen(false);
    if (item.type === 'nav') {
      navigateTo(item.action);
    } else {
      // If action, redirect to devbot workspace with parameter
      navigateTo(`/devbot?action=${encodeURIComponent(item.action)}`);
    }
  };

  const handleKeyDownList = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[activeIndex]) {
        handleSelect(filteredItems[activeIndex]);
      }
    }
  };

  return (
    <div className="layout-root" style={{ position: 'relative', minHeight: '100vh', zIndex: 2 }}>
      {/* Dynamic particles rendering behind workspace layers */}
      <HolographicParticles />

      {/* Floating Spotlight Orb decorations */}
      <div className="particle-container">
        <div id="orb-1" className="glow-orb"></div>
        <div id="orb-2" className="glow-orb"></div>
        <div id="orb-3" className="glow-orb"></div>
      </div>

      {/* Apple Vision Pro Glass Floating Header */}
      <motion.nav 
        initial={{ x: "-50%", y: -50, opacity: 0 }}
        animate={{ x: "-50%", y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass" 
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          width: '90%',
          maxWidth: '1200px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          zIndex: 1000,
          justifyContent: 'space-between',
          background: 'rgba(5, 8, 22, 0.55)',
          borderColor: 'rgba(255,255,255,0.06)'
        }}
      >
        <div 
          onClick={() => navigateTo('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <div style={{ position: 'relative', width: '38px', height: '38px' }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, var(--primary-purple) 0%, transparent 70%)',
              opacity: 0.5,
              animation: 'pulse-glow 2.5s infinite ease-in-out'
            }}></div>
            
            <svg width="38" height="38" viewBox="0 0 40 40" fill="none" style={{ position: 'relative', zIndex: 1 }}>
              <path d="M5 20H12L16 10L24 30L28 20H35" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="20" r="18" stroke="url(#logo-grad)" strokeWidth="2.5" strokeDasharray="3 3" />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--primary-purple)" />
                  <stop offset="1" stopColor="var(--primary-cyan)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.8px', background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.85))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DEVPULSE
            </span>
            <span style={{ fontSize: '9px', color: 'var(--primary-cyan)', fontWeight: 700, letterSpacing: '2.5px', marginTop: '1px' }}>
              OPERATING CORE
            </span>
          </div>
        </div>

        {/* Navbar Links */}
        <div style={{ display: 'flex', gap: '30px', color: 'var(--text-secondary)', fontWeight: 500, alignItems: 'center', fontSize: '14px' }}>
          <a 
            href="#features" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPath !== '/') {
                navigateTo('/');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPath !== '/') {
                navigateTo('/');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Workflow
          </a>

          <span 
            onClick={() => navigateTo('/dashboard')}
            style={{ color: currentPath === '/dashboard' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => {
              if (currentPath !== '/dashboard') e.target.style.color = 'var(--text-secondary)';
            }}
          >
            Dashboard
          </span>

          <span 
            onClick={() => navigateTo('/profile')}
            style={{ color: currentPath === '/profile' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => {
              if (currentPath !== '/profile') e.target.style.color = 'var(--text-secondary)';
            }}
          >
            Profile
          </span>

          <span 
            onClick={() => navigateTo('/project')}
            style={{ color: currentPath === '/project' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => {
              if (currentPath !== '/project') e.target.style.color = 'var(--text-secondary)';
            }}
          >
            Project
          </span>

          <span 
            onClick={() => navigateTo('/chat')}
            style={{ color: currentPath === '/chat' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => {
              if (currentPath !== '/chat') e.target.style.color = 'var(--text-secondary)';
            }}
          >
            DevBot Chat
          </span>

          {/* Quick Omnibar Shortcut Trigger */}
          <div 
            onClick={() => setOmnibarOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Search size={14} />
            <span style={{ fontSize: '12px' }}>Search</span>
            <span style={{ fontSize: '10px', opacity: 0.6, background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px', marginLeft: '4px', fontFamily: 'var(--font-mono)' }}>⌘K</span>
          </div>

          {localStorage.getItem('token') ? (
            <span
              onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigateTo('/login'); }}
              style={{ color: 'white', textDecoration: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => e.target.style.opacity = 0.8}
              onMouseLeave={(e) => e.target.style.opacity = 1}
            >
              Logout
            </span>
          ) : (
            <span
              onClick={() => navigateTo('/login')}
              style={{ color: 'white', textDecoration: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => e.target.style.opacity = 0.8}
              onMouseLeave={(e) => e.target.style.opacity = 1}
            >
              Login
            </span>
          )}
          <button 
            onClick={() => navigateTo('/devbot')}
            className="glass" 
            style={{
              padding: '10px 22px',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))',
              borderRadius: '10px',
              fontWeight: 600,
              boxShadow: '0 0 18px rgba(124, 58, 237, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(124, 58, 237, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 0 18px rgba(124, 58, 237, 0.4)';
            }}
          >
            Cockpit
          </button>
        </div>
      </motion.nav>

      <main style={{ paddingTop: '120px', minHeight: 'calc(100vh - 120px)', position: 'relative', zIndex: 10 }}>
        {children}
      </main>

      {/* Global DevBot Helper */}
      <DevBot currentPath={currentPath} navigateTo={navigateTo} />

      {/* Omnibar Dialog Overlay (AnimatePresence) */}
      <AnimatePresence>
        {omnibarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="omnibar-overlay"
            onClick={() => setOmnibarOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="omnibar-dialog glass"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="omnibar-input-wrapper">
                <Search size={20} color="var(--primary-purple)" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  className="omnibar-input" 
                  placeholder="Type a command or page destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDownList}
                />
                <div 
                  onClick={() => setOmnibarOpen(false)}
                  style={{ cursor: 'pointer', padding: '4px', opacity: 0.5 }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                >
                  <X size={16} color="white" />
                </div>
              </div>

              <div className="omnibar-results">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <div 
                        key={index}
                        className={`omnibar-item ${isActive ? 'active' : ''}`}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <div className="omnibar-item-left">
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: isActive ? `rgba(255,255,255,0.06)` : `rgba(255,255,255,0.02)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)'}`
                          }}>
                            <item.icon size={15} color={item.color || 'white'} />
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>{item.label}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.desc}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="omnibar-shortcut">{item.shortcut}</span>
                          {isActive && <ChevronRight size={14} color="var(--primary-cyan)" />}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No matching commands found.
                  </div>
                )}
              </div>
              
              <div style={{
                padding: '12px 24px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--text-muted)',
                fontSize: '11px'
              }}>
                <div>Use <span style={{ fontFamily: 'var(--font-mono)' }}>↑↓</span> keys to browse, <span style={{ fontFamily: 'var(--font-mono)' }}>Enter</span> to trigger</div>
                <div>esc to close</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
