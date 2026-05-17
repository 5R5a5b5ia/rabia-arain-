import React, { useState, useMemo } from "react";
import { Search, Filter, Info, AlertTriangle, CheckCircle2, X, Sparkles, Stethoscope, Loader2, Palmtree, Sprout, Leaf, Sun, Wind } from "lucide-react";
import { PLANT_DATABASE, PlantSpecies } from "../lib/plants";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

const getCategoryIcon = (category: string, className: string = "h-3 w-3") => {
  switch (category) {
    case "Succulent": return <Sprout className={className} />;
    case "Tropical": return <Palmtree className={className} />;
    case "Fern": return <Leaf className={className} />;
    case "Arid": return <Sun className={className} />;
    case "Creeper": return <Wind className={className} />;
    default: return <Leaf className={className} />;
  }
};

export function Discover() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    light: "All",
    care: "All",
    nontoxic: false
  });
  const [selectedPlant, setSelectedPlant] = useState<PlantSpecies | null>(null);
  const [plantTips, setPlantTips] = useState<{ careTips: string[], troubleshooting: { issue: string, solution: string }[] } | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);

  React.useEffect(() => {
    if (selectedPlant) {
      fetchTips(selectedPlant);
    } else {
      setPlantTips(null);
    }
  }, [selectedPlant]);

  async function fetchTips(plant: PlantSpecies) {
    setLoadingTips(true);
    try {
      const res = await fetch("/api/botanist/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plantName: plant.name, scientificName: plant.scientificName })
      });
      if (!res.ok) throw new Error("Failed to fetch tips");
      const data = await res.json();
      setPlantTips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTips(false);
    }
  }

  const filteredPlants = useMemo(() => {
    return PLANT_DATABASE.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.scientificName.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filters.category === "All" || p.category === filters.category;
      const matchLight = filters.light === "All" || p.light === filters.light;
      const matchCare = filters.care === "All" || p.careLevel === filters.care;
      const matchToxic = !filters.nontoxic || !p.toxic;
      return matchSearch && matchCategory && matchLight && matchCare && matchToxic;
    });
  }, [search, filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-emerald-900 tracking-tighter leading-none">SPECIES INDEX</h1>
          <p className="mt-2 font-medium text-zinc-500">40+ analyzed specimens in our cloud database.</p>
        </div>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search records by name or genus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-emerald-900/10 bg-white pl-12 pr-4 text-sm font-medium outline-none focus:border-emerald-600 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
          <FilterSection title="Category">
            {["All", "Succulent", "Tropical", "Fern", "Arid", "Creeper"].map(c => (
              <FilterChip 
                key={c} 
                active={filters.category === c} 
                onClick={() => setFilters(f => ({ ...f, category: c }))}
              >
                <div className="flex items-center gap-2">
                  {c !== "All" && getCategoryIcon(c, "h-3 w-3 opacity-50")}
                  {c}
                </div>
              </FilterChip>
            ))}
          </FilterSection>

          <FilterSection title="Light Requirement">
            {["All", "Low", "Medium", "High"].map(l => (
              <FilterChip 
                key={l} 
                active={filters.light === l} 
                onClick={() => setFilters(f => ({ ...f, light: l }))}
              >
                {l}
              </FilterChip>
            ))}
          </FilterSection>

          <FilterSection title="Care Level">
            {["All", "Easy", "Intermediate", "Expert"].map(l => (
              <FilterChip 
                key={l} 
                active={filters.care === l} 
                onClick={() => setFilters(f => ({ ...f, care: l }))}
              >
                {l}
              </FilterChip>
            ))}
          </FilterSection>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-900/5 bg-emerald-50/30 p-4">
            <input 
              type="checkbox" 
              id="nontoxic" 
              checked={filters.nontoxic}
              onChange={(e) => setFilters(f => ({ ...f, nontoxic: e.target.checked }))}
              className="h-5 w-5 rounded accent-emerald-600"
            />
            <label htmlFor="nontoxic" className="text-sm font-bold text-emerald-900 cursor-pointer select-none underline decoration-emerald-200 underline-offset-4">
              Pet & Child Safe Only
            </label>
          </div>
        </div>

        {/* Plant Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPlants.map(plant => (
                <motion.div
                  layout
                  key={plant.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative overflow-hidden rounded-3xl border border-emerald-900/5 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-900/5 cursor-pointer"
                  onClick={() => setSelectedPlant(plant)}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                      plant.careLevel === "Easy" ? "bg-emerald-100 text-emerald-700" :
                      plant.careLevel === "Intermediate" ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    )}>
                      {plant.careLevel}
                    </span>
                    {plant.toxic ? (
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-emerald-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {plant.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold italic text-zinc-400">
                    {plant.scientificName}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-50 pt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-tighter">
                      <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        {getCategoryIcon(plant.category)}
                      </div>
                      {plant.category}
                    </div>
                    <button className="rounded-full bg-zinc-100 p-2 text-zinc-400 transition-colors hover:bg-emerald-900 hover:text-white">
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filteredPlants.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-900/5 text-zinc-400">
              <Search className="mb-2 h-8 w-8 opacity-20" />
              <p className="font-bold">No specimen matches these query parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Details */}
      <AnimatePresence>
        {selectedPlant && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-900/20 backdrop-blur-sm"
              onClick={() => setSelectedPlant(null)}
            />
            <motion.div
              layoutId={selectedPlant.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl overflow-y-auto max-h-[90vh] rounded-[2.5rem] bg-white shadow-2xl custom-scrollbar"
            >
              <div className="absolute right-6 top-6">
                <button 
                  onClick={() => setSelectedPlant(null)}
                  className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-16 w-16 flex items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                    {getCategoryIcon(selectedPlant.category, "h-8 w-8")}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-emerald-900 tracking-tighter leading-none">{selectedPlant.name}</h2>
                    <p className="mt-1 text-sm font-bold italic text-emerald-600/60 uppercase tracking-widest">{selectedPlant.scientificName}</p>
                  </div>
                </div>

                <p className="text-lg font-medium text-zinc-600 leading-relaxed mb-10 italic">
                  "{selectedPlant.description}"
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Sunlight" value={selectedPlant.light} />
                  <DetailItem label="Humidity" value={selectedPlant.category === "Tropical" || selectedPlant.category === "Fern" ? "High" : "Low"} />
                  <DetailItem label="Pet Safe" value={selectedPlant.toxic ? "No (Toxic)" : "Yes (Non-toxic)"} />
                  <DetailItem label="Water Cycle" value={`Every ${selectedPlant.waterInterval} Days`} />
                </div>

                <div className="mt-10 space-y-8 border-t border-zinc-100 pt-10">
                  {/* Advanced Care Tips */}
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">
                      <Sparkles className="h-3 w-3" />
                      Advanced Care Directives
                    </h4>
                    {loadingTips ? (
                      <div className="flex items-center gap-3 py-4 text-zinc-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-widest">Consulting Botanical Cloud...</span>
                      </div>
                    ) : plantTips ? (
                      <ul className="space-y-3">
                        {plantTips.careTips.map((tip, i) => (
                          <li key={i} className="flex gap-3 text-sm font-medium text-zinc-600 leading-relaxed">
                            <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs font-bold text-zinc-400 italic">Care protocols currently unavailable.</p>
                    )}
                  </div>

                  {/* Troubleshooting */}
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-rose-600 mb-4">
                      <Stethoscope className="h-3 w-3" />
                      Diagnostic Troubleshooting
                    </h4>
                    {loadingTips ? (
                      <div className="flex items-center gap-3 py-4 text-zinc-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-widest">Analyzing Failure Vectors...</span>
                      </div>
                    ) : plantTips ? (
                      <div className="space-y-4">
                        {plantTips.troubleshooting.map((item, i) => (
                          <div key={i} className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                            <p className="text-xs font-black text-emerald-900 uppercase tracking-tight mb-1">{item.issue}</p>
                            <p className="text-sm font-medium text-zinc-500 leading-relaxed">{item.solution}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-zinc-400 italic">Diagnostic database offline.</p>
                    )}
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button 
                    onClick={() => {
                        const existing = JSON.parse(localStorage.getItem('plants') || '[]');
                        localStorage.setItem('plants', JSON.stringify([
                           ...existing,
                           { id: Date.now(), name: selectedPlant.name, interval: selectedPlant.waterInterval, lastWatered: new Date().toISOString().split('T')[0] }
                        ]));
                        setSelectedPlant(null);
                        window.location.href = '/tracker';
                    }}
                    className="flex-1 rounded-full bg-emerald-900 py-4 text-sm font-black text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all hover:-translate-y-0.5"
                  >
                    ADD TO MY COLLECTION
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="group">
      <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-emerald-700 transition-colors">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

function FilterChip({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void, key?: React.Key }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl px-4 py-2 text-xs font-bold transition-all border",
        active 
          ? "bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/20" 
          : "bg-white text-zinc-500 border-zinc-100 hover:border-emerald-200 hover:bg-zinc-50"
      )}
    >
      {children}
    </button>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-900/5 bg-zinc-50/50 p-4">
      <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{label}</span>
      <span className="text-sm font-black text-emerald-900">{value}</span>
    </div>
  );
}
