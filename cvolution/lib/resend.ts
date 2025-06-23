"use server";

import { Resend } from "resend"; 

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (name: string, email: string, service: string) => {
    await resend.emails.send({
        from: "CVolution <info@cvolution.ch>",
        to: "info@cvolution.ch",
        subject: `Neue Anfrage ${service}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 32px;">
                <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(32,72,120,0.08); padding: 32px 24px; text-align: left;">
                    <img src="https://cvolution.ch/images/logo.png" alt="CVolution Logo" style="width: 80px; margin-bottom: 24px; display: block; margin-left: auto; margin-right: auto;" />
                    <h1 style="color: #204878; font-size: 1.5rem; margin-bottom: 16px; text-align: center;">Neue Anfrage: ${service}</h1>
                    <div style="margin-bottom: 24px;">
                        <p style="color: #333; font-size: 1.1rem;"><strong>Name:</strong> ${name}</p>
                        <p style="color: #333; font-size: 1.1rem;"><strong>E-Mail:</strong> ${email}</p>
                        <p style="color: #333; font-size: 1.1rem;"><strong>Service:</strong> ${service}</p>
                    </div>
                    <div style="margin: 32px 0; text-align: center;">
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#204878" style="display: block; margin: 0 auto;">
                          <circle cx="12" cy="12" r="10" stroke="#204878" stroke-width="2" fill="#e6eef7" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12l2 2l4-4" stroke="#204878" />
                        </svg>
                    </div>
                    <p style="color: #888; font-size: 0.95rem; text-align: center;">Diese Anfrage wurde über das CVolution Kontaktformular gestellt.<br/>Bitte zeitnah bearbeiten.</p>
                    <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
                    <a href="https://cvolution.ch" style="color: #204878; text-decoration: none; font-weight: bold; text-align: center; display: block;">www.cvolution.ch</a>
                </div>
            </div>
        `
    }); 
}

export const sendConfirmationEmail = async (email: string) => {
    await resend.emails.send({
        from: "CVolution <info@cvolution.ch>",
        to: email,
        subject: "Bestellbestätigung",
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 32px;">
                <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(32,72,120,0.08); padding: 32px 24px; text-align: center;">
                    <img src="https://cvolution.ch/images/logo.png" alt="CVolution Logo" style="width: 80px; margin-bottom: 24px;" />
                    <h1 style="color: #204878; font-size: 2rem; margin-bottom: 16px;">Vielen Dank für Ihre Bestellung!</h1>
                    <p style="color: #333; font-size: 1.1rem; margin-bottom: 24px;">Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen melden.</p>
                    <div style="margin: 32px 0;">
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#22c55e" style="display: block; margin: 0 auto;">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p style="color: #888; font-size: 0.95rem;">Sie erhalten in Kürze weitere Informationen per E-Mail.<br/>Ihr CVolution Team</p>
                    <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
                    <a href="https://cvolution.ch" style="color: #204878; text-decoration: none; font-weight: bold;">www.cvolution.ch</a>
                </div>
            </div>
        `
    });
}