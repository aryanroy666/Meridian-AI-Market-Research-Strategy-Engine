import { Link, useNavigate } from "react-router-dom";
import { LogOut, Compass, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import Footer from "./Footer";


// LOGO
import logo from "../assets/MK_Logo.png";

export default function Shell({ children }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const initials = (user?.user_metadata?.full_name || user?.email || "?")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`sticky top-0 z-40 border-b border-line/80 bg-paper/95 backdrop-blur
          `}
      >
        <div className="mx-auto flex items-center justify-between px-6 py-4 md:px-7 xl:px-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2.5"
            >
              <motion.span
                whileHover={{
                  scale: 1.08,
                  rotate: 4,
                }}
                transition={{ duration: 0.2 }}
                className="  flex h-10 w-10 items-center justify-center rounded-xs  font-mono text-xs font-medium "
              >
                {/* <Compass size={16} strokeWidth={2} /> */}
                <img src={logo} alt="Meridian" className="h-full w-full object-cover" />
              </motion.span>

              <div className="flex flex-col">
                <span className="font-display font-semibold text-[16px] tracking-tight text-ink">
                  Meridian
                </span>

                <span className="hidden font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-ink sm:inline">
                  Strategy Engine
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Right side */}
          <div
            className="flex items-center gap-3 sm:gap-4"
          >


            {/* <div
              className="hidden text-right sm:block"
            >
              <p className="text-sm leading-none text-ink">
                {user?.user_metadata?.full_name || "Analyst"}
              </p>

              <p className="mt-1 text-xs leading-none text-ink-muted">
                {user?.email}
              </p>
            </div> */}


            {/* Theme toggle */}
            <motion.button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.92,
              }}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-line text-ink-soft transition hover:border-ink/30 hover:text-ink"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.10 }}
              >
                {theme === "light" ? (
                  <Moon size={17} />
                ) : (
                  <Sun size={17} />
                )}
              </motion.div>
            </motion.button>

            {/* User avatar */}
            <motion.div
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.95,
              }}

              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.12 }}
              className="flex h-9 w-9 cursor-default items-center justify-center rounded-full bg-gray-700 font-mono text-xs font-medium text-gray-100"

              title={user?.user_metadata?.full_name || "Analyst"}
            >
              {initials}
            </motion.div>

            {/* Sign out */}
            <motion.button
              onClick={handleSignOut}


              whileHover={{
                x: 3,
              }}
              whileTap={{
                x: 0,
                scale: 0.97,
              }}

              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-400/80 px-3 py-2 text-xs font-medium text-ink-soft transition hover:border-ink/70 hover:text-ink"
            >
              <LogOut size={14} />

              <span className="hidden sm:inline">
                Sign out
              </span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Page content */}
      <motion.main
        className="flex-1 "
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay: 0.15,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
}