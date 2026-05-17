import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Discover } from "./pages/Discover";
import { Matcher } from "./pages/Matcher";
import { Tracker } from "./pages/Tracker";
import { BotanistAI } from "./components/BotanistAI";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-[#fcfdfb] text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      <Navbar />
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/discover" element={<PageWrapper><Discover /></PageWrapper>} />
              <Route path="/match" element={<PageWrapper><Matcher /></PageWrapper>} />
              <Route path="/tracker" element={<PageWrapper><Tracker /></PageWrapper>} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BotanistAI />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
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
