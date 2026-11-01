import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  ArrowLeft,
  User,
  Share2,
  Calendar,
  Sparkles,
  ArrowRight,
  Tag,
  BookOpen
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import BlogCard from '../components/BlogCard';
import { fetchBlogBySlug } from '../services/api';
import { useToast } from '../context/ToastContext';

// Simple markdown-like renderer for ## headings, **bold**, *italic*, lists, blockquotes, and ---
const renderContent = (content) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let listItems = [];
  let inList = false;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={`list-${elements.length}`}
          style={{
            margin: '1rem 0 1.5rem 1.5rem',
            lineHeight: 1.85,
            color: 'var(--text-secondary)'
          }}
        >
          {listItems.map((item, i) => (
            <li key={i} style={{ marginBottom: '0.5rem' }}>
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const parseInline = (text) => {
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Horizontal rule
    if (trimmed === '---') {
      flushList();
      elements.push(
        <hr
          key={`hr-${idx}`}
          style={{
            border: 'none',
            borderTop: '1px solid var(--border-subtle)',
            margin: '2.5rem 0'
          }}
        />
      );
      return;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2
          key={`h2-${idx}`}
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-primary)',
            marginTop: '2.5rem',
            marginBottom: '1rem',
            lineHeight: 1.3
          }}
        >
          {trimmed.replace('## ', '')}
        </h2>
      );
      return;
    }

    // H3
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3
          key={`h3-${idx}`}
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: '2rem',
            marginBottom: '0.75rem',
            lineHeight: 1.35
          }}
        >
          {trimmed.replace('### ', '')}
        </h3>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote
          key={`bq-${idx}`}
          style={{
            borderLeft: '3px solid var(--color-accent)',
            padding: '1rem 1.5rem',
            margin: '1.5rem 0',
            background: 'var(--color-accent-soft)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            fontSize: '0.9rem',
            lineHeight: 1.7
          }}
        >
          {parseInline(trimmed.replace('> ', ''))}
        </blockquote>
      );
      return;
    }

    // List item
    if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      inList = true;
      const content = trimmed.replace(/^-\s|^\d+\.\s/, '');
      listItems.push(content);
      return;
    }

    // Empty line
    if (trimmed === '') {
      flushList();
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p
        key={`p-${idx}`}
        style={{
          fontSize: '1.05rem',
          lineHeight: 1.85,
          color: 'var(--text-secondary)',
          marginBottom: '1.25rem'
        }}
      >
        {parseInline(trimmed)}
      </p>
    );
  });

  flushList();
  return elements;
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const res = await fetchBlogBySlug(slug);
        if (res.data.success) {
          setPost(res.data.data);
          setRelatedPosts(res.data.relatedPosts || []);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Article link copied to clipboard! 🔗', 'success');
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '140px', minHeight: '80vh' }}>
        <LoadingSpinner message="Brewing your article..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div
        style={{
          paddingTop: '140px',
          textAlign: 'center',
          minHeight: '70vh'
        }}
        className="container"
      >
        <BookOpen
          size={48}
          style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}
        />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Article Not Found
        </h2>
        <p style={{ margin: '0.5rem 0 2rem', color: 'var(--text-secondary)' }}>
          The article you are looking for might have been moved or updated.
        </p>
        <Link to="/blog" className="btn btn-primary">
          Back to All Articles
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <button
            onClick={() => navigate('/blog')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--text-secondary)')
            }
          >
            <ArrowLeft size={16} /> Back to all articles
          </button>
        </motion.div>

        {/* Category Badge & Demo Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}
        >
          <span className="badge badge-primary">{post.category}</span>
          {post.isDemoContent && (
            <span
              style={{
                fontSize: '0.65rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-muted)',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              Demo Content
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-primary)'
          }}
        >
          {post.title}
        </motion.h1>

        {/* Author & Meta Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1rem 0',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--color-accent-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent)'
              }}
            >
              <User size={20} />
            </div>
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {post.author}
              </h5>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {post.authorRole}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} /> {post.publishDate}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} /> {post.readTime}
            </span>
            <button
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: 'var(--color-primary)',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </motion.div>

        {/* Hero Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '2.5rem',
            height: '420px',
            maxHeight: '55vh',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}
          >
            <Tag size={14} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                  fontWeight: 500
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Content Body with Rich Rendering */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="blog-content"
        >
          {renderContent(post.content)}
        </motion.div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: '4rem' }}
          >
            <h3
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                fontFamily: 'var(--font-serif)',
                marginBottom: '1.5rem',
                color: 'var(--text-primary)'
              }}
            >
              Related Articles
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {relatedPosts.map((rp) => (
                <BlogCard key={rp.id} post={rp} />
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA Callout */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card"
          style={{
            marginTop: '3.5rem',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            background:
              'linear-gradient(135deg, rgba(122, 31, 61, 0.08) 0%, rgba(217, 164, 65, 0.08) 100%)'
          }}
        >
          <Sparkles
            size={28}
            color="var(--color-accent)"
            style={{ margin: '0 auto 0.5rem' }}
          />
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-serif)'
            }}
          >
            Ready to Try It Out in Person?
          </h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
              maxWidth: '500px',
              margin: '0 auto 1.5rem',
              lineHeight: 1.6
            }}
          >
            Book your table at Cafe Love Byte and experience the vibes for real.
          </p>
          <Link to="/reservation" className="btn btn-primary">
            Reserve Your Experience <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage;
