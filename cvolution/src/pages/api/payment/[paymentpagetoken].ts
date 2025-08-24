import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { paymentpagetoken } = req.query;

  if (!paymentpagetoken || typeof paymentpagetoken !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid paymentpagetoken' });
  }

  // You can process the token here (e.g., validate, store in DB, etc.)
  console.log('Received paymentpagetoken:', paymentpagetoken);

  res.status(200).json({ token: paymentpagetoken, message: 'Token received successfully' });
}