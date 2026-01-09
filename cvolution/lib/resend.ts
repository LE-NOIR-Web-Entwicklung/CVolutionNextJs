"use server";

import { Resend } from "resend"; 

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
    name: string,
    email: string,
    service: string,
    address?: string,
    postalCode?: string,
    message?: string,
    attachments?: Array<{ filename: string; content: string }>,
    firstName?: string,
    lastName?: string,
    birthDate?: string,
    workLocation?: string,
    grossAnnualSalary?: string,
    fringeBenefits?: string,
    linkedinUrl?: string,
    remarks?: string
) => {
    // Build additional fields HTML for PDF service
    let additionalFieldsHtml = '';
    if (firstName || lastName || birthDate || workLocation || grossAnnualSalary) {
        additionalFieldsHtml = `
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <h3 style="color: #204878; font-size: 1.2rem; margin-bottom: 12px;">Lohnanalyse Details:</h3>
                ${firstName ? `<p style='color: #333; font-size: 1.1rem;'><strong>Vorname:</strong> ${firstName}</p>` : ""}
                ${lastName ? `<p style='color: #333; font-size: 1.1rem;'><strong>Nachname:</strong> ${lastName}</p>` : ""}
                ${birthDate ? `<p style='color: #333; font-size: 1.1rem;'><strong>Geburtsdatum:</strong> ${birthDate}</p>` : ""}
                ${workLocation ? `<p style='color: #333; font-size: 1.1rem;'><strong>Arbeitsort:</strong> ${workLocation}</p>` : ""}
                ${grossAnnualSalary ? `<p style='color: #333; font-size: 1.1rem;'><strong>Bruttojahreslohn:</strong> ${grossAnnualSalary}</p>` : ""}
                ${fringeBenefits ? `<p style='color: #333; font-size: 1.1rem;'><strong>Fringe & Benefits:</strong> ${fringeBenefits}</p>` : ""}
                ${linkedinUrl ? `<p style='color: #333; font-size: 1.1rem;'><strong>LinkedIn:</strong> <a href="${linkedinUrl}" style="color: #204878;">${linkedinUrl}</a></p>` : ""}
                ${remarks ? `<p style='color: #333; font-size: 1.1rem;'><strong>Bemerkungen:</strong> ${remarks}</p>` : ""}
            </div>
        `;
    }

    const emailData: {
        from: string;
        to: string;
        subject: string;
        html: string;
        attachments?: Array<{ filename: string; content: string }>;
    } = {
        from: "CVolution <info@cvolution.ch>",
        to: "info@cvolution.ch",
        subject: `Neue Anfrage ${service}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 32px;">
                <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(32,72,120,0.08); padding: 32px 24px; text-align: left;">
                    <img src="https://cvolution.ch/images/logo.png" alt="CVolution Logo" style="width: 80px; margin-bottom: 24px; display: block; margin-left: auto; margin-right: auto;" />
                    <h1 style="color: #204878; font-size: 1.5rem; margin-bottom: 16px; text-align: center;">Neue Anfrage: ${service}</h1>
                    <div style="margin-bottom: 24px;">
                        ${name ? `<p style="color: #333; font-size: 1.1rem;"><strong>Name:</strong> ${name}</p>` : ""}
                        <p style="color: #333; font-size: 1.1rem;"><strong>E-Mail:</strong> ${email}</p>
                        <p style="color: #333; font-size: 1.1rem;"><strong>Service:</strong> ${service}</p>
                        ${address ? `<p style='color: #333; font-size: 1.1rem;'><strong>Strasse + Nr:</strong> ${address}</p>` : ""}
                        ${postalCode ? `<p style='color: #333; font-size: 1.1rem;'><strong>PLZ + Ort:</strong> ${postalCode}</p>` : ""}
                        ${message ? `<p style='color: #333; font-size: 1.1rem;'><strong>Nachricht:</strong> ${message}</p>` : ""}
                        ${attachments && attachments.length > 0 ? `<p style='color: #333; font-size: 1.1rem;'><strong>Anhänge:</strong> ${attachments.length} Datei(en)</p>` : ""}
                        ${additionalFieldsHtml}
                    </div>
                    <div style="margin: 32px 0; text-align: center;">
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#204878" style="display: block; margin: 0 auto;">
                            <circle cx="12" cy="12" r="10" stroke="#204878" stroke-width="2" fill="#e6eef7" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12l2 2l4-4" stroke="#204878" />
                        </svg>
                    </div>
                    <p style="color: #888; font-size: 0.95rem; text-align: center;">Diese Anfrage wurde über das CVolution Bestellformular gestellt.<br/>Bitte zeitnah bearbeiten.</p>
                    <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
                    <a href="https://cvolution.ch" style="color: #204878; text-decoration: none; font-weight: bold; text-align: center; display: block;">www.cvolution.ch</a>
                </div>
            </div>
        `
    };

    if (attachments && attachments.length > 0) {
        emailData.attachments = attachments;
    }

    await resend.emails.send(emailData);
};



