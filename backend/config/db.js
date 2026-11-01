import mongoose from 'mongoose';
import { initStorage } from '../data/storage.js';
import env from './env.js';

export const connectDB = async () => {
  // Always initialize resilient persistent storage first
  await initStorage();

  const mongoURI = env.MONGO_URI;

  if (!mongoURI) {
    console.log('ℹ️ No MONGO_URI specified. Running with Resilient Persistent Local Store.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500 // Quick timeout to prevent stalling if local mongo isn't up
    });
    console.log(`📦 MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.log(`ℹ️ MongoDB connection not available. Running with Resilient Persistent Local Store.`);
  }
};
