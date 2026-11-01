import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Sparkles, Heart, Coffee, Calendar, ArrowRight } from 'lucide-react';
import GalleryGrid from '../components/GalleryGrid';
import SEO from '../components/SEO';
import { fetchGallery } from '../services/api';
import { FALLBACK_GALLERY } from '../data/galleryData';

const GalleryPage = () => {
  const [items, setItems] = useState(FALLBACK_GALLERY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await fetchGallery();
        if (res.data?.success && res.data.data?.length > 0) {
          setItems(res.data.data);
        }
      } catch (err) {
        console.warn('API fetch fallback to curated high-res gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  return (
    <div style={{ paddingTop: '95px', minHeight: '100vh' }}>
      <SEO
        title="Cafe Love Byte Gallery | Ambience, Food & Moments"
        description="Browse snapshots of Cafe Love Byte's aesthetic interiors, romantic candlelight corners, artisanal dishes, and celebration cabana setups."
        canonical="/gallery"
      />

      {/* Hero Header Section */}
      <section
        style={{
          padding: '3.5rem 0 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <span
            className="badge badge-gold"
            style={{ marginBottom: '1.25rem', padding: '0.4rem 1rem' }}
          >
            <Camera size={14} /> AESTHETIC VISUAL SANCTUARY
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              marginBottom: '1.25rem'
            }}
          >
            The <span className="text-gradient">Love Byte Vibe</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '680px',
              margin: '0 auto 2rem'
            }}
          >
            Immerse yourself in our romantic candlelight nooks, celebration cabanas,
            artisanal pour-over espresso bars, and mouthwatering chef creations.
          </p>

          {/* Key Feature Stats Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.25rem',
              marginTop: '1.5rem'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Heart size={14} color="var(--color-primary)" />
              <span>Intimate Dates & VIP Cabanas</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Coffee size={14} color="var(--color-accent)" />
              <span>Specialty Brews & Wood-Fired Sourdough</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Sparkles size={14} color="#E11D48" />
              <span>High-Resolution Lightbox</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Grid Section */}
      <section className="section-padding" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
        <div className="container">
          <GalleryGrid items={items} />
        </div>
      </section>

      {/* Aesthetic Call to Action */}
      <section
        style={{
          padding: '4rem 0 5rem',
          background: 'linear-gradient(180deg, transparent 0%, var(--bg-secondary) 100%)'
        }}
      >
        <div className="container" style={{ maxWidth: '900px' }}>
          <div
            className="glass-card"
            style={{
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Ambient Background Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '450px',
                height: '300px',
                background: 'radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
                <Calendar size={13} /> RESERVATIONS OPEN
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  lineHeight: 1.25
                }}
              >
                Fell in Love with an <span className="text-serif-italic text-gradient">Aesthetic Corner?</span>
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  maxWidth: '560px',
                  margin: '0 auto 2rem',
                  lineHeight: 1.6
                }}
              >
                Reserve your favorite private cabana, candlelit couple booth, or patio celebration table in advance. We’ll curate your special moment.
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <Link to="/reservations" className="btn btn-primary" style={{ fontSize: '1rem' }}>
                  <span>Book Your Table Now</span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/menu" className="btn btn-secondary" style={{ fontSize: '1rem' }}>
                  <span>Explore Menu</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
