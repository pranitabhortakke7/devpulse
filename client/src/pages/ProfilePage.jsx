import React from 'react';
import { motion } from 'framer-motion';
import {
  FileCode, FileText, Key, MessageSquare, User
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';

const ProfilePage = ({ navigateTo }) => {
  const {
    githubStats,
    githubConnected,
    githubChecked,
    repos,
  } = useAppContext();

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const loggedInUsername = storedUser?.username || '';
  const loggedInEmail = storedUser?.email || '';

  return (
    <Layout currentPath="/profile" navigateTo={navigateTo}>
      <canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Profile Identity + GitHub status card */}
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
                {/* GitHub connection card */}
                <div className="glass" style={{ padding: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>GitHub</span>
                    <span style={{ fontSize: '12px', color: !githubChecked ? 'var(--text-muted)' : githubConnected ? '#34d399' : '#f87171', fontWeight: 700 }}>
                      {!githubChecked ? 'Checking...' : githubConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <div style={{ fontSize: '23px', color: 'white', fontWeight: 800 }}>
                    {githubStats?.username || (githubConnected ? loggedInUsername : githubChecked ? 'Not Connected' : 'Loading...')}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>Managed via OAuth with repo sync, pull request scoring, and security insights.</div>
                </div>

                {/* Repos indexed card */}
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

            {/* Repositories Managed */}
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

          </div>

          <div style={{ display: 'grid', gap: '24px', alignContent: 'start' }}>
            {/* DevBot Usage Statistics */}
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

            {/* GitHub Statistics */}
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
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
