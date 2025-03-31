"use client";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#204878] text-white flex items-center justify-center">
      <div className="container max-w-lg mx-auto p-8 bg-[#1a3a66] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Kontaktieren Sie uns</h1>
        <form className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E-Mail Adresse"
              required
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Betreff
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Betreff"
              required
            />
          </div>

          {/* Street + Nr Field */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              Strasse + Nr
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Strasse + Hausnummer"
              required
            />
          </div>

          {/* Postal Code Field */}
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
              PLZ + Ort
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="PLZ + Ort" 
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Nachricht
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ihre Nachricht an uns"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Senden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}