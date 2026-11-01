import React from 'react';
import {
  CalendarCheck,
  Heart,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import ReservationForm from '../components/ReservationForm';
import SEO from '../components/SEO';
import { siteConfig } from '../config/siteConfig';

const ReservationPage = () => {
  return (
    <div style={{ paddingTop: '76px' }}>
      <SEO
        title="Reserve a Table | Cafe Love Byte Table Booking"
        description="Reserve your romantic candlelight booth or private celebration cabana at Cafe Love Byte. Skip the waiting lounge and lock in your table."
        canonical="/reservation"
      />

      {/* Header Banner */}
      <section
        style={{
          padding: '4.5rem 0 2.5rem',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', letterSpacing: '0.08em' }}>
            TABLE RESERVATION
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              marginBottom: '1rem'
            }}
          >
            SO... WHEN <span className="text-serif-italic text-gradient">ARE WE EATING?</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Your date deserves more than just a chat. Lock in your private booth, cabana, or corner lounge before someone else beats you to it.
          </p>
        </div>
      </section>

      {/* Main Reservation Section */}
      <section className="section-padding">
        <div className="container">
          <div
            className="reservation-layout responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'flex-start'
            }}
          >
            {/* Left Column: Hospitality Standards & Seating Guide */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div
                className="card-surface"
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
                  OUR PROMISE
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  How Reservations Work
                </h3>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {[
                    {
                      icon: Heart,
                      title: 'Personalized Seating',
                      desc: 'We match your requested occasion (Date, Birthday, Family) with the optimal seating arrangement.'
                    },
                    {
                      icon: Clock,
                      title: 'Fast Team Confirmation',
                      desc: 'Our hospitality manager reviews seating capacity and confirms your table shortly via phone or message.'
                    },
                    {
                      icon: Sparkles,
                      title: 'Special Arrangements',
                      desc: 'Mention cake cuts, subtle table decorations, or dietary notes in your special requests.'
                    }
                  ].map((perk, i) => {
                    const IconC = perk.icon;
                    return (
                      <li key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
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
                          <IconC size={18} />
                        </div>
                        <div>
                          <h5 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {perk.title}
                          </h5>
                          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {perk.desc}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Direct Concierge Assist Card */}
              <div
                className="card-surface"
                style={{
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  Large Group (10+ Guests) or Urgent Booking?
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Call our café host directly for instantaneous seating updates or custom celebration menus.
                </p>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <PhoneCall size={16} />
                  <span>Call Us: {siteConfig.contact.phoneDisplay}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Reservation Form */}
            <div style={{ flex: 1.3 }}>
              <ReservationForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReservationPage;
