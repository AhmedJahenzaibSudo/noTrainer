"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const MENU_ITEMS = [
  { label: "HOME", href: "/", bg: "#FFE500" },
  { label: "CALCULATORS", href: "/calculators", bg: "#00F58C" },
  { label: "WIZARD", href: "/wizard", bg: "#7EE8FA" },
  { label: "ABOUT", href: "/about", bg: "#FF6B4A" },
  { label: "CONTACT", href: "/contact", bg: "#B197FC" },
];

export default function BrutalMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const currentIndex = MENU_ITEMS.findIndex(
    (item) => item.href === pathname
  );

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(
    currentIndex !== -1 ? currentIndex : 0
  );
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleNavigate = useCallback(
    (href) => {
      if (pathname === href) {
        setOpen(false);
        return;
      }

      setExiting(true);
      setTimeout(() => {
        setOpen(false);
        setExiting(false);
        router.push(href);
      }, 350);
    },
    [pathname, router]
  );

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed top-6 left-6 z-[100] h-14 w-14 rounded-full border-[3px] border-black bg-white shadow-[4px_4px_0px_black] flex items-center justify-center transition-transform hover:scale-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <X size={28} strokeWidth={4} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Menu size={28} strokeWidth={4} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1], // fast-out brutal curve
            }}
            className="fixed inset-0 z-[90] flex items-center overflow-hidden"
          >
            {/* Background */}
            <motion.div
              animate={{
                backgroundColor: MENU_ITEMS[active]?.bg || "#fff",
              }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            />

            <nav className="relative z-10 w-full">
              <ul className="ml-10 md:ml-24 space-y-2">
                {MENU_ITEMS.map((item, i) => {
                  const isCurrent = pathname === item.href;

                  return (
                    <li key={item.label} onMouseEnter={() => setActive(i)}>
                      <button
                        onClick={() => handleNavigate(item.href)}
                        className="group relative flex items-center"
                      >
                        <span className="absolute -left-16 opacity-0 -translate-x-6 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block">
                          <ArrowRight size={56} strokeWidth={6} />
                        </span>

                        <div className="transition-transform duration-200 group-hover:translate-x-3">
                          <span
                            className="text-[clamp(2.5rem,12vw,9rem)] font-black leading-[0.85] tracking-tighter uppercase transition-all duration-200"
                            style={{
                              color: isCurrent ? "#000" : "#555",
                              opacity: isCurrent ? 1 : 0.5,
                            }}
                          >
                            {item.label}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Exit Wipe */}
            <AnimatePresence>
              {exiting && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 origin-left bg-black z-[110]"
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
