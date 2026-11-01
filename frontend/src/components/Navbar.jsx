import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'background-color var(--transition-smooth), border-color var(--transition-smooth), box-shadow var(--transition-smooth)',
        backgroundColor: isScrolled ? 'var(--bg-nav)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            minWidth: 0,
            flexShrink: 1
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 800,
              fontSize: 'clamp(1.1rem, 3.8vw, 1.35rem)',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap'
            }}
          >
            CAFE <span className="text-gradient">LOVE BYTE</span>
          </span>
          <span
            style={{
              fontSize: 'clamp(0.58rem, 2vw, 0.65rem)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Aesthetic • Modern • Bites
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.2rem'
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: '0.92rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                position: 'relative',
                padding: '0.25rem 0',
                transition: 'color var(--transition-fast)'
              })}
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      style={{
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        right: 0,
                        height: '2px',
                        borderRadius: '1px',
                        backgroundColor: 'var(--color-primary)'
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Header Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          {/* Admin Shortcut */}
          <Link
            to="/admin"
            title="Admin Portal"
            className="navbar-admin-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              minWidth: '40px',
              minHeight: '40px',
              borderRadius: 'var(--radius-full)',
              background: isAuthenticated ? 'var(--color-accent-soft)' : 'transparent',
              color: isAuthenticated ? 'var(--color-accent)' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <ShieldCheck size={18} />
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Primary CTA */}
          <Link
            to="/reservation"
            className="btn btn-primary desktop-cta"
            style={{
              padding: '0.65rem 1.4rem',
              fontSize: '0.88rem'
            }}
          >
            <CalendarCheck size={16} />
            <span>Book a Table</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="mobile-toggle"
            style={{
              display: 'none',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: 'var(--bg-nav)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--border-subtle)',
              overflow: 'hidden'
            }}
          >
            <div
              className="container"
              style={{
                paddingTop: '1.25rem',
                paddingBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  style={({ isActive }) => ({
                    fontSize: '1.05rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
                    padding: '0.4rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)'
                  })}
                >
                  <span>{link.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>→</span>
                </NavLink>
              ))}

              {/* Admin Portal Shortcut in Drawer */}
              <NavLink
                to="/admin"
                className="mobile-nav-link"
                style={({ isActive }) => ({
                  fontSize: '1.05rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-accent)' : 'var(--text-secondary)',
                  padding: '0.65rem 0',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-subtle)'
                })}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={17} color="var(--color-accent)" />
                  <span>Admin Portal</span>
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>→</span>
              </NavLink>

              {/* Theme Toggle row in Mobile Drawer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Appearance Mode
                </span>
                <ThemeToggle showLabel={true} />
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <Link
                  to="/reservation"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <CalendarCheck size={17} />
                  <span>Book a Table</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-cta {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
