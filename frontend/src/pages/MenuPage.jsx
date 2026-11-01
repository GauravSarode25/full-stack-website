import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  CalendarCheck,
  Coffee,
  X,
  Sparkles,
  Flame,
  ArrowRight,
  Heart
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import MenuCard from '../components/MenuCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { fetchMenuItems } from '../services/api';
import { initialMenuItems } from '../../../backend/data/seedData';

const MENU_CATEGORIES = [
  'All',
  'Starters',
  'Burgers',
  'Pizza',
  'Pasta',
  'Wraps',
  'Desserts',
  'Beverages'
];

const MenuPage = () => {
  const [items, setItems] = useState(initialMenuItems);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [maxPrice, setMaxPrice] = useState(350);
  const [sortBy, setSortBy] = useState('featured');

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lovebyte_favorites') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleFavUpdate = () => {
      try {
        setFavorites(JSON.parse(localStorage.getItem('lovebyte_favorites') || '[]'));
      } catch {}
    };
    window.addEventListener('favorites-updated', handleFavUpdate);
    return () => window.removeEventListener('favorites-updated', handleFavUpdate);
  }, []);

  useEffect(() => {
    const loadMenuFromApi = async () => {
      try {
        const res = await fetchMenuItems();
        if (res.data?.success && res.data.data?.length > 0) {
          setItems(res.data.data);
        }
      } catch (err) {
        // Fallback to initialMenuItems
      } finally {
        setLoading(false);
      }
    };
    loadMenuFromApi();
  }, []);

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category Filter
      if (selectedCategory !== 'All' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Dietary Filter
      if (dietFilter === 'veg' && !item.isVeg) return false;
      if (dietFilter === 'non-veg' && item.isVeg) return false;

      // Popular Filter
      if (onlyPopular && !item.isPopular) return false;

      // Saved Favorites Filter
      if (showOnlyFavorites && !favorites.includes(item.id)) return false;

      // Price Range Filter
      if (item.price > maxPrice) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        const matchesIng = item.ingredients?.some((ing) => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesIng) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return 0;
    });
  }, [items, selectedCategory, dietFilter, onlyPopular, showOnlyFavorites, favorites, maxPrice, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setDietFilter('all');
    setOnlyPopular(false);
    setShowOnlyFavorites(false);
    setMaxPrice(350);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      <SEO
        title="Cafe Love Byte Menu | Food, Drinks & Desserts"
        description="Explore the Cafe Love Byte menu featuring artisanal sourdough pizzas, gourmet burgers, pasta bowls, decadent desserts, and specialty coffees."
        canonical="/menu"
      />

      {/* ===================================================================
          HERO BANNER
          =================================================================== */}
      <section
        style={{
          padding: '4.5rem 0 2.5rem',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem', letterSpacing: '0.08em' }}>
            <Sparkles size={13} style={{ display: 'inline', marginRight: '4px' }} /> CRAVINGS DON'T WAIT.
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              marginBottom: '1rem'
            }}
          >
            The Cafe <span className="text-serif-italic text-gradient">Menu</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Cravings don't wait. Freshly prepared starters, artisanal sourdough pizzas, gourmet burgers, pasta bowls, wraps, desserts, and signature cold brews.
          </p>
        </div>
      </section>

      {/* ===================================================================
          FILTER & CONTROLS TOOLBAR
          =================================================================== */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div
            className="card-surface"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}
          >
            {/* Top Row: Search Bar & Sorting */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  placeholder="Search for Tacos, Burgers, Pizza, Pasta, Coffee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.75rem' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  Sort By:
                </label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured / Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Popular First</option>
                </select>
              </div>
            </div>

            {/* Middle Row: Category Navigation Pills */}
            <div
              className="menu-category-pills"
              style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                paddingTop: '1.25rem'
              }}
            >
              {MENU_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.55rem 1.25rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      background: isSelected ? 'var(--color-primary)' : 'var(--bg-input)',
                      color: isSelected ? 'var(--color-primary-text)' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Bottom Row: Dietary Toggles & Price Range Slider */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem'
              }}
            >
              {/* Dietary, Popular & Saved Filter Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  onClick={() => { setDietFilter('all'); setShowOnlyFavorites(false); }}
                  className={`btn ${dietFilter === 'all' && !showOnlyFavorites ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  All Food
                </button>

                <button
                  onClick={() => { setDietFilter(dietFilter === 'veg' ? 'all' : 'veg'); setShowOnlyFavorites(false); }}
                  className={`btn ${dietFilter === 'veg' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  🌱 Vegetarian
                </button>

                <button
                  onClick={() => { setDietFilter(dietFilter === 'non-veg' ? 'all' : 'non-veg'); setShowOnlyFavorites(false); }}
                  className={`btn ${dietFilter === 'non-veg' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  🍗 Non-Vegetarian
                </button>

                <button
                  onClick={() => { setOnlyPopular(!onlyPopular); setShowOnlyFavorites(false); }}
                  className={`btn ${onlyPopular ? 'btn-gold' : 'btn-secondary'}`}
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  ⭐ Popular
                </button>

                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`btn ${showOnlyFavorites ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Heart size={13} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
                  <span>Saved ({favorites.length})</span>
                </button>
              </div>

              {/* Price Range Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  Max Price: <strong>₹{maxPrice}</strong>
                </span>
                <input
                  type="range"
                  min="150"
                  max="350"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* ===================================================================
              MENU CARDS GRID & EMPTY STATES
              =================================================================== */}
          {loading ? (
            <LoadingSpinner message="Loading delicious menu items..." />
          ) : filteredItems.length === 0 ? (
            <div
              className="card-surface"
              style={{
                textAlign: 'center',
                padding: '4.5rem 1.75rem',
                borderRadius: 'var(--radius-xl)'
              }}
            >
              {showOnlyFavorites ? (
                <>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(225, 29, 72, 0.12)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem'
                    }}
                  >
                    <Heart size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                    Nothing saved yet. That's a little suspicious.
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.96rem', maxWidth: '480px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                    Surely something on this menu is tempting you. Tap the heart on any dish card to bookmark your cravings for later.
                  </p>
                  <button onClick={() => setShowOnlyFavorites(false)} className="btn btn-primary">
                    Show Me Everything
                  </button>
                </>
              ) : searchQuery.trim() ? (
                <>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(217, 164, 65, 0.12)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem'
                    }}
                  >
                    <Coffee size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                    Your search broke our heart. Try something else.
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.96rem', maxWidth: '480px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                    We cook up some pretty wild recipes, but "{searchQuery}" isn't in our kitchen today. Try a different keyword or reset your search.
                  </p>
                  <button onClick={handleResetFilters} className="btn btn-primary">
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(225, 29, 72, 0.12)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem'
                    }}
                  >
                    <Flame size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                    No dishes match this combination.
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.96rem', maxWidth: '480px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                    Your taste is exceptionally specific! Try adjusting the price limit or resetting the category filter.
                  </p>
                  <button onClick={handleResetFilters} className="btn btn-primary">
                    Reset All Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
                </span>
                {(selectedCategory !== 'All' || dietFilter !== 'all' || onlyPopular || showOnlyFavorites || maxPrice < 350 || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div
                className="menu-grid responsive-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.75rem'
                }}
              >
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================
          BOTTOM CTA BANNER — STOP PLANNING. START EATING.
          =================================================================== */}
      <section
        style={{
          position: 'relative',
          padding: '5.5rem 0',
          backgroundColor: 'var(--bg-secondary)',
          textAlign: 'center',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: '4rem'
        }}
      >
        <div className="container" style={{ maxWidth: '680px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem', letterSpacing: '0.08em' }}>
            READY FOR YOUR BITE?
          </span>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: '1rem'
            }}
          >
            STOP PLANNING. <span className="text-serif-italic text-gradient">START EATING.</span>
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2rem'
            }}
          >
            Group reunions, quiet candlelit dates, or emergency pizza cravings. Reserve your table now and skip the waiting lounge.
          </p>

          <Link
            to="/reservation"
            className="btn btn-primary"
            style={{
              padding: '0.95rem 2.4rem',
              fontSize: '1rem'
            }}
          >
            <CalendarCheck size={18} />
            <span>Book a Table</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
