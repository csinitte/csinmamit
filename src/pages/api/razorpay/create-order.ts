import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import { z } from 'zod';
import { env } from '~/env';

// Input validation schema
const createOrderSchema = z.object({
  amount: z.number().positive('Amount must be positive').max(1000000, 'Amount too large'),
  currency: z.string().optional().default('INR'),
  receipt: z.string().min(1, 'Receipt is required').max(40, 'Receipt too long'),
});

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay order with proper validation and error handling
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are allowed'
    });
  }

  try {
    // Input validation
    const validationResult = createOrderSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid input',
        details: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const { amount, currency, receipt } = validationResult.data;

    // Additional business logic validation
    if (amount < 1) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        message: 'Amount must be at least ₹1'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise, ensure integer
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options) as {
      id: string;
      amount: number;
      currency: string;
    };

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    // Better error handling
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'Failed to create order',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create order',
      message: 'An unexpected error occurred'
    });
  }
}
