import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ showLabel = false, className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Current theme is ${theme}. Switch to ${isDark ? 'light' : 'dark'} mode.`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`theme-toggle-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: showLabel ? '0.45rem 1rem' : '0',
        width: showLabel ? 'auto' : '42px',
        height: '42px',
        borderRadius: 'var(--radius-full)',
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(128, 27, 59, 0.07)',
        border: '1px solid var(--border-subtle)',
        color: isDark ? 'var(--color-accent)' : 'var(--color-primary)',
        cursor: 'pointer',
        boxShadow: isDark
          ? '0 2px 10px rgba(0, 0, 0, 0.25)'
          : '0 2px 8px rgba(128, 27, 59, 0.08)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'all var(--transition-fast)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isDark ? 'var(--color-accent)' : 'var(--color-primary)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Animated Icon Container */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -12, opacity: 0, rotate: -45, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          exit={{ y: 12, opacity: 0, rotate: 45, scale: 0.8 }}
          transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isDark ? (
            <Sun size={19} strokeWidth={2.2} />
          ) : (
            <Moon size={19} strokeWidth={2.2} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Optional Text Label (for mobile drawer or settings) */}
      {showLabel && (
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: 'var(--text-primary)'
          }}
        >
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
