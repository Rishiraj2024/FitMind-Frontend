import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Apple, Dumbbell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { aiApi } from "../../services/api";

export default function AICoachModal({ isOpen, onClose }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! I'm your AI fitness coach. I noticed your recovery score is 92%. Ready to crush today's Upper Body workout?" }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await aiApi.chatWithAI(userMsg.content);
      
      const aiMsg = { 
        role: "ai", 
        content: response.reply 
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-blue/10 to-purple/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue text-white flex items-center justify-center shadow-lg shadow-blue/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">FitMind AI</h2>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-gradient-to-r from-cyan to-blue-500 text-black font-semibold rounded-tr-sm shadow-md" 
                        : "bg-neutral-900 text-white rounded-tl-sm border border-white/10 shadow-inner"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-cyan flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>FitMind AI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                <button 
                  onClick={() => setInput("What should I eat before my workout?")}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-blue hover:border-blue transition-colors flex items-center gap-1"
                >
                  <Apple className="w-3 h-3" /> Pre-workout meal?
                </button>
                <button 
                  onClick={() => setInput("How can I improve my bench press?")}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-blue hover:border-blue transition-colors flex items-center gap-1"
                >
                  <Dumbbell className="w-3 h-3" /> Improve bench press
                </button>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full pl-4 pr-12 py-3 bg-muted rounded-xl border border-transparent focus:bg-transparent focus:border-blue outline-none transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-blue text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-2 text-center flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                <Sparkles className="w-3 h-3" /> AI can make mistakes. Verify important info.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
