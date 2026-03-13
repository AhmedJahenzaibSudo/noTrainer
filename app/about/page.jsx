"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Code, MessageCircle, CheckCircle,
  AlertCircle, MapPin, Trophy, Star,
} from "lucide-react";

// ── Constants ────────────────────────────────────────────────
const ACCENT  = "#1AF0BE";
const BG_DARK = "#0a1628";
const BG_CARD = "#0d1e3a";

const TECH = [
  "Next.js", "React", "JavaScript", "Tailwind CSS",
  "Framer Motion", "Supabase", "Botpress", "ExerciseDB",
  "Python", "C++", "OpenCV", "Power BI",
  "Excel VBA", "MeshLab", "Git / GitHub", "Vercel",
];

const STATS = [
  { n: "3.8",  sup: "/4.0", label: "CGPA"          },
  { n: "🥇",   sup: "",     label: "Gold Medal"     },
  { n: "800+", sup: "",     label: "Workouts"        },
  { n: "2×",   sup: "",     label: "Silicon Valley"  },
];

const SKILLS = [
  { group: "Frontend",   items: ["React", "Next.js", "Tailwind", "Framer Motion"] },
  { group: "Backend",    items: ["Python", "C++", "Supabase", "VBA Automation"] },
  { group: "Specialties",items: ["Computer Vision", "Point Cloud", "Power BI", "Chatbots"] },
];

const XPWORK = [
  {
    role: "JS & React Intern",
    company: "AppsGenii · NAVTTC",
    period: "Mar – Jun 2025",
    location: "Lahore, PK",
    color: ACCENT,
  },
  {
    role: "VBA Automation Dev",
    company: "Rush PCB",
    period: "Oct – Nov 2024",
    location: "Silicon Valley, USA",
    color: "#a78bfa",
  },
  {
    role: "Point Cloud Engineer",
    company: "Xekera Systems",
    period: "Jun – Nov 2023",
    location: "Santa Clara, USA",
    color: "#fb923c",
  },
];

// ── Helpers ──────────────────────────────────────────────────
const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  );
};

const Label = ({ children }) => (
  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] mb-2"
     style={{ color: ACCENT }}>{children}</p>
);

const H2 = ({ children, className = "" }) => (
  <h2 className={`font-black uppercase tracking-tight leading-[0.9] ${className}`}
      style={{ fontFamily: "'Krona One', sans-serif" }}>{children}</h2>
);

