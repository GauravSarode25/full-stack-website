import express from 'express';
import { body } from 'express-validator';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability
} from '../controllers/menuController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

router.post(
  '/',
  protectAdmin,
  [
    body('name').trim().notEmpty().withMessage('Menu item name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a valid number'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    handleValidationErrors
  ],
  createMenuItem
);

router.put('/:id', protectAdmin, updateMenuItem);
router.delete('/:id', protectAdmin, deleteMenuItem);
router.patch('/:id/toggle', protectAdmin, toggleMenuItemAvailability);

export default router;
