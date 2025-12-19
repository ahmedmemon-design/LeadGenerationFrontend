import React from "react";
import { motion } from "framer-motion";

// This component shows a full-screen, fancy intro animation. It runs on mount and calls onFinish()
// when the animation completes so you can remove it (and avoid replaying it while in-app).
export default function IntroOverlay({ onFinish = () => {} }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.6 } },
  };

  const letter = {
    hidden: { y: 40, opacity: 0, rotate: 6 },
    show: { y: 0, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {}}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-indigo-50 to-indigo-100"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-col items-center gap-6"
        onAnimationComplete={() => {
          // small timeout so the fade out looks smooth
          setTimeout(onFinish, 550);
        }}
      >
        <motion.div className="flex items-end text-5xl md:text-6xl font-extrabold tracking-tight">
          {Array.from("LeadGen").map((ch, i) => (
            <motion.span key={i} variants={letter} className="inline-block">
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
          className="h-1 w-40 bg-indigo-600 rounded"
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-gray-700"
        >
          Fast • Reliable • Delightful
        </motion.p>
      </motion.div>
    </motion.div>
  );
}