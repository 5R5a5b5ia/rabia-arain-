import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, AlertCircle, CheckCircle2, Trees, Droplets, Leaf, Sprout, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface MatchResult {
  name: string;
  reason: string;
  careLevel: string;
  light: string;
  lastWatered?: string;
}

export function Matcher() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    light: "",
    experience: "",
    environment: "",
    pets: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const getCareIcon = (level: string, className: string = "h-3 w-3") => {
    const norm = level?.toLowerCase() || "";
    if (norm.includes("easy")) return <Sprout className={className} />;
    if (norm.includes("intermediate")) return <Leaf className={className} />;
    if (norm.includes("expert")) return <Trees className={className} />;
    return <Sprout className={className} />;
  };

  const steps = [
    {
      id: 1,
      title: "Lighting Conditions",
      question: "What kind of natural light does your space receive?",
      field: "light",
      options: [
        { value: "direct", label: "Direct Sun", desc: "Huge south-facing windows", icon: "☀️" },
        { value: "indirect", label: "Bright Indirect", desc: "Well-lit room, filtered light", icon: "⛅" },
        { value: "low", label: "Low Light", desc: "North-facing or few windows", icon: "🌑" },
      ]
    },
    {
      id: 2,
      title: "Environmental Humidity",
      question: "How would you describe the air in your room?",
      field: "humidity",
      options: [
        { value: "dry", label: "Arid / Dry", desc: "Air conditioning or heaters active", icon: "🌵" },
        { value: "moderate", label: "Average", desc: "Standard household humidity", icon: "🏠" },
        { value: "humid", label: "Tropical / Humid", desc: "Bathrooms or misted spaces", icon: "💧" },
      ]
    },
    {
      id: 3,
      title: "Botanical Experience",
      question: "How much effort can you dedicate to care?",
      field: "experience",
      options: [
        { value: "beginner", label: "Low Maintenance", desc: "I value high survival rates", icon: "🌱" },
        { value: "intermediate", label: "Casual Keeper", desc: "I can mist and prune weekly", icon: "🌿" },
        { value: "expert", label: "Green Thumb", desc: "I love advanced care routines", icon: "🌴" },
      ]
    },
    {
      id: 4,
      title: "Household Dynamics",
      question: "Do you have pets or children that might nibble?",
      field: "pets",
      options: [
        { value: "restrictive", label: "Safety First", desc: "Must be non-toxic (Pet-Safe)", icon: "🐕" },
        { value: "any", label: "Open Access", desc: "Toxicity is not a concern", icon: "🏠" },
      ]
    }
  ];

  async function getRecommendation() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/botanist/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      });
      if (!response.ok) throw new Error("Scientific analysis failed");
      const data: MatchResult[] = await response.json();
      
      // Simulate last watered date (relative to today)
      const enhancedData = data.map(res => {
        const lastWateredDaysAgo = Math.floor(Math.random() * 5);
        const date = new Date();
        date.setDate(date.getDate() - lastWateredDaysAgo);
        return {
          ...res,
          lastWatered: date.toISOString().split('T')[0]
        };
      });

      setResults(enhancedData);
      setStep(5);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const addToTracker = (plant: MatchResult) => {
    const existing = JSON.parse(localStorage.getItem('plants') || '[]');
    localStorage.setItem('plants', JSON.stringify([
      ...existing,
      { 
        id: Date.now(), 
        name: plant.name, 
        interval: plant.careLevel === 'Expert' ? 3 : plant.careLevel === 'Intermediate' ? 7 : 14, 
        lastWatered: plant.lastWatered || new Date().toISOString().split('T')[0] 
      }
    ]));
    navigate('/tracker');
  };

  const currentStepData = steps.find(s => s.id === step);

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 font-black text-xl">
          {step <= 4 ? step : <CheckCircle2 className="h-6 w-6" />}
        </div>
        <h1 className="text-4xl font-black text-emerald-900 tracking-tighter leading-tight uppercase">Perfect Specimen Matcher</h1>
        <p className="mt-2 font-medium text-zinc-500 italic">"The right plant in the right place is art."</p>
      </div>

      <div className="relative min-h-[400px] overflow-hidden rounded-[2.5rem] border border-emerald-900/5 bg-white p-8 sm:p-12 shadow-2xl shadow-emerald-900/5">
        <AnimatePresence mode="wait">
          {step <= 4 ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div>
                <motion.h2 
                    key={`title-${step}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-black uppercase tracking-[0.3em] text-emerald-600 mb-2"
                >
                    {currentStepData?.title}
                </motion.h2>
                <motion.h3 
                    key={`q-${step}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-extrabold text-emerald-900 tracking-tight"
                >
                    {currentStepData?.question}
                </motion.h3>
              </div>

              <div className="grid gap-4">
                {currentStepData?.options.map((opt, i) => (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={opt.value}
                    onClick={() => {
                        setAnswers(prev => ({ ...prev, [currentStepData.field]: opt.value }));
                    }}
                    className={cn(
                        "group flex items-center justify-between gap-4 p-6 rounded-3xl border-2 transition-all text-left relative overflow-hidden",
                        answers[currentStepData.field as keyof typeof answers] === opt.value
                            ? "border-emerald-900 bg-emerald-50/50 shadow-[0_8px_30px_rgb(6,78,59,0.1)]"
                            : "border-zinc-100 bg-white hover:border-emerald-200"
                    )}
                  >
                    <div className="flex items-center gap-6 relative z-10">
                        <span className="text-4xl filter drop-shadow-sm">{opt.icon}</span>
                        <div>
                            <span className="block font-black text-emerald-900 tracking-tight transition-colors">{opt.label}</span>
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{opt.desc}</span>
                        </div>
                    </div>
                    {answers[currentStepData.field as keyof typeof answers] === opt.value && (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 animate-in zoom-in relative z-10" />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-8">
                <button
                  onClick={() => setStep(prev => Math.max(1, prev - 1))}
                  disabled={step === 1 || isLoading}
                  className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-emerald-900 disabled:opacity-0 transition-all font-sans"
                >
                  Back
                </button>
                <button
                  disabled={!answers[currentStepData?.field as keyof typeof answers] || isLoading}
                  onClick={() => {
                      if (step === 4) getRecommendation();
                      else setStep(step + 1);
                  }}
                  className="flex items-center gap-3 rounded-full bg-emerald-900 px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-900/30 transition-all hover:bg-emerald-800 hover:scale-[1.02] active:scale-95 disabled:opacity-30"
                >
                  {isLoading ? "Consulting Botanist AI..." : step === 4 ? "Analyze Result" : "Continue"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
                <div className="text-center mb-8">
                    <Sparkles className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-black text-emerald-900 tracking-tighter uppercase">AI Biological Matches</h2>
                    <p className="text-sm font-medium text-zinc-500 mt-2">Specimens optimized for your local environmental profile.</p>
                </div>

                <div className="grid gap-6">
                    {results?.map((res, i) => (
                        <div key={i} className="rounded-3xl border border-emerald-900/5 bg-zinc-50 p-6 shadow-sm group">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-2xl font-extrabold text-emerald-900 tracking-tight">{res.name}</h3>
                                <div className="flex items-center gap-2 rounded-full bg-emerald-900 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest">
                                    {getCareIcon(res.careLevel, "h-3 w-3")}
                                    {res.careLevel}
                                </div>
                            </div>
                            <p className="text-base font-medium text-zinc-600 leading-relaxed mb-6 italic">
                                "{res.reason}"
                            </p>
                            <div className="flex items-center justify-between border-t border-zinc-100 pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                                        <Trees className="h-3 w-3" />
                                        Ideal Light: {res.light}
                                    </div>
                                    {res.lastWatered && (
                                        <div className="flex items-center gap-2 text-[10px] font-black text-sky-600 uppercase tracking-[0.2em]">
                                            <Droplets className="h-3 w-3" />
                                            Last Hydration: {res.lastWatered}
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => addToTracker(res)}
                                    className="flex items-center gap-2 rounded-full bg-white border border-emerald-900/10 px-6 py-3 text-xs font-black uppercase tracking-widest text-emerald-900 shadow-sm transition-all hover:bg-emerald-900 hover:text-white"
                                >
                                    <Plus className="h-3 w-3" />
                                    Add To Tracker
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={() => {
                            setStep(1);
                            setAnswers({ light: "", experience: "", environment: "", pets: "" });
                            setResults(null);
                        }}
                        className="rounded-full border-2 border-emerald-900/10 px-8 py-4 text-sm font-black uppercase tracking-widest text-emerald-900 hover:bg-zinc-50 transition-colors"
                    >
                        Reset Journey
                    </button>
                    <Link 
                        to="/discover"
                        className="rounded-full bg-emerald-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all text-center"
                    >
                        Browse All Records
                    </Link>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
