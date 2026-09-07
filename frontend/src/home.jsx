import { signInWithPopup } from "firebase/auth";
import api from "../utils/axios";
import { auth, googleProvider } from "../utils/firebase";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata } from "./redux/userSlice";
import SideBar from "./components/SideBar.jsx";
import ChatArea from "./components/ChatArea.jsx";
import Artifact from "./components/Artifact.jsx";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { LogoIcon } from "./components/Logo";

function Home() {
  const { userData } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleGoogleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserdata(data));
    } catch (e) {
      console.error(e);
    }
  };

  const googleLogin = async () => {
    try {
      setLoggingIn(true);
      const data = await signInWithPopup(auth, googleProvider);
      const token = await data.user.getIdToken();
      await handleGoogleLogin(token);
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#fafafa] text-[#0a0a0a]">
      <SideBar />
      <ChatArea />
      <Artifact />

      <AnimatePresence>
        {!userData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md rounded-3xl p-8 bg-gradient-to-br from-[#0e0e11] via-[#16161a] to-[#0e0e11] text-white border border-white/10 shadow-2xl glow-purple relative overflow-hidden"
            >
              {/* Subtle radial glow inside card */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Top Badge */}
              <div className="flex justify-center mb-5">
                <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                  <Sparkles size={12} className="text-[#7c3aed]" />
                  Autonomous AI Orchestration
                </span>
              </div>

              {/* Logo & Headline */}
              <div className="flex flex-col items-center gap-3 mb-6 text-center">
                <motion.div className="logo-float">
                  <LogoIcon size={54} className="shadow-2xl glow-purple rounded-2xl" />
                </motion.div>
                <div>
                  <div className="flex items-baseline justify-center">
                    <h2 className="text-2xl font-extrabold tracking-tight text-white">MindSkill</h2>
                    <span className="text-2xl font-extrabold text-[#7C3AED] ml-0.5">AI</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 mt-0.5">
                    STUDIO
                  </p>
                  <p className="text-xs text-zinc-400 mt-2">
                    Multi-Agent Intelligence & Realtime Sandbox Workspace
                  </p>
                </div>
              </div>

              {/* Bento Feature Points */}
              <div className="space-y-2.5 mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                {[
                  { text: "8 Specialized Autonomous Agents", icon: Zap, color: "#7c3aed" },
                  { text: "Live Interactive Code Sandbox & Preview", icon: CheckCircle2, color: "#10b981" },
                  { text: "Vector RAG PDF & Web Intelligence", icon: ShieldCheck, color: "#6366f1" }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color}20` }}>
                        <Icon size={12} style={{ color: item.color }} />
                      </div>
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Google Button */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                disabled={loggingIn}
                onClick={googleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-60 bg-white text-[#0a0a0a] hover:bg-zinc-100 shadow-xl border-none"
              >
                {loggingIn ? (
                  <div className="w-4 h-4 border-2 rounded-full animate-spin border-zinc-400 border-t-[#7c3aed]" />
                ) : (
                  <>
                    <FcGoogle size={20} />
                    <span>Continue with Google</span>
                  </>
                )}
              </motion.button>

              <p className="text-[11px] text-center mt-4 text-zinc-500">
                Secure access · Instant credits · No credit card required
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;