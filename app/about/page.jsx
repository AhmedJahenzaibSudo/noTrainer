"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Users,
  Award,
  Clock,
  Globe,
  Dumbbell,
  Gamepad2,
  Shield,
  Star,
  Code,
  Salad,
  CheckCircle,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

const SECTION_HEIGHT = "93.5vh";

const AboutPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("idle");

  const team = [
    {
      name: "Ahmed Jahanzaib",
      role: "Website Developer",
      bio: "The architect behind noTrainer. Built this platform to make fitness accessible to everyone through code.",
      icon: Code,
      color: "blue",
    },
    
    
  ];

  const values = [
    {
      title: "No Trainer Needed",
      description:
        "We believe everyone deserves access to quality fitness guidance, regardless of budget or location.",
      icon: Users,
      color: "blue",
    },
    {
      title: "Science First",
      description:
        "Every feature is backed by exercise science and modern research. No bro-science, just facts.",
      icon: Award,
      color: "blue",
    },
    {
      title: "Always Evolving",
      description:
        "We continuously update our workout database and features based on user feedback.",
      icon: Clock,
      color: "blue",
    },
    {
      title: "Global Community",
      description:
        "Join thousands of users worldwide who are transforming their fitness journey.",
      icon: Globe,
      color: "blue",
    },
  ];

  const getColorClasses = () => {
    return {
      border: "border-blue-500/30",
      glow: "bg-blue-500/20",
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 3000);
      return;
    }

    setFormStatus("sending");

    const phoneNumber = "923324641368";

    const message = `*New Contact Form Message*%0A%0A
*Name:* ${formData.name}%0A
*Email:* ${formData.email}%0A
*Message:* ${formData.message}%0A%0A
_Sent from noTrainer App_`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    setTimeout(() => {
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 5000);
    }, 1000);
  };

  const scrollToSection = (index) => {
    const container = document.querySelector(".snap-container");
    if (container) {
      container.scrollTo({
        top: index * window.innerHeight * 0.935,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-[#020205] text-white font-sans overflow-hidden relative h-screen">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        body {
          font-family: "Inter", sans-serif;
          background: #020205;
          margin: 0;
          padding: 0;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: -3s;
        }
      `}</style>

      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-48 sm:w-64 md:w-80 lg:w-[500px] h-48 sm:h-64 md:h-80 lg:h-[500px] rounded-full bg-blue-600/20 blur-[80px] sm:blur-[100px] md:blur-[120px] lg:blur-[150px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 right-0 w-48 sm:w-64 md:w-80 lg:w-[500px] h-48 sm:h-64 md:h-80 lg:h-[500px] rounded-full bg-blue-600/20 blur-[80px] sm:blur-[100px] md:blur-[120px] lg:blur-[150px] pointer-events-none animate-pulse" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 md:w-[600px] lg:w-[800px] h-64 sm:h-96 md:h-[600px] lg:h-[800px] rounded-full bg-blue-600/20 blur-[80px] sm:blur-[100px] md:blur-[120px] lg:blur-[150px] pointer-events-none animate-pulse" />

      <div className="hidden lg:block fixed top-40 left-20 w-32 h-32 rounded-full bg-blue-500/10 blur-[50px] pointer-events-none animate-float" />
      <div className="hidden lg:block fixed bottom-40 right-20 w-32 h-32 rounded-full bg-blue-500/10 blur-[50px] pointer-events-none animate-float-delayed" />

      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.1) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Snap Scroll Container */}
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar snap-container">
        {/* SECTION 1: HERO */}
        <section
          style={{ height: SECTION_HEIGHT }}
          className="w-full snap-start flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_50%)]" />

          <div className="relative z-10 text-center px-3 sm:px-4 md:px-5 lg:px-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter mb-4 sm:mb-5 md:mb-6">
                <span className="text-blue-400">About</span>{" "}
                <span className="relative">
                  <span className="text-white">noTrainer</span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -inset-2 sm:-inset-3 md:-inset-4 bg-blue-500/20 blur-2xl sm:blur-3xl -z-10"
                  />
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 max-w-2xl sm:max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2">
                We're on a mission to make fitness guidance accessible,
                <br className="hidden sm:block" />
                intelligent, and actually enjoyable.
              </p>

              
            </motion.div>
          </div>

          
        </section>

        {/* SECTION 2: CONTACT */}
        <section
          style={{ height: SECTION_HEIGHT }}
          className="w-full snap-start flex items-center justify-center px-3 sm:px-4 md:px-5 lg:px-6"
        >
          <div className="max-w-3xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-5 md:mb-6"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-1 sm:mb-2">
                Get in <span className="text-blue-400">Touch</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Fill the form and we'll open WhatsApp with your message
              </p>
            </motion.div>

            <AnimatePresence>
              {formStatus === "sending" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 border-2 border-blue-500/30 bg-blue-500/10 flex items-center gap-2"
                >
                  <MessageCircle size={16} className="text-blue-400 animate-pulse" />
                  <span className="text-xs text-blue-400">Opening WhatsApp...</span>
                </motion.div>
              )}

              {formStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 border-2 border-blue-500/30 bg-blue-500/10 flex items-center gap-2"
                >
                  <CheckCircle size={16} className="text-blue-400" />
                  <span className="text-xs text-blue-400">
                    WhatsApp opened! Send the message.
                  </span>
                </motion.div>
              )}

              {formStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 border-2 border-red-500/30 bg-red-500/10 flex items-center gap-2"
                >
                  <AlertCircle size={16} className="text-red-400" />
                  <span className="text-xs text-red-400">All fields required</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name *"
                  className="w-full bg-transparent border-2 border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                  disabled={formStatus === "sending"}
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address *"
                  className="w-full bg-transparent border-2 border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                  disabled={formStatus === "sending"}
                />
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Your Message *"
                  className="w-full bg-transparent border-2 border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all resize-none"
                  disabled={formStatus === "sending"}
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === "sending"}
                className={`w-full py-2.5 bg-blue-500 text-white font-black uppercase text-xs tracking-widest 
                  ${formStatus === "sending" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-400"} 
                  transition-all flex items-center justify-center gap-2 group`}
              >
                {formStatus === "sending" ? (
                  <>Opening...</>
                ) : (
                  <>
                    Send via WhatsApp
                    <MessageCircle
                      size={14}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <a
                href="https://wa.me/923244520651?text=Hello%20noTrainer%20team%2C%20I%20have%20a%20question"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <MessageCircle size={12} />
                Or chat directly on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 3: STORY (Simple Text) */}
        <section
          style={{ height: SECTION_HEIGHT }}
          className="w-full snap-start flex items-center justify-center px-3 sm:px-4 md:px-5 lg:px-6"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase mb-4 sm:mb-6">
                Our <span className="text-blue-400">Story</span>
              </h2>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
                <p>
                  <span className="text-blue-400 font-black">noTrainer</span> started
                  with one simple idea: fitness guidance should be accessible to everyone.
                </p>
                <p>
                  We created a platform that helps people train smarter with workouts,
                  calculators, and useful tools — without needing a personal trainer.
                </p>
                <p>
                  Our goal is to make fitness simple, affordable, and enjoyable for users
                  everywhere.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 4: VALUES */}
        <section
          style={{ height: SECTION_HEIGHT }}
          className="w-full snap-start flex items-center justify-center px-3 sm:px-4 md:px-5 lg:px-6"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase mb-3 sm:mb-4">
                Core <span className="text-blue-400">Values</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto px-3">
                The principles that guide everything we build
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                const colors = getColorClasses();

                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`relative p-5 sm:p-6 md:p-7 lg:p-8 bg-gradient-to-br from-white/5 to-transparent border ${colors.border} rounded-none backdrop-blur-sm overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.glow} blur-3xl`}
                    />

                    <div className="relative mb-3 sm:mb-4">
                      <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Icon size={32} className="text-blue-400 relative z-10 mx-auto sm:mx-0" />
                    </div>

                    <h3 className="text-base sm:text-lg md:text-xl font-black uppercase mb-2 sm:mb-3 relative z-10 text-center sm:text-left">
                      {value.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed relative z-10 text-center sm:text-left">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 5: TEAM */}
        <section
          style={{ height: SECTION_HEIGHT }}
          className="w-full snap-start flex items-center justify-center px-3 sm:px-4 md:px-5 lg:px-6"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase mb-3 sm:mb-4">
                Meet the <span className="text-blue-400">Team</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto px-3">
                The people building your fitness future
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {team.map((member, index) => {
                const Icon = member.icon;
                const colors = getColorClasses();

                return (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`relative p-5 sm:p-6 bg-gradient-to-br from-white/5 to-transparent border ${colors.border} rounded-none backdrop-blur-sm overflow-hidden group text-center`}
                  >
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.glow} blur-3xl`}
                    />

                    <div className="relative mb-3 sm:mb-4">
                      <div
                        className={`w-16 sm:w-20 h-16 sm:h-20 mx-auto rounded-none border-2 ${colors.border} flex items-center justify-center group-hover:border-opacity-100 transition-all duration-300`}
                      >
                        <Icon size={28} className="text-blue-400" />
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base md:text-lg font-black uppercase mb-1 relative z-10">
                      {member.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 sm:mb-3 relative z-10">
                      {member.role}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed relative z-10 px-2">
                      {member.bio}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;