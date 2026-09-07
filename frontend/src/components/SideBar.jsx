import React, { useEffect, useState } from "react";
import { Coins, LogOut, MessageSquare, Plus, Sparkles, User2, X } from "lucide-react";
import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import { setConversations, setSelectedConversation } from "../redux/conversationslice";
import { setMessages, setArtifacts } from "../redux/messageSlice";
import logOut from "../features/logOut";
import { setUserdata } from "../redux/userSlice";
import Logo from "./Logo";
import BillingDrawer from "./BillingDrawer";
import { motion, AnimatePresence } from "motion/react";

function SideBar() {
  const [open, setOpen] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector((s) => s.conversation);
  const { userData } = useSelector((s) => s.user);
  const uid = userData?.userId || userData?._id;

  useEffect(() => { setImageError(false); }, [userData?.avatar]);

  useEffect(() => {
    const load = async () => {
      const data = await getConversations();
      if (Array.isArray(data)) dispatch(setConversations(data));
    };
    if (uid) load();
  }, [uid, dispatch]);

  const newChat = () => {
    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
    dispatch(setArtifacts([]));
    setOpen(false);
  };

  const selectConv = (conv) => {
    dispatch(setSelectedConversation(conv));
    setOpen(false);
  };

  const handleLogout = async () => {
    try { await logOut(); } catch (e) {}
    dispatch(setUserdata(null));
    dispatch(setSelectedConversation(null));
    dispatch(setConversations([]));
    dispatch(setMessages([]));
    dispatch(setArtifacts([]));
    setOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-black/[0.08]">
        <div className="flex items-center gap-2">
          <Logo iconSize={36} showSubtitle={true} variant="light" />
          {userData?.plan && (
            <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
              {userData.plan}
            </span>
          )}
        </div>
        {/* Close button on mobile */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden p-1 rounded-lg cursor-pointer border-none bg-transparent text-zinc-500 hover:text-[#0a0a0a]"
        >
          <X size={18} />
        </button>
      </div>

      {/* New Chat Button: High-Impact CTA */}
      <div className="px-3 py-3">
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={newChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold cursor-pointer border-none transition-all bg-[#000000] text-white hover:bg-[#1a1a1a] shadow-md hover:shadow-lg"
        >
          <Plus size={15} />
          <span>New Chat</span>
        </motion.button>
      </div>

      {/* Recents label */}
      <div className="px-4 pt-1 pb-1.5 flex items-center justify-between">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-zinc-400">
          Recent Chats
        </span>
        {conversations?.length > 0 && (
          <span className="text-[10px] text-zinc-400 font-mono">
            {conversations.length}
          </span>
        )}
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1 [scrollbar-width:none]">
        {(!conversations || conversations.length === 0) ? (
          <div className="py-10 text-center">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center">
              <MessageSquare size={16} className="text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-500 font-medium">No chats yet</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Start a fresh conversation</p>
          </div>
        ) : (
          conversations.map((conv, i) => {
            const isActive = selectedConversation?._id === conv?._id;
            return (
              <button
                key={conv?._id || i}
                onClick={() => selectConv(conv)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer border-none text-xs font-medium ${
                  isActive
                    ? "bg-purple-500/10 text-purple-700 font-semibold border-l-2 border-[#7c3aed]"
                    : "bg-transparent text-zinc-600 hover:text-[#0a0a0a] hover:bg-black/[0.03]"
                }`}
              >
                <MessageSquare
                  size={14}
                  className={`shrink-0 ${isActive ? "text-[#7c3aed]" : "text-zinc-400"}`}
                />
                <span className="truncate">{conv?.title || "New Chat"}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Footer: Clean Light Card for User Profile */}
      <div className="p-3 border-t border-black/[0.08]">
        {userData ? (
          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-black/10 shadow-sm">
            <div className="shrink-0">
              {userData?.avatar && !imageError ? (
                <img
                  src={userData.avatar}
                  alt="Avatar"
                  onError={() => setImageError(true)}
                  className="w-8 h-8 rounded-xl object-cover border border-black/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#7c3aed]">
                  <User2 size={15} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-bold truncate text-[#0a0a0a]">
                {userData?.name || "User"}
              </p>
              <p className="text-[11px] flex items-center gap-1 text-zinc-500">
                <Coins size={11} className="text-[#eab308]" />
                <span className="text-[#eab308] font-bold">{userData?.credits ?? 0}</span>
                <span>credits</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowBilling(true)}
                title="Billing & Upgrade"
                className="p-1.5 rounded-lg cursor-pointer border-none bg-amber-500/10 hover:bg-amber-500/20 text-[#eab308] transition-all"
              >
                <Coins size={14} />
              </button>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg cursor-pointer border-none bg-transparent hover:bg-black/[0.04] text-zinc-400 hover:text-zinc-700 transition-all"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-zinc-500">Not signed in</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] h-screen shrink-0 border-r border-black/[0.08] bg-[#fafafa]">
        <SidebarContent />
        <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col lg:hidden border-r border-black/[0.08] bg-[#fafafa] shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div id="sidebar-toggle-ref" data-open={open} style={{ display: "none" }} />
      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />

      {/* Global open function via ref */}
      {React.createElement("span", {
        ref: (el) => {
          if (el) el.openSidebar = () => setOpen(true);
          if (typeof window !== "undefined") window.__openSidebar = () => setOpen(true);
        },
        style: { display: "none" }
      })}
    </>
  );
}

export default SideBar;