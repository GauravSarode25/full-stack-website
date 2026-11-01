import React, { useState } from 'react';
import { Star, Heart, Clock, Flame, Eye, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Modal from './Modal';

const MenuCard = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('lovebyte_favorites') || '[]');
      return favs.includes(item.id);
    } catch {
      return false;
    }
  });
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();

  const toggleFavorite = (e) => {
    e.stopPropagation();
    try {
      const favs = JSON.parse(localStorage.getItem('lovebyte_favorites') || '[]');
      let updated;
      if (favs.includes(item.id)) {
        updated = favs.filter((id) => id !== item.id);
        setIsFavorite(false);
        addToast(`Removed "${item.name}" from your cravings`, 'info');
      } else {
        updated = [...favs, item.id];
        setIsFavorite(true);
        addToast(`Added "${item.name}" to your cravings ❤️`, 'success');
      }
      localStorage.setItem('lovebyte_favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('favorites-updated'));
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  return (
    <>
      <div
        className="card-surface menu-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          height: '100%',
          position: 'relative'
        }}
      >
        {/* Image Container */}
        <div
          className="menu-card-image"
          style={{
            position: 'relative',
            height: '210px',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />

          {/* Badges Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-non-veg'}`}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: item.isVeg ? '#059669' : '#E11D48'
                }}
              />
              {item.isVeg ? 'Veg' : 'Non-Veg'}
            </span>

            {item.isPopular && (
              <span className="badge badge-gold">
                Popular
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            aria-label="Add to wishlist"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '38px',
              height: '38px',
              minWidth: '38px',
              minHeight: '38px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(21, 17, 19, 0.55)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isFavorite ? '#E11D48' : '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Heart size={18} fill={isFavorite ? '#E11D48' : 'none'} />
          </button>
        </div>

        {/* Card Body */}
        <div
          className="menu-card-body"
          style={{
            padding: '1.4rem',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'space-between'
          }}
        >
          <div>
            {/* Category & Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}
            >
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, fontSize: '0.72rem', color: 'var(--color-accent)' }}>
                {item.subCategory || item.category}
              </span>
              {item.rating ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                  <Star size={13} fill="currentColor" />
                  <span>{item.rating}</span>
                </div>
              ) : item.isPopular ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.72rem' }}>
                  <Sparkles size={12} />
                  <span>Popular</span>
                </div>
              ) : item.prepTime ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  <Clock size={12} />
                  <span>{item.prepTime}</span>
                </div>
              ) : null}
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '0.45rem',
                color: 'var(--text-primary)',
                lineHeight: 1.3
              }}
            >
              {item.name}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                marginBottom: '1rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {item.description}
            </p>
          </div>

          {/* Footer / Price & Details button */}
          <div
            className="menu-card-footer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '0.9rem',
              marginTop: '0.35rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Price</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                ₹{item.price}
              </span>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="btn btn-secondary"
              style={{
                minHeight: '40px',
                padding: '0.5rem 1rem',
                fontSize: '0.84rem'
              }}
            >
              <Eye size={14} />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={item.name}>
        <div>
          <div className="modal-content-image" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '240px', marginBottom: '1.25rem' }}>
            <img src={item.image} alt={item.name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-non-veg'}`}>
              {item.isVeg ? '100% Pure Vegetarian' : 'Non-Vegetarian'}
            </span>
            {item.calories && (
              <span className="badge badge-primary">
                <Flame size={12} /> {item.calories}
              </span>
            )}
            {item.prepTime && (
              <span className="badge badge-gold">
                <Clock size={12} /> {item.prepTime}
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            {item.description}
          </p>

          {item.ingredients && item.ingredients.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ingredients:</h5>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {item.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '0.25rem 0.7rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    • {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            className="modal-price-footer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.25rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Portion Price</span>
              <h4 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', fontWeight: 800 }}>
                ₹{item.price}
              </h4>
            </div>
            <button
              onClick={() => {
                setShowModal(false);
                addToast(`Order request noted for "${item.name}"`, 'success');
              }}
              className="btn btn-primary"
              style={{ minHeight: '44px' }}
            >
              Order At Table
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MenuCard;
