import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, MessageSquarePlus, Sparkles, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import TestimonialCard from '../components/TestimonialCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchFeedback, submitFeedback } from '../services/api';
import { useToast } from '../context/ToastContext';

const OCCASION_TAGS = [
  'First Date',
  'Romantic Anniversary',
  'Birthday Bash',
  'Friends Reunion',
  'Specialty Coffee',
  'Cozy Reading & Vibe'
];

const FeedbackPage = () => {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    tag: 'First Date',
    comment: ''
  });
  const [hoverRating, setHoverRating] = useState(0);

  const loadFeedback = async () => {
    try {
      const res = await fetchFeedback();
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.comment.trim().length < 10) {
      addToast('Please provide your name and a comment with at least 10 characters', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitFeedback(formData);
      if (res.data.success) {
        addToast('Thank you for sharing your love with Cafe Love Byte! ❤️', 'success');
        setFormData({
          name: '',
          rating: 5,
          tag: 'First Date',
          comment: ''
        });
        loadFeedback();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error submitting review. Please retry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px' }}>
      {/* Header Banner */}
      <section style={{ padding: '3rem 0 2rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
            <Sparkles size={13} /> PATRON STORIES & RATINGS
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, marginBottom: '1rem' }}>
            Customer <span className="text-gradient">Love Wall</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Don't be shy. Tell us what made your date memorable or what made your tastebuds do a double take.
          </p>
        </div>
      </section>

      {/* Review Submission Form */}
      <section style={{ paddingBottom: '3.5rem' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="glass-card contact-form-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <MessageSquarePlus size={22} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Share Your Experience</h3>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Star Rating Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Your Overall Rating
                </label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || formData.rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: isFilled ? '#F59E0B' : 'var(--text-muted)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <Star size={28} fill={isFilled ? '#F59E0B' : 'none'} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Occasion Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Visit Occasion
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {OCCASION_TAGS.map((tag) => {
                    const isSelected = formData.tag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setFormData({ ...formData, tag })}
                        style={{
                          padding: '0.4rem 0.9rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          background: isSelected ? 'var(--accent-primary)' : 'var(--bg-input)',
                          color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                          border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Your Name / Couple Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ishaan & Ananya"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Review Comment */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Review Comment * (Minimum 10 characters)
                </label>
                <textarea
                  rows="3"
                  placeholder="What made your visit special? (The quiet candlelight booth, the cold brew, or that dessert you refused to share...)"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" loading={submitting} icon={Heart}>
                Post Review
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionHeading
            badge="COMMUNITY WALL"
            title="Guest"
            highlight="Reflections & Reviews"
            subtitle="Real feedback and memories shared by our patrons."
          />

          {loading ? (
            <LoadingSpinner message="Gathering customer feedback..." />
          ) : (
            <div
              className="testimonial-grid responsive-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {reviews.map((rev) => (
                <TestimonialCard key={rev.id} testimonial={rev} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FeedbackPage;
