import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  UtensilsCrossed,
  Heart,
  Users,
  Sparkles,
  SunMedium,
  LayoutGrid,
  Columns3,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Play,
  Pause,
  Share2,
  Download,
  Info,
  Camera,
  RotateCcw
} from 'lucide-react';
import { GALLERY_CATEGORIES, FALLBACK_GALLERY } from '../data/galleryData';
import { useToast } from '../context/ToastContext';

const CATEGORY_ICONS = {
  All: LayoutGrid,
  Cafe: Coffee,
  Food: UtensilsCrossed,
  Dates: Heart,
  Friends: Users,
  Celebrations: Sparkles,
  Ambience: SunMedium
};

const GalleryGrid = ({ items = [] }) => {
  const displayItems = items && items.length > 0 ? items : FALLBACK_GALLERY;
  const { addToast } = useToast();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState('masonry'); // 'masonry' | 'grid'
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  // Lightbox feature state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(true);

  // Touch gesture refs
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const thumbsContainerRef = useRef(null);
  const slideshowTimerRef = useRef(null);

  // Filter items based on Category and Search Query
  const filteredItems = displayItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'All' ||
      item.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  const activeImage = selectedImageIndex !== null ? filteredItems[selectedImageIndex] : null;

  // Handle image load
  const handleImageLoaded = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Lightbox Navigation Functions
  const goToNextImage = useCallback(() => {
    if (filteredItems.length === 0) return;
    setZoomLevel(1);
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      return (prevIndex + 1) % filteredItems.length;
    });
  }, [filteredItems.length]);

  const goToPrevImage = useCallback(() => {
    if (filteredItems.length === 0) return;
    setZoomLevel(1);
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      return (prevIndex - 1 + filteredItems.length) % filteredItems.length;
    });
  }, [filteredItems.length]);

  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null);
    setZoomLevel(1);
    setIsPlayingSlideshow(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Share photo
  const handleSharePhoto = async () => {
    if (!activeImage) return;
    const shareData = {
      title: activeImage.title,
      text: `${activeImage.title} at Cafe Love Byte`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(activeImage.image);
          addToast('Photo link copied to clipboard!', 'success');
        }
      }
    } else {
      navigator.clipboard.writeText(activeImage.image);
      addToast('Photo link copied to clipboard!', 'success');
    }
  };

  // Slideshow auto-play effect
  useEffect(() => {
    if (isPlayingSlideshow && selectedImageIndex !== null) {
      slideshowTimerRef.current = setInterval(() => {
        goToNextImage();
      }, 4000);
    } else {
      clearInterval(slideshowTimerRef.current);
    }
    return () => clearInterval(slideshowTimerRef.current);
  }, [isPlayingSlideshow, selectedImageIndex, goToNextImage]);

  // Keyboard Navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextImage();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevImage();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleResetZoom();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case ' ':
          e.preventDefault();
          setIsPlayingSlideshow((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, goToNextImage, goToPrevImage, closeLightbox]);

  // Mobile Touch Gestures (Swipe Left, Right, Down)
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartXRef.current;
    const diffY = touchEndY - touchStartYRef.current;

    const threshold = 45; // min pixels for swipe

    // Only swipe if zoom is at default 1x
    if (zoomLevel === 1) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX < 0) {
          goToNextImage(); // Swiped left -> next
        } else {
          goToPrevImage(); // Swiped right -> prev
        }
      } else if (diffY > 80 && Math.abs(diffX) < 40) {
        closeLightbox(); // Swiped down -> close modal
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Scroll active thumbnail into view
  useEffect(() => {
    if (selectedImageIndex !== null && thumbsContainerRef.current) {
      const activeThumb = thumbsContainerRef.current.children[selectedImageIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedImageIndex]);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  // Count items per category
  const getCategoryCount = (category) => {
    if (category === 'All') return displayItems.length;
    return displayItems.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    ).length;
  };

  return (
    <div>
      {/* Controls Bar: Categories & Layout Mode */}
      <div className="gallery-controls-bar">
        {/* Category Pills */}
        <div className="gallery-pills" role="tablist" aria-label="Gallery category filters">
          {GALLERY_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category] || Sparkles;
            const count = getCategoryCount(category);
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveCategory(category);
                  setSelectedImageIndex(null);
                }}
                className={`gallery-pill-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                <span>{category}</span>
                <span className="gallery-pill-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Layout Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Quick Search */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              minWidth: '200px'
            }}
          >
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search pizza, coffee, dates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.45rem 2rem 0.45rem 2.25rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                width: '100%'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  color: 'var(--text-muted)',
                  display: 'flex'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View Switcher: Masonry vs Grid */}
          <div className="gallery-view-toggle">
            <button
              onClick={() => setLayoutMode('masonry')}
              className={`gallery-view-btn ${layoutMode === 'masonry' ? 'active' : ''}`}
              title="Masonry View"
            >
              <Columns3 size={15} />
              <span style={{ display: 'none', md: 'inline' }}>Masonry</span>
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              className={`gallery-view-btn ${layoutMode === 'grid' ? 'active' : ''}`}
              title="Balanced Grid View"
            >
              <LayoutGrid size={15} />
              <span style={{ display: 'none', md: 'inline' }}>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Feedback if No Results */}
      {filteredItems.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Camera size={44} style={{ color: 'var(--color-primary)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No snapshots match your search</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Try searching for something else or view all categories.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="btn btn-primary"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Masonry / Balanced Responsive Gallery */}
      {filteredItems.length > 0 && (
        <div className={layoutMode === 'masonry' ? 'gallery-masonry' : 'gallery-balanced-grid'}>
          {filteredItems.map((item, index) => {
            const isLoaded = loadedImages[item.id];
            const aspectClass = item.aspect ? `aspect-${item.aspect}` : 'aspect-square';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
                className={layoutMode === 'masonry' ? 'gallery-masonry-card' : 'gallery-balanced-card'}
                onClick={() => setSelectedImageIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelectedImageIndex(index);
                }}
                aria-label={`View full photo: ${item.title}`}
              >
                {/* Image Wrapper with Shimmer Skeleton */}
                <div
                  className={`gallery-image-wrapper ${aspectClass}`}
                  style={{
                    height: layoutMode === 'grid' ? '100%' : 'auto'
                  }}
                >
                  {!isLoaded && <div className="gallery-skeleton" />}
                  <img
                    src={item.image}
                    alt={item.alt || item.title}
                    loading="lazy"
                    onLoad={() => handleImageLoaded(item.id)}
                    className={`gallery-img ${isLoaded ? 'loaded' : ''}`}
                    style={{
                      height: layoutMode === 'grid' ? '100%' : '100%'
                    }}
                  />

                  {/* Category Badge Pill */}
                  <span className="gallery-card-badge">{item.category}</span>

                  {/* Hover Quick Zoom Button */}
                  <div className="gallery-card-zoom-btn" title="Expand Photo">
                    <ZoomIn size={16} />
                  </div>

                  {/* Aesthetic Gradient & Text Overlay */}
                  <div className="gallery-card-content">
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--color-accent)',
                        letterSpacing: '0.08em',
                        marginBottom: '0.2rem'
                      }}
                    >
                      {item.category}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.caption}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImageIndex !== null && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lightbox-backdrop"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar: Title, Counter & Action Controls */}
            <div className="lightbox-header">
              <div className="lightbox-title-area">
                <span className="lightbox-counter-badge">
                  {selectedImageIndex + 1} / {filteredItems.length}
                </span>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#DDD2D7'
                  }}
                >
                  {activeImage.category}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="lightbox-actions">
                {/* Auto-Slideshow */}
                <button
                  onClick={() => setIsPlayingSlideshow((prev) => !prev)}
                  className={`lightbox-action-btn ${isPlayingSlideshow ? 'active' : ''}`}
                  title={isPlayingSlideshow ? 'Pause Slideshow (Space)' : 'Play Slideshow (Space)'}
                >
                  {isPlayingSlideshow ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* Zoom Out */}
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="lightbox-action-btn"
                  style={{ opacity: zoomLevel <= 1 ? 0.45 : 1 }}
                  title="Zoom Out (-)"
                >
                  <ZoomOut size={18} />
                </button>

                {/* Zoom In */}
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="lightbox-action-btn"
                  style={{ opacity: zoomLevel >= 3 ? 0.45 : 1 }}
                  title="Zoom In (+)"
                >
                  <ZoomIn size={18} />
                </button>

                {/* Reset Zoom */}
                {zoomLevel > 1 && (
                  <button
                    onClick={handleResetZoom}
                    className="lightbox-action-btn"
                    title="Reset Zoom (0)"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}

                {/* Info Drawer Toggle */}
                <button
                  onClick={() => setShowInfoDrawer((prev) => !prev)}
                  className={`lightbox-action-btn ${showInfoDrawer ? 'active' : ''}`}
                  title="Toggle Visual Details"
                >
                  <Info size={18} />
                </button>

                {/* Share Photo */}
                <button
                  onClick={handleSharePhoto}
                  className="lightbox-action-btn"
                  title="Share or Copy Link"
                >
                  <Share2 size={18} />
                </button>

                {/* High-Res View / Download */}
                <a
                  href={activeImage.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lightbox-action-btn"
                  title="View Original High-Res"
                >
                  <Download size={18} />
                </a>

                {/* Fullscreen Toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="lightbox-action-btn"
                  title="Toggle Fullscreen (F)"
                >
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>

                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="lightbox-action-btn close-btn"
                  title="Close Lightbox (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Slideshow Progress Indicator Bar */}
            {isPlayingSlideshow && (
              <motion.div
                key={selectedImageIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 4, ease: 'linear' }}
                style={{
                  height: '3px',
                  background: 'var(--color-accent)',
                  position: 'absolute',
                  top: '64px',
                  left: 0,
                  zIndex: 1001
                }}
              />
            )}

            {/* Stage: Previous / Main Image / Next */}
            <div className="lightbox-stage">
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                className="lightbox-nav-btn prev"
                aria-label="Previous photo (Left Arrow)"
              >
                <ChevronLeft size={28} />
              </button>

              {/* High-Resolution Main Photo */}
              <div
                className="lightbox-image-container"
                onClick={(e) => {
                  // Clicking outside image closes, clicking on image zooms
                  if (e.target === e.currentTarget) {
                    closeLightbox();
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage.id}
                    src={activeImage.image}
                    alt={activeImage.alt || activeImage.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: zoomLevel }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
                    className="lightbox-main-img"
                    style={{
                      cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in',
                      transformOrigin: 'center center'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (zoomLevel === 1) {
                        setZoomLevel(1.8);
                      } else {
                        setZoomLevel(1);
                      }
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="lightbox-nav-btn next"
                aria-label="Next photo (Right Arrow)"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Bottom Bar: Captions & Thumbnails Strip */}
            <div className="lightbox-bottom-bar">
              {showInfoDrawer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="lightbox-info-details"
                >
                  <div className="lightbox-info-text">
                    <h2 className="lightbox-info-title">{activeImage.title}</h2>
                    <p className="lightbox-info-desc">{activeImage.caption}</p>
                    {activeImage.alt && (
                      <span className="lightbox-info-alt">
                        <Camera size={13} />
                        <span>{activeImage.alt}</span>
                      </span>
                    )}
                  </div>

                  {activeImage.tags && activeImage.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {activeImage.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(255, 255, 255, 0.12)',
                            color: '#FFFFFF'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Thumbnails Ribbon */}
              <div className="lightbox-thumbs-strip" ref={thumbsContainerRef}>
                {filteredItems.map((thumb, idx) => (
                  <div
                    key={thumb.id}
                    onClick={() => {
                      setZoomLevel(1);
                      setSelectedImageIndex(idx);
                    }}
                    className={`lightbox-thumb-item ${idx === selectedImageIndex ? 'active' : ''}`}
                    title={thumb.title}
                  >
                    <img src={thumb.image} alt={thumb.title} loading="lazy" />
                  </div>
                ))}
              </div>

              {/* Desktop Keyboard Helper Hint */}
              <div className="lightbox-keyboard-hint">
                <span>
                  <kbd>←</kbd> <kbd>→</kbd> Navigate
                </span>
                <span>
                  <kbd>Space</kbd> Slideshow
                </span>
                <span>
                  <kbd>+</kbd> <kbd>-</kbd> Zoom
                </span>
                <span>
                  <kbd>F</kbd> Fullscreen
                </span>
                <span>
                  <kbd>Esc</kbd> Close
                </span>
                <span>
                  Swipe left/right on mobile
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
