import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Discover } from "./pages/Discover";
import { Matcher } from "./pages/Matcher";
import { Tracker } from "./pages/Tracker";
import { BotanistAI } from "./components/BotanistAI";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fcfdfb] text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
        <Navbar />
        <main className="relative">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/discover" element={<PageWrapper><Discover /></PageWrapper>} />
              <Route path="/match" element={<PageWrapper><Matcher /></PageWrapper>} />
              <Route path="/tracker" element={<PageWrapper><Tracker /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <BotanistAI />
      </div>
    </Router>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
