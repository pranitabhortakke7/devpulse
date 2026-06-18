import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const GlassCard = ({ children, title, subtitle, icon: Icon, glowColor = 'var(--primary-purple)', style = {} }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft springs for buttery-smooth tilt reactions
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Moderate tilt ranges for strong depth effect
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Tilt calculations
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);

    // Dynamic light tracking variables
    e.currentTarget.style.setProperty('--card-mouse-x', `${mouseX}px`);
    e.currentTarget.style.setProperty('--card-mouse-y', `${mouseY}px`);
  };

  const handleMouseLeave = (e) => {
    x.set(0);
    y.set(0);
    e.currentTarget.style.setProperty('--card-mouse-x', `0px`);
    e.currentTarget.style.setProperty('--card-mouse-y', `0px`);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1200px",
        ...style
      }}
      className="glass glass-interactive"
    >
      <div
        style={{
          transform: "translateZ(30px)", // Elevate content for 3D parallax
          transformStyle: "preserve-3d",
          padding: '28px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '6px', fontWeight: 700 }}>{title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{subtitle}</p>
          </div>
          {Icon && (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${glowColor}, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${glowColor}55`,
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <Icon size={18} color="white" />
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, position: 'relative', transform: 'translateZ(10px)' }}>
          {children}
        </div>

        {/* Decorative subtle lighting bar */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          width: '32px',
          height: '3px',
          background: glowColor,
          borderRadius: '4px',
          opacity: 0.6,
          boxShadow: `0 0 8px ${glowColor}`
        }}></div>
      </div>
    </motion.div>
  );
};

export default GlassCard;
