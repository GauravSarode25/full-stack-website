import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass && host !== 'smtp.ethereal.email') {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass }
    });
  } else {
    // Ethereal / Test account for development
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('📧 Ethereal development mailer configured for notifications.');
    } catch (err) {
      console.log('ℹ️ Local development mailer fallback active.');
    }
  }

  return transporter;
};

export const sendReservationNotification = async (reservation) => {
  try {
    const mailClient = await getTransporter();
    if (!mailClient) return;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cafelovebyte.com';

    const info = await mailClient.sendMail({
      from: `"Cafe Love Byte Bookings" <${process.env.SMTP_USER || 'bookings@cafelovebyte.com'}>`,
      to: adminEmail,
      subject: `New Table Reservation Request [${reservation.id || 'LB-NEW'}] - ${reservation.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #7A1F3D;">New Table Reservation Request</h2>
          <p>You have received a new reservation request at <strong>Cafe Love Byte</strong>:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Reference Code:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.id || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Guest Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.phone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date & Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.date} at ${reservation.time}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Number of Guests:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.guests}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Occasion:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.occasion}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Seating Preference:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.seatingPreference}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Special Request:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.specialRequest || 'None'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Current Status:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; color: #D9A441; font-weight: bold;">${reservation.status}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 13px; color: #666;">Please log into the Admin Console to review and confirm this table.</p>
        </div>
      `
    });

    console.log(`✉️ Email notification sent for reservation: ${info.messageId || 'Success'}`);
  } catch (err) {
    console.error('Error sending reservation email:', err.message);
  }
};
