import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck,
  Heart,
  Users,
  Smile,
  PartyPopper,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Quote,
  ShieldCheck,
  Coffee,
  X,
  ZoomIn
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import SEO from '../components/SEO';
import { siteConfig } from '../config/siteConfig';

const VIBE_MODES = [
  {
    id: 'date-mode',
    title: 'Date Mode',
    subtitle: 'For Two & Quiet Chemistry',
    desc: 'Secluded candlelight booths with soft warm lighting, private acoustics, and food meant for sharing without awkward interruptions.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'friend-mode',
    title: 'Friend Mode',
    subtitle: 'Louder Laughs & Loaded Platters',
    desc: 'Low table seating, endless sharing bites, board games, and great background playlists for after-work catch-ups and weekend reunions.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'family-mode',
    title: 'Family Mode',
    subtitle: 'Comfortable Dining for Everyone',
    desc: 'Spacious seating with pure vegetarian and continental options, welcoming hospitality, and a clean, comfortable setting for weekend meals.',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'celebration-mode',
    title: 'Celebration Mode',
    subtitle: 'Birthdays, Anniversaries & Surprises',
    desc: 'Private celebration cabanas that can be personalized with table decor, cakes, props, and celebratory food spreads for special milestones.',
    image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=800&auto=format&fit=crop'
  }
];

const DIFFERENTIATORS = [
  {
    title: 'Couple-Friendly',
    desc: 'Intimate seating layouts angled for privacy, romantic candlelights, and couples combos.'
  },
  {
    title: 'Group-Friendly',
    desc: 'Spacious pods and patio areas that comfortably host 4 to 20 guests together.'
  },
  {
    title: 'Private Spaces',
    desc: 'Dedicated cabanas and partitioned nooks so you can converse without feeling watched.'
  },
  {
    title: 'Aesthetic Ambience',
    desc: 'Thoughtfully curated interior tones, warm lighting fixtures, and photogenic corners.'
  },
  {
    title: 'Variety of Cuisines',
    desc: 'Specialty 100% Arabica coffees, sourdough pizzas, smash burgers, tacos, and desserts.'
  },
  {
    title: 'Affordable Pricing',
    desc: 'Premium dining atmosphere and gourmet ingredients priced for everyday cafe visits.'
  },
  {
    title: 'Hygienic Environment',
    desc: 'Clean open brew bars, sanitized tables, and strict culinary hygiene practices.'
  }
];

const ABOUT_GALLERY = [
  {
    id: 'ab-gal-1',
    title: 'Candlelight Date Corners',
    desc: 'Warm ambient lighting designed for real intimacy',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ab-gal-2',
    title: 'Artisanal Single-Origin Bar',
    desc: 'Specialty cold brews and pour-over coffee craft',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ab-gal-3',
    title: 'Private Celebration Cabana',
    desc: 'For birthdays, anniversaries, and surprise parties',
    image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ab-gal-4',
    title: 'Gourmet Sourdough Flatbreads',
    desc: '48-hour fermented crusts with fresh burrata',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ab-gal-5',
    title: 'Outdoor Sunset Patio',
    desc: 'Open air breeze and fairy lit evening seating',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ab-gal-6',
    title: 'Decadent Desserts & Sips',
    desc: 'Molten lava cakes and berry sparklers',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop'
  }
];

