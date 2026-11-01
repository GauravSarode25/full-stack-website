import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, X, Filter, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { fetchBlogs } from '../services/api';

const CATEGORIES_MAP = {
  'All': null,
  'Dating & Lifestyle': 'Dating & Lifestyle',
  'Food Guide': 'Food Guide',
  'Café Culture': 'Café Culture',
  'Tips & Etiquette': 'Tips & Etiquette',
  'Friendship': 'Friendship',
  'Experiences': 'Experiences'
};

const BlogPage = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await fetchBlogs();
        if (res.data.success) {
          setAllBlogs(res.data.data);
          if (res.data.categories) {
            setAvailableCategories(res.data.categories);
          }
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  // Featured post
  const featuredPost = useMemo(() => {
    return allBlogs.find((p) => p.featured === true) || allBlogs[0];
  }, [allBlogs]);

  // Filtered posts (excluding featured from listing)
  const filteredPosts = useMemo(() => {
    let posts = allBlogs.filter((p) => p.id !== featuredPost?.id);

    if (activeCategory !== 'All') {
      posts = posts.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    }

    return posts;
  }, [allBlogs, activeCategory, searchQuery, featuredPost]);

  // Category buttons to display
  const categoryButtons = useMemo(() => {
    const cats = ['All', ...availableCategories];
    return [...new Set(cats)];
  }, [availableCategories]);

  if (loading) {
    return (
      <div style={{ paddingTop: '140px', minHeight: '80vh' }}>
        <LoadingSpinner message="Curating stories & guides..." />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px' }}>
      <SEO
        title="Cafe Love Byte Journal | Food, Dates & Café Stories"
        description="Read the Cafe Love Byte journal for curated date ideas, café culture guides, food pairing hacks, and stories from behind the brew bar."
        canonical="/blog"
      />

      {/* ============================================= */}
      {/* HERO SECTION */}
      {/* ============================================= */}
      <section style={{ padding: '3rem 0 1rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="badge badge-primary"
            style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', letterSpacing: '0.08em' }}
          >
            <BookOpen size={13} /> FOOD FOR THOUGHT
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 900,
              marginBottom: '1rem',
              fontFamily: 'var(--font-serif)',
              lineHeight: 1.15
            }}
          >
            Stories, Sips &{' '}
            <span className="text-gradient">Café Culture</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Food for thought. From date night conversation starters to late-night food guides, written by the team behind your favorite tables.
          </motion.p>
        </div>
      </section>

      {/* ============================================= */}
      {/* SEARCH & FILTER BAR */}
      {/* ============================================= */}
      <section style={{ padding: '1.5rem 0 0.5rem' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              position: 'relative',
              maxWidth: '520px',
              margin: '0 auto 1.5rem'
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              id="blog-search"
              type="text"
              placeholder="Search articles, topics, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 44px 14px 48px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(122, 31, 61, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--bg-secondary)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={14} />
              </button>
            )}
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            {categoryButtons.map((cat) => (
              <button
                key={cat}
                id={`blog-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: activeCategory === cat
                    ? '1.5px solid var(--color-primary)'
                    : '1.5px solid var(--border-subtle)',
                  background: activeCategory === cat
                    ? 'var(--color-primary)'
                    : 'transparent',
                  color: activeCategory === cat
                    ? 'var(--color-primary-text)'
                    : 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  letterSpacing: '0.2px'
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FEATURED ARTICLE */}
      {/* ============================================= */}
      {featuredPost && activeCategory === 'All' && !searchQuery && (
        <section style={{ padding: '2rem 0 0.5rem' }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <BlogCard post={featuredPost} variant="featured" />
            </motion.div>
          </div>
        </section>
      )}

      {/* ============================================= */}
      {/* LATEST ARTICLES GRID */}
      {/* ============================================= */}
      <section className="section-padding" style={{ paddingTop: '2rem' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-primary)'
              }}
            >
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategory !== 'All'
                ? activeCategory
                : 'Latest Articles'}
            </h2>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                fontWeight: 500
              }}
            >
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filteredPosts.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${searchQuery}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="blog-grid responsive-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '2rem'
                }}
              >
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <Search size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  No articles found
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {searchQuery
                    ? `We couldn't find any articles matching "${searchQuery}".`
                    : `No articles in the "${activeCategory}" category yet.`}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                >
                  View All Articles
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ============================================= */}
      {/* DEMO CONTENT NOTICE + CTA */}
      {/* ============================================= */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          {/* Demo Notice */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              lineHeight: 1.6,
              marginBottom: '2.5rem'
            }}
          >
            <strong style={{ color: 'var(--text-secondary)' }}>📝 Demo Content</strong>
            <br />
            These articles are sample/demo content created for demonstration purposes.
            Cafe Love Byte can replace them with original articles at any time.
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card"
            style={{
              padding: '3rem 2.5rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              background:
                'linear-gradient(135deg, rgba(122, 31, 61, 0.08) 0%, rgba(217, 164, 65, 0.08) 100%)'
            }}
          >
            <Sparkles
              size={30}
              color="var(--color-accent)"
              style={{ margin: '0 auto 0.75rem' }}
            />
            <h3
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
                fontFamily: 'var(--font-serif)'
              }}
            >
              Ready to Experience It in Person?
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                maxWidth: '440px',
                margin: '0 auto 1.5rem',
                lineHeight: 1.6
              }}
            >
              The best stories happen at real tables. Book yours at Cafe Love Byte today.
            </p>
            <Link to="/reservation" className="btn btn-primary">
              Reserve Your Table <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
