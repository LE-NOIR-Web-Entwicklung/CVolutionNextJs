"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CalendarCheck, Mail, MapPin, Phone } from "lucide-react";

const CONTACT_CHANNELS = [
  { icon: Mail, label: "E-Mail", value: "info@cvolution.ch", href: "mailto:info@cvolution.ch" },
  { icon: Phone, label: "Telefon", value: "+41 76 440 51 51", href: "tel:+41764405151" },
  {
    icon: MapPin,
    label: "Adresse",
    value: "Ausserfeldstrasse 9, 5036 Oberentfelden",
    href: "https://maps.app.goo.gl/w6xbQW3mxBxoj6sa8",
    external: true,
  },
];

function ContactPage() {
  const searchParams = useSearchParams();
  const subjectFromParams = searchParams?.get("subject") || "";
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: subjectFromParams,
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.subject.trim() !== "" &&
    formData.message.trim() !== "" &&
    isPrivacyChecked;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.subject,
          message: formData.message,
        }),
      });
      if (res.ok) {
        setSubmitSuccess("Ihre Nachricht wurde erfolgreich versendet.");
        setFormData({
          name: "",
          email: "",
          subject: subjectFromParams,
          message: "",
        });
        setIsPrivacyChecked(false);
      } else {
        const data = await res.json();
        setSubmitError(data.message || "Fehler beim Senden der Nachricht.");
      }
    } catch (error) {
      console.log(error);
      setSubmitError("Fehler beim Senden der Nachricht." );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#d5e1ee] bg-white px-4 py-3 text-sm text-[#111827] shadow-sm shadow-[#173d66]/[0.02] transition placeholder:text-[#94a3b8] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#204878]";
  const labelClass = "mb-2 block text-sm font-semibold text-[#101828]";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <section className="relative isolate px-5 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_50%_0%,rgba(32,72,120,0.14),transparent_34%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h1 className="text-4xl font-bold leading-tight text-[#101828] text-balance sm:text-5xl">
              Kontaktieren Sie uns
            </h1>
            <p className="mt-4 text-base leading-7 text-[#4f5d72] text-pretty">
              Wir freuen uns, von Ihnen zu hören.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
          <aside className="flex flex-col gap-6 rounded-2xl bg-[#173d66] p-7 text-white shadow-[0_1.5rem_4rem_rgba(15,37,65,0.14)] sm:p-8">
            <div>
              <h2 className="text-xl font-bold">Direkter Kontakt</h2>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Wir antworten in der Regel innerhalb eines Werktags.
              </p>
            </div>
            <ul className="flex flex-col gap-4">
              {CONTACT_CHANNELS.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-start gap-3"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 transition group-hover:bg-white/20">
                      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium uppercase tracking-wider text-white/70">{label}</span>
                      <span className="block text-sm font-semibold text-white group-hover:underline underline-offset-2">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/15 pt-6">
              <p className="text-sm font-semibold">Lieber direkt buchen?</p>
              <p className="mt-1 text-sm leading-6 text-white/80">
                Alle Leistungen mit Preisen finden Sie in unserem Angebot.
              </p>
              <Link
                href="/service"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#173d66] transition hover:-translate-y-0.5 hover:bg-[#f4f7fb]"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Angebot ansehen
              </Link>
            </div>
          </aside>

          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1.5rem_4rem_rgba(15,37,65,0.09)] ring-1 ring-[#dce5ef]">
            <div className="p-7 sm:p-9">
            {submitSuccess && (
              <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700">
                {submitSuccess}
              </div>
            )}
            {submitError && (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
                {submitError}
              </div>
            )}

            <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="E-Mail Adresse"
                  required
                />
              </div>

              {/* Subject Field */}
              <div className="md:col-span-2">
                <label htmlFor="subject" className={labelClass}>
                  Betreff
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  readOnly={!!subjectFromParams}
                  className={`${inputClass} ${
                    subjectFromParams ? "cursor-not-allowed bg-[#f8fafc]" : ""
                  }`}
                  placeholder="Betreff"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="md:col-span-2">
                <label htmlFor="message" className={labelClass}>
                  Nachricht
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`${inputClass} min-h-32 resize-y`}
                  placeholder="Ihre Nachricht an uns"
                  required
                ></textarea>
              </div>

              {/* Datenschutz Checkbox */}
              <div className="flex items-start gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  checked={isPrivacyChecked}
                  onChange={(e) => setIsPrivacyChecked(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-[#cbd9e8] text-[#204878] focus:ring-[#204878]"
                />
                <label htmlFor="privacy" className="text-sm leading-6 text-[#4f5d72]">
                  Ich bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden. Details in der{" "}
                  <a href="/data" target="_blank" className="font-medium text-[#204878] underline-offset-2 hover:underline">
                    Datenschutzerklärung
                  </a>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full rounded-lg px-6 py-3 text-sm font-semibold transition duration-200 ${
                    isFormValid && !isSubmitting
                      ? "bg-[#204878] text-white shadow-lg shadow-[#204878]/20 hover:-translate-y-0.5 hover:bg-[#173d66] active:translate-y-0"
                      : "cursor-not-allowed bg-[#eef2f7] text-[#94a3b8]"
                  }`}
                >
                  {isSubmitting ? "Wird gesendet..." : "Senden"}
                </button>
              </div>
            </form>
            </div>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Contact() {
  return (
    <Suspense>
      <ContactPage />
    </Suspense>
  );
}
