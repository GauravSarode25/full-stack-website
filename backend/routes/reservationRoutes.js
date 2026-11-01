import express from 'express';
import { body } from 'express-validator';
import {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation
} from '../controllers/reservationController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').optional().trim(),
    body('fullName').optional().trim(),
    body().custom((value) => {
      if (!value.name && !value.fullName) {
        throw new Error('Name is required');
      }
      return true;
    }),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('date').trim().notEmpty().withMessage('Reservation date is required'),
    body().custom((value) => {
      if (!value.time && !value.timeSlot) {
        throw new Error('Reservation time is required');
      }
      return true;
    }),
    body().custom((value) => {
      const g = Number(value.guests || value.guestsCount);
      if (isNaN(g) || g < 1) {
        throw new Error('Number of guests must be at least 1');
      }
      return true;
    }),
    handleValidationErrors
  ],
  createReservation
);

router.get('/', protectAdmin, getAllReservations);
router.get('/:id', getReservationById);
router.patch('/:id/status', protectAdmin, updateReservationStatus);
router.delete('/:id', protectAdmin, deleteReservation);

export default router;
