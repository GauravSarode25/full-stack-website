import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ChevronDown,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ContactForm from '../components/ContactForm';
import SEO from '../components/SEO';
import { siteConfig } from '../config/siteConfig';

const CONTACT_FAQS = [
  {
    q: 'Do you accept reservations?',
    a: 'Yes, we accept both online and phone table reservations. We recommend booking in advance for evening slots and weekend date nights to guarantee seating.'
  },
  {
    q: 'Do you have private spaces?',
    a: 'Yes! We feature acoustic Romantic Candlelight Corners for couples as well as curtained Private Celebration Cabanas for birthdays and groups.'
  },
  {
    q: 'Are groups allowed?',
    a: 'Absolutely. We welcome friends, office teams, and family reunions. Our group pods and terrace tables accommodate parties of up to 20 guests.'
  },
  {
    q: 'Do you offer vegetarian options?',
    a: 'Over 70% of our menu consists of pure vegetarian and vegan-friendly dishes, including artisan pizzas, loaded paneer tacos, pastas, and oat-milk specialty coffees.'
  },
  {
    q: 'Can I celebrate birthdays?',
    a: 'Yes! You can reserve our Celebration Cabana and pre-order cakes, dessert platters, and celebration setups by mentioning your plans in the booking request.'
  },
  {
    q: 'Do you accept special decoration requests?',
    a: 'Yes. For date nights, anniversaries, and proposals, our team can arrange rose petals, candlelight settings, and customized welcome message cards.'
  }
];

const ContactPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      <SEO
        title="Contact Cafe Love Byte | Reservations & Enquiries"
        description="Get in touch with Cafe Love Byte for table reservations, private cabana bookings, and event inquiries. Find our location, hours, and direct contact details."
        canonical="/contact"
        includeLocalBusiness={true}
      />

      {/* ===================================================================
          HERO SECTION
          =================================================================== */}
      <section
        style={{
          padding: '4.5rem 0 2.5rem',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '780px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
            GET IN TOUCH
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              marginBottom: '1rem'
            }}
          >
            LET'S TALK <span className="text-serif-italic text-gradient">FOOD.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Have a question about large reservations, private cabana bookings, dietary needs, or event collaborations? We're always here to help.
          </p>
        </div>
      </section>

      {/* ===================================================================
          CONTACT INFORMATION & FORM GRID
          =================================================================== */}
      <section className="section-padding">
        <div className="container">
          <div
            className="contact-layout responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'flex-start'
            }}
          >
            {/* Left Column: Contact Cards & Map Integration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div className="card-surface" style={{ padding: '2.25rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  Cafe Love Byte Details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Address */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.2rem' }}>Address</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {siteConfig.contact.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.2rem' }}>Phone</h4>
                      <a
                        href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                        style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                      >
                        {siteConfig.contact.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.2rem' }}>Email</h4>
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                      >
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--color-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.2rem' }}>Opening Hours</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {siteConfig.contact.hours.weekdays}<br />
                        {siteConfig.contact.hours.weekends}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links Bar */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                    Connect On Social
                  </h5>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                    >
                      Instagram
                    </a>
                    <a
                      href={siteConfig.social.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                    >
                      Facebook
                    </a>
                    <a
                      href={siteConfig.social.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Maps Integration Placeholder Card */}
              <div
                className="card-surface"
                style={{
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Find Us on Google Maps</h4>
                  <a
                    href={siteConfig.contact.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                  >
                    <ExternalLink size={14} />
                    <span>Get Directions</span>
                  </a>
                </div>

                {/* Stylized Map View Placeholder Frame */}
                <div
                  style={{
                    height: '200px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop"
                    alt="Cafe Love Byte Map Location"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(17, 16, 19, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      padding: '1rem',
                      textAlign: 'center'
                    }}
                  >
                    <MapPin size={32} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
                    <strong style={{ fontSize: '1rem' }}>{siteConfig.brandName}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#F7F2F0' }}>{siteConfig.contact.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div style={{ flex: 1.2 }}>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FAQ SECTION (Accordion UI with the 6 Requested Questions)
          =================================================================== */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <SectionHeading
            badge="FREQUENT QUESTIONS"
            title="Frequently Asked"
            highlight="Questions"
            subtitle="Everything you need to know about table reservations, cabanas, and group visits."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {CONTACT_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="card-surface"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      color="var(--color-primary)"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform var(--transition-fast)'
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.25rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.92rem',
                        lineHeight: 1.65,
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '1rem'
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
