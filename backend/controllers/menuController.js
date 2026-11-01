import { storage } from '../data/storage.js';

// @desc    Get all menu items with search & category filtering
// @route   GET /api/menu
export const getMenuItems = (req, res) => {
  try {
    let items = storage.getMenuItems();
    const { category, isVeg, isChefSpecial, search, sortBy } = req.query;

    if (category && category !== 'All') {
      items = items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }

    if (isVeg !== undefined && isVeg !== '') {
      const vegBool = isVeg === 'true';
      items = items.filter((item) => item.isVeg === vegBool);
    }

    if (isChefSpecial === 'true') {
      items = items.filter((item) => item.isChefSpecial === true);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (sortBy === 'price-low') {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      items = [...items].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      items = [...items].sort((a, b) => b.rating - a.rating);
    }

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
export const getMenuItemById = (req, res) => {
  try {
    const item = storage.getMenuItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new menu item (Admin)
// @route   POST /api/menu
export const createMenuItem = (req, res) => {
  try {
    const newItem = storage.addMenuItem(req.body);
    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update menu item (Admin)
// @route   PUT /api/menu/:id
export const updateMenuItem = (req, res) => {
  try {
    const updated = storage.updateMenuItem(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete menu item (Admin)
// @route   DELETE /api/menu/:id
export const deleteMenuItem = (req, res) => {
  try {
    const deleted = storage.deleteMenuItem(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({
      success: true,
      message: 'Menu item deleted successfully',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle menu item availability (Admin)
// @route   PATCH /api/menu/:id/toggle
export const toggleMenuItemAvailability = (req, res) => {
  try {
    const item = storage.toggleMenuItemAvailability(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({
      success: true,
      message: `Menu item is now ${item.isAvailable !== false ? 'Enabled' : 'Disabled'}`,
      data: item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

