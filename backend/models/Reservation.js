import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true
    },
    date: {
      type: String,
      required: [true, 'Reservation date is required']
    },
    time: {
      type: String,
      required: [true, 'Reservation time is required']
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Number of guests must be at least 1']
    },
    occasion: {
      type: String,
      enum: ['Date', 'Birthday', 'Anniversary', 'Friends Meetup', 'Family', 'Casual Dining', 'Other'],
      default: 'Date'
    },
    seatingPreference: {
      type: String,
      enum: ['Indoor', 'Private Space', 'Outdoor', 'No Preference'],
      default: 'No Preference'
    },
    specialRequest: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);

export default Reservation;
