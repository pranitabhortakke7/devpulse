import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Zap, Shield, Search, Sparkles, MessageSquare } from 'lucide-react';

// Reusable Futuristic DevBot SVG/CSS Render
export const RobotAvatar = ({ isHovered = false, isTyping = false, size = 80 }) => {
  return (
    <div style={{ position: 'relative', width: size, height: size * 1.1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Halo Rings above head */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: isHovered ? 1.05 : 1,
          opacity: isHovered ? 0.9 : 0.6
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '-10px',
          width: size * 0.7,
          height: size * 0.15,
          border: '1.5px solid var(--primary-cyan)',
          borderRadius: '50%',
          filter: 'drop-shadow(0 0 4px var(--primary-cyan))',
          boxShadow: 'inset 0 0 4px rgba(34, 211, 238, 0.4)'
        }}
      />
      
      {/* Floating Antennas */}
      <div style={{ position: 'absolute', display: 'flex', gap: size * 0.4, top: '-5px', zIndex: 1 }}>
        <motion.div 
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '2px', height: '10px', background: 'var(--primary-cyan)' }} 
        />
        <motion.div 
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ width: '2px', height: '10px', background: 'var(--primary-cyan)' }} 
        />
      </div>

      {/* Floating Head Dome */}
      <motion.div
        animate={{ 
          y: isHovered ? -4 : 0,
          rotate: isHovered ? [0, -2, 2, 0] : 0
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        style={{
          width: size * 0.75,
          height: size * 0.55,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03))',
          borderRadius: '24px 24px 12px 12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 5px rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 3
        }}
      >
        {/* Face Screen */}
        <div style={{
          width: '82%',
          height: '75%',
          background: '#040817',
          borderRadius: '16px',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Scanline pattern overlay */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '100% 3px',
            pointerEvents: 'none'
          }} />

          {/* Digital Eyes */}
          <div style={{ display: 'flex', gap: size * 0.18, marginTop: '2px' }}>
            <motion.div
              animate={isTyping ? { 
                scaleY: [1, 0.2, 1, 1],
                scaleX: [1, 1.4, 1, 1]
              } : { 
                scaleY: [1, 1, 0.1, 1, 1],
                scaleX: [1, 1, 1.2, 1, 1]
              }}
              transition={{ repeat: Infinity, duration: isTyping ? 1.5 : 4, ease: 'easeInOut' }}
              style={{
                width: size * 0.12,
                height: size * 0.12,
                background: 'var(--primary-cyan)',
                borderRadius: '50%',
                boxShadow: '0 0 8px var(--primary-cyan)'
              }}
            />
            <motion.div
              animate={isTyping ? { 
                scaleY: [1, 0.2, 1, 1],
                scaleX: [1, 1.4, 1, 1]
              } : { 
                scaleY: [1, 1, 0.1, 1, 1],
                scaleX: [1, 1, 1.2, 1, 1]
              }}
              transition={{ repeat: Infinity, duration: isTyping ? 1.5 : 4, ease: 'easeInOut', delay: 0.15 }}
              style={{
                width: size * 0.12,
                height: size * 0.12,
                background: 'var(--primary-cyan)',
                borderRadius: '50%',
                boxShadow: '0 0 8px var(--primary-cyan)'
              }}
            />
          </div>

          {/* Oscillating Audio Waveform Mouth */}
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '8px', marginTop: '3px' }}>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: isTyping 
                    ? [2, Math.random() * 8 + 2, 2] 
                    : isHovered 
                      ? [2, 5, 2] 
                      : [2, 3, 2] 
                }}
                transition={{ 
                  duration: isTyping ? 0.3 + (i * 0.05) : 0.8 + (i * 0.1), 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
                style={{
                  width: '2.5px',
                  borderRadius: '1px',
                  background: 'var(--primary-cyan)',
                  boxShadow: '0 0 4px rgba(34, 211, 238, 0.7)'
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Connection Neck */}
      <div style={{
        width: size * 0.18,
        height: '6px',
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '2px',
        marginTop: '-1px',
        zIndex: 2
      }} />

      {/* Core Body */}
      <motion.div
        style={{
          width: size * 0.7,
          height: size * 0.55,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.01))',
          borderRadius: '16px 16px 20px 20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.5), inset 0 0 8px rgba(255,255,255,0.05)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-1px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Holographic Glowing Core */}
        <motion.div
          animate={{
            scale: isTyping ? [0.9, 1.2, 0.9] : [1, 1.08, 1],
            opacity: isTyping ? [0.7, 1, 0.7] : [0.5, 0.75, 0.5],
            boxShadow: isTyping 
              ? '0 0 16px var(--primary-purple)'
              : '0 0 10px rgba(124, 58, 237, 0.5)'
          }}
          transition={{ duration: isTyping ? 1 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--primary-purple) 0%, rgba(34, 211, 238, 0.4) 60%, transparent 100%)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        />

        {/* Diagonal Tech Grid Marks */}
        <div style={{
          position: 'absolute',
          bottom: '6px',
          width: '70%',
          height: '2px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '1px'
        }} />
      </motion.div>

      {/* Thruster Engine */}
      <div style={{
        width: size * 0.24,
        height: '8px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '0 0 6px 6px',
        border: '1px solid rgba(255,255,255,0.15)',
        marginTop: '-1px',
        zIndex: 2
      }} />

      {/* Pulsing Hover Thruster Flame */}
      <motion.div
        animate={{ 
          scaleY: isHovered ? [1.2, 1.8, 1.2] : [1, 1.4, 1],
          opacity: isHovered ? [0.8, 1, 0.8] : [0.5, 0.8, 0.5]
        }}
        transition={{ repeat: Infinity, duration: 0.3 }}
        style={{
          width: size * 0.16,
          height: size * 0.35,
          background: 'linear-gradient(to bottom, var(--primary-cyan), rgba(124, 58, 237, 0.5), transparent)',
          borderRadius: '50%',
          filter: 'blur(2px)',
          marginTop: '1px',
          transformOrigin: 'top center'
        }}
      />
    </div>
  );
};

// HoloDevBot Component for Workspace Sidebar Display
export const HoloDevBot = ({ status = 'online', isTyping = false }) => {
  return (
    <div className="holo-containment" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '230px',
      background: 'rgba(5, 8, 22, 0.4)'
    }}>
      {/* Scanline overlay */}
      <div className="holo-scanline" />

      {/* Floating Robot */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [0, 1, -1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <RobotAvatar size={85} isHovered={true} isTyping={isTyping} />
      </motion.div>

      {/* Holographic Projection Base */}
      <div style={{
        width: '110px',
        height: '10px',
        background: 'linear-gradient(to right, transparent, rgba(34, 211, 238, 0.4), transparent)',
        borderRadius: '50%',
        boxShadow: '0 0 12px var(--primary-cyan)',
        marginTop: '10px'
      }} />

      <div style={{
        marginTop: '14px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>
          DevBot core v1.1
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: status === 'busy' ? '#F59E0B' : '#10B981',
            boxShadow: `0 0 6px ${status === 'busy' ? '#F59E0B' : '#10B981'}`
          }} />
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
            AI Core: {status === 'busy' ? 'Processing Command' : 'Idle & Synced'}
          </span>
        </div>
      </div>
    </div>
  );
};

const DevBot = ({ currentPath = '/', navigateTo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const robotRef = useRef(null);

  // Motion values for tracking cursor position and calculating heading angles / repulsion
  const robotX = useMotionValue(0);
  const robotY = useMotionValue(0);
  const headX = useMotionValue(0);
  const headY = useMotionValue(0);

  // Springs for buttery smooth physics
  const springX = useSpring(robotX, { stiffness: 60, damping: 12 });
  const springY = useSpring(robotY, { stiffness: 60, damping: 12 });
  const springHeadX = useSpring(headX, { stiffness: 180, damping: 15 });
  const springHeadY = useSpring(headY, { stiffness: 180, damping: 15 });

  // Floating sinus oscillation base
  useEffect(() => {
    if (currentPath === '/devbot') return;

    let time = 0;
    const interval = setInterval(() => {
      // Create a floating figure-8 / Lissajous path in the lower right area of screen
      if (!isHovered) {
        time += 0.012;
        robotX.set(Math.sin(time) * 35);
        robotY.set(Math.cos(time * 2) * 20);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [currentPath, isHovered, robotX, robotY]);

  // Global mouse monitoring for head tracking & repulsion
  useEffect(() => {
    if (currentPath === '/devbot') return;

    const handleGlobalMouseMove = (e) => {
      if (!robotRef.current) return;
      
      const rect = robotRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;
      
      const dx = e.clientX - botCenterX;
      const dy = e.clientY - botCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 1. Head Face direction (Looks at the cursor within 400px radius)
      if (distance < 400) {
        const lookRange = 10; // max px head shifts
        const angle = Math.atan2(dy, dx);
        headX.set(Math.cos(angle) * lookRange);
        headY.set(Math.sin(angle) * lookRange);
      } else {
        headX.set(0);
        headY.set(0);
      }

      // 2. Cursor Repulsion (Gently drifts away when mouse gets too close to prevent blockage)
      if (distance < 140 && !isHovered) {
        const repulsionForce = (140 - distance) * 0.45; // push multiplier
        const pushX = -(dx / distance) * repulsionForce;
        const pushY = -(dy / distance) * repulsionForce;
        robotX.set(pushX);
        robotY.set(pushY);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [currentPath, isHovered, robotX, robotY, headX, headY]);

  // Hide the global floating widget when we are inside the chat workspace (/devbot)
  if (currentPath === '/devbot') return null;

  const handleQuickAction = (label) => {
    navigateTo(`/devbot?action=${encodeURIComponent(label)}`);
  };

  return (
    <motion.div
      ref={robotRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        headX.set(0);
        headY.set(0);
      }}
      onClick={() => navigateTo('/devbot')}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '40px',
        width: '90px',
        height: '110px',
        cursor: 'pointer',
        zIndex: 1000,
        x: springX,
        y: springY,
        filter: 'drop-shadow(0 15px 30px rgba(34, 211, 238, 0.25))'
      }}
    >
      {/* Quick Menu Pop-out (Hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -140, y: -20 }}
            animate={{ opacity: 1, scale: 1, x: -165, y: -20 }}
            exit={{ opacity: 0, scale: 0.85, x: -140, y: -20 }}
            className="glass"
            style={{
              position: 'absolute',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              width: '175px',
              borderColor: 'rgba(34, 211, 238, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(34, 211, 238, 0.1)',
              pointerEvents: 'auto',
              background: 'rgba(6, 10, 28, 0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--primary-cyan)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              paddingBottom: '6px',
              marginBottom: '4px',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              <Sparkles size={11} />
              Quick Commands
            </div>
            {[
              { icon: Zap, label: 'Optimization', color: '#F59E0B' },
              { icon: Shield, label: 'Security Scan', color: '#10B981' },
              { icon: Search, label: 'Semantic Search', color: 'var(--primary-cyan)' },
              { icon: MessageSquare, label: 'Open Workspace', color: 'var(--primary-purple)' }
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (item.label === 'Open Workspace') {
                    navigateTo('/devbot');
                  } else {
                    handleQuickAction(item.label);
                  }
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                  color: 'white'
                }}
              >
                <item.icon size={12} color={item.color} />
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot Core Avatar Display */}
      <motion.div
        style={{
          x: springHeadX,
          y: springHeadY
        }}
      >
        <RobotAvatar size={80} isHovered={isHovered} />
      </motion.div>
    </motion.div>
  );
};

export default DevBot;
