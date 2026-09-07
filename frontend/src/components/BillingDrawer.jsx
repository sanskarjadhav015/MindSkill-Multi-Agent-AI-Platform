import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Coins, Crown, Sparkles, X, Zap } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";
import { setUserdata } from "../redux/userSlice";

/**
 * ============================================================================
 * BILLING & SUBSCRIPTION DRAWER COMPONENT (`BillingDrawer.jsx`)
 * ============================================================================
 * Master Bento Dark Palette:
 * - Bento Black (#0E0E12), Bento Surface (#16161A), Border Dark (border-white/10)
 * - Amber/Gold (#EAB308) credit badges & glowing balance indicators
 * - Electric Emerald (#10B981) perks checklist
 * - AI Purple (#7C3AED) high-impact checkout CTA
 * ============================================================================
 */
function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [upgradingPlan, setUpgradingPlan] = useState(null);

  // Initiates Razorpay Order and opens modal
  const handleUpgrade = async (plan) => {
    try {
      setUpgradingPlan(plan);
      const data = await createOrder(plan);

      if (!data?.order?.id) {
        console.error("Failed to create Razorpay order:", data);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "MindSkill",
        description: `${data?.plan?.name || plan} Plan`,
        order_id: data?.order?.id,

        handler: async (response) => {
          try {
            // Cryptographic server-side verification
            const paymentData = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (paymentData?.success) {
              if (paymentData?.user) {
                dispatch(setUserdata(paymentData.user));
              } else {
                dispatch(
                  setUserdata({
                    ...userData,
                    plan: paymentData?.plan?.id || plan,
                    credits:
                      (userData?.credits || 0) +
                      (paymentData?.plan?.credits || 0),
                    totalCredits:
                      (userData?.totalCredits || 0) +
                      (paymentData?.plan?.credits || 0),
                  })
                );
              }

              onClose();
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Upgrade error:", error);
    } finally {
      setUpgradingPlan(null);
    }
  };

  const currentCredits = userData?.credits ?? 0;
  const totalCredits = userData?.totalCredits || 100;

  const creditPercentage = Math.min(
    Math.round((currentCredits / (totalCredits || 1)) * 100),
    100
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* Slide-over Drawer: Bento Black */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[460px] flex-col border-l border-white/10 bg-[#0e0e12] text-white shadow-2xl"
          >
            {/* Header: Bento Surface */}
            <div className="flex items-center justify-between border-b border-white/10 p-5 shrink-0 bg-[#16161a]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#eab308] glow-gold">
                  <Crown size={18} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Billing & Credits</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/15 text-[#eab308] border border-amber-500/30 px-2 py-0.5 rounded-full">
                      PRO
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Manage balance, credits & upgrades
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer border-none"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 [scrollbar-width:none]">
              
              {/* Current Status: Dark Bento Card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e0e11] via-[#16161a] to-[#0e0e11] p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider">
                      Current Subscription
                    </span>
                    <h3 className="text-xl font-extrabold capitalize text-white flex items-center gap-2 mt-0.5">
                      <span>{userData?.plan || "Free"} Tier</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                        Active
                      </span>
                    </h3>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#7c3aed] glow-purple">
                    <Sparkles size={18} />
                  </div>
                </div>

                {/* Meter with Gold / Amber Accent */}
                <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Coins size={13} className="text-[#eab308]" />
                      <span>Available Credits</span>
                    </span>
                    <span className="font-bold text-white">
                      <span className="text-[#eab308]">{currentCredits}</span>{" "}
                      <span className="text-zinc-500 font-normal">/ {totalCredits}</span>
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.07] border border-white/[0.04]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#eab308] transition-all duration-500"
                      style={{ width: `${creditPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Upgrade Tier
                </h4>

                {/* Starter Plan */}
                <div className="relative rounded-3xl border border-white/10 bg-[#16161a] hover:border-white/20 p-5 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        Starter Plan
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Perfect for lightweight tasks & fast prototyping
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-white">
                        ₹199
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-medium">one-time payment</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-zinc-300 border-t border-white/[0.08] pt-3.5">
                    <div className="flex items-center gap-2.5">
                      <Check size={14} className="text-[#10b981] shrink-0" />
                      <span><strong>500</strong> Autonomous Generation Credits</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={14} className="text-[#10b981] shrink-0" />
                      <span>Full access to Coding, Vision & PDF Agents</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={14} className="text-[#10b981] shrink-0" />
                      <span>Live Sandbox & Monaco Code Editor</span>
                    </div>
                  </div>

                  <button
                    disabled={upgradingPlan === "starter"}
                    className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 py-2.5 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50"
                    onClick={() => handleUpgrade("starter")}
                  >
                    {upgradingPlan === "starter" ? (
                      <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Upgrade to Starter</span>
                    )}
                  </button>
                </div>

                {/* Pro Plan: Dark Bento Card with Glow */}
                <div className="relative rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#0e0e11] via-[#16161a] to-[#0e0e11] p-5 shadow-2xl glow-purple">
                  <div className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#6366f1] px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                    Recommended
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                        <span>Pro Power</span>
                        <Zap size={14} className="text-[#eab308] fill-[#eab308]" />
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Unlimited creativity for heavy creators & developers
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-[#7c3aed]">
                        ₹499
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-medium">one-time payment</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-zinc-300 border-t border-white/[0.08] pt-3.5">
                    <div className="flex items-center gap-2.5">
                      <Check size={14} className="text-[#10b981] shrink-0" />
                      <span><strong>1000</strong> Autonomous Generation Credits</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={14} className="text-[#10b981] shrink-0" />
                      <span>All 8 Specialized AI Agents Unlocked</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={14} className="text-[#10b981] shrink-0" />
                      <span>High priority vector RAG computation</span>
                    </div>
                  </div>

                  <button
                    disabled={upgradingPlan === "pro"}
                    className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] py-3 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-purple-500/30 border-none disabled:opacity-50"
                    onClick={() => handleUpgrade("pro")}
                  >
                    {upgradingPlan === "pro" ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Upgrade to Pro Now</span>
                    )}
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;