"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, LogOut, X, User2, KeyRound, Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const config = {
  colors: {
    bgPrimary: "#051061",
    bgDark: "#020a21",
    accent: "#1AF0BE",
    textPrimary: "#ffffff",
  },
};

export default function AuthButton() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession ?? null)
    );

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const resetMsg = () => setMsg("");

  const signUp = async () => {
    resetMsg();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setMsg("✅ Signed up!");
    } catch (e) {
      setMsg(`❌ ${e?.message ?? "Sign up failed."}`);
    } finally {
      setBusy(false);
    }
  };

  const signIn = async () => {
    resetMsg();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setMsg("✅ Logged in!");
    } catch (e) {
      setMsg(`❌ ${e?.message ?? "Login failed."}`);
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    resetMsg();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setOpen(false);
    } catch (e) {
      setMsg(`❌ ${e?.message ?? "Sign out failed."}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border text-white transition-all active:scale-95"
        style={{
          backgroundColor: "rgba(54, 73, 218, 0.9)",
          borderColor: "rgba(26, 240, 190, 0.3)",
        }}
      >
        <User2 size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={
                isMobile
                  ? { opacity: 0, y: "100%" }
                  : { opacity: 0, y: 8, scale: 0.98 }
              }
              animate={
                isMobile
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                isMobile
                  ? { opacity: 0, y: "100%" }
                  : { opacity: 0, y: 8, scale: 0.98 }
              }
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className={
                isMobile
                  ? "fixed inset-x-0 bottom-0 z-50 w-full rounded-t-2xl border-t-2 shadow-2xl max-h-[90vh] overflow-y-auto pb-8"
                  : "absolute right-0 mt-2 z-50 w-[300px] border-2 shadow-2xl"
              }
              style={{
                backgroundColor: config.colors.bgDark,
                borderColor: config.colors.accent,
              }}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <User2 size={16} style={{ color: config.colors.accent }} />
                  <p className="text-[11px] font-black uppercase tracking-widest text-white">
                    Auth
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="text-white/70 hover:text-white p-1 -mr-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4">
                {session ? (
                  <>
                    <p className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-2">
                      Signed in as
                    </p>

                    <div className="mb-4 border border-white/10 bg-black/25 px-3 py-2">
                      <p className="text-[12px] font-black uppercase tracking-tight text-white truncate">
                        {session.user.email}
                      </p>
                    </div>

                    <button
                      onClick={signOut}
                      disabled={busy}
                      className="w-full py-3 font-black uppercase tracking-widest text-[11px] text-white border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 bg-red-600 hover:bg-red-500"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => {
                          setMode("signin");
                          setMsg("");
                        }}
                        className={`flex-1 py-2 font-black uppercase tracking-widest text-[10px] border transition-all ${
                          mode === "signin"
                            ? "border-transparent"
                            : "bg-transparent text-white/80 border-white/10"
                        }`}
                        style={
                          mode === "signin"
                            ? {
                                backgroundColor: config.colors.accent,
                                color: config.colors.bgPrimary,
                              }
                            : {}
                        }
                      >
                        Sign in
                      </button>

                      <button
                        onClick={() => {
                          setMode("signup");
                          setMsg("");
                        }}
                        className={`flex-1 py-2 font-black uppercase tracking-widest text-[10px] border transition-all ${
                          mode === "signup"
                            ? "border-transparent"
                            : "bg-transparent text-white/80 border-white/10"
                        }`}
                        style={
                          mode === "signup"
                            ? {
                                backgroundColor: config.colors.accent,
                                color: config.colors.bgPrimary,
                              }
                            : {}
                        }
                      >
                        Sign up
                      </button>
                    </div>

                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">
                      Email
                    </label>

                    <div className="flex items-center gap-2 border-2 px-3 py-2 mb-3 border-white/15 bg-black/30">
                      <Mail size={16} style={{ color: config.colors.accent }} />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-transparent outline-none text-sm font-bold text-white placeholder:text-white/35"
                        type="email"
                        autoComplete="email"
                      />
                    </div>

                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">
                      Password
                    </label>

                    <div className="flex items-center gap-2 border-2 px-3 py-2 mb-4 border-white/15 bg-black/30">
                      <KeyRound
                        size={16}
                        style={{ color: config.colors.accent }}
                      />
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent outline-none text-sm font-bold text-white placeholder:text-white/35"
                        type="password"
                        autoComplete={
                          mode === "signup"
                            ? "new-password"
                            : "current-password"
                        }
                      />
                    </div>

                    <button
                      onClick={mode === "signup" ? signUp : signIn}
                      disabled={busy || !email.trim() || password.length < 6}
                      className="w-full py-3 font-black uppercase tracking-widest text-[11px] border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{
                        backgroundColor: config.colors.bgPrimary,
                        color: config.colors.accent,
                      }}
                    >
                      <LogIn size={16} />
                      {busy
                        ? "Wait..."
                        : mode === "signup"
                        ? "Create account"
                        : "Login"}
                    </button>
                  </>
                )}

                {msg && (
                  <div
                    className={`mt-4 text-[11px] font-black uppercase tracking-widest border px-3 py-2 ${
                      msg.startsWith("✅")
                        ? "bg-[#1AF0BE]/10 text-[#1AF0BE] border-[#1AF0BE]/40"
                        : "bg-red-500/10 text-red-200 border-red-400/40"
                    }`}
                  >
                    {msg}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}