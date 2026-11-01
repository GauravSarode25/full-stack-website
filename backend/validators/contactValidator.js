import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

export const validateSubmitContact = [
  body().custom((value) => {
    if (!value.name && !value.fullName) {
      throw new Error('Your name is required');
    }
    return true;
  }),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 5 })
    .withMessage('Message must be at least 5 characters long'),
  handleValidationErrors
];

export const validateUpdateContactStatus = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Message ID is required'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required'),
  handleValidationErrors
];
