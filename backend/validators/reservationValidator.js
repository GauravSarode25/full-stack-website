import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

export const validateCreateReservation = [
  body().custom((value) => {
    if (!value.name && !value.fullName) {
      throw new Error('Guest name is required');
    }
    return true;
  }),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Valid phone number is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Reservation date is required'),
  body().custom((value) => {
    if (!value.time && !value.timeSlot) {
      throw new Error('Reservation time slot is required');
    }
    return true;
  }),
  body().custom((value) => {
    const guests = Number(value.guests || value.guestsCount);
    if (isNaN(guests) || guests < 1) {
      throw new Error('Number of guests must be at least 1');
    }
    return true;
  }),
  handleValidationErrors
];

export const validateUpdateReservationStatus = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Reservation ID is required'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('New status is required')
    .isIn(['Pending', 'Confirmed', 'Cancelled', 'Completed', 'pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Status must be Pending, Confirmed, Cancelled, or Completed'),
  handleValidationErrors
];
