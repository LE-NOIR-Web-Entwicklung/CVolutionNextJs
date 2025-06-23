import type { NextApiRequest, NextApiResponse } from 'next';
import { sendConfirmationEmail } from '../../../lib/resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, service } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    await sendConfirmationEmail(email, service);
    return res.status(200).json({ message: 'Confirmation email sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send confirmation email', error });
  }
}
