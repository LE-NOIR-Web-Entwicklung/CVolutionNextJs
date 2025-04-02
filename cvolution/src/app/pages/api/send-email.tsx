import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      // Configure the SMTP transporter
      const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", 
        port: 587, 
        secure: false, 
        auth: {
          user: "jan@cvolution.ch", 
          pass: "CVolution+2025", 
        },
      });

      // Email options
      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: "jan@cvolution.ch", 
        subject: "New Contact Form Submission",
        text: message,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}