import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ArrowRight, Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 1.5rem',
        textAlign: 'center'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card-surface"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '3.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(225, 29, 72, 0.12)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <UtensilsCrossed size={32} />
        </div>

        <span
          className="badge badge-gold"
          style={{ marginBottom: '1rem', letterSpacing: '0.08em' }}
        >
          404 ERROR
        </span>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 2.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}
        >
          Looks like you took a <span className="text-serif-italic text-gradient">wrong bite.</span>
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}
        >
          Whatever you were craving here isn't on the table. The page may have moved, expired, or been devoured before you arrived.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Link to="/" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem' }}>
            <Home size={16} />
            <span>Back to the Good Stuff</span>
          </Link>
          <Link to="/menu" className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem' }}>
            <Compass size={16} />
            <span>Explore Menu</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
