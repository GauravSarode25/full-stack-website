import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({
  badge,
  title,
  highlight,
  subtitle,
  centered = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
      style={{
        textAlign: centered ? 'center' : 'left',
        marginBottom: '2.75rem',
        maxWidth: centered ? '680px' : '100%',
        marginLeft: centered ? 'auto' : 0,
        marginRight: centered ? 'auto' : 0
      }}
      className={className}
    >
      {badge && (
        <span
          className="badge badge-primary"
          style={{ marginBottom: '0.85rem', display: 'inline-flex' }}
        >
          {badge}
        </span>
      )}
      <h2
        style={{
          fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          marginBottom: '0.85rem'
        }}
      >
        {title}{' '}
        {highlight && (
          <span className="text-serif-italic text-gradient">
            {highlight}
          </span>
        )}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
