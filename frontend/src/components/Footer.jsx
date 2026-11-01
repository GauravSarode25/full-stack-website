import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  Send,
  Mail
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { siteConfig } from '../config/siteConfig';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    addToast('Subscribed to Cafe Love Byte perks & date night specials.', 'success');
    setEmail('');
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        position: 'relative'
      }}
    >
      <div className="container">
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Col 1: Brand Info */}
          <div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}
              >
                {siteConfig.brandName}
              </h4>
            </Link>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-primary)',
                fontStyle: 'italic',
                fontFamily: 'var(--font-serif)',
                marginBottom: '1rem'
              }}
            >
              "{siteConfig.tagline}"
            </p>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1.25rem'
              }}
            >
              Couple-friendly & group-friendly modern café created for dates, celebrations, great food, and effortless memories.
            </p>

            {/* Social Icons: Instagram, Facebook, YouTube */}
            <div className="footer-social-row" style={{ display: 'flex', gap: '0.6rem' }}>
              {/* Instagram */}
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h5
              style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                color: 'var(--text-primary)',
                letterSpacing: '0.02em'
              }}
            >
              Explore
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Menu', path: '/menu' },
                { name: 'Blog', path: '/blog' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Contact', path: '/contact' }
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Timings & Location */}
          <div>
            <h5
              style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                color: 'var(--text-primary)'
              }}
            >
              Visit Us
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {siteConfig.contact.address}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <Clock size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ color: 'var(--text-secondary)' }}>
                  <p>{siteConfig.contact.hours.weekdays}</p>
                  <p>{siteConfig.contact.hours.weekends}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <Phone size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <a href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--text-secondary)' }}>
                  {siteConfig.contact.phoneDisplay}
                </a>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <Mail size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${siteConfig.contact.email}`} style={{ color: 'var(--text-secondary)' }}>
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h5
              style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                color: 'var(--text-primary)'
              }}
            >
              Join the Byte Club
            </h5>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              No spam. Just secret menu drops and perks worth opening an email for.
            </p>
            <form onSubmit={handleSubscribe} className="footer-newsletter-form" style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '0.65rem 0.95rem',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-full)'
                }}
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="btn btn-primary"
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Privacy Policy, Terms, Copyright */}
        <div
          className="footer-bottom-bar"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}
        >
          <p>© {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</p>
          <div className="footer-bottom-links" style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/contact" style={{ color: 'var(--text-muted)' }}>
              Privacy Policy
            </Link>
            <Link to="/contact" style={{ color: 'var(--text-muted)' }}>
              Terms & Conditions
            </Link>
            <Link to="/admin" style={{ color: 'var(--text-muted)' }}>
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
