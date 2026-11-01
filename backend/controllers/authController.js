import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { storage } from '../data/storage.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'cafe_love_byte_secret_super_key_2026_aesthetic_vibe', {
    expiresIn: '7d'
  });
};

// @desc    Admin login
// @route   POST /api/auth/login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = storage.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

export const getAdminStats = (req, res) => {
  try {
    const reservations = storage.getReservations();
    const menuItems = storage.getMenuItems();
    const messages = storage.getContactMessages();
    const testimonials = storage.getTestimonials();
    const blogPosts = storage.getBlogPosts();

    const confirmedReservations = reservations.filter(
      (r) => (r.status || '').toLowerCase() === 'confirmed'
    ).length;
    const pendingReservations = reservations.filter(
      (r) => (r.status || '').toLowerCase() === 'pending'
    ).length;
    const completedReservations = reservations.filter(
      (r) => (r.status || '').toLowerCase() === 'completed'
    ).length;
    const cancelledReservations = reservations.filter(
      (r) => (r.status || '').toLowerCase() === 'cancelled'
    ).length;

    const unreadMessages = messages.filter(
      (m) => (m.status || '').toLowerCase() === 'unread' || (m.status || '').toLowerCase() === 'new'
    ).length;
    const resolvedMessages = messages.filter(
      (m) => (m.status || '').toLowerCase() === 'resolved'
    ).length;

    const publishedBlogs = blogPosts.filter((b) => b.isPublished !== false).length;

    res.json({
      success: true,
      data: {
        totalReservations: reservations.length,
        pendingReservations,
        confirmedReservations,
        completedReservations,
        cancelledReservations,
        totalContactMessages: messages.length,
        unreadMessages,
        resolvedMessages,
        totalBlogPosts: blogPosts.length,
        publishedBlogs,
        totalMenuItems: menuItems.length,
        availableMenuItems: menuItems.filter((m) => m.isAvailable !== false).length,
        totalReviews: testimonials.length,
        averageRating: 4.9,
        estimatedTodayGuests: reservations.reduce(
          (acc, curr) => acc + (Number(curr.guests || curr.guestsCount) || 2),
          0
        )
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
