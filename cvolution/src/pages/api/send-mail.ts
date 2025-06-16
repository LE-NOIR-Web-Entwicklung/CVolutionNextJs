import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, service } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name und E-Mail sind erforderlich." });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // or your SMTP provider
    port: 587, // or 465 for SSL
    tls: {
      rejectUnauthorized: false, // Use with caution, better to use a valid certificate
    },
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // set in .env.local
      pass: process.env.EMAIL_PASS, // set in .env.local
    },
  });

  try {
    await transporter.sendMail({
      from: `"CVolution" <${process.env.EMAIL_USER}>`,
      to: "jan@cvolution.ch",
      subject: "Neue Anfrage Bewerbungsunterlagen-Check",
      text: `Name: ${name}\nE-Mail: ${email}\nService: ${service}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>E-Mail:</strong> ${email}</p>
             <p><strong>Service:</strong> ${service}</p>`,
    });
    res.status(200).json({ message: "E-Mail gesendet" });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Senden der E-Mail" });
  }
}