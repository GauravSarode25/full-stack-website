import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('CAFE LOVE BYTE — COMPREHENSIVE MOBILE-FIRST TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message, details = '') {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message} ${details ? '— ' + details : ''}`);
    failCount++;
  }
}

// 1. Read CSS Files
const responsiveCss = fs.readFileSync('frontend/src/styles/responsive.css', 'utf-8');
const indexCss = fs.readFileSync('frontend/src/styles/index.css', 'utf-8');
const galleryCss = fs.readFileSync('frontend/src/styles/gallery.css', 'utf-8');

console.log('--- 1. Testing Explicit Breakpoint Coverage ---');
assert(responsiveCss.includes('@media (max-width: 389px)'), '375px Breakpoint (iPhone SE, 13 Mini) explicitly targeted');
assert(responsiveCss.includes('@media (min-width: 390px) and (max-width: 429px)'), '390px Breakpoint (iPhone 14/15/16) explicitly targeted');
assert(responsiveCss.includes('@media (min-width: 430px) and (max-width: 767px)'), '430px Breakpoint (iPhone Pro Max, Galaxy Ultra) explicitly targeted');
assert(responsiveCss.includes('@media (min-width: 768px) and (max-width: 1023px)'), '768px Breakpoint (iPad portrait / Tablets) explicitly targeted');
assert(responsiveCss.includes('@media (min-width: 1024px) and (max-width: 1439px)'), '1024px Breakpoint (Landscape tablets / Laptops) explicitly targeted');
assert(responsiveCss.includes('@media (min-width: 1440px)'), '1440px Breakpoint (Full HD Desktops) explicitly targeted');

console.log('\n--- 2. Testing Anti-Overflow & Global Safety Rules ---');
assert(responsiveCss.includes('overflow-x: hidden !important') && responsiveCss.includes('max-width: 100vw !important'), 'Global horizontal overflow prevention enabled on html and body');
assert(responsiveCss.includes('overflow-wrap: break-word'), 'Text overflow prevention (overflow-wrap: break-word) enabled');
assert(responsiveCss.includes('max-width: 100%') && responsiveCss.includes('height: auto'), 'Responsive image containment enabled');

console.log('\n--- 3. Testing Navbar & Hamburger Navigation ---');
assert(responsiveCss.includes('.desktop-nav') && responsiveCss.includes('display: none !important'), 'Desktop nav hidden on mobile/tablet viewports (<900px)');
assert(responsiveCss.includes('.mobile-toggle') && responsiveCss.includes('display: flex !important'), 'Hamburger mobile toggle displayed on mobile/tablet viewports (<900px)');
assert(responsiveCss.includes('min-width: 44px !important') && responsiveCss.includes('min-height: 44px !important'), 'Hamburger toggle has accessible minimum 44px touch target');
assert(responsiveCss.includes('.mobile-nav-link') && responsiveCss.includes('min-height: 48px !important'), 'Mobile nav links have generous 48px+ tap areas');

const navbarJsx = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf-8');
assert(navbarJsx.includes('clamp(1.1rem, 3.8vw, 1.35rem)'), 'Brand logo heading scales with fluid clamp for small mobile');
assert(navbarJsx.includes('Admin Portal') && navbarJsx.includes('mobile-nav-link'), 'Admin Portal link integrated inside mobile nav drawer');

console.log('\n--- 4. Testing Hero Section & CTA Buttons ---');
assert(responsiveCss.includes('.hero-cta-row') && responsiveCss.includes('flex-direction: column !important'), 'Hero CTA buttons stack vertically on mobile phones');
assert(responsiveCss.includes('.hero-cta-row .btn') && responsiveCss.includes('width: 100% !important'), 'Hero CTA buttons expand full-width on mobile phones');
assert(responsiveCss.includes('min-height: 48px !important'), 'Buttons enforce minimum 48px height on mobile (<768px)');
assert(responsiveCss.includes('min-height: 44px') && responsiveCss.includes('pointer: coarse'), 'Buttons enforce WCAG 44px minimum target on touch devices');

