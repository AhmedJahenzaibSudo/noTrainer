"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogIn,
  LogOut,
  X,
  User2,
  KeyRound,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

/* =========================================================
   AUTH CONFIG
========================================================= */

const config = {
  colors: {
    background: "color(display-p3 0.056 0.958 0.949)",
    dark: "color(display-p3 0.079 0.201 0.346)",
    accent: "color(display-p3 1 0 0)",
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
    const checkMobile = () =>
      setIsMobile(window.innerWidth < 768);

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () =>
      window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session ?? null);
      }
    });

    const { data: sub } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) =>
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

      setMsg("✅ Signed up!");
    } catch (e) {
      setMsg(
        `❌ ${e?.message ?? "Sign up failed."}`,
      );
    } finally {
      setBusy(false);
    }
  };

  const signIn = async () => {
    resetMsg();
    setBusy(true);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) throw error;

      setMsg("✅ Logged in!");
    } catch (e) {
      setMsg(
        `❌ ${e?.message ?? "Login failed."}`,
      );
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    resetMsg();
    setBusy(true);

    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) throw error;

      setOpen(false);
    } catch (e) {
      setMsg(
        `❌ ${e?.message ?? "Sign out failed."}`,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      {/* AUTH TOGGLE */}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border-2 transition-all active:scale-95"
        style={{
          backgroundColor: config.colors.background,
          borderColor: config.colors.background,
          color: config.colors.dark,
        }}
        aria-label="Account"
      >
        <User2 size={14} strokeWidth={2.5} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}

            <div
              className="fixed inset-0 z-40"
              style={{
                backgroundColor:
                  "color(display-p3 0.079 0.201 0.346 / 0.35)",
              }}
              onClick={() => setOpen(false)}
            />

            {/* AUTH PANEL */}

            <motion.div
              initial={
                isMobile
                  ? {
                      opacity: 0,
                      y: "100%",
                    }
                  : {
                      opacity: 0,
                      y: 8,
                      scale: 0.98,
                    }
              }
              animate={
                isMobile
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }
              }
              exit={
                isMobile
                  ? {
                      opacity: 0,
                      y: "100%",
                    }
                  : {
                      opacity: 0,
                      y: 8,
                      scale: 0.98,
                    }
              }
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className={
                isMobile
                  ? "fixed inset-x-0 bottom-0 z-50 w-full border-t-4 max-h-[90vh] overflow-y-auto pb-8"
                  : "absolute right-0 mt-2 z-50 w-[300px] border-4"
              }
              style={{
                backgroundColor:
                  config.colors.background,
                borderColor: config.colors.dark,
              }}
            >
              {/* HEADER */}

              <div
                className="flex items-center justify-between p-4 border-b-4"
                style={{
                  backgroundColor:
                    config.colors.dark,
                  borderColor:
                    config.colors.dark,
                }}
              >
                <div className="flex items-center gap-2">
                  <User2
                    size={17}
                    style={{
                      color:
                        config.colors.background,
                    }}
                  />

                  <p
                    className="text-[12px] font-black uppercase tracking-widest"
                    style={{
                      color:
                        config.colors.background,
                    }}
                  >
                    Auth
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="p-1 transition-all active:scale-90"
                  style={{
                    color:
                      config.colors.background,
                  }}
                  aria-label="Close"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="p-4">
                {session ? (
                  <>
                    {/* SIGNED IN */}

                    <p
                      className="text-[10px] font-black uppercase tracking-widest mb-2"
                      style={{
                        color:
                          config.colors.dark,
                        opacity: 0.7,
                      }}
                    >
                      Signed in as
                    </p>

                    <div
                      className="mb-4 border-2 px-3 py-3"
                      style={{
                        backgroundColor:
                          config.colors.dark,
                        borderColor:
                          config.colors.dark,
                      }}
                    >
                      <p
                        className="text-[12px] font-black uppercase tracking-tight truncate"
                        style={{
                          color:
                            config.colors.background,
                        }}
                      >
                        {session.user.email}
                      </p>
                    </div>

                    {/* SIGN OUT */}

                    <button
                      onClick={signOut}
                      disabled={busy}
                      className="w-full py-3 font-black uppercase tracking-widest text-[11px] border-2 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{
                        backgroundColor:
                          config.colors.accent,
                        borderColor:
                          config.colors.dark,
                        color:
                          config.colors.dark,
                      }}
                    >
                      <LogOut size={16} />

                      {busy
                        ? "Wait..."
                        : "Sign out"}
                    </button>
                  </>
                ) : (
                  <>
                    {/* SIGN IN / SIGN UP TABS */}

                    <div className="grid grid-cols-2 gap-2 mb-5">
                      <button
                        onClick={() => {
                          setMode("signin");
                          setMsg("");
                        }}
                        className="py-2.5 font-black uppercase tracking-widest text-[10px] border-2 transition-all"
                        style={{
                          backgroundColor:
                            mode === "signin"
                              ? config.colors.dark
                              : config.colors.background,

                          color:
                            mode === "signin"
                              ? config.colors.background
                              : config.colors.dark,

                          borderColor:
                            config.colors.dark,
                        }}
                      >
                        Sign in
                      </button>

                      <button
                        onClick={() => {
                          setMode("signup");
                          setMsg("");
                        }}
                        className="py-2.5 font-black uppercase tracking-widest text-[10px] border-2 transition-all"
                        style={{
                          backgroundColor:
                            mode === "signup"
                              ? config.colors.dark
                              : config.colors.background,

                          color:
                            mode === "signup"
                              ? config.colors.background
                              : config.colors.dark,

                          borderColor:
                            config.colors.dark,
                        }}
                      >
                        Sign up
                      </button>
                    </div>

                    {/* EMAIL */}

                    <label
                      className="block text-[10px] font-black uppercase tracking-widest mb-2"
                      style={{
                        color:
                          config.colors.dark,
                      }}
                    >
                      Email
                    </label>

                    <div
                      className="flex items-center gap-2 border-2 px-3 py-2.5 mb-4"
                      style={{
                        backgroundColor:
                          config.colors.background,
                        borderColor:
                          config.colors.dark,
                      }}
                    >
                      <Mail
                        size={16}
                        style={{
                          color:
                            config.colors.dark,
                        }}
                      />

                      <input
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        className="auth-input w-full bg-transparent outline-none text-sm font-bold"
                        style={{
                          color:
                            config.colors.dark,
                        }}
                        type="email"
                        autoComplete="email"
                      />
                    </div>

                    {/* PASSWORD */}

                    <label
                      className="block text-[10px] font-black uppercase tracking-widest mb-2"
                      style={{
                        color:
                          config.colors.dark,
                      }}
                    >
                      Password
                    </label>

                    <div
                      className="flex items-center gap-2 border-2 px-3 py-2.5 mb-5"
                      style={{
                        backgroundColor:
                          config.colors.background,
                        borderColor:
                          config.colors.dark,
                      }}
                    >
                      <KeyRound
                        size={16}
                        style={{
                          color:
                            config.colors.dark,
                        }}
                      />

                      <input
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="••••••••"
                        className="auth-input w-full bg-transparent outline-none text-sm font-bold"
                        style={{
                          color:
                            config.colors.dark,
                        }}
                        type="password"
                        autoComplete={
                          mode === "signup"
                            ? "new-password"
                            : "current-password"
                        }
                      />
                    </div>

                    {/* LOGIN / CREATE ACCOUNT */}

                    <button
                      onClick={
                        mode === "signup"
                          ? signUp
                          : signIn
                      }
                      disabled={
                        busy ||
                        !email.trim() ||
                        password.length < 6
                      }
                      className="w-full py-3 font-black uppercase tracking-widest text-[11px] border-2 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{
                        backgroundColor:
                          config.colors.dark,
                        borderColor:
                          config.colors.dark,
                        color:
                          config.colors.background,
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

                {/* MESSAGE */}

                {msg && (
                  <div
                    className="mt-4 text-[11px] font-black uppercase tracking-widest border-2 px-3 py-2"
                    style={{
                      backgroundColor:
                        msg.startsWith("✅")
                          ? config.colors.dark
                          : config.colors.accent,

                      color:
                        msg.startsWith("✅")
                          ? config.colors.background
                          : config.colors.dark,

                      borderColor:
                        config.colors.dark,
                    }}
                  >
                    {msg}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .auth-input::placeholder {
          color: color(display-p3 0.079 0.201 0.346);
          opacity: 0.45;
        }
      `}</style>
    </div>
  );
}