import Reservation from '../models/Reservation.js';
import { storage } from '../data/storage.js';
import { sendReservationNotification } from '../utils/mailer.js';
import mongoose from 'mongoose';

// @desc    Create new table reservation request
// @route   POST /api/reservations
export const createReservation = async (req, res) => {
  try {
    const {
      name,
      fullName,
      phone,
      email,
      date,
      time,
      timeSlot,
      guests,
      guestsCount,
      occasion,
      seatingPreference,
      zone,
      specialRequest,
      specialRequests
    } = req.body;

    const guestName = name || fullName;
    const guestPhone = phone;
    const guestEmail = email;
    const resDate = date;
    const resTime = time || timeSlot;
    const resGuests = Number(guests || guestsCount || 2);
    const resOccasion = occasion || 'Date';
    const resSeating = seatingPreference || zone || 'No Preference';
    const resSpecial = specialRequest || specialRequests || '';

    // Date validation: Cannot be in the past
    const todayStr = new Date().toISOString().split('T')[0];
    if (resDate < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Reservation date cannot be in the past.'
      });
    }

    if (resGuests < 1) {
      return res.status(400).json({
        success: false,
        message: 'Number of guests must be at least 1.'
      });
    }

    const reservationPayload = {
      name: guestName,
      phone: guestPhone,
      email: guestEmail,
      date: resDate,
      time: resTime,
      guests: resGuests,
      occasion: resOccasion,
      seatingPreference: resSeating,
      specialRequest: resSpecial,
      status: 'pending'
    };

    // Store in persistent local store
    const localSaved = storage.addReservation({
      ...reservationPayload,
      fullName: guestName,
      timeSlot: resTime,
      guestsCount: resGuests,
      zone: resSeating,
      specialRequests: resSpecial
    });

    // If MongoDB is connected, also store in MongoDB collection
    if (mongoose.connection.readyState === 1) {
      try {
        await Reservation.create(reservationPayload);
      } catch (mongoErr) {
        console.error('MongoDB write error (local store persisted):', mongoErr.message);
      }
    }

    // Send email notification to café admin via Nodemailer
    sendReservationNotification(localSaved);

    res.status(201).json({
      success: true,
      message: "We've received your reservation request. Our team will confirm your table shortly.",
      data: localSaved
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process reservation request. Please try again.'
    });
  }
};

// @desc    Get all reservations (Admin)
// @route   GET /api/reservations
export const getAllReservations = async (req, res) => {
  try {
    const { status, date } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (status && status !== 'All') query.status = status.toLowerCase();
      if (date) query.date = date;
      const mongoReservations = await Reservation.find(query).sort({ createdAt: -1 });
      if (mongoReservations.length > 0) {
        return res.json({
          success: true,
          count: mongoReservations.length,
          data: mongoReservations
        });
      }
    }

    let reservations = storage.getReservations();
    if (status && status !== 'All') {
      reservations = reservations.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }
    if (date) {
      reservations = reservations.filter((r) => r.date === date);
    }

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single reservation by ID
// @route   GET /api/reservations/:id
export const getReservationById = (req, res) => {
  try {
    const reservation = storage.getReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update reservation status (Admin)
// @route   PATCH /api/reservations/:id/status
export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = storage.updateReservationStatus(req.params.id, status);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.json({
      success: true,
      message: `Reservation status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete reservation (Admin)
// @route   DELETE /api/reservations/:id
export const deleteReservation = (req, res) => {
  try {
    const deleted = storage.deleteReservation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.json({
      success: true,
      message: 'Reservation cancelled and removed',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
