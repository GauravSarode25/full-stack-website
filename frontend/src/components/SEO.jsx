import React, { useEffect } from 'react';
import { businessConfig } from '../config/business';

const BASE_URL = 'https://cafelovebyte.com';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop';

/**
 * Generate LocalBusiness structured data (Schema.org) using verified configurable business information.
 * Explicitly excludes unverified ratings or fake reviews.
 */
export const getLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'CafeOrCoffeeShop'],
    '@id': `${BASE_URL}/#restaurant`,
    'name': businessConfig.businessName,
    'legalName': businessConfig.businessName,
    'description': `${businessConfig.businessName} is a couple-friendly and group-friendly modern café offering specialty coffee, sourdough pizzas, artisanal burgers, private celebration cabanas, and romantic candlelight dining.`,
    'url': BASE_URL,
    'telephone': businessConfig.phone,
    'email': businessConfig.email,
    'hasMap': businessConfig.googleMapsUrl,
    'image': [
      DEFAULT_IMAGE,
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop'
    ],
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': businessConfig.address,
      'addressLocality': 'Mumbai',
      'addressRegion': 'Maharashtra',
      'postalCode': '400050',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 19.0600,
      'longitude': 72.8339
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '11:00',
        'closes': '23:30'
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Saturday', 'Sunday'],
        'opens': '10:30',
        'closes': '00:00'
      }
    ],
    'servesCuisine': ['Cafe', 'Specialty Coffee', 'Continental', 'Italian', 'Burgers', 'Desserts'],
    'priceRange': '₹₹',
    'acceptsReservations': 'True',
    'paymentAccepted': 'Cash, Credit Card, UPI, Debit Card',
    'currenciesAccepted': 'INR',
    'sameAs': [
      businessConfig.instagram,
      businessConfig.facebook,
      businessConfig.youtube
    ]
  };
};

const SEO = ({
  title,
  description,
  canonical = '',
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schema = null,
  includeLocalBusiness = false
}) => {
  const fullTitle = title || `${businessConfig.businessName} | Dates, Food & Good Vibes`;
  const canonicalUrl = canonical.startsWith('http')
    ? canonical
    : `${BASE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attribute, attrValue, content) => {
      let tag = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 2. Primary Meta Tags
    setMetaTag('name', 'description', description);

    // 3. Open Graph Tags
    setMetaTag('property', 'og:site_name', businessConfig.businessName);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);

    // 4. Twitter / X Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Structured Data
    const structuredData = [];
    if (includeLocalBusiness) {
      structuredData.push(getLocalBusinessSchema());
    }
    if (schema) {
      if (Array.isArray(schema)) {
        structuredData.push(...schema);
      } else {
        structuredData.push(schema);
      }
    }

    let scriptTag = document.getElementById('seo-structured-data');
    if (structuredData.length > 0) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'seo-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(
        structuredData.length === 1 ? structuredData[0] : structuredData
      );
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Keep state clean on unmount
    };
  }, [fullTitle, description, canonicalUrl, ogImage, ogType, schema, includeLocalBusiness]);

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:site_name" content={businessConfig.businessName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {includeLocalBusiness && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessSchema()) }}
        />
      )}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
};

export default SEO;
