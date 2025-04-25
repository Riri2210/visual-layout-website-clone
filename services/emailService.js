const nodemailer = require('nodemailer');
const crypto = require('crypto');

/**
 * Email Service Configuration
 * 
 * You can configure the email service in the following ways:
 * 1. Using environment variables (recommended for production)
 * 2. Directly in this file (for development only)
 * 
 * For Gmail:
 * - You need to enable "Less secure app access" or
 * - Use 2-factor authentication and generate an app password
 * 
 * For other email services like Outlook, Yahoo, etc.:
 * - Change the 'service' parameter below
 * - Or use custom SMTP settings with host, port, etc.
 */

// Email configuration options
const emailConfig = {
  // Choose your email service: 'gmail', 'outlook', 'yahoo', etc.
  service: process.env.EMAIL_SERVICE || 'gmail',
  
  // Or use custom SMTP settings (uncomment and configure if needed)
  // host: process.env.EMAIL_HOST || 'smtp.example.com',
  // port: process.env.EMAIL_PORT || 587,
  // secure: process.env.EMAIL_SECURE === 'true' || false,
  
  // Your email credentials
  auth: {
    user: process.env.EMAIL_USER || 'admincv@harumimultiinovasi.com', // Sender email address
    pass: process.env.EMAIL_PASSWORD || 'your-app-password', // Replace with your password or app password
  },
};

// Company/Application information
const companyInfo = {
  name: 'HMISystem',
  logoUrl: 'https://harumimultiinovasi.com/logo.png',
  websiteUrl: 'https://harumimultiinovasi.com',
  address: 'Jl. Matraman Raya No. 67 Kec. Matraman - Jakarta Timur',
  supportEmail: 'admincv@harumimultiinovasi.com',
};

// Create email transporter
const transporter = nodemailer.createTransport(emailConfig);

/**
 * Verifies the email configuration is working
 * @returns {Promise<boolean>} Whether the configuration is valid
 */
async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email service is configured correctly');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}

/**
 * Generates a random temporary password
 * @param {number} length - The length of the password
 * @returns {string} The generated password
 */
function generateTemporaryPassword(length = 8) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  
  // Ensure password has at least one character from each category
  password += charset.substring(0, 26).charAt(Math.floor(Math.random() * 26)); // lowercase
  password += charset.substring(26, 52).charAt(Math.floor(Math.random() * 26)); // uppercase
  password += charset.substring(52, 62).charAt(Math.floor(Math.random() * 10)); // number
  password += charset.substring(62).charAt(Math.floor(Math.random() * (charset.length - 62))); // special
  
  // Fill the rest of the password
  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

/**
 * Sends a registration confirmation email with a temporary password
 * @param {Object} userData - User data including email, name, etc.
 * @param {string} tempPassword - Temporary password to send
 * @returns {Promise} Promise that resolves when email is sent
 */
async function sendRegistrationEmail(userData, tempPassword) {
  const { email, name } = userData;
  
  const mailOptions = {
    from: `"${companyInfo.name}" <${emailConfig.auth.user}>`,
    to: email,
    subject: `Welcome to ${companyInfo.name} - Your Account Details`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #333;">Welcome to ${companyInfo.name}</h2>
        </div>
        
        <p>Hello ${name || 'User'},</p>
        
        <p>Thank you for registering with ${companyInfo.name}. Your account has been created successfully.</p>
        
        <p>Here are your temporary login credentials:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        
        <p>For security reasons, please change your password after your first login.</p>
        
        <p>If you did not register for an account, please disregard this email or contact our support team at ${companyInfo.supportEmail}.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777; font-size: 12px;">
          <p>This is an automated email. Please do not reply.</p>
          <p>${companyInfo.address}</p>
          <p>&copy; ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Registration email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw error;
  }
}

/**
 * Sends a password reset email with a reset link
 * @param {Object} userData - User data including email, name, etc.
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - URL to reset password
 * @returns {Promise} Promise that resolves when email is sent
 */
async function sendPasswordResetEmail(userData, resetToken, resetUrl) {
  const { email, name } = userData;
  
  const mailOptions = {
    from: `"${companyInfo.name}" <${emailConfig.auth.user}>`,
    to: email,
    subject: `${companyInfo.name} - Password Reset Request`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #333;">Password Reset Request</h2>
        </div>
        
        <p>Hello ${name || 'User'},</p>
        
        <p>We received a request to reset your password for your ${companyInfo.name} account.</p>
        
        <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        
        <p>If you did not request a password reset, please ignore this email or contact our support team at ${companyInfo.supportEmail}.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777; font-size: 12px;">
          <p>This is an automated email. Please do not reply.</p>
          <p>${companyInfo.address}</p>
          <p>&copy; ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

module.exports = {
  generateTemporaryPassword,
  sendRegistrationEmail,
  sendPasswordResetEmail,
  verifyEmailConfig,
  companyInfo
};
