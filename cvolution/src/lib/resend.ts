import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(email: string, service: string) {
  await resend.emails.send({
    from: "CVolution <noreply@cvolution.ch>",
    to: email,
    subject: "Ihre Anfrage bei CVolution",
    html: `
      <p>Guten Tag,</p>
      <p>vielen Dank für Ihre Anfrage bezüglich <strong>${service}</strong>.</p>
      <p>Wir melden uns in Kürze bei Ihnen.</p>
      <p>Freundliche Grüsse<br/>CVolution GmbH</p>
    `,
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  service: string;
  address: string;
  postalCode: string;
  message: string;
}) {
  await resend.emails.send({
    from: "CVolution Kontaktformular <noreply@cvolution.ch>",
    to: "info@cvolution.ch",
    replyTo: data.email,
    subject: `Neue Kontaktanfrage: ${data.service}`,
    html: `
      <h2>Neue Kontaktanfrage</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>E-Mail:</strong> ${data.email}</p>
      <p><strong>Betreff:</strong> ${data.service}</p>
      <p><strong>Adresse:</strong> ${data.address}</p>
      <p><strong>PLZ / Ort:</strong> ${data.postalCode}</p>
      <hr/>
      <p><strong>Nachricht:</strong></p>
      <p>${data.message.replace(/\n/g, "<br/>")}</p>
    `,
  });
}