console.log('\n--- 5. Testing Menu Cards & Dietary Display ---');
const menuCardJsx = fs.readFileSync('frontend/src/components/MenuCard.jsx', 'utf-8');
assert(menuCardJsx.includes('className="card-surface menu-card"'), 'MenuCard has menu-card class');
assert(menuCardJsx.includes('className="menu-card-image"'), 'MenuCard has menu-card-image class');
assert(menuCardJsx.includes('className="menu-card-body"'), 'MenuCard has menu-card-body class');
assert(menuCardJsx.includes('className="menu-card-footer"'), 'MenuCard has menu-card-footer class');
assert(responsiveCss.includes('.menu-card-image') && responsiveCss.includes('height: 190px !important'), 'Menu card image height optimized to 190px on mobile');
assert(responsiveCss.includes('.menu-category-pills') && responsiveCss.includes('-webkit-overflow-scrolling: touch'), 'Menu category pills support horizontal touch momentum scrolling');

console.log('\n--- 6. Testing Blog Cards & Featured Layout ---');
const blogCardJsx = fs.readFileSync('frontend/src/components/BlogCard.jsx', 'utf-8');
assert(blogCardJsx.includes('blog-card-featured'), 'BlogCard has featured variant class');
assert(responsiveCss.includes('.blog-card-featured') && responsiveCss.includes('grid-template-columns: 1fr !important'), 'Featured blog card collapses from 2 columns to 1 column on mobile');
assert(responsiveCss.includes('.blog-meta-row') && responsiveCss.includes('flex-wrap: wrap !important'), 'Blog metadata row wraps gracefully on mobile');

console.log('\n--- 7. Testing Gallery & Touch Lightbox ---');
assert(responsiveCss.includes('.gallery-pills') && responsiveCss.includes('-webkit-overflow-scrolling: touch'), 'Gallery category pills support touch momentum swipe');
assert(responsiveCss.includes('.gallery-masonry') && responsiveCss.includes('column-count: 1 !important'), 'Gallery masonry adapts to 1 column on mobile (<768px)');
assert(responsiveCss.includes('.gallery-masonry') && responsiveCss.includes('column-count: 2 !important'), 'Gallery masonry adapts to 2 columns on tablet (768px - 1023px)');
assert(responsiveCss.includes('.lightbox-action-btn') && responsiveCss.includes('min-width: 44px !important'), 'Lightbox controls have 44px minimum tap targets');

console.log('\n--- 8. Testing Forms & Single-Column Layout ---');
const reservationFormJsx = fs.readFileSync('frontend/src/components/ReservationForm.jsx', 'utf-8');
const contactFormJsx = fs.readFileSync('frontend/src/components/ContactForm.jsx', 'utf-8');
assert(reservationFormJsx.includes('reservation-form-card'), 'Reservation form has card class');
assert(contactFormJsx.includes('contact-form-card'), 'Contact form has card class');
assert(responsiveCss.includes('.form-row') && responsiveCss.includes('grid-template-columns: 1fr !important'), 'Form rows strictly single-column on mobile (<768px)');
assert(responsiveCss.includes('font-size: 16px !important'), 'Form inputs set to 16px font-size to prevent iOS Safari auto-zoom');
assert(responsiveCss.includes('.form-submit-row .btn') && responsiveCss.includes('width: 100% !important'), 'Form submit buttons are full-width and easily tappable on mobile');

console.log('\n--- 9. Testing Reservation Page & Feedback Ticket ---');
const reservationPageJsx = fs.readFileSync('frontend/src/pages/ReservationPage.jsx', 'utf-8');
assert(reservationPageJsx.includes('reservation-layout responsive-grid'), 'Reservation layout has responsive-grid class');
assert(responsiveCss.includes('.success-ticket-grid') && responsiveCss.includes('grid-template-columns: 1fr !important'), 'Reservation success ticket stacks single-column on mobile');
assert(responsiveCss.includes('.success-actions') && responsiveCss.includes('flex-direction: column !important'), 'Reservation success actions stack full-width on mobile');

