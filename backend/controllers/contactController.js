import ContactMessage from '../models/ContactMessage.js';
import { storage } from '../data/storage.js';
import mongoose from 'mongoose';

// @desc    Submit new contact inquiry
// @route   POST /api/contact
export const submitContactMessage = async (req, res) => {
  try {
    const { name, fullName, email, phone, subject, message } = req.body;

    const guestName = name || fullName;
    const msgPhone = phone || '';
    const msgSubject = subject || 'General Inquiry';

    if (!guestName || !guestName.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const payload = {
      name: guestName.trim(),
      email: email.trim(),
      phone: msgPhone.trim(),
      subject: msgSubject.trim(),
      message: message.trim(),
      status: 'new'
    };

    // Persistent storage
    const savedLocal = storage.addContactMessage({
      ...payload,
      fullName: guestName.trim()
    });

    // MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        await ContactMessage.create(payload);
      } catch (mongoErr) {
        console.error('MongoDB write contact error (local store persisted):', mongoErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "Message received. We'll get back to you soon.",
      data: savedLocal
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit message. Please try again.'
    });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
export const getContactMessages = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const mongoMessages = await ContactMessage.find().sort({ createdAt: -1 });
      if (mongoMessages.length > 0) {
        return res.json({
          success: true,
          count: mongoMessages.length,
          data: mongoMessages
        });
      }
    }

    const messages = storage.getContactMessages();
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update message status (Admin)
// @route   PATCH /api/contact/:id/status
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const newStatus = status || 'Read';
    const updated = storage.updateContactStatus(req.params.id, newStatus);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({
      success: true,
      message: `Message status updated to ${newStatus}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Backward-compatible alias
export const markMessageRead = updateMessageStatus;

// @desc    Delete contact message (Admin)
// @route   DELETE /api/contact/:id
export const deleteContactMessage = (req, res) => {
  try {
    const deleted = storage.deleteContactMessage(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({
      success: true,
      message: 'Message deleted successfully',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