// ── Main ─────────────────────────────────────────────────────
export default function AboutPage() {
  const [form, setForm]           = useState({ name: "", email: "", message: "" });
  const [status, setStatus]       = useState("idle");

  const handleInput = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setStatus("error"); setTimeout(() => setStatus("idle"), 3000); return; }
    setStatus("sending");
    const msg = `*noTrainer Contact*%0A%0A*Name:* ${form.name}%0A*Email:* ${form.email}%0A*Message:* ${form.message}`;
    window.open(`https://wa.me/923324641368?text=${msg}`, "_blank");
    setTimeout(() => { setStatus("success"); setForm({ name: "", email: "", message: "" }); setTimeout(() => setStatus("idle"), 5000); }, 800);
  };

  return (
    <main className="about-root relative text-white overflow-x-hidden"
          style={{ backgroundColor: BG_DARK, fontFamily: "sans-serif" }}>
      <style>{`
        .about-root {
          height: calc(100dvh - 40px);
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
        }
        .about-root::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) { .about-root { height: calc(100dvh - 48px); } }

        .snap-sec {
          scroll-snap-align: start;
          height: calc(100dvh - 40px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        @media (min-width: 768px) { .snap-sec { height: calc(100dvh - 48px); } }

        @keyframes techScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .tech-run { animation: techScroll 30s linear infinite; }
        .tech-run:hover { animation-play-state: paused; }

        .pill-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 10px 14px;
          color: #fff;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .pill-input:focus { border-color: rgba(26,240,190,0.45); }
        .pill-input::placeholder { color: rgba(255,255,255,0.22); }
      `}</style>

      {/* Fixed bg glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#0d2a6e] blur-[140px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-5%]  h-[500px] w-[500px] rounded-full bg-[#1AF0BE] blur-[130px] opacity-[0.07]" />
      </div>

      {/* ══════════ S1 — HERO ══════════ */}
      <section className="snap-sec relative items-center px-6 md:px-16">

        {/* Ghost bg text */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none" aria-hidden>
          <span className="text-[20vw] font-black uppercase tracking-tighter leading-none"
                style={{ fontFamily: "'Krona One', sans-serif", color: "rgba(26,240,190,0.03)" }}>
            Ahmed
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left — identity */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <Label>The maker of noTrainer</Label>
            <H2 className="text-5xl sm:text-6xl md:text-7xl mb-4">
              Ahmed<br /><span style={{ color: ACCENT }}>Jahanzaib</span>
            </H2>
            <p className="text-white/40 text-sm md:text-base mb-2">Computer Scientist · Gold Medalist</p>
            <div className="flex items-center gap-1.5 mb-6">
              <MapPin size={12} style={{ color: ACCENT }} />
              <span className="text-xs text-white/30 font-bold uppercase tracking-widest">Lahore, Pakistan</span>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-2">
              {STATS.map((s) => (
                <div key={s.label} className="px-4 py-2 rounded-xl flex flex-col items-center"
                     style={{ backgroundColor: "rgba(26,240,190,0.07)", border: "1px solid rgba(26,240,190,0.14)" }}>
                  <span className="text-base md:text-lg font-black" style={{ color: ACCENT }}>
                    {s.n}<sup className="text-xs opacity-60">{s.sup}</sup>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — quote + links */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <blockquote className="pl-4 text-sm md:text-base text-white/40 italic leading-relaxed mb-6"
                        style={{ borderLeft: `3px solid ${ACCENT}` }}>
              "noTrainer — like <em>no-brainer</em>. Fitness guidance so good, so free,
              it's embarrassing that personal trainers still charge for it."
            </blockquote>

            <div className="flex flex-wrap gap-3">
              {[
                { label: "GitHub",   href: "https://github.com/AhmedJahenzaibSudo"         },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/ahmedjahenzaib"     },
                { label: "noTrainer Live", href: "https://fantastic-pika-3bef3b.netlify.app/" },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                   className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                   style={{ backgroundColor: "rgba(26,240,190,0.1)", border: "1px solid rgba(26,240,190,0.2)", color: ACCENT }}>
                  {l.label} →
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-px h-7 bg-gradient-to-b from-transparent to-white/20" />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">Scroll</span>
        </motion.div>
      </section>

      {/* ══════════ S2 — SKILLS + EXPERIENCE ══════════ */}
      <section className="snap-sec px-6 md:px-16">
        <div className="max-w-6xl mx-auto w-full">

          <FadeUp>
            <Label>Background</Label>
            <H2 className="text-4xl md:text-5xl lg:text-6xl mb-8">
              Skills &amp; <span style={{ color: ACCENT }}>Experience.</span>
            </H2>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

            {/* Skills */}
            <FadeUp delay={0.05}>
              <div className="flex flex-col gap-3">
                {SKILLS.map((s) => (
                  <div key={s.group} className="p-4 rounded-xl"
                       style={{ backgroundColor: BG_CARD, border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: ACCENT }}>
                      {s.group}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {s.items.map((item) => (
                        <span key={item} className="px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold text-white/50"
                              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Work XP */}
            <FadeUp delay={0.1}>
              <div className="flex flex-col gap-3">
                {XPWORK.map((x, i) => (
                  <div key={x.role} className="p-4 rounded-xl flex items-start gap-4 transition-all duration-200 hover:scale-[1.01]"
                       style={{ backgroundColor: BG_CARD, border: `1px solid ${x.color}18` }}>
                    <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: x.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm uppercase tracking-tight" style={{ fontFamily: "'Krona One', sans-serif", color: x.color }}>
                        {x.role}
                      </p>
                      <p className="text-xs text-white/50 font-bold mt-0.5">{x.company}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-white/30 font-bold">{x.period}</p>
                      <p className="text-[10px] text-white/20">{x.location}</p>
                    </div>
                  </div>
                ))}

                {/* Education */}
                <div className="p-4 rounded-xl flex items-start gap-4"
                     style={{ backgroundColor: BG_CARD, border: `1px solid rgba(26,240,190,0.15)` }}>
                  <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-lg"
                       style={{ backgroundColor: "rgba(26,240,190,0.1)" }}>
                    🎓
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-tight"
                       style={{ fontFamily: "'Krona One', sans-serif", color: ACCENT }}>
                      BS Computer Science
                    </p>
                    <p className="text-xs text-white/40 font-bold">University of South Asia · 2021–2025</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-black"
                            style={{ backgroundColor: "rgba(26,240,190,0.12)", color: ACCENT }}>
                        CGPA 3.8
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-black"
                            style={{ backgroundColor: "rgba(250,204,21,0.12)", color: "#facc15" }}>
                        🥇 Gold Medal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ══════════ S3 — TECH MARQUEE + VALUES ══════════ */}
      <section className="snap-sec">

        {/* Top strip */}
        <div className="w-full py-3 md:py-4 border-y overflow-hidden shrink-0"
             style={{ borderColor: "rgba(26,240,190,0.1)", backgroundColor: "rgba(26,240,190,0.03)" }}>
          <div className="tech-run flex gap-8 whitespace-nowrap w-max">
            {[...TECH, ...TECH].map((t, i) => (
              <span key={i} className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"
                    style={{ color: i % 5 === 0 ? ACCENT : "rgba(255,255,255,0.25)" }}>
                <span style={{ color: ACCENT, opacity: 0.35 }}>◆</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 md:px-16 py-8">
          <div className="max-w-5xl mx-auto w-full text-center">
            <FadeUp>
              <Label>The stack behind noTrainer</Label>
              <H2 className="text-4xl md:text-6xl lg:text-7xl mb-4">
                Built with<br /><span style={{ color: ACCENT }}>intention.</span>
              </H2>
              <p className="text-white/30 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                Every tool chosen for a reason. From SVG body diagrams to Web Audio APIs —
                nothing is default, everything is deliberate.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {TECH.map((t, i) => (
                  <span key={t}
                        className="px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
                        style={{
                          backgroundColor: i % 4 === 0 ? "rgba(26,240,190,0.1)" : "rgba(255,255,255,0.04)",
                          border: i % 4 === 0 ? "1px solid rgba(26,240,190,0.25)" : "1px solid rgba(255,255,255,0.07)",
                          color: i % 4 === 0 ? ACCENT : "rgba(255,255,255,0.4)",
                        }}>
                    {t}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Bottom strip reverse */}
        <div className="w-full py-3 md:py-4 border-t overflow-hidden shrink-0"
             style={{ borderColor: "rgba(26,240,190,0.07)" }}>
          <div className="flex gap-8 whitespace-nowrap w-max"
               style={{ animation: "techScroll 38s linear infinite reverse" }}>
            {[...TECH.slice().reverse(), ...TECH.slice().reverse()].map((t, i) => (
              <span key={i} className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"
                    style={{ color: "rgba(255,255,255,0.12)" }}>
                <span style={{ color: ACCENT, opacity: 0.2 }}>◆</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ S4 — CONTACT ══════════ */}
      <section className="snap-sec px-6 md:px-16">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* Left — CTA */}
          <FadeUp>
            <Label>Say hello</Label>
            <H2 className="text-5xl md:text-6xl lg:text-7xl mb-4">
              Let's<br /><span style={{ color: ACCENT }}>connect.</span>
            </H2>
            <p className="text-white/30 text-sm md:text-base leading-relaxed mb-6">
              Whether it's feedback on noTrainer, a collab, or just a hello —
              fill the form and it lands straight in WhatsApp.
            </p>
            <div className="flex flex-col gap-2 text-xs text-white/25 font-bold">
              <span>📧 ahmed.jahenzaib123@gmail.com</span>
              <span>📍 Lahore, Pakistan</span>
              <a href="https://github.com/AhmedJahenzaibSudo" target="_blank" rel="noopener noreferrer"
                 className="hover:text-white/50 transition-colors">
                🐙 github.com/AhmedJahenzaibSudo
              </a>
            </div>
          </FadeUp>

          {/* Right — Form */}
          <FadeUp delay={0.12}>
            <AnimatePresence>
              {status !== "idle" && status !== "sending" && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mb-4 p-3 rounded-xl flex items-center gap-2"
                            style={{
                              backgroundColor: status === "error" ? "rgba(239,68,68,0.1)" : "rgba(26,240,190,0.1)",
                              border: `1px solid ${status === "error" ? "rgba(239,68,68,0.3)" : "rgba(26,240,190,0.3)"}`,
                            }}>
                  {status === "success"
                    ? <CheckCircle size={13} style={{ color: ACCENT }} />
                    : <AlertCircle size={13} className="text-red-400" />}
                  <span className="text-xs font-bold" style={{ color: status === "error" ? "#f87171" : ACCENT }}>
                    {status === "success" ? "WhatsApp opened — send the message!" : "Please fill all fields."}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input className="pill-input" type="text"  name="name"    value={form.name}    onChange={handleInput} placeholder="Your name"     disabled={status === "sending"} />
              <input className="pill-input" type="email" name="email"   value={form.email}   onChange={handleInput} placeholder="Email address"  disabled={status === "sending"} />
              <textarea className="pill-input" name="message" rows={4}  value={form.message} onChange={handleInput} placeholder="Your message"  disabled={status === "sending"} style={{ resize: "none" }} />
              <button type="submit" disabled={status === "sending"}
                      className="group relative w-full py-3 rounded-xl font-black uppercase text-xs tracking-[0.25em] text-[#051061] overflow-hidden transition-all hover:scale-[1.01] active:scale-95"
                      style={{ backgroundColor: ACCENT, boxShadow: "0 0 24px rgba(26,240,190,0.22)", opacity: status === "sending" ? 0.6 : 1 }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === "sending" ? "Opening…" : <><MessageCircle size={13} /> Send via WhatsApp</>}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
              <a href="https://wa.me/923244520651" target="_blank" rel="noopener noreferrer"
                 className="text-center text-[10px] font-bold uppercase tracking-widest transition-colors"
                 style={{ color: "rgba(26,240,190,0.35)" }}>
                Or chat directly on WhatsApp →
              </a>
            </form>
          </FadeUp>
        </div>
      </section>

    </main>
  );
}