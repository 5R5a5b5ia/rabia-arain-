import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Trees } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface Message {
  role: "user" | "model";
  text: string;
}

export function BotanistAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hello! I am your Sprout Botanist AI. Ask me anything about plant care, species identification, or environmental diagnostics." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/botanist/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: "model", text: data.text }]);
      } else {
        throw new Error("No response text");
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", text: "I'm having trouble connecting to the greenhouse. Please try again soon." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="flex h-[500px] w-[calc(100vw-2rem)] sm:w-[350px] flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-2xl shadow-emerald-900/20"
          >
            <div className="flex items-center justify-between bg-emerald-900 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Trees className="h-5 w-5" />
                <span className="text-sm font-bold tracking-tight">Botanist AI</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto bg-zinc-50 p-4 space-y-4"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex flex-col gap-1 max-w-[85%]",
                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "rounded-2xl px-4 py-2 text-sm",
                    msg.role === "user" 
                      ? "bg-emerald-600 text-white rounded-tr-none" 
                      : "bg-white border border-emerald-900/5 text-zinc-700 rounded-tl-none shadow-sm"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    {msg.role === "user" ? "You" : "Botanist"}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-zinc-400 italic text-xs animate-pulse">
                  System processing...
                </div>
              )}
            </div>

            <div className="border-t bg-white p-3">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your plants..."
                  className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900 text-white transition-opacity disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900 text-white shadow-xl shadow-emerald-900/30 transition-transform active:scale-95 hover:scale-105"
        aria-label="Toggle chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
