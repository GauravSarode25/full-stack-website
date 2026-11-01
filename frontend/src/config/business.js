/**
 * CAFE LOVE BYTE — Business Information & Operational Configuration
 * 
 * Central, easy-to-update configuration for all business identity,
 * contact details, location, operational hours, and social media links.
 * 
 * Edit values below to update them across the entire website.
 */

export const businessName = "Cafe Love Byte";

export const tagline = "Where Every Bite Becomes a Memory";

// Configurable physical address placeholder
export const address = "Shop 12, Ground Floor, Linking Road, Bandra West, Mumbai, Maharashtra 400050";

// Configurable phone numbers
export const phone = "+91 98765 43210";
export const phoneDisplay = "+91 98765 43210";
export const whatsappNumber = "919876543210"; // Clean digits with country code for wa.me links

// Configurable email address
export const email = "hello@cafelovebyte.com";

// Configurable opening hours
export const openingHours = {
  weekdays: "Mon – Fri: 11:00 AM – 11:30 PM",
  weekends: "Sat – Sun: 10:30 AM – 12:00 Midnight",
  displaySummary: "Open Daily: 11:00 AM – 11:30 PM (Until Midnight on Weekends)"
};

// Configurable social media profiles
export const instagram = "https://instagram.com/cafelovebyte";
export const facebook = "https://facebook.com/cafelovebyte";
export const youtube = "https://youtube.com/@cafelovebyte";

// Configurable Google Maps navigation link
export const googleMapsUrl = "https://maps.google.com/?q=Cafe+Love+Byte";

// Consolidated configuration object
export const businessConfig = {
  businessName,
  tagline,
  address,
  phone,
  phoneDisplay,
  whatsappNumber,
  email,
  openingHours,
  instagram,
  facebook,
  youtube,
  googleMapsUrl
};

export default businessConfig;
