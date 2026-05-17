import { Trees } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-emerald-900/5 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-2xl font-black text-emerald-900 tracking-tighter mb-4">
              <Trees className="h-8 w-8 text-emerald-600" />
              <span>SPROUT</span>
            </div>
            <p className="max-w-xs text-zinc-500 font-medium">
              A self-contained system combining botanical intelligence, live care telemetry, and localized data caching for modern collectors.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-zinc-900 mb-4 uppercase text-xs tracking-widest">Ecosystem</h4>
            <ul className="space-y-2 text-sm font-medium text-zinc-500">
              <li><a href="/" className="hover:text-emerald-600">Home Dashboard</a></li>
              <li><a href="/discover" className="hover:text-emerald-600">Botanical Records</a></li>
              <li><a href="/match" className="hover:text-emerald-600">Species Matcher</a></li>
              <li><a href="/tracker" className="hover:text-emerald-600">Watering Monitor</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-900 mb-4 uppercase text-xs tracking-widest">Developer</h4>
            <ul className="space-y-2 text-sm font-medium text-zinc-500">
              <li><a href="#" className="hover:text-emerald-600">API Documentation</a></li>
              <li><a href="#" className="hover:text-emerald-600">System Logs</a></li>
              <li><a href="#" className="hover:text-emerald-600">Open Source</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-zinc-100 pt-8 text-center text-xs font-semibold text-zinc-400">
          &copy; {new Date().getFullYear()} Sprout Intelligence Systems. Built with code and care.
        </div>
      </div>
    </footer>
  );
}
