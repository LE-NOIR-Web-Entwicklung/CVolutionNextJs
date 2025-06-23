import type { NextApiRequest, NextApiResponse } from 'next';
import { sendConfirmationEmail } from '../../../lib/resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // You can customize the subject and message as needed
    await sendConfirmationEmail(
      email
    );
    return res.status(200).json({ message: 'Confirmation email sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send confirmation email', error });
  }
}
