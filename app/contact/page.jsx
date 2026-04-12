"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  ArrowRight,
  Check,
  Phone,
  Clock,
  Mail,
  MapPin,
} from "lucide-react";

// Configuration
const config = {
  whatsapp: {
    number: "923324641368",
    message: "Hi! I'd like to get in touch. Here are my details:",
  },
  contact: {
    email: "altajstyles@gmail.com",
    phone: "+923324641368",
    address: "Lahore, Pakistan",
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const whatsappMessage =
      `${config.whatsapp.message}\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Message: ${formData.message}`;

    const whatsappUrl = `https://wa.me/${config.whatsapp.number}?text=${encodeURIComponent(whatsappMessage)}`;

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  return (
    <>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div
        className="relative w-full h-[calc(100dvh-40px)] md:h-[calc(100dvh-48px)] overflow-hidden font-sans selection:bg-amber-400 selection:text-blue-900 no-scrollbar flex flex-col"
        style={{ backgroundColor: "#1D4ED8" }} // Blue 700
      >
        <div className="flex-1 flex flex-col justify-center px-6 py-10 md:py-16">
          <div className="mx-auto w-full max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1
                className="text-3xl font-black uppercase tracking-tight text-white md:text-5xl"
                style={{ fontFamily: "'Krona One', sans-serif" }}
              >
                Contact <span className="text-amber-300">Us</span>
              </h1>
              <p className="mt-3 mx-auto max-w-xl text-sm font-bold uppercase tracking-widest text-blue-100">
                Have a question or want to work together? Send us a message.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Left: Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-4 border-2 border-white bg-white/15 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-amber-300 text-blue-900 border-2 border-white">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-0.5">
                      Email
                    </div>
                    <a
                      href={`mailto:${config.contact.email}`}
                      className="text-sm font-bold text-white hover:text-amber-300 transition-colors"
                    >
                      {config.contact.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-2 border-white bg-white/15 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-400 text-blue-900 border-2 border-white">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-0.5">
                      Phone
                    </div>
                    <a
                      href={`tel:${config.contact.phone}`}
                      className="text-sm font-bold text-white hover:text-emerald-300 transition-colors"
                    >
                      {config.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-2 border-white bg-white/15 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-rose-400 text-blue-900 border-2 border-white">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-0.5">
                      Address
                    </div>
                    <div className="text-sm font-bold text-white">
                      {config.contact.address}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Contact Form */}
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                onSubmit={handleSubmit}
                className="border-2 border-white p-6 flex flex-col"
                style={{ backgroundColor: "#1E40AF" }} // Blue 800
              >
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-blue-100">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border-2 border-white/30 py-2.5 px-3 text-sm font-bold text-white placeholder-white/40 focus:border-amber-300 focus:outline-none transition-colors"
                      style={{ backgroundColor: "#1D4ED8" }} // Blue 700
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-blue-100">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border-2 border-white/30 py-2.5 px-3 text-sm font-bold text-white placeholder-white/40 focus:border-amber-300 focus:outline-none transition-colors"
                      style={{ backgroundColor: "#1D4ED8" }}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-blue-100">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full border-2 border-white/30 py-2.5 px-3 text-sm font-bold text-white placeholder-white/40 focus:border-amber-300 focus:outline-none transition-colors resize-none"
                      style={{ backgroundColor: "#1D4ED8" }}
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex items-center justify-center gap-3 border-2 border-white bg-amber-300 px-6 py-3 font-black uppercase tracking-widest text-sm text-blue-900 transition-all hover:bg-amber-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-blue-900 border-t-transparent"
                        />
                        Opening WhatsApp...
                      </>
                    ) : (
                      <>
                        Send via WhatsApp
                        <MessageCircle size={18} />
                        <ArrowRight
                          size={14}
                          className="absolute right-6 opacity-0 transition-all group-hover:opacity-100 group-hover:right-4"
                        />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-8 right-8 z-50 flex items-center gap-3 border-2 border-blue-900 px-5 py-3 shadow-lg bg-amber-300"
            >
              <Check size={18} className="text-blue-900" />
              <span className="text-sm font-black text-blue-900 uppercase tracking-widest">
                Opening WhatsApp...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
