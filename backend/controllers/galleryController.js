import { storage } from '../data/storage.js';

// @desc    Get all gallery photos
// @route   GET /api/gallery
export const getGallery = (req, res) => {
  try {
    const { category } = req.query;
    let gallery = storage.getGallery();

    if (category && category !== 'All') {
      gallery = gallery.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }

    res.json({
      success: true,
      count: gallery.length,
      data: gallery
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
