import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

export const validateCreateMenu = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Menu item name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Item name must be between 2 and 100 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid non-negative number'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Item description is required'),
  handleValidationErrors
];

export const validateUpdateMenu = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Menu item ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Item name must be between 2 and 100 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid non-negative number'),
  handleValidationErrors
];
