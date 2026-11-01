import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

export const validateCreateBlog = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Article title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('excerpt')
    .optional()
    .trim(),
  body('content')
    .optional(),
  handleValidationErrors
];

export const validateUpdateBlog = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Blog ID is required'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  handleValidationErrors
];
