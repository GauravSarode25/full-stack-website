import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass-card"
      style={{
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative'
      }}
    >
      <Quote
        size={36}
        color="var(--accent-gold-soft)"
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          opacity: 0.8
        }}
      />

      <div>
        {/* Rating & Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {testimonial.rating ? (
            <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
              {[...Array(Math.min(5, Math.max(1, Number(testimonial.rating) || 5)))].map((_, i) => (
                <Star key={i} size={15} fill="#F59E0B" />
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Guest Reflection</div>
          )}
          {testimonial.tag && (
            <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
              {testimonial.tag}
            </span>
          )}
        </div>

        {/* Comment */}
        <p
          style={{
            fontSize: '0.98rem',
            color: 'var(--text-primary)',
            fontStyle: 'italic',
            lineHeight: 1.65,
            marginBottom: '1.5rem'
          }}
        >
          "{testimonial.comment}"
        </p>
      </div>

      {/* Reviewer Details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <img
          src={testimonial.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
          alt={testimonial.name}
          loading="lazy"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--border-subtle)'
          }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {testimonial.name}
            </h5>
            {testimonial.isVerified === true && (
              <CheckCircle2 size={14} color="#10B981" title="Verified Customer" />
            )}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {testimonial.date || 'Guest Feedback'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
