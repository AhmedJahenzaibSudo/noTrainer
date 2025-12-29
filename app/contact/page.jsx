"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");
    // Simulate sending message (you can integrate with Email API later)
    setTimeout(() => {
      setStatus("✅ Message Sent Successfully!");
      setForm({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex items-center justify-center pt-30  pb-20 px-6">
      <div className="max-w-3xl w-full bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-center text-[#c2c5ca] mb-4">
          Contact Us
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Have a question or feedback? Fill out the form below and we’ll get
          back to you soon.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#c2c5ca]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#c2c5ca]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#c2c5ca]"
              placeholder="Write your message here..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#c2c5ca] hover:bg-[#b8bbc0] text-black font-semibold py-3 rounded-lg transition-all duration-200"
          >
            Send Message
          </button>

          {status && (
            <p className="text-center text-gray-400 mt-4">{status}</p>
          )}
        </form>
      </div>
    </main>
  );
}