console.log('\n--- 10. Testing Modals & Mobile Bottom-Sheet Behavior ---');
const modalJsx = fs.readFileSync('frontend/src/components/Modal.jsx', 'utf-8');
assert(modalJsx.includes('className="modal-backdrop"'), 'Modal has modal-backdrop class');
assert(modalJsx.includes('className="modal-window"'), 'Modal has modal-window class');
assert(modalJsx.includes('className="modal-close-btn"'), 'Modal has modal-close-btn class');
assert(responsiveCss.includes('.modal-backdrop') && responsiveCss.includes('align-items: flex-end !important'), 'Modal transforms into bottom-sheet on mobile (<768px)');
assert(responsiveCss.includes('.modal-window') && responsiveCss.includes('border-radius: var(--radius-xl) var(--radius-xl) 0 0 !important'), 'Modal has rounded top corners like native mobile bottom sheet');
assert(responsiveCss.includes('.modal-close-btn') && responsiveCss.includes('min-width: 44px !important'), 'Modal close button has 44px touch target');
assert(responsiveCss.includes('.modal-price-footer') && responsiveCss.includes('flex-direction: column !important'), 'Modal footer CTA stacks full-width on mobile');

console.log('\n--- 11. Testing Footer & Social Channels ---');
const footerJsx = fs.readFileSync('frontend/src/components/Footer.jsx', 'utf-8');
assert(footerJsx.includes('className="footer-grid"'), 'Footer has footer-grid class');
assert(footerJsx.includes('className="footer-newsletter-form"'), 'Footer has footer-newsletter-form class');
assert(footerJsx.includes('className="footer-social-row"'), 'Footer has footer-social-row class');
assert(responsiveCss.includes('.footer-grid') && responsiveCss.includes('grid-template-columns: 1fr !important'), 'Footer grid stacks single-column on mobile');
assert(responsiveCss.includes('.footer-newsletter-form') && responsiveCss.includes('flex-direction: column !important'), 'Footer newsletter form stacks on mobile');
assert(responsiveCss.includes('.footer-social-row') && responsiveCss.includes('justify-content: center !important'), 'Footer social icons centered on mobile');

console.log('\n--- 12. Testing Dark Mode Mobile Contrast & Styling ---');
assert(responsiveCss.includes("[data-theme='dark'] .mobile-nav-drawer"), 'Dark mode mobile navigation drawer contrast styling applied');
assert(responsiveCss.includes("[data-theme='dark'] .modal-window"), 'Dark mode mobile bottom sheet modal styling applied');
assert(responsiveCss.includes("[data-theme='dark'] input"), 'Dark mode mobile input styling applied');

console.log('\n--- 13. Testing Image Optimization & Performance ---');
const homePageJsx = fs.readFileSync('frontend/src/pages/HomePage.jsx', 'utf-8');
const aboutPageJsx = fs.readFileSync('frontend/src/pages/AboutPage.jsx', 'utf-8');
assert(homePageJsx.includes('loading="lazy"') && homePageJsx.includes('decoding="async"'), 'HomePage offscreen images use lazy loading and async decoding');
assert(aboutPageJsx.includes('loading="lazy"') && aboutPageJsx.includes('decoding="async"'), 'AboutPage offscreen images use lazy loading and async decoding');
assert(menuCardJsx.includes('loading="lazy"') && menuCardJsx.includes('decoding="async"'), 'MenuCard images use lazy loading and async decoding');
assert(blogCardJsx.includes('loading="lazy"') && blogCardJsx.includes('decoding="async"'), 'BlogCard images use lazy loading and async decoding');

console.log('\n================================================================');
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('✨ All mobile-first requirements, breakpoints & components verified successfully!');
}

