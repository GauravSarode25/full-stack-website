import { storage } from '../data/storage.js';

export const menuService = {
  getAll: (filters = {}) => {
    let items = storage.getMenuItems();
    const { category, isVeg, isChefSpecial, search, sortBy } = filters;

    if (category && category !== 'All') {
      items = items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }

    if (isVeg !== undefined && isVeg !== '') {
      const vegBool = isVeg === 'true' || isVeg === true;
      items = items.filter((item) => item.isVeg === vegBool);
    }

    if (isChefSpecial === 'true' || isChefSpecial === true) {
      items = items.filter((item) => item.isChefSpecial === true);
    }

    if (search) {
      const q = search.toLowerCase().trim();
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

    return items;
  },

  getById: (id) => {
    return storage.getMenuItemById(id);
  },

  create: (itemData) => {
    return storage.addMenuItem(itemData);
  },

  update: (id, updates) => {
    return storage.updateMenuItem(id, updates);
  },

  delete: (id) => {
    return storage.deleteMenuItem(id);
  },

  toggleAvailability: (id) => {
    return storage.toggleMenuItemAvailability(id);
  }
};
