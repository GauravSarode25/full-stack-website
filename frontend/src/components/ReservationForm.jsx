import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  Heart,
  CheckCircle2,
  AlertCircle,
  Copy,
  Phone,
  Mail,
  User,
  MessageSquare
} from 'lucide-react';
import { createReservation } from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from './Button';
import { businessConfig } from '../config/business';

const OCCASIONS = [
  'Date',
  'Birthday',
  'Anniversary',
  'Friends Meetup',
  'Family',
  'Casual Dining',
  'Other'
];

const SEATING_OPTIONS = [
  { id: 'Indoor', title: 'Indoor', desc: 'Cozy air-conditioned main dining area' },
  { id: 'Private Space', title: 'Private Space', desc: 'Acoustic couple booth or secluded cabana' },
  { id: 'Outdoor', title: 'Outdoor', desc: 'Open sky terrace seating with fairy lights' },
  { id: 'No Preference', title: 'No Preference', desc: 'First available comfortable table' }
];

const TIME_OPTIONS = [
  '11:30 AM', '12:30 PM', '01:30 PM', '02:30 PM',
  '04:00 PM', '05:30 PM', '07:00 PM', '08:15 PM',
  '09:30 PM', '10:45 PM'
];

const ReservationForm = () => {
  const { addToast } = useToast();
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: todayStr,
    time: '07:00 PM',
    guests: 2,
    occasion: 'Date',
    seatingPreference: 'No Preference',
    specialRequest: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successReservation, setSuccessReservation] = useState(null);

  // Client-Side Validation
  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Valid email address is required';
    }
    if (!formData.date) {
      errors.date = 'Date is required';
    } else if (formData.date < todayStr) {
      errors.date = 'Date cannot be in the past';
    }
    if (!formData.time) {
      errors.time = 'Time is required';
    }
    if (!formData.guests || Number(formData.guests) < 1) {
      errors.guests = 'Number of guests must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please fix the highlighted form errors.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await createReservation({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        occasion: formData.occasion,
        seatingPreference: formData.seatingPreference,
        specialRequest: formData.specialRequest.trim()
      });

      if (res.data?.success) {
        setSuccessReservation(res.data.data);
        addToast("Reservation request submitted! We'll confirm shortly.", 'success');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to submit reservation. Please try again.';
      addToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (successReservation?.id) {
      navigator.clipboard.writeText(successReservation.id);
      addToast(`Reference Code ${successReservation.id} copied!`, 'info');
    }
  };

  return (
    <div
      className="card-surface reservation-form-card"
      style={{
        padding: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        position: 'relative'
      }}
    >
      <AnimatePresence mode="wait">
        {!successReservation ? (
          <motion.form
            key="reservation-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
          >
            {/* Form Header */}
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
                TABLE RESERVATION REQUEST
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                Reserve Your Experience
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
                Fill in your details below and our reservations team will confirm table availability.
              </p>
            </div>

            {/* Row 1: Name, Phone, Email */}
            <div
              className="form-row form-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Name *
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                  }}
                  style={{
                    borderColor: formErrors.name ? '#EF4444' : 'var(--border-subtle)'
                  }}
                />
                {formErrors.name && (
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                    {formErrors.name}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
                  }}
                  style={{
                    borderColor: formErrors.phone ? '#EF4444' : 'var(--border-subtle)'
                  }}
                />
                {formErrors.phone && (
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                    {formErrors.phone}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                  }}
                  style={{
                    borderColor: formErrors.email ? '#EF4444' : 'var(--border-subtle)'
                  }}
                />
                {formErrors.email && (
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                    {formErrors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: Date, Time, Guests */}
            <div
              className="form-row form-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Date * (Cannot be in the past)
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    if (formErrors.date) setFormErrors({ ...formErrors, date: null });
                  }}
                  style={{
                    borderColor: formErrors.date ? '#EF4444' : 'var(--border-subtle)'
                  }}
                />
                {formErrors.date && (
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                    {formErrors.date}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Time *
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => {
                    setFormData({ ...formData, time: e.target.value });
                    if (formErrors.time) setFormErrors({ ...formErrors, time: null });
                  }}
                  style={{
                    borderColor: formErrors.time ? '#EF4444' : 'var(--border-subtle)'
                  }}
                >
                  {TIME_OPTIONS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {formErrors.time && (
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                    {formErrors.time}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Number of Guests *
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.guests}
                  onChange={(e) => {
                    setFormData({ ...formData, guests: e.target.value });
                    if (formErrors.guests) setFormErrors({ ...formErrors, guests: null });
                  }}
                  style={{
                    borderColor: formErrors.guests ? '#EF4444' : 'var(--border-subtle)'
                  }}
                />
                {formErrors.guests && (
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                    {formErrors.guests}
                  </span>
                )}
              </div>
            </div>

            {/* Row 3: Occasion & Seating Preference */}
            <div
              className="form-row form-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Occasion
                </label>
                <select
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                >
                  {OCCASIONS.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Seating Preference
                </label>
                <select
                  value={formData.seatingPreference}
                  onChange={(e) => setFormData({ ...formData, seatingPreference: e.target.value })}
                >
                  {SEATING_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.title} ({opt.desc})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Special Request */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Special Request (Optional)
              </label>
              <textarea
                rows="3"
                placeholder="E.g., quiet corner for a date, cake arrangement, high chair..."
                value={formData.specialRequest}
                onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
              />
            </div>

            {/* Submit Action */}
            <div className="form-submit-row" style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <Button type="submit" size="lg" loading={loading} icon={CalendarCheck}>
                Lock In My Table
              </Button>
            </div>
          </motion.form>
        ) : (
          /* ===================================================================
              SUCCESS STATE (Transparent, Authentic Confirmation)
              =================================================================== */
          <motion.div
            key="reservation-success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: 'center',
              padding: '1.5rem 0'
            }}
          >
            {/* Heart Accent */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <Heart size={32} />
            </div>

            <h3
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}
            >
              You're on the list ❤️
            </h3>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                maxWidth: '480px',
                margin: '0 auto 1.75rem',
                lineHeight: 1.6
              }}
            >
              We've received your reservation request.<br />
              <strong>Our team will confirm your table shortly.</strong>
            </p>

            {/* Summary Ticket Box */}
            <div
              style={{
                maxWidth: '460px',
                margin: '0 auto 2rem',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Reference Request Code
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                    {successReservation.id || 'LB-REQ'}
                  </div>
                </div>

                <button
                  onClick={handleCopyCode}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: 'var(--color-accent)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={13} /> Copy
                </button>
              </div>

              <div className="success-ticket-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Guest Name:</span>
                  <strong>{successReservation.name || successReservation.fullName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Schedule:</span>
                  <strong>{successReservation.date} at {successReservation.time || successReservation.timeSlot}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Guests:</span>
                  <strong>{successReservation.guests || successReservation.guestsCount} Person(s)</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Seating:</span>
                  <strong>{successReservation.seatingPreference || successReservation.zone}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Occasion:</span>
                  <strong>{successReservation.occasion}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Status:</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                    ⏳ Awaiting Confirmation
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="success-actions" style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setSuccessReservation(null);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    date: todayStr,
                    time: '07:00 PM',
                    guests: 2,
                    occasion: 'Date',
                    seatingPreference: 'No Preference',
                    specialRequest: ''
                  });
                }}
              >
                Make Another Request
              </Button>

              <a
                href={`https://wa.me/${businessConfig.whatsappNumber || '919876543210'}?text=${encodeURIComponent(
                  `Hi ${businessConfig.businessName}! I just submitted reservation request ${successReservation.id || ''}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Message Us on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationForm;