export const sendConfirmationEmail = async (email: string, service: string) => {
    let customMessage = `<p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen melden.</p>`;
    if (service && service.toLowerCase() === "lebenslauf") {
        customMessage = `
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Vielen Dank für deine Bestellung!<br />
            Es freut uns, dass du mit unserer Unterstützung den nächsten Karriereschritt gehen möchtest.</p>
            <h2 style=\"color: #204878; font-size: 1.1rem; margin-bottom: 12px;\">Wie geht es weiter?</h2>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Im Anhang findest du unsere 4 Topseller-Lebensläufe. Welche dürfen wir für dich erstellen?<br />
            <a href=\"https://1drv.ms/f/c/b90389d448c1c616/EhXyumsKpldDpvb6DOnDYPoBcQw-_mBWn4wzybsuTFpSZQ?e=2haAaD\" style=\"color: #204878; text-decoration: underline; font-weight: bold;\" target=\"_blank\">Hier ansehen</a></p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Sende uns bitte deinen aktuellen Lebenslauf oder den Link zu deinem LinkedIn-Profil per E-Mail an <a href=\"mailto:info@cvolution.ch\" style=\"color: #204878; text-decoration: underline;\">info@cvolution.ch</a> – das hilft uns bei der Ausarbeitung.<br />
            Hast du auch Arbeitszeugnisse zur Hand, können wir deinen CV noch aussagekräftiger gestalten.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Falls du keine Unterlagen zur Verfügung hast, ist das kein Problem – melde dich einfach telefonisch bei uns unter <a href=\"tel:+41764405151\" style=\"color: #204878; text-decoration: underline;\">076 440 51 51</a>.</p>
            <p style=\"color: #333; font-size: 1.1rem;\">Wir freuen uns auf die Zusammenarbeit mit dir!</p>
        `;
    } else if (service && service.toLowerCase() === "lohnanalyse telefon") {
        customMessage = `
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Vielen Dank für deine Bestellung!<br />
            Es freut uns, dich bei der Einschätzung deines Lohnes unterstützen zu dürfen.</p>
            <h2 style=\"color: #204878; font-size: 1.1rem; margin-bottom: 12px;\">Wie geht es weiter?</h2>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Über den folgenden Link kannst du direkt einen Termin für das Gespräch buchen.<br />
            <a href=\"https://calendly.com/armend-cvolution/lohnanalyse\" style=\"color: #204878; text-decoration: underline; font-weight: bold;\" target=\"_blank\">Termin buchen</a></p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Bitte sende uns zudem eine aktuelle Lohnabrechnung sowie eine Übersicht der dir gebotenen Benefits zu.</p>
            <p style=\"color: #333; font-size: 1.1rem;\">Wir freuen uns auf die Zusammenarbeit mit dir!</p>
        `;
    } else if (service && service.toLowerCase() === "lohnanalyse pdf") {
        customMessage = `
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Vielen Dank für deine Bestellung!<br />
            Es freut uns, dich bei der Einschätzung deines Lohnes unterstützen zu dürfen.</p>
            <h2 style=\"color: #204878; font-size: 1.1rem; margin-bottom: 12px;\">Wie geht es weiter?</h2>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Wir haben deine Angaben und Unterlagen erhalten und werden diese analysieren.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Du erhältst deine Lohnanalyse als PDF-Dokument innerhalb von 24 Stunden per E-Mail.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Bei Fragen oder Unklarheiten kannst du dich jederzeit an uns wenden unter <a href=\"mailto:info@cvolution.ch\" style=\"color: #204878; text-decoration: underline;\">info@cvolution.ch</a> oder telefonisch unter <a href=\"tel:+41764405151\" style=\"color: #204878; text-decoration: underline;\">076 440 51 51</a>.</p>
            <p style=\"color: #333; font-size: 1.1rem;\">Wir freuen uns auf die Zusammenarbeit mit dir!</p>
        `;
    } else if (service && service.toLowerCase() === "laufbahnberatung") {
        customMessage = `
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Vielen Dank für deine Bestellung!<br />
            Wir freuen uns, dich auf deinem beruflichen Weg begleiten zu dürfen.</p>
            <h2 style=\"color: #204878; font-size: 1.1rem; margin-bottom: 12px;\">Wie geht es weiter?</h2>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Über den folgenden Link kannst du direkt einen Termin für das Erstgespräch buchen.<br />
            <a href=\"https://calendly.com/armend-cvolution/kennenlern-gesprach\" style=\"color: #204878; text-decoration: underline; font-weight: bold;\" target=\"_blank\">Termin buchen</a></p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Bitte sende uns vorab, falls vorhanden, deinen aktuellen Lebenslauf oder relevante Unterlagen per E-Mail an <a href=\"mailto:info@cvolution.ch\" style=\"color: #204878; text-decoration: underline;\">info@cvolution.ch</a>.</p>
            <p style=\"color: #333; font-size: 1.1rem;\">Wir freuen uns auf die Zusammenarbeit mit dir!</p>
        `;
    } else if (service && service.toLowerCase() === "bewerbungsunterlagen-check") {
        customMessage = `
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Vielen Dank für deine Bestellung!<br />
            Es freut uns, dass wir dein Bewerbungsdossier prüfen dürfen.</p>
            <h2 style=\"color: #204878; font-size: 1.1rem; margin-bottom: 12px;\">Wie geht es weiter?</h2>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Sende uns dein Bewerbungsdossier als PDF zu.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Wir werden dieses prüfen und dir per Mail eine ausführliche Rückmeldung zukommen lassen. Solltest du im Nachgang noch Fragen oder Unklarheiten haben, darfst du dich gerne melden.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Sende uns bitte dein aktuelles Bewerbungsdossier per E-Mail an <a href=\"mailto:info@cvolution.ch\" style=\"color: #204878; text-decoration: underline;\">info@cvolution.ch</a>.</p>
            <p style=\"color: #333; font-size: 1.1rem;\">Wir freuen uns auf die Zusammenarbeit mit dir!</p>
        `;
    } else if (service && service.toLowerCase() === "motivationsschreiben") {
        customMessage = `
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Vielen Dank für deine Bestellung!</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Es freut uns sehr, dass wir dein Motivationsschreiben für dich erstellen dürfen.</p>
            <h2 style=\"color: #204878; font-size: 1.1rem; margin-bottom: 12px;\">Wie geht es weiter?</h2>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Sende uns bitte das Stelleninserat zu, auf das du dich bewerben möchtest. Wenn du uns zusätzlich deinen Lebenslauf oder dein LinkedIn-Profil übermittelst, können wir ein noch passgenaueres Schreiben für dich erstellen.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Die Dokumente kannst du uns per E-Mail an <a href=\"mailto:info@cvolution.ch\" style=\"color: #204878; text-decoration: underline;\">info@cvolution.ch</a> senden.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Dein Motivationsschreiben erhältst du innerhalb von 2 Arbeitstagen nach Auftragseingang.</p>
            <p style=\"color: #333; font-size: 1.1rem;\">Wir freuen uns auf die Zusammenarbeit mit dir!</p>
        `;
    }
    await resend.emails.send({
        from: "CVolution <info@cvolution.ch>",
        to: email,
        subject: "Bestellbestätigung",
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 32px;">
                <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(32,72,120,0.08); padding: 32px 24px; text-align: center;">
                    <img src="https://cvolution.ch/images/logo.png" alt="CVolution Logo" style="width: 80px; margin-bottom: 24px;" />
                    <h1 style="color: #204878; font-size: 2rem; margin-bottom: 16px;">Vielen Dank für deine Bestellung!</h1>
                    ${customMessage}
                    <div style="margin: 32px 0;">
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#22c55e" style="display: block; margin: 0 auto;">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p style="color: #888; font-size: 0.95rem;">Du erhälst in Kürze weitere Informationen per E-Mail.<br/>Ihr CVolution Team</p>
                    <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
                    <a href="https://cvolution.ch" style="color: #204878; text-decoration: none; font-weight: bold;">www.cvolution.ch</a>
                </div>
            </div>
        `
    });
}