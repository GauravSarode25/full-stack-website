import jwt from 'jsonwebtoken';
import { storage } from '../data/storage.js';
import env from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

export const protectAdmin = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized, no token provided', ['Authentication token is missing'], 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET || 'cafe_love_byte_secret_super_key_2026_aesthetic_vibe');
    const user = storage.getUserById(decoded.id);

    if (!user) {
      return sendError(res, 'Not authorized, user not found', ['Account does not exist'], 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return sendError(res, 'Not authorized, invalid or expired token', ['Token verification failed'], 401);
  }
};
