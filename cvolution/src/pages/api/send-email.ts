import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../../lib/resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, service, address, postalCode, message } = req.body;
  if (!name || !email || !service) {
    return res.status(400).json({ message: 'Name, email, and service are required' });
  }

  try {
    await sendEmail(name, email, service, address, postalCode, message);
    return res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send email', error });
  }
}
