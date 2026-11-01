import express from 'express';
import { body } from 'express-validator';
import {
  submitContactMessage,
  getContactMessages,
  markMessageRead,
  updateMessageStatus,
  deleteContactMessage
} from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post(
  '/',
  [
    body('fullName').optional().trim(),
    body('name').optional().trim(),
    body().custom((value) => {
      if (!value.name && !value.fullName) {
        throw new Error('Name is required');
      }
      return true;
    }),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('message').trim().isLength({ min: 5 }).withMessage('Message must be at least 5 characters'),
    handleValidationErrors
  ],
  submitContactMessage
);

// Protected Admin Routes
router.get('/', protectAdmin, getContactMessages);
router.patch('/:id/status', protectAdmin, updateMessageStatus);
router.patch('/:id/read', protectAdmin, markMessageRead);
router.delete('/:id', protectAdmin, deleteContactMessage);

export default router;
