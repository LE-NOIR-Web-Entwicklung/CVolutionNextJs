"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Contact() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "";
  const [isAgbChecked, setIsAgbChecked] = useState(false); // State for the checkbox

  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center">
      <div className="container max-w-lg mx-auto p-6 bg-[#f9f9f9] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#204878]">
          Kontaktieren Sie uns
        </h1>
        <form className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-lg font-bold mb-2 text-[#204878]">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#204878]"
              placeholder="Name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-lg font-bold mb-2 text-[#204878]">
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#204878]"
              placeholder="E-Mail Adresse"
              required
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-lg font-bold mb-2 text-[#204878]">
              Betreff
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject || undefined} // Use `value` only if `subject` is pre-filled
              defaultValue={!subject ? "" : undefined} // Use `defaultValue` if `subject` is not pre-filled
              readOnly={!!subject} // Make the field readonly only if `subject` is pre-filled
              className={`w-full px-4 py-2 border rounded-lg ${
                subject ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              } focus:outline-none focus:ring-2 focus:ring-[#204878]`}
              placeholder="Betreff"
              required
            />
          </div>

          {/* Street + Nr Field */}
          <div>
            <label htmlFor="address" className="block text-lg font-bold mb-2 text-[#204878]">
              Strasse + Nr
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#204878]"
              placeholder="Strasse + Hausnummer"
              required
            />
          </div>

          {/* Postal Code Field */}
          <div>
            <label htmlFor="postalCode" className="block text-lg font-bold mb-2 text-[#204878]">
              PLZ + Ort
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              className="w-full bg-white px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#204878]"
              placeholder="PLZ + Ort"
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-lg font-bold mb-2 text-[#204878]">
              Nachricht
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#204878]"
              placeholder="Ihre Nachricht an uns"
              required
            ></textarea>
          </div>

          {/* AGB Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agb"
              name="agb"
              checked={isAgbChecked}
              onChange={(e) => setIsAgbChecked(e.target.checked)} // Update state on change
              className="w-5 h-5 text-[#204878] border-gray-300 mr-4 rounded focus:ring-[#204878]"
            />
            <label htmlFor="agb" className="text-sm text-gray-800">
              Ich habe die{" "}
              <a href="/agb" target="_blank" className="text-[#204878] underline">
                AGB
              </a>{" "}
              gelesen und akzeptiere sie.
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!isAgbChecked} // Disable button if checkbox is not checked
              className={`w-full px-6 py-3 font-bold rounded-lg transition duration-300 ${
                isAgbChecked
                  ? "bg-[#204878] text-white hover:bg-[#4c6c93]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Senden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}