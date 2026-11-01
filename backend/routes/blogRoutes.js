import express from 'express';
import { body } from 'express-validator';
import {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  togglePublishBlog
} from '../controllers/blogController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);

// Protected Admin Routes
router.post(
  '/',
  protectAdmin,
  [
    body('title').trim().notEmpty().withMessage('Blog title is required'),
    body('content').optional(),
    handleValidationErrors
  ],
  createBlogPost
);

router.put('/:id', protectAdmin, updateBlogPost);
router.delete('/:id', protectAdmin, deleteBlogPost);
router.patch('/:id/publish', protectAdmin, togglePublishBlog);

export default router;
