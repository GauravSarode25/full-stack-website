import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  ChevronRight,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  CheckCircle2,
  Users,
  Sparkles,
  Heart,
  PartyPopper
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import MenuCard from '../components/MenuCard';
import BlogCard from '../components/BlogCard';
import TestimonialCard from '../components/TestimonialCard';
import SEO from '../components/SEO';
import { siteConfig, signatureHomeMenu, homeBlogPreviews, sampleTestimonials } from '../config/siteConfig';
import { fetchFeedback } from '../services/api';

const HomePage = () => {
  const [reviews, setReviews] = useState(sampleTestimonials);

  useEffect(() => {
    const loadLiveFeedback = async () => {
      try {
        const res = await fetchFeedback();
        if (res.data?.success && res.data.data?.length > 0) {
          setReviews(res.data.data.slice(0, 3));
        }
      } catch (err) {
        // Gracefully falls back to curated sample reviews
      }
    };
    loadLiveFeedback();
  }, []);

  return (
    <div>
      <SEO
        title="Cafe Love Byte | Dates, Food & Good Vibes"
        description="Cafe Love Byte is a couple-friendly and group-friendly café offering delicious food, private spaces, great ambience and memorable dining experiences."
        canonical="/"
        ogType="restaurant.restaurant"
        includeLocalBusiness={true}
      />

      {/* ===================================================================
          1. HERO SECTION
          =================================================================== */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '6rem',
          paddingBottom: '4rem',
          overflow: 'hidden'
        }}
      >
        {/* Background Image: Realistic Indian Urban Aesthetic Café Interior with Warm Ambient Lighting */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1800&auto=format&fit=crop"
            alt="Cafe Love Byte aesthetic cafe interior featuring warm ambient pendant lighting and cozy couple tables"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          {/* Subtle dark gradient overlay for optimal readability & mood */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--hero-overlay)',
              transition: 'background var(--transition-smooth)'
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '860px' }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          >
            {/* Small Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.35rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(217, 164, 65, 0.15)',
                border: '1px solid rgba(217, 164, 65, 0.35)',
                color: 'var(--color-accent)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem'
              }}
            >
              {siteConfig.brandName}
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)',
                fontWeight: 900,
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
                color: '#FFFFFF',
                marginBottom: '1.25rem'
              }}
            >
              YOUR DATE DESERVES<br />
              <span className="text-serif-italic" style={{ color: '#E58A9B' }}>
                MORE THAN JUST A CHAT.
              </span>
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                color: '#F7F2F0',
                lineHeight: 1.6,
                maxWidth: '620px',
                margin: '0 auto 2rem',
                fontWeight: 400
              }}
            >
              {siteConfig.slogans.heroSubheading}
            </p>

            {/* CTA Buttons */}
            <div
              className="hero-cta-row"
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '2rem'
              }}
            >
              <Link
                to="/reservation"
                className="btn btn-primary"
                style={{
                  padding: '0.95rem 2.2rem',
                  fontSize: '1rem'
                }}
              >
                <CalendarCheck size={18} />
                <span>Book a Table</span>
              </Link>

              <Link
                to="/menu"
                className="btn btn-secondary"
                style={{
                  padding: '0.95rem 2rem',
                  fontSize: '1rem',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <span>Explore Menu</span>
              </Link>
            </div>

            {/* Trust / Message Line */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--color-accent)',
                letterSpacing: '0.06em',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}
            >
              {siteConfig.slogans.trustLine}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 2 — BRAND INTRO & 3 FEATURE CARDS
          =================================================================== */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionHeading
            badge="OUR MISSION"
            title="WHERE EVERY BITE"
            highlight="BECOMES A MEMORY."
            subtitle="Whether it's a first date, a late-night catch-up, a birthday celebration or simply a plan that needed better food — Cafe Love Byte is made for moments worth remembering."
          />

          <div
            className="responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {/* Card 1: Date Nights */}
            <div
              className="card-surface"
              style={{
                padding: '2.25rem 2rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Heart size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Date Nights</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Private corners, cozy vibes and food made for two.
              </p>
            </div>

            {/* Card 2: Friend Groups */}
            <div
              className="card-surface"
              style={{
                padding: '2.25rem 2rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Friend Groups</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                More people. More food. More stories.
              </p>
            </div>

            {/* Card 3: Celebrations */}
            <div
              className="card-surface"
              style={{
                padding: '2.25rem 2rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PartyPopper size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Celebrations</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Birthdays, surprises and moments worth making a little louder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 3 — SIGNATURE MENU (6 Requested Items)
          =================================================================== */}
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            badge="SIGNATURE BITES"
            title="CRAVINGS DON'T"
            highlight="WAIT."
            subtitle="Our most-loved bites, made for serious cravings."
          />

          {/* 6 Menu Items Grid */}
          <div
            className="menu-grid responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
              marginBottom: '3rem'
            }}
          >
            {signatureHomeMenu.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link
              to="/menu"
              className="btn btn-secondary"
              style={{ padding: '0.85rem 2.25rem', fontSize: '0.95rem' }}
            >
              <span>View Full Menu</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 4 — EXPERIENCE (Large Split Section)
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
            {/* Left: Large Interior Image */}
            <div>
              <div
                className="card-surface"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop"
                  alt="Aesthetic candlelight couple dining booth and cozy private seating at Cafe Love Byte"
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

            {/* Right: Text & Checklist */}
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
                THE EXPERIENCE
              </span>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem'
                }}
              >
                {siteConfig.slogans.experienceHeading}
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem', fontSize: '1.05rem' }}>
                Cafe Love Byte is intentionally built for dates, friends, family and celebrations. We combine acoustic privacy, warm lighting, freshly prepared bites, and approachable prices so you can linger without rushing.
              </p>

              {/* 6 Feature Items Grid */}
              <div
                className="two-col-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}
              >
                {[
                  'Private Spaces',
                  'Great Ambience',
                  'Fresh Food',
                  'Affordable Prices',
                  'Instagram-Worthy Corners',
                  'Couple & Group Friendly'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-primary)' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link to="/about" className="btn btn-primary">
                <span>Explore Our Space</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 5 — WHY LOVE BYTE? (Editorial Statistics & Brand Statements)
          =================================================================== */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.85rem' }}>
              OUR PROMISE
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {siteConfig.slogans.whyHeadingLine1}<br />
              <span className="text-serif-italic text-gradient">
                {siteConfig.slogans.whyHeadingLine2}
              </span>
            </h2>
          </div>

          <div
            className="responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {[
              { stat: '100%', label: 'Freshly Prepared', sub: 'Cooked to order with wholesome ingredients' },
              { stat: '4+', label: 'Dining Experiences', sub: 'Booths, cabanas, patio, and gaming lounge' },
              { stat: '∞', label: 'Good Conversations', sub: 'Acoustic design made for talking effortlessly' },
              { stat: '1', label: 'Place to Make Memories', sub: 'Where every bite becomes a lasting story' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="card-surface"
                style={{
                  padding: '2.25rem 1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '3rem',
                    fontWeight: 900,
                    color: 'var(--color-primary)',
                    lineHeight: 1.1,
                    marginBottom: '0.4rem'
                  }}
                >
                  {item.stat}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  {item.label}
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 6 — BLOG PREVIEW (3 Journal Articles)
          =================================================================== */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionHeading
            badge="JOURNAL"
            title="FROM THE LOVE BYTE"
            highlight="JOURNAL"
            subtitle="Thoughts on modern cafe dates, cravings, and memorable experiences."
          />

          <div
            className="blog-grid responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '2.5rem'
            }}
          >
            {homeBlogPreviews.map((post) => (
              <BlogCard
                key={post.id}
                post={{
                  id: post.id,
                  slug: post.slug,
                  title: post.title,
                  category: post.category,
                  publishDate: post.date,
                  coverImage: post.image,
                  excerpt: post.description,
                  author: 'Love Byte Editorial',
                  readTime: '4 min read'
                }}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/blog" className="btn btn-secondary">
              <span>Read All Stories</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 7 — TESTIMONIALS (Curated Patron Feedback)
          =================================================================== */}
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            badge="GUEST REFLECTIONS"
            title="WHAT PEOPLE SAY ABOUT"
            highlight="THE VIBE"
            subtitle="Thoughts and feedback from guests who visited our private booths and celebration corners."
          />

          <div
            className="testimonial-grid responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1.75rem',
              marginBottom: '2.5rem'
            }}
          >
            {reviews.map((rev) => (
              <TestimonialCard
                key={rev.id}
                testimonial={{
                  name: rev.name,
                  rating: rev.rating,
                  tag: rev.tag,
                  comment: rev.comment,
                  date: rev.date || 'Guest Experience',
                  isVerified: rev.isVerified || false
                }}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/reviews" className="btn btn-secondary">
              <span>Share Your Review</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 8 — RESERVATION CTA
          =================================================================== */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop"
            alt="Reserved date night dining table with intimate warm candlelights and couple combo dishes at Cafe Love Byte"
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(17, 16, 19, 0.85) 0%, rgba(17, 16, 19, 0.92) 100%)'
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '700px' }}>
          <span
            className="badge"
            style={{
              background: 'rgba(217, 164, 65, 0.2)',
              color: 'var(--color-accent)',
              border: '1px solid rgba(217, 164, 65, 0.35)',
              marginBottom: '1rem'
            }}
          >
            READY FOR YOUR VISIT?
          </span>
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: '1rem'
            }}
          >
            {siteConfig.slogans.reservationCtaHeading}
          </h2>
          <p
            style={{
              fontSize: '1.2rem',
              color: '#F7F2F0',
              marginBottom: '2rem',
              fontStyle: 'italic',
              fontFamily: 'var(--font-serif)'
            }}
          >
            "{siteConfig.slogans.reservationCtaSub}"
          </p>

          <Link
            to="/reservation"
            className="btn btn-primary"
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.05rem'
            }}
          >
            <CalendarCheck size={18} />
            <span>Book a Table</span>
          </Link>
        </div>
      </section>

      {/* ===================================================================
          SECTION 9 — CONTACT PREVIEW
          =================================================================== */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionHeading
            badge="FIND US"
            title="LET'S MAKE"
            highlight="PLANS."
            subtitle="Drop by for coffee, dinner, or plan your next group gathering."
          />

          <div
            className="contact-info-grid responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}
          >
            {/* Location */}
            <div className="card-surface" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <MapPin size={26} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Location</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {siteConfig.contact.address}
              </p>
            </div>

            {/* Timings */}
            <div className="card-surface" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <Clock size={26} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Opening Hours</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {siteConfig.contact.hours.weekdays}<br />
                {siteConfig.contact.hours.weekends}
              </p>
            </div>

            {/* Direct Channels */}
            <div className="card-surface" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <Phone size={26} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Phone & Email</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Phone: {siteConfig.contact.phoneDisplay}<br />
                Email: {siteConfig.contact.email}
              </p>
            </div>
          </div>

          <div className="contact-cta-row" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={siteConfig.contact.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              <ExternalLink size={16} />
              <span>Get Directions</span>
            </a>

            <Link to="/contact" className="btn btn-secondary">
              <span>Contact Us</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
