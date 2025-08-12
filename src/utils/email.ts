import nodemailer from 'nodemailer';
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

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT ?? '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  }) as nodemailer.Transporter;
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
    from: env.SMTP_FROM_EMAIL ?? env.SMTP_USER,
    to: email,
    subject: '🎉 Welcome to CSI NMAMIT Executive Membership!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Executive Membership Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">CSI NMAMIT - Computer Society of India</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${name}! 👋</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Congratulations! You have successfully become an <strong>Executive Member</strong> of the Computer Society of India (CSI) 
            through our Student Branch at NMAMIT. Your payment has been processed successfully, and your membership is now active!
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
          
          <h3 style="color: #333;">Executive Membership Benefits 🚀</h3>
          <ul style="color: #555; line-height: 1.6;">
            <li>🎯 <strong>Priority Access:</strong> Early registration for all events and workshops</li>
            <li>🤝 <strong>Networking:</strong> Exclusive access to industry professionals and alumni</li>
            <li>🏆 <strong>Competitions:</strong> Priority participation in technical competitions and hackathons</li>
            <li>👨‍🏫 <strong>Mentorship:</strong> Direct access to mentorship programs and career guidance</li>
            <li>📚 <strong>Resources:</strong> Access to CSI's vast knowledge resources and publications</li>
            <li>💼 <strong>Leadership:</strong> Opportunities to lead projects and initiatives</li>
            <li>🎓 <strong>Certification:</strong> Official CSI Executive Member certificate</li>
          </ul>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc;">
            <h4 style="color: #0066cc; margin-top: 0;">🌐 Stay Connected:</h4>
            <p style="color: #0066cc; margin: 5px 0;">
              <strong>Website:</strong> <a href="https://csinmamit.in" style="color: #0066cc;">https://csinmamit.in</a><br>
              <strong>Email:</strong>csi csi@nitte.edu.in<br>
              <strong>Location:</strong> NMAM Institute of Technology, Nitte
            </p>
          </div>
          
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
    const info = await transporter.sendMail(mailOptions) as {
      messageId: string;
    };
    console.log(`Welcome email sent to ${email}`);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    
    // Type-safe error logging
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Error details:', {
        code: (error as { code?: string }).code,
        command: (error as { command?: string }).command,
        response: (error as { response?: string }).response
      });
    }
    
    return false;
  }
}; 

// Send Executive Membership confirmation email
export const sendExecutiveMembershipEmail = async (
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
    from: env.SMTP_FROM_EMAIL ?? env.SMTP_USER,
    to: email,
    subject: '🎉 Welcome to CSI NMAMIT Executive Membership!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Executive Membership Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">CSI NMAMIT - Computer Society of India</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${name}! 👋</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Congratulations! You have successfully become an <strong>Executive Member</strong> of the Computer Society of India (CSI) 
            through our Student Branch at NMAMIT. Your payment has been processed successfully, and your membership is now active!
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
          
          <h3 style="color: #333;">Executive Membership Benefits 🚀</h3>
          <ul style="color: #555; line-height: 1.6;">
            <li>🎯 <strong>Priority Access:</strong> Early registration for all events and workshops</li>
            <li>🤝 <strong>Networking:</strong> Exclusive access to industry professionals and alumni</li>
            <li>🏆 <strong>Competitions:</strong> Priority participation in technical competitions and hackathons</li>
            <li>👨‍🏫 <strong>Mentorship:</strong> Direct access to mentorship programs and career guidance</li>
            <li>📚 <strong>Resources:</strong> Access to CSI's vast knowledge resources and publications</li>
            <li>💼 <strong>Leadership:</strong> Opportunities to lead projects and initiatives</li>
            <li>🎓 <strong>Certification:</strong> Official CSI Executive Member certificate</li>
          </ul>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc;">
            <h4 style="color: #0066cc; margin-top: 0;">🌐 Stay Connected:</h4>
            <p style="color: #0066cc; margin: 5px 0;">
              <strong>Website:</strong> <a href="https://csinmamit.in" style="color: #0066cc;">https://csinmamit.in</a><br>
              <strong>Instagram:</strong> <a href="https://www.instagram.com/csi_nmamit/" style="color: #0066cc;">@csi_nmamit</a><br>
              
              <strong>Location:</strong> NMAM Institute of Technology, Nitte
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-top: 0;">📅 Upcoming Events:</h4>
            <p style="color: #856404; margin: 5px 0;">
              As an Executive Member, you'll receive priority notifications about:<br>
              • Technical workshops and seminars<br>
              • Industry expert talks<br>
              • Coding competitions and hackathons<br>
              • Networking events and career fairs<br>
              • Annual CSI conventions and conferences
            </p>
          </div>
          
          <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899;">
            <h4 style="color: #831843; margin-top: 0;">📱 Follow Us on Social Media:</h4>
            <p style="color: #831843; margin: 5px 0;">
              <strong>Instagram:</strong> <a href="https://www.instagram.com/csi_nmamit/" style="color: #831843;">@csi_nmamit</a><br>
              Get exclusive content including:<br>
              • Event highlights and behind-the-scenes<br>
              • Student achievements and success stories<br>
              • Tech tips and industry insights<br>
              • Live updates during events<br>
              • Member spotlights and interviews
            </p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h4 style="color: #155724; margin-top: 0;">📞 Contact Information:</h4>
            <p style="color: #155724; margin: 5px 0;">
              <strong>Takshak Shetty:</strong> 9819432031<br>
              <strong>Harshitha P Salian:</strong> 8431748027
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Stay connected with us on <strong>Instagram @csi_nmamit</strong> and visit our website regularly for the latest updates, event announcements, and behind-the-scenes content!
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <div style="margin-bottom: 20px;">
              <a href="https://csinmamit.in" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
                🌐 Visit Our Website
              </a>
              <a href="https://www.instagram.com/csi_nmamit/" style="display: inline-block; background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                📱 Follow on Instagram
              </a>
            </div>
            <p style="color: #888; font-size: 14px;">
              Best regards,<br>
              <strong>CSI NMAMIT Executive Team</strong><br>
              <em>Empowering students through technology and innovation</em>
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions) as {
      messageId: string;
    };
    console.log(`Executive Membership email sent to ${email}`);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending Executive Membership email:', error);
    
    // Type-safe error logging
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Error details:', {
        code: (error as { code?: string }).code,
        command: (error as { command?: string }).command,
        response: (error as { response?: string }).response
      });
    }
    
    return false;
  }
}; 