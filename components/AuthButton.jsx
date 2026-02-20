"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, LogOut, X, User2, KeyRound, Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthButton() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);

  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) =>
      setSession(newSession ?? null),
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
      setMsg("✅ Signed up! You should be logged in now.");
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

      setMsg("✅ Signed out.");
      setEmail("");
      setPassword("");
      setMode("signin");
      setOpen(false);
    } catch (e) {
      setMsg(`❌ ${e?.message ?? "Sign out failed."}`);
    } finally {
      setBusy(false);
    }
  };

  const authedEmail = session?.user?.email ?? "";

  const msgTone = msg.startsWith("✅")
    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
    : msg.startsWith("❌")
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : "border-white/15 bg-white/5 text-white/80";

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((v) => !v);
          setMsg("");
        }}
        className="
          px-3 py-2 rounded-none font-black uppercase tracking-widest text-[11px]
          bg-gradient-to-r from-cyan-500 to-sky-500 text-white
          border border-white/10
          hover:brightness-110 active:scale-95 transition-all
          shadow-[0_0_18px_rgba(34,211,238,0.25)]
        "
      >
        {session ? "Account" : "Login"}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="
                absolute right-0 mt-2 z-50 w-[350px]
                bg-[#0b1222] border-2 border-cyan-400/70 rounded-none
                shadow-[0_0_28px_rgba(34,211,238,0.20)]
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/30">
                <div className="flex items-center gap-2">
                  <User2 size={16} className="text-cyan-300" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-white">
                    Supabase Auth
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/70 hover:text-white transition-all"
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

                    <div className="mb-4 border border-white/10 bg-black/25 px-3 py-2 rounded-none">
                      <p className="text-[12px] font-black uppercase tracking-tight text-white">
                        {authedEmail}
                      </p>
                    </div>

                    <button
                      onClick={signOut}
                      disabled={busy}
                      className="
                        w-full rounded-none py-3 font-black uppercase tracking-widest text-[11px]
                        bg-gradient-to-r from-red-500 to-rose-500 text-white
                        border border-white/10
                        hover:brightness-110 active:scale-95 transition-all
                        flex items-center justify-center gap-2
                        disabled:opacity-60
                        shadow-[0_0_18px_rgba(239,68,68,0.20)]
                      "
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    {/* Mode toggle */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => {
                          setMode("signin");
                          setMsg("");
                        }}
                        className={`
                          flex-1 py-2 rounded-none font-black uppercase tracking-widest text-[10px] border
                          transition-all
                          ${
                            mode === "signin"
                              ? "bg-cyan-500 text-white border-cyan-300/60 shadow-[0_0_14px_rgba(34,211,238,0.20)]"
                              : "bg-black/20 text-white/80 border-white/10 hover:border-white/30"
                          }
                        `}
                      >
                        Sign in
                      </button>

                      <button
                        onClick={() => {
                          setMode("signup");
                          setMsg("");
                        }}
                        className={`
                          flex-1 py-2 rounded-none font-black uppercase tracking-widest text-[10px] border
                          transition-all
                          ${
                            mode === "signup"
                              ? "bg-emerald-500 text-white border-emerald-300/60 shadow-[0_0_14px_rgba(16,185,129,0.20)]"
                              : "bg-black/20 text-white/80 border-white/10 hover:border-white/30"
                          }
                        `}
                      >
                        Sign up
                      </button>
                    </div>

                    {/* Email */}
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">
                      Email
                    </label>
                    <div className="flex items-center gap-2 border-2 border-white/15 bg-black/30 px-3 py-2 rounded-none mb-3 focus-within:border-cyan-400/70">
                      <Mail size={16} className="text-cyan-300" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-transparent outline-none text-sm font-bold text-white placeholder:text-white/35"
                        type="email"
                        autoComplete="email"
                      />
                    </div>

                    {/* Password */}
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">
                      Password
                    </label>
                    <div className="flex items-center gap-2 border-2 border-white/15 bg-black/30 px-3 py-2 rounded-none mb-4 focus-within:border-cyan-400/70">
                      <KeyRound size={16} className="text-cyan-300" />
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent outline-none text-sm font-bold text-white placeholder:text-white/35"
                        type="password"
                        autoComplete={
                          mode === "signup" ? "new-password" : "current-password"
                        }
                      />
                    </div>

                    <button
                      onClick={mode === "signup" ? signUp : signIn}
                      disabled={busy || !email.trim() || password.length < 6}
                      className={`
                        w-full rounded-none py-3 font-black uppercase tracking-widest text-[11px]
                        text-white border border-white/10
                        hover:brightness-110 active:scale-95 transition-all
                        flex items-center justify-center gap-2 disabled:opacity-60
                        ${
                          mode === "signup"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_18px_rgba(16,185,129,0.18)]"
                            : "bg-gradient-to-r from-cyan-500 to-sky-500 shadow-[0_0_18px_rgba(34,211,238,0.18)]"
                        }
                      `}
                    >
                      <LogIn size={16} />
                      {busy
                        ? "Please wait..."
                        : mode === "signup"
                          ? "Create account"
                          : "Login"}
                    </button>

                    <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-white/45">
                      Password must be 6+ characters.
                    </p>
                  </>
                )}

                {/* Message */}
                {msg && (
                  <div
                    className={`mt-4 text-[11px] font-black uppercase tracking-widest border rounded-none px-3 py-2 ${msgTone}`}
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
