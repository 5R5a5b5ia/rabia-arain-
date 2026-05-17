import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Search, Trees, LayoutDashboard, Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: Leaf },
    { name: "Discover", path: "/discover", icon: Search },
    { name: "Perfect Match", path: "/match", icon: Sparkles },
    { name: "My Garden", path: "/tracker", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-emerald-900/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          to="/" 
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2 text-2xl font-black text-emerald-900 tracking-tighter"
        >
          <Trees className="h-8 w-8 text-emerald-600" />
          <span>SPROUT</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 text-sm font-black uppercase tracking-widest transition-all rounded-full hover:bg-emerald-50",
                location.pathname === item.path ? "text-emerald-700 bg-emerald-50/50" : "text-zinc-500"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/tracker"
            className="hidden sm:inline-flex rounded-full bg-emerald-900 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-800 hover:-translate-y-0.5 active:translate-y-0"
          >
            Open Tracker
          </Link>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex p-2 text-emerald-900 md:hidden transition-colors hover:bg-emerald-50 rounded-xl"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white border-b border-emerald-900/5 md:hidden"
          >
            <div className="flex flex-col gap-1 p-4 pb-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl p-4 text-sm font-black uppercase tracking-widest transition-all",
                    location.pathname === item.path 
                      ? "bg-emerald-900 text-white shadow-lg shadow-emerald-900/10" 
                      : "text-zinc-500 hover:bg-emerald-50 hover:text-emerald-700"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <Link
                to="/tracker"
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center justify-center rounded-2xl bg-emerald-50 p-4 text-sm font-black uppercase tracking-widest text-emerald-900"
              >
                Launch Tracker
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
