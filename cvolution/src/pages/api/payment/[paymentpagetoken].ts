import { NextApiRequest, NextApiResponse } from "next";

let tokens: string[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { paymentpagetoken } = req.query;

  if (!paymentpagetoken || typeof paymentpagetoken !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid paymentpagetoken' });
  }

  tokens.push(paymentpagetoken);

  res.status(200).json({ token: paymentpagetoken, message: 'Token stored in memory' });
}