import express from 'express';
import { body } from 'express-validator';
import { loginAdmin, getMe, getAdminStats } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
  ],
  loginAdmin
);

router.get('/me', protectAdmin, getMe);
router.get('/stats', protectAdmin, getAdminStats);

export default router;
