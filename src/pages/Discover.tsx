import React, { useState } from "react";
import { Search, Info, AlertTriangle, CheckCircle2, X, Sparkles, Stethoscope, Loader2, Palmtree, Sprout, Leaf, Sun, Wind, MoveRight, Trees } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface PlantSearchResult {
  name: string;
  scientificName: string;
  waterInterval: number;
  category: string;
  careLevel: string;
  light: string;
  humidity: string;
  description: string;
  careTips: string[];
  troubleshooting: { issue: string; solution: string }[];
}

const getCategoryIcon = (category: string, className: string = "h-3 w-3") => {
  const norm = category?.toLowerCase() || "";
  if (norm.includes("succulent") || norm.includes("cacti")) return <Sprout className={className} />;
  if (norm.includes("tropical") || norm.includes("leafy")) return <Palmtree className={className} />;
  if (norm.includes("fern")) return <Leaf className={className} />;
  if (norm.includes("arid") || norm.includes("sun")) return <Sun className={className} />;
  if (norm.includes("creeper") || norm.includes("vines")) return <Wind className={className} />;
  return <Leaf className={className} />;
};

const getCareIcon = (level: string, className: string = "h-3 w-3") => {
  const norm = level?.toLowerCase() || "";
  if (norm.includes("easy")) return <Sprout className={className} />;
  if (norm.includes("intermediate")) return <Leaf className={className} />;
  if (norm.includes("expert")) return <Trees className={className} />;
  return <Sprout className={className} />;
};

export function Discover() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<PlantSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    try {
      const res = await fetch("/api/botanist/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() })
      });
      if (!res.ok) throw new Error("Botanical cloud connection failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to retrieve botanical data for this species. Please try a different specimen name.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6"
        >
            <Sparkles className="h-3 w-3" />
            AI Botanical Intelligence
        </motion.div>
        <h1 className="text-5xl sm:text-6xl font-black text-emerald-900 tracking-tighter leading-none mb-6">
          UNIVERSAL<br/>INDEX
        </h1>
        <p className="max-w-2xl mx-auto font-medium text-zinc-500 text-lg">
          Search for any botanical species on Earth. Our intelligence engine will synthesize care protocols for any specimen.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-16 px-4">
        <form onSubmit={handleSearch} className="group relative">
          <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-zinc-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search any plant (e.g. 'Blue Star Fern', 'Monstera Adansonii')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isSearching}
            className="h-20 w-full rounded-[2.5rem] border-2 border-emerald-900/5 bg-white pl-16 pr-32 text-lg font-bold outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xl shadow-emerald-900/[0.02]"
          />
          <button 
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-14 rounded-full bg-emerald-900 px-4 sm:px-8 text-sm font-black text-white hover:bg-emerald-800 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoveRight className="h-4 w-4" />}
            <span className="hidden sm:inline">{isSearching ? "ANALYZING" : "QUERY"}</span>
          </button>
        </form>
        {error && (
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center text-sm font-bold text-rose-500 flex items-center justify-center gap-2"
            >
                <AlertTriangle className="h-4 w-4" />
                {error}
            </motion.p>
        )}
      </div>

      {/* Result Section */}
      <AnimatePresence mode="wait">
        {result ? (
            <motion.div
                key={result.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full rounded-[3rem] bg-white border border-emerald-900/5 shadow-2xl shadow-emerald-900/5 overflow-hidden"
            >
                <div className="p-8 sm:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Summary Column */}
                        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-zinc-100 pb-12 lg:pb-0 lg:pr-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-20 w-20 flex items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-600 shadow-inner">
                                    {getCategoryIcon(result.category, "h-10 w-10")}
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-emerald-900 tracking-tighter leading-none">{result.name}</h2>
                                    <p className="mt-1 text-sm font-bold italic text-emerald-600/60 uppercase tracking-widest">{result.scientificName}</p>
                                </div>
                            </div>

                            <p className="text-xl font-medium text-zinc-600 leading-relaxed mb-8 italic">
                                "{result.description}"
                            </p>

                            <div className="mb-10 space-y-4 px-6 py-8 rounded-[2rem] bg-emerald-50/50 border border-emerald-100/30">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 flex items-center gap-2 px-1">
                                    <Sparkles className="h-3 w-3" />
                                    Care Tips
                                </h4>
                                <ul className="space-y-3">
                                    {result.careTips.map((tip, i) => (
                                        <li key={i} className="text-sm font-medium text-zinc-600 flex gap-3">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Sunlight" value={result.light} />
                                <DetailItem 
                                    label="Effort Level" 
                                    value={
                                        <div className="flex items-center gap-2">
                                            {getCareIcon(result.careLevel, "h-4 w-4 text-emerald-600")}
                                            {result.careLevel}
                                        </div>
                                    } 
                                />
                                <DetailItem label="Humidity" value={result.humidity} />
                                <DetailItem label="Genus Type" value={result.category} />
                                <DetailItem label="Water Cycle" value={`Every ${result.waterInterval} Days`} />
                            </div>

                            <button 
                                onClick={() => {
                                    const existing = JSON.parse(localStorage.getItem('plants') || '[]');
                                    localStorage.setItem('plants', JSON.stringify([
                                        ...existing,
                                        { id: Date.now(), name: result.name, interval: result.waterInterval, lastWatered: new Date().toISOString().split('T')[0] }
                                    ]));
                                    navigate('/tracker');
                                }}
                                className="mt-12 w-full rounded-full bg-emerald-900 py-5 text-sm font-black text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all hover:-translate-y-0.5 active:scale-95"
                            >
                                START TRACKING THIS SPECIES
                            </button>
                        </div>

                        {/* Detailed Care Column */}
                        <div className="lg:col-span-7">
                            {/* Troubleshooting */}
                            <div>
                                <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-rose-600 mb-6">
                                    <Stethoscope className="h-4 w-4" />
                                    Diagnostics
                                </h4>
                                <div className="space-y-4">
                                    {result.troubleshooting.map((item, i) => (
                                    <div key={i} className="rounded-3xl bg-zinc-50 p-6 border border-zinc-100 flex gap-4">
                                        <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-sm font-black text-emerald-900 uppercase tracking-tight mb-2">{item.issue}</p>
                                            <p className="text-base font-medium text-zinc-500 leading-relaxed">{item.solution}</p>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        ) : !isSearching && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex h-96 flex-col items-center justify-center rounded-[3rem] border-4 border-dashed border-zinc-50 text-zinc-300"
            >
               <Leaf className="mb-6 h-16 w-16 opacity-10" />
               <p className="text-xl font-bold max-w-sm text-center">Ready to analyze. Enter a botanical name above to initiate specimen retrieval.</p>
            </motion.div>
        )}

        {isSearching && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-96 flex-col items-center justify-center"
             >
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-4 border-emerald-900/5 border-t-emerald-600 animate-spin" />
                    <Palmtree className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-emerald-900" />
                </div>
                <p className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-emerald-900 animate-pulse">Syncing Botanical Cloud...</p>
             </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: string | number | React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-emerald-900/5 bg-zinc-50 p-4">
      <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{label}</span>
      <div className="text-sm font-black text-emerald-900">{value}</div>
    </div>
  );
}
