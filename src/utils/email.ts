const nodemailer = require('nodemailer');
import { env } from '~/env';

// Create transporter
const createTransporter = () => {
  console.log('SMTP Config Check:', {
    host: env.SMTP_HOST ? 'Set' : 'Missing',
    user: env.SMTP_USER ? 'Set' : 'Missing',
    pass: env.SMTP_PASS ? 'Set' : 'Missing',
    from: env.SMTP_FROM_EMAIL ? 'Set' : 'Missing'
  });
  
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('SMTP configuration missing. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransporter({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send welcome email
export const sendWelcomeEmail = async (
  name: string,
  email: string,
  membershipPlan: string,
  usn: string
) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('Email not sent - SMTP not configured');
    return;
  }

  const membershipPlanText = membershipPlan.replace('-', ': ');

  const mailOptions = {
    from: env.SMTP_FROM_EMAIL || env.SMTP_USER,
    to: email,
    subject: 'Welcome to CSI NMAMIT! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to CSI NMAMIT!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Computer Society of India</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${name}! 👋</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Congratulations! You have successfully joined the Computer Society of India (CSI) 
            through our Student Branch at NMAMIT. We're excited to have you as part of our 
            vibrant tech community!
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Your Membership Details:</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>USN:</strong> ${usn}</li>
              <li><strong>Membership Plan:</strong> ${membershipPlanText}</li>
              <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString('en-IN')}</li>
            </ul>
          </div>
          
          <h3 style="color: #333;">What's Next? 🚀</h3>
          <ul style="color: #555; line-height: 1.6;">
            <li>You'll receive updates about upcoming events and workshops</li>
            <li>Access to exclusive networking opportunities</li>
            <li>Participation in technical competitions and hackathons</li>
            <li>Mentorship programs and career guidance</li>
            <li>Access to CSI's vast knowledge resources</li>
          </ul>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h4 style="color: #155724; margin-top: 0;">📞 Contact Information:</h4>
            <p style="color: #155724; margin: 5px 0;">
              <strong>Takshak Shetty:</strong> 9819432031<br>
              <strong>Harshitha P Salian:</strong> 8431748027
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Stay connected with us on social media for the latest updates and announcements!
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #888; font-size: 14px;">
              Best regards,<br>
              <strong>CSI NMAMIT Team</strong>
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    
    // Type-safe error logging
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Error details:', {
        code: (error as any).code,
        command: (error as any).command,
        response: (error as any).response
      });
    }
    
    return false;
  }
}; 