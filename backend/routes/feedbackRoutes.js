import express from 'express';
import { body } from 'express-validator';
import { getFeedback, submitFeedback } from '../controllers/feedbackController.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getFeedback);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().isLength({ min: 10 }).withMessage('Review comment must be at least 10 characters'),
    handleValidationErrors
  ],
  submitFeedback
);

export default router;
