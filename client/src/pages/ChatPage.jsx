import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, FileText, MessageSquare, Play, RefreshCw, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// Neural Network synapse-firing node background
const NeuralNetworkBackground = () => {
  const [nodeCanvas] = useState(() => null);
  // Static decorative background (canvas-free) to keep the component self-contained
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        backgroundImage:
          'radial-gradient(rgba(124, 58, 237, 0.06) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}
    />
  );
};

const ChatPage = ({ navigateTo }) => {
  const {
    activeRepo,
    chatMessages, setChatMessages,
    changelogContent, setChangelogContent, changelogLoading, setChangelogLoading,
    readmeContent, setReadmeContent, readmeLoading, setReadmeLoading,
  } = useAppContext();

  // Immersive AI Chat local state
  const [chatInputText, setChatInputText] = useState('');
  const [chatSelectedFile, setChatSelectedFile] = useState('src/App.jsx');
  const [chatExplanationMode, setChatExplanationMode] = useState(false);
  const [chatTypingState, setChatTypingState] = useState(false);

  // Changelog / README log state
  const [changelogLogs, setChangelogLogs] = useState([]);
  const [readmeLogs, setReadmeLogs] = useState([]);

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
        `${API_BASE_URL}/api/ai/chat`,
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

  // AI Changelog generator simulation
  const handleGenerateChangelog = async () => {
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
    <Layout currentPath="/chat" navigateTo={navigateTo}>
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
                  onClick={() => setChatInputText(quick.prompt)}
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
                    onClick={() => setChatInputText(item.prompt)}
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
                    {'>'} {log}
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
                    {'>'} {log}
                  </div>
                ))}
              </div>
            )}
            {readmeContent && !readmeLoading && (
              <div style={{ background: 'rgba(5, 8, 22, 0.58)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--primary-cyan)', fontSize: '12px', fontWeight: 600 }}>📄 README</span>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
