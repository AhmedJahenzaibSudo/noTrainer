"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  ArrowRight,
  Check,
  Phone,
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

const CYAN = "color(display-p3 0.056 0.958 0.949)";
const DARK = "color(display-p3 0.079 0.201 0.346)";
const YELLOW = "color(display-p3 0.98 0.78 0.12)";

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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const whatsappMessage =
      `${config.whatsapp.message}\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Message: ${formData.message}`;

    const whatsappUrl = `https://wa.me/${config.whatsapp.number}?text=${encodeURIComponent(
      whatsappMessage,
    )}`;

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");

      setIsSubmitting(false);
      setShowSuccess(true);

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
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

        .contact-field::placeholder {
          color: ${CYAN};
          opacity: 0.38;
        }

        .contact-field:focus {
          border-color: ${YELLOW} !important;
        }
      `}</style>

      <div
        className="relative flex h-[calc(100dvh-40px)] w-full flex-col overflow-hidden font-sans md:h-[calc(100dvh-48px)]"
        style={{
          backgroundColor: CYAN,
          color: DARK,
        }}
      >
        <div className="flex min-h-0 flex-1 items-center justify-center px-5 py-8 md:px-8 md:py-12">
          <div className="w-full max-w-5xl">
            {/* Header */}

            <motion.div
              initial={{
                opacity: 0,
                y: -16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
              }}
              className="mb-8 md:mb-10"
            >

              <h1
                className="max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl"
                style={{
                  fontFamily: "'Krona One', sans-serif",
                  color: DARK,
                }}
              >
                Contact Us
              </h1>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:gap-6">
              {/* LEFT */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -18,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.1,
                  duration: 0.45,
                }}
                className="flex flex-col gap-3"
              >
                {/* EMAIL */}

                <a
                  href={`mailto:${config.contact.email}`}
                  className="group flex items-center gap-4 border-2 px-4 py-4 transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: CYAN,
                    borderColor: DARK,
                    color: DARK,
                  }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center"
                    style={{
                      backgroundColor: DARK,
                      color: CYAN,
                    }}
                  >
                    <Mail size={20} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.2em]"
                      style={{
                        opacity: 0.55,
                      }}
                    >
                      Email
                    </p>

                    <p className="truncate text-sm font-bold md:text-base">
                      {config.contact.email}
                    </p>
                  </div>
                </a>

                {/* PHONE */}

                <a
                  href={`tel:${config.contact.phone}`}
                  className="group flex items-center gap-4 border-2 px-4 py-4 transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: CYAN,
                    borderColor: DARK,
                    color: DARK,
                  }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center"
                    style={{
                      backgroundColor: DARK,
                      color: CYAN,
                    }}
                  >
                    <Phone size={20} />
                  </div>

                  <div>
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.2em]"
                      style={{
                        opacity: 0.55,
                      }}
                    >
                      Phone
                    </p>

                    <p className="text-sm font-bold md:text-base">
                      {config.contact.phone}
                    </p>
                  </div>
                </a>

                {/* ADDRESS */}

                <div
                  className="flex items-center gap-4 border-2 px-4 py-4"
                  style={{
                    backgroundColor: CYAN,
                    borderColor: DARK,
                    color: DARK,
                  }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center"
                    style={{
                      backgroundColor: DARK,
                      color: CYAN,
                    }}
                  >
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.2em]"
                      style={{
                        opacity: 0.55,
                      }}
                    >
                      Location
                    </p>

                    <p className="text-sm font-bold md:text-base">
                      {config.contact.address}
                    </p>
                  </div>
                </div>

                
              </motion.div>

              {/* RIGHT FORM */}

              <motion.form
                initial={{
                  opacity: 0,
                  x: 18,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.18,
                  duration: 0.45,
                }}
                onSubmit={handleSubmit}
                className="flex flex-col p-5 md:p-6"
                style={{
                  backgroundColor: DARK,
                  color: CYAN,
                }}
              >
                <div className="mb-5">
                  <h2
                    className="text-2xl font-black uppercase tracking-tight md:text-3xl"
                    style={{
                      fontFamily: "'Krona One', sans-serif",
                    }}
                  >
                    Send a Message
                  </h2>

                  <p
                    className="mt-2 text-xs font-semibold md:text-sm"
                    style={{
                      opacity: 0.6,
                    }}
                  >
                    Fill in the details below.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* NAME */}

                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em]">
                      Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your name"
                      className="contact-field w-full border-2 px-4 py-3 text-sm font-bold outline-none transition-colors"
                      style={{
                        backgroundColor: DARK,
                        borderColor: CYAN,
                        color: CYAN,
                      }}
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em]">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="you@example.com"
                      className="contact-field w-full border-2 px-4 py-3 text-sm font-bold outline-none transition-colors"
                      style={{
                        backgroundColor: DARK,
                        borderColor: CYAN,
                        color: CYAN,
                      }}
                    />
                  </div>

                  {/* MESSAGE */}

                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em]">
                      Message
                    </label>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Tell us how we can help..."
                      className="contact-field w-full resize-none border-2 px-4 py-3 text-sm font-bold outline-none transition-colors"
                      style={{
                        backgroundColor: DARK,
                        borderColor: CYAN,
                        color: CYAN,
                      }}
                    />
                  </div>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative mt-5 flex w-full items-center justify-center gap-3 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: YELLOW,
                    color: DARK,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-5 w-5 border-2 border-t-transparent"
                        style={{
                          borderColor: DARK,
                          borderTopColor: "transparent",
                        }}
                      />

                      Opening WhatsApp...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={18} />

                      Send via WhatsApp

                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </motion.form>
            </div>
          </div>
        </div>

        {/* Success */}

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 16,
              }}
              className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3"
              style={{
                backgroundColor: YELLOW,
                color: DARK,
                border: `2px solid ${DARK}`,
              }}
            >
              <Check size={18} />

              <span className="text-xs font-black uppercase tracking-widest">
                Opening WhatsApp
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}