import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./messagebubble";
import LoadingAnimation from "./LoadingAnimation";
import { Code2, FileText, Globe, Sparkles, ImageIcon, Presentation, Bot, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { LogoIcon } from "./Logo";

function MessageList() {
  const { messages, isLoading, loadingConversationId } = useSelector((s) => s.message);
  const { selectedConversation } = useSelector((s) => s.conversation);
  const bottomRef = useRef(null);

  const currentConvId = selectedConversation?._id || "new";
  const shouldShowLoading = isLoading && (!loadingConversationId || loadingConversationId === currentConvId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, shouldShowLoading]);

  const cards = [
    {
      icon: Code2,
      tag: "Coding",
      color: "#7c3aed",
      bgSoft: "bg-purple-500/10",
      borderSoft: "border-purple-500/20",
      title: "Interactive Web Apps",
      desc: "Full HTML/CSS/JS applications with live sandbox preview"
    },
    {
      icon: ImageIcon,
      tag: "Vision",
      color: "#6366f1",
      bgSoft: "bg-indigo-500/10",
      borderSoft: "border-indigo-500/20",
      title: "Generative Vision",
      desc: "High fidelity AI images and diagrams generated on demand"
    },
    {
      icon: FileText,
      tag: "PDF / RAG",
      color: "#10b981",
      bgSoft: "bg-emerald-500/10",
      borderSoft: "border-emerald-500/20",
      title: "Document Intelligence",
      desc: "Deep semantic vector search and extraction across documents"
    },
    {
      icon: Globe,
      tag: "Search",
      color: "#3b82f6",
      bgSoft: "bg-blue-500/10",
      borderSoft: "border-blue-500/20",
      title: "Real-time Research",
      desc: "Synthesize fresh data and citations live from the web"
    },
    {
      icon: Bot,
      tag: "Multi-Agent",
      color: "#7c3aed",
      bgSoft: "bg-purple-500/10",
      borderSoft: "border-purple-500/20",
      title: "Autonomous Dialogue",
      desc: "Multi-turn context reasoning with automatic tool routing"
    },
    {
      icon: Presentation,
      tag: "Slides",
      color: "#eab308",
      bgSoft: "bg-amber-500/10",
      borderSoft: "border-amber-500/20",
      title: "Decks & Reports",
      desc: "Auto-structured pitch presentations and structured briefings"
    },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto px-4 md:px-6 py-6 [scrollbar-width:thin]">
      {(!messages || messages.length === 0) && !shouldShowLoading ? (
        <div className="h-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* AI Highlight Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles size={13} className="text-[#7c3aed]" />
              MindSkill Multi-Agent Orchestrator
            </div>

            {/* Logo & Headline */}
            <div className="flex flex-col items-center gap-3">
              <motion.div className="logo-float">
                <LogoIcon size={56} className="shadow-xl rounded-2xl" />
              </motion.div>
              <div>
                <div className="flex items-baseline justify-center">
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a]">
                    MindSkill
                  </h1>
                  <span className="text-3xl font-extrabold text-[#7C3AED] ml-1">AI</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 mt-0.5">
                  STUDIO
                </p>
                <p className="text-sm mt-2 text-zinc-500 max-w-md mx-auto">
                  What would you like to build, generate, or research today?
                </p>
              </div>
            </div>

            {/* Bento Grid: Clean Light Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full mt-2 text-left">
              {cards.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                    whileHover={{ y: -2 }}
                    className="p-4 rounded-2xl cursor-default transition-all bg-white text-[#0a0a0a] border border-black/10 shadow-sm hover:shadow-md hover:border-purple-500/30 group relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${c.bgSoft} border ${c.borderSoft}`}
                      >
                        <Icon size={14} style={{ color: c.color }} />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${c.bgSoft} border ${c.borderSoft}`}
                        style={{ color: c.color }}
                      >
                        {c.tag}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[13.5px] font-bold text-[#0a0a0a] group-hover:text-purple-700 transition-colors">
                        {c.title}
                      </p>
                      <ArrowUpRight size={13} className="text-zinc-300 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <p className="text-[11.5px] mt-1 text-zinc-500 leading-relaxed">
                      {c.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {messages?.map((msg, i) => (
              <motion.div
                key={msg?._id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageBubble role={msg?.role} content={msg?.content} images={msg?.images || []} />
              </motion.div>
            ))}
          </AnimatePresence>
          {shouldShowLoading && <LoadingAnimation />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}

export default MessageList;