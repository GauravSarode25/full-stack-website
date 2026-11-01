import { storage } from '../data/storage.js';

// @desc    Get all reviews and testimonials
// @route   GET /api/feedback
export const getFeedback = (req, res) => {
  try {
    const reviews = storage.getTestimonials();
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit new customer review / feedback
// @route   POST /api/feedback
export const submitFeedback = (req, res) => {
  try {
    const { name, rating, tag, comment, avatar } = req.body;
    const newFeedback = storage.addTestimonial({
      name,
      rating: Number(rating) || 5,
      tag: tag || 'Date Visit',
      comment,
      avatar
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for sharing your love with Cafe Love Byte!',
      data: newFeedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
