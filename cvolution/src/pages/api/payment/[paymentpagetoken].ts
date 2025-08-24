import { NextApiRequest, NextApiResponse } from "next";

// Tokens werden im Speicher gehalten
let tokens: string[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { paymentpagetoken } = req.query;

  // Wenn DELETE-Request: Tokens löschen
  if (req.method === "DELETE") {
    tokens = [];
    return res.status(200).json({ message: "Tokens cleared" });
  }

  // Wenn POST/GET: Token speichern
  if (!paymentpagetoken || typeof paymentpagetoken !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid paymentpagetoken' });
  }

  tokens.push(paymentpagetoken);

  res.status(200).json({ token: paymentpagetoken, message: 'Token stored in memory' });
}