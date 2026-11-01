import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, User, Calendar, Sparkles } from 'lucide-react';

const BlogCard = ({ post, variant = 'default' }) => {
  const isFeatured = variant === 'featured';

  // Featured variant — large horizontal card
  if (isFeatured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card blog-card-featured"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          minHeight: '420px'
        }}
      >
        {/* Featured Image */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          <img
            src={post.coverImage}
            alt={post.title}
            loading="eager"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <span
              className="badge"
              style={{
                background: 'var(--color-accent)',
                color: '#1a1a1a',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Sparkles size={12} /> FEATURED
            </span>
          </div>
        </div>

        {/* Featured Content */}
        <div
          style={{
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <span
            className="badge badge-primary"
            style={{ marginBottom: '1rem', alignSelf: 'flex-start' }}
          >
            {post.category}
          </span>

          <h2
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: '1rem',
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-primary)'
            }}
          >
            {post.title}
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {post.excerpt}
          </p>

          {/* Meta */}
          <div
            className="blog-meta-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <User size={14} /> {post.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} /> {post.publishDate}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} /> {post.readTime}
            </span>
          </div>

          <Link
            to={`/blog/${post.slug || post.id}`}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Read Full Story <ArrowRight size={16} />
          </Link>
        </div>
      </motion.article>
    );
  }

  // Default card variant
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass-card blog-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        height: '100%'
      }}
    >
      {/* Cover Image */}
      <div
        className="blog-card-image"
        style={{
          position: 'relative',
          height: '220px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <span
          className="badge badge-primary"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backdropFilter: 'blur(8px)',
            background: 'rgba(122, 31, 61, 0.88)',
            color: '#FFFFFF',
            fontSize: '0.7rem',
            letterSpacing: '0.5px'
          }}
        >
          {post.category}
        </span>

        {/* Demo content indicator */}
        {post.isDemoContent && (
          <span
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: 'rgba(0,0,0,0.55)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.6rem',
              padding: '3px 8px',
              borderRadius: '4px',
              backdropFilter: 'blur(4px)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            Demo
          </span>
        )}
      </div>

      {/* Body */}
      <div
        className="blog-card-body"
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Date & Read Time */}
          <div
            className="blog-meta-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginBottom: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={12} /> {post.publishDate}
            </span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={12} /> {post.readTime || '4 min read'}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              lineHeight: 1.35,
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-serif)'
            }}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '1.25rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'var(--color-accent-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent)'
              }}
            >
              <User size={14} />
            </div>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              {post.author}
            </span>
          </div>

          <Link
            to={`/blog/${post.slug || post.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              transition: 'gap 0.3s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.gap = '0.6rem')}
            onMouseLeave={(e) => (e.currentTarget.style.gap = '0.35rem')}
          >
            <span>Read More</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
