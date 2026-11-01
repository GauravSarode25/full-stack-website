import { storage } from '../data/storage.js';
import Reservation from '../models/Reservation.js';
import mongoose from 'mongoose';
import { sendReservationNotification } from '../utils/mailer.js';

export const reservationService = {
  create: async (data) => {
    const guestName = data.name || data.fullName;
    const resDate = data.date;
    const resTime = data.time || data.timeSlot;
    const resGuests = Number(data.guests || data.guestsCount || 2);
    const resOccasion = data.occasion || 'Date';
    const resSeating = data.seatingPreference || data.zone || 'No Preference';
    const resSpecial = data.specialRequest || data.specialRequests || '';

    const todayStr = new Date().toISOString().split('T')[0];
    if (resDate < todayStr) {
      const err = new Error('Reservation date cannot be in the past');
      err.statusCode = 400;
      throw err;
    }

    const payload = {
      name: guestName,
      phone: data.phone,
      email: data.email,
      date: resDate,
      time: resTime,
      guests: resGuests,
      occasion: resOccasion,
      seatingPreference: resSeating,
      specialRequest: resSpecial,
      status: 'pending'
    };

    const saved = storage.addReservation({
      ...payload,
      fullName: guestName,
      timeSlot: resTime,
      guestsCount: resGuests,
      zone: resSeating,
      specialRequests: resSpecial
    });

    if (mongoose.connection.readyState === 1) {
      try {
        await Reservation.create(payload);
      } catch (err) {
        console.error('Mongo sync error (persisted to storage):', err.message);
      }
    }

    sendReservationNotification(saved);
    return saved;
  },

  getAll: (filters = {}) => {
    let list = storage.getReservations();
    const { status, date, search } = filters;

    if (status && status !== 'All') {
      list = list.filter((r) => (r.status || '').toLowerCase() === status.toLowerCase());
    }

    if (date) {
      list = list.filter((r) => r.date === date);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          (r.name || r.fullName || '').toLowerCase().includes(q) ||
          (r.phone || '').includes(q) ||
          (r.email || '').toLowerCase().includes(q) ||
          (r.id || '').toLowerCase().includes(q)
      );
    }

    return list;
  },

  getById: (id) => {
    return storage.getReservationById(id);
  },

  update: (id, updates) => {
    const res = storage.getReservationById(id);
    if (!res) return null;
    Object.assign(res, updates);
    return res;
  },

  updateStatus: (id, status) => {
    return storage.updateReservationStatus(id, status);
  },

  delete: (id) => {
    return storage.deleteReservation(id);
  }
};
