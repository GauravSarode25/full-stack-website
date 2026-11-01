import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@cafelovebyte.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'LoveByteAdmin@2026',
  SMTP: {
    HOST: process.env.SMTP_HOST || 'smtp.ethereal.email',
    PORT: process.env.SMTP_PORT || 587,
    USER: process.env.SMTP_USER,
    PASS: process.env.SMTP_PASS,
    ALERT_EMAIL: process.env.ADMIN_ALERT_EMAIL || 'manager@cafelovebyte.com'
  },
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production'
};

// Validate critical secrets in production
if (env.isProduction) {
  if (!env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing in production!');
  }
}

export default env;
