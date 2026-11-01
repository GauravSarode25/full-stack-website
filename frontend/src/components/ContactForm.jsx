import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, Mail, Phone, User, HelpCircle } from 'lucide-react';
import { submitContact } from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from './Button';

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Table Reservation Assistance',
  'Private Cabana / Event Booking',
  'Dietary & Menu Inquiries',
  'Collaborations & Acoustic Music',
  'Feedback / Compliment',
  'Other'
];

const ContactForm = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Valid email address is required';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please fill in the required fields correctly.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        message: formData.message.trim()
      });

      if (res.data?.success) {
        setSubmitted(true);
        addToast("Message received. We'll get back to you soon.", 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error submitting message. Please retry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-surface contact-form-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="contact-success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '2rem 1rem' }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <CheckCircle2 size={30} />
            </div>

            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.4rem'
              }}
            >
              Message received.
            </h3>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                marginBottom: '2rem',
                lineHeight: 1.6
              }}
            >
              We'll be in touch before your coffee gets cold.
            </p>

            <Button
              variant="secondary"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  subject: 'General Inquiry',
                  message: ''
                });
              }}
            >
              Send Another Message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="contact-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                DIRECT INQUIRY
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Send Us a Message</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Have a question or request? Fill out the form below.
              </p>
            </div>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
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

            {/* Email & Phone Grid */}
            <div className="form-row form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
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

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                {SUBJECT_OPTIONS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                Message *
              </label>
              <textarea
                rows="4"
                placeholder="How can we help make your visit or event special?"
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (formErrors.message) setFormErrors({ ...formErrors, message: null });
                }}
                style={{
                  borderColor: formErrors.message ? '#EF4444' : 'var(--border-subtle)'
                }}
              />
              {formErrors.message && (
                <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.2rem', display: 'block' }}>
                  {formErrors.message}
                </span>
              )}
            </div>

            <div className="form-submit-row" style={{ marginTop: '0.5rem' }}>
              <Button type="submit" size="lg" loading={loading} icon={Send} style={{ width: '100%', justifyContent: 'center' }}>
                Send Message
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
