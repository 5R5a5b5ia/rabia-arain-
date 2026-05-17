import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Trees, ShieldCheck, CloudRain, LibraryBig } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50/50 px-4 py-1.5 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-8"
          >
            <Sparkles className="h-3 w-3" />
            Biological Intelligence
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-black text-emerald-900 sm:text-7xl tracking-tighter leading-[0.9]"
          >
            BOTANICAL DATA<br />TAILORED FOR HOME.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-8 max-w-2xl text-lg font-medium text-zinc-500"
          >
            Track plant watering intervals against live environmental metrics. 
            Discover rare species and get personalized care recommendations from 
            our server-side AI botanist.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/match"
              className="group flex items-center gap-2 rounded-full bg-emerald-900 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-900/20 transition-all hover:bg-emerald-800 hover:-translate-y-1"
            >
              Find My Perfect Match
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/discover"
              className="rounded-full border-2 border-emerald-900/10 bg-white px-8 py-4 text-base font-bold text-emerald-900 transition-all hover:bg-emerald-50"
            >
              Species Library
            </Link>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/50 blur-[120px]" />
        <div className="absolute top-1/4 right-0 -z-10 h-64 w-64 rounded-full bg-emerald-200/30 blur-[80px]" />
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<CloudRain className="h-6 w-6" />}
            title="Dynamic Climate Sync"
            description="Integrates live telemetry to track evaporation risks based on local environmental shifts."
          />
          <FeatureCard 
            icon={<LibraryBig className="h-6 w-6" />}
            title="40+ Botanical Records"
            description="Access detailed care profiles for authentic indoor species, from light bounds to soil ratios."
          />
          <FeatureCard 
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Sandboxed Isolation"
            description="Your collection data is persisted entirely in your local browser storage for maximum privacy."
          />
        </div>
      </section>
      
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="rounded-3xl border border-emerald-900/5 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-emerald-900">{title}</h3>
      <p className="text-sm font-medium text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
