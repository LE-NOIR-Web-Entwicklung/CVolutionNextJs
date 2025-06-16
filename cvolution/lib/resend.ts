"use server";

import { Resend } from "resend"; 

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (name: string, email: string, service: string) => {
    await resend.emails.send({
        from: "OrcDev <onboarding@resend.dev>",
        to: "info@cvolution.ch",
        subject: `Neue Anfrage ${service}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>E-Mail:</strong> ${email}</p>
               <p><strong>Service:</strong> ${service}</p>`
    }); 
}