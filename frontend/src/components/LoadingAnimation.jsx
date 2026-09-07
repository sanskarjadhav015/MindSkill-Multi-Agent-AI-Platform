import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

import { LogoIcon } from "./Logo";

const LABELS = [
  "Thinking & routing...",
  "Analyzing context...",
  "Reasoning across agents...",
  "Crafting response...",
];

function LoadingAnimation() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % LABELS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 my-2"
    >
      {/* Animated icon with AI Purple glow rings */}
      <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
        {[0, 0.6, 1.2].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-xl"
            style={{
              background: "rgba(124, 58, 237, 0.12)",
              border: "1px solid rgba(124, 58, 237, 0.2)",
            }}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: [0.8, 1.5, 1.9], opacity: [0.6, 0.2, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="logo-float relative z-10 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
        >
          <LogoIcon size={30} className="rounded-xl shadow-md" />
        </motion.div>
      </div>

      {/* Clean Light Card Status label */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white text-[#0a0a0a] border border-black/10 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.span
            key={LABELS[idx]}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="text-[12.5px] font-semibold text-zinc-700"
          >
            {LABELS[idx]}
          </motion.span>
        </AnimatePresence>
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"
              animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default LoadingAnimation;