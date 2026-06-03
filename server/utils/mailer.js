const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: process.env.MAIL_PORT === '465', // true for 465, false for others
  auth: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || ''
  }
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Subject line
 * @param {string} text - Plain text body
 * @param {string} html - HTML body (optional)
 */
async function sendMail(to, subject, text, html = '') {
  const mailOptions = {
    from: process.env.MAIL_FROM || `"Expertise Sénégal" <${process.env.MAIL_USER || 'contact@expertisesenegal.com'}>`,
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, '<br>')
  };

  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.warn('SMTP Credentials missing in .env. Skipping actual mail dispatch. Logging to console instead:');
      console.log(`[EMAIL SEND] To: ${to} | Subject: ${subject}`);
      console.log(`[EMAIL BODY] ${text}`);
      return { success: true, simulated: true };
    }
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error.message);
    // Return success: false but do not crash the request flow
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendMail
};
