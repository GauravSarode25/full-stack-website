import React from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

const LoadingSpinner = ({ message = 'Brewing your experience...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
        gap: '1.25rem'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut'
        }}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-gold) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-glow)'
        }}
      >
        <Coffee size={32} />
      </motion.div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
