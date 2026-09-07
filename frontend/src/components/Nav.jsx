import { Menu, MessageSquare, Sparkles } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import Logo from "./Logo";

function Nav() {
  const { selectedConversation } = useSelector((s) => s.conversation);
  const { messages } = useSelector((s) => s.message);

  const openSidebar = () => {
    if (typeof window !== "undefined" && window.__openSidebar) window.__openSidebar();
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0 bg-white/80 backdrop-blur-md border-b border-black/[0.08] z-20">
      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={openSidebar}
          aria-label="Open sidebar"
          className="lg:hidden p-2 rounded-xl text-zinc-600 hover:text-[#0a0a0a] hover:bg-black/[0.04] transition-colors cursor-pointer border-none bg-transparent"
        >
          <Menu size={18} />
        </button>

        {selectedConversation ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <MessageSquare size={13} className="text-[#7c3aed]" />
            </div>
            <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-[420px] text-[#0a0a0a] tracking-tight">
              {selectedConversation?.title || "New Chat"}
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Logo iconSize={26} showSubtitle={false} variant="light" />
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold text-purple-600 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              v2.0
            </span>
          </div>
        )}
      </div>

      {/* Right: message count & status */}
      <div className="flex items-center gap-2">
        {selectedConversation && (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 bg-black/[0.04] text-zinc-600 border border-black/[0.08]">
            {messages?.length || 0} {messages?.length === 1 ? "message" : "messages"}
          </span>
        )}
      </div>
    </header>
  );
}

export default Nav;