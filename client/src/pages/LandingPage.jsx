import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageSquare, BarChart3, FileText, Shield, Search } from 'lucide-react';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { useAppContext } from '../context/AppContext';

const LandingPage = ({ navigateTo }) => {
  // Landing page simulated terminal typing
  const [heroTerminalLines, setHeroTerminalLines] = useState([
    { text: 'root@devpulse:~$ devpulse sync --repo pranitabhortakke7/devpulse', type: 'cmd' }
  ]);

  // Typing simulator on landing page hero terminal
  useEffect(() => {
    let isMounted = true;
    const scripts = [
      { delay: 1000, text: 'root@devpulse:~$ devpulse connect --github pranitabhortakke7', type: 'cmd' },
      { delay: 1800, text: '✓ GitHub OAuth authenticated. 11 repositories synced.', type: 'success' },
      { delay: 2500, text: 'root@devpulse:~$ devpulse chat --devbot "explain my codebase"', type: 'cmd' },
      { delay: 3500, text: '🤖 DevBot AI initialized. Groq LLaMA 3.3 70B connected.', type: 'info' },
      { delay: 4200, text: '✓ AI response generated in 0.8s.', type: 'success' },
      { delay: 5000, text: 'root@devpulse:~$ devpulse audit --security --repo devpulse', type: 'cmd' },
      { delay: 5800, text: '🛡️ Scanning 274 dependencies via OSV database...', type: 'info' },
      { delay: 6500, text: '✓ Audit complete. 4 vulnerabilities detected. Fix available.', type: 'success' },
      { delay: 7200, text: 'root@devpulse:~$ devpulse generate --changelog', type: 'cmd' },
      { delay: 7800, text: '🚀 AI Changelog generated. DevPulse Cockpit ready.', type: 'success' }
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
  }, []);

  return (
    <Layout currentPath="/" navigateTo={navigateTo}>
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
                { label: 'GitHub Repos Connected', value: '11+', color: 'var(--primary-cyan)' },
                { label: 'AI Features Powered by Groq', value: '4', color: 'var(--primary-purple)' },
                { label: 'Dependencies Scanned', value: '274', color: '#10b981' },
                { label: 'AI Models Integrated', value: '3', color: '#10b981' }
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
};

export default LandingPage;
