import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "../../../../lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, service, address, postalCode, message } = body;

    if (!name || !email || !service || !address || !postalCode || !message) {
      return NextResponse.json({ message: "Alle Felder sind erforderlich." }, { status: 400 });
    }

    await sendEmail(name, email, service, address, postalCode, message);

    return NextResponse.json({ message: "Nachricht erfolgreich gesendet." }, { status: 200 });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json({ message: "Fehler beim Senden der Nachricht." }, { status: 500 });
  }
}