const AboutPage = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div style={{ paddingTop: '76px' }}>
      <SEO
        title="Cafe Love Byte | Our Story & Experience"
        description="Discover the story of Cafe Love Byte. Designed for romantic dates, friend reunions, and memorable celebrations with intimate booths, specialty coffees, and sharing platters."
        canonical="/about"
      />

      {/* ===================================================================
          HERO SECTION
          =================================================================== */}
      <section
        style={{
          position: 'relative',
          padding: '5.5rem 0 4rem',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="container" style={{ maxWidth: '840px', textAlign: 'center' }}>
          <span
            className="badge badge-primary"
            style={{
              marginBottom: '1.25rem',
              letterSpacing: '0.08em'
            }}
          >
            THE LOVE BYTE IDENTITY
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              marginBottom: '1.5rem'
            }}
          >
            MORE THAN A CAFE.<br />
            <span className="text-serif-italic text-gradient">
              IT'S YOUR KIND OF PLACE.
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              maxWidth: '680px',
              margin: '0 auto 2rem'
            }}
          >
            Cafe Love Byte is a modern, aesthetic, couple-friendly and group-friendly café built for dates, friend reunions, family dinners, celebrations, and memorable food experiences.
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/reservation" className="btn btn-primary">
              <CalendarCheck size={16} />
              <span>Book a Table</span>
            </Link>
            <Link to="/menu" className="btn btn-secondary">
              <span>View Our Menu</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          1. OUR STORY
          =================================================================== */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div
            className="about-split-grid responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            {/* Left: Visual Frame */}
            <div>
              <div
                className="card-surface"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop"
                  alt="Crafting artisanal pour-over coffee and specialty brews at Cafe Love Byte"
                  className="about-feature-image"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '420px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-lg)'
                  }}
                />
              </div>
            </div>

            {/* Right: Narrative */}
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
                CHAPTER 01
              </span>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem'
                }}
              >
                Our <span className="text-serif-italic text-gradient">Story</span>
              </h2>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.02rem', marginBottom: '1.25rem' }}>
                Cafe Love Byte was born out of a simple observation: modern cafes often prioritize either fast takeaway traffic or loud generic dining, losing the magic of genuine conversation and aesthetic intimacy.
              </p>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.02rem', marginBottom: '1.75rem' }}>
                We built Cafe Love Byte around five pillars: <strong>food, conversations, dates, friendships and celebrations</strong>. From the acoustic balance that lets two people whisper comfortably to the sharing platters that bring groups together, every corner is designed to turn ordinary outings into memories.
              </p>

              <div
                className="two-col-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1.25rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    Intimate Seating
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Acoustic couple booths & private cabanas
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                    Artisanal Kitchen
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Freshly prepared sourdough & single-origin coffee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. OUR VIBE (4 Visual Mode Cards)
          =================================================================== */}
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            badge="FOUR DISTINCT MODES"
            title="Our"
            highlight="Vibe"
            subtitle="Whatever your mood or company, we have a space curated precisely for the occasion."
          />

          <div
            className="responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {VIBE_MODES.map((mode) => (
              <div
                key={mode.id}
                className="card-surface"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <div style={{ height: '200px', width: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                  <img
                    src={mode.image}
                    alt={`${mode.title}: ${mode.subtitle} experience at Cafe Love Byte`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--color-accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        display: 'block',
                        marginBottom: '0.35rem'
                      }}
                    >
                      {mode.subtitle}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      {mode.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {mode.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. WHAT MAKES US DIFFERENT (7 Core Pillars)
          =================================================================== */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionHeading
            badge="DISTINCT VALUES"
            title="What Makes Us"
            highlight="Different"
            subtitle="The core standards that define every visit to Cafe Love Byte."
          />

          <div
            className="about-values-grid responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {DIFFERENTIATORS.map((diff, idx) => (
              <div
                key={idx}
                className="card-surface"
                style={{
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                    {diff.title}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {diff.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. OUR PHILOSOPHY (Editorial Quote Banner)
          =================================================================== */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0',
          backgroundColor: 'var(--bg-primary)',
          textAlign: 'center',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <Quote size={40} color="var(--color-accent)" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
          
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              lineHeight: 1.35,
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}
          >
            "Good food starts the conversation.<br />
            <span className="text-serif-italic text-gradient">Great ambience keeps it going.</span><br />
            The memories stay."
          </h2>

          <div
            style={{
              display: 'inline-block',
              width: '48px',
              height: '2px',
              backgroundColor: 'var(--color-accent)',
              marginBottom: '1rem'
            }}
          />

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
            — The Cafe Love Byte Philosophy
          </p>
        </div>
      </section>

      {/* ===================================================================
          5. GALLERY SECTION (Realistic Café Imagery)
          =================================================================== */}
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            badge="VISUAL GLIMPSE"
            title="Life at"
            highlight="Love Byte"
            subtitle="Explore snapshots of our booths, pour-over bar, sourdough dishes, and terrace vibes."
          />

          <div
            className="about-gallery-grid responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {ABOUT_GALLERY.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="card-surface"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  height: '270px'
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(21, 17, 19, 0.85) 0%, rgba(21, 17, 19, 0.1) 60%, transparent 100%)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    color: '#FFFFFF'
                  }}
                >
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#D1BEB4' }}>
                    {item.desc}
                  </p>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(21, 17, 19, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  <ZoomIn size={15} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/gallery" className="btn btn-secondary">
              <span>View Full Ambience Gallery</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Viewer */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            className="modal-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.88)',
                backdropFilter: 'blur(8px)'
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-window"
              style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '840px',
                width: '100%',
                maxHeight: '85vh',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                background: 'var(--bg-card)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ position: 'relative', height: '460px', maxHeight: '60vh', overflow: 'hidden' }}>
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => setSelectedPhoto(null)}
                  aria-label="Close photo preview"
                  className="modal-close-btn"
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '44px',
                    height: '44px',
                    minWidth: '44px',
                    minHeight: '44px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.65)',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '1.25rem 1.75rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  {selectedPhoto.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {selectedPhoto.desc}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          6. CTA BANNER
          =================================================================== */}
      <section
        style={{
          position: 'relative',
          padding: '5.5rem 0',
          backgroundColor: 'var(--bg-secondary)',
          textAlign: 'center',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <div className="container" style={{ maxWidth: '680px' }}>
          <span
            className="badge badge-gold"
            style={{ marginBottom: '1rem' }}
          >
            YOUR TABLE AWAITS
          </span>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: '1rem'
            }}
          >
            STOP PLANNING. <span className="text-serif-italic text-gradient">START EATING.</span>
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2rem'
            }}
          >
            Reserve your candlelight booth or celebration cabana ahead of time. Great conversations don't happen in the waiting lounge.
          </p>

          <Link
            to="/reservation"
            className="btn btn-primary"
            style={{
              padding: '0.95rem 2.4rem',
              fontSize: '1rem'
            }}
          >
            <CalendarCheck size={18} />
            <span>Book a Table</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
