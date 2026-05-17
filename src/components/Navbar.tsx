import { Link, useLocation } from "react-router-dom";
import { Leaf, Search, Trees, LayoutDashboard, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Leaf },
    { name: "Discover", path: "/discover", icon: Search },
    { name: "Perfect Match", path: "/match", icon: Sparkles },
    { name: "My Garden", path: "/tracker", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/5 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-emerald-900 tracking-tighter">
          <Trees className="h-6 w-6 text-emerald-600" />
          <span>SPROUT</span>
        </Link>

        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-semibold transition-colors hover:text-emerald-600",
                location.pathname === item.path ? "text-emerald-700" : "text-zinc-500"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/tracker"
            className="hidden sm:inline-flex rounded-full bg-emerald-900 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-800 hover:-translate-y-0.5 active:translate-y-0"
          >
            Open Tracker
          </Link>
        </div>
      </div>
    </header>
  );
}
