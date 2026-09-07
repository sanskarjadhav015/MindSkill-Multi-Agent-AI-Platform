import {
  Code2,
  File,
  FileTextIcon,
  Globe,
  ImageIcon,
  MessagesSquare,
  Mic,
  Paperclip,
  Presentation,
  Send,
  Sparkles,
  X,
  ZapIcon,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import sendMessage from "../features/sendMessage";
import { useDispatch, useSelector, useStore } from "react-redux";
import { addMessage, setArtifacts, setIsLoading } from "../redux/messageSlice";
import { createConversation } from "../features/createConversation";
import { addConversation, setConvTitle, setSelectedConversation } from "../redux/conversationslice";
import { updateConversation } from "../features/updateConversation";
import getCurrentUser from "../features/getCurrentUser";
import { setUserdata } from "../redux/userSlice";
import { motion, AnimatePresence } from "motion/react";

function Chatinput() {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("auto");
  const [loading, setLoading] = useState(false);
  const { selectedConversation } = useSelector((s) => s.conversation);
  const dispatch = useDispatch();
  const store = useStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  useEffect(() => () => { if (recRef.current) recRef.current.stop(); }, []);

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    try {
      const r = new SR();
      r.lang = "en-US";
      r.continuous = false;
      r.interimResults = false;
      r.onstart = () => setListening(true);
      r.onresult = (e) =>
        setValue((p) => (p ? p + " " + e.results[0][0].transcript : e.results[0][0].transcript));
      r.onerror = () => setListening(false);
      r.onend = () => setListening(false);
      recRef.current = r;
      r.start();
    } catch {
      setListening(false);
    }
  };

  const handleSend = async () => {
    if (loading || (!value.trim() && !selectedFile)) return;
    let conv = selectedConversation;

    if (!conv) {
      const c = await createConversation();
      dispatch(setSelectedConversation(c));
      dispatch(addConversation(c));
      conv = c;
    }

    const targetConvId = conv._id;

    if (conv?.title === "New Chat") {
      const t = (value.trim() || selectedFile?.name || "Chat").slice(0, 40);
      await updateConversation({ id: conv._id, title: t });
      dispatch(setConvTitle({ conversationId: conv._id, title: t }));
    }

    const fd = new FormData();
    fd.append("prompt", value.trim());
    fd.append("conversationId", targetConvId);
    fd.append("agent", selectedAgent);
    if (selectedFile) fd.append("file", selectedFile);

    // Prepare user message display
    const promptText = value.trim();
    let displayContent = promptText;
    let localImages = [];

    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        const localImgUrl = URL.createObjectURL(selectedFile);
        localImages.push(localImgUrl);
        displayContent = promptText ? `${promptText}\n\n*[Attached Image: ${selectedFile.name}]*` : `*[Attached Image: ${selectedFile.name}]*`;
      } else {
        displayContent = promptText ? `${promptText}\n\n📄 **Attached Document:** \`${selectedFile.name}\`` : `📄 **Attached Document:** \`${selectedFile.name}\``;
      }
    }

    dispatch(addMessage({
      role: "user",
      content: displayContent,
      images: localImages
    }));

    setValue("");
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setLoading(true);
    dispatch(setIsLoading({ isLoading: true, conversationId: targetConvId }));

    try {
      const data = await sendMessage(fd);

      // Check if user is still on the conversation where message was sent
      const currentSelected = store.getState().conversation.selectedConversation;
      const isStillOnSameConv = !currentSelected || currentSelected?._id === targetConvId;

      if (isStillOnSameConv) {
        if (data && data.answer) {
          if (data.artifacts && data.artifacts.length > 0) {
            dispatch(setArtifacts(data.artifacts));
          }
          dispatch(addMessage({ role: "assistant", content: data.answer, images: data.images }));
        } else {
          dispatch(addMessage({
            role: "assistant",
            content: "⚠️ Failed to receive response from MindSkill. Please check if your file is valid and try again."
          }));
        }
      }

      const up = await getCurrentUser();
      if (up) dispatch(setUserdata(up));
    } catch (err) {
      console.error("[ChatInput] Send error:", err);
      dispatch(addMessage({
        role: "assistant",
        content: `⚠️ An error occurred while processing: ${err?.message || "Network Error"}. Please try again.`
      }));
    } finally {
      setLoading(false);
      dispatch(setIsLoading({ isLoading: false, conversationId: null }));
    }
  };

  const agents = [
    { id: "auto",   icon: ZapIcon,        label: "Auto Router" },
    { id: "chat",   icon: MessagesSquare, label: "Chat" },
    { id: "coding", icon: Code2,          label: "Coding" },
    { id: "pdf",    icon: FileTextIcon,   label: "PDF Vector" },
    { id: "ppt",    icon: Presentation,   label: "Slide Deck" },
    { id: "vision", icon: ImageIcon,      label: "Vision AI" },
    { id: "search", icon: Globe,          label: "Web Search" },
  ];

  const hasContent = Boolean(value.trim() || selectedFile);

  return (
    <div className="px-4 md:px-6 pb-5 pt-2 shrink-0 bg-[#fafafa]">
      <div className="max-w-3xl mx-auto">
        {/* Main Input Bento Box */}
        <div
          className="rounded-2xl p-3 transition-all bg-white text-[#0a0a0a] border border-black/10 shadow-sm focus-within:border-purple-500/50 focus-within:shadow-[0_0_25px_-5px_rgba(124,58,237,0.15)]"
        >
          {/* Agent selection pills */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-1.5 px-0.5 [scrollbar-width:none]"
          >
            {agents.map(({ id, icon: Icon, label }) => {
              const active = selectedAgent === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedAgent(id)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-semibold cursor-pointer border-none transition-all ${
                    active
                      ? "bg-[#7c3aed] text-white shadow-sm shadow-purple-500/25"
                      : "bg-black/[0.04] hover:bg-black/[0.07] text-zinc-600 hover:text-[#0a0a0a]"
                  }`}
                >
                  <Icon size={12} className={active ? "text-white" : "text-zinc-500"} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* File Attachment Chip */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 mx-0.5"
              >
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/[0.03] border border-black/10">
                  {selectedFile.type === "application/pdf" ? (
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-600">
                      <FileTextIcon size={13} />
                    </div>
                  ) : selectedFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="preview"
                      className="h-6 w-6 rounded-lg object-cover border border-black/10"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-purple-500/10 text-[#7c3aed]">
                      <File size={13} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold truncate max-w-[200px] text-[#0a0a0a]">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {Math.ceil(selectedFile.size / 1024)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border-none bg-black/[0.06] hover:bg-black/[0.1] text-zinc-600 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Input Area */}
          <textarea
            rows={2}
            placeholder={
              loading
                ? "Agent is reasoning & generating..."
                : "Ask MindSkill, create code, generate images, or attach PDFs..."
            }
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (hasContent && !loading) handleSend();
              }
            }}
            value={value}
            disabled={loading}
            className="w-full resize-none bg-transparent px-1 pt-2.5 text-[14px] leading-relaxed placeholder:text-zinc-400 disabled:opacity-50 text-[#0a0a0a]"
            style={{ outline: "none" }}
          />

          {/* Controls Bar */}
          <div className="flex items-center justify-between px-0.5 pt-1.5 border-t border-black/[0.04]">
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                ref={fileRef}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setSelectedFile(f);
                }}
              />
              <button
                type="button"
                title="Attach Document or Image"
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.value = "";
                    fileRef.current.click();
                  }
                }}
                className="flex items-center justify-center w-8 h-8 rounded-xl cursor-pointer border-none transition-all bg-transparent hover:bg-black/[0.04] text-zinc-500 hover:text-[#0a0a0a]"
              >
                <Paperclip size={15} />
              </button>

              <button
                type="button"
                onClick={toggleMic}
                title={listening ? "Stop recording" : "Voice input"}
                className={`flex items-center justify-center w-8 h-8 rounded-xl cursor-pointer border-none transition-all ${
                  listening
                    ? "bg-rose-500/10 text-rose-600 animate-pulse"
                    : "bg-transparent hover:bg-black/[0.04] text-zinc-500 hover:text-[#0a0a0a]"
                }`}
              >
                <Mic size={15} />
              </button>
            </div>

            {/* High-Impact CTA Button */}
            <motion.button
              type="button"
              disabled={!hasContent || loading}
              onClick={handleSend}
              whileHover={hasContent && !loading ? { scale: 1.04 } : {}}
              whileTap={hasContent && !loading ? { scale: 0.96 } : {}}
              className={`flex items-center justify-center gap-1.5 h-8 px-3 rounded-xl border-none cursor-pointer transition-all text-xs font-bold ${
                hasContent && !loading
                  ? "bg-[#000000] text-white hover:bg-[#1a1a1a] shadow-sm"
                  : "bg-black/[0.05] text-zinc-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={13} />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        <p className="text-center text-[11px] mt-2.5 text-zinc-400">
          MindSkill Multi-Agent Engine · Verify generated code & answers
        </p>
      </div>
    </div>
  );
}

export default Chatinput;