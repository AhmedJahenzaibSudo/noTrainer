"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  ArrowRight,
  Check,
  Phone,
  Clock,
  Mail,
  MapPin,
} from "lucide-react";

// Configuration
const config = {
  colors: {
    bgPrimary: "#0A0F3C",
    accent: "#00FFB2",
    textPrimary: "#FFFFFF",
  },
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

    // Construct WhatsApp message
    const whatsappMessage =
      `${config.whatsapp.message}\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Message: ${formData.message}`;

    // Open WhatsApp with pre-filled message
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
        className="relative min-h-screen w-full overflow-hidden font-sans selection:bg-[#00FFB2] selection:text-white"
        style={{ backgroundColor: config.colors.bgPrimary }}
      >
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] bg-[#00FFB2] blur-[140px] opacity-70"
          />
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute bottom-[-10%] right-[-10%] h-[550px] w-[550px] bg-[#FF006E] blur-[130px] opacity-40"
          />
        </div>

        {/* Header */}
        <header className="relative z-10 px-6 pt-20 pb-8 text-center md:pt-24 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl"
              style={{ fontFamily: "'Krona One', sans-serif" }}
            >
              Contact <span className="text-[#00FFB2]">Us</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg font-bold text-white/90 md:text-xl">
              Have a question or want to work together? Send us a message and
              we'll get back to you ASAP.
            </p>
          </motion.div>
        </header>

        {/* Contact Info Cards */}
        <section className="relative z-10 px-6 pb-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="grid gap-4 md:grid-cols-3"
            >
              <div className="border-2 border-white/20 bg-white/5 p-6 backdrop-blur-sm text-center">
                <Mail className="mx-auto mb-3 text-[#00FFB2]" size={24} />
                <div className="text-sm font-bold uppercase tracking-wider text-white/60 mb-1">
                  Email
                </div>
                <a
                  href={`mailto:${config.contact.email}`}
                  className="text-white font-medium hover:text-[#00FFB2] transition-colors"
                >
                  {config.contact.email}
                </a>
              </div>
              <div className="border-2 border-white/20 bg-white/5 p-6 backdrop-blur-sm text-center">
                <Phone className="mx-auto mb-3 text-[#00FFB2]" size={24} />
                <div className="text-sm font-bold uppercase tracking-wider text-white/60 mb-1">
                  Phone
                </div>
                <a
                  href={`tel:${config.contact.phone}`}
                  className="text-white font-medium hover:text-[#00FFB2] transition-colors"
                >
                  {config.contact.phone}
                </a>
              </div>
              <div className="border-2 border-white/20 bg-white/5 p-6 backdrop-blur-sm text-center">
                <MapPin className="mx-auto mb-3 text-[#00FFB2]" size={24} />
                <div className="text-sm font-bold uppercase tracking-wider text-white/60 mb-1">
                  Address
                </div>
                <div className="text-white font-medium">
                  {config.contact.address}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="relative z-10 px-6 pb-20">
          <div className="mx-auto max-w-2xl">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              onSubmit={handleSubmit}
              className="border-2 border-[#00FFB2]/30 bg-white/5 p-8 backdrop-blur-sm md:p-10"
            >
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-white/80">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-b-2 border-white/30 bg-transparent py-3 text-white placeholder-white/50 focus:border-[#00FFB2] focus:outline-none transition-colors font-medium"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-white/80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border-b-2 border-white/30 bg-transparent py-3 text-white placeholder-white/50 focus:border-[#00FFB2] focus:outline-none transition-colors font-medium"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-white/80">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full border-b-2 border-white/30 bg-transparent py-3 text-white placeholder-white/50 focus:border-[#00FFB2] focus:outline-none transition-colors font-medium resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex items-center justify-center gap-3 border-2 border-[#00FFB2] bg-[#00FFB2] px-8 py-4 font-black uppercase tracking-wider text-[#0A0F3C] transition-all hover:shadow-lg hover:shadow-[#00FFB2]/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="w-5 h-5 border-2 border-[#0A0F3C] border-t-transparent rounded-full"
                      />
                      Opening WhatsApp...
                    </>
                  ) : (
                    <>
                      Send via WhatsApp
                      <MessageCircle size={20} />
                      <ArrowRight
                        size={16}
                        className="absolute right-6 opacity-0 transition-all group-hover:opacity-100 group-hover:right-4"
                      />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <span>WhatsApp: +{config.whatsapp.number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Response: ~2 hours</span>
                  </div>
                </div>
              </div>
            </motion.form>
          </div>
        </section>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-8 right-8 z-50 flex items-center gap-3 border-2 border-[#00FFB2] bg-[#00FFB2] px-6 py-4 shadow-lg"
            >
              <Check size={20} className="text-[#0A0F3C]" />
              <span className="font-black text-[#0A0F3C] uppercase tracking-wider">
                Opening WhatsApp...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
