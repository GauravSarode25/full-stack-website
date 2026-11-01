import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import {
  initialMenuItems,
  initialBlogPosts,
  initialGallery,
  initialTestimonials,
  initialReservations
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Initialize in-memory cache
let dataStore = {
  menuItems: [],
  blogPosts: [],
  gallery: [],
  testimonials: [],
  reservations: [],
  contactMessages: [],
  users: []
};

// Seed admin user
const createDefaultAdmin = async () => {
  const hashedPassword = await bcrypt.hash('LoveByteAdmin@2026', 10);
  return {
    id: 'user-admin-1',
    name: 'Cafe Love Byte Admin',
    email: 'admin@cafelovebyte.com',
    role: 'admin',
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
};

export const initStorage = async () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, 'utf-8');
      dataStore = JSON.parse(fileData);
      console.log('✅ Local storage loaded from db.json');
    } else {
      const admin = await createDefaultAdmin();
      dataStore = {
        menuItems: initialMenuItems,
        blogPosts: initialBlogPosts,
        gallery: initialGallery,
        testimonials: initialTestimonials,
        reservations: initialReservations,
        contactMessages: [
          {
            id: 'msg-1',
            fullName: 'Riya Sen',
            email: 'riya.sen@example.com',
            phone: '+91 98765 00000',
            subject: 'Event Booking Inquiry',
            message: 'Hi, we would like to book the private terrace for a group of 15 for an acoustic music evening next month.',
            status: 'New',
            createdAt: new Date().toISOString()
          }
        ],
        users: [admin]
      };
      saveToDisk();
      console.log('🌱 Seed data initialized and saved to db.json');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

const saveToDisk = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dataStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
};

// CRUD Operations
export const storage = {
  // Menu
  getMenuItems: () => dataStore.menuItems,
  getMenuItemById: (id) => dataStore.menuItems.find((item) => item.id === id),
  addMenuItem: (item) => {
    const newItem = { id: `menu-${Date.now()}`, ...item };
    dataStore.menuItems.push(newItem);
    saveToDisk();
    return newItem;
  },
  updateMenuItem: (id, updates) => {
    const idx = dataStore.menuItems.findIndex((item) => item.id === id);
    if (idx !== -1) {
      dataStore.menuItems[idx] = { ...dataStore.menuItems[idx], ...updates };
      saveToDisk();
      return dataStore.menuItems[idx];
    }
    return null;
  },
  deleteMenuItem: (id) => {
    const idx = dataStore.menuItems.findIndex((item) => item.id === id);
    if (idx !== -1) {
      const deleted = dataStore.menuItems.splice(idx, 1)[0];
      saveToDisk();
      return deleted;
    }
    return null;
  },

  // Reservations
  getReservations: () => dataStore.reservations,
  getReservationById: (id) => dataStore.reservations.find((r) => r.id === id),
  addReservation: (resData) => {
    const bookingCode = `LB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation = {
      id: bookingCode,
      ...resData,
      status: resData.status || 'pending',
      createdAt: new Date().toISOString()
    };
    dataStore.reservations.unshift(newReservation);
    saveToDisk();
    return newReservation;
  },
  updateReservationStatus: (id, status) => {
    const res = dataStore.reservations.find((r) => r.id === id);
    if (res) {
      res.status = status;
      saveToDisk();
      return res;
    }
    return null;
  },
  deleteReservation: (id) => {
    const idx = dataStore.reservations.findIndex((r) => r.id === id);
    if (idx !== -1) {
      const deleted = dataStore.reservations.splice(idx, 1)[0];
      saveToDisk();
      return deleted;
    }
    return null;
  },

  toggleMenuItemAvailability: (id) => {
    const item = dataStore.menuItems.find((m) => m.id === id);
    if (item) {
      item.isAvailable = item.isAvailable === false ? true : false;
      saveToDisk();
      return item;
    }
    return null;
  },

  // Contact
  getContactMessages: () => dataStore.contactMessages,
  addContactMessage: (msgData) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      ...msgData,
      status: msgData.status || 'Unread',
      createdAt: new Date().toISOString()
    };
    dataStore.contactMessages.unshift(newMsg);
    saveToDisk();
    return newMsg;
  },
  markContactRead: (id) => {
    const msg = dataStore.contactMessages.find((m) => m.id === id);
    if (msg) {
      msg.status = 'Read';
      saveToDisk();
      return msg;
    }
    return null;
  },
  updateContactStatus: (id, status) => {
    const msg = dataStore.contactMessages.find((m) => m.id === id);
    if (msg) {
      msg.status = status;
      saveToDisk();
      return msg;
    }
    return null;
  },
  deleteContactMessage: (id) => {
    const idx = dataStore.contactMessages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      const deleted = dataStore.contactMessages.splice(idx, 1)[0];
      saveToDisk();
      return deleted;
    }
    return null;
  },

  // Feedback & Testimonials
  getTestimonials: () => dataStore.testimonials,
  addTestimonial: (feedbackData) => {
    const newFeedback = {
      id: `rev-${Date.now()}`,
      ...feedbackData,
      verified: true,
      createdAt: new Date().toISOString(),
      date: 'Just now',
      avatar: feedbackData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop`
    };
    dataStore.testimonials.unshift(newFeedback);
    saveToDisk();
    return newFeedback;
  },

  // Blogs
  getBlogPosts: () => dataStore.blogPosts,
  getBlogPostBySlug: (slug) => dataStore.blogPosts.find((b) => b.slug === slug || b.id === slug),
  addBlogPost: (blogData) => {
    const titleSlug = blogData.title
      ? blogData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      : `post-${Date.now()}`;
    const newPost = {
      id: `blog-${Date.now()}`,
      slug: blogData.slug || titleSlug,
      title: blogData.title || 'Untitled Post',
      excerpt: blogData.excerpt || '',
      content: blogData.content || '',
      category: blogData.category || 'Lifestyle & Dates',
      author: blogData.author || 'Cafe Love Byte Team',
      readTime: blogData.readTime || '4 min read',
      coverImage: blogData.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      tags: blogData.tags || ['Dates', 'Vibe'],
      featured: blogData.featured || false,
      isPublished: blogData.isPublished !== undefined ? blogData.isPublished : true,
      createdAt: new Date().toISOString()
    };
    dataStore.blogPosts.unshift(newPost);
    saveToDisk();
    return newPost;
  },
  updateBlogPost: (id, updates) => {
    const idx = dataStore.blogPosts.findIndex((b) => b.id === id || b.slug === id);
    if (idx !== -1) {
      dataStore.blogPosts[idx] = { ...dataStore.blogPosts[idx], ...updates };
      saveToDisk();
      return dataStore.blogPosts[idx];
    }
    return null;
  },
  deleteBlogPost: (id) => {
    const idx = dataStore.blogPosts.findIndex((b) => b.id === id || b.slug === id);
    if (idx !== -1) {
      const deleted = dataStore.blogPosts.splice(idx, 1)[0];
      saveToDisk();
      return deleted;
    }
    return null;
  },
  togglePublishBlogPost: (id) => {
    const post = dataStore.blogPosts.find((b) => b.id === id || b.slug === id);
    if (post) {
      post.isPublished = post.isPublished === false ? true : false;
      saveToDisk();
      return post;
    }
    return null;
  },

  // Gallery
  getGallery: () => dataStore.gallery,

  // Users / Admin
  findUserByEmail: (email) => dataStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  getUserById: (id) => dataStore.users.find((u) => u.id === id)
};
