import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, CheckCircle2, Code, FileCode, FileText, FolderTree, MessageSquare, Play, RefreshCw,
  Search, Shield, Terminal, Zap, Activity
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import { HoloDevBot } from '../components/DevBot';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// Simple code formatting highligher
const syntaxHighlight = (code) => {
  if (!code) return '';
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
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

const DevbotPage = ({ navigateTo }) => {
  const {
    currentPath, setCurrentPath,
    activeRepo, setActiveRepo,
    repos, repoLoading,
    activeFile, setActiveFile,
    codeContent, setCodeContent,
    repoFilesList,
    auditData, auditLoading,
    analyticsData,
    commits,
    workspaceMessages, setWorkspaceMessages,
    changelogContent, setChangelogContent, changelogLoading, setChangelogLoading,
    readmeContent, setReadmeContent, readmeLoading, setReadmeLoading,
  } = useAppContext();

  // Tab state
  const [activeTab, setActiveTab] = useState('chat'); // chat, code, search, security, analytics
  const [botStatus, setBotStatus] = useState('online'); // online, busy
  const [botTyping, setBotTyping] = useState(false);

  // Chat input state
  const [chatInput, setChatInput] = useState('');
  const workspaceChatEndRef = useRef(null);

  // Code studio states
  const [hasRefactored, setHasRefactored] = useState(false);
  const [refactorAnimation, setRefactorAnimation] = useState(false);

// Search tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Changelog / README log state
  const [changelogLogs, setChangelogLogs] = useState([]);
  const [readmeLogs, setReadmeLogs] = useState([]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (workspaceChatEndRef.current) {
      workspaceChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [workspaceMessages, activeTab]);

  // Placeholder so the action handler is referenced before definition below
  const handleSendWorkspaceMsg = async (textToSend = chatInput) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), text: textToSend, sender: 'user' };
    setWorkspaceMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setBotStatus('busy');
    setBotTyping(true);

    // Handle tab switching based on keywords
    const lower = textToSend.toLowerCase();
    if (lower.includes('security') || lower.includes('audit')) {
      setActiveTab('security');
    } else if (lower.includes('analytics') || lower.includes('optimize')) {
      setActiveTab('analytics');
    } else if (lower.includes('search') || lower.includes('semantic')) {
      setActiveTab('search');
    } else if (lower.includes('code') || lower.includes('refactor')) {
      setActiveTab('code');
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/ai/chat`,
        {
          message: textToSend,
          repoContext: `Repository: ${activeRepo}. Current file: ${activeFile}. 
        You are DevBot, an AI assistant inside DevPulse cockpit. 
        Help with code questions, security, performance, and documentation.
        Be concise and technical.`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWorkspaceMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot'
      }]);
    } catch (err) {
      setWorkspaceMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '❌ DevBot connection failed. Please try again.',
        sender: 'bot'
      }]);
    } finally {
      setBotStatus('online');
      setBotTyping(false);
    }
  };

  const triggerWorkspaceAction = (actionName) => {
    handleSendWorkspaceMsg(`Run ${actionName}`);
  };

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
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  // Perform mock semantic search
  const handleSemanticSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
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
        `${API_BASE_URL}/api/ai/refactor`,
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

      const commitsRes = await axios.get(
        `${API_BASE_URL}/api/github/repos/${repoName}/commits`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiRes = await axios.post(
        `${API_BASE_URL}/api/ai/changelog`,
        {
          commits: commitsRes.data,
          repoName: activeRepo
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTimeout(() => {
        setChangelogContent(aiRes.data.changelog);
        setChangelogLoading(false);
      }, 3100);
    } catch (err) {
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

      const reposRes = await axios.get(
        `${API_BASE_URL}/api/github/repos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const repoDetails = reposRes.data.find(r => r.name === repoName) || {};

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
    <Layout currentPath="/devbot" navigateTo={navigateTo}>
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
                <option disabled>{'Loading repos...'}</option>
              ) : repos.length === 0 ? (
                <option disabled>{'Connect GitHub to see repos'}</option>
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
              {repoFilesList.length === 0 ? (
                <div
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>📁</div>
                  Connect GitHub to see files
                </div>
              ) : (
                repoFilesList.map((filename) => {
                  const isSelected = activeFile === filename;
                  return (
                    <div
                      key={filename}
                      onClick={() => {
                        setActiveFile(filename);
                        const fetchFile = async () => {
                          const token = localStorage.getItem('token');
                          const repoName = activeRepo.split('/')[1];
                          const res = await axios.get(
                            `${API_BASE_URL}/api/github/repos/${repoName}/file?path=${filename}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          setCodeContent(res.data.content);
                        };
                        fetchFile();
                        setHasRefactored(false);
                        setActiveTab('code');
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
                })
              )}
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
                      {msg.text.includes('```') ? (
                        <div>
                          {msg.text.split('```').map((part, index) => {
                            if (index % 2 === 1) {
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

            {/* TAB 2: CODE STUDIO */}
            {activeTab === 'code' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
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
              (() => {
                const counts = auditData?.counts || { critical: 0, high: 0, moderate: 0, low: 0, info: 0 };
                const vulnerabilities = auditData?.vulnerabilities || [];
                const totalIssues = counts.critical + counts.high + counts.moderate + counts.low + (counts.info || 0);
                const scannedAt = auditData?.scannedAt ? new Date(auditData.scannedAt).toLocaleString() : 'Not scanned yet';
                const severityStyles = {
                  critical: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)' },
                  high: { color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.25)' },
                  moderate: { color: '#FACC15', bg: 'rgba(250, 204, 21, 0.1)', border: 'rgba(250, 204, 21, 0.25)' },
                  low: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.25)' },
                  info: { color: 'var(--primary-cyan)', bg: 'rgba(34, 211, 238, 0.08)', border: 'rgba(34, 211, 238, 0.2)' }
                };
                const statCards = [
                  { title: 'Critical', value: counts.critical, color: severityStyles.critical.color },
                  { title: 'High', value: counts.high, color: severityStyles.high.color },
                  { title: 'Moderate', value: counts.moderate, color: severityStyles.moderate.color },
                  { title: 'Low', value: counts.low, color: severityStyles.low.color },
                  { title: 'Total Deps', value: auditData?.totalDependencies ?? 0, color: 'var(--primary-cyan)' },
                  { title: 'Status', value: totalIssues > 0 ? 'Review' : 'Clean', color: totalIssues > 0 ? severityStyles.moderate.color : '#10B981' }
                ];

                return (
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '6px' }}>Security Audit Log</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Live dependency vulnerability scan for {activeRepo}. Last scanned: {scannedAt}</p>
                    </div>

                    {auditLoading ? (
                      <div className="glass" style={{ minHeight: '260px', padding: '32px', background: 'rgba(5, 8, 22, 0.55)', border: '1px solid rgba(34, 211, 238, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <RefreshCw className="animate-spin" size={28} color="var(--primary-cyan)" style={{ animation: 'spin 2s linear infinite' }} />
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Running dependency audit...</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Resolving package tree and vulnerability advisories</div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
                          {statCards.map((stat) => (
                            <div key={stat.title} className="glass" style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)' }}>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.title}</div>
                              <div style={{ fontSize: '20px', fontWeight: 700, color: stat.color, marginTop: '8px' }}>{stat.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="glass" style={{ padding: '20px', background: 'rgba(5, 8, 22, 0.55)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '12px', color: 'white', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Shield size={14} color="var(--primary-cyan)" />
                              Vulnerabilities
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{totalIssues} issue{totalIssues === 1 ? '' : 's'} detected</span>
                          </div>

                          {vulnerabilities.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {vulnerabilities.map((vuln, i) => {
                                const severity = (vuln.severity || 'info').toLowerCase();
                                const severityStyle = severityStyles[severity] || severityStyles.info;
                                const viaList = Array.isArray(vuln.via) ? vuln.via : [];

                                return (
                                  <div key={`${vuln.name || 'vulnerability'}-${i}`} className="glass" style={{ padding: '16px', background: 'rgba(0,0,0,0.18)', border: `1px solid ${severityStyle.border}`, display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div style={{ minWidth: '220px', flex: 1 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{vuln.name || 'Unknown package'}</span>
                                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: severityStyle.color, background: severityStyle.bg, border: `1px solid ${severityStyle.border}`, padding: '3px 8px', borderRadius: '4px' }}>
                                          {severity}
                                        </span>
                                        {vuln.fixAvailable && (
                                          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '3px 8px', borderRadius: '4px' }}>
                                            FIX AVAILABLE
                                          </span>
                                        )}
                                      </div>
                                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                        {viaList.length > 0 ? viaList.map((item) => typeof item === 'string' ? item : item?.title || item?.name || 'Advisory').join(', ') : 'No advisory details provided.'}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div style={{ padding: '44px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                              <CheckCircle2 size={28} color="#10B981" style={{ margin: '0 auto 12px' }} />
                              <div style={{ fontSize: '13px', color: 'white', fontWeight: 700 }}>No vulnerabilities found</div>
                              <div style={{ fontSize: '11px', marginTop: '6px' }}>Dependency audit returned a clean result.</div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()
            )}

            {/* TAB 5: ANALYTICS & DIAGNOSTICS */}
            {activeTab === 'analytics' && (
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
                <div>
                  <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '6px' }}>Repository Analytics</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Real commit activity and repository metrics for {activeRepo}
                  </p>
                </div>

                {analyticsData ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {[
                        { title: 'Total Commits', value: analyticsData.totalCommits, color: 'var(--primary-cyan)' },
                        { title: 'Commits This Week', value: analyticsData.recentCommits, color: 'var(--primary-purple)' },
                        { title: 'Last Commit', value: analyticsData.lastCommit ? new Date(analyticsData.lastCommit).toLocaleDateString() : 'N/A', color: '#10B981' }
                      ].map((stat, i) => (
                        <div key={i} className="glass" style={{ padding: '16px', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.title}</div>
                          <div style={{ fontSize: '22px', fontWeight: 700, color: stat.color, marginTop: '8px' }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="glass" style={{ flex: 2, padding: '20px', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Commit Activity</span>
                        <span style={{ color: 'var(--primary-cyan)' }}>
                          {analyticsData.recentCommits} commits this week
                        </span>
                      </div>

                      <svg viewBox="0 0 500 200" width="100%" height="150">
                        <defs>
                          <linearGradient id="chart-glow-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary-purple)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--primary-purple)" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        {analyticsData.chartPoints.length > 0 && (
                          <>
                            <path
                              d={`${analyticsData.chartPoints.map((p, i) =>
                                `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} L 500 200 L 0 200 Z`}
                              fill="url(#chart-glow-area)"
                            />
                            <path
                              d={analyticsData.chartPoints.map((p, i) =>
                                `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                              fill="none"
                              stroke="var(--primary-purple)"
                              strokeWidth="3"
                            />
                            {analyticsData.chartPoints.map((p, i) => (
                              <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--primary-cyan)" />
                            ))}
                          </>
                        )}
                      </svg>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {[
                        { label: 'Velocity Score', value: analyticsData.velocityScore, color: 'var(--primary-cyan)' },
                        { label: 'Activity Score', value: analyticsData.syncScore, color: 'var(--primary-purple)' }
                      ].map((gauge, i) => (
                        <div key={i} className="glass" style={{ flex: 1, minWidth: '200px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.1)' }}>
                          <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                            <svg width="50" height="50" viewBox="0 0 36 36">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={gauge.color} strokeDasharray={`${gauge.value}, 100`} strokeWidth="2.5" />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '10px', color: 'white', fontWeight: 700 }}>{gauge.value}%</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{gauge.label}</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginTop: '2px' }}>
                              {gauge.value > 60 ? 'High Activity' : gauge.value > 30 ? 'Moderate' : 'Low Activity'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-cyan)' }}>
                    <RefreshCw size={16} style={{ animation: 'spin 2s linear infinite' }} />
                    <span style={{ fontSize: '13px' }}>Loading analytics...</span>
                  </div>
                )}
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
              <span>API LATENCY: 84ms (Groq LLaMA 3.3)</span>
              <span>SYNC CAP: 100% SECURE</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DevbotPage;
