import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

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
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
} 