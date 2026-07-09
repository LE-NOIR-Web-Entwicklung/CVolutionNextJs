import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend() {
    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
}

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
    remarks?: string,
    couponCode?: string | null,
    phone?: string,
    workload?: string
) => {
    // Build additional fields HTML for PDF service
    let additionalFieldsHtml = '';
    if (firstName || lastName || birthDate || workLocation || grossAnnualSalary || workload || fringeBenefits || linkedinUrl || remarks) {
        const detailsTitle = grossAnnualSalary || birthDate || workLocation ? "Lohnanalyse Details:" : "Bestelldetails:";
        additionalFieldsHtml = `
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <h3 style="color: #204878; font-size: 1.2rem; margin-bottom: 12px;">${detailsTitle}</h3>
                ${firstName ? `<p style='color: #333; font-size: 1.1rem;'><strong>Vorname:</strong> ${firstName}</p>` : ""}
                ${lastName ? `<p style='color: #333; font-size: 1.1rem;'><strong>Nachname:</strong> ${lastName}</p>` : ""}
                ${birthDate ? `<p style='color: #333; font-size: 1.1rem;'><strong>Geburtsdatum:</strong> ${birthDate}</p>` : ""}
                ${workLocation ? `<p style='color: #333; font-size: 1.1rem;'><strong>Arbeitsort:</strong> ${workLocation}</p>` : ""}
                ${grossAnnualSalary ? `<p style='color: #333; font-size: 1.1rem;'><strong>Bruttojahreslohn:</strong> ${grossAnnualSalary}</p>` : ""}
                ${workload ? `<p style='color: #333; font-size: 1.1rem;'><strong>Pensum:</strong> ${workload}</p>` : ""}
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
                        ${phone ? `<p style="color: #333; font-size: 1.1rem;"><strong>Telefon:</strong> ${phone}</p>` : ""}
                        <p style="color: #333; font-size: 1.1rem;"><strong>Service:</strong> ${service}</p>
                        ${address ? `<p style='color: #333; font-size: 1.1rem;'><strong>Strasse + Nr:</strong> ${address}</p>` : ""}
                        ${postalCode ? `<p style='color: #333; font-size: 1.1rem;'><strong>PLZ + Ort:</strong> ${postalCode}</p>` : ""}
                        ${message ? `<p style='color: #333; font-size: 1.1rem;'><strong>Nachricht:</strong> ${message}</p>` : ""}
                        ${couponCode ? `<p style='color: #333; font-size: 1.1rem;'><strong>Coupon Code:</strong> ${couponCode}</p>` : ""}
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

    await getResend().emails.send(emailData);
};



export const sendConfirmationEmail = async (email: string, service: string) => {
    let customMessage = `<p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen melden.</p>`;
    console.log('Sending confirmation email to:', email);
    console.log('With service:', service);
    console.log(service && service.toLowerCase() === "lebenslauf");
    if (service && service.toLowerCase() === "lebenslauf") {
        customMessage = `
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Vielen Dank für deine Bestellung!<br />
            Es freut uns, dass du mit unserer Unterstützung den nächsten Karriereschritt gehen möchtest.</p>
            <h2 style=\"color: #204878; font-size: 1.1rem; margin-bottom: 12px;\">Wie geht es weiter?</h2>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 12px;\">Im Anhang findest du unsere 4 Topseller-Lebensläufe. Welche dürfen wir für dich erstellen?</p>
            <p style=\"margin-bottom: 16px;\">
              <a href=\"https://1drv.ms/f/c/b90389d448c1c616/EhXyumsKpldDpvb6DOnDYPoBcQw-_mBWn4wzybsuTFpSZQ?e=2haAaD\" style=\"display: inline-block; background-color: #204878; color: #ffffff; text-decoration: none; font-weight: 700; padding: 12px 20px; border-radius: 8px;\" target=\"_blank\" rel=\"noopener noreferrer\">Lebensläufe ansehen</a>
            </p>
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
            <p style=\"color: #333; font-size: 1.1rem;\">Wir freuen uns auf die Zusammenarbeit mit dir!</p>
        `;
    } else if (service && service.toLowerCase() === "lohnanalyse pdf") {
        customMessage = `
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Vielen Dank für deine Bestellung!<br />
            Es freut uns, dich bei der Einschätzung deines Lohnes unterstützen zu dürfen.</p>
            <h2 style=\"color: #204878; font-size: 1.1rem; margin-bottom: 12px;\">Wie geht es weiter?</h2>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Wir haben deine Angaben und Unterlagen erhalten und werden diese analysieren.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Du erhältst deine Lohnanalyse als PDF-Dokument innerhalb von 2 Arbeitstagen per E-Mail.</p>
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
    } else if (service && service.toLowerCase().startsWith("bewerbungsunterlagen-check")) {
        customMessage = `
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Vielen Dank für deine Bestellung!<br />
            Es freut uns, dass wir dein Bewerbungsdossier prüfen dürfen.</p>
            <h2 style=\"color: #204878; font-size: 1.1rem; margin-bottom: 12px;\">Wie geht es weiter?</h2>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Falls du dein Bewerbungsdossier im Checkout bereits hochgeladen hast, ist nichts weiter nötig.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Falls noch Unterlagen fehlen, sende sie uns bitte per E-Mail an <a href=\"mailto:info@cvolution.ch\" style=\"color: #204878; text-decoration: underline;\">info@cvolution.ch</a>.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Wir werden dein Dossier prüfen und dir per Mail eine ausführliche Rückmeldung zukommen lassen. Solltest du im Nachgang noch Fragen oder Unklarheiten haben, darfst du dich gerne melden.</p>
            <p style=\"color: #333; font-size: 1.1rem;\">Wir freuen uns auf die Zusammenarbeit mit dir!</p>
        `;
    } else if (service && service.toLowerCase() === "linkedin profil optimierung") {
        customMessage = `
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 24px;\">Vielen Dank für deine Bestellung!<br />
            Es freut uns, dass wir dein LinkedIn-Profil für die Stellensuche optimieren dürfen.</p>
            <h2 style=\"color: #204878; font-size: 1.1rem; margin-bottom: 12px;\">Wie geht es weiter?</h2>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Wir prüfen dein Profil, schärfen deine Positionierung und erarbeiten ansprechende Formulierungen für Headline, Info-Bereich und relevante Stationen.</p>
            <p style=\"color: #333; font-size: 1.1rem; margin-bottom: 16px;\">Falls du zusätzlich einen aktuellen Lebenslauf, ein Wunschstelleninserat oder besondere Zielrollen hast, kannst du uns diese Unterlagen gerne per E-Mail an <a href=\"mailto:info@cvolution.ch\" style=\"color: #204878; text-decoration: underline;\">info@cvolution.ch</a> senden.</p>
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
    await getResend().emails.send({
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

type CartOrderEmailItem = {
    id?: string;
    name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    service_label: string;
    service_type?: string | null;
    original_price?: number | null;
    final_price?: number | null;
    coupon_code?: string | null;
    birth_date?: string | null;
    work_location?: string | null;
    gross_annual_salary?: string | null;
    workload?: string | null;
    fringe_benefits?: string | null;
    linkedin_url?: string | null;
    remarks?: string | null;
    cv_file_base64?: string | null;
    cv_file_name?: string | null;
    salary_file_base64?: string | null;
    salary_file_name?: string | null;
    check_files?: unknown;
};

type SelfServiceInfoEmailData = {
    fullName?: string | null;
    email: string;
    phone?: string | null;
    userId?: string | null;
    orderId?: string | null;
    service?: string | null;
    amount?: number | string | null;
    paidAt?: string | null;
    subscriptionCurrentPeriodEnd?: string | null;
    transactionId?: string | null;
};

type CartEmailDisplayItem = {
    orders: CartOrderEmailItem[];
    serviceLabel: string;
    originalPrice: number;
    finalPrice: number;
    selectedCheckDocuments: string[];
};

type UploadedOrderFile = {
    fileName: string;
    fileBase64: string;
};

const CONTACT_PHONE_REMARKS_PREFIX = "[contact_phone]";
const CHECK_DOCUMENT_REMARKS_PREFIX = "Unterlage:";

function formatCurrency(value: unknown) {
    const numberValue = Number(value || 0);
    return `CHF ${numberValue.toFixed(2)}`;
}

function escapeHtml(value: unknown) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getString(value: unknown) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeOrderUploadedFiles(value: unknown): UploadedOrderFile[] {
    if (!value) return [];

    let parsedValue = value;
    if (typeof value === "string") {
        try {
            parsedValue = JSON.parse(value);
        } catch {
            return [];
        }
    }

    if (!Array.isArray(parsedValue)) return [];

    return parsedValue
        .map((file) => {
            if (!file || typeof file !== "object") return null;

            const candidate = file as Record<string, unknown>;
            const fileName = getString(candidate.fileName ?? candidate.filename);
            const fileBase64 = getString(candidate.fileBase64 ?? candidate.content);
            if (!fileName || !fileBase64) return null;

            return { fileName, fileBase64 };
        })
        .filter((file): file is UploadedOrderFile => Boolean(file));
}

function formatDateTime(value?: string | null) {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("de-CH", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Zurich",
    }).format(date);
}

function renderInfoRow(label: string, value: unknown) {
    if (value === null || value === undefined || value === "") return "";

    return `<p style="color: #333; font-size: 1rem;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function getDisplayName(order: CartOrderEmailItem) {
    if (order.first_name || order.last_name) {
        return [order.first_name, order.last_name].filter(Boolean).join(" ");
    }
    return order.name || "Unbekannt";
}

function getContactPhoneFromRemarks(remarks?: string | null) {
    if (!remarks) return null;
    const phoneLine = remarks
        .split("\n")
        .find((line) => line.startsWith(CONTACT_PHONE_REMARKS_PREFIX));
    return phoneLine?.replace(CONTACT_PHONE_REMARKS_PREFIX, "").trim() || null;
}

function getCleanRemarks(remarks?: string | null) {
    if (!remarks) return null;
    const cleanRemarks = remarks
        .split("\n")
        .filter((line) =>
            !line.startsWith(CONTACT_PHONE_REMARKS_PREFIX)
            && !line.startsWith(CHECK_DOCUMENT_REMARKS_PREFIX)
        )
        .join("\n")
        .trim();
    return cleanRemarks || null;
}

function getCheckDocumentSelection(order: CartOrderEmailItem) {
    if (order.service_type !== "check" && !order.service_label.toLowerCase().startsWith("bewerbungsunterlagen-check")) {
        return null;
    }

    const labelSelection = order.service_label.match(/^Bewerbungsunterlagen-Check:\s*(.+)$/i)?.[1]?.trim();
    if (labelSelection) return labelSelection;

    const remarksSelection = order.remarks
        ?.split("\n")
        .find((line) => line.startsWith(CHECK_DOCUMENT_REMARKS_PREFIX))
        ?.replace(CHECK_DOCUMENT_REMARKS_PREFIX, "")
        .trim();

    return remarksSelection || null;
}

function getEmailServiceLabel(order: CartOrderEmailItem) {
    return getCheckDocumentSelection(order) ? "Bewerbungsunterlagen-Check" : order.service_label;
}

function getUniqueCleanRemarks(orders: CartOrderEmailItem[]) {
    const remarks = orders
        .map((order) => getCleanRemarks(order.remarks))
        .filter((value): value is string => Boolean(value));

    return Array.from(new Set(remarks)).join("\n\n") || null;
}

function buildCartEmailDisplayItems(orders: CartOrderEmailItem[]): CartEmailDisplayItem[] {
    const displayItems: CartEmailDisplayItem[] = [];
    let checkItemIndex = -1;

    orders.forEach((order) => {
        const selectedCheckDocument = getCheckDocumentSelection(order);
        const originalPrice = Number(order.original_price || 0);
        const finalPrice = Number(order.final_price || 0);

        if (selectedCheckDocument) {
            if (checkItemIndex === -1) {
                checkItemIndex = displayItems.length;
                displayItems.push({
                    orders: [],
                    serviceLabel: "Bewerbungsunterlagen-Check",
                    originalPrice: 0,
                    finalPrice: 0,
                    selectedCheckDocuments: [],
                });
            }

            const checkItem = displayItems[checkItemIndex];
            checkItem.orders.push(order);
            checkItem.originalPrice += originalPrice;
            checkItem.finalPrice += finalPrice;
            checkItem.selectedCheckDocuments.push(selectedCheckDocument);
            return;
        }

        displayItems.push({
            orders: [order],
            serviceLabel: getEmailServiceLabel(order),
            originalPrice,
            finalPrice,
            selectedCheckDocuments: [],
        });
    });

    if (checkItemIndex !== -1) {
        const checkItem = displayItems[checkItemIndex];
        checkItem.selectedCheckDocuments = Array.from(new Set(checkItem.selectedCheckDocuments));
    }

    return displayItems;
}

export const sendSelfServiceInfoEmail = async (data: SelfServiceInfoEmailData) => {
    const displayName = data.fullName?.trim() || data.email;
    const paidAt = formatDateTime(data.paidAt);
    const subscriptionEnd = formatDateTime(data.subscriptionCurrentPeriodEnd);

    await getResend().emails.send({
        from: "CVolution <info@cvolution.ch>",
        to: "info@cvolution.ch",
        replyTo: data.email,
        subject: `Neue Self-Service-Buchung: ${displayName}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 32px;">
                <div style="max-width: 640px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(32,72,120,0.08); padding: 32px 24px; text-align: left;">
                    <img src="https://cvolution.ch/images/logo.png" alt="CVolution Logo" style="width: 80px; margin-bottom: 24px; display: block; margin-left: auto; margin-right: auto;" />
                    <h1 style="color: #204878; font-size: 1.5rem; margin-bottom: 16px; text-align: center;">Neue Self-Service-Buchung</h1>
                    <div style="margin-bottom: 24px;">
                        ${renderInfoRow("Name / Vorname", displayName)}
                        ${renderInfoRow("E-Mail", data.email)}
                        ${renderInfoRow("Telefon", data.phone)}
                        ${renderInfoRow("Service", data.service || "Self-Service Abo")}
                        ${renderInfoRow("Betrag", formatCurrency(data.amount))}
                        ${renderInfoRow("Bezahlt am", paidAt)}
                        ${renderInfoRow("Abo gültig bis", subscriptionEnd)}
                        ${renderInfoRow("User ID", data.userId)}
                        ${renderInfoRow("Order ID", data.orderId)}
                        ${renderInfoRow("Transaktion", data.transactionId)}
                    </div>
                    <p style="color: #888; font-size: 0.95rem; text-align: center;">Diese Self-Service-Buchung wurde nach erfolgreicher Saferpay-Zahlung automatisch gemeldet.</p>
                    <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
                    <a href="https://cvolution.ch" style="color: #204878; text-decoration: none; font-weight: bold; text-align: center; display: block;">www.cvolution.ch</a>
                </div>
            </div>
        `,
    });
};

function getCheckUploadedFiles(orders: CartOrderEmailItem[]) {
    return orders.flatMap((order) => normalizeOrderUploadedFiles(order.check_files));
}

function getServiceNextStepsHtml(item: CartEmailDisplayItem) {
    const lowerService = item.serviceLabel.toLowerCase();
    if (lowerService === "lebenslauf") {
        return `
            <span style="color:#64748B; display:block; margin-bottom:10px;">Sieh dir unsere 4 Topseller-Lebensläufe an und teile uns mit, welche Vorlage wir für dich erstellen dürfen:</span>
            <a href="https://1drv.ms/f/c/b90389d448c1c616/EhXyumsKpldDpvb6DOnDYPoBcQw-_mBWn4wzybsuTFpSZQ?e=2haAaD" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:#204878; color:#ffffff; text-decoration:none; font-weight:600; font-size:0.95rem; padding:10px 16px; border-radius:8px; margin-bottom:10px;">Lebensläufe ansehen</a>
            <span style="color:#64748B; display:block;">Bitte sende uns deinen aktuellen Lebenslauf oder den Link zu deinem LinkedIn-Profil per E-Mail an info@cvolution.ch. Falls vorhanden, helfen auch Arbeitszeugnisse.</span>
        `;
    }
    if (lowerService === "lohnanalyse telefon") {
        return `
            <span style="color:#64748B; display:block; margin-bottom:10px;">Bitte buche deinen Termin für die telefonische Besprechung:</span>
            <a href="https://calendly.com/armend-cvolution/lohnanalyse" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:#204878; color:#ffffff; text-decoration:none; font-weight:600; font-size:0.95rem; padding:10px 16px; border-radius:8px;">Termin buchen</a>
        `;
    }
    if (lowerService === "lohnanalyse pdf") {
        return "<span style='color:#64748B;'>Wir analysieren deine Angaben und senden dir deine Lohnanalyse als PDF innerhalb von 2 Arbeitstagen per E-Mail.</span>";
    }
    if (lowerService === "laufbahnberatung") {
        return `
            <span style="color:#64748B; display:block; margin-bottom:10px;">Bitte buche deinen Termin für das Erstgespräch. Sende uns vorab gerne relevante Unterlagen.</span>
            <a href="https://calendly.com/armend-cvolution/kennenlern-gesprach" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:#204878; color:#ffffff; text-decoration:none; font-weight:600; font-size:0.95rem; padding:10px 16px; border-radius:8px;">Termin buchen</a>
        `;
    }
    if (lowerService.startsWith("bewerbungsunterlagen-check")) {
        if (getCheckUploadedFiles(item.orders).length > 0) {
            return "<span style='color:#64748B;'>Wir haben deine hochgeladenen Unterlagen erhalten und prüfen dein Dossier. Du erhältst unsere Rückmeldung per E-Mail.</span>";
        }
        return "<span style='color:#64748B;'>Bitte sende uns dein Bewerbungsdossier als PDF an info@cvolution.ch, falls du es noch nicht übermittelt hast.</span>";
    }
    if (lowerService === "linkedin profil optimierung") {
        return "<span style='color:#64748B;'>Wir prüfen dein LinkedIn-Profil, schärfen deine Positionierung und senden dir ansprechende Formulierungen für die Stellensuche.</span>";
    }
    if (lowerService === "motivationsschreiben") {
        return "<span style='color:#64748B;'>Bitte sende uns das Stelleninserat sowie deinen Lebenslauf oder dein LinkedIn-Profil an info@cvolution.ch.</span>";
    }
    if (lowerService === "rav unterstützung") {
        return "<span style='color:#64748B;'>Wir melden uns bei dir mit den nächsten Schritten für deine RAV-Unterstützung.</span>";
    }
    return "<span style='color:#64748B;'>Wir melden uns bei dir mit den nächsten Schritten.</span>";
}

function getOrderAttachments(orders: CartOrderEmailItem[]) {
    const attachments: Array<{ filename: string; content: string }> = [];
    const seenAttachments = new Set<string>();

    function addAttachment(filename: string, content: string) {
        const key = `${filename}:${content.slice(0, 80)}`;
        if (seenAttachments.has(key)) return;

        seenAttachments.add(key);
        attachments.push({ filename, content });
    }

    orders.forEach((order, index) => {
        const prefix = `${index + 1}-${order.service_label.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        if (order.cv_file_base64 && order.cv_file_name) {
            addAttachment(
                `${prefix}-${order.cv_file_name}`,
                String(order.cv_file_base64).split(",")[1] || String(order.cv_file_base64)
            );
        }
        if (order.salary_file_base64 && order.salary_file_name) {
            addAttachment(
                `${prefix}-${order.salary_file_name}`,
                String(order.salary_file_base64).split(",")[1] || String(order.salary_file_base64)
            );
        }
        normalizeOrderUploadedFiles(order.check_files).forEach((file) => {
            addAttachment(
                `${prefix}-${file.fileName}`,
                String(file.fileBase64).split(",")[1] || String(file.fileBase64)
            );
        });
    });

    return attachments;
}

export const sendCartInfoEmail = async (orders: CartOrderEmailItem[]) => {
    if (!orders.length) return;

    const subtotal = orders.reduce((sum, order) => sum + Number(order.original_price || 0), 0);
    const total = orders.reduce((sum, order) => sum + Number(order.final_price || 0), 0);
    const couponCode = orders.find((order) => order.coupon_code)?.coupon_code;
    const attachments = getOrderAttachments(orders);
    const displayItems = buildCartEmailDisplayItems(orders);

    const orderBlocks = displayItems.map((item, index) => `
        ${(() => {
            const order = item.orders[0];
            const phone = getContactPhoneFromRemarks(order.remarks);
            const cleanRemarks = getUniqueCleanRemarks(item.orders);
            const selectedDocumentsText = item.selectedCheckDocuments.join(", ");
            const uploadedCheckFileNames = getCheckUploadedFiles(item.orders).map((file) => file.fileName);
            return `
        <div style="padding: 18px 0; border-top: 1px solid #e5e7eb;">
            <h2 style="color: #204878; font-size: 1.15rem; margin: 0 0 10px;">${index + 1}. ${escapeHtml(item.serviceLabel)}</h2>
            <p style="color: #333; font-size: 1rem;"><strong>Name:</strong> ${escapeHtml(getDisplayName(order))}</p>
            <p style="color: #333; font-size: 1rem;"><strong>E-Mail:</strong> ${escapeHtml(order.email)}</p>
            ${phone ? `<p style="color: #333; font-size: 1rem;"><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
            <p style="color: #333; font-size: 1rem;"><strong>Preis:</strong> ${formatCurrency(item.finalPrice)}${item.originalPrice !== item.finalPrice ? ` <span style="color:#64748B;">(Original ${formatCurrency(item.originalPrice)})</span>` : ""}</p>
            ${selectedDocumentsText ? `<p style="color: #333; font-size: 1rem;"><strong>Ausgewählte Unterlagen:</strong> ${escapeHtml(selectedDocumentsText)}</p>` : ""}
            ${uploadedCheckFileNames.length ? `<p style="color: #333; font-size: 1rem;"><strong>Hochgeladene Dateien:</strong> ${uploadedCheckFileNames.map(escapeHtml).join(", ")}</p>` : ""}
            ${selectedDocumentsText && !uploadedCheckFileNames.length ? `<p style="color: #333; font-size: 1rem;"><strong>Vom Kunden zu senden:</strong> Bewerbungsdossier als PDF an info@cvolution.ch</p>` : ""}
            ${order.birth_date ? `<p style="color: #333; font-size: 1rem;"><strong>Geburtsdatum:</strong> ${escapeHtml(order.birth_date)}</p>` : ""}
            ${order.work_location ? `<p style="color: #333; font-size: 1rem;"><strong>Arbeitsort:</strong> ${escapeHtml(order.work_location)}</p>` : ""}
            ${order.gross_annual_salary ? `<p style="color: #333; font-size: 1rem;"><strong>Bruttojahreslohn:</strong> ${escapeHtml(order.gross_annual_salary)}</p>` : ""}
            ${order.workload ? `<p style="color: #333; font-size: 1rem;"><strong>Pensum:</strong> ${escapeHtml(order.workload)}</p>` : ""}
            ${order.fringe_benefits ? `<p style="color: #333; font-size: 1rem;"><strong>Fringe & Benefits:</strong> ${escapeHtml(order.fringe_benefits)}</p>` : ""}
            ${order.linkedin_url ? `<p style="color: #333; font-size: 1rem;"><strong>LinkedIn:</strong> <a href="${escapeHtml(order.linkedin_url)}" style="color:#204878;">${escapeHtml(order.linkedin_url)}</a></p>` : ""}
            ${cleanRemarks ? `<p style="color: #333; font-size: 1rem;"><strong>Bemerkungen:</strong><br/>${escapeHtml(cleanRemarks).replace(/\n/g, "<br/>")}</p>` : ""}
            ${order.cv_file_name ? `<p style="color: #333; font-size: 1rem;"><strong>CV-Datei:</strong> ${escapeHtml(order.cv_file_name)}</p>` : ""}
            ${order.salary_file_name ? `<p style="color: #333; font-size: 1rem;"><strong>Lohnabrechnung:</strong> ${escapeHtml(order.salary_file_name)}</p>` : ""}
        </div>
            `;
        })()}
    `).join("");

    const emailData: {
        from: string;
        to: string;
        subject: string;
        html: string;
        attachments?: Array<{ filename: string; content: string }>;
    } = {
        from: "CVolution <info@cvolution.ch>",
        to: "info@cvolution.ch",
        subject: `Neue Warenkorb-Bestellung (${displayItems.length} Positionen)`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 32px;">
                <div style="max-width: 640px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(32,72,120,0.08); padding: 32px 24px; text-align: left;">
                    <img src="https://cvolution.ch/images/logo.png" alt="CVolution Logo" style="width: 80px; margin-bottom: 24px; display: block; margin-left: auto; margin-right: auto;" />
                    <h1 style="color: #204878; font-size: 1.5rem; margin-bottom: 16px; text-align: center;">Neue Warenkorb-Bestellung</h1>
                    <p style="color:#333; font-size:1rem;"><strong>Positionen:</strong> ${displayItems.length}</p>
                    <p style="color:#333; font-size:1rem;"><strong>Subtotal:</strong> ${formatCurrency(subtotal)}</p>
                    ${couponCode ? `<p style="color:#333; font-size:1rem;"><strong>Coupon Code:</strong> ${couponCode}</p>` : ""}
                    <p style="color:#333; font-size:1rem;"><strong>Total bezahlt:</strong> ${formatCurrency(total)}</p>
                    ${attachments.length ? `<p style="color:#333; font-size:1rem;"><strong>Anhänge:</strong> ${attachments.length} Datei(en)</p>` : ""}
                    ${orderBlocks}
                    <p style="color: #888; font-size: 0.95rem; text-align: center; margin-top: 28px;">Diese Warenkorb-Bestellung wurde über CVolution gestellt.</p>
                </div>
            </div>
        `,
    };

    if (attachments.length > 0) {
        emailData.attachments = attachments;
    }

    await getResend().emails.send(emailData);
};

export const sendCartConfirmationEmail = async (email: string, orders: CartOrderEmailItem[]) => {
    if (!orders.length) return;

    const total = orders.reduce((sum, order) => sum + Number(order.final_price || 0), 0);
    const displayItems = buildCartEmailDisplayItems(orders);
    const serviceRows = displayItems.map((item) => {
        const uploadedCheckFileNames = getCheckUploadedFiles(item.orders).map((file) => file.fileName);
        return `
        <div style="margin-bottom: 16px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
            <div style="display:flex; justify-content:space-between; gap:16px; align-items:flex-start;">
                <strong style="color:#111827; font-size:1rem;">${escapeHtml(item.serviceLabel)}</strong>
                <span style="white-space:nowrap; color:#111827;">${formatCurrency(item.finalPrice)}</span>
            </div>
            ${item.selectedCheckDocuments.length ? `<p style="color:#64748B; font-size:0.95rem; margin:10px 0 0;"><strong style="color:#334155;">Ausgewählte Unterlagen:</strong> ${escapeHtml(item.selectedCheckDocuments.join(", "))}</p>` : ""}
            ${uploadedCheckFileNames.length ? `<p style="color:#64748B; font-size:0.95rem; margin:10px 0 0;"><strong style="color:#334155;">Hochgeladen:</strong> ${uploadedCheckFileNames.map(escapeHtml).join(", ")}</p>` : ""}
            <div style="margin-top:10px;">${getServiceNextStepsHtml(item)}</div>
        </div>
    `;
    }).join("");

    await getResend().emails.send({
        from: "CVolution <info@cvolution.ch>",
        to: email,
        subject: "Bestellbestätigung",
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 32px;">
                <div style="max-width: 640px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(32,72,120,0.08); padding: 32px 24px;">
                    <img src="https://cvolution.ch/images/logo.png" alt="CVolution Logo" style="width: 80px; margin-bottom: 24px; display:block; margin-left:auto; margin-right:auto;" />
                    <h1 style="color: #204878; font-size: 2rem; margin-bottom: 16px; text-align:center;">Vielen Dank für deine Bestellung!</h1>
                    <p style="color:#333; font-size:1.1rem;">Wir haben deine Warenkorb-Bestellung erhalten.</p>
                    <h2 style="color:#204878; font-size:1.15rem; margin-top:24px;">Deine bestellten Services</h2>
                    ${serviceRows}
                    <p style="color:#333; font-size:1.1rem;"><strong>Total:</strong> ${formatCurrency(total)}</p>
                    <p style="color:#333; font-size:1.1rem;">Bei Fragen erreichst du uns unter <a href="mailto:info@cvolution.ch" style="color:#204878;">info@cvolution.ch</a> oder telefonisch unter <a href="tel:+41764405151" style="color:#204878;">076 440 51 51</a>.</p>
                    <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
                    <a href="https://cvolution.ch" style="color: #204878; text-decoration: none; font-weight: bold; text-align: center; display:block;">www.cvolution.ch</a>
                </div>
            </div>
        `,
    });
};
