import { Check, Copy, ExternalLink, XIcon } from "lucide-react";
import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { motion, AnimatePresence } from "motion/react";

function MessageBubble({ role, content, images }) {
  const isUser = role === "user";
  const [lightBox, setLightBox] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [copiedMsg, setCopiedMsg] = useState(false);
  let codeCount = 0;

  const copyText = async (text, setter) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const t = document.createElement("textarea");
        t.value = text;
        t.style.position = "fixed";
        t.style.opacity = "0";
        document.body.appendChild(t);
        t.focus();
        t.select();
        document.execCommand("copy");
        document.body.removeChild(t);
      }
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {}
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-1.5 group`}>
      <div
        className={`break-words overflow-hidden text-[13.5px] leading-relaxed transition-all ${
          isUser
            ? "max-w-[75%] bg-[#7c3aed] text-white rounded-[20px] rounded-br-[4px] px-4.5 py-3 shadow-md shadow-purple-500/20 font-normal"
            : "w-full max-w-full bg-white text-[#0a0a0a] border border-black/10 rounded-2xl rounded-tl-[4px] px-5 py-4 shadow-sm"
        }`}
      >
        {/* Images */}
        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mb-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setLightBox(img)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                alt="Uploaded or generated visual"
                className={`w-44 h-32 object-cover rounded-xl cursor-zoom-in transition-transform hover:scale-[1.02] ${
                  isUser ? "border border-white/20" : "border border-black/10"
                }`}
              />
            ))}
          </div>
        )}

        {/* Markdown Render */}
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1
                className={`text-lg font-bold mt-4 mb-2 pb-1.5 border-b ${
                  isUser ? "text-white border-white/20" : "text-[#0a0a0a] border-black/10"
                }`}
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2
                className={`text-base font-bold mt-3 mb-1.5 ${
                  isUser ? "text-white" : "text-[#0a0a0a]"
                }`}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                className={`text-[14px] font-semibold mt-2.5 mb-1 ${
                  isUser ? "text-white/95" : "text-purple-700"
                }`}
              >
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-2 last:mb-0 whitespace-pre-wrap break-words leading-relaxed">
                {children}
              </p>
            ),
            blockquote: ({ children }) => (
              <blockquote
                className={`pl-3.5 py-1.5 my-2.5 italic border-l-2 ${
                  isUser
                    ? "border-white/40 text-white/80"
                    : "border-[#7c3aed] text-zinc-600 bg-purple-500/[0.04] rounded-r-lg"
                }`}
              >
                {children}
              </blockquote>
            ),
            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>,
            table: ({ children }) => (
              <div className="overflow-x-auto my-3 rounded-xl border border-black/10">
                <table className="min-w-full text-left text-xs">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="px-3.5 py-2 font-semibold uppercase tracking-wider text-[10.5px] bg-[#fafafa] text-[#0a0a0a] border-b border-black/10">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3.5 py-2 border-t border-black/[0.06] text-zinc-700">
                {children}
              </td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-0.5 font-medium underline underline-offset-2 transition-colors ${
                  isUser ? "text-white hover:text-purple-200" : "text-[#6366f1] hover:text-[#7c3aed]"
                }`}
              >
                {children}
                <ExternalLink size={11} className="shrink-0" />
              </a>
            ),
            code: ({ className, children }) => {
              const val = String(children).trim();
              if (!className) {
                return (
                  <code
                    className={`px-1.5 py-0.5 rounded-md font-mono text-[12px] font-medium ${
                      isUser
                        ? "bg-white/20 text-white"
                        : "bg-purple-500/10 text-purple-700 border border-purple-500/20"
                    }`}
                  >
                    {val}
                  </code>
                );
              }

              const idx = codeCount++;
              const lang = className?.replace("language-", "");

              return (
                <div className="my-3.5 overflow-hidden rounded-2xl bg-[#0e0e12] border border-white/10 shadow-lg text-white">
                  {/* Code Header: Bento Surface */}
                  <div className="flex items-center justify-between px-4 py-2 bg-[#16161a] border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                        {lang || "code"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyText(val, (v) => setCopiedIdx(v ? idx : null))}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg cursor-pointer border-none transition-all font-semibold ${
                        copiedIdx === idx
                          ? "bg-emerald-500/15 text-[#10b981] border border-emerald-500/30"
                          : "bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 border border-white/10"
                      }`}
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check size={11} className="text-[#10b981]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Block */}
                  <SyntaxHighlighter
                    language={lang}
                    style={atomOneDark}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: "16px 18px",
                      background: "#0e0e12",
                      fontSize: "12.5px",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                    lineNumberStyle={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}
                  >
                    {val}
                  </SyntaxHighlighter>
                </div>
              );
            },
            img: ({ src, alt }) =>
              src ? (
                <img
                  src={src}
                  alt={alt || "Message preview"}
                  onClick={() => setLightBox(src)}
                  loading="lazy"
                  onError={(e) => e.currentTarget.remove()}
                  className="rounded-2xl max-h-80 object-contain my-2.5 cursor-zoom-in border border-black/10 shadow-sm"
                />
              ) : null,
          }}
        >
          {content}
        </Markdown>

        {/* Assistant Footer: Copy Full Answer */}
        {!isUser && content && (
          <div className="flex items-center justify-end mt-3 pt-2.5 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={() => copyText(content, setCopiedMsg)}
              className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-xl cursor-pointer border-none transition-all font-medium ${
                copiedMsg
                  ? "bg-emerald-500/15 text-[#10b981] border border-emerald-500/30"
                  : "bg-black/[0.03] hover:bg-black/[0.06] text-zinc-500 hover:text-[#0a0a0a] border border-black/[0.06]"
              }`}
            >
              {copiedMsg ? (
                <>
                  <Check size={11} className="text-[#10b981]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Copy text</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightBox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setLightBox(null)}
          >
            <button
              className="absolute top-5 right-5 p-2.5 rounded-full cursor-pointer border-none bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={() => setLightBox(null)}
            >
              <XIcon size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              src={lightBox}
              alt="Expanded Preview"
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain border border-white/20 shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MessageBubble;