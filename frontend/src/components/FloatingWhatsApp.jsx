import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { businessConfig } from '../config/business';

const FloatingWhatsApp = () => {
  const whatsappUrl = `https://wa.me/${businessConfig.whatsappNumber || '919876543210'}?text=${encodeURIComponent(
    `Hi ${businessConfig.businessName}! I would like to inquire about a table reservation.`
  )}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Chat on WhatsApp"
      className="floating-whatsapp"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1.5rem',
        zIndex: 900,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
        cursor: 'pointer'
      }}
    >
      <MessageCircle size={28} />
    </motion.a>
  );
};

export default FloatingWhatsApp;
