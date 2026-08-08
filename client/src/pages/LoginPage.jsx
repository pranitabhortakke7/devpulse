import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, RefreshCw, Cpu, Code } from 'lucide-react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

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

const LoginPage = ({ navigateTo }) => {
  const [focusField, setFocusField] = useState(null);

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

  // Login form handler
  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) return;

    setLoginLoading(true);
    setLoginLogs([]);

    // Show animated logs
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
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
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
    window.location.href = 'http://localhost:5000/api/auth/github';
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
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
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

  return (
    <>
      {/* RENDER LOGIN PAGE (/login) */}
      {window.location.pathname.split('?')[0] === '/login' ? (
        <Layout currentPath="/login" navigateTo={navigateTo}>
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
                              {String.fromCharCode(62)} {log}
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
      ) : (
        /* RENDER REGISTER PAGE (/register) */
        <Layout currentPath="/register" navigateTo={navigateTo}>
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
                              {String.fromCharCode(62)} {log}
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
      )}
    </>
  );
};

export default LoginPage;
