import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getAdminFirestore } from '~/server/firebase-admin';
import { sendExecutiveMembershipEmail } from '~/utils/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      userId, 
      selectedYears, 
      amount, 
      userEmail, 
      userName, 
      userUsn,
      platformFee,
      baseAmount
    } = req.body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      userId?: string;
      selectedYears?: number;
      amount?: number;
      userEmail?: string;
      userName?: string;
      userUsn?: string;
      platformFee?: number;
      baseAmount?: number;
    };

    // Get user data for email from request body
    const userData = {
      name: userName ?? '',
      email: userEmail ?? '',
      usn: userUsn ?? '',
    };
    
    console.log('📋 User data from request:', userData);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Optionally update membership server-side using Admin SDK (bypasses client security rule limitations)
      if (userId && selectedYears && amount) {
        console.log('🔧 Payment verification - Selected years:', selectedYears, 'Amount:', amount, 'Platform Fee:', platformFee);
        try {
          const db = getAdminFirestore();
          const membershipStartDate = new Date();
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth(); // 0-11 (Jan=0, Dec=11)
          
          // Calculate end date based on selected years
          // Ends on the same date and month as purchase date, but in future years
          const endYear = currentYear + selectedYears;
          
          const membershipEndDate = new Date(endYear, currentMonth, currentDate.getDate());
          
          console.log('📅 Membership dates:', {
            startDate: membershipStartDate.toISOString(),
            endDate: membershipEndDate.toISOString(),
            selectedYears,
            endYear,
            currentYear,
            currentMonth
          });

          await db.collection('users').doc(userId).set(
            {
              membershipType: `${selectedYears}-Year Executive Membership (Until April 30, ${membershipEndDate.getFullYear()})`,
              membershipStartDate,
              membershipEndDate,
              paymentDetails: {
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                amount: baseAmount ?? amount, // Store base amount (without platform fee)
                platformFee: platformFee ?? 0, // Store platform fee separately
                totalAmount: amount, // Store total amount paid
                currency: 'INR',
                paymentDate: new Date(),
              },
              role: 'EXECUTIVE MEMBER',
              updatedAt: new Date(),
            },
            { merge: true }
          );

          // Send Executive Membership confirmation email after successful membership update
          if (userData.email && userData.name) {
            try {
              console.log('📧 Attempting to send Executive Membership email to:', userData.email);
              const membershipPlan = `${selectedYears}-Year Executive Membership`;
              const emailResult = await sendExecutiveMembershipEmail(
                userData.name,
                userData.email,
                membershipPlan,
                userData.usn ?? 'N/A'
              );
              
              if (emailResult) {
                console.log(`✅ Executive Membership email sent successfully to ${userData.email}`);
              } else {
                console.log(`❌ Executive Membership email failed to send to ${userData.email} - SMTP not configured`);
              }
            } catch (emailError) {
              console.error('❌ Error sending Executive Membership email:', emailError);
              // Don't fail the payment verification if email fails
            }
          } else {
            console.log('⚠️ Skipping email send - missing user data:', { email: userData.email, name: userData.name });
          }
        } catch (dbError) {
          console.error('Admin membership update failed:', dbError);
          // Continue: we still return success for payment verification, but include a warning
          return res.status(200).json({
            success: true,
            message: 'Payment verified successfully, but membership update failed. Please contact support.',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
} 