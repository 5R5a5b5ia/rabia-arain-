import React, { useState, useEffect } from "react";
import { Plus, Trash2, Droplets, Calendar, AlertCircle, LayoutGrid, List, Clock, BellRing, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface UserPlant {
  id: number;
  name: string;
  interval: number;
  lastWatered: string;
  reminderAt?: string;
}

export function Tracker() {
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [interval, setInterval] = useState(7);
  const [reminderAt, setReminderAt] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const saved = localStorage.getItem('plants');
    if (saved) setPlants(JSON.parse(saved));

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Background checker for reminders
    const intervalId = setInterval(() => {
      const now = new Date();
      const currentPlants = JSON.parse(localStorage.getItem('plants') || '[]');
      
      currentPlants.forEach((plant: UserPlant) => {
        if (plant.reminderAt) {
          const reminderTime = new Date(plant.reminderAt);
          if (now >= reminderTime) {
            // Trigger notification
            if (Notification.permission === "granted") {
              new Notification("Botanical Care Alert", {
                body: `It is time to tend to your ${plant.name}. Hydration cycle is now active.`,
                icon: "/logo.png"
              });
            }

            // Clear the specific reminder to prevent double notification
            // but normally we might want to schedule the NEXT one based on interval
            // For now, let's just clear it as requested "specific date and time"
            const updatedPlants = currentPlants.map((p: UserPlant) => 
              p.id === plant.id ? { ...p, reminderAt: undefined } : p
            );
            localStorage.setItem('plants', JSON.stringify(updatedPlants));
            setPlants(updatedPlants);
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  function savePlants(newPlants: UserPlant[]) {
    setPlants(newPlants);
    localStorage.setItem('plants', JSON.stringify(newPlants));
  }

  function addPlant() {
    if (!name.trim()) return;
    const newPlant: UserPlant = {
      id: Date.now(),
      name: name.trim(),
      interval,
      lastWatered: new Date().toISOString().split('T')[0],
      reminderAt: reminderAt || undefined
    };
    savePlants([...plants, newPlant]);
    setName("");
    setReminderAt("");
    setIsAdding(false);
  }

  function waterPlant(id: number) {
    savePlants(plants.map(p => p.id === id ? { 
      ...p, 
      lastWatered: new Date().toISOString().split('T')[0] 
    } : p));
  }

  function deletePlant(id: number) {
    savePlants(plants.filter(p => p.id !== id));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-emerald-900 tracking-tighter leading-none">MY GARDEN</h1>
          <p className="mt-2 font-medium text-zinc-500">Localized care telemetry for your collection.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="flex bg-zinc-100 p-1 rounded-xl">
             <button 
                onClick={() => setView("grid")}
                className={cn("p-2 rounded-lg transition-all", view === "grid" ? "bg-white text-emerald-700 shadow-sm" : "text-zinc-400")}
             >
               <LayoutGrid className="h-5 w-5" />
             </button>
             <button 
                onClick={() => setView("list")}
                className={cn("p-2 rounded-lg transition-all", view === "list" ? "bg-white text-emerald-700 shadow-sm" : "text-zinc-400")}
             >
               <List className="h-5 w-5" />
             </button>
           </div>
           <button 
             onClick={() => setIsAdding(true)}
             className="flex items-center gap-2 rounded-full bg-emerald-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-800 transition-all active:scale-95"
           >
             <Plus className="h-4 w-4" />
             New Specimen
           </button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-emerald-900/10 backdrop-blur-sm"
                onClick={() => setIsAdding(false)}
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl"
            >
               <h2 className="text-2xl font-black text-emerald-900 tracking-tighter mb-6 uppercase">Initial Config</h2>
               <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">Common Name</label>
                      <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Living Room Monstera"
                        className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 font-bold outline-none focus:border-emerald-500"
                      />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          Watering Rhythm
                        </label>
                        <select 
                          value={interval}
                          onChange={(e) => setInterval(Number(e.target.value))}
                          className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 font-bold outline-none focus:border-emerald-500 appearance-none"
                        >
                          <option value={1}>Daily</option>
                          <option value={3}>Frequent (3 days)</option>
                          <option value={7}>Weekly (7 days)</option>
                          <option value={14}>Bi-Weekly (14 days)</option>
                          <option value={30}>Monthly (30 days)</option>
                        </select>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2 flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          Care Reminder
                        </label>
                        <input 
                          type="datetime-local"
                          value={reminderAt}
                          onChange={(e) => setReminderAt(e.target.value)}
                          className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 font-bold outline-none focus:border-emerald-500"
                        />
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                      <Info className="h-4 w-4 text-blue-500 shrink-0" />
                      <p className="text-[10px] font-medium text-blue-700 leading-tight">
                        Botanical care telemetry will trigger a browser alert at this specific time. Ensure notifications are enabled.
                      </p>
                   </div>

                   <button 
                        onClick={addPlant}
                        disabled={!name.trim()}
                        className="mt-4 w-full rounded-full bg-emerald-900 py-4 text-sm font-black text-white shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-transform disabled:opacity-50"
                   >
                       REGISTER SPECIMEN
                   </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={cn(
        "grid gap-6",
        view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
      )}>
        {plants.map(plant => (
          <PlanCard 
            key={plant.id} 
            plant={plant} 
            view={view}
            onWater={() => waterPlant(plant.id)}
            onDelete={() => deletePlant(plant.id)}
          />
        ))}

        {plants.length === 0 && (
          <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-emerald-900/5 text-zinc-300">
             <Droplets className="mb-4 h-12 w-12 opacity-20" />
             <p className="max-w-[200px] text-center font-bold">No biological telemetry active. Start tracking a new specimen.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({ plant, onWater, onDelete, view }: { plant: UserPlant, onWater: () => void, onDelete: () => void, view: "grid" | "list", key?: React.Key }) {
  const lastDate = new Date(plant.lastWatered);
  const nextDate = new Date(lastDate);
  nextDate.setDate(lastDate.getDate() + plant.interval);
  const today = new Date();
  today.setHours(0,0,0,0);
  nextDate.setHours(0,0,0,0);

  const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = diffDays < 0;
  const isDueToday = diffDays === 0;

// Calculate progress percentage
  const totalDays = plant.interval;
  const elapsedDays = Math.max(0, totalDays - diffDays);
  const progressPercent = Math.min(100, (elapsedDays / totalDays) * 100);
  const hydrationLevel = Math.max(0, 100 - Math.round(progressPercent));

  return (
    <motion.div 
      layout
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-emerald-900/5 bg-white transition-all hover:shadow-xl hover:shadow-emerald-900/5",
        view === "list" ? "flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 p-6" : "flex flex-col p-6"
      )}
    >
      <div className={cn(
          "flex items-center gap-4",
          view === "list" ? "md:flex-1 w-full" : "mb-6"
      )}>
        <motion.div 
            animate={{ 
                backgroundColor: isOverdue ? "#fff1f2" : isDueToday ? "#fffbeb" : "#ecfdf5",
                color: isOverdue ? "#e11d48" : isDueToday ? "#d97706" : "#059669",
                scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-inner shrink-0"
            )}
        >
          {isOverdue ? "⚠️" : "🌱"}
        </motion.div>
        <div>
          <h3 className="text-xl font-extrabold text-emerald-900 leading-none tracking-tight">{plant.name}</h3>
          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            {isOverdue 
              ? `${Math.abs(diffDays)}d overdue` 
              : isDueToday 
                ? "Hydration due today" 
                : `${diffDays} days until next cycle`}
          </p>
        </div>
      </div>

      <div className={cn(
          "w-full space-y-6",
          view === "list" ? "flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 lg:space-y-0" : ""
      )}>
        {/* Next Watering Visualization */}
        <div className={cn("flex items-center gap-6", view === "list" ? "lg:flex-1" : "py-4")}>
          <div className="relative h-16 w-12 shrink-0">
             <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 24 32" className="h-full w-full fill-white stroke-zinc-100 stroke-2">
                    <path d="M12 2C12 2 4 11 4 18C4 22.4183 7.58172 26 12 26C16.4183 26 20 22.4183 20 18C20 11 12 2 12 2Z" />
                </svg>
             </div>
             <div className={cn("absolute inset-0 flex items-center justify-center overflow-hidden", `[clip-path:url(#dropletClip-${plant.id})]`)}>
                <svg viewBox="0 0 24 32" className="h-full w-full">
                    <defs>
                        <clipPath id={`dropletClip-${plant.id}`}>
                            <path d="M12 2C12 2 4 11 4 18C4 22.4183 7.58172 26 12 26C16.4183 26 20 22.4183 20 18C20 11 12 2 12 2Z" />
                        </clipPath>
                    </defs>
                    <motion.rect 
                        initial={{ height: "0%" }}
                        animate={{ height: `${hydrationLevel}%` }}
                        transition={{ type: "spring", bounce: 0, duration: 1.5 }}
                        x="0" 
                        y={32 - (32 * (hydrationLevel / 100))}
                        width="24" 
                        height="32" 
                        className={cn(
                            "transition-colors",
                            hydrationLevel < 20 ? "fill-rose-400" : hydrationLevel < 50 ? "fill-amber-400" : "fill-blue-400"
                        )}
                    />
                </svg>
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-[10px] font-black text-white mix-blend-difference">{hydrationLevel}%</span>
             </div>
          </div>

          <div className="flex-1 space-y-1">
             <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">Biological Reserves</span>
             <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${hydrationLevel}%` }}
                        className={cn(
                            "h-full transition-colors",
                            hydrationLevel < 20 ? "bg-rose-500" : hydrationLevel < 50 ? "bg-amber-500" : "bg-blue-500"
                        )}
                    />
                </div>
             </div>
             <p className="text-[9px] font-bold text-zinc-500 flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5 opacity-30" />
                Next refresh: {nextDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
             </p>
          </div>
        </div>

        <div className={cn("grid grid-cols-2 gap-4", view === "list" ? "lg:mx-8 grow-0 shrink-0 lg:w-64" : "mb-6")}>

            <div className="rounded-2xl bg-zinc-50 p-3 border border-zinc-100">
                <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Telemetry Status</span>
                <span className={cn(
                    "text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block",
                    diffDays <= 0 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                )}>
                    {diffDays <= 0 ? "Critical" : "Nominal"}
                </span>
            </div>
            {plant.reminderAt ? (
              <div className="rounded-2xl bg-amber-50 p-3 border border-amber-100">
                  <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1 flex items-center gap-1">
                    <BellRing className="h-2 w-2" />
                    Care Alert
                  </span>
                  <span className="text-xs font-black text-amber-600">
                    {new Date(plant.reminderAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
              </div>
            ) : (
                <div className="rounded-2xl bg-zinc-50 p-3 border border-zinc-100 text-center sm:text-left">
                    <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Next Sync</span>
                    <span className="text-xs font-bold text-zinc-600">In {Math.max(0, diffDays)}d</span>
                </div>
            )}
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={onWater}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-xl py-4 text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                  isOverdue ? "bg-rose-600 text-white shadow-rose-900/10 hover:bg-rose-700" : 
                  isDueToday ? "bg-amber-500 text-white shadow-amber-900/10 hover:bg-amber-600" : 
                  "bg-emerald-900 text-white shadow-emerald-900/10 hover:bg-emerald-800"
                )}
            >
                <Droplets className="h-3.5 w-3.5" />
                Refresh
            </button>
            <button 
                onClick={() => {
                  if (window.confirm(`Are you sure you want to remove the ${plant.name} specimen from your records?`)) {
                    onDelete();
                  }
                }}
                className="rounded-xl border border-zinc-100 p-4 text-zinc-300 transition-all hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
      </div>
      
      {(isOverdue || isDueToday) && (
          <div className={cn(
              "absolute top-6 right-6 h-2 w-2 rounded-full animate-pulse",
              isOverdue ? "bg-rose-500" : "bg-amber-500"
          )} />
      )}
    </motion.div>
  );
}
